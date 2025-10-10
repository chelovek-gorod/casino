import { Container, Sprite } from "pixi.js";
import { atlases, images } from "../../../app/assets";
import { EventHub, events, setHelpText } from "../../../app/events";
import { setCursorPointer } from "../../../utils/functions";
import { BET_RATIO, CHIP_DATA, FIELD, GAME_CONTAINERS, HELP_TEXT, MAX_BET_RATIO, NUMBERS, SECTOR, SECTOR_NUMBERS, SECTOR_SPLIT_NUMBERS, SPIEL, UI } from "../../constants";
import { addBetData, betCurrent, betNearest, editBetData, getBetDataValue, isLangRu, isOnSpin, isSingleBetsInSectors, setBet } from "../../state";

const FIELD_TYPE = { spiel: 'spiel', field: 'field' }

function getChipTexture(bet = betCurrent) {
    if (bet < 5) return atlases.chip.textures.c1
    if (bet < 10) return atlases.chip.textures.c5
    if (bet < 25) return atlases.chip.textures.c10
    if (bet < 50) return atlases.chip.textures.c25
    if (bet < 100) return atlases.chip.textures.c50
    if (bet < 500) return atlases.chip.textures.c100
    if (bet < 1000) return atlases.chip.textures.c500
    if (bet < 5000) return atlases.chip.textures.c1000
    return atlases.chip.textures.c5000
}

function getNearest(number) {
    const index = NUMBERS.indexOf(number)
    const result = []
    
    for (let i = -betNearest; i <= betNearest; i++) {
        let newIndex = (index + i + NUMBERS.length) % NUMBERS.length
        result.push(NUMBERS[newIndex])
    }
    
    return result
}

export default class Field extends Container {
    constructor() {
        super()

        // SPIEL
        this.spiel = new Container()
        this.spiel.position.set(
            GAME_CONTAINERS.field.pointSpiel.x, GAME_CONTAINERS.field.pointSpiel.y
        )
        this.addChild(this.spiel)

        this.spielBg = new Sprite(images.spiel_bg)
        this.spiel.addChild(this.spielBg)

        this.sectorsList = {}
        Object.keys(SPIEL.sectors).forEach( sector => {
            this.sectorsList[sector] = new Sprite(atlases.spiel_light.textures[sector])
            this.sectorsList[sector].anchor.set(0.5)
            this.sectorsList[sector].position.set(SPIEL.sectors[sector].x, SPIEL.sectors[sector].y)
            this.sectorsList[sector].numbers = SECTOR_NUMBERS[sector]
            this.sectorsList[sector].splitData = {
                arr: [],
                points: [],
                numbers: []
            }
            SECTOR_SPLIT_NUMBERS[sector].forEach( split => {
                if (split.length > 1) this.sectorsList[sector].splitData.arr.push(split)
                else this.sectorsList[sector].splitData.numbers.push(split[0])
            })
        })
        SPIEL.numbers.forEach( (numberData, index) => {
            this.sectorsList[index] = new Sprite(atlases.spiel_light.textures[index])
            this.sectorsList[index].anchor.set(0.5)
            this.sectorsList[index].position.set(numberData.x, numberData.y)
            this.sectorsList[index].numbers = [index]
            this.sectorsList[index].isPoint = true
        })
        Object.keys(this.sectorsList).forEach( key => {
            this.sectorsList[key].alpha = 0
            this.sectorsList[key].title = key
            this.sectorsList[key].field = FIELD_TYPE.spiel
            setCursorPointer(this.sectorsList[key])
            this.sectorsList[key].on('pointerdown', this.onClick, this)
            this.sectorsList[key].on('pointerup', this.onRelease, this)
            this.sectorsList[key].on('pointerover', this.onHover, this)
            this.sectorsList[key].on('pointerout', this.onOut, this)
            this.spiel.addChild(this.sectorsList[key])
        })

        this.spielTop = new Sprite(images.spiel_top)
        this.spiel.addChild(this.spielTop)

        // FIELD

        this.field = new Container()
        this.field.position.set(
            GAME_CONTAINERS.field.pointField.x, GAME_CONTAINERS.field.pointField.y
        )
        this.addChild(this.field)

        const fieldOffsetY = 0

        this.slotsList = {}
        FIELD.ceils.numbers.forEach( (data, index) => {
            this.slotsList[index] = new Sprite(atlases.field_light.textures[index])
            this.slotsList[index].anchor.set(0.5)
            this.slotsList[index].position.set(data.centerX, data.centerY + fieldOffsetY)
            this.slotsList[index].numbers = [index]
            this.slotsList[index].isPoint = true
        })
        Object.keys(FIELD.ceils.sections).forEach( section => {
            this.slotsList[section] = new Sprite(atlases.field_light.textures[section])
            this.slotsList[section].anchor.set(0.5)
            this.slotsList[section].position.set(
                FIELD.ceils.sections[section].centerX,
                FIELD.ceils.sections[section].centerY + fieldOffsetY
            )
            this.slotsList[section].numbers = SECTOR_NUMBERS[section]
        })
        Object.keys(this.slotsList).forEach( key => {
            this.slotsList[key].alpha = 0
            this.slotsList[key].title = key
            this.slotsList[key].field = FIELD_TYPE.field
            this.slotsList[key].chip = null
            setCursorPointer(this.slotsList[key])
            this.slotsList[key].on('pointerdown', this.onClick, this)
            this.slotsList[key].on('pointerup', this.onRelease, this)
            this.slotsList[key].on('pointerover', this.onHover, this)
            this.slotsList[key].on('pointerout', this.onOut, this)
            this.field.addChild(this.slotsList[key])
        })

        this.fieldTop = new Sprite(images.field)
        this.fieldTop.position.set(0, fieldOffsetY)
        this.field.addChild(this.fieldTop)

        this.pointsList = []

        // cross points lights
        let cpl_x = 42
        let cpl_y = fieldOffsetY + 2
        const step_x = 40
        const step_y = 50
        for(let row = 0; row < 3; row++) {
            if (row > 0) {
                for(let top = 0; top < 24; top++) {
                    cpl_x += step_x
                    this.addPoint(cpl_x, cpl_y, row, top, 0)
                }
            }
            
            cpl_x = 2
            cpl_y += step_y
            for(let mid = 0; mid < 12; mid++) {
                cpl_x += step_x + step_x
                this.addPoint(cpl_x, cpl_y, row, mid, 1)
            }

            cpl_x = 42
            cpl_y += step_y

            if (row === 2) {
                for(let bot = 0; bot < 25; bot++) {
                    cpl_x += step_x
                    this.addPoint(cpl_x, cpl_y, row, bot, 3)
                }
            }
        }

        Object.keys(SECTOR_SPLIT_NUMBERS).forEach( key => {
            delete this.sectorsList[key].splitData.arr
        })

        this.clickDuration = 0
        this.clickTarget = null
        this.clickIsActive = false

        this.dolly = new Sprite(images.dolly)
        this.dolly.scale.set(0.7)
        this.dolly.anchor.set(0.5)

        EventHub.on(events.startSpin, this.startSpin, this)
        EventHub.on(events.addLog, this.getSpinResult, this)
        EventHub.on(events.clearedOneOfBets, this.clearedOneOfBets, this)
    }

    addPoint(x, y, rowIndex, stepIndex, layer) {
        const point = new Sprite(images.point)
        point.anchor.set(0.5)
        point.position.set(x, y)
        point.alpha = 0.01
        point.numbers = layer === 0
            ? FIELD.points.top[rowIndex][stepIndex]
            : layer === 1
            ? FIELD.points.mid[rowIndex][stepIndex]
            : FIELD.points.bot[stepIndex]
        point.isPoint = true
        switch(point.numbers.length) {
            case 2 : point.title = 'pair'; break
            case 3 : point.title = 'street'; break
            case 4 : point.title = 'corner'; break
            case 6 : point.title = 'six line'; break
            default: ''
        }
        this.checkPointSpielSplits(point)
        setCursorPointer(point)
        point.on('pointerdown', this.onClick, this)
        point.on('pointerup', this.onRelease, this)
        point.on('pointerover', this.onHover, this)
        point.on('pointerout', this.onOut, this)
        this.pointsList.push(point)
        this.field.addChild(point)
    }

    checkPointSpielSplits(point) {
        Object.keys(SECTOR_SPLIT_NUMBERS).forEach( key => {
            this.sectorsList[key].splitData.arr.forEach( splitArr => {
                if (point.numbers.length !== splitArr.length) return

                const sortedSplit = [...splitArr].sort()
                const sortedPoint = [...point.numbers].sort()

                if (sortedSplit.every((val, i) => val === sortedPoint[i])) {
                    this.sectorsList[key].splitData.points.push(point)
                }
            })
        })
    }

    userSetBet() {
        // bet in spiel
        if (this.clickTarget.field === FIELD_TYPE.spiel) {

            // nearest
            if (this.clickTarget.numbers.length === 1) {

                const nearestList = getNearest(this.clickTarget.numbers[0])
                if (!setBet(nearestList)) return

                nearestList.forEach( n => {
                    this.setBetInField(this.slotsList[n])
                    addBetData([n])
                })

            // sector
            } else {

                if (isSingleBetsInSectors) {
                    if (!setBet(this.clickTarget.numbers)) return

                    this.clickTarget.numbers.forEach( n => {
                        this.setBetInField(this.slotsList[n])
                        addBetData([+n])
                    })
                } else {
                    if (!setBet(
                        this.clickTarget.splitData.numbers, this.clickTarget.splitData.points.numbers
                    )) return

                    this.clickTarget.splitData.numbers.forEach( n => {
                        this.setBetInField(this.slotsList[n])
                        addBetData([+n])
                    })
                    this.clickTarget.splitData.points.forEach( point => {
                        this.setBetInField(point)
                        addBetData(point.numbers)
                    })
                }

            }

        // bet in field
        } else {
            if (!setBet([], [this.clickTarget.numbers])) return

            this.setBetInField( this.clickTarget )
            addBetData(this.clickTarget.numbers)
        }

        if (this.clickTarget.chip) {
            const betValue = getBetDataValue(this.clickTarget.numbers)
            const maxBet = MAX_BET_RATIO[this.clickTarget.numbers.length]
            setHelpText({
                ru: `${HELP_TEXT.betOnHoverBet.ru} ${betValue}. ${HELP_TEXT.betOnHoverMax.ru} ${maxBet}.`,
                en: `${HELP_TEXT.betOnHoverBet.en} ${betValue}. ${HELP_TEXT.betOnHoverMax.en} ${maxBet}.`
            })
        }
    }
    setBetInField(betData) {
        if (betData.chip) {
            const previousBet = getBetDataValue(betData.numbers)
            betData.chip.texture = getChipTexture(previousBet + betCurrent)
        } else {
            betData.chip = new Sprite( getChipTexture() )
            betData.chip.anchor.set(0.5)
            betData.chip.scale.set(CHIP_DATA.scale)
            this.field.addChild(betData.chip)
        }

        if (betData.numbers.length === 1) {
            betData.chip.position.set(betData.position.x - 8, betData.position.y - 18)
        } else {
            betData.chip.position.set(betData.position.x, betData.position.y)
        }
    }

    startSpin() {
        this.field.removeChild(this.dolly)
        this.clickIsActive = false
        this.clickDuration = 0
    }

    getSpinResult(number) {
        const x = this.slotsList[number].position.x
        const y = this.slotsList[number].position.y
        this.dolly.position.set(x + 10, y + 20)
        this.field.addChild(this.dolly)
    }

    highlightOn(target) {
        if ('isPoint' in target === false) target.alpha = 0.5
        if (target.title === SECTOR.vois) this.sectorsList[SECTOR.zero].alpha = 0.5
        if (target.field === FIELD_TYPE.spiel && target.numbers.length === 1) {
            const numbers = getNearest(target.numbers[0])
            numbers.forEach( n => {
                this.sectorsList[n].alpha = 0.5
                this.slotsList[n].alpha = 0.5
            })
            return
        }

        target.numbers.forEach( n => {
            this.sectorsList[n].alpha = 0.5
            this.slotsList[n].alpha = 0.5
        })
    }
    highlightOff(target) {
        if ('isPoint' in target === false) target.alpha = 0
        if (target.title === SECTOR.vois) this.sectorsList[SECTOR.zero].alpha = 0
        if (target.field === FIELD_TYPE.spiel && target.numbers.length === 1) {
            const numbers = getNearest(target.numbers[0])
            numbers.forEach( n => {
                this.sectorsList[n].alpha = 0
                this.slotsList[n].alpha = 0
            })
            return
        }
        target.numbers.forEach( n => {
            this.sectorsList[n].alpha = 0
            this.slotsList[n].alpha = 0
        })
    }

    onClick(event) {
        if (isOnSpin) return

        console.log(
            '\ntitle:', event.target.title,
            '\nnumbers:', event.target.numbers,
            '\ntype:', event.target.field,
            '\npos:', event.target.position,
            '\nisRightBtnClick', event.data.button == 2
        )

        this.clickDuration = Date.now()
        this.clickTarget = event.target
        this.clickIsActive = true
    }
    onRelease(event) {
        if (isOnSpin) return

        this.clickIsActive = false
        if (this.clickDuration === 0) return

        const dt = Date.now() - this.clickDuration
        this.clickDuration = 0
        if(dt >= UI.contextOpenMinDuration) {
            console.log(
                'POPUP DATA:',
                '\ntitle:', event.target.title,
                '\nnumbers:', event.target.numbers,
                '\ntype:', event.target.field
            )

            // disable to set and edit bets in spiel field !!!
            if (event.target.field === FIELD_TYPE.spiel) return

            return editBetData(event.target.numbers)
        }

        this.clickTarget = event.target
        this.userSetBet()
    }
    onHover(event) {
        if (isOnSpin) return

        if (event.target.chip) {
            const betValue = getBetDataValue(event.target.numbers)
            const maxBet = MAX_BET_RATIO[event.target.numbers.length]
            setHelpText({
                ru: `${HELP_TEXT.betOnHoverBet.ru} ${betValue}. ${HELP_TEXT.betOnHoverMax.ru} ${maxBet}.`,
                en: `${HELP_TEXT.betOnHoverBet.en} ${betValue}. ${HELP_TEXT.betOnHoverMax.en} ${maxBet}.`
            })
        } else if (event.target.field === FIELD_TYPE.field || event.target.isPoint) {
            const rateSize = BET_RATIO[event.target.numbers.length]
            const maxBet = MAX_BET_RATIO[event.target.numbers.length]
            setHelpText({
                ru: `${HELP_TEXT.betOnHoverRate.ru} 1:${rateSize}. ${HELP_TEXT.betOnHoverMax.ru} ${maxBet}.`,
                en: `${HELP_TEXT.betOnHoverRate.ru} 1:${rateSize}. ${HELP_TEXT.betOnHoverMax.en} ${maxBet}.`
            })
        }
        
        if(this.clickIsActive) {
            this.clickDuration = Date.now()
            this.clickTarget = event.target
        }

        this.highlightOn(event.target)
    }
    onOut(event) {
        if (isOnSpin) return

        this.highlightOff(event.target)

        setHelpText()
    }

    clearedOneOfBets() { console.log('CLEAR')
        Object.keys(this.slotsList).forEach( key => {
            if (this.slotsList[key].chip) {
                if (getBetDataValue(this.slotsList[key].numbers) === 0) {
                    this.slotsList[key].chip.destroy()
                    this.slotsList[key].chip = null
                }
            }
        })
        this.pointsList.forEach( point => {
            if (point.chip && getBetDataValue(point.numbers) === 0) {
                point.chip.destroy()
                point.chip = null
            }
        })
    }

    kill() {
        EventHub.off(events.startSpin, this.startSpin, this)
        EventHub.off(events.addLog, this.getSpinResult, this)
        EventHub.on(events.clearedOneOfBets, this.clearedOneOfBets, this)

        while(this.children.length) {
            if ('kill' in this.children[0]) this.children[0].kill()
            else this.children[0].destroy()
        }
        this.destroy()
    }
}