import { Container, Sprite, Text } from "pixi.js"
import { atlases } from "../../../app/assets"
import { styles } from "../../../app/styles"
import { CHIP_DATA } from "../../constants"

function getChipTexture(bet) {
    if (bet < 5) return atlases.chip.textures.c1
    if (bet < 10) return atlases.chip.textures.c5
    if (bet < 25) return atlases.chip.textures.c10
    if (bet < 50) return atlases.chip.textures.c25
    if (bet < 100) return atlases.chip.textures.c50
    if (bet < 500) return atlases.chip.textures.c100
    if (bet < 1000) return atlases.chip.textures.c500
    if (bet < 5000) return atlases.chip.textures.c1000
    return atlases.chip.textures.c5000
}

export default class Chip extends Container {
    constructor(isForField = true) {
        super()

        this.image = new Sprite( getChipTexture(0) )
        this.image.anchor.set(0.5)
        this.image.scale.set(isForField ? CHIP_DATA.scale : CHIP_DATA.nearestScale)
        this.addChild(this.image)

        if (isForField) {
            this.text = new Text({text: 0, style: styles.chip})
            this.text.anchor.set(0.5)
            this.addChild(this.text)
        }
    }

    update(value) {
        if ( !('text' in this) ) return

        const current = value === 0 ? 0 : +this.text.text + value
        this.image.texture = getChipTexture(current)
        this.text.text = current
    }

    kill() {
        while(this.children.length) {
            this.children[0].destroy()
        }

        this.destroy()
    }
}