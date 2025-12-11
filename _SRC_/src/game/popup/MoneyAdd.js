import { Container, Graphics, Text } from "pixi.js";
import { EventHub, events } from "../../app/events";
import { styles } from "../../app/styles";
import { POPUP_TEXT, SHOP_BTN_TYPE } from "./constants"
import { getLanguage } from "../localization";
import ShopButton from "./ShopButton";
import { addMoney } from "../state";
import { STORED_KEYS } from "../storage";

const titleY = -208
const hrY = -176
const hrX = 240

const btnPosX = [-165, -55, 55, 165]
const btnPosY = [-85, 75]

export default class MoneyAdd extends Container {
    constructor() {
        super()

        this.currentLanguage = getLanguage()
        EventHub.on( events.updateLanguage, this.updateLanguage, this )

        // title
        this.title = new Text({
            text: POPUP_TEXT.addMoney[ this.currentLanguage ],
            style: styles.popupTitle
        })
        this.title.anchor.set(0.5)
        this.title.position.set(0, titleY)
        this.addChild(this.title)
        // hr
        this.hr = new Graphics()
        this.hr.moveTo(-hrX, hrY)
        this.hr.lineTo( hrX, hrY)
        this.hr.stroke({width: 4, color: 0xffffff})
        this.addChild(this.hr)

        // buttons

        this.btnShowAd = new ShopButton(SHOP_BTN_TYPE.showAd, () => {
            alert('Здесь могла бы быть ваша реклам')
            alert('+ 125 фишек !!!')
            addMoney(125)
        })
        this.btnShowAd.position.set(btnPosX[0], btnPosY[0])
        this.addChild(this.btnShowAd)

        this.btnNoAds = new ShopButton(SHOP_BTN_TYPE.noAds, () => {
            alert('Реклама отключена')
            localStorage.removeItem( STORED_KEYS.game )
            location.reload()
        })
        this.btnNoAds.position.set(btnPosX[1], btnPosY[0])
        this.addChild(this.btnNoAds)

        this.btnAdd2k = new ShopButton(SHOP_BTN_TYPE.add2k, () => {
            alert('С вашей карты списано 0.30$')
            alert('+ 2 000 фишек !!!')
            addMoney(2000)
        })
        this.btnAdd2k.position.set(btnPosX[2], btnPosY[0])
        this.addChild(this.btnAdd2k)

        this.btnAdd7k = new ShopButton(SHOP_BTN_TYPE.add7k, () => {
            alert('С вашей карты списано 0.84$')
            alert('+ 7 000 фишек !!!')
            addMoney(7000)
        })
        this.btnAdd7k.position.set(btnPosX[3], btnPosY[0])
        this.addChild(this.btnAdd7k)

        //

        this.btnAdd25k = new ShopButton(SHOP_BTN_TYPE.add25k, () => {
            alert('С вашей карты списано 2.63$')
            alert('+ 25 000 фишек !!!')
            addMoney(25000)
        })
        this.btnAdd25k.position.set(btnPosX[0], btnPosY[1])
        this.addChild(this.btnAdd25k)

        this.btnAdd80k = new ShopButton(SHOP_BTN_TYPE.add80k, () => {
            alert('С вашей карты списано 7.20$')
            alert('+ 80 000 фишек !!!')
            addMoney(80000)
        })
        this.btnAdd80k.position.set(btnPosX[1], btnPosY[1])
        this.addChild(this.btnAdd80k)

        this.btnAdd250k = new ShopButton(SHOP_BTN_TYPE.add250k, () => {
            alert('С вашей карты списано 18.75$')
            alert('+ 250 000 фишек !!!')
            addMoney(250000)
        })
        this.btnAdd250k.position.set(btnPosX[2], btnPosY[1])
        this.addChild(this.btnAdd250k)

        this.btnAdd750k = new ShopButton(SHOP_BTN_TYPE.add750k, () => {
            alert('С вашей карты списано 45.00$')
            alert('+ 750 000 фишек !!!')
            addMoney(750000)
        })
        this.btnAdd750k.position.set(btnPosX[3], btnPosY[1])
        this.addChild(this.btnAdd750k)
    }

    updateLanguage(lang) {
        this.currentLanguage = lang
        this.title.text = POPUP_TEXT.addMoney[ this.currentLanguage ]
    }

    kill() {
        EventHub.off( events.updateLanguage, this.updateLanguage, this )
    }
}