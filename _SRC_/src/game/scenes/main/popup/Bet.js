import { Container, Graphics, Sprite, Text } from "pixi.js";
import { atlases, images } from "../../../../app/assets";
import { EventHub, events } from "../../../../app/events";
import { styles } from "../../../../app/styles";
import { removeCursorPointer, setCursorPointer } from "../../../../utils/functions";
import { CHIP, POPUP, POPUP_TEXT } from "../../../constants";
import { betCurrent, betNearest, editBet, isLangRu, changeSpielSplits, setNearest, isSingleBetsInSectors } from "../../../state";
import ShortButton from "../UI/ShortButton";

const chipButtons = {
    xs: [0, 80, 160],
    ys: [-15, 60],
    scale: 0.45
}

const titleY = -208
const hrY = -176
const hrX = 240
const spielSplitsY = -144
const nearestY = -100
const betY = 130

export default class Bet extends Container {
    constructor() {
        super()

        // title
        this.title = new Text({text: isLangRu ? POPUP_TEXT.bet.ru : POPUP_TEXT.bet.en, style: styles.popupTitle})
        this.title.anchor.set(0.5)
        this.title.position.set(0, titleY)
        this.addChild(this.title)
        // hr
        this.hr = new Graphics()
        this.hr.moveTo(-hrX, hrY)
        this.hr.lineTo( hrX, hrY)
        this.hr.stroke({width: 4, color: 0xffffff})
        this.addChild(this.hr)

        // spiel splits
        this.spielSplitsSubtitle = new Text({
            text: isLangRu ? POPUP_TEXT.spielSplits.ru : POPUP_TEXT.spielSplits.en,
            style: styles.popupSubTitle
        })
        this.spielSplitsSubtitle.anchor.set(0, 0.5)
        this.spielSplitsSubtitle.position.set(-176, spielSplitsY)
        this.addChild(this.spielSplitsSubtitle)

        this.spielSplitsSup = new ShortButton('<', 28, spielSplitsY, this.clickSpielSplits.bind(this))
        this.spielSplitsSup.scale.set(0.3)
        this.addChild(this.spielSplitsSup)

        const spielSplitsValue = isSingleBetsInSectors
            ? isLangRu ? POPUP_TEXT.spielSplitsValues[0].ru : POPUP_TEXT.spielSplitsValues[0].en
            : isLangRu ? POPUP_TEXT.spielSplitsValues[1].ru : POPUP_TEXT.spielSplitsValues[1].en
        this.spielSplitsValue = new Text({text: spielSplitsValue, style: styles.popupSubTitle})
        this.spielSplitsValue.anchor.set(0.5)
        this.spielSplitsValue.position.set(94, spielSplitsY)
        this.addChild(this.spielSplitsValue)

        this.spielSplitsAdd = new ShortButton('>', 160, spielSplitsY, this.clickSpielSplits.bind(this))
        this.spielSplitsAdd.scale.set(0.3)
        this.addChild(this.spielSplitsAdd)

        // nearest
        this.nearestSubtitle = new Text({text: isLangRu ? POPUP_TEXT.nearest.ru : POPUP_TEXT.nearest.en, style: styles.popupSubTitle})
        this.nearestSubtitle.anchor.set(0, 0.5)
        this.nearestSubtitle.position.set(-146, nearestY)
        this.addChild(this.nearestSubtitle)

        this.nearestSup = new ShortButton('-', 18, nearestY, this.clickNearestSup.bind(this))
        this.nearestSup.scale.set(0.3)
        this.addChild(this.nearestSup)

        this.nearestValue = new Text({text: `${betNearest} + 1 + ${betNearest}`, style: styles.popupSubTitle})
        this.nearestValue.anchor.set(0.5)
        this.nearestValue.position.set(74, nearestY)
        this.addChild(this.nearestValue)

        this.nearestAdd = new ShortButton('+', 130, nearestY, this.clickNearestAdd.bind(this))
        this.nearestAdd.scale.set(0.3)
        this.addChild(this.nearestAdd)

        // chips
        this.addChip(   0, -chipButtons.xs[2], chipButtons.ys[0])
        this.addChip(   1, -chipButtons.xs[1], chipButtons.ys[0])
        this.addChip(   5,  chipButtons.xs[0], chipButtons.ys[0])
        this.addChip(  10,  chipButtons.xs[1], chipButtons.ys[0])
        this.addChip(  25,  chipButtons.xs[2], chipButtons.ys[0])

        this.addChip(  50, -chipButtons.xs[2], chipButtons.ys[1])
        this.addChip( 100, -chipButtons.xs[1], chipButtons.ys[1])
        this.addChip( 500,  chipButtons.xs[0], chipButtons.ys[1])
        this.addChip(1000,  chipButtons.xs[1], chipButtons.ys[1])
        this.addChip(5000,  chipButtons.xs[2], chipButtons.ys[1])

        // bet
        this.betSup = new ShortButton('-', -chipButtons.xs[2], betY, this.clickBetSup.bind(this))
        this.betSup.scale.set(0.5)
        this.addChild(this.betSup)

        this.betValue = new Text({text: betCurrent, style: styles.popupTitle})
        this.betValue.anchor.set(0.5)
        this.betValue.scale.set(1.5)
        this.betValue.position.set(0, betY)
        this.addChild(this.betValue)

        this.betAdd = new ShortButton('+', chipButtons.xs[2], betY, this.clickBetAdd.bind(this))
        this.betAdd.scale.set(0.5)
        this.addChild(this.betAdd)

        EventHub.on(events.updateBet, this.updateBet, this)
        EventHub.on(events.updateNearestNumber, this.updateNearestNumber, this)
    }

    addChip(value, x, y) {
        this[`c${value}`] = new Sprite(value === 0 ? images.clear_bet : atlases.chip.textures[CHIP[`c${value}`]])
        this[`c${value}`].anchor.set(0.5)
        this[`c${value}`].scale.set(chipButtons.scale)
        this[`c${value}`].position.set(x, y)
        this[`c${value}`].value = value
        this[`c${value}`].isChip = true
        setCursorPointer(this[`c${value}`])
        this[`c${value}`].on('pointerdown', this.clickChip, this)
        this.addChild(this[`c${value}`])
    }

    updateBet( bet ) {
        this.betValue.text = bet
    }
    updateNearestNumber( number ) {
        this.nearestValue.text = `${number} + 1 + ${number}`
    }

    clickSpielSplits() {
        this.spielSplitsValue.text = changeSpielSplits()
            ? isLangRu ? POPUP_TEXT.spielSplitsValues[0].ru : POPUP_TEXT.spielSplitsValues[0].en
            : isLangRu ? POPUP_TEXT.spielSplitsValues[1].ru : POPUP_TEXT.spielSplitsValues[1].en
    }

    clickNearestSup() {
        setNearest(false)
    }

    clickNearestAdd() {
        setNearest(true)
    }

    clickChip(event) {
        // event.target.value
        editBet(event.target.value, true)
    }

    clickBetSup() {
        editBet(-1, false)
    }

    clickBetAdd() {
        editBet(1, false)
    }

    kill() {
        EventHub.off(events.updateBet, this.updateBet, this)
        EventHub.off(events.updateNearestNumber, this.updateNearestNumber, this)

        while(this.children.length) {
            tickerRemove(this.children[0])
            if ('isChip' in this.children[0]) removeCursorPointer(this.children[0])
            if ('kill' in this.children[0]) this.children[0].kill()
            else this.children[0].destroy()
        }
        this.destroy()
    }
}