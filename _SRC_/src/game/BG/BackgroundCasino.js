import { Container, Sprite } from "pixi.js";
import { tickerAdd, tickerRemove } from "../../app/application";
import { atlases } from "../../app/assets";
import { getRandom } from "../../utils/functions";
import BackgroundGradient from "./BackgroundGradient";

const settings = {
    step: 80,
    minScale: 0.25,
    maxScale: 0.75,
    minScaleSpeed: 0.0001,
    maxScaleSpeed: 0.0001,
}

class ImageBG extends Container {
    constructor(x, y, textureIndex) {
        super()

        this.scale.set( getRandom(settings.minScale, settings.maxScale) )
        this.position.set(x, y)

        this.white = new Sprite(atlases.for_bg.textures[`white_${textureIndex}`])
        this.white.anchor.set(0.5)
        this.addChild(this.white)

        this.lime = new Sprite(atlases.for_bg.textures[`lime_${textureIndex}`])
        this.lime.anchor.set(0.5)
        this.addChild(this.lime)

        this.scaleSpeed = getRandom(settings.minScaleSpeed, settings.maxScaleSpeed)
        this.alpha = this.scale.x

        this.isSizeUp = Math.random() < 0.5
        this.isLimeAlphaUp = Math.random() < 0.5
        this.lime.alpha = Math.random()
    }

    update(deltaMS) {
        const scaleSpeed = this.scaleSpeed * deltaMS
        if (this.isSizeUp) {
            this.scale.set( Math.min(settings.maxScale, this.scale.x + scaleSpeed) )
            if (this.scale.x === settings.maxScale) this.isSizeUp = false
        } else {
            this.scale.set( Math.max(settings.minScale, this.scale.x - scaleSpeed) )
            if (this.scale.x === settings.minScale) this.isSizeUp = true
        }

        const limeStep = deltaMS / 1000
        if (this.isLimeAlphaUp) {
            this.lime.alpha = Math.min(1, this.lime.alpha + limeStep)
            if ( this.lime.alpha === 1) this.isLimeAlphaUp = false
        } else {
            this.lime.alpha = Math.max(0, this.lime.alpha - limeStep)
            if ( this.lime.alpha === 0) this.isLimeAlphaUp = true
        }
    }

    kill() {
        while(this.children.length) this.children[0].destroy()

        this.destroy()
    }
}

export default class BackgroundCasino extends Container {
    constructor() {
        super()

        this.imagesPul = []

        this.bg = new BackgroundGradient([0x000044, 0x000000])
        this.addChild(this.bg)

        this.imagesContainer = new Container()
        this.addChild(this.imagesContainer)

        tickerAdd(this)
    }

    screenResize(screenData) {
        this.bg.screenResize(screenData)

        // clear screen
        while(this.imagesContainer.children.length) {
            this.imagesPul.push(this.imagesContainer.children[0])
            this.imagesContainer.removeChild( this.imagesContainer.children[0] )
        }
    
        // fill screen
        const  width = Math.ceil(screenData.width + (screenData.width % settings.step)) + settings.step
        const  height = Math.ceil(screenData.height + (screenData.height % settings.step)) + settings.step

        const startX = -width * 0.5
        const startY = -height * 0.5

        let isStartWithHalfX = true

        let index = 0

        for(let y = startY; y < -startY; y += settings.step) {
            isStartWithHalfX = !isStartWithHalfX
            index = isStartWithHalfX ? 1 : 3
            const xx = isStartWithHalfX ? startX : startX + settings.step
            for(let x = xx; x < -startX; x += settings.step * 2) {
                index++
                if (index > 4) index = 1
                this.imagesContainer.addChild( new ImageBG(x, y, index) )
            }
        }
    }

    tick(time) {
        this.imagesContainer.children.forEach( img => img.update(time.deltaMS) )
    }

    kill() {
        tickerRemove(this)
        while(this.imagesContainer.children.length) this.imagesContainer.children[0].kill()
        while(this.children.length) this.children[0].destroy()
        while(this.imagesPul.length) {
            const image = this.imagesPul.pop()
            image.kill()
        }
        this.destroy()
    }
}