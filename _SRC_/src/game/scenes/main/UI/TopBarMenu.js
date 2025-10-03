import { Container, Texture, Sprite, Text } from "pixi.js"
import { UI } from "../../../constants"
import ButtonUI from "./ButtonUI"
import { addMoney, money } from "../../../state"
import { styles } from "../../../../app/styles"
import { formatNumber } from "../../../../utils/functions"
import { getRRTextureWithShadow } from "../../../../utils/textureGenerator"
import { EventHub, events } from "../../../../app/events"

export default class TopBarMenu extends Container {
    constructor() {
        super()
        
        this.bg = new Sprite()
        this.home = new ButtonUI('home', this.testClick.bind(this), true )
        this.money = new Text({text: formatNumber(money), style: styles.money})
        this.money.anchor.set(0, 0.5)
        this.addMoney = new ButtonUI('add', this.clickAddMoney.bind(this), false )
        this.config = new ButtonUI('config', this.testClick.bind(this), true )
        this.addChild(this.bg, this.home, this.money, this.addMoney, this.config)

        EventHub.on( events.updateMoney, this.updateMoney, this )
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

        this.resizeMoney()
        this.home.position.set(-screenData.centerX + UI.offset, 0)
        this.config.position.set(screenData.centerX - UI.offset, 0)
    }
    resizeMoney() {
        const moneyWidth = this.money.width + UI.iconOffset * 2 + UI.iconSize
        const moneyX = -moneyWidth * 0.5
        const moneyAddX = -moneyX - UI.iconSize * 0.5
        this.money.position.set(moneyX, 0)
        this.addMoney.position.set(moneyAddX, 0)
    }

    updateMoney( total ){
        this.money.text = formatNumber(total)
        this.resizeMoney()
    }

    clickAddMoney() {
        addMoney(1000)
    }

    testClick() {
        console.log('get click')
    }

    kill() {
        EventHub.off( events.updateMoney, this.updateMoney, this )
        while(this.children.length) {
            tickerRemove(this.children[0])
            if ('kill' in this.children[0]) this.children[0].kill()
            else this.children[0].destroy()
        }
        this.destroy()
    }
}