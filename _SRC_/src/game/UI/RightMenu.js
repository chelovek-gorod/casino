import { Container, Sprite, Text } from "pixi.js";
import { HELP_TEXT, UI } from "./constants";
import { POPUP_TYPE } from "../popup/constants";
import { SCENE_NAME } from "../scenes/constants";
import ButtonUI from "./ButtonUI";
import { betCurrent, betsTotal, checkBet, isLangRu, clearAllBetsData, currentScene } from "../state";
import { styles } from "../../app/styles";
import { atlases } from "../../app/assets";
import { getRRTexture, getRRTextureWithShadow } from "../../utils/textureGenerator";
import { EventHub, events, setHelpText, showPopup } from "../../app/events";
import { formatNumber } from "../../utils/functions";
import { tickerRemove } from "../../app/application";

export default class RightMenu extends Container {
    constructor() {
        super()

        this.betsBg = new Sprite()
        this.betsBg.texture = getRRTexture(
            UI.bets.width, UI.bets.height + UI.borderRadius, UI.borderRadius, UI.bets.bg, UI.bets.alpha
        )
        this.betsBg.anchor.set(1)
        this.betsBg.position.set(0, UI.borderRadius)
        this.betsBg.eventMode = 'static'
        this.betsBg.on('pointerover', () => setHelpText(HELP_TEXT.bets))
        this.betsBg.on('pointerout', () => setHelpText(''))

        let betsOffsetY = -UI.bets.height * 0.5

        this.betsTotal = new Sprite(atlases.icon.textures.chip_white)
        this.betsTotal.anchor.set(0.5)
        this.betsTotal.scale.set(UI.bets.iconScale)
        this.betsTotal.position.set(-UI.bets.width + UI.bets.iconSize * 0.75, betsOffsetY)
        this.betsTotalText = new Text({
            text: currentScene === SCENE_NAME.Roulette
            ? `${isLangRu ? 'Сумма' : 'Total'}: ${formatNumber(betsTotal)}`
            : '',
            style: styles.betsTotal
        })
        this.betsTotalText.anchor.set(0, 0.5)
        this.betsTotalText.position.set(this.betsTotal.position.x + UI.bets.iconSize * 0.75, betsOffsetY)

        this.betsCurrentText = new Text({ text: betCurrent, style: styles.betsCurrent })
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
            this.cancelBeat.position.set(-UI.offset, -UI.offset - 56)
            this.addChild(this.cancelBeat)
        }

        EventHub.on(events.updateBet, this.updateBet, this)
        EventHub.on(events.updateBetTotal, this.updateBetTotal, this)
        EventHub.on(events.startSpin, this.setDisableCancelButton, this)
        EventHub.on(events.addLog, this.setEnableCancelButton, this)
    }

    updateBet(bet) {
        this.betsCurrentText.text = bet
    }
    updateBetTotal(total) {
        this.betsTotalText.text = `${isLangRu ? 'Сумма' : 'Total'}: ${formatNumber(total)}`
    }

    showBetPopup() {
        checkBet()
        showPopup(POPUP_TYPE.bet)
    }

    setEnableCancelButton() {
        this.cancelBeat.setActive(true)
    }
    setDisableCancelButton() {
        this.cancelBeat.setActive(false)
    }

    kill() {
        EventHub.off(events.updateBet, this.updateBet, this)
        EventHub.off(events.updateBetTotal, this.updateBetTotal, this)
        EventHub.off(events.startSpin, this.setDisableCancelButton, this)
        EventHub.off(events.addLog, this.setEnableCancelButton, this)

        this.betsBg.eventMode = 'none'
        this.betsBg.off('pointerover', () => setHelpText(HELP_TEXT.bets))
        this.betsBg.off('pointerout', () => setHelpText(''))

        this.betsCurrentText.eventMode = 'none'
        this.betsCurrentText.off('pointerover', () => setHelpText(HELP_TEXT.currentBet))
        this.betsCurrentText.off('pointerout', () => setHelpText(''))
    }
}