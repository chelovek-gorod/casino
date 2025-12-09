import { Sound } from '@pixi/sound'
import { STORED_KEYS, updateStoredData } from '../game/storage'
import { EventHub, events } from './events'

// начальное состояние музыки и звуков
const state = {
    isSoundOn: true, // звук вкл/откл (true/false)
    soundVolume: 1.0, // звук громкость от 0 до 1

    isMusicOn: true, // фоновая музыка вкл/откл (true/false)
    musicVolume: 0.5, // фоновая музыка задать громкость от 0 до 1
    
    volumeStep: 0.2, // soundVolume и musicVolume конвертируется кратно volumeStep от 0 до 1
}

export function setStoredSoundData( data ) {
    if ('isSoundOn' in data) state.isSoundOn = !!data.isSoundOn
    if ('soundVolume' in data) setVolume("sound", data.soundVolume, false)
    if ('isMusicOn' in data) state.isMusicOn = !!data.isMusicOn
    if ('musicVolume' in data) setVolume("music", data.musicVolume, false)
}
export function getSoundData() {
    return { isSoundOn: state.isSoundOn, soundVolume: state.soundVolume,
        isMusicOn: state.isMusicOn, musicVolume: state.musicVolume, }
}

let musicInstance = null
let musicAudio = null
let musicList = null
let musicIndex = 0
let musicToken = 0 // use for remove unused music
let currentLoadingMusic = null

export function musicGetState() {
    return state.isMusicOn
}
export function musicOn() {
    state.isMusicOn = true
    updateStoredData( STORED_KEYS.sound )

    musicPlay()
}
export function musicOff() {
    state.isMusicOn = false
    updateStoredData( STORED_KEYS.sound )

    musicStop()
}
export function musicGetVolume() { return state.musicVolume }
export function musicAddVolume() { return setVolume("music", state.musicVolume + state.volumeStep) }
export function musicSubVolume() { return setVolume("music", state.musicVolume - state.volumeStep) }
export function musicSetVolume(value) {return setVolume("music", value)}

function setVolume(type = "music", value, isNeedUpdateStorage = true) {
    if (typeof value === 'number') {
        const normalizedValue = Math.max(0, Math.min(1, value))
        const steps = Math.round(normalizedValue / state.volumeStep)
        const resultVolume = Math.max(0, Math.min(steps * state.volumeStep, 1))
        const fixedVolume = Math.round(resultVolume * 1e10) / 1e10
        if (type === "music") state.musicVolume = fixedVolume
        else state.soundVolume = fixedVolume

        if (isNeedUpdateStorage) updateStoredData( STORED_KEYS.sound )
    }

    if (type === "music") {
        if (musicInstance) musicInstance.volume = state.musicVolume

        if (state.musicVolume === 0) musicStop()
        else musicPlay()

        return state.musicVolume
    }

    return state.soundVolume
}

let isSoundAvailable = false // is game in focus
export function getFirstUserAction() {

    isSoundAvailable = true
    musicPlay()
}

EventHub.on( events.changeFocus, changeFocus )
function changeFocus( isOnFocus ) {
    isSoundAvailable = isOnFocus
    if (isOnFocus) musicPlay()
    else musicStop()
}

// sounds controller
export function soundOn() {
    state.isSoundOn = true
    updateStoredData( STORED_KEYS.sound )
}
export function soundOff() {
    state.isSoundOn = false
    updateStoredData( STORED_KEYS.sound )
}
export function soundGetState() {
    return state.isSoundOn
}

export function soundGetVolume() { return state.soundVolume }
export function soundAddVolume() { return setVolume("sound", state.soundVolume + state.volumeStep) }
export function soundSubVolume() { return setVolume("sound", state.soundVolume - state.volumeStep) }
export function soundSetVolume(value) {return setVolume("sound", value)}

export function soundPlay( se ) {
    if (!state.isSoundOn || !isSoundAvailable) return
    // se.stop()
    se.play({ volume: state.soundVolume })
}
export function soundStop( se ) {
    se.stop()
}

export function setMusicList(music, startIndex = null) {
    if (!music) return
  
    if ( Array.isArray(music) ) {
        musicList = music
    } else if (typeof music === 'object') {
        musicList = Object.values(music)
    } else if (typeof music === 'string') {
        musicList = [music]
    } else {
        musicList = []
        return console.error('GET WRONG MUSIC LIST', music)
    }
    
    if (!musicList.length) return
  
    if (startIndex && startIndex < musicList.length) musicIndex = startIndex
    else musicIndex = Math.floor(Math.random() * musicList.length)

    musicToken++
    loadBgMusic()
}

export function musicStop() {
    if (!musicAudio || musicAudio.paused) return

    musicAudio.pause()
}

export function musicPlay() {
    if (!state.isMusicOn || !musicAudio || !musicList || !isSoundAvailable || musicAudio.isPlaying) return

    if (musicAudio.paused) musicAudio.resume()
    else musicAudio.play()
}

function loadBgMusic() {
    const token = musicToken

    if (currentLoadingMusic) {
        currentLoadingMusic.destroy()
        currentLoadingMusic = null
    }
    
    if (musicAudio) {
        musicAudio.stop()
        musicAudio.destroy()
        musicAudio = null
        musicInstance = null
    }

    currentLoadingMusic = Sound.from({
        url: musicList[musicIndex],
        preload: true,
        loaded: function(err, music) {
            if (token !== musicToken) {
                music?.destroy()
                return
            }
            if (err) {
                console.error('Music load error')

                setTimeout(() => {
                    if (token === musicToken) nextBgMusic()
                }, 0) // setTimeout спасает от зацикливания битого трека

                return 
            }

            currentLoadingMusic = null

            musicAudio = music
            musicInstance = music.play({ volume: 0 }).on('end', nextBgMusic)
            if (!isSoundAvailable || !state.isMusicOn) musicStop()
            musicInstance.volume = state.musicVolume
        }
    })
}

function nextBgMusic() {
    if (!musicList || !musicList.length) return
  
    musicIndex = (musicIndex + 1) % musicList.length
    musicToken++
    loadBgMusic()
}