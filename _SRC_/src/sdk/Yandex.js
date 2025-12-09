import { startTicker, stopTicker } from "../engine/application"
import { musicPlay, musicStop, soundGetState, soundOff, soundOn } from "../app/sound"
import { encode, decode } from '../utils/decoder'
import { productsConfig } from './products'
import { setLanguage } from "../game/localization"

const isRealYandex = true
const leaderboardName = 'CasinoLeaderboard'
const SAVE_COOLDOWN = 4000 // 3 секунды между сохранениями
const INIT_RETRY_DELAY = 100 // Задержка повтора инициализации

class YandexSDK {
    constructor() {
        this.SDK = null
        this.player = null
        this.leaderboard = null
        this.payments = null
        
        // Объединяем флаги в объект состояний
        this.state = {
            isReady: false,
            isInitializing: false,
            isGetReward: false,
            isLangRu: true,
            isSoundOnBeforeAd: true,
            lastSaveTime: 0
        }
        
        // Данные
        this.lastSaveEncodedString = ''
        this.saveQueue = null // Очередь для отложенного сохранения
        
        // Колбэки
        this.autoSaveCallback = null
        this.pendingSaveTimer = null
        
        // Инициализация
        this.init()
    }

    /**
     * Основная инициализация SDK
     */
    init() {
        if (this.state.isInitializing) return
        
        this.state.isInitializing = true
        
        if (!isRealYandex) {
            this.initMockSDK()
            return
        }
        
        if (!('YaGames' in window)) {
            this.retryInit()
            return
        }
        
        YaGames.init()
            .then(SDK => this.onSDKReady(SDK))
            .catch(error => {
                console.error('Failed to init YaGames:', error)
                this.retryInit()
            })
    }

    /**
     * Повторная попытка инициализации
     */
    retryInit() {
        this.state.isInitializing = false
        setTimeout(() => this.init(), INIT_RETRY_DELAY)
    }

    /**
     * SDK успешно загружен
     */
    onSDKReady(SDK) {
        this.SDK = SDK
        
        // Загружаем данные параллельно
        const promises = [
            this.loadPlayer(),
            this.loadLeaderboard(),
            this.loadEnvironment(),
            this.initPayments()
        ]
        
        Promise.all(promises)
            .then(() => {
                this.state.isReady = true
                this.state.isInitializing = false
                console.log('Yandex SDK fully initialized')
                this.checkPendingPurchases() // Проверяем незавершенные покупки
            })
            .catch(error => {
                console.error('Failed to initialize components:', error)
                this.state.isInitializing = false
            })
    }

    /**
     * Инициализация мок-объекта для разработки
     */
    initMockSDK() {
        this.SDK = {
            features: {
                LoadingAPI: { ready: () => console.log('Mock: ready') },
                GameplayAPI: {
                    start: () => console.log('Mock: start'),
                    stop: () => console.log('Mock: stop')
                }
            },
            getPlayer: () => Promise.resolve({
                getData: () => Promise.resolve({ 
                    save: localStorage.getItem('save') || ''
                }),
                setData: (data) => {
                    localStorage.setItem('save', data.save || '')
                    return Promise.resolve()
                }
            }),
            getLeaderboards: () => Promise.resolve({
                setLeaderboardScore: (name, score) => 
                    console.log(`Mock: set score ${score} to ${name}`)
            }),
            adv: {
                showRewardedVideo: (options) => {
                    console.log('Mock: show rewarded video')
                    setTimeout(() => options.callbacks.onClose(), 1000)
                    return Promise.resolve()
                },
                showFullscreenAdv: (options) => {
                    console.log('Mock: show fullscreen ad')
                    setTimeout(() => options.callbacks.onClose(true), 1000)
                    return Promise.resolve()
                }
            },
            environment: {
                i18n: { lang: 'ru' }
            },
            getPayments: () => Promise.resolve({
                getCatalog: () => Promise.resolve([
                    {
                        id: 'coins_100',
                        title: '100 монет',
                        description: 'Пакет монет для игры',
                        price: '99 ₽',
                        priceValue: 99,
                        currency: 'RUB'
                    },
                    {
                        id: 'remove_ads',
                        title: 'Убрать рекламу',
                        description: 'Отключить всю рекламу навсегда',
                        price: '199 ₽',
                        priceValue: 199,
                        currency: 'RUB'
                    }
                ]),
                purchase: (options) => {
                    console.log('Mock purchase:', options)
                    return Promise.resolve({
                        purchase: {
                            productId: options.id,
                            purchaseToken: 'mock_token_' + Date.now(),
                            state: 'charged',
                            developerPayload: options.developerPayload || ''
                        }
                    })
                },
                getPurchases: () => Promise.resolve([]),
                consumePurchase: () => Promise.resolve()
            })
        }
        
        this.player = {
            getData: () => Promise.resolve({ 
                save: localStorage.getItem('save') || ''
            }),
            setData: (data) => {
                localStorage.setItem('save', data.save || '')
                return Promise.resolve()
            }
        }
        
        this.state.isReady = true
        this.lastSaveEncodedString = localStorage.getItem('save') || ''
        console.log('Mock SDK initialized')
    }

    /**
     * Загрузка данных игрока
     */
    loadPlayer() {
        return this.SDK.getPlayer()
            .then(player => {
                this.player = player
                return player.getData()
            })
            .then(saveData => {
                if (saveData && saveData.save) {
                    this.lastSaveEncodedString = saveData.save
                }
            })
    }

    /**
     * Загрузка таблицы лидеров
     */
    loadLeaderboard() {
        if (!leaderboardName) return Promise.resolve()
        
        return this.SDK.getLeaderboards()
            .then(leaderboard => {
                this.leaderboard = leaderboard
            })
    }

    /**
     * Загрузка настроек окружения
     */
    loadEnvironment() {
        return Promise.resolve().then(() => {
            setLanguage(this.SDK.environment.i18n.lang) // 'ru'
        })
    }

    /**
     * Получение сохраненных данных
     */
    getSave() {
        if (!this.lastSaveEncodedString) return null
        
        try {
            const decoded = decode(this.lastSaveEncodedString)
            return JSON.parse(decoded)
        } catch (error) {
            console.warn('Failed to decode save data:', error)
            return null
        }
    }

    /**
     * Сохранение данных с троттлингом
     */
    saveData(saveObject) {
        if (!this.player) {
            console.warn('Player not initialized')
            return
        }
        
        // Обновляем строку сохранения если передали данные
        if (saveObject) {
            try {
                this.lastSaveEncodedString = encode(JSON.stringify(saveObject))
            } catch (error) {
                console.error('Failed to encode save data:', error)
                return
            }
        }
        
        const now = Date.now()
        
        // Проверяем кулдаун
        if (now - this.state.lastSaveTime < SAVE_COOLDOWN) {
            // Ставим в очередь
            this.saveQueue = this.lastSaveEncodedString
            if (!this.pendingSaveTimer) {
                this.pendingSaveTimer = setTimeout(() => {
                    this.executeSave(this.saveQueue)
                    this.saveQueue = null
                    this.pendingSaveTimer = null
                }, SAVE_COOLDOWN - (now - this.state.lastSaveTime))
            }
            return
        }
        
        // Сохраняем сразу
        this.executeSave(this.lastSaveEncodedString)
    }

    /**
     * Непосредственное сохранение
     */
    executeSave(encodedString) {
        this.state.lastSaveTime = Date.now()
        
        const savePromise = isRealYandex 
            ? this.player.setData({ 'save': encodedString })
            : Promise.resolve(localStorage.setItem('save', encodedString))
        
        savePromise.catch(error => {
            console.error('Failed to save data:', error)
        })
    }

    /**
     * Автосохранение
     */
    startAutoSave(callback) {
        if (this.autoSaveCallback) {
            console.warn('Auto save already started')
            return
        }
        
        this.autoSaveCallback = callback
        this.autoSave()
    }

    stopAutoSave() {
        this.autoSaveCallback = null
    }

    autoSave() {
        if (!this.autoSaveCallback) return
        
        try {
            const data = this.autoSaveCallback()
            if (data) {
                this.saveData(data)
            }
        } catch (error) {
            console.error('Auto save callback error:', error)
        }
        
        // Планируем следующее сохранение
        setTimeout(() => this.autoSave(), SAVE_COOLDOWN)
    }

    /**
     * Очистка сохранений
     */
    clearSave(callback) {
        this.lastSaveEncodedString = ''
        
        if (isRealYandex) {
            this.player.setData({ 'save': null })
                .then(() => callback && callback())
                .catch(() => callback && callback())
        } else {
            localStorage.setItem('save', null)
            setTimeout(() => callback && callback(), 100)
        }
    }

    /**
     * Таблица лидеров
     */
    addDataToLeaderboard(score) {
        if (!isRealYandex || !this.leaderboard || !leaderboardName) {
            return
        }
        
        this.SDK.isAvailableMethod('leaderboards.setLeaderboardScore')
            .then(isAvailable => {
                if (isAvailable) {
                    this.leaderboard.setLeaderboardScore(leaderboardName, score)
                }
            })
            .catch(error => {
                console.warn('Failed to set leaderboard score:', error)
            })
    }

    /**
     * Рекламные видео
     */
    showRewardAd(callback) {
        if (!this.SDK || !this.SDK.adv) {
            callback && callback(false)
            return
        }
        
        if (!isRealYandex) {
            // Мок-реклама для тестов
            setTimeout(() => callback && callback(true), 100)
            return
        }
        
        this.state.isSoundOnBeforeAd = soundGetState()
        
        // Останавливаем геймплей
        if (this.SDK.features && this.SDK.features.GameplayAPI) {
            this.SDK.features.GameplayAPI.stop()
        }
        
        this.SDK.adv.showRewardedVideo({
            callbacks: {
                onOpen: () => {
                    stopTicker()
                    if (this.state.isSoundOnBeforeAd) soundOff()
                    musicStop()
                },
                onRewarded: () => {
                    this.state.isGetReward = true
                },
                onClose: () => {
                    this.resumeAfterAd(callback)
                },
                onError: (error) => {
                    console.error('Rewarded ad error:', error)
                    this.resumeAfterAd(callback)
                }
            }
        })
    }

    /**
     * Восстановление после рекламы
     */
    resumeAfterAd(callback) {
        startTicker()
        
        if (this.state.isSoundOnBeforeAd) soundOn()
        musicPlay()
        
        if (this.SDK.features && this.SDK.features.GameplayAPI) {
            this.SDK.features.GameplayAPI.start()
        }
        
        const rewardReceived = this.state.isGetReward
        this.state.isGetReward = false
        
        callback && callback(rewardReceived)
    }

    /**
     * Полноэкранная реклама
     */
    showBannerAd(callback) {
        if (!this.SDK || !this.SDK.adv) {
            callback && callback()
            return
        }
        
        this.SDK.adv.showFullscreenAdv({
            callbacks: {
                onClose: (wasShown) => callback && callback(),
                onOffline: (wasShown) => callback && callback(),
                onError: (error) => {
                    console.error('Fullscreen ad error:', error)
                    callback && callback()
                }
            }
        })
    }

    // ============ ДОБАВЛЯЕМ МЕТОДЫ ДЛЯ ПОКУПОК ============

    /**
     * Инициализация платежей
     */
    initPayments() {
        if (!this.SDK || this.payments) return Promise.resolve()
        
        return this.SDK.getPayments()
            .then(payments => {
                this.payments = payments
                console.log('Payments initialized')
            })
            .catch(error => {
                console.error('Failed to initialize payments:', error)
            })
    }

    /**
     * Проверка незавершенных покупок
     */
    checkPendingPurchases() {
        if (!this.payments) return
        
        this.payments.getPurchases()
            .then(purchases => {
                purchases.forEach(purchase => {
                    if (purchase.state === 'charged') {
                        this.processPurchase(purchase)
                    }
                })
            })
            .catch(error => {
                console.warn('Failed to check pending purchases:', error)
            })
    }

    /**
     * Обработка покупки
     */
     processPurchase(purchase) {
        console.log('Processing purchase:', purchase)
        
        // Ищем обработчик в общем файле
        const handler = productsConfig.handlers[purchase.productId]
        if (handler) {
            handler(purchase)
        } else {
            console.warn(`Нет обработчика для: ${purchase.productId}`)
        }
        
        // Для расходуемых товаров подтверждаем получение
        if (purchase.developerPayload === 'consumable') {
            this.payments.consumePurchase(purchase.purchaseToken)
                .then(() => console.log('Purchase consumed'))
                .catch(error => console.error('Failed to consume purchase:', error))
        }
    }

    /**
     * Получение каталога товаров
     */
    getProducts() {
        if (!this.payments) return Promise.resolve([])
        
        return this.payments.getCatalog()
            .then(products => products)
            .catch(error => {
                console.error('Failed to get products:', error)
                return []
            })
    }

    /**
     * Совершение покупки
     */
    purchaseProduct(productId, developerPayload = '') {
        if (!this.payments) return Promise.reject('Payments not initialized')
        
        return this.payments.purchase({ 
            id: productId,
            developerPayload: developerPayload
        })
            .then(purchase => {
                if (purchase.purchase.state === 'charged') {
                    this.processPurchase(purchase.purchase)
                    return { success: true, purchase: purchase.purchase }
                }
                return { success: false, purchase: purchase.purchase }
            })
            .catch(error => {
                console.error('Purchase failed:', error)
                return { success: false, error: error }
            })
    }
}

// Создаем глобальный инстанс
const Yandex = new YandexSDK()

export default Yandex