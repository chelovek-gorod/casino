import { Container, Sprite } from "pixi.js"
import { atlases, sounds } from "../../../../app/assets"
import { removeCursorPointer, setCursorPointer } from "../../../../utils/functions"
import { playSound } from "../../../../app/sound"
import { UI } from "../../../constants"
import { setHelpText } from "../../../../app/events"

export default class ButtonUI extends Container {
    constructor(iconName, callback, isWhite = true, helpText = '') {
        super()
        this.callback = callback
        this.helpText = helpText

        this.bgImage = new Sprite(atlases.icon.textures[isWhite ? `${iconName}_yellow` : `${iconName}_white`])
        this.bgImage.anchor.set(0.5)
        this.bgImage.scale.set(UI.iconScale)
        this.mainImage = new Sprite(atlases.icon.textures[isWhite ? `${iconName}_white`: `${iconName}_yellow`])
        this.mainImage.anchor.set(0.5)
        this.mainImage.scale.set(UI.iconScale)

        setCursorPointer(this.mainImage)
        this.mainImage.on('pointerdown', this.click, this)
        this.mainImage.on('pointerover', this.onHover, this)
        this.mainImage.on('pointerout', this.onOut, this)
        this.addChild(this.bgImage, this.mainImage)

        this.isActive = true
        this.setActive(this.isActive)
    }

    setActive(isActive = true) {
        this.isActive = isActive
        this.alpha = isActive ? 1 : 0.2
    }

    click() {
        if (!this.isActive) return

        playSound(sounds.se_click)
        this.callback()
    }

    onHover() {
        setHelpText(this.helpText)
        if (!this.isActive) return

        this.mainImage.alpha = 0.5
        playSound(sounds.se_swipe)
    }
    onOut() {
        setHelpText('')
        this.mainImage.alpha = 1
    }

    deactivate() {
        this.mainImage.off('pointerdown', this.click, this)
        this.mainImage.off('pointerover', this.onHover, this)
        this.mainImage.off('pointerout', this.onOut, this)
    }

    kill() {
        removeCursorPointer(this.mainImage)
        this.deactivate()
        while(this.children.length) this.children[0].destroy()
        this.destroy()
    }
}