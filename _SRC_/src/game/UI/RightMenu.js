import { Container, Sprite, Text } from "pixi.js";
import { HELP_TEXT, UI, UI_TEXT } from "./constants";
import { POPUP_TYPE } from "../popup/constants";
import { SCENE_NAME } from "../scenes/constants";
import ButtonUI from "./ButtonUI";
import { betCurrent, betsTotal, checkBet, clearAllBetsData, repeatAllBetsData, currentScene, canRepeatBets } from "../state";
import { styles } from "../../app/styles";
import { atlases } from "../../app/assets";
import { getRRTexture, getRRTextureWithShadow } from "../../utils/textureGenerator";
import { EventHub, events, setHelpText, showPopup } from "../../app/events";
import { formatNumber } from "../../utils/functions";
import { getLanguage } from "../localization";

export default class RightMenu extends Container {
    constructor() {
        super()

        this.currentLanguage = getLanguage()
        EventHub.on( events.updateLanguage, this.updateLanguage, this )

        this.betsBg = new Sprite()
        this.betsBg.texture = getRRTexture(
            UI.bets.width, UI.bets.height + UI.borderRadius, UI.borderRadius, UI.bets.bg, UI.bets.alpha
        )
        this.betsBg.anchor.set(1)
        this.betsBg.position.set(0, UI.borderRadius)
        this.betsBg.eventMode = 'static'
        this.betsBg.on('pointerover', () => {
            setHelpText(currentScene === SCENE_NAME.Roulette ? HELP_TEXT.bets : HELP_TEXT.bet)
        })
        this.betsBg.on('pointerout', () => setHelpText(''))

        let betsOffsetY = -UI.bets.height * 0.5

        this.betsTotal = new Sprite(atlases.icon.textures.chip_white)
        this.betsTotal.anchor.set(0.5)
        this.betsTotal.scale.set(UI.bets.iconScale)
        this.betsTotal.position.set(-UI.bets.width + UI.bets.iconSize * 0.75, betsOffsetY)
        this.betsTotalText = new Text({
            text: currentScene === SCENE_NAME.Roulette
            ? `${UI_TEXT.totalBet[this.currentLanguage]}: ${formatNumber(betsTotal)}`
            : '',
            style: styles.betsTotal
        })
        this.betsTotalText.anchor.set(0, 0.5)
        this.betsTotalText.position.set(this.betsTotal.position.x + UI.bets.iconSize * 0.75, betsOffsetY)

        this.betsCurrentText = new Text({ text: formatNumber(betCurrent), style: styles.betsCurrent })
        this.betsCurrentText.anchor.set(1, 0.5)
        this.betsCurrentText.position.set(-UI.size - UI.offset, betsOffsetY)
        this.betsCurrentText.eventMode = 'static'
        this.betsCurrentText.on('pointerover', () => setHelpText(HELP_TEXT.currentBet))
        this.betsCurrentText.on('pointerout', () => setHelpText(''))

        this.bg = new Sprite()
        const [texture, padding] = getRRTextureWithShadow(
            UI.size + UI.borderRadius * 1.5, UI.size + UI.borderRadius, UI.borderRadius, UI.bg, -6, -6
        )
        this.bg.texture = texture
        this.bg.anchor.set(1)
        this.bg.position.set(UI.borderRadius + padding, UI.borderRadius + padding)

        this.bet = new ButtonUI('bet', this.showBetPopup.bind(this), true, HELP_TEXT.setBet)
        this.bet.position.set(-UI.offset, -UI.offset)

        this.addChild(
            this.betsBg, this.betsTotal, this.betsTotalText, this.betsCurrentText,
            this.bg, this.bet
        )
        if (currentScene === SCENE_NAME.Roulette) {
            this.cancelBeat = new ButtonUI('cancel', clearAllBetsData, true, HELP_TEXT.clearBets)
            this.cancelBeat.scale.set(UI.iconScale * 1.75)
            this.cancelBeat.position.set(-UI.offset, -UI.offset - 110)
            this.addChild(this.cancelBeat)

            this.repeatBeat = new ButtonUI('repeat', repeatAllBetsData, true, HELP_TEXT.repeatBets)
            this.repeatBeat.setActive( canRepeatBets().isActive )
            this.repeatBeat.scale.set(UI.iconScale * 1.75)
            this.repeatBeat.position.set(-UI.offset, -UI.offset - 60)
            this.addChild(this.repeatBeat)
        }

        EventHub.on(events.updateBet, this.updateBet, this)
        EventHub.on(events.updateBetTotal, this.updateBetTotal, this)
        EventHub.on(events.startSpin, this.setDisableCancelButton, this)
        EventHub.on(events.addLog, this.setEnableCancelButton, this)
        EventHub.on(events.updateRepeatBetsData, this.updateRepeatBetsData, this)
    }

    updateBet(bet) {
        this.betsCurrentText.text = formatNumber(bet)
    }
    updateBetTotal(total) {
        this.betsTotalText.text = `${UI_TEXT.totalBet[this.currentLanguage]}: ${formatNumber(total)}`
    }

    showBetPopup() {
        checkBet()
        showPopup(POPUP_TYPE.bet)
    }

    setEnableCancelButton() {
        this.cancelBeat.setActive(true)
        this.repeatBeat.setActive(true)
    }
    setDisableCancelButton() {
        this.cancelBeat.setActive(false)
        this.repeatBeat.setActive(false)
    }

    updateRepeatBetsData(data) {
        if ('repeatBeat' in this) {
            this.repeatBeat.setActive(data.isActive)
            this.repeatBeat.setHelpText(HELP_TEXT[data.helpTextKey])
        }
    }

    updateLanguage(lang) {
        this.currentLanguage = lang
        if (currentScene === SCENE_NAME.Roulette) {
            this.betsTotalText.text = `${UI_TEXT.totalBet[this.currentLanguage]}: ${formatNumber(betsTotal)}`
        }
    }

    kill() {
        EventHub.off( events.updateLanguage, this.updateLanguage, this )

        EventHub.off(events.updateBet, this.updateBet, this)
        EventHub.off(events.updateBetTotal, this.updateBetTotal, this)
        EventHub.off(events.startSpin, this.setDisableCancelButton, this)
        EventHub.off(events.addLog, this.setEnableCancelButton, this)
        EventHub.off(events.updateRepeatBetsData, this.updateRepeatBetsData, this)

        this.betsBg.eventMode = 'none'
        this.betsBg.off('pointerover', () => {
            setHelpText(currentScene === SCENE_NAME.Roulette ? HELP_TEXT.bets : HELP_TEXT.bet)
        })
        this.betsBg.off('pointerout', () => setHelpText(''))

        this.betsCurrentText.eventMode = 'none'
        this.betsCurrentText.off('pointerover', () => setHelpText(HELP_TEXT.currentBet))
        this.betsCurrentText.off('pointerout', () => setHelpText(''))
    }
}