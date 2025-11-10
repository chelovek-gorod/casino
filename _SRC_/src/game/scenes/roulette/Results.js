import { Container, Sprite, Text } from "pixi.js";
import { EventHub, events, setHelpText, showPopup } from "../../../app/events";
import { styles } from "../../../app/styles";
import { removeCursorPointer, setCursorPointer } from "../../../utils/functions";
import { getRRTexture } from "../../../utils/textureGenerator";
import { POPUP_TYPE } from "../../popup/constants";
import { results } from "../../state";
import { RESULTS, HELP_TEXT } from "../../UI/constants";
import { SECTOR, SECTOR_NUMBERS } from "./constants";

export const RESULT_FONT_SIZES = [52, 42, 36]
const SIZE_TYPE = {
    last : 'last',
    previous : 'previous',
    rests : 'rests'
}
const START_X = RESULTS.width * -0.5 + 50
const REST_STEP_X = 56
const POSITIONS_X = [
    START_X,
    START_X + 70,
    START_X + 70 + REST_STEP_X * 1,
    START_X + 70 + REST_STEP_X * 2,
    START_X + 70 + REST_STEP_X * 3,
    START_X + 70 + REST_STEP_X * 4,
    START_X + 70 + REST_STEP_X * 5,
    START_X + 70 + REST_STEP_X * 6,
    START_X + 70 + REST_STEP_X * 7,
    START_X + 70 + REST_STEP_X * 8,
]
const POSITION_Y = RESULTS.height * -0.5

function setNumberInText(number, numberText) {
    numberText.text = number
    if (number === '') return

    if (SECTOR_NUMBERS[SECTOR.black].includes(+number)) {
        numberText.style = numberText.sizeType === SIZE_TYPE.rests
            ? styles.resultRestsBlack
            : numberText.sizeType === SIZE_TYPE.previous
            ? styles.resultPreviousBlack
            : styles.resultLastBlack
    } else if (SECTOR_NUMBERS[SECTOR.red].includes(+number)) {
        numberText.style = numberText.sizeType === SIZE_TYPE.rests
            ? styles.resultRestsRed
            : numberText.sizeType === SIZE_TYPE.previous
            ? styles.resultPreviousRed
            : styles.resultLastRed
    } else {
        numberText.style = numberText.sizeType === SIZE_TYPE.rests
            ? styles.resultRestsWhite
            : numberText.sizeType === SIZE_TYPE.previous
            ? styles.resultPreviousWhite
            : styles.resultLastWhite
    }
}

export default class Results extends Container {
    constructor() {
        super()

        this.bg = new Sprite(
            getRRTexture(RESULTS.width, RESULTS.height, RESULTS.borderRadius, RESULTS.color, RESULTS.alpha)
        )
        this.bg.anchor.set(0.5, 1)
        this.bg.eventMode = 'static'
        this.bg.on('pointerover', () => setHelpText(HELP_TEXT.logButton))
        this.bg.on('pointerout', () => setHelpText(''))
        this.bg.on('pointerdown', this.click, this)
        setCursorPointer(this.bg)
        this.addChild(this.bg)

        this.numbers = new Container()
        this.addChild(this.numbers)
        this.prepareNumbers()

        EventHub.on(events.addLog, this.addNumber, this)
    }

    prepareNumbers() {
        for(let i = 0; i < POSITIONS_X.length; i++) {
            const number = i < results.length ? results[i] : ''
            const numberText = new Text()
            numberText.sizeType = i > 1
                ? SIZE_TYPE.rests : i === 1
                ? SIZE_TYPE.previous : SIZE_TYPE.last
            setNumberInText(number, numberText)
            numberText.anchor.set(0.5)
            numberText.position.set(POSITIONS_X[i], POSITION_Y)
            this.numbers.addChild(numberText)
        }
    }

    addNumber(number) {
        let i = this.numbers.children.length - 1
        while(i > 0) {
            if (this.numbers.children[i - 1].text !== '') {
                setNumberInText(this.numbers.children[i - 1].text, this.numbers.children[i])
            }
            i--
        }
        setNumberInText(number, this.numbers.children[0])
    }

    click() {
        showPopup(POPUP_TYPE.logs)
    }

    kill() {
        EventHub.off(events.addLog, this.addNumber, this)

        removeCursorPointer(this.bg)
        this.bg.eventMode = 'none'
        this.bg.off('pointerover', () => setHelpText(HELP_TEXT.logButton))
        this.bg.off('pointerout', () => setHelpText(''))
        this.bg.off('pointerdown', this.click, this)
    }
}