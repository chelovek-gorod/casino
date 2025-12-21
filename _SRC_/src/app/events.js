import { EventEmitter } from "pixi.js"

export const EventHub = new EventEmitter()

export const events = {
    screenResize: 'screenResize',
    changeFocus: 'changeFocus',

    startScene: 'startScene',

    setHelpText: 'setHelpText',
    setHelpTextValues: 'setHelpTextValues',

    updateLanguage: 'updateLanguage',

    updateMoney: 'updateMoney',
    updateBet: 'updateBet',
    updateBetTotal: 'updateBetTotal',
    updateNearestNumber: 'updateNearestNumber',

    updateRouletteSpinResults: 'updateRouletteSpinResults',

    startSpin: 'startSpin',
    addLog: 'addLog',
    showMessage: 'showMessage',

    showPopup: 'showPopup',

    clearOneBet: 'clearOneBet',
    clearAllBets: 'clearAllBets',

    updateRepeatBetsData: 'updateRepeatBetsData',
    repeatBetsForField: 'repeatBetsForField',
}

export function screenResize( data ) {
    EventHub.emit( events.screenResize, data )
}
export function changeFocus( isOnFocus ) {
    EventHub.emit( events.changeFocus, isOnFocus )
}

export function startScene( sceneName ) {
    EventHub.emit( events.startScene, sceneName )
}

export function setHelpText( text ) {
    EventHub.emit( events.setHelpText, text )
}
export function setHelpTextValues( textData ) {
    EventHub.emit( events.setHelpTextValues, textData )
}

export function updateLanguage( currentLanguage ) {
    EventHub.emit( events.updateLanguage, currentLanguage )
}

export function updateMoney( money ) {
    EventHub.emit( events.updateMoney, money )
}
export function updateBet( bet ) {
    EventHub.emit( events.updateBet, bet )
}
export function updateBetTotal( total ) {
    EventHub.emit( events.updateBetTotal, total )
}
export function updateNearestNumber( number ) {
    EventHub.emit( events.updateNearestNumber, number )
}

export function updateRouletteSpinResults(money) {
    EventHub.emit( events.updateRouletteSpinResults, money )
}

export function startSpin( ) {
    EventHub.emit( events.startSpin )
}
export function addLog( number ) {
    EventHub.emit( events.addLog, number )
}
export function showMessage(number) {
    EventHub.emit( events.showMessage, number )
}

export function showPopup( type ) {
    EventHub.emit( events.showPopup, type )
}

export function clearOneBet() {
    EventHub.emit( events.clearOneBet )
}
export function clearAllBets() {
    EventHub.emit( events.clearAllBets )
}

export function updateRepeatBetsData(data) {
    EventHub.emit( events.updateRepeatBetsData, data )
}
export function repeatBetsForField(data) {
    EventHub.emit( events.repeatBetsForField, data )
}