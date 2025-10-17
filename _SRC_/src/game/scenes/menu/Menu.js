import { AnimatedSprite, Container, Sprite } from 'pixi.js'
import { tickerRemove } from '../../../app/application'
import { atlases, images, music } from '../../../app/assets'
import { startScene } from '../../../app/events'
import { setMusic } from '../../../app/sound'
import { MENU_BG_SIZE, MENU_TEXT, SCENE_NAME } from '../../constants'
import { isLangRu } from '../../state'
import Button from '../../UI/Button'
import BackgroundTiling from '../../BG/BackgroundTiling'
import Coins from '../../effects/Coins'
import BackgroundGradient from '../../BG/BackgroundGradient'
import BackgroundCasino from '../../BG/BackfroundCasino'

export default class Menu extends Container {
    constructor() {
        super()
        this.alpha = 0

        this.bg = new BackgroundCasino()
        this.addChild(this.bg)

        this.rouletteButton = new Button(
            isLangRu ? MENU_TEXT.rouletteButton.ru : MENU_TEXT.rouletteButton.en,
            0, -100, () => startScene(SCENE_NAME.Roulette)
        )
        this.addChild(this.rouletteButton)

        this.slotsButton = new Button(
            isLangRu ? MENU_TEXT.slotsButton.ru : MENU_TEXT.slotsButton.en,
            0, 100, () => startScene(SCENE_NAME.Slots)
        )
        this.addChild(this.slotsButton)
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