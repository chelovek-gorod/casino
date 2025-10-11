import { Container, Sprite, TilingSprite } from 'pixi.js'
import { tickerRemove } from '../../../app/application'
import { images, music } from '../../../app/assets'
import { setMusic } from '../../../app/sound'
import Line from './Line'

export default class Slots extends Container {
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

        this.lines = [ new Line(), new Line(), new Line(), new Line(), new Line() ]
        this.lines.forEach( line => this.gameContainer.addChild(line) )

        this.border = new Sprite(images.slot_border)
        this.border.anchor.set(0.5)
        
        // UI

        // done
        setMusic([music.bgm_casino])
    }

    screenResize(screenData) { console.log('RR')
        // set scene container in center of screen
        this.position.set( screenData.centerX, screenData.centerY )

        // repeat bg tile in full screen (width and height)
        this.bg.width = screenData.width
        this.bg.height = screenData.height
        const offsetX = screenData.width % this.bgTileWidth
        const offsetY = screenData.height % this.bgTileHeight
        this.bg.tilePosition.x = offsetX * 0.5
        this.bg.tilePosition.y = offsetY * 0.5
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