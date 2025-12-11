import { Container, Text, Sprite } from "pixi.js"
import { atlases, sounds } from "../../app/assets"
import { removeCursorPointer, setCursorPointer } from "../../utils/functions"
import { styles } from "../../app/styles"
import { soundPlay } from "../../app/sound"
import { SHOP_BTN_PRICE, SHOP_BTN_LABEL, SHOP_BTN_TYPE } from "./constants"
import { getLanguage } from "../localization"
import { EventHub, events } from "../../app/events"
import { tickerAdd, tickerRemove } from "../../app/application"

const scaleData = {
    min: 0.75,
    max: 0.85,
    step: 0.0006,
}

export default class ShopButton extends Container {
    constructor(type, callback) {
        super()

        this.callback = callback
        this.type = type

        this.scale.set(scaleData.min)
        this.isOnHover = false

        this.currentLanguage = getLanguage()
        EventHub.on( events.updateLanguage, this.updateLanguage, this )

        this.bg = new Sprite(atlases.shop.textures.bg)
        this.bg.anchor.set(0.5)
        setCursorPointer(this.bg)
        this.bg.on('pointerdown', this.click, this)
        this.bg.on('pointerover', this.onHover, this)
        this.bg.on('pointerout', this.onOut, this)
        this.addChild(this.bg)

        this.label = new Text({
            text: SHOP_BTN_LABEL[type][this.currentLanguage],
            style: styles.shopLabel
        })
        this.label.anchor.set(0.5)
        this.label.position.set(0, 25)
        this.addChild(this.label)

        if (type !== SHOP_BTN_TYPE.showAd) {
            this.priceBg = new Sprite(atlases.shop.textures.price)
            this.priceBg.anchor.set(0.5)
            this.addChild(this.priceBg)
    
            this.price = new Text({
                text: SHOP_BTN_PRICE[type],
                style: styles.shopPrice
            })
            this.price.anchor.set(0.5)
            this.price.position.set(0, 70)
            this.addChild(this.price)
        }

        this.image = new Sprite(atlases.shop.textures[type])
        this.image.anchor.set(0.5)
        this.addChild(this.image)

        this.isActive = true
    }

    setActive(isActive = true) {
        this.isActive = isActive
        if (this.isActive) this.alpha = 1
        else this.alpha = 0.5
    }

    click() {
        if (!this.isActive) return

        soundPlay(sounds.se_click)
        this.callback()
    }
    onHover() {
        this.isOnHover = true
        tickerAdd(this)
    }
    onOut() {
        this.isOnHover = false
        tickerAdd(this)
    }

    updateLanguage(lang) {
        this.currentLanguage = lang

        this.label.text = SHOP_BTN_LABEL[this.type][this.currentLanguage]
        if ('price' in this) this.price.text = SHOP_BTN_PRICE[this.type]
    }

    tick(time) {
        const scaleStep = time.deltaMS * scaleData.step
        if (this.isOnHover) {
            this.scale.set( Math.min( scaleData.max, this.scale.x + scaleStep ) )
            if (this.scale.x === scaleData.max) tickerRemove( this )
        } else {
            this.scale.set( Math.max( scaleData.min, this.scale.x - scaleStep ) )
            if (this.scale.x === scaleData.min) tickerRemove( this )
        }
    }

    deactivate() {
        this.bg.off('pointerdown', this.click, this)
        this.bg.off('pointerover', this.onHover, this)
        this.bg.off('pointerout', this.onOut, this)
    }

    kill() {
        tickerRemove(this)
        EventHub.off( events.updateLanguage, this.updateLanguage, this )
        removeCursorPointer(this.bg)
        this.deactivate()
    }
}