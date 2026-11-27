# Cinese semplificato (zh)

Ho usato il mandarino scritto in caratteri semplificati, con il lessico corrente delle interfacce della Cina continentale. Mi rivolgo alla persona con 你. Nelle istruzioni brevi parto spesso dal verbo, come in 按回车 («premi Invio»). I messaggi che chiedono il permesso di usare una voce conservano invece la prima persona di chi dà il consenso.

## Glossario

| Italiano | Cinese semplificato |
| --- | --- |
| voce | 声音 |
| voce italiana | 意大利语声音 |
| microfono | 麦克风 |
| microfono virtuale | 虚拟麦克风 |
| app della riunione | 会议应用 |
| riunione (pulsante) | 会议 |
| finestra | 窗口 |
| riga di stato | 状态栏 |
| cronologia | 历史记录 |
| registrazione | 录音 |
| tratto di registrazione | 片段 |
| messaggio vocale | 语音消息 |
| ascolta (un campione) | 试听 |
| Invio | 回车 |
| Di’ | 读出 |
| Ferma | 停止 |
| Altro | 更多 |
| Crea la tua voce | 创建自己的声音 |
| Senti anche tu la voce | 自己也能听到 |
| Preparo la voce | 正在准备声音 |
| Pronta | 已就绪 |
| Sto parlando | 正在说话 |
| Nessuno ti sente | 别人听不到你 |
| Manca il microfono | 虚拟麦克风不可用 |
| La voce non parte | 语音启动失败 |
| Attenzione | 请注意 |
| Come si risolve | 解决方法 |
| pacchetto da installare | 安装包 |
| impronta di un file | 校验值 |
| distribuzione Linux | Linux 发行版 |

## Scelte di traduzione

Le frasi scritte per essere pronunciate restano in italiano, anche quella nella scena della pagina «Stato e limiti» (`st.varco.scritto`). Il brano `programma.crea.ciao-sono-io-questa` è in cinese perché lo legge la persona al microfono per registrare la propria voce. Il programma continua a parlare soltanto italiano.

Nella pagina di installazione compare il messaggio intero sui file della voce. Nell’aiuto compare lo stesso incipit, 找不到语音文件. Per i due errori del motore, l’aiuto riproduce le parole della finestra fino ai due punti, dove il programma inserisce la causa di sistema. Sotto il campione del preventivo, 读作： introduce la pronuncia italiana per esteso.

虚拟麦克风不可用 identifica il microfono virtuale che deve comparire nell’app della riunione. 找不到麦克风 rimane nel messaggio mostrato a chi sta registrando e deve collegare un microfono fisico. 返回输入框, il pulsante che chiude i passi di creazione della voce, indica già correttamente la destinazione.

## Testi accorciati dopo la lettura dei fogli

| Scena | Dicitura rivista | Motivo |
| --- | --- | --- |
| `voce-1`, `voce-errore` | 怎么创建自己的声音？ e 现在录音 | A 360 il titolo divideva 声音 tra le righe. Nella scheda della prima scelta, il nuovo comando «Registra ora» lascia più spazio alla spiegazione. Anche le due righe sopra le scelte diventano 如果你还能说话 e 如果你已无法说话. |
| Passi di creazione | `{}/3 · {}` e 朗读 | Il numero del passo e il suo nome condividono la riga con la freccia per tornare indietro. La dicitura compatta mantiene sia il passo corrente sia il totale. |
| `voce-mic`, `voce-2`, `voce-suggerimento` | 按圆形按钮开始朗读 e `{0} · 剩{n}秒` | Il contatore spezzava 还差 a metà. 剩 indica in un solo carattere il tempo mancante. Ho condensato anche le istruzioni sul cerchio, sul livello del microfono e sulla voce che non si sente. |
| `voce-3`, `voce-nome`, `voce-tratti` | 重来 e 想给声音起什么名字？ | Il pulsante condivide la riga con l’ascolto o con il numero di tratti trovati. 重来 permette di ricominciare sia da una registrazione sia da un file. Ho accorciato anche la domanda sul nome e la riga che invita a scegliere un tratto. |
| `voce-crea`, `voce-errore` | 正在创建“{}”… e 试试语音消息、视频或录音。 | Ho tolto una ripetizione davanti al nome scelto e accorciato il rimedio per un file non audio. Entrambi lasciano più spazio al contenuto variabile o ai comandi. |

## Che cosa si vede nelle sei foto fornite

| Foto | Osservazione |
| --- | --- |
| `zh_360x320_s1_scuro_1.png` | In `scrive` si vede solo la parte alta della frase italiana nell’area di scrittura. Le bolle di `parla`, `compatta-parla` e `cronologia-lunga` mostrano un tratto della frase su una sola riga. I pulsanti cinesi in basso sono leggibili. |
| `zh_360x320_s1_scuro_2.png` | In `info` il titolo di dimostrazione si interrompe dopo «Kalliope 0.4.0 · dim…». Il suffisso italiano arriva dalla modalità demo. In `voce-mic`, `voce-2` e `voce-suggerimento` l’inizio del brano è sopra il bordo. Nei due stati di registrazione anche le istruzioni in basso escono dall’inquadratura. In `voce-3` e `voce-nome` si intravede appena il bordo del campo sopra il pulsante fisso. In `voce-tratti` si vede un solo tratto dei tre. |
| `zh_920x640_s1.75_scuro_1.png` | Le bolle di `compatta` e `compatta-parla` mostrano soltanto una parte della lunga frase italiana. Nella finestra estesa la frase va su più righe. |
| `zh_920x640_s1.75_scuro_2.png` | In `info` si vede solo l’inizio dell’elenco dei componenti. Il brano di lettura arriva al bordo superiore, mentre i suggerimenti di registrazione arrivano a quello inferiore. In `voce-3` e `voce-nome` il nome si legge, ma il consenso è fuori inquadratura. In `voce-tratti` sopra il pulsante fisso si vede il primo tratto. |
| `zh_920x640_s1_scuro_1.png` | Nella finestra estesa le frasi italiane e i comandi cinesi sono leggibili. In modalità compatta la bolla italiana occupa una sola riga e la frase prosegue oltre il bordo. |
| `zh_920x640_s1_scuro_2.png` | Le azioni e gli stati cinesi sono leggibili. In `voce-tratti` si vedono tutti e tre i tratti e la domanda sul nome. Il campo del nome prosegue sotto la parte visibile dell’area scorrevole. |

Le osservazioni descrivono i fotogrammi ricevuti prima delle correzioni. I passi di creazione hanno un’area scorrevole. Una foto ne mostra una posizione sola.

## Dubbio residuo

Per il comando del desktop «Sempre in primo piano» ho usato 总在最前 sia nella finestra sia nella guida. La dicitura esatta dipende dall'ambiente desktop Linux della persona.

## Applications menu

| Campo | Testo nel menu | Back-translation (English) |
| --- | --- | --- |
| GenericName | `视频通话文字转语音工具` | Text-to-speech tool for video calls |
| Comment | `在视频通话中，把你想说的话打出来，让大家听见` | On video calls, type what you want to say so everyone can hear it |
| Keywords | `文字转语音;语音合成;tts;声音;说话;麦克风;视频通话;辅助与替代沟通系统;aac;无法说话;` | text to speech; speech synthesis; TTS; voice; speak; microphone; video call; augmentative and alternative communication system; AAC; unable to speak |

«文字转语音» descrive il passaggio dalla scrittura alla voce. «语音合成» è il nome tecnico e «无法说话» riprende la presentazione di Kalliope.
«辅助与替代沟通系统» e «aac» accolgono chi conosce la CAA attraverso il nome cinese o la sigla internazionale. [Guida alla CAA in cinese](https://atic.sfusd.edu/aac/chinese)

Review: no change. «把你想说的话打出来，让大家听见» invita a digitare ciò che si vuole dire e indica chi lo sentirà. Tra le chiavi figurano sia «语音合成», cercata nel foglio, sia «无法说话», già usata nella presentazione.
