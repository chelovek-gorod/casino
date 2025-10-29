import { AnimatedSprite, Container, Sprite } from 'pixi.js'
import { tickerRemove } from '../../../app/application'
import { atlases, images, music } from '../../../app/assets'
import { startScene } from '../../../app/events'
import { setMusic } from '../../../app/sound'
import { MENU_BG_SIZE, MENU_TEXT } from '../../constants'
import { SCENE_NAME } from '../constants'
import { isLangRu } from '../../state'
import Button from '../../UI/Button'
import BackgroundTiling from '../../BG/BackgroundTiling'
import Coins from '../../effects/Coins'
import BackgroundGradient from '../../BG/BackgroundGradient'
import BackgroundCasino from '../../BG/BackgroundCasino'
import ButtonLight from '../../UI/ButtonLight'

export default class Menu extends Container {
    constructor() {
        super()
        this.alpha = 0

        this.bg = new BackgroundCasino()
        this.addChild(this.bg)

        this.rouletteButton = new ButtonLight(
            isLangRu ? MENU_TEXT.rouletteButton.ru : MENU_TEXT.rouletteButton.en,
            () => startScene(SCENE_NAME.Roulette)
        )
        this.rouletteButton.position.set(0, 0)
        this.addChild(this.rouletteButton)

        this.slotsButton = new ButtonLight(
            isLangRu ? MENU_TEXT.slotsButton.ru : MENU_TEXT.slotsButton.en,
            () => startScene(SCENE_NAME.Slots)
        )
        this.slotsButton.position.set(0, 130)
        this.addChild(this.slotsButton)

        setMusic([music.bgm_0])
    }

    screenResize(screenData) {
        // set scene container in center of screen
        this.position.set( screenData.centerX, screenData.centerY )

        this.bg.screenResize(screenData)
    }

    kill() {
        tickerRemove(this)
        while(this.children.length) {
            tickerRemove(this.children[0])
            if ('kill' in this.children[0]) this.children[0].kill()
            else this.children[0].destroy()
        }
        this.destroy()
    }
}