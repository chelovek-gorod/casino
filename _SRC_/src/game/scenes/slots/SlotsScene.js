import { Container, Sprite, Text } from 'pixi.js'
import { images, music, sounds } from '../../../app/assets'
import { soundPlay, setMusicList } from '../../../app/sound'
import { BUTTON, BUTTON_TEXT, GAME_OFFSET, HELP_TEXT, MESSAGE_TEXT, UI } from '../../UI/constants'
import { SLOTS_BORDER, SLOTS_LINES, SLOTS, SLOTS_LINES_DATA, SLOTS_HIGHLIGHT, MAX_BET, SPIN_WIN_TEXT } from './constants'
import Line from './Line'
import Button from '../../UI/Button'
import { checkRunSlots, resultSlots, resetState, returnBet, betsTotal, slotCoins, addSlotCoins, getSlotCoins, setMaxBet } from '../../state'
import LeftMenu from '../../UI/LeftMenu'
import RightMenu from '../../UI/RightMenu'
import TopBarMenu from '../../UI/TopBarMenu'
import Message from '../../UI/Message'
import Popup from '../../popup/Popup'
import BackgroundTiling from '../../BG/BackgroundTiling'
import { EventHub, events, setHelpText, showMessage } from '../../../app/events'
import { styles } from '../../../app/styles'
import ShortButton from '../../UI/ShortButton'
import { formatNumber, removeCursorPointer, setCursorPointer } from '../../../utils/functions'
import Coins from '../../effects/Coins'
import { getRecTexture } from '../../../utils/textureGenerator'
import { getLanguage } from '../../localization'
import CoinToBank from './CoinToBank'
import { tickerAdd, tickerRemove } from '../../../app/application'

/*
const testWinData = {
    spins: 0,
    lines_3: {count: 0, money: 0},
    lines_4: {count: 0, money: 0},
    lines_5: {count: 0, money: 0},
    jackpot: {count: 0, money: 0},
    sets: {count: 0, money: 0},
    crystals: {count: 0, money: 0},
    bank: {count: 0, money: 0},
    presents: {count: 0, money: 0},
}
*/

export default class Slots extends Container {
    constructor() {
        super()
        this.alpha = 0

        resetState()
        setMaxBet(MAX_BET)

        this.currentLanguage = getLanguage()
        EventHub.on( events.updateLanguage, this.updateLanguage, this )

        // BG
        this.bg = new BackgroundTiling(images.bg_red)
        this.addChild(this.bg)

        // SCALED MAIN GAME CONTAINER
        this.gameContainer = new Container()
        this.addChild(this.gameContainer)

        // under lines bg
        const slotsBgWidth = SLOTS_BORDER.offsetLine * 4 + SLOTS_LINES.slotWidth * 5
        const slotsBgHeight = SLOTS_LINES.slotHeight * 3
        const slotsBgFill = {
            type: "linear-gradient",
            x0: 0,    // X начальной точки (левая граница)
            y0: 0,    // Y начальной точки (ВЕРХ) - здесь будет offset: 0
            x1: 0,    // X конечной точки (тоже левая граница - градиент вертикальный)
            y1: slotsBgHeight,  // Y конечной точки (НИЗ) - здесь будет offset: 1
            stops: [
                { offset: 0,    color: 0x222222 },   // Серый вверху
                { offset: 0.25,  color: 0x777777 },   // Белый в середине
                { offset: 0.75,  color: 0x777777 },   // Белый в середине
                { offset: 1,    color: 0x222222 }    // Серый внизу
            ]
        }
        const slotsBgTexture = getRecTexture(slotsBgWidth, slotsBgHeight, slotsBgFill)
        this.slotsBg = new Sprite(slotsBgTexture)
        this.slotsBg.position.set(SLOTS_LINES.positionsX[0], SLOTS_BORDER.offsetY)
        this.gameContainer.addChild(this.slotsBg)

        this.lines = []
        for(let i = 0; i < 5; i++) {
            const line = new Line(this.lineStopped.bind(this))
            line.position.set(SLOTS_LINES.positionsX[i], SLOTS_BORDER.offsetY)
            this.gameContainer.addChild(line)
            this.lines.push(line)
        }

        this.linsRunningCount = 0

        this.border = new Sprite(images.slot_border)
        this.gameContainer.addChild( this.border )

        // effects
        this.coinEffects = new Coins()
        this.addChild(this.coinEffects)
        
        // self UI
        this.bankIcon = new Sprite(images.slots_bank)
        this.bankIcon.anchor.set(0.5)
        this.bankIcon.scale.set(0.75)
        this.bankIcon.position.set(260, SLOTS_BORDER.height + BUTTON.height * 0.75)
        this.bankIconRotationsCount = 3
        this.bankIconRotationsSpeed = 0.006
        this.bankIconIsScaleUp = false

        this.bankText = new Text({text: formatNumber(slotCoins), style: styles.slotsCoins})
        this.bankText.anchor.set(0, 0.5)
        this.bankText.position.set(320, SLOTS_BORDER.height + BUTTON.height * 0.75)

        this.bankHoverArea = new Sprite( getRecTexture(340, 80, 0x00ff00) )
        this.bankHoverArea.position.set(204, SLOTS_BORDER.height + 24)
        this.bankHoverArea.alpha = 0.01
        this.bankHoverArea.on('pointerover', this.bankOnHover, this)
        this.bankHoverArea.on('pointerout', this.bankOnOut, this)
        setCursorPointer(this.bankHoverArea)

        this.gameContainer.addChild(this.bankIcon, this.bankText, this.bankHoverArea)

        this.runButton = new Button(
            BUTTON_TEXT.spin[ this.currentLanguage ],
            SLOTS_BORDER.width * 0.5, SLOTS_BORDER.height + BUTTON.height * 0.75,
            this.run.bind(this),
            true,
            HELP_TEXT.btnSpinS
        )
        this.gameContainer.addChild(this.runButton)

        this.spinTotalWin = 0
        this.spinTotalWinText = new Text({text: SPIN_WIN_TEXT[this.currentLanguage](this.spinTotalWin), style: styles.slotsWin})
        this.spinTotalWinText.anchor.set(0.5)
        this.spinTotalWinText.position.set(1354, SLOTS_BORDER.height + BUTTON.height * 0.72)
        this.gameContainer.addChild(this.spinTotalWinText)

        this.isAutoSpinOn = false
        this.autoSpinTimeout = null
        this.isSceneDestroyed = false
        this.autoButton = new ShortButton( 'play',
            SLOTS_BORDER.width - 260, SLOTS_BORDER.height + BUTTON.height * 0.75,
            this.setAutoSpin.bind(this), true, HELP_TEXT.btnAutoSpinS
        )
        this.gameContainer.addChild(this.autoButton)

        // UI
        this.topUI = new TopBarMenu()
        this.leftUI = new LeftMenu()
        this.rightUI = new RightMenu()

        this.popup = new Popup()

        this.message = new Message()

        this.addChild(this.leftUI, this.rightUI, this.topUI, this.popup, this.message)

        this.highlightDataList = [] // ordered, key = message type
        this.bonusRate = 1
        this.highlightMessageTimeout = SLOTS_HIGHLIGHT.duration + SLOTS_HIGHLIGHT.inOut * 2
        this.highlightTimeout = 300

        this.autoSpinByKeySpace_bind = this.getKeySpace.bind(this)
        document.addEventListener('keyup', this.autoSpinByKeySpace_bind)

        // done
        setMusicList([music.bgm_0, music.bgm_1, music.bgm_2, music.bgm_3, music.bgm_4, music.bgm_5])

        // test
        //this.test()
    }

    screenResize(screenData) {
        // set scene container in center of screen
        this.position.set( screenData.centerX, screenData.centerY )

        // repeat bg tile in full screen (width and height)
        this.bg.screenResize(screenData)

        // update effects scaling
        this.coinEffects.screenResize(screenData)

        // update popup
        this.popup.screenResize(screenData)

        // update message
        this.message.screenResize(screenData)

        // update UI
        this.leftUI.position.set(-screenData.centerX, screenData.centerY)
        this.rightUI.position.set(screenData.centerX, screenData.centerY)
        this.topUI.screenResize(screenData)

        const availableHeight = screenData.height - UI.size - UI.bets.height
        const slotsHeight = GAME_OFFSET * 2 + SLOTS_BORDER.height + BUTTON.height * 2
        const slotsWidth = GAME_OFFSET * 2 + SLOTS_BORDER.width
        const scale = Math.min(1, screenData.width / slotsWidth, availableHeight / slotsHeight)
        this.gameContainer.scale.set(scale)

        const gameContainerX = -slotsWidth * 0.5 * scale + GAME_OFFSET * scale
        const gameContainerY = -slotsHeight * 0.5 * scale + GAME_OFFSET * 3 * scale
        this.gameContainer.position.set(gameContainerX, gameContainerY)
    }

    bankOnHover() {
        setHelpText(HELP_TEXT.slotsBank)
    }
    bankOnOut() {
        setHelpText('')
    }

    getKeySpace(event) {
        if (event.code === 'Space') this.run()
    }

    setAutoSpin() {
        // stop auto spin
        if (this.isAutoSpinOn) {
            this.isAutoSpinOn = false
            this.autoButton.setTexture('play')
        // run auto spin 
        } else {
            this.isAutoSpinOn = true
            this.autoButton.setTexture('stop')
            if (this.linsRunningCount === 0) this.run()
        }
    }

    run() {
        if (this.linsRunningCount > 0 || checkRunSlots() === false) {
            this.isAutoSpinOn = false
            this.autoButton.setTexture('play')
            return 
        }

        this.runButton.setActive(false)
        this.linsRunningCount = 5
        this.lines.forEach((line, i) => line.run(i))
        soundPlay(sounds.se_slots_spin)
    }
    lineStopped() {
        this.linsRunningCount -= 1
        if (this.linsRunningCount === 0) {
            this.spinTotalWin = 0
            this.spinTotalWinText.text = SPIN_WIN_TEXT[this.currentLanguage](this.spinTotalWin)

            this.checkSpinResults()
        }
    }

    checkSpinResults() {
        // [ [top, mid, bot], [top, mid, bot], [top, mid, bot], [top, mid, bot], [top, mid, bot] ]
        const results = this.lines.map( line => line.getResults() )

        this.bonusRate = 1
        const bonusesHighlights = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]]

        let golds = 0
        const goldsHighlights = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]]

        let coins = 0
        const coinsHighlights = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]]

        let presents = 0
        const presentsHighlights = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]]

        let clovers = 0
        const cloversHighlights = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]]

        let sevens = 0
        const sevensHighlights = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]]

        const sets = {
            [SLOTS.cards]: {count: 0, lines: [], indexes: []},
            [SLOTS.dices]: {count: 0, lines: [], indexes: []},
            [SLOTS.chips]: {count: 0, lines: [], indexes: []}
        }

        const top = []
        const mid = []
        const bot = []

        results.forEach( (line, lineIndex) => {
            line.forEach( (value, index) => {
                if (value === SLOTS.bonus) {
                    this.bonusRate++
                    bonusesHighlights[lineIndex][index] = 1
                }

                if (value === SLOTS.gold) {
                    golds++
                    goldsHighlights[lineIndex][index] = 1
                }
                if (value === SLOTS.coin) {
                    coins++
                    coinsHighlights[lineIndex][index] = 1
                }

                if (value === SLOTS.present) {
                    presents++
                    presentsHighlights[lineIndex][index] = 1
                }
                if (value === SLOTS.clover) {
                    clovers++
                    cloversHighlights[lineIndex][index] = 1
                }

                if (value === SLOTS.seven) {
                    sevens++
                    sevensHighlights[lineIndex][index] = 1
                }
                if (value === SLOTS.jackpot) {
                    sevens += 3
                    sevensHighlights[lineIndex][index] = 1
                }

                if (value === SLOTS.cards || value === SLOTS.dices || value === SLOTS.chips) {
                    sets[value].count++
                    sets[value].lines.push(lineIndex)
                    sets[value].indexes.push(index)
                }

                if (index === 0) top.push(value)
                else if (index === 1) mid.push(value)
                else bot.push(value)
            })
        })

        // update sets
        let setsHighlightsList = []
        while (sets[SLOTS.cards].count > 0 && sets[SLOTS.dices].count > 0 && sets[SLOTS.chips].count > 0) {
            sets[SLOTS.cards].count--
            sets[SLOTS.dices].count--
            sets[SLOTS.chips].count--

            const setsHighlights = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]]
            setsHighlights[ sets[SLOTS.cards].lines.shift() ][ sets[SLOTS.cards].indexes.shift() ] = 1
            setsHighlights[ sets[SLOTS.dices].lines.shift() ][ sets[SLOTS.dices].indexes.shift() ] = 1
            setsHighlights[ sets[SLOTS.chips].lines.shift() ][ sets[SLOTS.chips].indexes.shift() ] = 1
            setsHighlightsList.push(setsHighlights)
        }

        // check wins
        const linesFive =  [
            this.countConsecutive(top),
            this.countConsecutive(mid),
            this.countConsecutive(bot)
        ]

        const linesTree = [
            this.countConsecutive([top[0], mid[1], bot[2]]),
            this.countConsecutive([top[1], mid[2], bot[3]]),
            this.countConsecutive([top[2], mid[3], bot[4]]),
            this.countConsecutive([top[2], mid[1], bot[0]]),
            this.countConsecutive([top[3], mid[2], bot[1]]),
            this.countConsecutive([top[4], mid[3], bot[2]])
        ]

        let totalRate = 0 //sum of rates for 3 or 4 or 5 same in lines or diagonals

        linesTree.forEach( (data, index) => {
            for(let key in data) {
                if (data[key].count > 2) {
                    totalRate += SLOTS_LINES_DATA[key].rates[ data[key].count ]
 
                    switch(index) {
                        case 0 : // [top[0], mid[1], bot[2]
                            this.highlightDataList.push({
                                key: 'LINE',
                                count: data[key].count,
                                winRate: SLOTS_LINES_DATA[key].rates[data[key].count],
                                highlight: [[1, 0, 0], [0, 1, 0], [0, 0, 1], [0, 0, 0], [0, 0, 0]]
                            })
                        break;

                        case 1 : // [top[1], mid[2], bot[3]]
                            this.highlightDataList.push({
                                key: 'LINE',
                                count: data[key].count,
                                winRate: SLOTS_LINES_DATA[key].rates[data[key].count],
                                highlight: [[0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1], [0, 0, 0]]
                            })
                        break;

                        case 2 : // [top[2], mid[3], bot[4]
                            this.highlightDataList.push({
                                key: 'LINE',
                                count: data[key].count,
                                winRate: SLOTS_LINES_DATA[key].rates[data[key].count],
                                highlight: [[0, 0, 0], [0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1]]
                            })
                        break;

                        case 3 : // [top[2], mid[1], bot[0]
                            this.highlightDataList.push({
                                key: 'LINE',
                                count: data[key].count,
                                winRate: SLOTS_LINES_DATA[key].rates[data[key].count],
                                highlight: [[0, 0, 1], [0, 1, 0], [1, 0, 0], [0, 0, 0], [0, 0, 0]]
                            })
                        break;

                        case 4 : // [top[3], mid[2], bot[1]
                            this.highlightDataList.push({
                                key: 'LINE',
                                count: data[key].count,
                                winRate: SLOTS_LINES_DATA[key].rates[data[key].count],
                                highlight: [[0, 0, 0], [0, 0, 1], [0, 1, 0], [1, 0, 0], [0, 0, 0]]
                            })
                        break;

                        case 5 : // [top[4], mid[3], bot[2]
                            this.highlightDataList.push({
                                key: 'LINE',
                                count: data[key].count,
                                winRate: SLOTS_LINES_DATA[key].rates[data[key].count],
                                highlight: [[0, 0, 0], [0, 0, 0], [0, 0, 1], [0, 1, 0], [1, 0, 0]]
                            })
                        break;
                    }
                }
            }
        })
        linesFive.forEach( (data, index) => {
            for(let key in data) {
                if (data[key].count > 2) {
                    totalRate += SLOTS_LINES_DATA[key].rates[ data[key].count ]

                    const highlights = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]]
                    data[key].indexes.forEach( i => highlights[i][index] = 1 )
                    this.highlightDataList.push({
                        key: 'LINE',
                        count: data[key].count,
                        winRate: SLOTS_LINES_DATA[key].rates[data[key].count],
                        highlight: highlights
                    })
                }
            }
        })

        // add bonuses
        if (totalRate > 0 && this.bonusRate > 1) {
            this.highlightDataList.push({
                key: 'BONUS',
                count: this.bonusRate,
                winRate: this.bonusRate,
                highlight: bonusesHighlights
            })
        }

        // add 7x7+
        if (sevens > 6) {
            this.highlightDataList.push({
                key: '7x7',
                count: sevens,
                winRate: SLOTS_LINES_DATA[SLOTS.jackpot].extra,
                highlight: sevensHighlights
            })
        }

        // sets add
        setsHighlightsList.forEach( setsHighlight => {
            this.highlightDataList.push({
                key: 'SET',
                count: 1,
                winRate: SLOTS_LINES_DATA[SLOTS.dices].extra,
                highlight: setsHighlight
            })
        })

        // add golds
        if (golds > 0) {
            this.highlightDataList.push({
                key: 'GOLD',
                count: golds,
                winRate: golds,
                highlight: goldsHighlights
            })
        }
        // add coins
        if (coins > 0) {
            this.highlightDataList.push({
                key: 'COIN',
                count: coins,
                winRate: coins,
                highlight: coinsHighlights
            })
        }

        // add presents
        if (presents > 0) {
            this.highlightDataList.push({
                key: 'PRESENT',
                count: presents,
                winRate: presents,
                highlight: presentsHighlights
            })
        }
        // add clovers highlight if need
        if (clovers > 0 && this.highlightDataList.length === 0) {
            this.highlightDataList.push({
                key: 'CLOVER',
                count: clovers,
                winRate: 1,
                highlight: cloversHighlights
            })
        }

        this.highlightCallback()     
    }
    countConsecutive(line) {
        const sames = {}
        let key = line[0] // key of a same
        let count = 1 // count of nearest
        let indexes = [0]
        for (let i = 1; i < line.length; i++) {
            if (key === line[i] || line[i] === SLOTS.wild || key === SLOTS.wild) {
                count ++
                indexes.push(i)
                if (key === SLOTS.wild) key = line[i]
            } else {
                sames[key] = {count: count, indexes: indexes}
                key = line[i]
                count = 1
                let previousIndex = i - 1
                indexes = [i]
                while(previousIndex > 0 && line[previousIndex] === SLOTS.wild) {
                    indexes.push(previousIndex)
                    previousIndex--
                    count++
                }
            }
        }
        if (!(key in sames) || sames[key].count < count) sames[key] = {count: count, indexes: indexes}
        
        return sames
    }
    highlightCallback() {  //        
        this.linsRunningCount--
        if (this.linsRunningCount > 0) return

        if (this.highlightDataList.length === 0) {
            resultSlots(0) // reset bet
            this.runButton.setActive(true)

            this.autoSpinTimeout = setTimeout(() => {
                if (this.isSceneDestroyed) return
                if (this.isAutoSpinOn) this.run()
            }, 300)

            /*
            console.clear()
            testWinData.spins++
            console.log(testWinData)
            */

            return
        }

        this.linsRunningCount = 5
        const highlightData = this.highlightDataList.pop()
        // {key: 'BONUS', count: this.bonusRate, highlight: bonusesHighlights}
        const bonusText = this.bonusRate > 1 ? ' x' + this.bonusRate : ''
        let messageText = ''
        switch(highlightData.key) {
            case 'LINE' :
                resultSlots(highlightData.winRate * this.bonusRate)
                messageText = highlightData.count
                messageText += MESSAGE_TEXT['LINE'][ this.currentLanguage ]
                messageText += `+${formatNumber(highlightData.winRate * betsTotal)}${bonusText}`
                setTimeout( () => {
                    if (this.isSceneDestroyed) return
                    showMessage(messageText)
                    this.coinEffects.start(0.15 * highlightData.count * this.bonusRate)
                }, this.highlightMessageTimeout)
                setTimeout( () => {
                    if (this.isSceneDestroyed) return
                    soundPlay(sounds.se_line)
                }, SLOTS_HIGHLIGHT.inOut)

                this.spinTotalWin += highlightData.winRate * betsTotal *this.bonusRate
                this.spinTotalWinText.text = SPIN_WIN_TEXT[this.currentLanguage](this.spinTotalWin)

                //testWinData[`lines_${highlightData.count}`].count++
                //testWinData[`lines_${highlightData.count}`].money += highlightData.winRate * betsTotal *this.bonusRate 
            break;
            case 'BONUS' :
                messageText = MESSAGE_TEXT['BONUS'][ this.currentLanguage ]
                messageText += bonusText
                messageText += MESSAGE_TEXT['BONUS2'][ this.currentLanguage ]
                setTimeout( () => {
                    if (this.isSceneDestroyed) return
                    showMessage(messageText)
                }, this.highlightMessageTimeout)
                setTimeout( () => {
                    if (this.isSceneDestroyed) return
                    soundPlay(sounds.se_bonus)
                }, SLOTS_HIGHLIGHT.inOut)
            break;
            case '7x7' :
                resultSlots(highlightData.winRate)
                messageText = MESSAGE_TEXT['7x7'][this.currentLanguage]
                messageText +=`+${formatNumber(highlightData.winRate * betsTotal)}`
                setTimeout( () => {
                    if (this.isSceneDestroyed) return
                    showMessage(messageText)
                    this.coinEffects.start(1.5)
                }, this.highlightMessageTimeout)
                setTimeout( () => {
                    if (this.isSceneDestroyed) return
                    soundPlay(sounds.se_jackpot)
                }, SLOTS_HIGHLIGHT.inOut)

                this.spinTotalWin += highlightData.winRate * betsTotal
                this.spinTotalWinText.text = SPIN_WIN_TEXT[this.currentLanguage](this.spinTotalWin)

                //testWinData.jackpot.count++
                //testWinData.jackpot.money += highlightData.winRate * betsTotal
            break; 
            case 'SET' :
                resultSlots(highlightData.winRate)
                messageText = MESSAGE_TEXT['SET'][this.currentLanguage]
                messageText += `+${formatNumber(highlightData.winRate * betsTotal)}`
                setTimeout( () => {
                    if (this.isSceneDestroyed) return
                    showMessage(messageText)
                    this.coinEffects.start(0.6)
                }, this.highlightMessageTimeout)
                setTimeout( () => {
                    if (this.isSceneDestroyed) return
                    soundPlay(sounds.se_set)
                }, SLOTS_HIGHLIGHT.inOut)

                this.spinTotalWin += highlightData.winRate * betsTotal
                this.spinTotalWinText.text = SPIN_WIN_TEXT[this.currentLanguage](this.spinTotalWin)

                //testWinData.sets.count++
                //testWinData.sets.money += highlightData.winRate * betsTotal
            break;
            case 'PRESENT' :
                resultSlots(highlightData.winRate)
                messageText = MESSAGE_TEXT['PRESENT'][this.currentLanguage]
                messageText += `+${formatNumber(highlightData.winRate * betsTotal)}`
                setTimeout( () => {
                    if (this.isSceneDestroyed) return
                    showMessage(messageText)
                    this.coinEffects.start(0.1 * highlightData.winRate)
                }, this.highlightMessageTimeout)
                setTimeout( () => {
                    if (this.isSceneDestroyed) return
                    soundPlay(sounds.se_fortuna)
                }, SLOTS_HIGHLIGHT.inOut)

                this.spinTotalWin += highlightData.winRate * betsTotal
                this.spinTotalWinText.text = SPIN_WIN_TEXT[this.currentLanguage](this.spinTotalWin)

                //testWinData.presents.count++
                //testWinData.presents.money += highlightData.winRate * betsTotal
            break;
            case 'COIN' :
                messageText = MESSAGE_TEXT['COIN'][this.currentLanguage]
                messageText += addSlotCoins(formatNumber(highlightData.winRate))
                setTimeout( () => {
                    if (this.isSceneDestroyed) return
                    showMessage(messageText)
                }, this.highlightMessageTimeout)
                this.bankText.text = formatNumber(slotCoins)
                setTimeout( () => {
                    if (this.isSceneDestroyed) return
                    soundPlay(sounds.se_coin_to_bank)
                }, SLOTS_HIGHLIGHT.inOut)
            break;
            case 'GOLD' :
                if (slotCoins < 1) {
                    this.linsRunningCount = 0
                    setTimeout( () => {
                        if (this.isSceneDestroyed) return
                        this.highlightCallback()
                    }, 0)
                    return
                }

                const getBank = getSlotCoins(highlightData.winRate)
                messageText = MESSAGE_TEXT['GOLD'][this.currentLanguage]
                messageText += `${Math.min(100, highlightData.winRate * 10)} %\n`
                messageText += `+${formatNumber(getBank)}`
                messageText += MESSAGE_TEXT['GOLD2'][this.currentLanguage]
                setTimeout( () => {
                    if (this.isSceneDestroyed) return
                    showMessage(messageText)
                    this.coinEffects.start(0.07 * highlightData.winRate)
                }, this.highlightMessageTimeout)
                this.bankText.text = formatNumber(slotCoins)
                setTimeout( () => {
                    if (this.isSceneDestroyed) return
                    soundPlay(sounds.se_gold), SLOTS_HIGHLIGHT.inOut
                })

                this.spinTotalWin += getBank
                this.spinTotalWinText.text = SPIN_WIN_TEXT[this.currentLanguage](this.spinTotalWin)

                //testWinData.bank.count++
                //testWinData.bank.money += getBank
            break;
            case 'CLOVER' :
                messageText = MESSAGE_TEXT['CLOVER'][this.currentLanguage]
                messageText += `${formatNumber(betsTotal)}`
                setTimeout( () => {
                    if (this.isSceneDestroyed) return
                    showMessage(messageText)
                }, this.highlightMessageTimeout)
                returnBet()
                setTimeout( () => {
                    if (this.isSceneDestroyed) return
                    soundPlay(sounds.se_clover)
                }, SLOTS_HIGHLIGHT.inOut)

                this.spinTotalWin = betsTotal
                this.spinTotalWinText.text = SPIN_WIN_TEXT[this.currentLanguage](this.spinTotalWin)
            break; 
            default : 
        }

        this.lines.forEach((line, index) => {
            setTimeout( () => {
                if (this.isSceneDestroyed) return
                line.highlight(highlightData.highlight[index], this.highlightCallback.bind(this))


                if (highlightData.key === 'COIN') {
                    for(let i = 0; i < highlightData.highlight.length; i++) {
                        if (highlightData.highlight[index][i] === 1) {
                            const start = line.visibleImages[i + 1].position
                            const x = start.x + line.x
                            const y = start.y + line.y
                            this.gameContainer.addChild(
                                new CoinToBank(x, y, this.bankIcon.x, this.bankIcon.y)
                            )
                        }
                    }
                }

                if (highlightData.key === 'GOLD') {
                    tickerAdd(this)
                }
                
            }, this.highlightTimeout)
        })
    }

    updateLanguage(lang) {
        this.currentLanguage = lang
        this.runButton.setLabel( BUTTON_TEXT.spin[ this.currentLanguage ] )
        this.spinTotalWinText.text = SPIN_WIN_TEXT[this.currentLanguage](this.spinTotalWin)
    }

    tick(time) {
        const scaleSpeed = this.bankIconRotationsSpeed * time.deltaMS

        if (this.bankIconIsScaleUp) {
            this.bankIcon.scale.x = Math.min(0.75, this.bankIcon.scale.x + scaleSpeed)
            if (this.bankIcon.scale.x === 0.75) {
                this.bankIconIsScaleUp = false
                this.bankIconRotationsCount--
                if (this.bankIconRotationsCount === 0) {
                    tickerRemove(this)
                    this.bankIconRotationsCount = 3
                }
            } 
        } else {
            this.bankIcon.scale.x = Math.max(0.1, this.bankIcon.scale.x - scaleSpeed)
            if (this.bankIcon.scale.x === 0.1) this.bankIconIsScaleUp = true
        }
    }

    kill() {
        EventHub.off( events.updateLanguage, this.updateLanguage, this )

        removeCursorPointer(this.bankHoverArea)
        this.bankHoverArea.off('pointerover', this.bankOnHover, this)
        this.bankHoverArea.off('pointerout', this.bankOnOut, this)

        this.isSceneDestroyed = true
        document.removeEventListener('keyup', this.autoSpinByKeySpace_bind )

        clearTimeout(this.autoSpinTimeout)
        this.isAutoSpinOn = false
    }

    test() {
        const startTime = Date.now()

        const spins = 100_000_000
        const test_bet = 10

        let test_money = spins * test_bet
        let test_bank = 0

        let test_results = {
            jackpots: 0,
            sets: 0,
            lines_3: 0,
            lines_4: 0,
            lines_5: 0,
            crystals: 0,
            presents: 0,
            clovers: 0,
            bonuses: 0,
        }

        const b_size = this.lines[0].imagesList.length
        const [b1images, b2images, b3images, b4images, b5images] = this.lines.map(line => line.imagesList)

        let b1 = [ b1images[0], b1images[1], b1images[2]]
        let b2 = [ b2images[0], b2images[1], b2images[2]]
        let b3 = [ b3images[0], b3images[1], b3images[2]]
        let b4 = [ b4images[0], b4images[1], b4images[2]]
        let b5 = [ b5images[0], b5images[1], b5images[2]]

        let bbbbb = [b1, b2, b3, b4, b5]

        let [b1_index, b2_index, b3_index, b4_index, b5_index] = [0, 0, 0, 0, 0]

        const spin = () => {
            test_money -= test_bet

            b1_index = (b1_index + 1 + Math.floor( Math.random() * 3 )) % b_size
            b2_index = (b2_index + 3 + Math.floor( Math.random() * 3 )) % b_size
            b3_index = (b3_index + 5 + Math.floor( Math.random() * 3 )) % b_size
            b4_index = (b4_index + 7 + Math.floor( Math.random() * 3 )) % b_size
            b5_index = (b5_index + 9 + Math.floor( Math.random() * 3 )) % b_size

            b1 = [ b1images[b1_index], b1images[ (b1_index + 1) % b_size ], b1images[ (b1_index + 2) % b_size ]]
            b2 = [ b2images[b2_index], b2images[ (b2_index + 1) % b_size ], b2images[ (b2_index + 2) % b_size ]]
            b3 = [ b3images[b3_index], b3images[ (b3_index + 1) % b_size ], b3images[ (b3_index + 2) % b_size ]]
            b4 = [ b4images[b4_index], b4images[ (b4_index + 1) % b_size ], b4images[ (b4_index + 2) % b_size ]]
            b5 = [ b5images[b5_index], b5images[ (b5_index + 1) % b_size ], b5images[ (b5_index + 2) % b_size ]]

            bbbbb = [b1, b2, b3, b4, b5]
        }

        const countConsecutive = (line) => {
            const sames = {}
            let key = line[0] // key of a same
            let count = 1 // count of nearest
            let indexes = [0]
            for (let i = 1; i < line.length; i++) {
                if (key === line[i] || line[i] === SLOTS.wild || key === SLOTS.wild) {
                    count ++
                    indexes.push(i)
                    if (key === SLOTS.wild) key = line[i]
                } else {
                    sames[key] = {count: count, indexes: indexes}
                    key = line[i]
                    count = 1
                    let previousIndex = i - 1
                    indexes = [i]
                    while(previousIndex > 0 && line[previousIndex] === SLOTS.wild) {
                        indexes.push(previousIndex)
                        previousIndex--
                        count++
                    }
                }
            }
            if (!(key in sames) || sames[key].count < count) sames[key] = {count: count, indexes: indexes}
            
            return sames
        }

        const checkResults = () => {
            let bonusRate = 1
            let golds = 0
            let coins = 0
            let presents = 0
            let clovers = 0
            let sevens = 0
            const sets = {
                [SLOTS.cards]: 0,
                [SLOTS.dices]: 0,
                [SLOTS.chips]: 0
            }
        
            const top = []
            const mid = []
            const bot = []

            bbbbb.forEach( line => {
                line.forEach( (value, index) => {
                    if (value === SLOTS.bonus) bonusRate++
                    if (value === SLOTS.gold) golds++
                    if (value === SLOTS.coin) coins++
                    if (value === SLOTS.present) presents++
                    if (value === SLOTS.clover) clovers++
                    if (value === SLOTS.seven) sevens++
                    if (value === SLOTS.jackpot) sevens += 3
                    if (value === SLOTS.cards || value === SLOTS.dices || value === SLOTS.chips) sets[value]++

                    if (index === 0) top.push(value)
                    else if (index === 1) mid.push(value)
                    else bot.push(value)
                })
            })
        
            const linesFive =  [
                countConsecutive(top),
                countConsecutive(mid),
                countConsecutive(bot)
            ]
        
            const linesTree = [
                countConsecutive([top[0], mid[1], bot[2]]),
                countConsecutive([top[1], mid[2], bot[3]]),
                countConsecutive([top[2], mid[3], bot[4]]),
                countConsecutive([top[2], mid[1], bot[0]]),
                countConsecutive([top[3], mid[2], bot[1]]),
                countConsecutive([top[4], mid[3], bot[2]])
            ]
        
            let totalRate = 0 //sum of rates for 3 or 4 or 5 same in lines or diagonals
        
            linesTree.forEach( data => {
                for(let key in data) {
                    if (data[key].count > 2) {
                        totalRate += SLOTS_LINES_DATA[key].rates[ data[key].count ]
                        test_results.lines_3++
                        if (key === SLOTS.crystal) test_results.crystals++
                    }
                }
            })
            linesFive.forEach( data => {
                for(let key in data) {
                    if (data[key].count > 2) {
                        totalRate += SLOTS_LINES_DATA[key].rates[ data[key].count ]
                        test_results['lines_' + data[key].count]++
                        if (key === SLOTS.crystal) test_results.crystals++
                    }
                }
            })

            if (sevens > 6) {
                test_money += test_bet * SLOTS_LINES_DATA[SLOTS.jackpot].extra
                test_results.jackpots++
            }

            test_bank += Math.ceil(test_bet * 0.1 * coins)

            if (golds) {
                const sum = Math.min( test_bank, Math.ceil(golds * 0.1 * test_bank) )
                test_money += sum
                test_bank -= sum
            }

            if (presents) {
                test_money += presents * test_bet
                test_results.presents++
            }

            const setsCount = Math.min(sets[SLOTS.cards], sets[SLOTS.dices], sets[SLOTS.chips])
            test_money += setsCount * SLOTS_LINES_DATA[SLOTS.cards].extra * test_bet
            test_results.sets += setsCount

            test_money += totalRate * test_bet * bonusRate
            if (totalRate && bonusRate > 1) test_results.bonuses++

            if (clovers && !coins && sevens < 7 && !golds && !presents && !setsCount && !totalRate) {
                test_money += test_bet
                test_results.clovers++
            }
        }

        for(let i = 0; i < spins; i++) {
            spin()
            checkResults()
        }

        console.log('TEST', ((Date.now() - startTime) / 1000).toFixed(2), 'sec.',
            '\nspins:', formatNumber(spins),
            '\nbet:', test_bet,
            '\nstart_money:', formatNumber(spins * test_bet),
            '\nfinal_money:', formatNumber(test_money),
            '\nRTP:', ((test_money / (spins * test_bet)) * 100).toFixed(2), '%',
            '\nbank:', test_bank,
            '\nlines_3:', formatNumber(test_results.lines_3), '(', (test_results.lines_3 / spins * 100).toFixed(2) , '%)',
            '\nlines_4:', formatNumber(test_results.lines_4), '(', (test_results.lines_4 / spins * 100).toFixed(2) , '%)',
            '\nlines_5:', formatNumber(test_results.lines_5), '(', (test_results.lines_5 / spins * 100).toFixed(2) , '%)',
            '\nbonuses:', formatNumber(test_results.bonuses), '(', (test_results.bonuses / spins * 100).toFixed(2) , '%)',
            '\npresents:', formatNumber(test_results.presents), '(', (test_results.presents / spins * 100).toFixed(2) , '%)',
            '\nclovers:', formatNumber(test_results.clovers), '(', (test_results.clovers / spins * 100).toFixed(2) , '%)',
            '\nsets:', formatNumber(test_results.sets), '(', (test_results.sets / spins * 100).toFixed(2) , '%)',
            '\ncrystals:', formatNumber(test_results.crystals), '(', (test_results.crystals / spins * 100).toFixed(2) , '%)',
            '\njackpots:', formatNumber(test_results.jackpots), '(', (test_results.jackpots / spins * 100).toFixed(2) , '%)'
        )
    }
}