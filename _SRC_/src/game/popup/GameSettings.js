import { Container, Graphics, Sprite, Text } from "pixi.js";
import { atlases } from "../../app/assets";
import { styles } from "../../app/styles";
import { POPUP_TEXT } from "./constants"
import ShortButton from "../UI/ShortButton";
import { musicGetVolume, musicAddVolume, musicSubVolume,
    soundGetState, soundOn, soundOff } from "../../app/sound";
import { getLanguage, getAvailableLanguages, getLanguageName, setLanguage } from "../localization";
import { EventHub, events } from "../../app/events";

const titleY = -208
const hrY = -176
const hrX = 240

const musicSubtitleY = -155
const volumeY = -105

const soundSubtitleY = -45
const soundY = 5

const languageSubtitleY = 65
const languageY = 115

const buttonsOsset = 75

export default class GameSettings extends Container {
    constructor() {
        super()
        
        this.currentLanguage = getLanguage()
        this.languagesList = getAvailableLanguages().map(item => item.code)
        this.languageIndex = this.languagesList.indexOf(this.currentLanguage)
        EventHub.on( events.updateLanguage, this.updateLanguage, this )

        // title
        this.title = new Text({
            text: POPUP_TEXT.settings[ this.currentLanguage ],
            style: styles.popupTitle
        })
        this.title.anchor.set(0.5)
        this.title.position.set(0, titleY)
        this.addChild(this.title)
        // hr
        this.hr = new Graphics()
        this.hr.moveTo(-hrX, hrY)
        this.hr.lineTo( hrX, hrY)
        this.hr.stroke({width: 4, color: 0xffffff})
        this.addChild(this.hr)

        //
        this.volumeValue = musicGetVolume()
        const volume = ' ' + (this.volumeValue * 100).toFixed() + '%'
        this.musicSettingsSubtitle = new Text({
            text: POPUP_TEXT.settingsMusic[ this.currentLanguage ] + volume,
            style: styles.popupSubTitle
        })
        this.musicSettingsSubtitle.anchor.set(0.5)
        this.musicSettingsSubtitle.position.set(0, musicSubtitleY)
        this.addChild(this.musicSettingsSubtitle)

        this.volumeSub = new ShortButton('sub', -buttonsOsset, volumeY, this.clickVolumeSub.bind(this))
        this.volumeSub.scale.set(0.5)
        this.addChild(this.volumeSub)

        this.music = new Sprite(atlases.options.textures[this.volumeValue > 0 ? 'music_on' :  'music_off'])
        this.music.anchor.set(0.5)
        this.music.alpha = this.volumeValue > 0 ? 0.5 + this.volumeValue * 0.5 : 1
        this.music.position.set(0, volumeY)
        this.addChild(this.music)

        this.volumeAdd = new ShortButton('add', buttonsOsset, volumeY, this.clickVolumeAdd.bind(this))
        this.volumeAdd.scale.set(0.5)
        this.addChild(this.volumeAdd)

        //
        this.soundState = soundGetState()
        this.soundSettingsSubtitle = new Text({
            text: this.soundState
                ? POPUP_TEXT.settingsSfxOn[ this.currentLanguage ]
                : POPUP_TEXT.settingsSfxOff[ this.currentLanguage ],
            style: styles.popupSubTitle
        })
        this.soundSettingsSubtitle.anchor.set(0.5)
        this.soundSettingsSubtitle.position.set(0, soundSubtitleY)
        this.addChild(this.soundSettingsSubtitle)

        this.soundPrv = new ShortButton('prv', -buttonsOsset, soundY, this.clickSound.bind(this))
        this.soundPrv.scale.set(0.5)
        this.addChild(this.soundPrv)

        this.sound = new Sprite(atlases.options.textures[this.soundState ? 'sound_on' :  'sound_off'])
        this.sound.anchor.set(0.5)
        this.sound.position.set(0, soundY)
        this.addChild(this.sound)

        this.soundNxt = new ShortButton('nxt', buttonsOsset, soundY, this.clickSound.bind(this))
        this.soundNxt.scale.set(0.5)
        this.addChild(this.soundNxt)

        //
        const lcc = (this.currentLanguage === 'id' || this.currentLanguage === 'ms') ? ' ' : ": "
        this.languageSettingsSubtitle = new Text({
            text: POPUP_TEXT.settingsLanguage[this.currentLanguage] + lcc + getLanguageName(),
            style: styles.popupSubTitle
        })
        this.languageSettingsSubtitle.anchor.set(0.5)
        this.languageSettingsSubtitle.position.set(0, languageSubtitleY)
        this.addChild(this.languageSettingsSubtitle)

        this.languagePrv = new ShortButton('prv', -buttonsOsset, languageY, this.prvLang.bind(this))
        this.languagePrv.scale.set(0.5)
        this.addChild(this.languagePrv)

        this.language = new Sprite(atlases.options.textures.language)
        this.language.anchor.set(0.5)
        this.language.position.set(0, languageY)
        this.addChild(this.language)

        this.languageCode = new Text({
            text: this.currentLanguage.toUpperCase(),
            style: styles.popupTitle
        })
        this.languageCode.anchor.set(0.5)
        this.languageCode.position.set(0, languageY)
        this.addChild(this.languageCode)

        this.languageNxt = new ShortButton('nxt', buttonsOsset, languageY, this.nxtLang.bind(this))
        this.languageNxt.scale.set(0.5)
        this.addChild(this.languageNxt)
    }

    updateLanguage(lang) {
        this.currentLanguage = lang

        this.title.text = POPUP_TEXT.settings[ this.currentLanguage ]

        const volume = ' ' + (this.volumeValue * 100).toFixed() + '%'
        this.musicSettingsSubtitle.text = POPUP_TEXT.settingsMusic[ this.currentLanguage ] + volume

        this.soundSettingsSubtitle.text = this.soundState
            ? POPUP_TEXT.settingsSfxOn[ this.currentLanguage ]
            : POPUP_TEXT.settingsSfxOff[ this.currentLanguage ]

        const lcc = (this.currentLanguage === 'id' || this.currentLanguage === 'ms') ? ' ' : ": "
        this.languageSettingsSubtitle.text = POPUP_TEXT.settingsLanguage[this.currentLanguage]
            + lcc + getLanguageName()
        this.languageCode.text = this.currentLanguage.toUpperCase()
    }

    clickVolumeSub() {
        this.volumeValue = musicSubVolume()
        this.updateVolume()
    }

    clickVolumeAdd() {
        this.volumeValue = musicAddVolume()
        this.updateVolume()
    }

    updateVolume() {
        this.volumeValue = musicGetVolume()

        const volume = ' ' + (this.volumeValue * 100).toFixed() + '%'
        this.musicSettingsSubtitle.text = POPUP_TEXT.settingsMusic[ this.currentLanguage ] + volume
        
        this.music.texture = atlases.options.textures[this.volumeValue > 0 ? 'music_on' :  'music_off']
        this.music.alpha = this.volumeValue > 0 ? 0.5 + this.volumeValue * 0.5 : 1
    }

    clickSound() {
        this.soundState = !this.soundState
        if (this.soundState) soundOn()
        else soundOff()

        this.soundSettingsSubtitle.text = this.soundState
            ? POPUP_TEXT.settingsSfxOn[ this.currentLanguage ]
            : POPUP_TEXT.settingsSfxOff[ this.currentLanguage ]
        this.sound.texture = atlases.options.textures[this.soundState ? 'sound_on' :  'sound_off']
    }

    prvLang() {
        this.languageIndex--
        if (this.languageIndex < 0) this.languageIndex = this.languagesList.length - 1
        setLanguage( this.languagesList[ this.languageIndex ] )
    }

    nxtLang() {
        this.languageIndex++
        if (this.languageIndex === this.languagesList.length) this.languageIndex = 0
        setLanguage( this.languagesList[ this.languageIndex ] )
    }

    kill() {
        EventHub.off( events.updateLanguage, this.updateLanguage, this )
    }
}