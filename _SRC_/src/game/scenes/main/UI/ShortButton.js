import { Container, Text, Sprite } from "pixi.js"
import { images, sounds } from "../../../../app/assets"
import { removeCursorPointer, setCursorPointer } from "../../../../utils/functions"
import { styles } from "../../../../app/styles"
import { playSound } from "../../../../app/sound"
import { getRRTextureWithShadow } from "../../../../utils/textureGenerator"
import { BUTTON } from "../../../constants"

export default class ShortButton extends Container {
    constructor(text, x, y, callback, isActive = true) {
        super()
        this.position.set(x, y)

        this.callback = callback
        
        this.shadow = new Sprite()
        const [texture, padding] = getRRTextureWithShadow(
            BUTTON.height, BUTTON.height, BUTTON.borderRadius, 0x000000, 0, 6,
        )
        this.shadow.texture = texture
        this.shadow.anchor.set(0.5)
        this.addChild(this.shadow)

        this.image = new Sprite(images.short_button)
        this.image.anchor.set(0.5)
        setCursorPointer(this.image)
        this.image.on('pointerdown', this.click, this)
        this.image.on('pointerover', this.onHover, this)
        this.image.on('pointerout', this.onOut, this)
        this.addChild(this.image)

        this.label = new Text({ text: text, style: styles.shortButton })
        this.label.anchor.set(0.5)
        this.addChild(this.label)

        this.isActive = isActive
        this.setActive(this.isActive)
    }

    setActive(isActive = true) {
        this.isActive = isActive
        if (this.isActive) {
            this.alpha = 1
        } else {
            this.alpha = 0.5
            this.label.style = styles.shortButton
        }
    }

    click() {
        if (!this.isActive) return

        playSound(sounds.se_click)
        this.callback()
    }

    onHover() {
        if (!this.isActive) return

        this.label.style = styles.shortButtonHover
        playSound(sounds.se_swipe)
    }
    onOut() {
        this.label.style = styles.shortButton
    }

    deactivate() {
        this.image.off('pointerdown', this.click, this)
        this.image.off('pointerover', this.onHover, this)
        this.image.off('pointerout', this.onOut, this)
        this.label.style = styles.shortButton
    }

    kill() {
        removeCursorPointer(this.image)
        this.deactivate()
        while(this.children.length) this.children[0].destroy()
        this.destroy()
    }
}