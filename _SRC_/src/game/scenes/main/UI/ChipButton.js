import { Text, Sprite } from "pixi.js"
import { DropShadowFilter } from 'pixi-filters'
import { atlases, images, sounds } from "../../../../app/assets"
import { removeCursorPointer, setCursorPointer } from "../../../../utils/functions"
import { styles } from "../../../../app/styles"
import { playSound } from "../../../../app/sound"

export default class ChipButton extends Sprite {
    constructor(value, x, y, callback, isActive = false) {
        super(atlases.chip.textures[value])
        this.position.set(x, y)
        this.anchor.set(0.5)
        this.scale.set(0.5)

        this.callback = callback

        this.dropShadowFilter = new DropShadowFilter()
        this.dropShadowFilter.color = 0x000000
        this.dropShadowFilter.alpha = 0.5
        this.dropShadowFilter.offsetY = 6
        //this.dropShadowFilter.blur = 6
        this.filters = [this.dropShadowFilter]
        
        setCursorPointer(this)
        this.on('pointerdown', this.click, this)
        this.on('pointerover', this.onHover, this)
        this.on('pointerout', this.onOut, this)

        this.isActive = isActive
        this.setActive(this.isActive)
    }

    setActive(isActive = true) {
        this.isActive = isActive
        this.alpha = this.isActive ? 1 : 0.5
    }

    click() {
        if (this.isActive) return

        playSound(sounds.se_click)
        this.callback()
    }

    onHover() {
        if (this.isActive) return

        this.dropShadowFilter.color = 0xffffff
        playSound(sounds.se_swipe)
    }
    onOut() {
        this.dropShadowFilter.color = 0x000000
    }

    deactivate() {
        this.off('pointerdown', this.click, this)
        this.off('pointerover', this.onHover, this)
        this.off('pointerout', this.onOut, this)
    }

    kill() {
        removeCursorPointer(this)
        this.deactivate()
        this.destroy()
    }
}