import { Container, Sprite, Text } from "pixi.js";
import { SECTOR, SECTOR_NUMBERS, UI } from "../../../constants";
import ButtonUI from "./ButtonUI";
import { betCurrent, betsTotal, results } from "../../../state";
import { styles } from "../../../../app/styles";
import { atlases } from "../../../../app/assets";
import { getRRTexture, getRRTextureWithShadow } from "../../../../utils/textureGenerator";
import { EventHub, events } from "../../../../app/events";

export default class RightMenu extends Container {
    constructor() {
        super()

        this.betsBg = new Sprite()
        this.betsBg.texture = getRRTexture(
            UI.bets.width, UI.bets.height + UI.borderRadius, UI.borderRadius, UI.bets.bg, UI.bets.alpha
        )
        this.betsBg.anchor.set(1)
        this.betsBg.position.set(0, UI.borderRadius)

        let betsOffsetY = -UI.bets.height * 0.5

        this.betsTotal = new Sprite(atlases.icon.textures.chip_white)
        this.betsTotal.anchor.set(0.5)
        this.betsTotal.scale.set(UI.bets.iconScale)
        this.betsTotal.position.set(-UI.bets.width + UI.bets.iconSize * 0.75, betsOffsetY)
        this.betsTotalText = new Text({ text: `Сумма: ${betsTotal}`, style: styles.betsTotal })
        this.betsTotalText.anchor.set(0, 0.5)
        this.betsTotalText.position.set(this.betsTotal.position.x + UI.bets.iconSize * 0.75, betsOffsetY)

        this.betsCurrentText = new Text({ text: betCurrent, style: styles.betsCurrent })
        this.betsCurrentText.anchor.set(1, 0.5)
        this.betsCurrentText.position.set(-UI.size - UI.offset, betsOffsetY)

        this.bg = new Sprite()
        const [texture, padding] = getRRTextureWithShadow(
            UI.size + UI.borderRadius * 1.5, UI.size + UI.borderRadius, UI.borderRadius, UI.bg, -6, -6
        )
        this.bg.texture = texture
        this.bg.anchor.set(1)
        this.bg.position.set(UI.borderRadius + padding, UI.borderRadius + padding)

        this.bet = new ButtonUI('bet', this.testClick.bind(this), true )
        this.bet.position.set(-UI.offset, -UI.offset)

        this.repeatBeat = new ButtonUI('repeat', this.testClick.bind(this), true )
        this.repeatBeat.position.set(-UI.offset, -UI.offset - 70)

        this.cancelBeat = new ButtonUI('cancel', this.testClick.bind(this), true )
        this.cancelBeat.position.set(-UI.offset, -UI.offset - 130)
        
        this.addChild(
            this.betsBg, this.betsTotal, this.betsTotalText, this.betsCurrentText, this.bg, this.bet,
            this.cancelBeat, this.repeatBeat
        )

        EventHub.on(events.updateBetaTotal, this.updateBetaTotal, this)
    }

    updateBetaTotal(total) {
        this.betsTotalText.text = `Сумма: ${total}`
    }

    testClick() {
        console.log('get click')
    }

    kill() {
        EventHub.off(events.updateBetaTotal, updateBetaTotal, this)

        while(this.children.length) {
            tickerRemove(this.children[0])
            if ('kill' in this.children[0]) this.children[0].kill()
            else this.children[0].destroy()
        }
        this.destroy()
    }
}