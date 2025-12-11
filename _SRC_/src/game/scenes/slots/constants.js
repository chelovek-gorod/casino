export const MAX_BET = 5000

export const SLOTS_BORDER = {
    width: 0,
    height: 0,
    x: -928,
    y: -440,
    offsetX: 204,
    offsetY: 80,
    offsetLine: 12,
}
SLOTS_BORDER.width = -SLOTS_BORDER.x * 2
SLOTS_BORDER.height = -SLOTS_BORDER.y * 2
export const SLOTS_LINES = {
    positionsX: [ SLOTS_BORDER.offsetX ],
    positionsY: [],
    slotWidth: 280,
    slotHeight: 240,
    slotHalfWidth: 0,
    slotHalfHeight: 0,
    acceleration: 0.005,
    minSpeed: 4.5,
    maxSpeed: 5.0,
    stopSpeed: 1,
    minTimeout: 100,
    maxTimeout: 150,
    delay: 0,
    durationMin: 1500,
    durationMax: 1650
}
SLOTS_LINES.delay = SLOTS_LINES.maxTimeout + SLOTS_LINES.durationMax - SLOTS_LINES.durationMin
SLOTS_LINES.slotHalfWidth = SLOTS_LINES.slotWidth * 0.5
SLOTS_LINES.slotHalfHeight = SLOTS_LINES.slotHeight * 0.5
for(let i = 1; i < 5; i++){
    const x = SLOTS_LINES.positionsX[i-1] + SLOTS_BORDER.offsetLine + SLOTS_LINES.slotWidth
    SLOTS_LINES.positionsX.push( x )
}
for(let i = 0; i < 4; i++){
    if (i === 0) SLOTS_LINES.positionsY.push( -SLOTS_LINES.slotHeight )
    else SLOTS_LINES.positionsY.push( SLOTS_LINES.positionsY[i-1] + SLOTS_LINES.slotHeight )
}

// slots keys
export const SLOTS = {
    apple: 'apple',
    avocado: 'avocado',
    banana: 'banana',
    blackberry: 'blackberry',
    blueberry: 'blueberry',
    cherry: 'cherry',
    grape: 'grape',
    lemon: 'lemon',
    melon: 'melon',
    orange: 'orange',
    plum: 'plum',
    strawberry: 'strawberry',

    cards: 'cards',
    dices: 'dices',
    chips: 'chips',

    seven: 'seven',
    jackpot: 'jackpot',

    crystal: 'crystal',

    clover: 'clover',
    gold: 'gold',
    coin: 'coin',

    bonus: 'bonus',
    wild: 'wild',
    present: 'present',
}

export const SLOTS_HIGHLIGHT = {
    duration: 150,
    inOut: 300,
    minAlpha: 0.2,
    minScale: 0.9,
    maxScale: 1.1,
    stepAlphaInMS: 0,
    stepScaleInMS: 0,
}
SLOTS_HIGHLIGHT.stepAlphaInMS = (1 - SLOTS_HIGHLIGHT.minAlpha) / SLOTS_HIGHLIGHT.inOut
SLOTS_HIGHLIGHT.stepScaleInMS = (SLOTS_HIGHLIGHT.maxScale - SLOTS_HIGHLIGHT.minScale) / SLOTS_HIGHLIGHT.inOut

const FRUITS = 12 // 12 types
//                    x0 x1 x2  x3  x4  x5
const LOW_WIN_RATE = [0, 0, 0,  5, 10,  20] // частые
const MID_WIN_RATE = [0, 0, 0, 10, 20,  50] // редкие
const MAX_WIN_RATE = [0, 0, 0, 20, 50, 100] // супер редкие

const SET = {images: [SLOTS.cards, SLOTS.dices, SLOTS.chips], rate: 10}
const JACKPOT = {countsOf7: {[SLOTS.seven]: 1, [SLOTS.jackpot]: 3}, rate7x7: 100}

export const SLOTS_LINES_DATA = {
    [SLOTS.apple]: {count: FRUITS, rates: LOW_WIN_RATE},
    [SLOTS.avocado]: {count: FRUITS, rates: LOW_WIN_RATE},
    [SLOTS.banana]: {count: FRUITS, rates: LOW_WIN_RATE},
    [SLOTS.blackberry]: {count: FRUITS, rates: LOW_WIN_RATE},
    [SLOTS.blueberry]: {count: FRUITS, rates: LOW_WIN_RATE},
    [SLOTS.cherry]: {count: FRUITS, rates: LOW_WIN_RATE},
    [SLOTS.grape]: {count: FRUITS, rates: LOW_WIN_RATE},
    [SLOTS.lemon]: {count: FRUITS, rates: LOW_WIN_RATE},
    [SLOTS.melon]: {count: FRUITS, rates: LOW_WIN_RATE},
    [SLOTS.orange]: {count: FRUITS, rates: LOW_WIN_RATE},
    [SLOTS.plum]: {count: FRUITS, rates: LOW_WIN_RATE},
    [SLOTS.strawberry]: {count: FRUITS, rates: LOW_WIN_RATE},

    [SLOTS.dices]: {count: 4, rates: MID_WIN_RATE, extra: SET.rate},
    [SLOTS.cards]: {count: 4, rates: MID_WIN_RATE, extra: SET.rate},
    [SLOTS.chips]: {count: 4, rates: MID_WIN_RATE, extra: SET.rate},

    [SLOTS.crystal]: {count: 2, rates: MAX_WIN_RATE},

    [SLOTS.seven]: {count: 3, rates: MID_WIN_RATE, extra: JACKPOT.rate7x7},
    [SLOTS.jackpot]: {count: 1, rates: MAX_WIN_RATE, extra: JACKPOT.rate7x7},

    [SLOTS.gold]: {count: 3, rates: LOW_WIN_RATE},
    [SLOTS.coin]: {count: 9, rates: LOW_WIN_RATE},

    [SLOTS.clover]: {count: 1, rates: LOW_WIN_RATE},
    [SLOTS.present]: {count: 1, rates: LOW_WIN_RATE},

    [SLOTS.wild]: {count: 2, rates: LOW_WIN_RATE},
    [SLOTS.bonus]: {count: 2, rates: LOW_WIN_RATE}, // выигрыш X
}
/*
let imagesInLine = 0
for (let key in SLOTS_LINES_DATA) {
    imagesInLine += SLOTS_LINES_DATA[key].count
}
console.log('imagesInLine:', imagesInLine)
*/