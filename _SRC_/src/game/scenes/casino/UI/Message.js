import { Container, Graphics, Text } from "pixi.js";
import { tickerAdd, tickerRemove } from "../../../../app/application";
import { EventHub, events } from "../../../../app/events";
import { styles } from "../../../../app/styles";
import { MESSAGE, SECTOR_NUMBERS, SECTOR } from "../../../constants";

export default class Message extends Container {
    constructor() {
        super()

        this.bg = new Graphics()
        this.text = new Text({text: 36, style: styles.messageWhite})
        this.text.anchor.set(0.5)
        this.offset = 0
        this.alpha = 0
        this.speed = 0
        this.delay = 0
        // this.addChild(this.bg, this.text)

        EventHub.on(events.showMessage, this.show, this)
    }

    screenResize(screenData) {
        this.bg.clear()
        this.bg.rect(-screenData.width * 2, MESSAGE.y, screenData.width * 4, MESSAGE.height)
        this.bg.fill(MESSAGE.bg)
        this.bg.alpha = MESSAGE.alpha
        this.offset = screenData.centerX
        this.speed = 1 / MESSAGE.inOutDuration
    }
 
    show(text) {
        this.delay = MESSAGE.showDuration
        this.alpha = 0
        this.position.set(-this.offset, 0)

        this.text.text = text
        if (isNaN(Number(text))) this.text.style = styles.messageText
        else if (SECTOR_NUMBERS[SECTOR.black].includes(text)) this.text.style = styles.messageBlack
        else if (SECTOR_NUMBERS[SECTOR.red].includes(text)) this.text.style = styles.messageRed
        else this.text.style = styles.messageGreen

        this.addChild(this.bg, this.text)
        tickerAdd(this)
    }

    tick(time) {
        if (this.delay > 0 && this.alpha < 1) {
            this.alpha = Math.min(1, this.alpha + this.speed * time.deltaMS)
            this.position.x = this.offset * (this.alpha - 1)
        } else if (this.delay > 0) {
            this.delay -= time.deltaMS
        } else if (this.alpha > 0) {
            this.alpha = Math.max(0, this.alpha - this.speed * time.deltaMS)
            this.position.x = (1 - this.alpha) * this.offset
        } else {
            this.removeChild(this.bg, this.text)
            tickerRemove(this)
        }
    }

    kill() {
        EventHub.off(events.showMessage, this.show, this)
        tickerRemove(this)

        while(this.children.length) this.children[0].destroy()

        this.destroy()
    }
}