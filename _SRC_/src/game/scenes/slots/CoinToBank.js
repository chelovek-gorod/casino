import { Sprite } from "pixi.js"
import { kill, tickerAdd } from "../../../app/application"
import { atlases } from "../../../app/assets"
import { moveToTarget } from "../../../utils/functions"

export default class CoinToBank extends Sprite {
    constructor (x, y, targetX, targetY) {
        super(atlases.slots.textures.coin)
        this.anchor.set(0.5)
        this.scale.set(0.7)
        this.position.set(x, y)

        this.speed = 1.6
        this.scaleSpeed = 0.01
        this.isScaleUp = false

        this.target = {x: targetX, y: targetY}
        tickerAdd(this)
    }

    tick(time) {
        const path = this.speed * time.deltaMS
        const scaleStep = this.scaleSpeed * time.deltaMS
        if (this.isScaleUp) {
            this.scale.x = Math.min(0.7, this.scale.x + scaleStep)
            if (this.scale.x === 0.7) this.isScaleUp = false
        } else {
            this.scale.x = Math.max(0.1, this.scale.x - scaleStep)
            if (this.scale.x === 0.1) this.isScaleUp = true
        }

        if (moveToTarget(this, this.target, path)) {
            kill(this)
        }
    }
}