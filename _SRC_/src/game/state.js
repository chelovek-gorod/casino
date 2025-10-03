import { updateBetaTotal, updateMoney } from "../app/events"

export let isOnSpin = false
export let money = 1000
export let betsTotal = 0
export let betCurrent = 50
export let results = [36, 0, 12, 29, 1, 0, 7, 24, 33, 28, 30, 27, 2, 34, 4, 0, 35, 26, 3, 5, 25, 0, 25, 11, 13]

export function setBet() {
    if (money < betCurrent || isOnSpin) return false

    money -= betCurrent
    betsTotal += betCurrent

    updateMoney(money)
    updateBetaTotal(betsTotal)

    return true
}

export function addMoney( sum ) {
    money += sum
    updateMoney(money)
}

export function setSpin( isSpin ) {
    isOnSpin = isSpin
}