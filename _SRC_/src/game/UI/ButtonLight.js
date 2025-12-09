import { Container, Sprite, Text } from "pixi.js"
import { tickerAdd, tickerRemove } from "../../app/application"
import { removeCursorPointer, setCursorPointer } from "../../utils/functions"
import { atlases, sounds } from "../../app/assets"
import { soundPlay } from "../../app/sound"
import { styles } from "../../app/styles"

const alphaStep = 0.001

export default class ButtonLight extends Container {
    constructor(labelText, callback, isActive = true) {
        super()

        this.callback = callback

        this.base = new Sprite(atlases.button_lamps.textures.button_off)
        this.base.anchor.set(0.5)
        setCursorPointer(this.base)
        this.base.on('pointerdown', this.click, this)
        this.base.on('pointerover', this.onHover, this)
        this.base.on('pointerout', this.onOut, this)
        this.addChild(this.base)

        this.baseOn = new Sprite(atlases.button_lamps.textures.button_on)
        this.baseOn.anchor.set(0.5)
        this.baseOn.alpha = 0
        this.addChild(this.baseOn)

        this.alphaDataList = [
            {value: 1, isUp: false},
            {value: 0.333, isUp: true},
            {value: 0.666, isUp: true},
            {value: 0, isUp: true}
        ]
        this.lamps = new Container()
        for(let i = 0; i < 20; i++) {
            const lamp = new Sprite(atlases.button_lamps.textures[`${i}_on`])
            lamp.anchor.set(0.5)
            lamp.alpha = this.alphaDataList[i % this.alphaDataList.length].value
            this.lamps.addChild(lamp)
        }
        this.addChild(this.lamps)
        
        this.label = new Text({text: labelText, style: styles.buttonLight})
        this.label.anchor.set(0.5)
        this.addChild(this.label)

        this.isActive = isActive
        this.setActive(this.isActive)

        tickerAdd(this)
    }

    setLabel(text) {
        this.label.text = text
    }

    setActive(isActive = true) {
        this.isActive = isActive
        if (this.isActive) {
            this.alpha = 1
            tickerAdd(this)
        } else {
            this.alpha = 0.5
            tickerRemove(this)
            this.lamps.children.forEach( lamp => lamp.alpha = 0 )
        }
    }

    click() {
        if (!this.isActive) return

        soundPlay(sounds.se_click)
        this.callback()
    }

    onHover() {
        if (!this.isActive) return

        soundPlay(sounds.se_swipe)
        this.baseOn.alpha = 1
        this.label.style = styles.buttonLightOn
    }
    onOut() {
        this.baseOn.alpha = 0
        this.label.style = styles.buttonLight
    }

    tick(time) {
        const step = alphaStep * time.deltaMS
        this.alphaDataList.forEach(data => {
            if (data.isUp) {
                data.value = Math.min(1, data.value + step)
                if (data.value === 1) data.isUp = false
            } else {
                data.value = Math.max(0, data.value - step)
                if (data.value === 0) data.isUp = true
            }
        })
        this.lamps.children.forEach( (lamp, i) => {
            lamp.alpha = this.alphaDataList[i % this.alphaDataList.length].value
        })
    }

    kill() {
        removeCursorPointer(this.base)
        this.base.off('pointerdown', this.click, this)
        this.base.off('pointerover', this.onHover, this)
        this.base.off('pointerout', this.onOut, this)
    }
}