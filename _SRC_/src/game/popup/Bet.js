import { Container, Graphics, Sprite, Text } from "pixi.js";
import { atlases } from "../../app/assets";
import { EventHub, events } from "../../app/events";
import { styles } from "../../app/styles";
import { removeCursorPointer, setCursorPointer, formatNumber } from "../../utils/functions";
import { POPUP_TEXT } from "./constants"
import { SCENE_NAME } from "../scenes/constants";
import { betCurrent, betNearest, editBet, changeSpielSplits, setNearest,
    isSingleBetsInSectors, currentScene } from "../state";
import ShortButton from "../UI/ShortButton";
import { getLanguage } from "../localization";

const chipButtons = {
    xs: [0, 80, 160],
    ys: [-15, 60],
    scale: 1
}

const titleY = -208
const hrY = -176
const hrX = 240
const spielSplitsY = -144
const nearestY = -100
const betY = 130

const textOffset = 0
function getWordPositionsList(sizesList) {
    let fullWidth = -textOffset
    for(let i = 0; i < sizesList.length; i++) {
        fullWidth += textOffset + sizesList[i]
    }
    const positionsX = []
    let x = -fullWidth * 0.5
    for(let i = 0; i < sizesList.length; i++) {
        positionsX.push(x + sizesList[i] * 0.5)
        x += sizesList[i] + textOffset
    }
    return positionsX
}

export default class Bet extends Container {
    constructor() {
        super()

        this.currentLanguage = getLanguage()
        EventHub.on( events.updateLanguage, this.updateLanguage, this )

        // title
        this.title = new Text({text: POPUP_TEXT.bet[ this.currentLanguage ], style: styles.popupTitle})
        this.title.anchor.set(0.5)
        this.title.position.set(0, titleY)
        this.addChild(this.title)
        // hr
        this.hr = new Graphics()
        this.hr.moveTo(-hrX, hrY)
        this.hr.lineTo( hrX, hrY)
        this.hr.stroke({width: 4, color: 0xffffff})
        this.addChild(this.hr)

        if (currentScene === SCENE_NAME.Roulette) {

            // spiel splits
            this.spielSplitsSubtitle = new Text({
                text: POPUP_TEXT.spielSplits[ this.currentLanguage ],
                style: styles.popupSubTitle
            })
            this.spielSplitsSubtitle.anchor.set(0.5)

            this.spielSplitsSup = new ShortButton('prv', 0, spielSplitsY, this.clickSpielSplits.bind(this))
            this.spielSplitsSup.scale.set(0.3)

            const spielSplitsValue = isSingleBetsInSectors
                ? POPUP_TEXT.spielSplitsValues[0][ this.currentLanguage ]
                : POPUP_TEXT.spielSplitsValues[1][ this.currentLanguage ]
            this.spielSplitsValue = new Text({text: spielSplitsValue, style: styles.popupSubTitle})
            this.spielSplitsValue.anchor.set(0.5)

            this.spielSplitsAdd = new ShortButton('nxt', 0, spielSplitsY, this.clickSpielSplits.bind(this))
            this.spielSplitsAdd.scale.set(0.3)

            let points = getWordPositionsList([
                this.spielSplitsSubtitle.width,
                this.spielSplitsSup.width,
                this.spielSplitsValue.width,
                this.spielSplitsAdd.width,
            ])
            this.spielSplitsSubtitle.position.set( points[0], spielSplitsY )
            this.spielSplitsSup.position.set( points[1], spielSplitsY )
            this.spielSplitsValue.position.set( points[2], spielSplitsY )
            this.spielSplitsAdd.position.set( points[3], spielSplitsY )
            this.addChild(
                this.spielSplitsSubtitle, this.spielSplitsSup, this.spielSplitsValue, this.spielSplitsAdd
            )

            // nearest
            this.nearestSubtitle = new Text({
                text: POPUP_TEXT.nearest[ this.currentLanguage ],
                style: styles.popupSubTitle
            })
            this.nearestSubtitle.anchor.set(0.5)

            this.nearestSup = new ShortButton('sub', 0, nearestY, this.clickNearestSup.bind(this))
            this.nearestSup.scale.set(0.3)

            this.nearestValue = new Text({text: `${betNearest} + 1 + ${betNearest}`, style: styles.popupSubTitle})
            this.nearestValue.anchor.set(0.5)

            this.nearestAdd = new ShortButton('add', 0, nearestY, this.clickNearestAdd.bind(this))
            this.nearestAdd.scale.set(0.3)

            points = getWordPositionsList([
                this.nearestSubtitle.width,
                this.nearestSup.width,
                this.nearestValue.width,
                this.nearestAdd.width,
            ])
            this.nearestSubtitle.position.set( points[0], nearestY )
            this.nearestSup.position.set( points[1], nearestY )
            this.nearestValue.position.set( points[2], nearestY )
            this.nearestAdd.position.set( points[3], nearestY )
            this.addChild(
                this.nearestSubtitle, this.nearestSup, this.nearestValue, this.nearestAdd
            )
        }

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
        this.betSup = new ShortButton('sub', -chipButtons.xs[2], betY, this.clickBetSup.bind(this))
        this.betSup.scale.set(0.5)
        this.addChild(this.betSup)

        this.betValue = new Text({text: formatNumber(betCurrent), style: styles.popupTitle})
        this.betValue.anchor.set(0.5)
        this.betValue.scale.set(1.5)
        this.betValue.position.set(0, betY)
        this.addChild(this.betValue)

        this.betAdd = new ShortButton('add', chipButtons.xs[2], betY, this.clickBetAdd.bind(this))
        this.betAdd.scale.set(0.5)
        this.addChild(this.betAdd)

        EventHub.on(events.updateBet, this.updateBet, this)
        if (currentScene === SCENE_NAME.Roulette) {
            EventHub.on(events.updateNearestNumber, this.updateNearestNumber, this)
        }
    }

    updateLanguage( lang ) {
        this.currentLanguage = lang
        this.title.text = POPUP_TEXT.bet[ this.currentLanguage ]

        if (this.spielSplitsSubtitle) {
            this.spielSplitsSubtitle.text = POPUP_TEXT.spielSplits[ this.currentLanguage ]
            this.spielSplitsValue.text = isSingleBetsInSectors
                ? POPUP_TEXT.spielSplitsValues[0][ this.currentLanguage ]
                : POPUP_TEXT.spielSplitsValues[1][ this.currentLanguage ]
            this.nearestSubtitle.text = POPUP_TEXT.nearest[ this.currentLanguage ]

            let points = getWordPositionsList([
                this.spielSplitsSubtitle.width,
                this.spielSplitsSup.width,
                this.spielSplitsValue.width,
                this.spielSplitsAdd.width,
            ])
            this.spielSplitsSubtitle.position.set( points[0], spielSplitsY )
            this.spielSplitsSup.position.set( points[1], spielSplitsY )
            this.spielSplitsValue.position.set( points[2], spielSplitsY )
            this.spielSplitsAdd.position.set( points[3], spielSplitsY )
            this.addChild(
                this.spielSplitsSubtitle, this.spielSplitsSup, this.spielSplitsValue, this.spielSplitsAdd
            )

            points = getWordPositionsList([
                this.nearestSubtitle.width,
                this.nearestSup.width,
                this.nearestValue.width,
                this.nearestAdd.width,
            ])
            this.nearestSubtitle.position.set( points[0], nearestY )
            this.nearestSup.position.set( points[1], nearestY )
            this.nearestValue.position.set( points[2], nearestY )
            this.nearestAdd.position.set( points[3], nearestY )
            this.addChild(
                this.nearestSubtitle, this.nearestSup, this.nearestValue, this.nearestAdd
            )
        }
    }

    addChip(value, x, y) {
        this[`c${value}`] = new Sprite(atlases.chip.textures[`c${value}`])
        this[`c${value}`].anchor.set(0.5)
        this[`c${value}`].scale.set(chipButtons.scale)
        this[`c${value}`].position.set(x, y)
        this[`c${value}`].value = value
        this[`c${value}`].isChip = true
        setCursorPointer(this[`c${value}`])
        this[`c${value}`].on('pointerdown', this.clickChip, this)
        this.addChild(this[`c${value}`])
        if (value === 0) return
        this[`t${value}`] = new Text({text: value, style: styles.chip})
        this[`t${value}`].anchor.set(0.5)
        this[`t${value}`].position.set(x, y)
        this.addChild(this[`t${value}`])
    }

    updateBet( bet ) {
        this.betValue.text = formatNumber(bet)
    }
    updateNearestNumber( number ) {
        this.nearestValue.text = `${number} + 1 + ${number}`
    }

    clickSpielSplits() {
        this.spielSplitsValue.text = changeSpielSplits()
            ? POPUP_TEXT.spielSplitsValues[0][ this.currentLanguage ]
            : POPUP_TEXT.spielSplitsValues[1][ this.currentLanguage ]
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
        EventHub.off( events.updateLanguage, this.updateLanguage, this )
        EventHub.off(events.updateBet, this.updateBet, this)
        if (currentScene === SCENE_NAME.Roulette) {
            EventHub.off(events.updateNearestNumber, this.updateNearestNumber, this)
        }

        for(let i = 0; i < this.children.length; i++) {
            tickerRemove(this.children[i])
            if ('isChip' in this.children[i]) removeCursorPointer(this.children[i])
        }
    }
}