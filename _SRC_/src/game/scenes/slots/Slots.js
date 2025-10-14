import { Container, Sprite } from 'pixi.js'
import { tickerRemove } from '../../../app/application'
import { images, music } from '../../../app/assets'
import { setMusic } from '../../../app/sound'
import { BUTTON, BUTTON_TEXT, SLOTS_BORDER, SLOTS_LINES, GAME_OFFSET, SLOTS, SLOTS_LINES_DATA, MESSAGE } from '../../constants'
import Line from './Line'
import Button from '../../UI/Button'
import { isLangRu, checkRunSlots, resultSlots, resetState, returnBet } from '../../state'
import LeftMenu from '../../UI/LeftMenu'
import RightMenu from '../../UI/RightMenu'
import TopBarMenu from '../../UI/TopBarMenu'
import Message from '../../UI/Message'
import Popup from '../../popup/Popup'
import BackgroundTiling from '../../BG/BackgroundTiling'

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
        
        // UI
        this.runButton = new Button(
            isLangRu ? BUTTON_TEXT.spin.ru : BUTTON_TEXT.spin.en,
            SLOTS_BORDER.width * 0.5, SLOTS_BORDER.height + BUTTON.height * 0.75,
            this.run.bind(this)
        )
        this.gameContainer.addChild(this.runButton)

        // UI
        this.topUI = new TopBarMenu()
        this.leftUI = new LeftMenu()
        this.rightUI = new RightMenu()

        this.popup = new Popup()

        this.message = new Message()

        this.addChild(this.leftUI, this.rightUI, this.topUI, this.popup, this.message)

        this.highlightList = []

        document.addEventListener('keyup', (e) => {
            if (e.code === "Space") this.run()
        })

        // done
        setMusic([music.bgm_0, music.bgm_1, music.bgm_2, music.bgm_3, music.bgm_4, music.bgm_5])
    }

    screenResize(screenData) {
        // set scene container in center of screen
        this.position.set( screenData.centerX, screenData.centerY )

        // repeat bg tile in full screen (width and height)
        this.bg.screenResize(screenData)

        // update popup
        this.popup.screenResize(screenData)

        // update message
        this.message.screenResize(screenData)

        // update UI
        this.leftUI.position.set(-screenData.centerX, screenData.centerY)
        this.rightUI.position.set(screenData.centerX, screenData.centerY)
        this.topUI.screenResize(screenData)

        const slotsWidth = GAME_OFFSET * 2 + SLOTS_BORDER.width
        const slotsHeight = GAME_OFFSET * 2 + SLOTS_BORDER.height + BUTTON.height * 3
        const scale = Math.min(
            screenData.width / slotsWidth, screenData.height / slotsHeight
        )
        const slotsOffsetX = SLOTS_BORDER.x * scale
        const slotsOffsetY = SLOTS_BORDER.y * scale
        this.gameContainer.position.set(slotsOffsetX, slotsOffsetY)
        this.gameContainer.scale.set(scale)
    }

    run() {
        if (this.linsRunningCount > 0 || !checkRunSlots()) return

        this.runButton.setActive(false)
        this.linsRunningCount = 5
        this.lines.forEach((line, i) => line.run(i))
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

        let bonuses = 1
        let bonusesHighlights = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]]

        const top = []
        const mid = []
        const bot = []

        results.forEach( (line, lineIndex) => {
            line.forEach( (value, index) => {
                if (value === SLOTS.bonus) {
                    bonuses++
                    bonusesHighlights[lineIndex][index] = 1
                }

                if (index === 0) top.push(value)
                else if (index === 1) mid.push(value)
                else bot.push(value)
            })
        })

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

        let totalRate = 0 // without jackpot

        linesTree.forEach( (data, index) => {
            for(let key in data) {
                if (data[key].count > 2) {
                    totalRate += SLOTS_LINES_DATA[key].rates[ data[key].count ]
 
                    switch(index) {
                        case 0 : // [top[0], mid[1], bot[2]
                            this.highlightList.push(
                                [[1, 0, 0], [0, 1, 0], [0, 0, 1], [0, 0, 0], [0, 0, 0]]
                            )
                        break;

                        case 1 : // [top[1], mid[2], bot[3]]
                            this.highlightList.push(
                                [[0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1], [0, 0, 0]]
                            )
                        break;

                        case 2 : // [top[2], mid[3], bot[4]
                            this.highlightList.push(
                                [[0, 0, 0], [0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1]]
                            )
                        break;

                        case 3 : // [top[2], mid[1], bot[0]
                            this.highlightList.push(
                                [[0, 0, 1], [0, 1, 0], [1, 0, 0], [0, 0, 0], [0, 0, 0]]
                            )
                        break;

                        case 4 : // [top[3], mid[2], bot[1]
                            this.highlightList.push(
                                [[0, 0, 0], [0, 0, 1], [0, 1, 0], [1, 0, 0], [0, 0, 0]]
                            )
                        break;

                        case 5 : // [top[4], mid[3], bot[2]
                            this.highlightList.push(
                                [[0, 0, 0], [0, 0, 0], [0, 0, 1], [0, 1, 0], [1, 0, 0]]
                            )
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
                    this.highlightList.push(highlights)
                }
            }
        })

        if (bonuses > 1 && totalRate) this.highlightList.unshift(bonusesHighlights)

        totalRate = totalRate * bonuses
        /*
        if (totalRate === 0 && clovers > 0) {
            this.highlightList.push(cloversHighlights)
            returnBet()
        }
        */

        resultSlots(totalRate)

        if (totalRate === 0) this.highlightCallback()
        else setTimeout(() => this.highlightCallback(), MESSAGE.showDuration + MESSAGE.inOutDuration * 2)

        // test
        console.log('BONUS x', bonuses)
        console.log('5x', linesFive)
        console.log('3х:', linesTree)
        console.log('RATE:', totalRate)
        console.log('-------------')        
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
    highlightCallback() {
        this.linsRunningCount--
        if (this.linsRunningCount > 0) return

        if (this.highlightList.length === 0) {
            this.runButton.setActive(true)
            return
        }

        this.linsRunningCount = 5
        const highlightData = this.highlightList.shift()

        this.lines.forEach((line, index) => {
            line.highlight(highlightData[index], this.highlightCallback.bind(this))
        })
    }

    kill() {
        tickerRemove(this)
        while(this.children.length) {
            tickerRemove(this.children[0])
            if ('kill' in this.children[0]) this.children[0].kill()
            else this.children[0].destroy()
        }
        this.destroy()
    }
}