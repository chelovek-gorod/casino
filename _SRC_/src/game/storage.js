import { EventHub, events } from '../app/events'
import { setStoredSoundData } from '../app/sound'
import LocalMockSDK from '../sdk/LocalMock'
import { decode, encode } from '../utils/decoder'
import { setLanguage } from './localization'
import { money, setStoredMoney } from './state'

export const STORED_KEYS = {
    language: 'language',
    sound: 'sound',
    game: 'game'
}

let SDK = new LocalMockSDK()

EventHub.on( events.updateMoney, () => updateStoredData(STORED_KEYS.game) )

export function setStoredGameData( gameData ) {
    if ('money' in gameData && typeof gameData.money === 'number'
    && gameData.money > 0 && gameData.money < Infinity ) {
        setStoredMoney(gameData.money)
    }
}

export function getStoredGameData() {
    const storedString = JSON.stringify({
        money: money
    })
    const encodedString = encode( storedString )
    return encodedString
}

export function updateStoredData(key) {
    if (!SDK) throw new Error('Need SDK')

    SDK.save(key)
}

export function updateLanguageFromStorage(languageCode) {
    if (languageCode && typeof languageCode === 'string') {
        setLanguage( languageCode, false )
    }
}

export function updateSoundDataFromStorage(soundDataString) {
    if (soundDataString && typeof soundDataString === 'string') {
        try {
            const soundData = JSON.parse(soundDataString)
            if (soundData && typeof soundData === 'object') {
                setStoredSoundData(soundData)
            }
        } catch(e) {
            console.warn('wrong sound stored data')
        }
    }
}

export function updateGameDataFromStorage(gameDataString) {
    if (gameDataString && typeof gameDataString === 'string') {
        try {
            const gameData = JSON.parse( decode(gameDataString) )
            if (gameData && typeof gameData === 'object') {
                setStoredGameData(gameData)
            }
        } catch(e) {
            console.warn('wrong game stored data')
        }
    }
}