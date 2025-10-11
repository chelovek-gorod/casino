import { Container, Sprite, Text } from "pixi.js"
import { atlases } from "../../../app/assets"
import { styles } from "../../../app/styles"
import { CHIP_DATA } from "../../constants"
import { betCurrent } from "../../state"

function getChipTexture(bet = betCurrent) {
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
    constructor(value = betCurrent) {
        super()

        this.image = new Sprite( getChipTexture() )
        this.image.anchor.set(0.5)
        this.image.scale.set(CHIP_DATA.scale)
        this.addChild(this.image)

        this.text = new Text({text: value, style: styles.chip})
        this.text.anchor.set(0.5)
        this.addChild(this.text)
    }

    update(value = betCurrent) {
        this.image.texture = getChipTexture(value)
        this.text.text = value
    }

    kill() {
        while(this.children.length) {
            this.children[0].destroy()
        }

        this.destroy()
    }
}