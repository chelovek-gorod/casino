import { Container, Sprite, Graphics } from "pixi.js";
import { tickerAdd, tickerRemove } from "../../../app/application";
import { atlases } from "../../../app/assets";
import { getRandom } from "../../../utils/functions";
import { SLOTS_LINES_DATA, SLOTS_LINES, SLOTS_HIGHLIGHT, MESSAGE } from "../../constants";

const STATE = {
    idle: 'idle',

    start: 'start',
    run: 'run',
    stop: 'stop',

    highlightIn: 'highlightIn',
    highlight: 'highlight',
    highlightOut: 'highlightOut',
}

export default class Line extends Container {
    constructor(stopCallback) {
        super()

        this.stopCallback = stopCallback

        const mask = new Graphics()
        mask.rect(0, 0, SLOTS_LINES.slotWidth, SLOTS_LINES.slotHeight * 3)
        mask.fill(0xffffff)
        this.addChild(mask)

        this.bg = new Graphics()
        this.bg.rect(0, 0, SLOTS_LINES.slotWidth, SLOTS_LINES.slotHeight * 3)
        this.bg.fill(0xffffff)
        this.addChild(this.bg)

        this.imagesMaskContainer = new Container()
        this.imagesMaskContainer.mask = mask
        this.addChild(this.imagesMaskContainer)

        this.imagesContainer = new Container()
        this.imagesMaskContainer.addChild(this.imagesContainer)

        this.imagesList = []
        Object.keys(SLOTS_LINES_DATA).forEach( key => {
            for(let i = 0; i < SLOTS_LINES_DATA[key].count; i++) {
                this.imagesList.push(key)
            }
        })
        this.imagesList.sort(() => Math.random() - 0.5)

        this.nextImageIndex = 3
        this.visibleImages = [
            new Sprite(atlases.slots.textures[ this.imagesList[ 3 ] ]),
            new Sprite(atlases.slots.textures[ this.imagesList[ 2 ] ]),
            new Sprite(atlases.slots.textures[ this.imagesList[ 1 ] ]),
            new Sprite(atlases.slots.textures[ this.imagesList[ 0 ] ]),
        ]

        this.visibleImages.forEach( (image, index) => {
            image.anchor.set(0.5)
            image.scale.set(SLOTS_HIGHLIGHT.minScale)
            image.position.set(
                SLOTS_LINES.slotHalfWidth, SLOTS_LINES.positionsY[index] + SLOTS_LINES.slotHalfHeight
            )
            this.imagesContainer.addChildAt(image, 0)
        })
        
        this.speed = 0
        this.acc = SLOTS_LINES.acceleration
        this.normalSpeed = 0
        this.startTimeout = 0
        this.runTime = 0
        this.state = STATE.idle
        this.stopCallback

        this.highlightData = {
            valuesList: [],
            callback: null,
            duration: SLOTS_HIGHLIGHT.duration,
            scale: SLOTS_HIGHLIGHT.minScale,
            alpha: 1,
        }
        this.highlightCallbackTimeout = MESSAGE.showDuration + MESSAGE.inOutDuration * 2
    }

    getResults() {
        const results = []
        for (let i = 1; i < 4; i++) {
            let index = this.nextImageIndex - i
            if (index < 0) index += this.imagesList.length
            results.push(this.imagesList[index])
        }
        return results
    }

    run(delayIndex) {
        this.startTimeout = SLOTS_LINES.delay * delayIndex
            + getRandom(SLOTS_LINES.minTimeout, SLOTS_LINES.maxTimeout)
        this.runTime = getRandom(SLOTS_LINES.durationMin, SLOTS_LINES.durationMax)
        this.normalSpeed = getRandom(SLOTS_LINES.minSpeed, SLOTS_LINES.maxSpeed)
        this.speed = 0
        this.state = STATE.start
        tickerAdd(this)
    }

    stop() {
        this.imagesContainer.position.y = 0

        this.visibleImages.forEach( (image, index) => {
            image.position.set(
                SLOTS_LINES.slotHalfWidth, SLOTS_LINES.positionsY[index] + SLOTS_LINES.slotHalfHeight
            )
        })

        tickerRemove(this)

        this.speed = 0
        this.state = STATE.idle

        this.stopCallback()
    }

    updateImages() {
        this.imagesContainer.position.y -= SLOTS_LINES.slotHeight

        this.nextImageIndex++
        if (this.nextImageIndex === this.imagesList.length) this.nextImageIndex = 0
        const nextTexture = atlases.slots.textures[ this.imagesList[this.nextImageIndex] ]

        this.visibleImages[3].texture = this.visibleImages[2].texture
        this.visibleImages[2].texture = this.visibleImages[1].texture
        this.visibleImages[1].texture = this.visibleImages[0].texture
        this.visibleImages[0].texture = nextTexture

        if (this.state === STATE.stop && this.speed === SLOTS_LINES.stopSpeed) this.stop()
    }

    highlight(arr, callback) {
        this.highlightData.valuesList = arr
        this.highlightData.callback = callback
        this.highlightData.duration = SLOTS_HIGHLIGHT.duration
        this.highlightData.scale = SLOTS_HIGHLIGHT.minScale
        this.highlightData.alpha = 1

        this.state = STATE.highlightIn
        tickerAdd(this)
    }
    updateHighlight() {
        // top
        if (this.highlightData.valuesList[0]) {
            this.visibleImages[1].scale.set(this.highlightData.scale)
        } else {
            this.visibleImages[1].alpha = this.highlightData.alpha
        }

        // mid
        if (this.highlightData.valuesList[1]) {
            this.visibleImages[2].scale.set(this.highlightData.scale)
        } else {
            this.visibleImages[2].alpha = this.highlightData.alpha
        }

        // bot
        if (this.highlightData.valuesList[2]) {
            this.visibleImages[3].scale.set(this.highlightData.scale)
        } else {
            this.visibleImages[3].alpha = this.highlightData.alpha
        }
    }

    tick(time) {
        // highlight
        if (this.state === STATE.highlightIn) {
            this.highlightData.alpha = Math.max(
                SLOTS_HIGHLIGHT.minAlpha,
                this.highlightData.alpha - SLOTS_HIGHLIGHT.stepAlphaInMS * time.deltaMS
            )
            this.highlightData.scale = Math.min(
                SLOTS_HIGHLIGHT.maxScale,
                this.highlightData.scale + SLOTS_HIGHLIGHT.stepScaleInMS * time.deltaMS
            )
            if (this.highlightData.scale === SLOTS_HIGHLIGHT.maxScale) this.state = STATE.highlight

            return this.updateHighlight()
        }
        if (this.state === STATE.highlight) {
            this.highlightData.duration = Math.max(0, this.highlightData.duration - time.deltaMS)
            if (this.highlightData.duration === 0) this.state = STATE.highlightOut

            return
        }
        if (this.state === STATE.highlightOut) {
            this.highlightData.alpha = Math.min(
                1,
                this.highlightData.alpha + SLOTS_HIGHLIGHT.stepAlphaInMS * time.deltaMS
            )
            this.highlightData.scale = Math.max(
                SLOTS_HIGHLIGHT.minScale,
                this.highlightData.scale - SLOTS_HIGHLIGHT.stepScaleInMS * time.deltaMS
            )
            if (this.highlightData.scale === SLOTS_HIGHLIGHT.minScale) {
                this.state = STATE.idle
                tickerRemove(this)
                setTimeout(() => this.highlightData.callback(), this.highlightCallbackTimeout)
            }

            return this.updateHighlight()
        }

        if (this.state === STATE.idle) return tickerRemove(this)

        // rotation
        if (this.startTimeout > 0) {
            this.startTimeout -= time.deltaMS
            return
        }
        
        if (this.runTime > 0) {
            this.runTime -= time.deltaMS
        } else {
            this.state = STATE.stop
        }

        if (this.state === STATE.start) {
            this.speed = Math.min(this.normalSpeed, this.speed + this.acc * time.deltaMS)
            if (this.speed === this.normalSpeed) this.state = STATE.run
        }

        if (this.state === STATE.stop) {
            this.speed = Math.max(SLOTS_LINES.stopSpeed, this.speed - this.acc * time.deltaMS)
        }

        this.imagesContainer.position.y += this.speed * time.deltaMS
        if (this.imagesContainer.position.y > SLOTS_LINES.slotHeight) this.updateImages()
    }

    kill() {
        tickerRemove(this)

        while(this.children.length) {
            if ('kill' in this.children[0]) this.children[0].kill()
            else this.children[0].destroy()
        }
        this.destroy()
    }
}