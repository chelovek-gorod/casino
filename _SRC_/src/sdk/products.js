

const CURRENCY = {
    USD: 1, // Базовая валюта
    YAN: 77, // USD
    EUR: 0.85 // USD
}

export const PURCHASES = {
    noAds: 'noAds',

    add2k: 'add2k',
    add7k: 'add7k',
    add25k: 'add25k',
    add80k: 'add80k',
    add250k: 'add250k',
    add750k: 'add750k',
}

const PURCHASES_HANDLERS = {
    [PURCHASES.noAds]: (purchase) => { 
        gameState.adsDisabled = true
        localStorage.setItem('ads_disabled', 'true')
    },
    
    [PURCHASES.add2k]   : (purchase) => { gameState.chips += 2000 },
    [PURCHASES.add7k]   : (purchase) => { gameState.chips += 7000 },
    [PURCHASES.add25k]  : (purchase) => { gameState.chips += 25000 },
    [PURCHASES.add80k]  : (purchase) => { gameState.chips += 80000 },
    [PURCHASES.add250k] : (purchase) => { gameState.chips += 250000 },
    [PURCHASES.add750k] : (purchase) => { gameState.chips += 750000 },
}

// 2. Тексты на всех языках
export const PURCHASE_TEXTS = {
    [PURCHASES.noAds]: {
        title: {
            en: 'No Ads in this game',
            ru: 'Без рекламы в этой игре',
            tr: 'Bu Oyunda Reklam Yok',
            es: 'Sin anuncios en este juego',
            de: 'Keine Werbung in diesem Spiel',
            pt: 'Sem anúncios neste jogo',
            fr: 'Pas de publicité dans ce jeu',
            pl: 'Brak reklam w tej grze',
            id: 'Tidak Ada Iklan di Game Ini',
            ms: 'Tiada Iklan dalam Permainan Ini'
        },
        description: {
            en: 'Disable ads forever in this game',
            ru: 'Отключение рекламы навсегда в этой игре',
            tr: 'Bu oyundaki reklamları kalıcı olarak devre dışı bırakın',
            es: 'Deshabilita los anuncios para siempre en este juego',
            de: 'Werbung dauerhaft in diesem Spiel deaktivieren',
            pt: 'Desative os anúncios para sempre neste jogo',
            fr: 'Désactivez les publicités pour toujours dans ce jeu',
            pl: 'Wyłącz reklamy na zawsze w tej grze',
            id: 'Nonaktifkan iklan selamanya di game ini',
            ms: 'Lumpuhkan iklan selama-lamanya dalam permainan ini'
        }
    },
    [PURCHASES.add2k]: {
        title: {
            en: '2 000 Chips',
            ru: '2 000 фишек',
            tr: '2 000 Çip',
            es: '2 000 Fichas',
            de: '2 000 Chips',
            pt: '2 000 Fichas',
            fr: '2 000 Jetons',
            pl: '2 000 Żetonów',
            id: '2.000 Keping',
            ms: '2,000 Cip'
        },
        description: {
            en: 'A Trial Stack',
            ru: 'Пробная стопка',
            tr: 'Deneme Yığını',
            es: 'Un Montón de Prueba',
            de: 'Ein Teststapel',
            pt: 'Uma Pilha Experimental',
            fr: 'Une Pile d\'Essai',
            pl: 'Próbny Stos',
            id: 'Tumpukan Percobaan',
            ms: 'Timbunan Percubaan'
        }
    },
    [PURCHASES.add7k]: {
        title: {
            en: '7 000 Chips',
            ru: '7 000 фишек',
            tr: '7 000 Çip',
            es: '7 000 Fichas',
            de: '7 000 Chips',
            pt: '7 000 Fichas',
            fr: '7 000 Jetons',
            pl: '7 000 Żetonów',
            id: '7.000 Keping',
            ms: '7,000 Cip'
        },
        description: {
            en: 'Small Pack',
            ru: 'Небольшой пакет',
            tr: 'Küçük Paket',
            es: 'Paquete Pequeño',
            de: 'Kleine Packung',
            pt: 'Pacote Pequeno',
            fr: 'Petit Pack',
            pl: 'Małe Opakowanie',
            id: 'Paket Kecil',
            ms: 'Pek Kecil'
        }
    },
    [PURCHASES.add25k]: {
        title: {
            en: '25 000 Chips',
            ru: '25 000 фишек',
            tr: '25 000 Çip',
            es: '25 000 Fichas',
            de: '25 000 Chips',
            pt: '25 000 Fichas',
            fr: '25 000 Jetons',
            pl: '25 000 Żetonów',
            id: '25.000 Keping',
            ms: '25,000 Cip'
        },
        description: {
            en: 'Reliable Set',
            ru: 'Надёжный набор',
            tr: 'Güvenilir Set',
            es: 'Conjunto Confiable',
            de: 'Zuverlässiges Set',
            pt: 'Conjunto Confiável',
            fr: 'Ensemble Fiable',
            pl: 'Niezawodny Zestaw',
            id: 'Set yang Andal',
            ms: 'Set yang Boleh Dipercayai'
        }
    },
    [PURCHASES.add80k]: {
        title: {
            en: '80 000 Chips',
            ru: '80 000 фишек',
            tr: '80 000 Çip',
            es: '80 000 Fichas',
            de: '80 000 Chips',
            pt: '80 000 Fichas',
            fr: '80 000 Jetons',
            pl: '80 000 Żetonów',
            id: '80.000 Keping',
            ms: '80,000 Cip'
        },
        description: {
            en: 'Solid Box',
            ru: 'Солидный ящик',
            tr: 'Sağlam Kutu',
            es: 'Caja Sólida',
            de: 'Solide Kiste',
            pt: 'Caixa Sólida',
            fr: 'Boîte Solide',
            pl: 'Solidne Pudełko',
            id: 'Kotak Kokoh',
            ms: 'Kotak Kukuh'
        }
    },
    [PURCHASES.add250k]: {
        title: {
            en: '250 000 Chips',
            ru: '250 000 фишек',
            tr: '250 000 Çip',
            es: '250 000 Fichas',
            de: '250 000 Chips',
            pt: '250 000 Fichas',
            fr: '250 000 Jetons',
            pl: '250 000 Żetonów',
            id: '250.000 Keping',
            ms: '250,000 Cip'
        },
        description: {
            en: 'Bank of chips',
            ru: 'Банк фишек',
            tr: 'Çip bankası',
            es: 'Banco de fichas',
            de: 'Chip-Bank',
            pt: 'Banco de fichas',
            fr: 'Banque de jetons',
            pl: 'Bank żetonów',
            id: 'Bank keping',
            ms: 'Bank cip'
        }
    },
    [PURCHASES.add750k]: {
        title: {
            en: '750 000 Chips',
            ru: '750 000 фишек',
            tr: '750 000 Çip',
            es: '750 000 Fichas',
            de: '750 000 Chips',
            pt: '750 000 Fichas',
            fr: '750 000 Jetons',
            pl: '750 000 Żetonów',
            id: '750.000 Keping',
            ms: '750,000 Cip'
        },
        description: {
            en: 'Bottomless Supply',
            ru: 'Неиссякаемый запас',
            tr: 'Tükenmeyen Stok',
            es: 'Suministro Inagotable',
            de: 'Unerschöpflicher Vorrat',
            pt: 'Fornecimento Inesgotável',
            fr: 'Réserve Inépuisable',
            pl: 'Niewyczerpane Zapasy',
            id: 'Persediaan Tak Terbatas',
            ms: 'Bekalan Tak Terhingga'
        }
    },
}

// 3. БАЗОВЫЕ товары в USD
export const baseProducts = {
    [PURCHASES.noAds]: {
        priceUSD: 2,
        type: 'permanent',
        category: 'service'
    },

    [PURCHASES.add2k]: {
        priceUSD: 0.30,
        type: 'consumable',
        category: 'currency'
    },
    [PURCHASES.add7k]: {
        priceUSD: 0.84,
        type: 'consumable',
        category: 'currency'
    },
    [PURCHASES.add25k]: {
        priceUSD: 2.63,
        type: 'consumable',
        category: 'currency'
    },
    [PURCHASES.add80k]: {
        priceUSD: 7.20,
        type: 'consumable',
        category: 'currency'
    },
    [PURCHASES.add250k]: {
        priceUSD: 18.75,
        type: 'consumable',
        category: 'currency'
    },
    [PURCHASES.add750k]: {
        priceUSD: 45.00,
        type: 'consumable',
        category: 'currency'
    }
}

export function getPriceYAN(key) {
    const priceYAN = baseProducts[key].priceUSD * CURRENCY.YAN
    return Math.round(priceYAN) + ' YAN'
}

// Функция конвертации
function convertProduct(productId, targetCurrency, lang = 'ru') {
    const base = baseProducts[productId]
    const text = PURCHASE_TEXTS[productId]
    const price = base.priceUSD * CURRENCY[targetCurrency]
    
    return {
        id: productId,
        title: text?.title?.[lang] || productId,
        description: text?.description?.[lang] || '',
        price: Math.round(price).toString(),
        priceValue: Math.round(price),
        currency: targetCurrency,
        type: base.type,
        category: base.category
    }
}

// Экспортируем ВСЁ что нужно
export const productsConfig = {
    // Для Яндекса (YAN)
    getForYandex: (lang = 'ru') => 
        Object.keys(baseProducts).map(id => convertProduct(id, 'YAN', lang)),
    
    // Для Google Play (USD)
    getForGooglePlay: (lang = 'en') =>
        Object.keys(baseProducts).map(id => convertProduct(id, 'USD', lang)),
    
    // Конкретный товар для любой платформы
    getProduct: (productId, platform, lang = 'ru') => {
        const currency = platform === 'yandex' ? 'YAN' : 'USD'
        return convertProduct(productId, currency, lang)
    },
    
    // Все обработчики покупок
    handlers: PURCHASES_HANDLERS
}