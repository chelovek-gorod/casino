import { EventEmitter } from "pixi.js"

export const EventHub = new EventEmitter()

export const events = {
    screenResize: 'screenResize',
    changeFocus: 'changeFocus',

    setHelpText: 'setHelpText',

    updateMoney: 'updateMoney',
    updateBet: 'updateBet',
    updateBetTotal: 'updateBetTotal',
    updateNearestNumber: 'updateNearestNumber',

    startSpin: 'startSpin',
    addLog: 'addLog',
    showMessage: 'showMessage',

    showPopup: 'showPopup',
}

export function screenResize( data ) {
    EventHub.emit( events.screenResize, data )
}
export function changeFocus( isOnFocus ) {
    EventHub.emit( events.changeFocus, isOnFocus )
}

export function setHelpText( text ) {
    EventHub.emit( events.setHelpText, text )
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