import { Container, Sprite, TilingSprite } from 'pixi.js'
import { tickerRemove } from '../../../app/application'
import { images, music } from '../../../app/assets'
import { setMusic } from '../../../app/sound'
import { BUTTON, BUTTON_TEXT, SLOTS_BORDER, SLOTS_LINES } from '../../constants'
import Line from './Line'
import Button from '../common/Button'
import { isLangRu } from '../../state'

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

        this.lines = []
        for(let i = 0; i < 5; i++) {
            const line = new Line(this.lineStopped.bind(this))
            line.position.set(SLOTS_LINES.positionsX[i], 0)
            this.gameContainer.addChild(line)
            this.lines.push(line)
        }

        this.linsRunningCount = 0

        this.border = new Sprite(images.slot_border)
        this.gameContainer.addChild(this.border)
        
        // UI
        this.runButton = new Button(
            isLangRu ? BUTTON_TEXT.spin.ru : BUTTON_TEXT.spin.en,
            SLOTS_BORDER.width * 0.5, SLOTS_BORDER.height + BUTTON.height,
            this.run.bind(this)
        )
        this.gameContainer.addChild(this.runButton)

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

        const slotsWidth = SLOTS_BORDER.offset * 2 + SLOTS_BORDER.width
        const slotsHeight = SLOTS_BORDER.offset * 2 + SLOTS_BORDER.height
        const scale = Math.min(
            screenData.width / slotsWidth, screenData.height / slotsHeight
        )
        const slotsOffsetX = SLOTS_BORDER.x * scale
        const slotsOffsetY = SLOTS_BORDER.y * scale
        this.gameContainer.position.set(slotsOffsetX, slotsOffsetY)
        this.gameContainer.scale.set(scale)
    }

    run() {
        if (this.linsRunningCount > 0) return

        this.runButton.setActive(false)
        this.linsRunningCount = 5
        this.lines.forEach((line, i) => line.run(i))
    }
    lineStopped() {
        this.linsRunningCount -= 1
        if (this.linsRunningCount === 0) {
            this.runButton.setActive(true)
        }
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