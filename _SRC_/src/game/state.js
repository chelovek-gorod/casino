import { addLog, startSpin, updateBet, updateBetTotal, updateMoney, updateNearestNumber,
    showMessage } from "../app/events"

export let isLangRu = true

export let isOnSpin = false
export let money = 1000
export let betsTotal = 0
export let betCurrent = 10
export let betNearest = 2
export let results = []

export let betsData = {
    numbers: {}, // key = "number"
    splits: {},  // key = "n1_n2_n3..."
    sectors: {}, // key = "sector_name"
}

export function setBet() {
    if (money < betCurrent || isOnSpin) return false

    money -= betCurrent
    betsTotal += betCurrent

    updateMoney(money)
    updateBetTotal(betsTotal)

    return true
}

export function checkBet() {
    if (betCurrent > money) betCurrent = Math.max(1, money)
    updateBet(betCurrent)
}

export function editBet(value, isChip = false) {
    if (value === 0) {
        betCurrent = 1
        return checkBet()
    }

    if (!isChip) {
        betCurrent = Math.max(1, betCurrent + value)
        return checkBet()
    }

    if (betCurrent < value) {
        betCurrent = value
        return checkBet()
    }

    betCurrent += value
    checkBet()
}

export function setNearest( isAdd = true ) {
    if (isAdd) betNearest = Math.min(9, betNearest + 1)
    else betNearest = Math.max(1, betNearest - 1)
    updateNearestNumber(betNearest)
}

export function addMoney( sum ) {
    money += sum
    updateMoney(money)
}

export function setSpin( isSpin ) {
    isOnSpin = isSpin
    if (isSpin) startSpin()
}

export function setSpinResult( number ) {
    results.unshift(number)
    addLog(number)
    showMessage(number)
}