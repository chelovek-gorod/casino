import { Container, Text, Sprite, TilingSprite, Graphics } from 'pixi.js'
import { images } from '../../../app/assets'
import { styles } from '../../../app/styles'
import { getAppScreen, sceneAdd, sceneRemove, tickerAdd, tickerRemove } from '../../../app/application'
import { EventHub, events } from '../../../app/events'
import { SCENE_ALPHA_STEP } from '../../constants'

const settings = {
    BG: {
        anchorX : 0.5,
        anchorY : 0.5,
        isScaled: true
    },

    textY: -36,

    x: -135,
    y: 36,
    width: 270,
    height: 36,
    borderLineWidth: 6,
    progressOffset: 10,
    color: 0x00ff00,
    borderRadius: 18,
    progressRadius: 8,
}

export default class LoadScene extends Container {
    constructor(textureKey, isTile = false) {
        super()

        this.bg = null
        if (textureKey) {
            this.isTile = isTile
            this.bg = this.isTile ? new TilingSprite(images[textureKey]) : new Sprite(images[textureKey])
            this.bgWidth = images[textureKey].width
            this.bgHeight = images[textureKey].height
            if (isTile) this.bg.anchor.set(0.5)
            else this.bg.anchor.set(settings.BG.anchorX, settings.BG.anchorY)
            this.bg.alpha = 0
            this.addChild(this.bg)            
        }

        this.progress = new Graphics()
        this.drawProgress(0)
        this.addChild(this.progress)

        this.text = new Text({ text:'0%', style: styles.loading })
        this.text.anchor.set(0.5)
        this.text.position.y = settings.textY
        this.addChild(this.text)
        tickerAdd(this)

        EventHub.on( events.screenResize, this.screenResize, this )

        this.screenResize( getAppScreen() )

        sceneAdd(this)
    }

    screenResize(screenData) {
        this.position.set(screenData.centerX, screenData.centerY)
        if (!this.bg) return

        if (this.isTile) {
            this.bg.width = screenData.width
            this.bg.height = screenData.height
            const offsetX = screenData.width % this.bgWidth
            const offsetY = screenData.height % this.bgHeight
            this.bg.tilePosition.x = offsetX * 0.5
            this.bg.tilePosition.y = offsetY * 0.5
            return
        }

        if (!settings.BG.isScaled) return

        const scaleX = screenData.width / this.bgWidth
        const scaleY = screenData.height / this.bgHeight
        const scale = scaleX > scaleY ? scaleX : scaleY
        this.bg.scale.set(scale)
    }

    update(progress) {
        const range = Math.round(progress)
        this.drawProgress(range)
        this.text.text = range + '%'
    }

    drawProgress(range) {
        this.progress.clear()

        this.progress.roundRect(settings.x, settings.y, settings.width, settings.height, settings.borderRadius)
        this.progress.stroke({width: settings.borderLineWidth, color: settings.color})

        const width = 2.5 * range
        if (width < settings.progressRadius) return
        
        this.progress.roundRect(
            settings.x + settings.progressOffset,
            settings.y + settings.progressOffset,
            width,
            settings.height - settings.progressOffset * 2,
            settings.progressRadius
        )
        this.progress.fill(settings.color)
    }

    tick(time) {
        this.bg.alpha += time.elapsedMS * SCENE_ALPHA_STEP * 2
        if (this.bg.alpha >= 1) tickerRemove(this)
    }

    kill() {
        tickerRemove(this)
        EventHub.off( events.screenResize, this.screenResize, this )
        sceneRemove(this)

        while(this.children.length) this.children[0].destroy()

        this.destroy()
    }
}