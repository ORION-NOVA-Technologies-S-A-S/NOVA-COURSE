/**
 * Frases base de los cursos de idiomas (nivel A1).
 * 40 frases por idioma, en el mismo orden que SPANISH. Formato: "texto en el idioma|pronunciación aproximada".
 * La pronunciación se incluye solo en idiomas que no usan el alfabeto latino.
 * Recomendación: que un hablante nativo revise cada idioma antes de usarlo con estudiantes.
 */

export const SPANISH = [
  // 0-9 Saludos y cortesía
  "Hola", "Buenos días", "Buenas noches", "Adiós", "Por favor", "Gracias", "De nada", "Lo siento", "Sí", "No",
  // 10-19 Conversación básica
  "¿Cómo estás?", "Estoy bien", "¿Cómo te llamas?", "Me llamo Ana", "Mucho gusto", "¿De dónde eres?", "Soy de Colombia", "No entiendo", "¿Hablas español?", "Hasta luego",
  // 20-29 Números
  "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez",
  // 30-39 Familia, comida y lugares
  "madre", "padre", "hermano", "amigo", "agua", "café", "pan", "casa", "¿Cuánto cuesta?", "¿Dónde está el baño?",
];

export const CATEGORIES = [
  { name: "Saludos y cortesía", from: 0, to: 10 },
  { name: "Conversación básica", from: 10, to: 20 },
  { name: "Números del 1 al 10", from: 20, to: 30 },
  { name: "Familia, comida y lugares", from: 30, to: 40 },
];

/** Qué frases se practican en cada módulo (los módulos 6-10 usan las frases que escriba el administrador). */
export const MODULE_CATEGORIES: Record<number, number[]> = { 1: [0, 1], 2: [2, 3], 3: [3, 2], 4: [0, 1, 2, 3], 5: [0, 1, 2, 3] };

export const PHRASES: Record<string, string[]> = {
  "en-US": ["Hello", "Good morning", "Good night", "Goodbye", "Please", "Thank you", "You're welcome", "I'm sorry", "Yes", "No",
    "How are you?", "I'm fine", "What's your name?", "My name is Ana", "Nice to meet you", "Where are you from?", "I'm from Colombia", "I don't understand", "Do you speak Spanish?", "See you later",
    "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
    "mother", "father", "brother", "friend", "water", "coffee", "bread", "house", "How much is it?", "Where is the bathroom?"],
  "fr-FR": ["Salut", "Bonjour", "Bonne nuit", "Au revoir", "S'il vous plaît", "Merci", "De rien", "Je suis désolé", "Oui", "Non",
    "Comment ça va ?", "Je vais bien", "Comment tu t'appelles ?", "Je m'appelle Ana", "Enchanté", "D'où viens-tu ?", "Je viens de Colombie", "Je ne comprends pas", "Tu parles espagnol ?", "À plus tard",
    "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix",
    "mère", "père", "frère", "ami", "eau", "café", "pain", "maison", "Combien ça coûte ?", "Où sont les toilettes ?"],
  "pt-BR": ["Oi", "Bom dia", "Boa noite", "Tchau", "Por favor", "Obrigado", "De nada", "Desculpe", "Sim", "Não",
    "Como você está?", "Estou bem", "Qual é o seu nome?", "Meu nome é Ana", "Prazer", "De onde você é?", "Sou da Colômbia", "Não entendo", "Você fala espanhol?", "Até logo",
    "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove", "dez",
    "mãe", "pai", "irmão", "amigo", "água", "café", "pão", "casa", "Quanto custa?", "Onde fica o banheiro?"],
  "de-DE": ["Hallo", "Guten Morgen", "Gute Nacht", "Auf Wiedersehen", "Bitte", "Danke", "Gern geschehen", "Es tut mir leid", "Ja", "Nein",
    "Wie geht es dir?", "Mir geht es gut", "Wie heißt du?", "Ich heiße Ana", "Freut mich", "Woher kommst du?", "Ich komme aus Kolumbien", "Ich verstehe nicht", "Sprichst du Spanisch?", "Bis später",
    "eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun", "zehn",
    "Mutter", "Vater", "Bruder", "Freund", "Wasser", "Kaffee", "Brot", "Haus", "Wie viel kostet das?", "Wo ist die Toilette?"],
  "it-IT": ["Ciao", "Buongiorno", "Buonanotte", "Arrivederci", "Per favore", "Grazie", "Prego", "Mi dispiace", "Sì", "No",
    "Come stai?", "Sto bene", "Come ti chiami?", "Mi chiamo Ana", "Piacere", "Di dove sei?", "Vengo dalla Colombia", "Non capisco", "Parli spagnolo?", "A dopo",
    "uno", "due", "tre", "quattro", "cinque", "sei", "sette", "otto", "nove", "dieci",
    "madre", "padre", "fratello", "amico", "acqua", "caffè", "pane", "casa", "Quanto costa?", "Dov'è il bagno?"],
  "zh-CN": ["你好|nǐ hǎo", "早上好|zǎoshang hǎo", "晚安|wǎn'ān", "再见|zàijiàn", "请|qǐng", "谢谢|xièxie", "不客气|bú kèqi", "对不起|duìbuqǐ", "是|shì", "不是|bú shì",
    "你好吗？|nǐ hǎo ma?", "我很好|wǒ hěn hǎo", "你叫什么名字？|nǐ jiào shénme míngzi?", "我叫安娜|wǒ jiào Ānnà", "很高兴认识你|hěn gāoxìng rènshi nǐ", "你是哪里人？|nǐ shì nǎlǐ rén?", "我是哥伦比亚人|wǒ shì Gēlúnbǐyà rén", "我不明白|wǒ bù míngbai", "你会说西班牙语吗？|nǐ huì shuō Xībānyáyǔ ma?", "回头见|huítóu jiàn",
    "一|yī", "二|èr", "三|sān", "四|sì", "五|wǔ", "六|liù", "七|qī", "八|bā", "九|jiǔ", "十|shí",
    "妈妈|māma", "爸爸|bàba", "兄弟|xiōngdì", "朋友|péngyou", "水|shuǐ", "咖啡|kāfēi", "面包|miànbāo", "房子|fángzi", "多少钱？|duōshao qián?", "洗手间在哪里？|xǐshǒujiān zài nǎlǐ?"],
  "ja-JP": ["こんにちは|konnichiwa", "おはようございます|ohayō gozaimasu", "おやすみなさい|oyasumi nasai", "さようなら|sayōnara", "お願いします|onegai shimasu", "ありがとう|arigatō", "どういたしまして|dō itashimashite", "ごめんなさい|gomen nasai", "はい|hai", "いいえ|iie",
    "お元気ですか？|o-genki desu ka?", "元気です|genki desu", "お名前は何ですか？|o-namae wa nan desu ka?", "私はアナです|watashi wa Ana desu", "はじめまして|hajimemashite", "どこから来ましたか？|doko kara kimashita ka?", "コロンビアから来ました|Koronbia kara kimashita", "わかりません|wakarimasen", "スペイン語を話せますか？|supein-go o hanasemasu ka?", "またね|mata ne",
    "いち|ichi", "に|ni", "さん|san", "よん|yon", "ご|go", "ろく|roku", "なな|nana", "はち|hachi", "きゅう|kyū", "じゅう|jū",
    "母|haha", "父|chichi", "兄弟|kyōdai", "友達|tomodachi", "水|mizu", "コーヒー|kōhī", "パン|pan", "家|ie", "いくらですか？|ikura desu ka?", "トイレはどこですか？|toire wa doko desu ka?"],
  "ko-KR": ["안녕하세요|annyeonghaseyo", "좋은 아침이에요|joeun achimieyo", "안녕히 주무세요|annyeonghi jumuseyo", "안녕히 가세요|annyeonghi gaseyo", "부탁합니다|butakhamnida", "감사합니다|gamsahamnida", "천만에요|cheonmaneyo", "죄송합니다|joesonghamnida", "네|ne", "아니요|aniyo",
    "잘 지내세요?|jal jinaeseyo?", "잘 지내요|jal jinaeyo", "이름이 뭐예요?|ireumi mwoyeyo?", "제 이름은 아나예요|je ireumeun Anayeyo", "반갑습니다|bangapseumnida", "어디에서 왔어요?|eodieseo wasseoyo?", "콜롬비아에서 왔어요|kollombiaeseo wasseoyo", "이해가 안 돼요|ihaega an dwaeyo", "스페인어 할 줄 알아요?|seupeineo hal jul arayo?", "나중에 봐요|najunge bwayo",
    "일|il", "이|i", "삼|sam", "사|sa", "오|o", "육|yuk", "칠|chil", "팔|pal", "구|gu", "십|sip",
    "어머니|eomeoni", "아버지|abeoji", "형제|hyeongje", "친구|chingu", "물|mul", "커피|keopi", "빵|ppang", "집|jip", "얼마예요?|eolmayeyo?", "화장실이 어디예요?|hwajangsiri eodiyeyo?"],
  "ar-SA": ["مرحبا|marḥaban", "صباح الخير|ṣabāḥ al-khayr", "تصبح على خير|tuṣbiḥ ʿalā khayr", "مع السلامة|maʿa as-salāma", "من فضلك|min faḍlak", "شكرا|shukran", "عفوا|ʿafwan", "آسف|āsif", "نعم|naʿam", "لا|lā",
    "كيف حالك؟|kayfa ḥāluk?", "أنا بخير|anā bikhayr", "ما اسمك؟|mā ismuk?", "اسمي آنا|ismī Ānā", "تشرفنا|tasharrafnā", "من أين أنت؟|min ayna anta?", "أنا من كولومبيا|anā min Kūlūmbiyā", "لا أفهم|lā afham", "هل تتكلم الإسبانية؟|hal tatakallam al-isbāniyya?", "أراك لاحقا|arāka lāḥiqan",
    "واحد|wāḥid", "اثنان|ithnān", "ثلاثة|thalātha", "أربعة|arbaʿa", "خمسة|khamsa", "ستة|sitta", "سبعة|sabʿa", "ثمانية|thamāniya", "تسعة|tisʿa", "عشرة|ʿashara",
    "أم|umm", "أب|ab", "أخ|akh", "صديق|ṣadīq", "ماء|māʾ", "قهوة|qahwa", "خبز|khubz", "بيت|bayt", "كم الثمن؟|kam ath-thaman?", "أين الحمام؟|ayna al-ḥammām?"],
  "ru-RU": ["Привет|privet", "Доброе утро|dobroye utro", "Спокойной ночи|spokoynoy nochi", "До свидания|do svidaniya", "Пожалуйста|pozhaluysta", "Спасибо|spasibo", "Не за что|ne za chto", "Извините|izvinite", "Да|da", "Нет|net",
    "Как дела?|kak dela?", "У меня всё хорошо|u menya vsyo khorosho", "Как тебя зовут?|kak tebya zovut?", "Меня зовут Анна|menya zovut Anna", "Очень приятно|ochen' priyatno", "Откуда ты?|otkuda ty?", "Я из Колумбии|ya iz Kolumbii", "Я не понимаю|ya ne ponimayu", "Ты говоришь по-испански?|ty govorish' po-ispanski?", "До встречи|do vstrechi",
    "один|odin", "два|dva", "три|tri", "четыре|chetyre", "пять|pyat'", "шесть|shest'", "семь|sem'", "восемь|vosem'", "девять|devyat'", "десять|desyat'",
    "мать|mat'", "отец|otets", "брат|brat", "друг|drug", "вода|voda", "кофе|kofe", "хлеб|khleb", "дом|dom", "Сколько это стоит?|skol'ko eto stoit?", "Где туалет?|gde tualet?"],
  "hi-IN": ["नमस्ते|namaste", "सुप्रभात|suprabhāt", "शुभ रात्रि|shubh rātri", "अलविदा|alvidā", "कृपया|kripayā", "धन्यवाद|dhanyavād", "कोई बात नहीं|koī bāt nahīṁ", "माफ़ कीजिए|māf kījiye", "हाँ|hāṁ", "नहीं|nahīṁ",
    "आप कैसे हैं?|āp kaise haiṁ?", "मैं ठीक हूँ|maiṁ ṭhīk hūṁ", "आपका नाम क्या है?|āpkā nām kyā hai?", "मेरा नाम आना है|merā nām Ānā hai", "आपसे मिलकर खुशी हुई|āpse milkar khushī huī", "आप कहाँ से हैं?|āp kahāṁ se haiṁ?", "मैं कोलंबिया से हूँ|maiṁ Kolambiyā se hūṁ", "मैं नहीं समझा|maiṁ nahīṁ samjhā", "क्या आप स्पेनिश बोलते हैं?|kyā āp Spenish bolte haiṁ?", "फिर मिलेंगे|phir mileṅge",
    "एक|ek", "दो|do", "तीन|tīn", "चार|chār", "पाँच|pāṁch", "छह|chhah", "सात|sāt", "आठ|āṭh", "नौ|nau", "दस|das",
    "माँ|māṁ", "पिता|pitā", "भाई|bhāī", "दोस्त|dost", "पानी|pānī", "कॉफ़ी|kôfī", "रोटी|roṭī", "घर|ghar", "यह कितने का है?|yah kitne kā hai?", "शौचालय कहाँ है?|shauchālay kahāṁ hai?"],
  "tr-TR": ["Merhaba", "Günaydın", "İyi geceler", "Hoşça kal", "Lütfen", "Teşekkür ederim", "Rica ederim", "Özür dilerim", "Evet", "Hayır",
    "Nasılsın?", "İyiyim", "Adın ne?", "Benim adım Ana", "Memnun oldum", "Nerelisin?", "Kolombiyalıyım", "Anlamıyorum", "İspanyolca konuşuyor musun?", "Görüşürüz",
    "bir", "iki", "üç", "dört", "beş", "altı", "yedi", "sekiz", "dokuz", "on",
    "anne", "baba", "erkek kardeş", "arkadaş", "su", "kahve", "ekmek", "ev", "Bu ne kadar?", "Tuvalet nerede?"],
  "nl-NL": ["Hallo", "Goedemorgen", "Goedenacht", "Tot ziens", "Alstublieft", "Dank je", "Graag gedaan", "Het spijt me", "Ja", "Nee",
    "Hoe gaat het?", "Het gaat goed", "Hoe heet je?", "Ik heet Ana", "Aangenaam", "Waar kom je vandaan?", "Ik kom uit Colombia", "Ik begrijp het niet", "Spreek je Spaans?", "Tot later",
    "een", "twee", "drie", "vier", "vijf", "zes", "zeven", "acht", "negen", "tien",
    "moeder", "vader", "broer", "vriend", "water", "koffie", "brood", "huis", "Hoeveel kost het?", "Waar is het toilet?"],
  "sv-SE": ["Hej", "God morgon", "God natt", "Hej då", "Snälla", "Tack", "Varsågod", "Förlåt", "Ja", "Nej",
    "Hur mår du?", "Jag mår bra", "Vad heter du?", "Jag heter Ana", "Trevligt att träffas", "Var kommer du ifrån?", "Jag kommer från Colombia", "Jag förstår inte", "Talar du spanska?", "Vi ses senare",
    "ett", "två", "tre", "fyra", "fem", "sex", "sju", "åtta", "nio", "tio",
    "mor", "far", "bror", "vän", "vatten", "kaffe", "bröd", "hus", "Hur mycket kostar det?", "Var är toaletten?"],
  "nb-NO": ["Hei", "God morgen", "God natt", "Ha det", "Vær så snill", "Takk", "Bare hyggelig", "Beklager", "Ja", "Nei",
    "Hvordan har du det?", "Jeg har det bra", "Hva heter du?", "Jeg heter Ana", "Hyggelig å møte deg", "Hvor kommer du fra?", "Jeg kommer fra Colombia", "Jeg forstår ikke", "Snakker du spansk?", "Vi ses senere",
    "en", "to", "tre", "fire", "fem", "seks", "sju", "åtte", "ni", "ti",
    "mor", "far", "bror", "venn", "vann", "kaffe", "brød", "hus", "Hvor mye koster det?", "Hvor er toalettet?"],
  "da-DK": ["Hej", "Godmorgen", "Godnat", "Farvel", "Vær så venlig", "Tak", "Selv tak", "Undskyld", "Ja", "Nej",
    "Hvordan har du det?", "Jeg har det godt", "Hvad hedder du?", "Jeg hedder Ana", "Rart at møde dig", "Hvor kommer du fra?", "Jeg kommer fra Colombia", "Jeg forstår ikke", "Taler du spansk?", "Vi ses senere",
    "en", "to", "tre", "fire", "fem", "seks", "syv", "otte", "ni", "ti",
    "mor", "far", "bror", "ven", "vand", "kaffe", "brød", "hus", "Hvad koster det?", "Hvor er toilettet?"],
  "pl-PL": ["Cześć", "Dzień dobry", "Dobranoc", "Do widzenia", "Proszę", "Dziękuję", "Nie ma za co", "Przepraszam", "Tak", "Nie",
    "Jak się masz?", "Mam się dobrze", "Jak masz na imię?", "Mam na imię Ana", "Miło mi", "Skąd jesteś?", "Jestem z Kolumbii", "Nie rozumiem", "Czy mówisz po hiszpańsku?", "Do zobaczenia",
    "jeden", "dwa", "trzy", "cztery", "pięć", "sześć", "siedem", "osiem", "dziewięć", "dziesięć",
    "matka", "ojciec", "brat", "przyjaciel", "woda", "kawa", "chleb", "dom", "Ile to kosztuje?", "Gdzie jest toaleta?"],
  "el-GR": ["Γεια σου|ya su", "Καλημέρα|kaliméra", "Καληνύχτα|kaliníchta", "Αντίο|adío", "Παρακαλώ|parakaló", "Ευχαριστώ|efcharistó", "Τίποτα|típota", "Συγγνώμη|signómi", "Ναι|ne", "Όχι|óchi",
    "Τι κάνεις;|ti kánis?", "Είμαι καλά|íme kalá", "Πώς σε λένε;|pos se léne?", "Με λένε Άννα|me léne Ána", "Χάρηκα|chárika", "Από πού είσαι;|apó pu íse?", "Είμαι από την Κολομβία|íme apó tin Kolomvía", "Δεν καταλαβαίνω|den katalavéno", "Μιλάς ισπανικά;|milás ispaniká?", "Τα λέμε αργότερα|ta léme argótera",
    "ένα|éna", "δύο|dío", "τρία|tría", "τέσσερα|téssera", "πέντε|pénde", "έξι|éxi", "επτά|eptá", "οκτώ|októ", "εννέα|ennéa", "δέκα|déka",
    "μητέρα|mitéra", "πατέρας|patéras", "αδελφός|adelfós", "φίλος|fílos", "νερό|neró", "καφές|kafés", "ψωμί|psomí", "σπίτι|spíti", "Πόσο κοστίζει;|póso kostízi?", "Πού είναι η τουαλέτα;|pu íne i tualéta?"],
  "he-IL": ["שלום|shalom", "בוקר טוב|boker tov", "לילה טוב|laila tov", "להתראות|lehitraot", "בבקשה|bevakasha", "תודה|toda", "אין בעד מה|ein be'ad ma", "סליחה|slicha", "כן|ken", "לא|lo",
    "מה שלומך?|ma shlomkha?", "אני בסדר|ani beseder", "איך קוראים לך?|eikh kor'im lekha?", "קוראים לי אנה|kor'im li Ana", "נעים מאוד|na'im me'od", "מאיפה אתה?|me'eifo ata?", "אני מקולומביה|ani mi-Kolombia", "אני לא מבין|ani lo mevin", "אתה מדבר ספרדית?|ata medaber sfaradit?", "נתראה אחר כך|nitra'e achar kach",
    "אחת|achat", "שתיים|shtayim", "שלוש|shalosh", "ארבע|arba", "חמש|chamesh", "שש|shesh", "שבע|sheva", "שמונה|shmone", "תשע|tesha", "עשר|eser",
    "אמא|ima", "אבא|aba", "אח|ach", "חבר|chaver", "מים|mayim", "קפה|kafe", "לחם|lechem", "בית|bayit", "כמה זה עולה?|kama ze ole?", "איפה השירותים?|eifo ha-sherutim?"],
  "vi-VN": ["Xin chào", "Chào buổi sáng", "Chúc ngủ ngon", "Tạm biệt", "Làm ơn", "Cảm ơn", "Không có gì", "Xin lỗi", "Vâng", "Không",
    "Bạn khỏe không?", "Tôi khỏe", "Bạn tên là gì?", "Tôi tên là Ana", "Rất vui được gặp bạn", "Bạn đến từ đâu?", "Tôi đến từ Colombia", "Tôi không hiểu", "Bạn có nói tiếng Tây Ban Nha không?", "Hẹn gặp lại",
    "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín", "mười",
    "mẹ", "bố", "anh trai", "bạn", "nước", "cà phê", "bánh mì", "nhà", "Cái này bao nhiêu tiền?", "Nhà vệ sinh ở đâu?"],
  "th-TH": ["สวัสดี|sawatdee", "อรุณสวัสดิ์|arun sawat", "ราตรีสวัสดิ์|ratri sawat", "ลาก่อน|la kon", "กรุณา|karuna", "ขอบคุณ|khop khun", "ไม่เป็นไร|mai pen rai", "ขอโทษ|kho thot", "ใช่|chai", "ไม่ใช่|mai chai",
    "สบายดีไหม|sabai dee mai?", "สบายดี|sabai dee", "คุณชื่ออะไร|khun chue arai?", "ฉันชื่ออานา|chan chue Ana", "ยินดีที่ได้รู้จัก|yindee thi dai ruchak", "คุณมาจากไหน|khun ma chak nai?", "ฉันมาจากโคลอมเบีย|chan ma chak Kholombia", "ฉันไม่เข้าใจ|chan mai khao jai", "คุณพูดภาษาสเปนได้ไหม|khun phut phasa Sapen dai mai?", "แล้วพบกันใหม่|laeo phop kan mai",
    "หนึ่ง|nueng", "สอง|song", "สาม|sam", "สี่|si", "ห้า|ha", "หก|hok", "เจ็ด|chet", "แปด|paet", "เก้า|kao", "สิบ|sip",
    "แม่|mae", "พ่อ|pho", "พี่ชาย|phi chai", "เพื่อน|phuean", "น้ำ|nam", "กาแฟ|kafae", "ขนมปัง|khanompang", "บ้าน|ban", "ราคาเท่าไหร่|rakha thao rai?", "ห้องน้ำอยู่ที่ไหน|hong nam yu thi nai?"],
  "id-ID": ["Halo", "Selamat pagi", "Selamat tidur", "Selamat tinggal", "Tolong", "Terima kasih", "Sama-sama", "Maaf", "Ya", "Tidak",
    "Apa kabar?", "Kabar baik", "Siapa nama kamu?", "Nama saya Ana", "Senang bertemu dengan Anda", "Kamu dari mana?", "Saya dari Kolombia", "Saya tidak mengerti", "Apakah kamu bisa berbahasa Spanyol?", "Sampai jumpa",
    "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh",
    "ibu", "ayah", "saudara laki-laki", "teman", "air", "kopi", "roti", "rumah", "Berapa harganya?", "Di mana kamar mandi?"],
  "sw-KE": ["Hujambo", "Habari za asubuhi", "Usiku mwema", "Kwaheri", "Tafadhali", "Asante", "Karibu", "Samahani", "Ndiyo", "Hapana",
    "Habari yako?", "Nzuri", "Jina lako ni nani?", "Jina langu ni Ana", "Nimefurahi kukutana nawe", "Unatoka wapi?", "Ninatoka Kolombia", "Sielewi", "Unazungumza Kihispania?", "Tutaonana baadaye",
    "moja", "mbili", "tatu", "nne", "tano", "sita", "saba", "nane", "tisa", "kumi",
    "mama", "baba", "kaka", "rafiki", "maji", "kahawa", "mkate", "nyumba", "Bei gani?", "Choo kiko wapi?"],
  "uk-UA": ["Привіт|pryvit", "Доброго ранку|dobroho ranku", "На добраніч|na dobranich", "До побачення|do pobachennia", "Будь ласка|bud' laska", "Дякую|diakuiu", "Нема за що|nema za shcho", "Вибачте|vybachte", "Так|tak", "Ні|ni",
    "Як справи?|yak spravy?", "У мене все добре|u mene vse dobre", "Як тебе звати?|yak tebe zvaty?", "Мене звати Ана|mene zvaty Ana", "Приємно познайомитися|pryiemno poznaiomytysia", "Звідки ти?|zvidky ty?", "Я з Колумбії|ya z Kolumbii", "Я не розумію|ya ne rozumiiu", "Ти говориш іспанською?|ty hovorysh ispanskoiu?", "До зустрічі|do zustrichi",
    "один|odyn", "два|dva", "три|try", "чотири|chotyry", "п'ять|p'iat'", "шість|shist'", "сім|sim", "вісім|visim", "дев'ять|dev'iat'", "десять|desiat'",
    "мати|maty", "батько|bat'ko", "брат|brat", "друг|druh", "вода|voda", "кава|kava", "хліб|khlib", "дім|dim", "Скільки це коштує?|skil'ky tse koshtuie?", "Де туалет?|de tualet?"],
  "ro-RO": ["Salut", "Bună dimineața", "Noapte bună", "La revedere", "Vă rog", "Mulțumesc", "Cu plăcere", "Îmi pare rău", "Da", "Nu",
    "Ce mai faci?", "Sunt bine", "Cum te cheamă?", "Mă numesc Ana", "Încântat de cunoștință", "De unde ești?", "Sunt din Columbia", "Nu înțeleg", "Vorbești spaniolă?", "Pe curând",
    "unu", "doi", "trei", "patru", "cinci", "șase", "șapte", "opt", "nouă", "zece",
    "mamă", "tată", "frate", "prieten", "apă", "cafea", "pâine", "casă", "Cât costă?", "Unde este toaleta?"],
  "cs-CZ": ["Ahoj", "Dobré ráno", "Dobrou noc", "Na shledanou", "Prosím", "Děkuji", "Není zač", "Promiňte", "Ano", "Ne",
    "Jak se máš?", "Mám se dobře", "Jak se jmenuješ?", "Jmenuji se Ana", "Těší mě", "Odkud jsi?", "Jsem z Kolumbie", "Nerozumím", "Mluvíš španělsky?", "Uvidíme se později",
    "jedna", "dva", "tři", "čtyři", "pět", "šest", "sedm", "osm", "devět", "deset",
    "matka", "otec", "bratr", "přítel", "voda", "káva", "chléb", "dům", "Kolik to stojí?", "Kde je toaleta?"],
  "fi-FI": ["Hei", "Hyvää huomenta", "Hyvää yötä", "Näkemiin", "Ole kiltti", "Kiitos", "Ole hyvä", "Anteeksi", "Kyllä", "Ei",
    "Mitä kuuluu?", "Hyvää kuuluu", "Mikä sinun nimesi on?", "Nimeni on Ana", "Hauska tavata", "Mistä olet kotoisin?", "Olen Kolumbiasta", "En ymmärrä", "Puhutko espanjaa?", "Nähdään myöhemmin",
    "yksi", "kaksi", "kolme", "neljä", "viisi", "kuusi", "seitsemän", "kahdeksan", "yhdeksän", "kymmenen",
    "äiti", "isä", "veli", "ystävä", "vesi", "kahvi", "leipä", "talo", "Paljonko se maksaa?", "Missä on vessa?"],
  "fa-IR": ["سلام|salâm", "صبح بخیر|sobh bekheyr", "شب بخیر|shab bekheyr", "خداحافظ|khodâhâfez", "لطفاً|lotfan", "ممنون|mamnun", "خواهش می‌کنم|khâhesh mikonam", "ببخشید|bebakhshid", "بله|bale", "نه|na",
    "حالت چطوره؟|hâlet chetore?", "خوبم|khubam", "اسمت چیه؟|esmet chiye?", "اسم من آناست|esm-e man Ânâst", "از آشنایی‌ات خوشحالم|az âshnâyi-at khoshhâlam", "اهل کجایی؟|ahl-e kojâyi?", "من اهل کلمبیا هستم|man ahl-e Kolombiyâ hastam", "نمی‌فهمم|nemifahmam", "اسپانیایی صحبت می‌کنی؟|espâniyâyi sohbat mikoni?", "بعداً می‌بینمت|ba'dan mibinamet",
    "یک|yek", "دو|do", "سه|se", "چهار|chahâr", "پنج|panj", "شش|shesh", "هفت|haft", "هشت|hasht", "نُه|noh", "ده|dah",
    "مادر|mâdar", "پدر|pedar", "برادر|barâdar", "دوست|dust", "آب|âb", "قهوه|qahve", "نان|nân", "خانه|khâne", "قیمتش چنده؟|qeymatesh chande?", "دستشویی کجاست؟|dastshuyi kojâst?"],
  "ca-ES": ["Hola", "Bon dia", "Bona nit", "Adéu", "Si us plau", "Gràcies", "De res", "Ho sento", "Sí", "No",
    "Com estàs?", "Estic bé", "Com et dius?", "Em dic Ana", "Encantat", "D'on ets?", "Sóc de Colòmbia", "No ho entenc", "Parles castellà?", "Fins després",
    "u", "dos", "tres", "quatre", "cinc", "sis", "set", "vuit", "nou", "deu",
    "mare", "pare", "germà", "amic", "aigua", "cafè", "pa", "casa", "Quant costa?", "On és el lavabo?"],
  "bn-IN": ["নমস্কার|nomoshkar", "সুপ্রভাত|suprobhat", "শুভ রাত্রি|shubho ratri", "বিদায়|biday", "দয়া করে|doya kore", "ধন্যবাদ|dhonnobad", "কোনো ব্যাপার না|kono byapar na", "দুঃখিত|dukkhito", "হ্যাঁ|hyan", "না|na",
    "আপনি কেমন আছেন?|apni kemon achhen?", "আমি ভালো আছি|ami bhalo achhi", "আপনার নাম কী?|apnar nam ki?", "আমার নাম আনা|amar nam Ana", "আপনার সাথে পরিচিত হয়ে ভালো লাগলো|apnar sathe porichito hoye bhalo laglo", "আপনি কোথা থেকে এসেছেন?|apni kotha theke eshechhen?", "আমি কলম্বিয়া থেকে এসেছি|ami Kolombia theke eshechhi", "আমি বুঝতে পারছি না|ami bujhte parchhi na", "আপনি কি স্প্যানিশ বলতে পারেন?|apni ki Spanish bolte paren?", "পরে দেখা হবে|pore dekha hobe",
    "এক|ek", "দুই|dui", "তিন|tin", "চার|char", "পাঁচ|panch", "ছয়|chhoy", "সাত|sat", "আট|at", "নয়|noy", "দশ|dosh",
    "মা|ma", "বাবা|baba", "ভাই|bhai", "বন্ধু|bondhu", "জল|jol", "কফি|kofi", "রুটি|ruti", "বাড়ি|bari", "এটার দাম কত?|etar dam koto?", "বাথরুম কোথায়?|bathroom kothay?"],
};

export interface Phrase {
  es: string;
  text: string;
  roman?: string;
}

export function phrasesFor(lang: string, categories: number[]): Phrase[] {
  const list = PHRASES[lang];
  if (!list) return [];
  return categories.flatMap((ci) => {
    const c = CATEGORIES[ci];
    return list.slice(c.from, c.to).map((raw, i) => {
      const [text, roman] = raw.split("|");
      return { es: SPANISH[c.from + i], text, roman };
    });
  });
}

/** Frases que el administrador escribe en la lección, debajo de "### Práctica", con el formato "frase | traducción". */
export function phrasesFromContent(content: string): Phrase[] {
  const i = content.search(/^###\s*Práctica/im);
  if (i < 0) return [];
  const block = content.slice(i).split("\n").slice(1);
  const out: Phrase[] = [];
  for (const line of block) {
    if (/^#{1,3}\s/.test(line)) break;
    const parts = line.replace(/^\s*[-*]\s*/, "").split("|").map((s) => s.trim());
    if (parts.length >= 2 && parts[0] && parts[1]) out.push({ text: parts[0], es: parts[1], roman: parts[2] || undefined });
  }
  return out;
}
