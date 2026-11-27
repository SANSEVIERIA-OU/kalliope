// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.1
//! The `plural=` expression of a gettext `Plural-Forms` header: read it, evaluate it, and write it as Rust for the table
//! the build generates. It is the C expression language gettext uses (`n != 1`, `n%10==1 && n%100!=11 ? 0 : …`): numbers,
//! `n`, `+ - * / %`, `< > <= >=`, `== !=`, `&& ||`, `!`, parentheses and `?:`. A comparison is 1 or 0, like in C.

#[derive(Debug, Clone, PartialEq)]
pub enum Expr {
    N,
    Num(i64),
    Not(Box<Expr>),
    Bin(&'static str, Box<Expr>, Box<Expr>),
    Cond(Box<Expr>, Box<Expr>, Box<Expr>),
}

/// The header `nplurals=N; plural=EXPRESSION;` as the number of forms and the expression.
pub fn header(text: &str) -> Result<(usize, Expr), String> {
    let mut nplurals = None;
    let mut plural = None;
    for part in text.split(';') {
        if let Some((key, value)) = part.split_once('=') {
            match key.trim() {
                "nplurals" => nplurals = value.trim().parse::<usize>().ok(),
                "plural" => plural = Some(value.trim().to_string()),
                _ => {}
            }
        }
    }
    let (Some(nplurals), Some(plural)) = (nplurals, plural) else {
        return Err(format!(
            "Plural-Forms «{text}» is not «nplurals=N; plural=EXPRESSION;»"
        ));
    };
    if nplurals == 0 {
        return Err("Plural-Forms: nplurals is zero".into());
    }
    let expr = parse(&plural)?;
    Ok((nplurals, expr))
}

pub fn parse(text: &str) -> Result<Expr, String> {
    let mut p = Parser {
        t: text.as_bytes(),
        i: 0,
    };
    let e = p.cond()?;
    p.space();
    if p.i != p.t.len() {
        return Err(format!(
            "plural expression «{text}»: unexpected «{}»",
            &text[p.i..]
        ));
    }
    Ok(e)
}

struct Parser<'a> {
    t: &'a [u8],
    i: usize,
}

impl Parser<'_> {
    fn space(&mut self) {
        while self.i < self.t.len() && self.t[self.i].is_ascii_whitespace() {
            self.i += 1;
        }
    }

    fn eat(&mut self, op: &str) -> bool {
        self.space();
        if self.t[self.i..].starts_with(op.as_bytes()) {
            self.i += op.len();
            true
        } else {
            false
        }
    }

    /// An operator that must not be the start of a longer one (`<` of `<=`, `=`…).
    fn eat_op(&mut self, op: &str, not_followed_by: &[u8]) -> bool {
        self.space();
        let rest = &self.t[self.i..];
        if rest.starts_with(op.as_bytes())
            && !rest
                .get(op.len())
                .is_some_and(|c| not_followed_by.contains(c))
        {
            self.i += op.len();
            true
        } else {
            false
        }
    }

    fn cond(&mut self) -> Result<Expr, String> {
        let c = self.or()?;
        if self.eat_op("?", b"") {
            let a = self.cond()?;
            if !self.eat(":") {
                return Err("plural expression: «?» without «:»".into());
            }
            let b = self.cond()?;
            return Ok(Expr::Cond(Box::new(c), Box::new(a), Box::new(b)));
        }
        Ok(c)
    }

    fn or(&mut self) -> Result<Expr, String> {
        let mut e = self.and()?;
        while self.eat("||") {
            e = Expr::Bin("||", Box::new(e), Box::new(self.and()?));
        }
        Ok(e)
    }

    fn and(&mut self) -> Result<Expr, String> {
        let mut e = self.equality()?;
        while self.eat("&&") {
            e = Expr::Bin("&&", Box::new(e), Box::new(self.equality()?));
        }
        Ok(e)
    }

    fn equality(&mut self) -> Result<Expr, String> {
        let mut e = self.relation()?;
        loop {
            let op = if self.eat("==") {
                "=="
            } else if self.eat("!=") {
                "!="
            } else {
                return Ok(e);
            };
            e = Expr::Bin(op, Box::new(e), Box::new(self.relation()?));
        }
    }

    fn relation(&mut self) -> Result<Expr, String> {
        let mut e = self.sum()?;
        loop {
            let op = if self.eat("<=") {
                "<="
            } else if self.eat(">=") {
                ">="
            } else if self.eat_op("<", b"=") {
                "<"
            } else if self.eat_op(">", b"=") {
                ">"
            } else {
                return Ok(e);
            };
            e = Expr::Bin(op, Box::new(e), Box::new(self.sum()?));
        }
    }

    fn sum(&mut self) -> Result<Expr, String> {
        let mut e = self.product()?;
        loop {
            let op = if self.eat("+") {
                "+"
            } else if self.eat("-") {
                "-"
            } else {
                return Ok(e);
            };
            e = Expr::Bin(op, Box::new(e), Box::new(self.product()?));
        }
    }

    fn product(&mut self) -> Result<Expr, String> {
        let mut e = self.unary()?;
        loop {
            let op = if self.eat("*") {
                "*"
            } else if self.eat("/") {
                "/"
            } else if self.eat("%") {
                "%"
            } else {
                return Ok(e);
            };
            let right = self.unary()?;
            if matches!(right, Expr::Num(0)) && op != "*" {
                return Err("plural expression: division by zero".into());
            }
            e = Expr::Bin(op, Box::new(e), Box::new(right));
        }
    }

    fn unary(&mut self) -> Result<Expr, String> {
        if self.eat_op("!", b"=") {
            return Ok(Expr::Not(Box::new(self.unary()?)));
        }
        self.space();
        match self.t.get(self.i) {
            Some(b'(') => {
                self.i += 1;
                let e = self.cond()?;
                if !self.eat(")") {
                    return Err("plural expression: «)» missing".into());
                }
                Ok(e)
            }
            Some(b'n') => {
                self.i += 1;
                Ok(Expr::N)
            }
            Some(c) if c.is_ascii_digit() => {
                let start = self.i;
                while self.t.get(self.i).is_some_and(u8::is_ascii_digit) {
                    self.i += 1;
                }
                let number = std::str::from_utf8(&self.t[start..self.i]).unwrap_or("0");
                number
                    .parse()
                    .map(Expr::Num)
                    .map_err(|_| format!("plural expression: the number {number} is too large"))
            }
            Some(c) => Err(format!("plural expression: unexpected «{}»", *c as char)),
            None => Err("plural expression: it ends too soon".into()),
        }
    }
}

/// The same rule without `!`: Slint's reader of a plural rule (`i-slint-compiler`, translations.rs) knows `|| && == != < > <= >= %` and
/// parentheses, and not negation, which Croatian, Lithuanian and Polish use. `!(a && b)` becomes `(!a || !b)` and a comparison turns
/// into its opposite (De Morgan); the form it gives is the same for every `n` (a test compares them).
pub fn without_negation(e: &Expr) -> Expr {
    fn opposite(op: &'static str) -> &'static str {
        match op {
            "==" => "!=",
            "!=" => "==",
            "<" => ">=",
            ">" => "<=",
            "<=" => ">",
            _ => "<",
        }
    }
    fn negate(e: &Expr) -> Expr {
        match e {
            Expr::Not(a) => without_negation(a),
            Expr::Bin("&&", l, r) => Expr::Bin("||", negate(l).into(), negate(r).into()),
            Expr::Bin("||", l, r) => Expr::Bin("&&", negate(l).into(), negate(r).into()),
            Expr::Bin(op @ ("==" | "!=" | "<" | ">" | "<=" | ">="), l, r) => Expr::Bin(
                opposite(op),
                without_negation(l).into(),
                without_negation(r).into(),
            ),
            Expr::Cond(c, a, z) => Expr::Cond(
                without_negation(c).into(),
                negate(a).into(),
                negate(z).into(),
            ),
            other => Expr::Bin("==", without_negation(other).into(), Expr::Num(0).into()),
        }
    }
    match e {
        Expr::Not(a) => negate(a),
        Expr::Bin(op, l, r) => {
            Expr::Bin(op, without_negation(l).into(), without_negation(r).into())
        }
        Expr::Cond(c, a, z) => Expr::Cond(
            without_negation(c).into(),
            without_negation(a).into(),
            without_negation(z).into(),
        ),
        other => other.clone(),
    }
}

/// The rule written as gettext writes it, with the parentheses a reader of the grammar needs (a test of the real reader checks it).
pub fn to_gettext(e: &Expr) -> String {
    fn rank(e: &Expr) -> u8 {
        match e {
            Expr::Cond(..) => 0,
            Expr::Bin("||", ..) => 1,
            Expr::Bin("&&", ..) => 2,
            Expr::Bin("==" | "!=" | "<" | ">" | "<=" | ">=", ..) => 3,
            Expr::Bin("+" | "-", ..) => 4,
            Expr::Bin(..) => 5,
            Expr::Not(..) => 6,
            _ => 7,
        }
    }
    // a child that binds less tightly than its parent is written in parentheses
    fn child(e: &Expr, parent: u8) -> String {
        if rank(e) <= parent {
            format!("({})", to_gettext(e))
        } else {
            to_gettext(e)
        }
    }
    match e {
        Expr::N => "n".into(),
        Expr::Num(x) => x.to_string(),
        Expr::Not(a) => format!("!{}", child(a, 6)),
        Expr::Cond(c, a, z) => format!("{} ? {} : {}", child(c, 0), to_gettext(a), to_gettext(z)),
        Expr::Bin(op, l, r) => {
            let own = rank(e);
            format!("{}{}{}", child(l, own - 1), op, child(r, own))
        }
    }
}

/// The form for `n`.
pub fn eval(e: &Expr, n: i64) -> i64 {
    let b = |x: bool| i64::from(x);
    match e {
        Expr::N => n,
        Expr::Num(x) => *x,
        Expr::Not(a) => b(eval(a, n) == 0),
        Expr::Cond(c, a, z) => {
            if eval(c, n) != 0 {
                eval(a, n)
            } else {
                eval(z, n)
            }
        }
        Expr::Bin(op, l, r) => {
            let (l, r) = (eval(l, n), eval(r, n));
            match *op {
                "||" => b(l != 0 || r != 0),
                "&&" => b(l != 0 && r != 0),
                "==" => b(l == r),
                "!=" => b(l != r),
                "<" => b(l < r),
                ">" => b(l > r),
                "<=" => b(l <= r),
                ">=" => b(l >= r),
                "+" => l.wrapping_add(r),
                "-" => l.wrapping_sub(r),
                "*" => l.wrapping_mul(r),
                "/" => l.checked_div(r).unwrap_or(0),
                _ => l.checked_rem(r).unwrap_or(0),
            }
        }
    }
}

/// The expression as Rust over an `i64` called `n`.
pub fn to_rust(e: &Expr) -> String {
    match e {
        Expr::N => "n".into(),
        Expr::Num(x) => format!("{x}i64"),
        Expr::Not(a) => format!("(({}) == 0) as i64", to_rust(a)),
        Expr::Cond(c, a, z) => format!(
            "(if ({}) != 0 {{ {} }} else {{ {} }})",
            to_rust(c),
            to_rust(a),
            to_rust(z)
        ),
        Expr::Bin(op, l, r) => {
            let (l, r) = (to_rust(l), to_rust(r));
            match *op {
                "||" => format!("((({l}) != 0 || ({r}) != 0) as i64)"),
                "&&" => format!("((({l}) != 0 && ({r}) != 0) as i64)"),
                "==" | "!=" | "<" | ">" | "<=" | ">=" => {
                    format!("((({l}) {op} ({r})) as i64)")
                }
                "+" => format!("(({l}).wrapping_add({r}))"),
                "-" => format!("(({l}).wrapping_sub({r}))"),
                "*" => format!("(({l}).wrapping_mul({r}))"),
                "/" => format!("(({l}).checked_div({r}).unwrap_or(0))"),
                _ => format!("(({l}).checked_rem({r}).unwrap_or(0))"),
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn form(header_text: &str, n: i64) -> i64 {
        eval(&header(header_text).unwrap().1, n)
    }

    #[test]
    fn english_style() {
        assert_eq!(form("nplurals=2; plural=(n != 1);", 1), 0);
        assert_eq!(form("nplurals=2; plural=(n != 1);", 0), 1);
        assert_eq!(form("nplurals=2; plural=n != 1", 5), 1);
    }

    #[test]
    fn polish() {
        let h =
            "nplurals=3; plural=(n==1 ? 0 : n%10>=2 && n%10<=4 && (n%100<12 || n%100>14) ? 1 : 2);";
        assert_eq!(
            [1, 2, 5, 12, 22, 25, 112].map(|n| form(h, n)),
            [0, 1, 2, 2, 1, 2, 2]
        );
    }

    #[test]
    fn arabic() {
        let h = "nplurals=6; plural=(n==0 ? 0 : n==1 ? 1 : n==2 ? 2 : (n%100>=3 && n%100<=10) ? 3 : (n%100>=11 && n%100<=99) ? 4 : 5);";
        assert_eq!(
            [0, 1, 2, 3, 10, 11, 99, 100, 103, 111].map(|n| form(h, n)),
            [0, 1, 2, 3, 3, 4, 4, 5, 3, 4]
        );
    }

    #[test]
    fn a_rule_without_negation_gives_the_same_forms_and_reads_back() {
        let headers = [
            "nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : (n%10>=2 && n%10<=4) && !(n%100>=12 && n%100<=14) ? 1 : 2);",
            "nplurals=4; plural=(n%10==1 && !(n%100>=11 && n%100<=19) ? 0 : (n%10>=2 && n%10<=9) && !(n%100>=11 && n%100<=19) ? 1 : 3);",
            "nplurals=4; plural=(n==1 ? 0 : (n%10>=2 && n%10<=4) && !(n%100>=12 && n%100<=14) ? 1 : (n!=1 && (n%10>=0 && n%10<=1)) || ((n%10>=5 && n%10<=9)) || ((n%100>=12 && n%100<=14)) ? 2 : 3);",
            "nplurals=2; plural=!(n>1) ? 0 : 1;",
            "nplurals=2; plural=!(n==1 || n==2) && !!(n>5) ? 1 : 0;",
        ];
        for h in headers {
            let (_, e) = header(h).unwrap();
            let f = without_negation(&e);
            assert!(!format!("{f:?}").contains("Not("), "{h}");
            let text = to_gettext(&f);
            assert!(!text.contains('!') || !text.contains("!("), "{text}");
            let (_, back) = header(&format!("nplurals=9; plural={text}"))
                .unwrap_or_else(|e| panic!("{text}: {e}"));
            for n in (0..3000).chain([1_000_000, 1_000_001, 10_000_000_000]) {
                assert_eq!(eval(&e, n), eval(&f, n), "{h}: n={n}");
                assert_eq!(eval(&e, n), eval(&back, n), "{text}: n={n}");
            }
        }
    }

    #[test]
    fn errors() {
        for bad in [
            "nplurals=2",
            "nplurals=0; plural=0",
            "nplurals=2; plural=n %",
            "nplurals=2; plural=(n",
            "nplurals=2; plural=n % 0",
            "nplurals=2; plural=n ? 1",
            "nplurals=2; plural=x",
        ] {
            assert!(header(bad).is_err(), "{bad} must not read");
        }
    }

    #[test]
    fn rust_code_is_the_same_expression() {
        let e = header("nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && (n%100<10 || n%100>=20) ? 1 : 2);")
            .unwrap()
            .1;
        let code = to_rust(&e);
        assert!(code.contains("checked_rem"));
        assert!(!code.contains('\n'));
    }
}
