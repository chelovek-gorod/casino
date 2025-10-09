import { Container, Sprite } from "pixi.js";
import { atlases, images } from "../../../app/assets";
import { EventHub, events, showPopup } from "../../../app/events";
import { setCursorPointer } from "../../../utils/functions";
import { CHIP_DATA, FIELD, GAME_CONTAINERS, SECTOR, SECTOR_NUMBERS, SPIEL, UI } from "../../constants";
import { betCurrent, setBet } from "../../state";

const FIELD_TYPE = { spiel: 'spiel', field: 'field' }

function getChopSprite() {
    if (betCurrent < 5) return new Sprite(atlases.chip.textures.c1)
    if (betCurrent < 10) return new Sprite(atlases.chip.textures.c5)
    if (betCurrent < 25) return new Sprite(atlases.chip.textures.c10)
    if (betCurrent < 50) return new Sprite(atlases.chip.textures.c25)
    if (betCurrent < 100) return new Sprite(atlases.chip.textures.c50)
    if (betCurrent < 500) return new Sprite(atlases.chip.textures.c100)
    if (betCurrent < 1000) return new Sprite(atlases.chip.textures.c500)
    if (betCurrent < 5000) return new Sprite(atlases.chip.textures.c1000)
    return new Sprite(atlases.chip.textures.c5000)
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

        this.clickDuration = 0
        this.clickTarget = null
        this.clickIsActive = false

        this.dolly = new Sprite(images.dolly)
        this.dolly.scale.set(0.7)
        this.dolly.anchor.set(0.5)

        EventHub.on(events.startSpin, this.startSpin, this)
        EventHub.on(events.addLog, this.getSpinResult, this)
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
        setCursorPointer(point)
        point.on('pointerdown', this.onClick, this)
        point.on('pointerup', this.onRelease, this)
        point.on('pointerover', this.onHover, this)
        point.on('pointerout', this.onOut, this)
        this.field.addChild(point)
    }

    userSetBet() {
        if (!setBet()) return

        const chipImage = getChopSprite()
        chipImage.anchor.set(0.5)
        chipImage.scale.set(CHIP_DATA.scale)

        if (this.clickTarget.field === FIELD_TYPE.spiel) {
            this.spiel.addChild(chipImage)
            chipImage.position.set(this.clickTarget.position.x, this.clickTarget.position.y)
        } else {
            this.field.addChild(chipImage)
            if (this.clickTarget.numbers.length === 1) {
                chipImage.position.set(this.clickTarget.position.x - 8, this.clickTarget.position.y - 18)
            } else {
                chipImage.position.set(this.clickTarget.position.x, this.clickTarget.position.y)
            }
        }
    }

    startSpin() {
        this.field.removeChild(this.dolly)
    }

    getSpinResult(number) {
        const x = this.slotsList[number].position.x
        const y = this.slotsList[number].position.y
        this.dolly.position.set(x + 10, y + 20)
        this.field.addChild(this.dolly)
    }

    onClick(event) {
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
            return showPopup()
        }

        this.clickTarget = event.target
        this.userSetBet()
    }
    onHover(event) {
        if(this.clickIsActive) {
            this.clickDuration = Date.now()
            this.clickTarget = event.target
        }

        if ('isPoint' in event.target === false) event.target.alpha = 0.5
        if (event.target.title === SECTOR.vois) this.sectorsList[SECTOR.zero].alpha = 0.5
        event.target.numbers.forEach( n => {
            this.sectorsList[n].alpha = 0.5
            this.slotsList[n].alpha = 0.5
        })
    }
    onOut(event) {
        if ('isPoint' in event.target === false) event.target.alpha = 0
        if (event.target.title === SECTOR.vois) this.sectorsList[SECTOR.zero].alpha = 0
        event.target.numbers.forEach( n => {
            this.sectorsList[n].alpha = 0
            this.slotsList[n].alpha = 0
        })
    }

    kill() {
        EventHub.off(events.startSpin, this.startSpin, this)
        EventHub.off(events.addLog, this.getSpinResult, this)

        while(this.children.length) {
            if ('kill' in this.children[0]) this.children[0].kill()
            else this.children[0].destroy()
        }
        this.destroy()
    }
}