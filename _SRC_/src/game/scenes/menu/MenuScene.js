import { Container, Sprite } from 'pixi.js'
import { tickerRemove } from '../../../app/application'
import { images, music } from '../../../app/assets'
import { EventHub, events, startScene } from '../../../app/events'
import { setMusicList } from '../../../app/sound'
import { MENU_TEXT } from './constants'
import { SCENE_NAME } from '../../scenes/constants'
import BackgroundCasino from '../../BG/BackgroundCasino'
import ButtonLight from '../../UI/ButtonLight'
import GameTitle from './GameTitle'
import { getLanguage } from '../../localization'

export default class Menu extends Container {
    constructor() {
        super()
        this.alpha = 0

        this.currentLanguage = getLanguage()
        EventHub.on( events.updateLanguage, this.updateLanguage, this )

        this.isGameOnStart = false

        this.bg = new BackgroundCasino()
        this.addChild(this.bg)

        this.logo = new Sprite(images.img_logo)
        this.logo.scale.set(0.25)
        this.logo.anchor.set(1)
        this.addChild(this.logo)

        
        this.title = new GameTitle()
        this.titleStartWidth = this.title.width
        this.titleStartHeight = this.title.height
        this.addChild(this.title)

        this.rouletteButton = new ButtonLight(
            MENU_TEXT.rouletteButton[this.currentLanguage],
            () => {
                if (this.isGameOnStart) return

                this.isGameOnStart = true
                startScene(SCENE_NAME.Roulette)
            }
        )
        this.addChild(this.rouletteButton)

        this.slotsButton = new ButtonLight(
            MENU_TEXT.slotsButton[this.currentLanguage],
            () => {
                if (this.isGameOnStart) return

                this.isGameOnStart = true
                startScene(SCENE_NAME.Slots)
            }
        )
        this.addChild(this.slotsButton)

        setMusicList([music.bgm_0])
    }

    screenResize(screenData) {
        // set scene container in center of screen
        this.position.set( screenData.centerX, screenData.centerY )

        this.bg.screenResize(screenData)

        this.logo.position.set(screenData.centerX - 12, screenData.centerY - 12)

        const titleScaleX = Math.min(1, screenData.width / (this.titleStartWidth + 120))
        const titleScaleY = Math.min(1, screenData.centerY / (this.titleStartHeight + 60))
        const pointY = screenData.centerY * 0.5
        this.title.scale.set( Math.min(titleScaleX, titleScaleY) )
        this.title.position.set(0, -pointY)

        if (pointY > 120) {
            this.rouletteButton.position.set(0, pointY - 60)
            this.slotsButton.position.set(0, pointY + 60)
        } else {
            this.rouletteButton.position.set(-160, pointY)
            this.slotsButton.position.set(160, pointY)
        }
    }

    updateLanguage(lang) {
        this.currentLanguage = lang
        this.rouletteButton.setLabel( MENU_TEXT.rouletteButton[this.currentLanguage] )
        this.slotsButton.setLabel( MENU_TEXT.slotsButton[this.currentLanguage] )
    }

    kill() {
        EventHub.off( events.updateLanguage, this.updateLanguage, this )
    }
}