// SPDX-License-Identifier: LicenseRef-SANSEVIERIA-1.0
//! Word lists: abbreviations, acronyms, chat shorthand, missing accents, units, months.

/// When an abbreviation applies.
#[derive(Clone, Copy, PartialEq, Eq, Debug)]
pub enum When {
    Always,
    /// Only in front of a number ("n. 5", "art. 3", "p. 12").
    BeforeNumber,
    /// Only after a number ("44 a.C.", "15 mar.").
    AfterNumber,
}

/// What an abbreviation becomes.
#[derive(Clone, Copy, Debug)]
pub struct Abbreviation {
    /// Expansion; for titles, the full form used when no name follows ("dottore").
    pub expansion: &'static str,
    /// Titles shorten in front of a name: "dott. Rossi" → "dottor Rossi".
    pub before_name: Option<&'static str>,
    pub when: When,
    /// Whether its final dot can also end the sentence ("…pane, latte ecc. Poi…").
    pub can_end_sentence: bool,
}

const fn a(expansion: &'static str) -> Abbreviation {
    Abbreviation {
        expansion,
        before_name: None,
        when: When::Always,
        can_end_sentence: false,
    }
}
const fn title(full: &'static str, short: &'static str) -> Abbreviation {
    Abbreviation {
        expansion: full,
        before_name: Some(short),
        when: When::Always,
        can_end_sentence: false,
    }
}
const fn ending(expansion: &'static str) -> Abbreviation {
    Abbreviation {
        expansion,
        before_name: None,
        when: When::Always,
        can_end_sentence: true,
    }
}
const fn before_number(expansion: &'static str) -> Abbreviation {
    Abbreviation {
        expansion,
        before_name: None,
        when: When::BeforeNumber,
        can_end_sentence: false,
    }
}
const fn after_number(expansion: &'static str) -> Abbreviation {
    Abbreviation {
        expansion,
        before_name: None,
        when: When::AfterNumber,
        can_end_sentence: true,
    }
}

/// Abbreviation by its lower-case written form, dots included.
pub fn abbreviation(key: &str) -> Option<Abbreviation> {
    Some(match key {
        "dott." | "dr." | "dott" => title("dottore", "dottor"),
        "dott.ssa" | "dr.ssa" => a("dottoressa"),
        "sig." | "sig" => title("signore", "signor"),
        "sig.ra" => a("signora"),
        "sig.na" => a("signorina"),
        "sigg." => a("signori"),
        "prof." => title("professore", "professor"),
        "prof.ssa" => a("professoressa"),
        "proff." => a("professori"),
        "ing." | "ing" => title("ingegnere", "ingegner"),
        "rag." => title("ragioniere", "ragionier"),
        "avv." | "avv" => a("avvocato"),
        "arch." => a("architetto"),
        "geom." => a("geometra"),
        "on." => a("onorevole"),
        "sen." => a("senatore"),
        "mons." => a("monsignor"),
        "egr." => a("egregio"),
        "gent." => a("gentile"),
        "gent.mo" => a("gentilissimo"),
        "gent.ma" => a("gentilissima"),
        "gent.mi" => a("gentilissimi"),
        "spett." => a("spettabile"),
        "f.lli" => a("fratelli"),
        "ecc." | "etc." | "ecc" => ending("eccetera"),
        "es." => a("esempio"),
        "p.es." | "e.g." => a("per esempio"),
        "i.e." => a("cioè"),
        "cfr." => a("confronta"),
        "vd." => a("vedi"),
        "pag." => a("pagina"),
        "pagg." | "pp." => a("pagine"),
        "p." => before_number("pagina"),
        "art." => a("articolo"),
        "artt." => a("articoli"),
        "co." => before_number("comma"),
        "lett." => a("lettera"),
        "n." | "nr." | "num." | "n°" => before_number("numero"),
        "tel." => a("telefono"),
        "cell." => a("cellulare"),
        "vol." => a("volume"),
        "voll." => a("volumi"),
        "cap." => a("capitolo"),
        "fig." => a("figura"),
        "tab." => a("tabella"),
        "par." => a("paragrafo"),
        "ca." => a("circa"),
        "c.so" => a("corso"),
        "p.zza" | "p.za" => a("piazza"),
        "v.le" => a("viale"),
        "l.go" => a("largo"),
        "loc." => a("località"),
        "fraz." => a("frazione"),
        "prov." => a("provincia"),
        "q.tà" => a("quantità"),
        "tot." => a("totale"),
        "max." => a("massimo"),
        "a.c." => after_number("avanti cristo"),
        "d.c." => after_number("dopo cristo"),
        "gen." => after_number("gennaio"),
        "feb." => after_number("febbraio"),
        "mar." => after_number("marzo"),
        "apr." => after_number("aprile"),
        "mag." => after_number("maggio"),
        "giu." => after_number("giugno"),
        "lug." => after_number("luglio"),
        "ago." => after_number("agosto"),
        "set." | "sett." => after_number("settembre"),
        "ott." => after_number("ottobre"),
        "nov." => after_number("novembre"),
        "dic." => after_number("dicembre"),
        "min." => after_number("minuti"),
        "sec." => after_number("secondi"),
        "n.b." => a("nota bene"),
        "p.s." => a("post scriptum"),
        "n.d.r." => a("nota del redattore"),
        "s.p.a." => a("spa"),
        "s.r.l." => a("esse erre elle"),
        "s.n.c." => a("esse enne ci"),
        "s.a.s." => a("esse a esse"),
        "o.k." => a("ok"),
        "u.s.a." => a("usa"),
        "vs." | "vs" => a("contro"),
        "c/o" => a("presso"),
        "e/o" => a("e o"),
        _ => return None,
    })
}

/// Acronyms said as a word ("IVA" → "iva", not "i vu a").
pub fn acronym_said_as_word(upper: &str) -> bool {
    matches!(
        upper,
        "IVA"
            | "NATO"
            | "ONU"
            | "FIAT"
            | "ANSA"
            | "RAI"
            | "ISTAT"
            | "INPS"
            | "INAIL"
            | "UNESCO"
            | "UNICEF"
            | "FIFA"
            | "UEFA"
            | "NASA"
            | "CONSOB"
            | "ANAS"
            | "ENEL"
            | "ENI"
            | "TAR"
            | "TAV"
            | "IMU"
            | "IRPEF"
            | "IRES"
            | "IRAP"
            | "TARI"
            | "ISEE"
            | "SPID"
            | "CAP"
            | "PIN"
            | "SIM"
            | "LED"
            | "LAN"
            | "RAM"
            | "ROM"
            | "COVID"
            | "AIDS"
            | "LASER"
            | "RADAR"
            | "DOP"
            | "DOC"
            | "IGP"
            | "PIL"
            | "CONI"
            | "FIGC"
            | "ACI"
            | "ASUS"
            | "IKEA"
            | "NAS"
            | "SUV"
            | "TAC"
            | "OCSE"
            | "OPEC"
            | "FAQ"
            | "CUP"
            | "CAF"
            | "NASPI"
            | "INVALSI"
            | "MIUR"
            | "ARPA"
            | "ASP"
            | "SIAE"
            | "USA"
            | "UNIBO"
            | "SUPSI"
            | "USI"
    )
}

/// Acronyms always spelled, also in lower case in chat ("pdf" → "pi di effe").
pub fn acronym_spelled(lower: &str) -> bool {
    matches!(
        lower,
        "pdf"
            | "usb"
            | "pc"
            | "tv"
            | "cd"
            | "dvd"
            | "sms"
            | "gps"
            | "dna"
            | "hr"
            | "ceo"
            | "cfo"
            | "cto"
            | "it"
            | "ai"
            | "api"
            | "url"
            | "cv"
            | "pa"
            | "pmi"
            | "ue"
            | "uk"
            | "bmw"
            | "ibm"
            | "hp"
            | "lg"
            | "nba"
            | "rgb"
            | "html"
            | "css"
            | "sql"
            | "dpcm"
            | "avs"
    )
}

/// Italian names of the letters.
pub fn letter_name(c: char) -> Option<&'static str> {
    Some(match c.to_ascii_lowercase() {
        'a' => "a",
        'b' => "bi",
        'c' => "ci",
        'd' => "di",
        'e' => "e",
        'f' => "effe",
        'g' => "gi",
        'h' => "acca",
        'i' => "i",
        'j' => "i lunga",
        'k' => "cappa",
        'l' => "elle",
        'm' => "emme",
        'n' => "enne",
        'o' => "o",
        'p' => "pi",
        'q' => "cu",
        'r' => "erre",
        's' => "esse",
        't' => "ti",
        'u' => "u",
        'v' => "vu",
        'w' => "doppia vu",
        'x' => "ics",
        'y' => "ipsilon",
        'z' => "zeta",
        _ => return None,
    })
}

/// Chat shorthand, lower case.
pub fn chat(word: &str) -> Option<&'static str> {
    Some(match word {
        "cmq" => "comunque",
        "nn" => "non",
        "xké" | "xkè" | "xke" | "xché" | "xchè" | "xche" | "xk" | "perkè" | "perké" | "perke" => {
            "perché"
        }
        "ke" | "k" => "che",
        "x" => "per",
        "xò" => "però",
        "tvb" => "ti voglio bene",
        "tvtb" => "ti voglio tanto bene",
        "qlc" | "qlcs" => "qualcosa",
        "qls" => "qualsiasi",
        "qnd" => "quando",
        "qnt" => "quanto",
        "dv" => "dove",
        "msg" => "messaggio",
        "grz" | "thx" | "tnx" => "grazie",
        "prg" => "prego",
        "pls" | "plz" => "per favore",
        "cn" => "con",
        "sn" => "sono",
        "dp" => "dopo",
        "dx" => "destra",
        "sx" => "sinistra",
        "ovv" => "ovviamente",
        "anke" => "anche",
        "nnt" => "niente",
        "dmn" => "domani",
        "raga" => "ragazzi",
        "bn" => "bene",
        "mlt" => "molto",
        "tnt" => "tanto",
        "c" => "ci",
        "t" => "ti",
        _ => return None,
    })
}

/// Words typed without their accent, when only one reading exists.
pub fn restore_accent(word: &str) -> Option<&'static str> {
    Some(match word {
        "perche" | "perchè" => "perché",
        "poiche" | "poichè" => "poiché",
        "affinche" | "affinchè" => "affinché",
        "benche" | "benchè" => "benché",
        "finche" | "finchè" => "finché",
        "nonche" | "nonchè" => "nonché",
        "purche" | "purchè" => "purché",
        "sicche" | "sicchè" => "sicché",
        "nè" => "né",
        "sè" => "sé",
        "cioe" => "cioè",
        "piu" => "più",
        "gia" => "già",
        "puo" => "può",
        "pero" => "però",
        "cosi" => "così",
        "giu" => "giù",
        "pò" => "po'",
        "lunedi" => "lunedì",
        "martedi" => "martedì",
        "mercoledi" => "mercoledì",
        "giovedi" => "giovedì",
        "venerdi" => "venerdì",
        "caffe" => "caffè",
        "virtu" => "virtù",
        "gioventu" => "gioventù",
        "tribu" => "tribù",
        "sara" => "sarà",
        "fara" => "farà",
        "andra" => "andrà",
        "potra" => "potrà",
        "dovra" => "dovrà",
        "vorra" => "vorrà",
        "verra" => "verrà",
        "avra" => "avrà",
        "dara" => "darà",
        "stara" => "starà",
        "sapra" => "saprà",
        "rimarra" => "rimarrà",
        "saro" => "sarò",
        "avro" => "avrò",
        "potro" => "potrò",
        "dovro" => "dovrò",
        "vorro" => "vorrò",
        "andro" => "andrò",
        "verro" => "verrò",
        "daro" => "darò",
        "staro" => "starò",
        "sapro" => "saprò",
        "citta" => "città",
        "universita" => "università",
        "qualita" => "qualità",
        "verita" => "verità",
        "liberta" => "libertà",
        "societa" => "società",
        "attivita" => "attività",
        "possibilita" => "possibilità",
        "novita" => "novità",
        "realta" => "realtà",
        "volonta" => "volontà",
        "difficolta" => "difficoltà",
        "facolta" => "facoltà",
        "eta" => "età",
        "pieta" => "pietà",
        "felicita" => "felicità",
        "capacita" => "capacità",
        "comunita" => "comunità",
        "opportunita" => "opportunità",
        "priorita" => "priorità",
        "necessita" => "necessità",
        "velocita" => "velocità",
        "quantita" => "quantità",
        "identita" => "identità",
        "attualita" => "attualità",
        "modalita" => "modalità",
        "funzionalita" => "funzionalità",
        "responsabilita" => "responsabilità",
        "disponibilita" => "disponibilità",
        "criticita" => "criticità",
        "localita" => "località",
        "mentalita" => "mentalità",
        "personalita" => "personalità",
        "specialita" => "specialità",
        "tranquillita" => "tranquillità",
        "umanita" => "umanità",
        "varieta" => "varietà",
        "sanita" => "sanità",
        "bonta" => "bontà",
        "civilta" => "civiltà",
        "gravita" => "gravità",
        "poverta" => "povertà",
        "proprieta" => "proprietà",
        "pubblicita" => "pubblicità",
        "serenita" => "serenità",
        "solidarieta" => "solidarietà",
        "umilta" => "umiltà",
        _ => return None,
    })
}

/// Month by number.
pub fn month(m: u64) -> Option<&'static str> {
    const M: [&str; 12] = [
        "gennaio",
        "febbraio",
        "marzo",
        "aprile",
        "maggio",
        "giugno",
        "luglio",
        "agosto",
        "settembre",
        "ottobre",
        "novembre",
        "dicembre",
    ];
    M.get((m as usize).wrapping_sub(1)).copied()
}

pub fn is_month(word: &str) -> bool {
    (1..=12).any(|m| month(m) == Some(word))
}

/// A unit written after a number: (singular, plural). `glued_only` units are single letters
/// that are only read as units when written against the number ("5m", "3g").
pub fn unit(key: &str) -> Option<(&'static str, &'static str, bool)> {
    let lower = key.to_lowercase();
    Some(match lower.as_str() {
        "km" => ("chilometro", "chilometri", false),
        "m" => ("metro", "metri", true),
        "cm" => ("centimetro", "centimetri", false),
        "mm" => ("millimetro", "millimetri", false),
        "kg" => ("chilo", "chili", false),
        "g" => ("grammo", "grammi", true),
        "gr" => ("grammo", "grammi", false),
        "mg" => ("milligrammo", "milligrammi", false),
        "l" => ("litro", "litri", true),
        "lt" => ("litro", "litri", false),
        "ml" => ("millilitro", "millilitri", false),
        "cl" => ("centilitro", "centilitri", false),
        "h" => ("ora", "ore", false),
        "min" => ("minuto", "minuti", false),
        "sec" => ("secondo", "secondi", false),
        "s" => ("secondo", "secondi", true),
        "ms" => ("millisecondo", "millisecondi", false),
        "kb" => ("kilobyte", "kilobyte", false),
        "mb" => ("megabyte", "megabyte", false),
        "gb" => ("gigabyte", "gigabyte", false),
        "tb" => ("terabyte", "terabyte", false),
        "kw" => ("chilowatt", "chilowatt", false),
        "kwh" => ("chilowattora", "chilowattora", false),
        "w" => ("watt", "watt", true),
        "v" => ("volt", "volt", true),
        "hz" => ("hertz", "hertz", false),
        "khz" => ("chilohertz", "chilohertz", false),
        "mhz" => ("megahertz", "megahertz", false),
        "ghz" => ("gigahertz", "gigahertz", false),
        "mq" | "m²" | "m2" => ("metro quadro", "metri quadri", false),
        "mc" | "m³" | "m3" => ("metro cubo", "metri cubi", false),
        "km/h" => ("chilometro orario", "chilometri orari", false),
        _ => return None,
    })
}

/// Currency: (singular, plural), from a symbol or a code.
pub fn currency(key: &str) -> Option<(&'static str, &'static str)> {
    Some(match key {
        "€" | "EUR" | "euro" => ("euro", "euro"),
        "$" | "USD" | "dollari" | "dollaro" => ("dollaro", "dollari"),
        "£" | "GBP" | "sterline" | "sterlina" => ("sterlina", "sterline"),
        "¥" | "JPY" => ("yen", "yen"),
        "CHF" | "franchi" | "franco" => ("franco", "franchi"),
        _ => return None,
    })
}

/// Words after which a number with "°" is an ordinal ("il 3° piano"), not degrees.
pub fn is_article_or_preposition(word: &str) -> bool {
    matches!(
        word,
        "il" | "lo"
            | "la"
            | "i"
            | "gli"
            | "le"
            | "l'"
            | "al"
            | "allo"
            | "alla"
            | "ai"
            | "agli"
            | "alle"
            | "all'"
            | "del"
            | "dello"
            | "della"
            | "dei"
            | "degli"
            | "delle"
            | "dell'"
            | "nel"
            | "nello"
            | "nella"
            | "nei"
            | "negli"
            | "nelle"
            | "nell'"
            | "dal"
            | "dalla"
            | "dai"
            | "dalle"
            | "dall'"
            | "sul"
            | "sulla"
            | "sui"
            | "sulle"
            | "sull'"
            | "un"
            | "uno"
            | "una"
            | "un'"
    )
}

pub fn is_feminine_article(word: &str) -> bool {
    matches!(
        word,
        "la" | "le"
            | "alla"
            | "alle"
            | "della"
            | "delle"
            | "nella"
            | "nelle"
            | "dalla"
            | "dalle"
            | "sulla"
            | "sulle"
            | "una"
            | "un'"
    )
}

/// Nouns that make a number with "°" an ordinal.
pub fn is_ordinal_noun(word: &str) -> bool {
    matches!(
        word,
        "piano"
            | "posto"
            | "anno"
            | "secolo"
            | "classificato"
            | "classificata"
            | "livello"
            | "giorno"
            | "capitolo"
            | "premio"
            | "turno"
            | "round"
            | "millennio"
            | "comma"
            | "articolo"
            | "volume"
            | "atto"
            | "episodio"
            | "puntata"
            | "edizione"
            | "compleanno"
            | "anniversario"
            | "figlio"
            | "figlia"
            | "volta"
            | "tempo"
            | "gol"
            | "minuto"
            | "stagione"
            | "grado"
            | "semestre"
            | "trimestre"
            | "quadrimestre"
            | "mese"
    )
}

/// Words a number never agrees with: after them, 1 stays "uno".
pub fn is_function_word(word: &str) -> bool {
    matches!(
        word,
        "e" | "o"
            | "ma"
            | "a"
            | "di"
            | "da"
            | "in"
            | "con"
            | "su"
            | "per"
            | "tra"
            | "fra"
            | "che"
            | "è"
            | "non"
            | "il"
            | "lo"
            | "la"
            | "i"
            | "gli"
            | "le"
            | "solo"
            | "sola"
            | "contro"
            | "più"
            | "meno"
            | "volta"
            | "ne"
            | "si"
            | "mi"
            | "ti"
            | "ci"
            | "vi"
    )
}

/// Masculine nouns ending in -a.
fn masculine_in_a(word: &str) -> bool {
    matches!(
        word,
        "problema"
            | "sistema"
            | "tema"
            | "programma"
            | "schema"
            | "dramma"
            | "clima"
            | "cinema"
            | "pigiama"
            | "papa"
            | "poeta"
            | "pilota"
            | "dilemma"
            | "diploma"
            | "panorama"
            | "teorema"
            | "enigma"
            | "stemma"
            | "telegramma"
            | "diagramma"
            | "poema"
            | "idioma"
            | "trauma"
            | "carisma"
            | "dogma"
            | "fantasma"
            | "pianeta"
            | "profeta"
            | "atleta"
            | "sofà"
            | "gorilla"
            | "boa"
            | "lama"
            | "delta"
            | "puma"
            | "koala"
    )
}

/// Feminine nouns not ending in -a.
fn feminine_not_in_a(word: &str) -> bool {
    word.ends_with("zione")
        || word.ends_with("sione")
        || word.ends_with("gione")
        || word.ends_with("tà")
        || word.ends_with("tù")
        || word.ends_with("ie")
        || matches!(
            word,
            "notte"
                | "parte"
                | "chiave"
                | "classe"
                | "fase"
                | "frase"
                | "mente"
                | "gente"
                | "sede"
                | "legge"
                | "fonte"
                | "nave"
                | "neve"
                | "voce"
                | "croce"
                | "pace"
                | "luce"
                | "madre"
                | "moglie"
                | "carne"
                | "arte"
                | "morte"
                | "sorte"
                | "torre"
                | "valle"
                | "rete"
                | "sete"
                | "fame"
                | "nube"
                | "febbre"
                | "base"
                | "specie"
                | "serie"
                | "superficie"
                | "mano"
                | "radio"
                | "foto"
                | "moto"
                | "auto"
                | "chiesa"
                | "tesi"
                | "crisi"
                | "analisi"
                | "ipotesi"
                | "e-mail"
                | "email"
                | "mail"
        )
}

/// Guesses whether a noun is feminine, from its form.
pub fn looks_feminine(word: &str) -> bool {
    if masculine_in_a(word) {
        return false;
    }
    word.ends_with('a') || feminine_not_in_a(word)
}

/// "uno" in front of s + consonant, z, gn, ps, pn, x, y, i + vowel.
pub fn takes_uno(word: &str) -> bool {
    let mut c = word.chars();
    let (first, second) = (c.next().unwrap_or(' '), c.next().unwrap_or(' '));
    let vowel = |x: char| "aeiouàèéìòù".contains(x);
    (first == 's' && !vowel(second))
        || first == 'z'
        || first == 'x'
        || first == 'y'
        || word.starts_with("gn")
        || word.starts_with("ps")
        || word.starts_with("pn")
        || (first == 'i' && vowel(second))
}

pub fn starts_with_vowel(word: &str) -> bool {
    word.chars()
        .next()
        .is_some_and(|c| "aeiouàèéìòù".contains(c))
}
