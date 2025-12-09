import { getSoundData } from "../app/sound";
import { getLanguage } from "../game/localization";
import { getStoredGameData, STORED_KEYS, updateGameDataFromStorage,
    updateLanguageFromStorage, updateSoundDataFromStorage } from "../game/storage";

export default class LocalMockSDK {
    constructor() {
        setTimeout( this.init.bind(this), 0 )
    }

    init() {
        updateLanguageFromStorage( localStorage.getItem(STORED_KEYS.language) )
        updateSoundDataFromStorage( localStorage.getItem(STORED_KEYS.sound) )
        updateGameDataFromStorage( localStorage.getItem(STORED_KEYS.game) )
    }

    save(key) {
        switch(key) {
            case STORED_KEYS.sound:
                localStorage.setItem( STORED_KEYS.sound, JSON.stringify( getSoundData() ) )
            break
            case STORED_KEYS.language:
                localStorage.setItem( STORED_KEYS.language, getLanguage() )
            break
            case STORED_KEYS.game:
                localStorage.setItem( STORED_KEYS.game, getStoredGameData() )
            break
        }
    }
}