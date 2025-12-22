import { Container, Graphics, Sprite, Text } from "pixi.js";
import { styles } from "../../app/styles";
import { POPUP_TEXT } from "./constants"
import { getLanguage } from "../localization";
import { EventHub, events } from "../../app/events";
import ShortButton from "../UI/ShortButton";
import { atlases } from "../../app/assets";
import { RULES_S, RULES_S_LIST } from "./rulesText";

const titleY = -208
const hrY = -176
const hrX = 240

export default class RulesS extends Container {
    constructor() {
        super()

        this.currentLanguage = getLanguage()
        EventHub.on( events.updateLanguage, this.updateLanguage, this )

        // title
        this.title = new Text({
            text: POPUP_TEXT.rulesS[ this.currentLanguage ],
            style: styles.popupTitle
        })
        this.title.anchor.set(0.5)
        this.title.position.set(0, titleY)
        this.addChild(this.title)
        // hr
        this.hr = new Graphics()
        this.hr.moveTo(-hrX, hrY)
        this.hr.lineTo( hrX, hrY)
        this.hr.stroke({width: 4, color: 0xffffff})
        this.addChild(this.hr)

        //
        this.ruleIndex = 0

        this.image = new Sprite(atlases.rules_slots.textures[RULES_S_LIST[this.ruleIndex]])
        this.image.position.set(-225, -160)
        this.addChild(this.image)

        this.textLeft = new Text({text: '', style: styles.rulesHalf})
        this.textRight = new Text({text: '', style: styles.rulesHalf})
        this.textCenter = new Text({text: '', style: styles.rulesFull})
        //

        this.prevBtn = new ShortButton('play', -200, 195, this.prevClick.bind(this), true)
        this.prevBtn.scale.set(-0.5, 0.5)
        this.nextBtn = new ShortButton('play', 200, 195, this.nextClick.bind(this), true)
        this.nextBtn.scale.set(0.5)
        this.addChild(this.prevBtn, this.nextBtn)

        this.setRule()
    }

    prevClick() {
        this.ruleIndex--
        if (this.ruleIndex < 0) this.ruleIndex = RULES_S_LIST.length
        this.setRule()
    }
    nextClick() {
        this.ruleIndex++
        if (this.ruleIndex >= RULES_S_LIST.length) this.ruleIndex = 0
        this.setRule()
    }
    setRule() {
        this.image.texture = atlases.rules_slots.textures[RULES_S_LIST[this.ruleIndex]]

        // RULES_S[RULES_S_LIST[this.ruleIndex]][this.currentLanguage]
    }

    updateLanguage(lang) {
        this.currentLanguage = lang
        this.title.text = POPUP_TEXT.rulesS[ this.currentLanguage ]
    }

    kill() {
        EventHub.off( events.updateLanguage, this.updateLanguage, this )
    }
}