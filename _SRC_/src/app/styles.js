import { TextStyle } from "pixi.js"
import { CHIP_DATA, LOGS, MESSAGE } from "../game/constants"
import { fonts } from "./assets"

export let styles = {
    isReady: false, /* if true -> fonts is already loaded */

    /* Font keys (init all fonts in function bellow) */
    loading: null,
    button: null,
    buttonHover: null,
    shortButton: null,
    shortButtonHover: null,
    numbersList: null,
    money: null,

    helpText: null,

    logLastRed: null,
    logLastBlack: null,
    logLastWhite: null,
    logPreviousRed: null,
    logPreviousBlack: null,
    logPreviousWhite: null,
    logRestsRed: null,
    logRestsBlack: null,
    logRestsWhite: null,

    messageText: null,
    messageRed: null,
    messageBlack: null,
    messageGreen: null,

    betsTotal: null,
    betsCurrent: null,

    popupTitle: null,
    popupSubTitle: null,

    chip: null,
}

export function initFontStyles() {
    styles.loading = new TextStyle({
        fontFamily: fonts.Manrope300,
        fontSize: 48,
        fill: '#ffffff',
    
        dropShadow: true,
        dropShadowColor: '#00ff00',
        dropShadowBlur: 4,
        dropShadowAngle: 0,
        dropShadowDistance: 0,
    })

    styles.numbersList = new TextStyle({
        fontFamily: fonts.Manrope400,
        fontSize: 24,
        fill: '#ffffff',

        wordWrap: true,
        wordWrapWidth: 1200,
        breakWords: true,
    
        dropShadow: true,
        dropShadowColor: '#000000',
        dropShadowBlur: 20,
        dropShadowAngle: 0,
        dropShadowDistance: 0,
    })

    styles.button = new TextStyle({
        fontFamily: fonts.Manrope700,
        fontSize: 48,
        fill: '#000000',
    })
    styles.buttonHover = new TextStyle({
        fontFamily: fonts.Manrope700,
        fontSize: 48,
        fill: '#000000',
    
        dropShadow: true,
        dropShadowColor: '#00ff00',
        dropShadowBlur: 6,
        dropShadowAngle: 0,
        dropShadowDistance: 0,
    })
    styles.shortButton = new TextStyle({
        fontFamily: fonts.Manrope800,
        fontSize: 96,
        fill: '#000000',
    })
    styles.shortButtonHover = new TextStyle({
        fontFamily: fonts.Manrope800,
        fontSize: 96,
        fill: '#000000',
    
        dropShadow: true,
        dropShadowColor: '#00ff00',
        dropShadowBlur: 6,
        dropShadowAngle: 0,
        dropShadowDistance: 0,
    })

    styles.money = new TextStyle({
        fontFamily: fonts.Manrope800,
        fontSize: 28,
        fill: '#ffff00',
    })

    styles.helpText = new TextStyle({
        fontFamily: fonts.Manrope300,
        fontSize: 16,
        fill: '#eeeeee',
    })

    styles.logLastRed = new TextStyle({
        fontFamily: fonts.Manrope800,
        fontSize: LOGS.fontSizes[0],
        fill: '#ff0000',
    })
    styles.logLastBlack = new TextStyle({
        fontFamily: fonts.Manrope800,
        fontSize: LOGS.fontSizes[0],
        fill: '#000000',
    })
    styles.logLastWhite = new TextStyle({
        fontFamily: fonts.Manrope800,
        fontSize: LOGS.fontSizes[0],
        fill: '#ffffff',
    })
    styles.logPreviousRed = new TextStyle({
        fontFamily: fonts.Manrope800,
        fontSize: LOGS.fontSizes[1],
        fill: '#ff0000',
    })
    styles.logPreviousBlack = new TextStyle({
        fontFamily: fonts.Manrope800,
        fontSize: LOGS.fontSizes[1],
        fill: '#000000',
    })
    styles.logPreviousWhite = new TextStyle({
        fontFamily: fonts.Manrope800,
        fontSize: LOGS.fontSizes[1],
        fill: '#ffffff',
    })
    styles.logRestsRed = new TextStyle({
        fontFamily: fonts.Manrope800,
        fontSize: LOGS.fontSizes[2],
        fill: '#ff0000',
    })
    styles.logRestsBlack = new TextStyle({
        fontFamily: fonts.Manrope800,
        fontSize: LOGS.fontSizes[2],
        fill: '#000000',
    })
    styles.logRestsWhite = new TextStyle({
        fontFamily: fonts.Manrope800,
        fontSize: LOGS.fontSizes[2],
        fill: '#ffffff',
    })

    styles.messageText = new TextStyle({
        fontFamily: fonts.Manrope600,
        fontSize: MESSAGE.fontSizeForText,
        lineHeight: MESSAGE.fontSizeForText,
        align: 'center',
        fill: '#000000',
    })
    styles.messageRed = new TextStyle({
        fontFamily: fonts.Manrope800,
        fontSize: MESSAGE.fontSize,
        fill: '#ee0000',
    })
    styles.messageBlack = new TextStyle({
        fontFamily: fonts.Manrope800,
        fontSize: MESSAGE.fontSize,
        fill: '#000000',
    })
    styles.messageGreen = new TextStyle({
        fontFamily: fonts.Manrope800,
        fontSize: MESSAGE.fontSize,
        fill: '#007700',
    })

    styles.betsTotal = new TextStyle({
        fontFamily: fonts.Manrope300,
        fontSize: 16,
        fill: '#ffffff',
    })
    styles.betsCurrent = new TextStyle({
        fontFamily: fonts.Manrope600,
        fontSize: 24,
        fill: '#ffffff',
    })

    styles.popupTitle = new TextStyle({
        fontFamily: fonts.Manrope700,
        fontSize: 24,
        fill: '#ffffff',
    })
    styles.popupSubTitle = new TextStyle({
        fontFamily: fonts.Manrope700,
        fontSize: 18,
        fill: '#eeeeee',
    })

    styles.chip = new TextStyle({
        fontFamily: fonts.Manrope600,
        fontSize: CHIP_DATA.fontSize,
        fill: '#ffffff',
    })

    styles.isReady = true

    // EXAMPLES
    /*
    gradientText: new TextStyle({
        fontFamily: fonts.RobotoBlack,
        fontSize: 32,
        fill: ['#000000', '#ff0064', '#000000'],

        dropShadow: true,
        dropShadowColor: '#ffffff',
        dropShadowBlur: 6,
        dropShadowAngle: 0,
        dropShadowDistance: 0,

        wordWrap: true,
        wordWrapWidth: 400,
    }),

    textWithShadow: new TextStyle({
        fontFamily: fonts.RobotoBlack,
        fontSize: 18,
        fontStyle: 'normal',
        fontWeight: 'normal',
        fill: ['#ff0000', '#ffff00'],
        
        stroke: '#ffffff',
        strokeThickness: 2,

        dropShadow: true,
        dropShadowColor: '#ff00ff',
        dropShadowBlur: 3,
        dropShadowDistance: 4,
        
        wordWrap: true,
        wordWrapWidth: 440,
        lineJoin: 'round',
    }),
    */
}