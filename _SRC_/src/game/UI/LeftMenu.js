import { Container, Sprite } from "pixi.js";
import { HELP_TEXT, UI } from "./constants";
import { POPUP_TYPE } from "../popup/constants";
import { SCENE_NAME } from "../scenes/constants";
import ButtonUI from "./ButtonUI";
import { getRRTextureWithShadow } from "../../utils/textureGenerator";
import { showPopup } from "../../app/events";
import { tickerRemove } from "../../app/application";
import { currentScene } from "../state";

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

        this.log = new ButtonUI('logs', this.showRulesPopup.bind(this), true, HELP_TEXT.rulesButton)
        this.log.position.set(UI.offset, -UI.offset)
        
        this.addChild(this.bg, this.log)
    }

    showRulesPopup() {
        showPopup()
    }
}