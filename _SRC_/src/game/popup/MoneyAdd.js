import { Container, Graphics, Text } from "pixi.js";
import { EventHub, events } from "../../app/events";
import { styles } from "../../app/styles";
import { POPUP_TEXT } from "./constants"
import { getLanguage } from "../localization";

const titleY = -208
const hrY = -176
const hrX = 240

export default class MoneyAdd extends Container {
    constructor() {
        super()

        this.currentLanguage = getLanguage()
        EventHub.on( events.updateLanguage, this.updateLanguage, this )

        // title
        this.title = new Text({
            text: POPUP_TEXT.addMoney[ this.currentLanguage ],
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
    }

    updateLanguage(lang) {
        this.currentLanguage = lang
        this.title.text = POPUP_TEXT.addMoney[ this.currentLanguage ]
    }

    kill() {
        EventHub.off( events.updateLanguage, this.updateLanguage, this )
    }
}