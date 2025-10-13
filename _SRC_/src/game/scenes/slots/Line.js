import { Container, Sprite, Graphics } from "pixi.js";
import { tickerAdd, tickerRemove } from "../../../app/application";
import { atlases } from "../../../app/assets";
import { getRandom } from "../../../utils/functions";
import { SLOTS_LINES_DATA, SLOTS_LINES } from "../../constants";

const STATE = {
    start: 'start',
    run: 'run',
    stop: 'stop',
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
            image.position.set(0, SLOTS_LINES.positionsY[index])
            this.imagesContainer.addChildAt(image, 0)
        })
        
        this.speed = 0
        this.acc = SLOTS_LINES.acceleration
        this.normalSpeed = 0
        this.startTimeout = 0
        this.runTime = 0
        this.state = STATE.stop
        this.stopCallback
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
        this.startTimeout = SLOTS_LINES.delayRate * delayIndex
            + getRandom(SLOTS_LINES.minTimeout, SLOTS_LINES.maxTimeout)
        this.runTime = SLOTS_LINES.duration
        this.normalSpeed = getRandom(SLOTS_LINES.minSpeed, SLOTS_LINES.maxSpeed)
        this.speed = 0
        this.state = STATE.start
        tickerAdd(this)
    }

    stop() {
        this.state = STATE.stop
        this.speed = 0
        tickerRemove(this)

        this.visibleImages.forEach( (image, index) => {
            image.position.set(0, SLOTS_LINES.positionsY[index])
            this.imagesContainer.addChildAt(image, 0)
        })

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

    tick(time) {
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