import { Container } from 'pixi.js'
import { images, music } from '../../../app/assets'
import { setMusicList } from '../../../app/sound'
import { GAME_CONTAINERS, UI } from '../../UI/constants'
import Field from './Field'
import Wheel from './Wheel'
import LeftMenu from '../../UI/LeftMenu'
import RightMenu from '../../UI/RightMenu'
import TopBarMenu from '../../UI/TopBarMenu'
import Message from '../../UI/Message'
import Popup from '../../popup/Popup'
import BackgroundTiling from '../../BG/BackgroundTiling'
import { resetState, setMaxBet } from '../../state'
import { MAX_BET } from './constants'

export default class Roulette extends Container {
    constructor() {
        super()
        this.alpha = 0

        resetState()
        setMaxBet(MAX_BET)

        // BG
        this.bg = new BackgroundTiling(images.bg_green)
        this.addChild(this.bg)

        // SCALED MAIN GAME CONTAINER
        this.gameContainer = new Container()
        this.addChild(this.gameContainer)

        this.wheel = new Wheel()
        this.gameContainer.addChild(this.wheel)

        this.field = new Field()
        this.gameContainer.addChild(this.field)

        // UI
        this.topUI = new TopBarMenu()
        this.leftUI = new LeftMenu()
        this.rightUI = new RightMenu()

        this.popup = new Popup()

        this.message = new Message()

        this.addChild(this.leftUI, this.rightUI, this.topUI, this.popup, this.message)

        // done
        setMusicList([music.bgm_0, music.bgm_1, music.bgm_2, music.bgm_3, music.bgm_4, music.bgm_5])
    }

    screenResize(screenData) {
        // set scene container in center of screen
        this.position.set( screenData.centerX, screenData.centerY )

        // repeat bg tile in full screen (width and height)
        this.bg.screenResize(screenData)

        // update popup
        this.popup.screenResize(screenData)

        // update message
        this.message.screenResize(screenData)

        // get sizes without UI
        const availableHeight = screenData.height - UI.size - UI.bets.height

        const gameContainerY = availableHeight * 0.5 + UI.size - screenData.centerY
        this.gameContainer.position.set(0, gameContainerY)

        if (screenData.isLandscape) {
            // fieldScaledHeight === wheelScaledHeight
            const scaledHeight = Math.min( 1, availableHeight / GAME_CONTAINERS.field.scaledHeight )
            const scaledWidth = Math.min(
                1,
                screenData.width / (GAME_CONTAINERS.field.scaledWidth + GAME_CONTAINERS.wheel.scaledWidth)
            )
            const scale = Math.min(scaledHeight, scaledWidth)

            const wheelScale = GAME_CONTAINERS.wheel.scale * scale
            const fieldScale = GAME_CONTAINERS.field.scale * scale

            this.wheel.scale.set(wheelScale)
            this.field.scale.set(fieldScale)

            const scaledWheelWidth = GAME_CONTAINERS.wheel.width * wheelScale
            const scaledFieldWidth = GAME_CONTAINERS.field.width * fieldScale
            const scaledGameWidth = scaledWheelWidth + scaledFieldWidth

            const wheelX = (-scaledGameWidth + scaledWheelWidth) * 0.5
            const fieldX = (scaledGameWidth - scaledFieldWidth) * 0.5
            this.wheel.position.set( wheelX, 0 )
            this.field.position.set( fieldX, 0 )
        } else {
            const scaledHeight = Math.min(
                1,
                availableHeight / (GAME_CONTAINERS.field.scaledHeight + GAME_CONTAINERS.wheel.scaledHeight)
            )
            // fieldScaledWidth === wheelScaledWidth
            const scaledWidth = Math.min( 1, screenData.width / GAME_CONTAINERS.field.scaledWidth )
            const scale = Math.min(scaledHeight, scaledWidth)

            const wheelScale = GAME_CONTAINERS.wheel.scale * scale
            const fieldScale = GAME_CONTAINERS.field.scale * scale

            this.wheel.scale.set(wheelScale)
            this.field.scale.set(fieldScale)

            const scaledWheelHeight = GAME_CONTAINERS.wheel.height * wheelScale
            const scaledFieldHeight = GAME_CONTAINERS.field.height * fieldScale
            const scaledGameHeight = scaledWheelHeight + scaledFieldHeight

            const wheelY = (-scaledGameHeight + scaledWheelHeight) * 0.5
            const fieldY = (scaledGameHeight - scaledFieldHeight) * 0.5
            this.wheel.position.set( 0, wheelY )
            this.field.position.set( 0, fieldY )
        }

        this.leftUI.position.set(-screenData.centerX, screenData.centerY)
        this.rightUI.position.set(screenData.centerX, screenData.centerY)

        this.topUI.screenResize(screenData)
    }
}