import { Container, Sprite } from "pixi.js";
import { HELP_TEXT, POPUP_TYPE, UI } from "../../../constants";
import ButtonUI from "./ButtonUI";
import { getRRTextureWithShadow } from "../../../../utils/textureGenerator";
import { showPopup } from "../../../../app/events";

export default class LeftMenu extends Container {
    constructor() {
        super()

        this.bg = new Sprite()
        const [texture, padding] = getRRTextureWithShadow(
            UI.size + UI.borderRadius * 1.5, UI.size + UI.borderRadius, UI.borderRadius, UI.bg, 6, -6,
        )
        this.bg.texture = texture
        this.bg.anchor.set(0, 1)
        this.bg.position.set(-UI.borderRadius - padding, UI.borderRadius + padding)

        this.log = new ButtonUI('logs', this.showBetPopup.bind(this), true, HELP_TEXT.logButton)
        this.log.position.set(UI.offset, -UI.offset)
        
        this.addChild(this.bg, this.log)
    }

    showBetPopup() {
        showPopup(POPUP_TYPE.logs)
    }

    kill() {
        while(this.children.length) {
            tickerRemove(this.children[0])
            if ('kill' in this.children[0]) this.children[0].kill()
            else this.children[0].destroy()
        }
        this.destroy()
    }
}