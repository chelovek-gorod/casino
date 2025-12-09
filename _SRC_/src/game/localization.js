import { updateLanguage } from "../app/events"
import { STORED_KEYS, updateStoredData } from "./storage"

const SUPPORTED_LANGUAGES = ['en', 'ru', 'tr', 'es', 'de', 'pt', 'fr', 'pl', 'id', 'ms']

const LANGUAGE_NAMES = {
    en: {
        en: 'English',
        ru: 'Английский',
        tr: 'İngilizce',
        es: 'Inglés',
        de: 'Englisch',
        pt: 'Inglês',
        fr: 'Anglais',
        pl: 'Angielski',
        id: 'Inggris',
        ms: 'Inggeris'
    },
    ru: {
        en: 'Russian',
        ru: 'Русский',
        tr: 'Rusça',
        es: 'Ruso',
        de: 'Russisch',
        pt: 'Russo',
        fr: 'Russe',
        pl: 'Rosyjski',
        id: 'Rusia',
        ms: 'Rusia'
    },
    tr: {
        en: 'Turkish',
        ru: 'Турецкий',
        tr: 'Türkçe',
        es: 'Turco',
        de: 'Türkisch',
        pt: 'Turco',
        fr: 'Turc',
        pl: 'Turecki',
        id: 'Turki',
        ms: 'Turki'
    },
    es: {
        en: 'Spanish',
        ru: 'Испанский',
        tr: 'İspanyolca',
        es: 'Español',
        de: 'Spanisch',
        pt: 'Espanhol',
        fr: 'Espagnol',
        pl: 'Hiszpański',
        id: 'Spanyol',
        ms: 'Sepanyol'
    },
    de: {
        en: 'German',
        ru: 'Немецкий',
        tr: 'Almanca',
        es: 'Alemán',
        de: 'Deutsch',
        pt: 'Alemão',
        fr: 'Allemand',
        pl: 'Niemiecki',
        id: 'Jerman',
        ms: 'Jerman'
    },
    pt: {
        en: 'Portuguese',
        ru: 'Португальский',
        tr: 'Portekizce',
        es: 'Portugués',
        de: 'Portugiesisch',
        pt: 'Português',
        fr: 'Portugais',
        pl: 'Portugalski',
        id: 'Portugis',
        ms: 'Portugis'
    },
    fr: {
        en: 'French',
        ru: 'Французский',
        tr: 'Fransızca',
        es: 'Francés',
        de: 'Französisch',
        pt: 'Francês',
        fr: 'Français',
        pl: 'Francuski',
        id: 'Prancis',
        ms: 'Perancis'
    },
    pl: {
        en: 'Polish',
        ru: 'Польский',
        tr: 'Lehçe',
        es: 'Polaco',
        de: 'Polnisch',
        pt: 'Polonês',
        fr: 'Polonais',
        pl: 'Polski',
        id: 'Polandia',
        ms: 'Poland'
    },
    id: {
        en: 'Indonesian',
        ru: 'Индонезийский',
        tr: 'Endonezce',
        es: 'Indonesio',
        de: 'Indonesisch',
        pt: 'Indonésio',
        fr: 'Indonésien',
        pl: 'Indonezyjski',
        id: 'Indonesia',
        ms: 'Indonesia'
    },
    ms: {
        en: 'Malay',
        ru: 'Малайский',
        tr: 'Malayca',
        es: 'Malayo',
        de: 'Malaiisch',
        pt: 'Malaio',
        fr: 'Malais',
        pl: 'Malajski',
        id: 'Melayu',
        ms: 'Melayu'
    }
}

const LANGUAGE_MAP = {
    // --- Русский (ru) ---
    ru: 'ru', by: 'ru', ua: 'ru', md: 'ru', kz: 'ru', kg: 'ru', tj: 'ru', uz: 'ru',
    am: 'ru', ge: 'ru', az: 'ru', ee: 'ru', lv: 'ru', lt: 'ru',

    // --- Турецкий (tr) ---
    tr: 'tr', cy: 'tr', // Северный Кипр
    // Туркменистан ближе к турецкому, чем к русскому сейчас
    tm: 'tr',

    // --- Испанский (es) ---
    es: 'es', mx: 'es', ar: 'es', cl: 'es', co: 'es', pe: 'es', ve: 'es', uy: 'es', py: 'es', ec: 'es',
    bo: 'es', gt: 'es', hn: 'es', sv: 'es', ni: 'es', cr: 'es', pa: 'es', do: 'es', pr: 'es', gq: 'es',

    // --- Немецкий (de) ---
    de: 'de', at: 'de', ch: 'de', li: 'de', lu: 'de', be: 'de' /* Бельгия частично → но DE лучше для игр */,

    // --- Португальский (pt) ---
    pt: 'pt', br: 'pt', ao: 'pt', mz: 'pt', cv: 'pt', gw: 'pt', st: 'pt', tl: 'pt',

    // --- Французский (fr) ---
    fr: 'fr', mc: 'fr', ca: 'fr', bf: 'fr', bj: 'fr', cd: 'fr', cg: 'fr', ci: 'fr', cm: 'fr',
    dj: 'fr', ga: 'fr', gn: 'fr', mg: 'fr', ml: 'fr', mr: 'fr', ne: 'fr', rw: 'fr',
    sc: 'fr', sn: 'fr', td: 'fr', tg: 'fr', km: 'fr', bi: 'fr', cf: 'fr',

    // --- Польский (pl) ---
    pl: 'pl',

    // --- Индонезийский (id) ---
    id: 'id', // Индонезия
    tl: 'id', // Тимор-Лесте – частично
    // NOTE: Малайзия/Бруней – другой язык → ms

    // --- Малайский (ms) ---
    ms: 'ms', my: 'ms', bn: 'ms', sg: 'ms', // Сингапур частично малайский официальный

    // --- Английский (en) — default для всех остальных ---
    en: 'en', us: 'en', gb: 'en', au: 'en', nz: 'en', ie: 'en', mt: 'en',
    in: 'en', pk: 'en', bd: 'en', ph: 'en', ng: 'en', za: 'en', gh: 'en', ke: 'en', tz: 'en', ug: 'en', 
    jm: 'en', tt: 'en', bs: 'en', bb: 'en',
    il: 'en', sa: 'en', ae: 'en', kw: 'en', qa: 'en', bh: 'en', om: 'en', jo: 'en', lb: 'en', iq: 'en', sy: 'en',
    ir: 'en', af: 'en',
    cn: 'en', jp: 'en', kr: 'en', kp: 'en', mn: 'en',

    // Юго-Восточная Азия
    th: 'en', vn: 'en', la: 'en', kh: 'en', mm: 'en',

    // Европа (оставшиеся)
    it: 'en', sm: 'en', va: 'en',
    nl: 'en', dk: 'en', no: 'en', se: 'en', fi: 'en', is: 'en',
    cz: 'en', sk: 'en', hu: 'en', ro: 'en', bg: 'en', hr: 'en', rs: 'en', ba: 'en', mk: 'en', al: 'en', si: 'en', 
    md: 'en',

    // Америка (остальные)
    ca: 'en', // англоязычная часть
    ht: 'fr', // Гаити
    gf: 'fr',
    sr: 'en',
    gy: 'en',

    // Африка (остальные)
    eg: 'en', ly: 'en', tn: 'en', dz: 'en', ma: 'en',
    sd: 'en', ss: 'en', et: 'en', er: 'en', so: 'en', zm: 'en', zw: 'en', bw: 'en', na: 'en',
    ls: 'en', sz: 'en',

    // Океания
    fk: 'en', pg: 'en', fj: 'en', ws: 'en', to: 'en', tv: 'en', ki: 'en', nr: 'en', vu: 'en',
}

const browserLang = navigator.language || 'en'
let currentLanguage = normalizeLangCode(browserLang)

function normalizeLangCode(langCode) {
    const code = String(langCode || '').toLowerCase()
    const baseCode = code.split('-')[0] //  en-US → en
    const gameCode = LANGUAGE_MAP[code] || LANGUAGE_MAP[baseCode]

    if (gameCode && SUPPORTED_LANGUAGES.includes(gameCode)) {
        return gameCode;
    }

    return 'en'
}

export function setLanguage(langCode, isNeedUpdateStorage = true) {
    const normalized = normalizeLangCode(langCode)
    
    if (currentLanguage === normalized) {
        return currentLanguage 
    }
    
    currentLanguage = normalized

    updateLanguage(currentLanguage)
    
    if (isNeedUpdateStorage) updateStoredData( STORED_KEYS.language )

    return currentLanguage 
}

export function getLanguage() {
    return currentLanguage
}

export function getAvailableLanguages() {
    return SUPPORTED_LANGUAGES.map(code => ({
        code: code,
        name: LANGUAGE_NAMES[code][currentLanguage] || LANGUAGE_NAMES[code]['en']
    }))
}

export function getLanguageName(langCode = null) {
    const code = langCode || currentLanguage
    return LANGUAGE_NAMES[code]?.[currentLanguage] || code
}