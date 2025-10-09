import { addLog, startSpin, updateBet, updateBetTotal, updateMoney, updateNearestNumber,
    showMessage, showPopup, clearedOneOfBets} from "../app/events"
import { formatNumber } from "../utils/functions"
import { MESSAGE_TEXT, BET_RATIO, MESSAGE } from "./constants"

export let isLangRu = true

export let isOnSpin = false
export let isSingleBetsInSectors = false
export let money = 1000
export let betsTotal = 0
export let betCurrent = 10
export let betNearest = 2
export let results = []

const betsData = {
    // key = "n1_n2_n3..."
    // value = money
}
// for edit bet in popup
export let editedBetInfo = {
    key: '',
    value: 0
}

export function setBet(betCount = 1) {
    if (isOnSpin) return false
    if (money < (betCurrent * betCount)) {
        showMessage( isLangRu ? MESSAGE_TEXT.lowMoney.ru : MESSAGE_TEXT.lowMoney.en )
        return false
    }

    money -= betCurrent * betCount
    betsTotal += betCurrent * betCount

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

export function changeSpielSplits() {
    isSingleBetsInSectors = !isSingleBetsInSectors
    return isSingleBetsInSectors
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

    let winMoney = 0
    const numberStr = number.toString();
    
    Object.entries(betsData).forEach(([key, betAmount]) => {
        // Быстрая проверка через includes строки (дешевле чем split+map)
        if (key.includes(numberStr)) {
            const numbers = key.split('_').map(Number);
            // Двойная проверка (на случай частичных совпадений типа "13" и "3")
            if (numbers.includes(number)) winMoney += betAmount * BET_RATIO[numbers.length]
        }
    })

    if (winMoney) {
        const message = isLangRu ? MESSAGE_TEXT.winMoney.ru : MESSAGE_TEXT.winMoney.en
        const delay = MESSAGE.inOutDuration * 3 + MESSAGE.showDuration
        setTimeout( showMessage, delay ,`${message} ${formatNumber(winMoney)} !` )
        addMoney( winMoney )
    }

    for (const key in betsData) delete betsData[key]
    clearedOneOfBets() // временное событие
}

export function addBetData(numbers) {
    const key = [...numbers].sort((a, b) => a - b).join('_')
    if (key in betsData) betsData[key] += betCurrent
    else betsData[key] = betCurrent

    console.log(betsData)
}

export function getBetDataValue(numbers) {
    const key = [...numbers].sort((a, b) => a - b).join('_')
    if ( !(key in betsData) ) return 0

    return betsData[key]
}

export function editBetData(numbers) {
    editedBetInfo.key = [...numbers].sort((a, b) => a - b).join('_')
    if ( !(editedBetInfo.key in betsData) ) return

    // временно удаляем ставки вместо настроек
    addMoney( betsData[editedBetInfo.key] )
    delete betsData[editedBetInfo.key]
    clearedOneOfBets()
    return // это временный return

    editedBetInfo.value = betsData[editedBetInfo.key]
    showPopup() // popup use updateValueInEditedBet(value)
}

export function updateValueInEditedBet(value) {
    // !!! ПРОВЕРИТЬ хватит ли money если value увеличился
    // обновить спрайт фишки в зависимости от нового значения или удалить, если ставка снята
}