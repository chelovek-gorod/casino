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

const FRUITS = 6 // 12 types
//          x0 x1 x2  x3  x4  x5
const LOW_WIN_RATE = [0, 0, 0,  5,  10,  25] // частые
const MID_WIN_RATE = [0, 0, 0, 10,  25, 100] // редкие
const MAX_WIN_RATE = [0, 0, 0, 25, 100, 500] // супер редкие

const SET = {images: [SLOTS.cards, SLOTS.dices, SLOTS.chips], rate: 25}
const JACKPOT = {countsOf7: {[SLOTS.seven]: 1, [SLOTS.jackpot]: 3}, rate7x7: 1000}

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

    [SLOTS.dices]: {count: 3, rates: MID_WIN_RATE, extra: SET.rate},
    [SLOTS.cards]: {count: 3, rates: MID_WIN_RATE, extra: SET.rate},
    [SLOTS.chips]: {count: 3, rates: MID_WIN_RATE, extra: SET.rate},

    [SLOTS.crystal]: {count: 1, rates: MAX_WIN_RATE},

    [SLOTS.seven]: {count: 3, rates: MID_WIN_RATE, extra: JACKPOT.rate7x7},
    [SLOTS.jackpot]: {count: 1, rates: MAX_WIN_RATE, extra: JACKPOT.rate7x7},

    [SLOTS.gold]: {count: 2, rates: MID_WIN_RATE},
    [SLOTS.coin]: {count: 6, rates: LOW_WIN_RATE},

    [SLOTS.clover]: {count: 1, rates: LOW_WIN_RATE},
    [SLOTS.present]: {count: 1, rates: MID_WIN_RATE},

    [SLOTS.wild]: {count: 2, rates: LOW_WIN_RATE},
    [SLOTS.bonus]: {count: 2, rates: MID_WIN_RATE}, // выигрыш X
}

let imagesInLine = 0
for (let key in SLOTS_LINES_DATA) {
    imagesInLine += SLOTS_LINES_DATA[key].count
}
console.log('imagesInLine:', imagesInLine)

////////////////////////////////////////////////

// расчет факториала с мемоизацией
// factorialMemo(5) -> вернет 120
const factorialMemo = (() => {
    const cache = [1] // 0! = 1
  
    function fact(n) {
        if (n < cache.length) return cache[n]

        let last = cache[cache.length - 1]
        for (let i = cache.length; i <= n; i++) {
            const next = last * i
            if (!Number.isSafeInteger(next)) {
                throw new Error(`Number exceeds MAX_SAFE_INTEGER at n=${i}`)
            }
            
            cache.push(next)
            last = next
        }

        return cache[n]
    }
  
    // factorialMemo.clearCache() -> очистка кэша
    fact.clearCache = () => {
        cache.length = 1 // оставляем только 0! = 1
    }
  
    return fact
})()

// ----- сочетания (n choose k) -----
function nCk(N, k) {
    if (k === 0) return 1

    let numerator = 1
    for (let i = 0; i < k; i++) {
        numerator *= (N - i) // N * (N-1) * ... * (N-k+1)
    }
    const denom = factorialMemo(k)
    return numerator / denom
}

// расчет вероятности выпадения в любой позиции
function countChanceInAnyPositions(lineSize, unitsInLine) {
    // lineSize - число всех элементов в линии
    // unitsInLine - число искомых элементов в линии
    const lines = 5
    const visibleUnitsInLine = 3

    const maxTotal = lines * visibleUnitsInLine

    // вероятность выпадения t символов на одном барабане
    const P_oneReel = []
    for (let t = 0; t <= visibleUnitsInLine; t++) {
        const numerator = nCk(unitsInLine, t) * nCk(lineSize - unitsInLine, visibleUnitsInLine - t)
        const denom = nCk(lineSize, visibleUnitsInLine)
        P_oneReel[t] = numerator / denom
    }

    // массив вероятностей для суммарного числа на всех барабанах
    // dp[i][k] = вероятность, что после i барабанов сумма = k
    let dp = new Array(maxTotal + 1).fill(0)
    dp[0] = 1 // начальное состояние, 0 барабанов → 0 символов

    for (let reel = 0; reel < lines; reel++) {
        const next = new Array(maxTotal + 1).fill(0)
        for (let sum = 0; sum <= maxTotal; sum++) {
            if (dp[sum] === 0) continue
            for (let t = 0; t <= visibleUnitsInLine; t++) {
                if (sum + t <= maxTotal) {
                    next[sum + t] += dp[sum] * P_oneReel[t]
                }
            }
        }
        dp = next
    }

    // Вывод в процентах с округлением до 6 знаков
    for (let k = 0; k <= maxTotal; k++) {
        const percent = (dp[k] * 100).toFixed(6)
        console.log(`${k}: ${percent}%`)
    }

    // Дополнительно: вероятность хотя бы одного символа
    const atLeastOne = 1 - dp[0]
    console.log(`\nХотя бы один: ${(atLeastOne * 100).toFixed(6)} %`)
}

//////////////////////////////////////////////////////////////////

// РАСЧЕТ ВЕРОЯТНОСТЕЙ БЕЗ [WILD] по линиям и диагоналям
// если нужен [WILD] - то добавляем их число к unitsInLine 
function calculateExactSequenceProbability(lineSize, unitsInLine) {
    const p = unitsInLine / lineSize
    const q = 1 - p
    
    const expectedSequences = {
        2: 48 * p * p * q,
        3: 36 * p * p * p * q, 
        4: 24 * Math.pow(p, 4) * q,
        5: 12 * Math.pow(p, 5)
    };
    
    const probabilityAtLeastOne = {}
    for (let length in expectedSequences) {
        probabilityAtLeastOne[length] = 1 - Math.exp(-expectedSequences[length])
    }
    
    const results = {
        expectedSequences,
        probabilityAtLeastOne,
        percent: Object.fromEntries(
            Object.entries(probabilityAtLeastOne).map(([k, v]) => [k, v * 100])
        )
    }
    
    console.log(`Примерная вероятность последовательности в сетке 5х3:`)
    // console.log(`2: ${results.percent[2].toFixed(6)} %`)
    console.log(`3: ${results.percent[3].toFixed(6)} %`)
    console.log(`4: ${results.percent[4].toFixed(6)} %`)  
    console.log(`5: ${results.percent[5].toFixed(6)} %`)
    console.log('---')   
}

///////////////////////////////////////////////////////////////////
function calculateSequencesProbabilities(lineSize, unitsInLine) {
    const totalLines = { horizontal: 5, diagonal: 6 }

    const p = unitsInLine / lineSize // вероятность выпадения искомого символа или WILD
    const q = 1 - p

    const results = { 3: 0, 4: 0, 5: 0 }

    // Горизонтальные линии (длина 5)
    for (let k = 3; k <= 5; k++) {
        const numPositions = 5 - k + 1 // сколько подряд символов длиной k на горизонтали
        results[k] += totalLines.horizontal * numPositions * Math.pow(p, k) * Math.pow(q, 5 - k)
    }

    // Диагональные линии (длина 3)
    for (let k = 3; k <= 3; k++) { // для диагоналей больше 3 нельзя
        const numPositions = 3 - k + 1 // 3 - 3 + 1 = 1
        results[k] += totalLines.diagonal * numPositions * Math.pow(p, k) * Math.pow(q, 3 - k)
    }

    // Переводим в проценты
    for (let k in results) results[k] = (results[k] * 100).toFixed(6) + ' %'

    console.log(`Точная вероятность последовательности в сетке 5х3:`)
    console.log(`3: ${results[3]}`)
    console.log(`4: ${results[4]}`)
    console.log(`5: ${results[5]}`)
    console.log('---')  
}

///////////////////////////////////////////////////////////////////

// РАСЧЕТЫ И ЛОГИ ВЕРОЯТНОСТЕЙ

const wilds = SLOTS_LINES_DATA[SLOTS.wild].count
const double = [
    'cards', 'chips',

    'avocado', 'banana', 'blackberry', 'blueberry', 'cherry', 'grape',
    'lemon', 'melon', 'orange', 'plum', 'strawberry'
]
for (let key in SLOTS_LINES_DATA) {
    const unitCount = SLOTS_LINES_DATA[key].count
    if (unitCount > 0 && double.includes(key) === false ) {

        console.log(`\n${key}`)
        calculateExactSequenceProbability(imagesInLine, unitCount + wilds)
        calculateSequencesProbabilities(imagesInLine, unitCount + wilds)
        let count = 0
        if (key === SLOTS.dices) {
            count = SLOTS_LINES_DATA[SLOTS.dices].count
                + SLOTS_LINES_DATA[SLOTS.cards].count
                + SLOTS_LINES_DATA[SLOTS.chips].count
            console.log('dices + cards + chips')
            countChanceInAnyPositions(imagesInLine, count)
            console.log('one type of set (dices || cards || chips)')
            countChanceInAnyPositions(imagesInLine, SLOTS_LINES_DATA[key].count)
        }
        if (key === SLOTS.jackpot) {
            count = SLOTS_LINES_DATA[SLOTS.jackpot].count
                + SLOTS_LINES_DATA[SLOTS.seven].count
            console.log('7 + 777')
            countChanceInAnyPositions(imagesInLine, count)
            console.log('777')
            countChanceInAnyPositions(imagesInLine, SLOTS_LINES_DATA[SLOTS.jackpot].count)
        }
        if (key === SLOTS.seven || key === SLOTS.clover || key === SLOTS.gold || key === SLOTS.coin
        || key === SLOTS.wild || key === SLOTS.present || key === SLOTS.bonus) {
            countChanceInAnyPositions(imagesInLine, SLOTS_LINES_DATA[key].count)
        }
    }
}
