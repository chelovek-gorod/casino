import { Container, Sprite } from 'pixi.js'
import { tickerRemove } from '../../../app/application'
import { images, music } from '../../../app/assets'
import { setMusic } from '../../../app/sound'
import { BUTTON, BUTTON_TEXT, SLOTS_BORDER, SLOTS_LINES, GAME_OFFSET, SLOTS, SLOTS_LINES_DATA } from '../../constants'
import Line from './Line'
import Button from '../../UI/Button'
import { isLangRu, checkRunSlots, resultSlots, resetState } from '../../state'
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

        document.addEventListener('keyup', (e) => {
            if (e.code === "Space") this.run()
        })

        // done
        setMusic([music.bgm_casino])
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
            this.runButton.setActive(true)
        }
    }

    checkSpinResults() {
        // [ [top, mid, bot], [top, mid, bot], [top, mid, bot], [top, mid, bot], [top, mid, bot] ]
        const results = this.lines.map( line => line.getResults() )

        // count bonuses
        let bonuses = 1
        const top = []
        const mid = []
        const bot = []
        results.forEach( line => {
            line.forEach( (value, index) => {
                bonuses += value === SLOTS.bonus ? 1 : 0
                if (index === 0) top.push(value)
                else if (index === 1) mid.push(value)
                else bot.push(value)
            })
        })

        // check wins
        const topWin = this.checkLongLine(top)
        const midWin = this.checkLongLine(mid)
        const botWin = this.checkLongLine(bot)

        const linesTree = [
            this.checkLineThree([top[0], mid[1], bot[2]]),
            this.checkLineThree([top[1], mid[2], bot[3]]),
            this.checkLineThree([top[2], mid[3], bot[4]]),
            this.checkLineThree([top[2], mid[1], bot[0]]),
            this.checkLineThree([top[3], mid[2], bot[1]]),
            this.checkLineThree([top[4], mid[3], bot[2]])
        ].filter(line => line !== null)

        let totalRate = 0
        linesTree.forEach( data => { totalRate += SLOTS_LINES_DATA[data.key].rates[data.count] })
        topWin.forEach( data => { totalRate += SLOTS_LINES_DATA[data.key].rates[data.count] })
        midWin.forEach( data => { totalRate += SLOTS_LINES_DATA[data.key].rates[data.count] })
        botWin.forEach( data => { totalRate += SLOTS_LINES_DATA[data.key].rates[data.count] })

        resultSlots(totalRate * bonuses)

        // test
        console.log('BONUS x', bonuses)
        console.log('top', topWin)
        console.log('mid', midWin)
        console.log('bot', botWin)
        console.log('3х:', linesTree)
        console.log('-------------')        
    }
    checkLongLine(line) {
        const combinations = []
        let usedPositions = new Set()
        
        // Ищем все возможные комбинации
        for (let start = 0; start < line.length; start++) {
            if (usedPositions.has(start)) continue
            
            let currentSymbol = null
            let count = 0
            const positions = []
            
            for (let i = start; i < line.length; i++) {
                const symbol = line[i]
                
                if (currentSymbol === null && symbol !== SLOTS.wild) {
                    currentSymbol = symbol
                    count = 1
                    positions.push(i)
                    usedPositions.add(i)
                }
                else if (currentSymbol !== null && (symbol === currentSymbol || symbol === SLOTS.wild)) {
                    count++
                    positions.push(i)
                    usedPositions.add(i)
                }
                else {
                    break
                }
            }
            
            if (count >= 3 && currentSymbol) {
                combinations.push({
                    key: currentSymbol,
                    count: count,
                    positions: positions // опционально, если нужны позиции
                })
            }
        }
        
        return combinations
    }
    checkLineThree(line) {
        let targetSymbol = null
        
        // Определяем целевой символ (первый не-wild)
        for (let symbol of line) {
            if (symbol !== SLOTS.wild) {
                targetSymbol = symbol
                break
            }
        }
        
        // Если все wild, то targetSymbol остается null
        
        // Проверяем, все ли символы подходят под targetSymbol (или wild)
        for (let symbol of line) {
            if (symbol !== SLOTS.wild && symbol !== targetSymbol) {
                return null // Найден чужой символ - не совпадает
            }
        }
        
        // Если дошли сюда - все 3 символа совпадают
        return {
            key: targetSymbol || SLOTS.wild, // если все wild, то key = 'wild'
            count: 3
        }
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