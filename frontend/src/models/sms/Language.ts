export enum Language {
    Afrikaans = "af",
    Albanian = "sq",
    Arabic = "ar",
    Azerbaijani = "az",
    Bengali = "bn",
    Bulgarian = "bg",
    Catalan = "ca",
    Chinese_Simplified = "zh_CN",
    Chinese_Hong_Kong = "zh_HK",
    Chinese_Taiwan = "zh_TW",
    Croatian = "hr",
    Czech = "cs",
    Danish = "da",
    Dutch = "nl",
    English = "en",
    English_UK = "en_GB",
    English_US = "en_US",
    Estonian = "et",
    Filipino = "fil",
    Finnish = "fi",
    French = "fr",
    Georgian = "ka",
    German = "de",
    Greek = "el",
    Gujarati = "gu",
    Hausa = "ha",
    Hebrew = "he",
    Hindi = "hi",
    Hungarian = "hu",
    Indonesian = "id",
    Irish = "ga",
    Italian = "it",
    Japanese = "ja",
    Kannada = "kn",
    Kazakh = "kk",
    Kinyarwanda = "rw_RW",
    Korean = "ko",
    Kyrgyz = "ky_KG",
    Lao = "lo",
    Latvian = "lv",
    Lithuanian = "lt",
    Macedonian = "mk",
    Malay = "ms",
    Malayalam = "ml",
    Marathi = "mr",
    Norwegian_Bokmal = "nb",
    Persian = "fa",
    Polish = "pl",
    Portuguese_Brazil = "pt_BR",
    Portuguese_Portugal = "pt_PT",
    Punjabi = "pa",
    Romanian = "ro",
    Russian = "ru",
    Serbian = "sr",
    Slovak = "sk",
    Slovenian = "sl",
    Spanish = "es",
    Spanish_Argentina = "es_AR",
    Spanish_Spain = "es_ES",
    Spanish_Mexico = "es_MX",
    Swahili = "sw",
    Swedish = "sv",
    Tamil = "ta",
    Telugu = "te",
    Thai = "th",
    Turkish = "tr",
    Ukrainian = "uk",
    Urdu = "ur",
    Uzbek = "uz",
    Vietnamese = "vi",
    Zulu = "zu",
    Unknown = "unknown"
}

export function getLanguageName(languageCode: string): string {
    for (const key in Language) {
        if (Language.hasOwnProperty(key)) {
            if (Language[key as keyof typeof Language] === languageCode) {
                return key;
            }
        }
    }
    return "unknown";
}

export function extractPlaceholders(template: string): string[] {
    console.log("Template before processing: ", template);
    const placeholders: string[] = [];
    const placeholderRegex = /\{(\w+)\}/g; 
    let match;
    while ((match = placeholderRegex.exec(template)) !== null) {
        placeholders.push(match[1]); 
    }
    return placeholders;
}
