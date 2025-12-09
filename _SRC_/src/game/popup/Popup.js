import { Container, Graphics } from "pixi.js"
import { EventHub, events } from "../../app/events"
import { BUTTON_TEXT } from "../UI/constants"
import { POPUP, POPUP_TYPE } from "./constants"
import Button from "../UI/Button"
import Bet from "./Bet"
import Logs from "./Logs"
import GameSettings from "./GameSettings"
import MoneyAdd from "./MoneyAdd"
import RulesR from "./RulesR"
import RulesS from "./RulesS"
import { getLanguage } from "../localization"

export default class Popup extends Container {
    constructor() {
        super()

        this.currentLanguage = getLanguage()
        EventHub.on(events.updateLanguage, this.updateLanguage, this)

        this.shell = new Graphics()
        this.shell.eventMode = 'static'

        this.box = new Container()

        this.bg = new Graphics()
        this.bg.roundRect(POPUP.x, POPUP.y, POPUP.width, POPUP.height, POPUP.borderRadius)
        this.bg.fill(POPUP.bg)
        this.bg.stroke({width: POPUP.borderWidth, color: POPUP.borderColor})
        
        this.closeButton = new Button(
            BUTTON_TEXT.done[ this.currentLanguage ],
            POPUP.closeButton.x, POPUP.closeButton.y, this.close.bind(this)
        )
        this.closeButton.scale.set(POPUP.closeButton.scale)

        this.box.addChild(this.bg, this.closeButton)

        this.type = POPUP_TYPE.EMPTY
        this[POPUP_TYPE.bet] = new Bet()
        this[POPUP_TYPE.logs] = new Logs()
        this[POPUP_TYPE.settings] = new GameSettings()
        this[POPUP_TYPE.addMoney] = new MoneyAdd()
        this[POPUP_TYPE.rulesR] = new RulesR()
        this[POPUP_TYPE.rulesS] = new RulesS()

        EventHub.on(events.showPopup, this.show, this)
    }

    screenResize(screenData) {
        this.shell.clear()
        this.shell.rect(-screenData.centerX, -screenData.centerY, screenData.width, screenData.height)
        this.shell.fill(POPUP.sellColor)
        this.shell.alpha = POPUP.sellAlpha

        const screenSize = screenData.isLandscape ? screenData.height : screenData.width
        const scale = Math.min(1, screenSize / POPUP.size)
        this.box.scale.set(scale)
    }

    show(type) {
        this.addChild(this.shell, this.box)
        if (type && type in this) {
            this.box.addChild(this[type])
            this.type = type
        }
    }

    close() {
        this.closeButton.onOut()
        if (this.type) {
            this.box.removeChild(this[this.type])
            this.type = POPUP_TYPE.EMPTY
        }
        this.removeChildren()
    }

    updateLanguage(lang) {
        this.currentLanguage = lang
        this.closeButton.setLabel( BUTTON_TEXT.done[ this.currentLanguage ] )
    }

    kill() {
        EventHub.off(events.updateLanguage, this.updateLanguage, this)
        EventHub.off(events.showPopup, this.show, this)
    }
}