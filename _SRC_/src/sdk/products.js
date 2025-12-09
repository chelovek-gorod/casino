

const CURRENCY = {
    USD: 1, // Базовая валюта
    YAN: 77, // USD
    EUR: 0.85 // USD
}

const PURCHASES = {
    noAds: 'noAds',

    add1k: 'add1k',
    add5k: 'add5k',
    add20k: 'add20k',
    add100k: 'add100k',
    add1000k: 'add1000k',
}

const PURCHASES_HANDLERS = {
    [PURCHASES.noAds]: (purchase) => { 
        gameState.adsDisabled = true
        localStorage.setItem('ads_disabled', 'true')
    },
    
    [PURCHASES.add1k]: (purchase) => { gameState.chips += 1000 },
    [PURCHASES.add5k]: (purchase) => { gameState.chips += 5000 },
    [PURCHASES.add20k]: (purchase) => { gameState.chips += 20000 },
    [PURCHASES.add100k]: (purchase) => { gameState.chips += 100000 },
    [PURCHASES.add1000k]: (purchase) => { gameState.chips += 1000000 }
}

// 2. Тексты на всех языках
const PURCHASE_TEXTS = {
    [PURCHASES.noAds]: {
        title: { en: 'No Ads in this game', ru: 'Без рекламы в этой игре' },
        description: { en: 'Disable ads forever in this game', ru: 'Отключение рекламы навсегда в этой игре' }
    },

    [PURCHASES.add1k]: {
        title: { en: '1 000 Chips', ru: '1 000 фишек' },
        description: { en: 'Chips pack', ru: 'Пакет фишек' }
    },
    [PURCHASES.add5k]: {
        title: { en: '5 000 Chips', ru: '5 000 фишек' },
        description: { en: 'Big chips pack', ru: 'Большой пакет фишек' }
    },
    [PURCHASES.add20k]: {
        title: { en: '20 000 Chips', ru: '20 000 фишек' },
        description: { en: 'Chips box', ru: 'Ящик фишек' }
    },
    [PURCHASES.add100k]: {
        title: { en: '100 000 Chips', ru: '100 000 фишек' },
        description: { en: 'Container of chips', ru: 'Контейнер фишек' }
    },
    [PURCHASES.add1000k]: {
        title: { en: '1 000 000 Chips', ru: '1 000 000 фишек' },
        description: { en: 'Bank of chips', ru: 'Банк фишек' }
    },
    
}

// 3. БАЗОВЫЕ товары в USD
const baseProducts = {
    [PURCHASES.noAds]: {
        priceUSD: 2,
        type: 'permanent',
        category: 'service'
    },

    [PURCHASES.add1k]: {
        priceUSD: 0.2,
        type: 'consumable',
        category: 'currency'
    },
    [PURCHASES.add5k]: {
        priceUSD: 0.75,
        type: 'consumable',
        category: 'currency'
    },
    [PURCHASES.add20k]: {
        priceUSD: 2.1,
        type: 'consumable',
        category: 'currency'
    },
    [PURCHASES.add100k]: {
        priceUSD: 6.8,
        type: 'consumable',
        category: 'currency'
    },
    [PURCHASES.add1000k]: {
        priceUSD: 40.8,
        type: 'consumable',
        category: 'currency'
    },
}

// 4. Функция конвертации
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

// 5. Экспортируем ВСЁ что нужно
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