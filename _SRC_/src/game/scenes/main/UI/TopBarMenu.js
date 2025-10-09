import { Container, Texture, Sprite, Text } from "pixi.js"
import { HELP_TEXT, UI } from "../../../constants"
import ButtonUI from "./ButtonUI"
import { addMoney, isLangRu, money } from "../../../state"
import { styles } from "../../../../app/styles"
import { formatNumber } from "../../../../utils/functions"
import { getRRTexture, getRRTextureWithShadow } from "../../../../utils/textureGenerator"
import { EventHub, events, setHelpText, showPopup } from "../../../../app/events"

export default class TopBarMenu extends Container {
    constructor() {
        super()
        
        this.bg = new Sprite()

        this.home = new ButtonUI('home', this.testClick.bind(this), true, HELP_TEXT.home)

        this.money = new Text({text: formatNumber(money), style: styles.money})
        this.money.anchor.set(0, 0.5)
        this.money.eventMode = 'static'
        this.money.on('pointerover', () => setHelpText(HELP_TEXT.money))
        this.money.on('pointerout', () => setHelpText(''))

        this.addMoney = new ButtonUI('add', this.clickAddMoney.bind(this), false, HELP_TEXT.addMoney)
        this.addMoney.scale.set(0.75)

        this.helpBg = new Sprite()
        this.helpText = new Text({text: '', style: styles.helpText})
        this.helpText.anchor.set(0.5, -0.5)

        this.config = new ButtonUI('config', this.showPopup.bind(this), true, HELP_TEXT.config)
        this.addChild(this.bg, this.helpBg, this.home, this.money, this.addMoney, this.config, this.helpText)

        EventHub.on( events.updateMoney, this.updateMoney, this )
        EventHub.on( events.setHelpText, this.setHelpText, this )
    }

    screenResize(screenData) {
        this.position.set(0, -screenData.centerY + UI.offset)

        if (this.bg.texture && this.bg.texture !== Texture.EMPTY) this.bg.texture.destroy(true)
        const [texture, padding] = getRRTextureWithShadow(
            screenData.width, UI.size + UI.borderRadius, UI.borderRadius, UI.bg, 0, 6, 0.5
        )
        this.bg.texture = texture
        this.bg.position.set(0, -6)
        this.bg.anchor.set(0.5)

        if (this.helpBg.texture && this.helpBg.texture !== Texture.EMPTY) this.helpBg.texture.destroy(true)
        this.helpBg.texture = getRRTexture( screenData.width - UI.size * 2, 24, 8, 0x000000, 0.5 )
        this.helpBg.position.set(0, 22)
        this.helpBg.anchor.set(0.5)

        this.resizeMoney()
        this.home.position.set(-screenData.centerX + UI.offset, 0)
        this.config.position.set(screenData.centerX - UI.offset, 0)
    }
    resizeMoney() {
        const moneyWidth = this.money.width + UI.iconOffset * 2 + UI.iconSize
        const moneyX = -moneyWidth * 0.5
        const moneyAddX = -moneyX - UI.iconSize * 0.5
        this.money.position.set(moneyX, -10)
        this.addMoney.position.set(moneyAddX, -10)
    }

    updateMoney( total ){
        this.money.text = formatNumber(total)
        this.resizeMoney()
    }

    setHelpText( textData ) {
        if (textData) this.helpText.text = isLangRu ? textData.ru : textData.en
        else this.helpText.text = ''
    }

    clickAddMoney() {
        addMoney(1000)
    }

    showPopup() {
        showPopup()
    }

    testClick() {
        console.log('get click')
    }

    kill() {
        this.money.eventMode = 'none'
        this.money.off('pointerover', () => setHelpText(HELP_TEXT.money))
        this.money.off('pointerout', () => setHelpText(''))

        EventHub.off( events.updateMoney, this.updateMoney, this )
        EventHub.off( events.setHelpText, this.setHelpText, this )

        while(this.children.length) {
            tickerRemove(this.children[0])
            if ('kill' in this.children[0]) this.children[0].kill()
            else this.children[0].destroy()
        }
        this.destroy()
    }
}