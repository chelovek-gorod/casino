import { Container, TilingSprite } from 'pixi.js'
import { tickerRemove } from '../../../app/application'
import { images, music } from '../../../app/assets'
import { setMusic } from '../../../app/sound'
import { GAME_CONTAINERS, GAME_OFFSET, UI } from '../../constants'
import Field from './Field'
import LeftMenu from './UI/LeftMenu'
import Popup from './popup/Popup'
import RightMenu from './UI/RightMenu'
import TopBarMenu from './UI/TopBarMenu'
import Wheel from './Wheel'

export default class Main extends Container {
    constructor() {
        super()
        this.alpha = 0

        // BG
        this.bg = new TilingSprite(images.bg)
        this.bgTileWidth = images.bg.width
        this.bgTileHeight = images.bg.height
        this.bg.anchor.set(0.5)
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

        this.addChild(this.leftUI, this.rightUI, this.topUI, this.popup)

        // done
        setMusic([music.bgm_casino])
    }

    screenResize(screenData) {
        // set scene container in center of screen
        this.position.set( screenData.centerX, screenData.centerY )

        // repeat bg tile in full screen (width and height)
        this.bg.width = screenData.width
        this.bg.height = screenData.height
        const offsetX = screenData.width % this.bgTileWidth
        const offsetY = screenData.height % this.bgTileHeight
        this.bg.tilePosition.x = offsetX * 0.5
        this.bg.tilePosition.y = offsetY * 0.5

        // update popup
        this.popup.screenResize(screenData)

        // get sizes without UI
        const gameWidth = screenData.isLandscape
            ? GAME_CONTAINERS.game.landscape.width : GAME_CONTAINERS.game.portrait.width
        const gameHeight = screenData.isLandscape
            ? GAME_CONTAINERS.game.landscape.height : GAME_CONTAINERS.game.portrait.height

        const availableHeight = screenData.height - UI.size - UI.bets.height

        const scale = Math.min(1, screenData.width / gameWidth, availableHeight / gameHeight)
        this.gameContainer.scale.set(scale)

        const gameContainerY = availableHeight * 0.5 + UI.size - screenData.centerY
        this.gameContainer.position.set(0, gameContainerY)

        if (screenData.isLandscape) {
            const wheelX = (GAME_CONTAINERS.wheel.width - gameWidth) * 0.5 + GAME_OFFSET
            const fieldX = (gameWidth - GAME_CONTAINERS.field.width) * 0.5 - GAME_OFFSET
            this.wheel.position.set( wheelX, 0 )
            this.field.position.set( fieldX, 0 )
        } else {
            const wheelY = (GAME_CONTAINERS.wheel.height - gameHeight) * 0.5 + GAME_OFFSET
            const fieldY = (gameHeight - GAME_CONTAINERS.field.height) * 0.5 - GAME_OFFSET
            this.wheel.position.set( 0, wheelY )
            this.field.position.set( 0, fieldY)
        }

        this.leftUI.position.set(-screenData.centerX, screenData.centerY)
        this.rightUI.position.set(screenData.centerX, screenData.centerY)

        this.topUI.screenResize(screenData)
    }

    setActiveChip() {
        console.log('chip')
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