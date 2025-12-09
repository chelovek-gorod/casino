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
        es: '     Cercanía:',
        de: ' Nächste Zahl:',
        pt: '     Próximos:',
        fr: '      Proches:',
        pl: '     Sąsiedzi:',
        id: '       Terdkt:',
        ms: '     Terdekat:'
    },
    spielSplits: {
        ru: 'Ставки по секторам:',
        en: '       Sector Bets:',
        tr: '  Sektör Bahisleri:',
        es: ' Apuestas x sector:',
        de: '      Sektorwetten:',
        pt: ' Apostas por setor:',
        fr: ' Paris par secteur:',
        pl: ' Zakłady sektorowe:',
        id: '    Taruhan Sektor:',
        ms: ' Pertaruhan Sektor:'
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