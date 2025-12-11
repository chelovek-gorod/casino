import { getPriceYAN, PURCHASES, PURCHASE_TEXTS } from "../../sdk/products"
import { UI, BUTTON } from "../UI/constants"

export const POPUP_TEXT = {
    bet: {
        ru: 'РЕДАКТОР СТАВОК', 
        en: 'BET EDITOR', 
        tr: 'BAHIS DÜZENLEYİCİ', 
        es: 'EDITOR DE APUESTAS', 
        de: 'WETTEDITOR', 
        pt: 'EDITOR DE APOSTAS', 
        fr: 'ÉDITEUR DE PARIS', 
        pl: 'EDYTOR ZAKŁADÓW', 
        id: 'EDITOR TARUHAN', 
        ms: 'EDITOR PERTARUHAN'
    },
    nearest: {
        ru: 'Число соседей:',
        en: 'Nearest count:',
        tr: 'En yakın sayı:',
        es: 'Número más cercano:',
        de: 'Nächste Zahl:',
        pt: 'Número mais próximo:',
        fr: 'Nombre le plus proche:',
        pl: 'Liczba sąsiadów:',
        id: 'Jumlah terdekat:',
        ms: 'Jumlah terdekat:'
    },
    spielSplits: {
        ru: 'Ставки на секторах:',
        en: 'Sector-based bets:',
        tr: 'Sektöre dayalı bahisler:',
        es: 'Apuestas por sectores:',
        de: 'Sektorwetten:',
        pt: 'Apostas por setor:',
        fr: 'Paris par secteur:',
        pl: 'Zakłady sektorowe:',
        id: 'Taruhan berbasis sektor:',
        ms: 'Pertaruhan berdasarkan sektor:'
    },
    spielSplitsValues: [
        {
            ru: 'в номера',
            en: 'straight',
            tr: 'doğrudan',
            es: 'directa',
            de: 'direkt',
            pt: 'direta',
            fr: 'directe',
            pl: 'prosto',
            id: 'langsung',
            ms: 'terus'
        },
        {
            ru: 'сплитами',
            en: ' splits ',
            tr: 'bölünmüş',
            es: 'divididas',
            de: ' geteilt ',
            pt: 'dividida',
            fr: ' splits ',
            pl: 'dzielone',
            id: 'terpisah',
            ms: 'berpecah'
        }
    ],
    logs: {
        ru: 'ИСТОРИЯ РЕЗУЛЬТАТОВ', 
        en: 'LAST RESULTS', 
        tr: 'SONUÇLAR', 
        es: 'ÚLTIMOS RESULTADOS', 
        de: 'LETZTE ERGEBNISSE', 
        pt: 'ÚLTIMOS RESULTADOS', 
        fr: 'DERNIERS RÉSULTATS', 
        pl: 'OSTATNIE WYNIKI', 
        id: 'HASIL TERAKHIR', 
        ms: 'KEPUTUSAN TERAKHIR' 
    },
    settings: {
        ru: 'НАСТРОЙКИ ИГРЫ', 
        en: 'GAME SETTINGS', 
        tr: 'OYUN AYARLARI', 
        es: 'CONFIGURACIÓN DEL JUEGO', 
        de: 'SPIEL-EINSTELLUNGEN', 
        pt: 'CONFIGURAÇÕES DO JOGO', 
        fr: 'PARAMÈTRES DU JEU', 
        pl: 'USTAWIENIA GRY', 
        id: 'PENGATURAN GAME', 
        ms: 'TETAPAN PERMAINAN' 
    },
    addMoney: {
        ru: 'ПОПОЛНЕНИЕ СЧЕТА', 
        en: 'DEPOSIT FUNDS', 
        tr: 'PARA YATIR', 
        es: 'DEPOSITAR FONDOS', 
        de: 'GELD EINZAHLEN', 
        pt: 'ADICIONAR FUNDOS', 
        fr: 'AJOUTER DES FONDS', 
        pl: 'DOŁADUJ KONTO', 
        id: 'ISI SALDO', 
        ms: 'TAMBAH DANA' 
    },
    rulesR: {
        ru: 'ПРАВИЛА РУЛЕТКИ', 
        en: 'ROULETTE RULES', 
        tr: 'RULET KURALLARI', 
        es: 'REGLAS DE LA RULETA', 
        de: 'ROULETTE-REGELN', 
        pt: 'REGRAS DA ROLETA', 
        fr: 'RÈGLES DE LA ROULETTE', 
        pl: 'ZASADY RULETKI', 
        id: 'ATURAN ROULETTE', 
        ms: 'PERATURAN ROULETTE' 
    },
    rulesS: {
        ru: 'ПРАВИЛА СЛОТОВ', 
        en: 'SLOT GAME RULES', 
        tr: 'SLOT KURALLARI', 
        es: 'REGLAS MÁQUINA TRAGAMONEDAS', 
        de: 'SPIELAUTOMATEN-REGELN', 
        pt: 'REGRAS DO SLOT', 
        fr: 'RÈGLES DES MACHINES À SOUS', 
        pl: 'ZASADY SLOTÓW', 
        id: 'ATURAN SLOT', 
        ms: 'PERATURAN SLOT' 
    },

    settingsMusic: {
        ru: 'Громкость музыки:',
        en: 'Music volume:',
        tr: 'Müzik sesi:',
        es: 'Volumen de la música:',
        de: 'Musiklautstärke:',
        pt: 'Volume da música:',
        fr: 'Volume de la musique:',
        pl: 'Głośność muzyki:',
        id: 'Volume musik:',
        ms: 'Kelantangan muzik:'
    },
    settingsSfxOn: {
        ru: 'Звуковые эффекты включены',
        en: 'Sound effects on',
        tr: 'Ses efektleri açık',
        es: 'Efectos de sonido activados',
        de: 'Soundeffekte an',
        pt: 'Efeitos sonoros ligados',
        fr: 'Effets sonores activés',
        pl: 'Efekty dźwiękowe włączone',
        id: 'Efek suara aktif',
        ms: 'Kesan bunyi aktif'
    },
    settingsSfxOff: {
        ru: 'Звуковые эффекты отключены',
        en: 'Sound effects off',
        tr: 'Ses efektleri kapalı',
        es: 'Efectos de sonido desactivados',
        de: 'Soundeffekte aus',
        pt: 'Efeitos sonoros desligados',
        fr: 'Effets sonores désactivés',
        pl: 'Efekty dźwiękowe wyłączone',
        id: 'Efek suara mati',
        ms: 'Kesan bunyi mati'
    },
    settingsLanguage: {
        ru: 'Язык',
        en: 'Language',
        tr: 'Dil',
        es: 'Idioma',
        de: 'Sprache',
        pt: 'Idioma',
        fr: 'Langue',
        pl: 'Język',
        id: 'Bahasa',
        ms: 'Bahasa'
    },
}

export const POPUP_TYPE = {
    EMPTY: '',
    bet: 'bet',
    logs: 'logs',
    settings: 'settings',
    rulesR: 'rulesR',
    rulesS: 'rulesS',
    addMoney: 'addMoney',
}
export const POPUP = {
    width: 480,
    height: 480,
    size: 0,
    margin: 30,
    padding: 20,
    x: 0,
    y: 0,
    sellColor: 0x000000,
    sellAlpha: 0.75,
    bg: UI.bg,
    borderRadius: UI.borderRadius,
    borderWidth: 4,
    borderColor: 0xffffff,
    closeButton: { x: 0, y: 0, scale: 0.5 }
}
POPUP.x = -POPUP.width * 0.5
POPUP.y = -POPUP.height * 0.5
POPUP.size = Math.max(POPUP.width + POPUP.margin * 2, POPUP.height + POPUP.margin * 2)
POPUP.closeButton.y = POPUP.height * 0.5 - POPUP.padding - (BUTTON.height * 0.5) * POPUP.closeButton.scale

export const LOGS = {
    piecesInRow: 12,
    lines: 8,
    max: 0,

    x: 12,
    y: -150,
    
    stepX: 0,
    stepY: 0,

    fontSizes: [30, 22, 18],
}
LOGS.max = LOGS.lines * LOGS.piecesInRow
LOGS.stepX = Math.ceil(POPUP.width / (LOGS.piecesInRow + 2))
LOGS.stepY = LOGS.stepX + 4
LOGS.x += Math.ceil(-POPUP.width * 0.5 + LOGS.stepX)

// shop buttons

export const SHOP_BTN_TYPE = {
    showAd: 'showAd',
    noAds: 'noAds',
    add2k: 'add2k',
    add7k: 'add7k',
    add25k: 'add25k',
    add80k: 'add80k',
    add250k: 'add250k',
    add750k: 'add750k'
}

export const SHOP_BTN_LABEL = {
    [SHOP_BTN_TYPE.showAd]: {
        en: '\n+ 125 Chips for watching an ad',
        ru: '\n+ 125 фишек за просмотр рекламы',
        tr: '\n+ 125 Çip reklam izleyerek',
        es: '\n+ 125 Fichas por ver un anuncio',
        de: '\n+125 Chips für Werbung ansehen',
        pt: '\n+ 125 Fichas por assistir a um anúncio',
        fr: '\n+ 125 Jetons pour regarder une pub',
        pl: '\n+ 125 Żetonów za obejrzenie reklamy',
        id: '\n+ 125 Keping untuk menonton iklan',
        ms: '\n+ 125 Cip untuk menonton iklan'
    },
    [SHOP_BTN_TYPE.noAds]: {
        ru: 'Отключение рекламы',
        en: 'Disable Ads',
        tr: 'Reklamları Kaldır',
        es: 'Desactivar Anuncios',
        de: 'Werbung Deaktivieren',
        pt: 'Desativar Anúncios',
        fr: 'Désactiver les Publicités',
        pl: 'Wyłącz Reklamy',
        id: 'Nonaktifkan Iklan',
        ms: 'Lumpuhkan Iklan'
    },
    [SHOP_BTN_TYPE.add2k]: {
        en: '+ 2 000\nChips',
        ru: '+ 2 000\nфишек',
        tr: '+ 2 000\nÇip',
        es: '+ 2 000\nFichas',
        de: '+ 2 000\nChips',
        pt: '+ 2 000\nFichas',
        fr: '+ 2 000\nJetons',
        pl: '+ 2 000\nŻetonów',
        id: '+ 2.000\nKeping',
        ms: '+ 2,000\nCip'
    },
    [SHOP_BTN_TYPE.add7k]: {
        en: '+ 7 000\nChips',
        ru: '+ 7 000\nфишек',
        tr: '+ 7 000\nÇip',
        es: '+ 7 000\nFichas',
        de: '+ 7 000\nChips',
        pt: '+ 7 000\nFichas',
        fr: '+ 7 000\nJetons',
        pl: '+ 7 000\nŻetonów',
        id: '+ 7.000\nKeping',
        ms: '+ 7,000\nCip'
    },
    [SHOP_BTN_TYPE.add25k]: {
        en: '+ 25 000\nChips',
        ru: '+ 25 000\nфишек',
        tr: '+ 25 000\nÇip',
        es: '+ 25 000\nFichas',
        de: '+ 25 000\nChips',
        pt: '+ 25 000\nFichas',
        fr: '+ 25 000\nJetons',
        pl: '+ 25 000\nŻetonów',
        id: '+ 25.000\nKeping',
        ms: '+ 25,000\nCip'
    },
    [SHOP_BTN_TYPE.add80k]: {
        en: '+ 80 000\nChips',
        ru: '+ 80 000\nфишек',
        tr: '+ 80 000\nÇip',
        es: '+ 80 000\nFichas',
        de: '+ 80 000\nChips',
        pt: '+ 80 000\nFichas',
        fr: '+ 80 000\nJetons',
        pl: '+ 80 000\nŻetonów',
        id: '+ 80.000\nKeping',
        ms: '+ 80,000\nCip'
    },
    [SHOP_BTN_TYPE.add250k]: {
        en: '+ 250 000\nChips',
        ru: '+ 250 000\nфишек',
        tr: '+ 250 000\nÇip',
        es: '+ 250 000\nFichas',
        de: '+ 250 000\nChips',
        pt: '+ 250 000\nFichas',
        fr: '+ 250 000\nJetons',
        pl: '+ 250 000\nŻetonów',
        id: '+ 250.000\nKeping',
        ms: '+ 250,000\nCip'
    },
    [SHOP_BTN_TYPE.add750k]: {
        en: '+ 750 000\nChips',
        ru: '+ 750 000\nфишек',
        tr: '+ 750 000\nÇip',
        es: '+ 750 000\nFichas',
        de: '+ 750 000\nChips',
        pt: '+ 750 000\nFichas',
        fr: '+ 750 000\nJetons',
        pl: '+ 750 000\nŻetonów',
        id: '+ 750.000\nKeping',
        ms: '+ 750,000\nCip'
    },
}

export const SHOP_BTN_PRICE = {
    [SHOP_BTN_TYPE.showAd]: 0,
    [SHOP_BTN_TYPE.noAds]: getPriceYAN(PURCHASES.noAds),
    [SHOP_BTN_TYPE.add2k]: getPriceYAN(PURCHASES.add2k),
    [SHOP_BTN_TYPE.add7k]: getPriceYAN(PURCHASES.add7k),
    [SHOP_BTN_TYPE.add25k]: getPriceYAN(PURCHASES.add25k),
    [SHOP_BTN_TYPE.add80k]: getPriceYAN(PURCHASES.add80k),
    [SHOP_BTN_TYPE.add250k]: getPriceYAN(PURCHASES.add250k),
    [SHOP_BTN_TYPE.add750k]: getPriceYAN(PURCHASES.add750k)
}