import { Container, Sprite, Text } from "pixi.js";
import { SECTOR, SECTOR_NUMBERS, UI } from "../../../constants";
import ButtonUI from "./ButtonUI";
import { results } from "../../../state";
import { styles } from "../../../../app/styles";
import { getRRTexture, getRRTextureWithShadow } from "../../../../utils/textureGenerator";

const SIZE_TYPE = {
    last : 'last',
    previous : 'previous',
    rests : 'rests'
}

function setNumberInText(number, numberText) {
    numberText.text = number
    if (number === '') return

    if (SECTOR_NUMBERS[SECTOR.black].includes(+number)) {
        numberText.style = numberText.sizeType === SIZE_TYPE.rests
            ? styles.logRestsBlack
            : numberText.sizeType === SIZE_TYPE.previous
            ? styles.logPreviousBlack
            : styles.logLastBlack
    } else if (SECTOR_NUMBERS[SECTOR.red].includes(+number)) {
        numberText.style = numberText.sizeType === SIZE_TYPE.rests
            ? styles.logRestsRed
            : numberText.sizeType === SIZE_TYPE.previous
            ? styles.logPreviousRed
            : styles.logLastRed
    } else {
        numberText.style = numberText.sizeType === SIZE_TYPE.rests
            ? styles.logRestsWhite
            : numberText.sizeType === SIZE_TYPE.previous
            ? styles.logPreviousWhite
            : styles.logLastWhite
    }
}

export default class LeftMenu extends Container {
    constructor() {
        super()

        this.logsBg = new Sprite()
        this.logsBg.texture = getRRTexture(
            UI.logs.width + UI.borderRadius, UI.logs.height, UI.borderRadius, UI.logs.bg, UI.logs.alpha
        )
        this.logsBg.anchor.set(0, 1)
        this.logsBg.position.set(-UI.borderRadius, 0)

        this.logsContainer = new Container()
        let logsOffsetY = 0
        for (let i = 0; i < UI.logs.count; i++) {
            logsOffsetY -= UI.logs.offsetsY[ Math.min(2, i) ]
            const number = results.length > i ? results[i] : ''
            const style = i > 1 ? styles.logRestsRed : i === 1 ? styles.logPreviousRed : styles.logLastRed
            const numberText = new Text({ text: number, style: style })
            numberText.anchor.set(0.5)
            numberText.position.set(UI.logs.offsetX, logsOffsetY)
            numberText.sizeType = i > 1 ? SIZE_TYPE.rests : i === 1 ? SIZE_TYPE.previous : SIZE_TYPE.last
            setNumberInText(number, numberText)
            this.logsContainer.addChild(numberText)
        }

        this.bg = new Sprite()
        const [texture, padding] = getRRTextureWithShadow(
            UI.size + UI.borderRadius * 1.5, UI.size + UI.borderRadius, UI.borderRadius, UI.bg, 6, -6,
        )
        this.bg.texture = texture
        this.bg.anchor.set(0, 1)
        this.bg.position.set(-UI.borderRadius - padding, UI.borderRadius + padding)

        this.log = new ButtonUI('logs', this.testClick.bind(this), true )
        this.log.position.set(UI.offset, -UI.offset)
        
        this.addChild(this.logsBg, this.logsContainer, this.bg, this.log)
    }

    testClick() {
        console.log('get click')
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