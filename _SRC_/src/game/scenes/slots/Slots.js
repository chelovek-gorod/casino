import { Container, Sprite, Text } from 'pixi.js'
import { tickerRemove } from '../../../app/application'
import { images, music, sounds } from '../../../app/assets'
import { playSound, setMusic } from '../../../app/sound'
import { BUTTON, BUTTON_TEXT, SLOTS_BORDER, SLOTS_LINES, GAME_OFFSET, SLOTS, SLOTS_LINES_DATA, 
    SLOTS_HIGHLIGHT, MESSAGE_TEXT, UI } from '../../constants'
import Line from './Line'
import Button from '../../UI/Button'
import { isLangRu, checkRunSlots, resultSlots, resetState, returnBet, betsTotal, slotCoins, addSlotCoins, getSlotCoins } from '../../state'
import LeftMenu from '../../UI/LeftMenu'
import RightMenu from '../../UI/RightMenu'
import TopBarMenu from '../../UI/TopBarMenu'
import Message from '../../UI/Message'
import Popup from '../../popup/Popup'
import BackgroundTiling from '../../BG/BackgroundTiling'
import { showMessage } from '../../../app/events'
import { styles } from '../../../app/styles'
import ShortButton from '../../UI/ShortButton'
import { formatNumber } from '../../../utils/functions'
import Coins from '../../effects/Coins'

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

export default class Slots extends Container {
    constructor() {
        super()
        this.alpha = 0

        resetState()

        // BG
        this.bg = new BackgroundTiling(images.bg_red)
        this.addChild(this.bg)

        // SCALED MAIN GAME CONTAINER
        this.gameContainer = new Container()
        this.addChild(this.gameContainer)

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

        this.bankText = new Text({text: slotCoins, style: styles.slotsCoins})
        this.bankText.anchor.set(0, 0.5)
        this.bankText.position.set(320, SLOTS_BORDER.height + BUTTON.height * 0.75)

        this.gameContainer.addChild(this.bankIcon, this.bankText)

        this.runButton = new Button(
            isLangRu ? BUTTON_TEXT.spin.ru : BUTTON_TEXT.spin.en,
            SLOTS_BORDER.width * 0.5, SLOTS_BORDER.height + BUTTON.height * 0.75,
            this.run.bind(this)
        )
        this.gameContainer.addChild(this.runButton)

        this.isAutoSpinOn = false
        this.autoSpinTimeout = null
        this.isSceneDestroyed = false
        this.autoButton = new ShortButton( 'play',
            SLOTS_BORDER.width - 260, SLOTS_BORDER.height + BUTTON.height * 0.75,
            this.setAutoSpin.bind(this), true
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

        this.autoSpinByKeySpace_bind = this.setAutoSpinByKeySpace.bind(this)
        document.addEventListener('keyup', this.autoSpinByKeySpace_bind )

        // done
        setMusic([music.bgm_0, music.bgm_1, music.bgm_2, music.bgm_3, music.bgm_4, music.bgm_5])
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

    setAutoSpin() { console.log(this.isAutoSpinOn)
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
    setAutoSpinByKeySpace(event) {
        if (event.code === "Space") this.run()
    }

    run() {
        if (this.linsRunningCount > 0 || !checkRunSlots()) {
            this.autoButton.setTexture('play')
            this.isAutoSpinOn = false
            return 
        }

        this.runButton.setActive(false)
        this.linsRunningCount = 5
        this.lines.forEach((line, i) => line.run(i))
        playSound(sounds.se_slots_spin)
    }
    lineStopped() {
        this.linsRunningCount -= 1
        if (this.linsRunningCount === 0) {
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

            console.clear()
            testWinData.spins++
            console.log(testWinData)

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
                messageText += isLangRu ? MESSAGE_TEXT['LINE'].ru : MESSAGE_TEXT['LINE'].en
                messageText += `+${formatNumber(highlightData.winRate * betsTotal)}${bonusText}`
                setTimeout( () => {
                    if (this.isSceneDestroyed) return
                    showMessage(messageText)
                    this.coinEffects.start()
                }, this.highlightMessageTimeout)
                setTimeout( () => {
                    if (this.isSceneDestroyed) return
                    playSound(sounds.se_line)
                }, SLOTS_HIGHLIGHT.inOut)

                testWinData[`lines_${highlightData.count}`].count++
                testWinData[`lines_${highlightData.count}`].money += highlightData.winRate * betsTotal *this.bonusRate 
            break;
            case 'BONUS' :
                messageText = isLangRu ? MESSAGE_TEXT['BONUS'].ru : MESSAGE_TEXT['BONUS'].en
                messageText += bonusText
                messageText += isLangRu ? MESSAGE_TEXT['BONUS2'].ru : MESSAGE_TEXT['BONUS2'].en
                setTimeout( () => {
                    if (this.isSceneDestroyed) return
                    showMessage(messageText)
                }, this.highlightMessageTimeout)
                setTimeout( () => {
                    if (this.isSceneDestroyed) return
                    playSound(sounds.se_bonus)
                }, SLOTS_HIGHLIGHT.inOut)
            break;
            case '7x7' :
                resultSlots(highlightData.winRate)
                messageText = isLangRu ? MESSAGE_TEXT['7x7'].ru : MESSAGE_TEXT['7x7'].en
                messageText +=`+${formatNumber(highlightData.winRate * betsTotal)}`
                setTimeout( () => {
                    if (this.isSceneDestroyed) return
                    showMessage(messageText)
                    this.coinEffects.start()
                }, this.highlightMessageTimeout)
                setTimeout( () => {
                    if (this.isSceneDestroyed) return
                    playSound(sounds.se_jackpot)
                }, SLOTS_HIGHLIGHT.inOut)

                testWinData.jackpot.count++
                testWinData.jackpot.money += highlightData.winRate * betsTotal
            break; 
            case 'SET' :
                resultSlots(highlightData.winRate)
                messageText = isLangRu ? MESSAGE_TEXT['SET'].ru : MESSAGE_TEXT['SET'].en
                messageText += `+${formatNumber(highlightData.winRate * betsTotal)}`
                setTimeout( () => {
                    if (this.isSceneDestroyed) return
                    showMessage(messageText)
                    this.coinEffects.start()
                }, this.highlightMessageTimeout)
                setTimeout( () => {
                    if (this.isSceneDestroyed) return
                    playSound(sounds.se_set)
                }, SLOTS_HIGHLIGHT.inOut)

                testWinData.sets.count++
                testWinData.sets.money += highlightData.winRate * betsTotal
            break;
            case 'PRESENT' :
                resultSlots(highlightData.winRate)
                messageText = isLangRu ? MESSAGE_TEXT['PRESENT'].ru : MESSAGE_TEXT['PRESENT'].en
                messageText += `+${formatNumber(highlightData.winRate * betsTotal)}`
                setTimeout( () => {
                    if (this.isSceneDestroyed) return
                    showMessage(messageText)
                    this.coinEffects.start()
                }, this.highlightMessageTimeout)
                setTimeout( () => {
                    if (this.isSceneDestroyed) return
                    playSound(sounds.se_fortuna)
                }, SLOTS_HIGHLIGHT.inOut)

                testWinData.presents.count++
                testWinData.presents.money += highlightData.winRate * betsTotal
            break;
            case 'COIN' :
                messageText = isLangRu ? MESSAGE_TEXT['COIN'].ru : MESSAGE_TEXT['COIN'].en
                messageText += addSlotCoins(formatNumber(highlightData.winRate))
                setTimeout( () => {
                    if (this.isSceneDestroyed) return
                    showMessage(messageText)
                }, this.highlightMessageTimeout)
                this.bankText.text = slotCoins
                setTimeout( () => {
                    if (this.isSceneDestroyed) return
                    playSound(sounds.se_coin_to_bank)
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
                messageText = isLangRu ? MESSAGE_TEXT['GOLD'].ru : MESSAGE_TEXT['GOLD'].en
                messageText += `${Math.min(100, highlightData.winRate * 10)} %\n`
                messageText += `+${formatNumber(getBank)}`
                messageText += isLangRu ? MESSAGE_TEXT['GOLD2'].ru : MESSAGE_TEXT['GOLD2'].en
                setTimeout( () => {
                    if (this.isSceneDestroyed) return
                    showMessage(messageText)
                    this.coinEffects.start()
                }, this.highlightMessageTimeout)
                this.bankText.text = slotCoins
                setTimeout( () => {
                    if (this.isSceneDestroyed) return
                    playSound(sounds.se_gold), SLOTS_HIGHLIGHT.inOut
                })

                testWinData.bank.count++
                testWinData.bank.money += getBank
            break;
            case 'CLOVER' :
                messageText = isLangRu ? MESSAGE_TEXT['CLOVER'].ru : MESSAGE_TEXT['CLOVER'].en
                messageText += `${formatNumber(betsTotal)}`
                setTimeout( () => {
                    if (this.isSceneDestroyed) return
                    showMessage(messageText)
                }, this.highlightMessageTimeout)
                returnBet()
                setTimeout( () => {
                    if (this.isSceneDestroyed) return
                    playSound(sounds.se_clover)
                }, SLOTS_HIGHLIGHT.inOut)
            break; 
            default : 
        }

        this.lines.forEach((line, index) => {
            setTimeout( () => {
                if (this.isSceneDestroyed) return
                line.highlight(highlightData.highlight[index], this.highlightCallback.bind(this))
            }, this.highlightTimeout)
        })
    }

    kill() {
        this.isSceneDestroyed = true
        document.removeEventListener('keyup', this.autoSpinByKeySpace_bind )

        clearTimeout(this.autoSpinTimeout)
        this.isAutoSpinOn = false
        tickerRemove(this)
        while(this.children.length) {
            tickerRemove(this.children[0])
            if ('kill' in this.children[0]) this.children[0].kill()
            else this.children[0].destroy()
        }
        this.destroy()
    }
}