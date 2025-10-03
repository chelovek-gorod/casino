import { EventEmitter } from "pixi.js"

export const EventHub = new EventEmitter()

export const events = {
    screenResize: 'screenResize',
    changeFocus: 'changeFocus',

    updateMoney: 'updateMoney',
    updateBetaTotal: 'updateBetaTotal',
}

export function screenResize( data ) {
    EventHub.emit( events.screenResize, data )
}
export function changeFocus( isOnFocus ) {
    EventHub.emit( events.changeFocus, isOnFocus )
}

export function updateMoney( money ) {
    EventHub.emit( events.updateMoney, money )
}
export function updateBetaTotal( total ) {
    EventHub.emit( events.updateBetaTotal, total )
}