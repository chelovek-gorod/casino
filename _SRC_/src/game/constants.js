export const SCENE_ALPHA_STEP = 0.001

// main menu
export const MM_ALPHA_STEP = 0.0002
export const MM_FIRST_BUTTON_DELAY = 2400
export const MM_NEXT_BUTTON_DELAY = 300
export const MM_TITLE_DELAY = 600

// game
export const SECTOR = {
    zero: 'zero', vois: 'vois', orph: 'orph', tier: 'tier',
    even: 'even', odd: 'odd',
    red: 'red', black: 'black',
    at1to18: 'at1to18', at19to36: 'at19to36',
    twelve1: 'twelve1', twelve2: 'twelve2', twelve3: 'twelve3',
    top2to1: 'top2to1', mid2to1: 'mid2to1', bot2to1: 'bot2to1',
}

export const SECTOR_NAMES = {
    zero: {ru: 'Зеро', en: 'Zero'},
    vois: {ru: 'Соседи Зеро', en: 'Voisins du Zero'},
    orph: {ru: 'Сироты', en: 'Orphelins'},
    tier: {ru: 'Треть', en: 'Tiers du Cylindre'},
    even: {ru: 'Чётные', en: 'Even'},
    odd: {ru: 'Нечётные', en: 'Odd'},
    red: {ru: 'Красные', en: 'Red'},
    black: {ru: 'Чёрные', en: 'Black'},
    at1to18: {ru: 'Малые (1-18)', en: 'Low (1-18)'},
    at19to36: {ru: 'Большие (19-36)', en: 'High (1-18)'},
    twelve1: {ru: 'Первая дюжина (1-12)', en: '1st Twelves (1-12)'},
    twelve2: {ru: 'Вторая дюжина (13-24)', en: '2nd Twelves (13-24)'},
    twelve3: {ru: 'Третья дюжина (25-36)', en: '3rd Twelves (25-36)'},
    top2to1: {ru: 'Зеро', en: 'Zero'},
    mid2to1: {ru: 'Зеро', en: 'Zero'},
    bot2to1: {ru: 'Зеро', en: 'Zero'},
}
export const POINTS_NAMES = {
    2: {ru: 'Разделённая ставка', en: 'Split'},
    3: {ru: 'Ряд из трёх', en: 'Street'},
    4: {ru: 'Квадрат', en: 'Corner'},
    6: {ru: 'Линия из шести', en: 'Line'},
}

export const HELP_TEXT = {
    home: {ru: 'Перезапустить', en: 'Restart'},
    money: {ru: 'Ваш текущий счет', en: 'Your current money'},
    addMoney: {ru: 'Пополнить счет', en: 'Get extra money'},
    config: {ru: 'Настройки игры', en: 'Game settings'},

    logButton: {ru: 'История выпавших значений', en: 'List of last results'},

    bets: {ru: 'Сумма ставок и текущая ставка', en: 'Total of bets and current bet'},
    currentBet: {ru: 'Ткущая ставка', en: 'Current bet'},
    setBet: {ru: 'Изменить ставку', en: 'Set bet'},
    repeatBets: {ru: 'Повторить последние ставки', en: 'Repeat all recent bets'},
    clearBets: {ru: 'Очистить все ставки', en: 'Clear all bets'},
}

export const POPUP_TEXT = {
    bet: {ru: 'РЕДАКТОР СТАВОК', en: 'BET EDITOR'},
    nearest: {ru: 'Число соседей:', en: 'Nearest count:'},
    logs: {ru: 'ИСТОРИЯ РЕЗУЛЬТАТОВ', en: 'LAST RESULTS'},
}

export const BUTTON_TEXT = {
    done: {ru: 'Готово', en: 'Done'},
    spin: {ru: 'Крутим', en: 'Spin'},
}

export const SECTOR_NUMBERS = {
    [SECTOR.zero]: [0, 32, 15, 12, 35, 3, 26],
    [SECTOR.vois]: [0, 32, 15, 12, 35, 3, 26, 19, 4, 21, 2, 25, 22, 18, 29, 7, 28],
    [SECTOR.orph]: [17, 34, 6, 1, 20, 14, 31, 9],
    [SECTOR.tier]: [27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33],

    [SECTOR.even]: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36],
    [SECTOR.odd]: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35],
    [SECTOR.red]: [32, 19, 21, 25, 34, 27, 36, 30, 23, 5, 16, 1, 14, 9, 18, 7, 12, 3],
    [SECTOR.black]: [15, 4, 2, 17, 6, 13, 11, 8, 10, 24, 33, 20, 31, 22, 29, 28, 35, 26],
    [SECTOR.at1to18]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    [SECTOR.at19to36]: [19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36],

    [SECTOR.twelve1]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    [SECTOR.twelve2]: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
    [SECTOR.twelve3]: [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36],
    [SECTOR.top2to1]: [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
    [SECTOR.mid2to1]: [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
    [SECTOR.bot2to1]: [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
}

export const NUMBERS = [ 0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36,
    11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
]

export const BET_RATIO = {
    1: 36, /* ставка в число */
    2: 18, /* сплит (2 соседних) */
    3: 12, /* стрит (3 соседних) */
    4: 9,  /* угол (4 соседних) */
    6: 6,  /* 6 чисел рядом (2 соседних ряда) */
    12: 3, /* 12 чисел */
    18: 2, /* 18 чисел */
}
export const MAX_BET_RATIO = {
    [BET_RATIO[1]]: 500,  /* 20 000 / 36 = 555  ~ 500 */
    [BET_RATIO[2]]: 1000, /* 20 000 / 18 = 1111 ~ 1000 */
    [BET_RATIO[3]]: 1500, /* 20 000 / 12 = 1666 ~ 1500 */
    [BET_RATIO[4]]: 2000, /* 20 000 / 9 = 2222 ~ 2000 */
    [BET_RATIO[6]]: 3000, /* 20 000 / 6 = 3333 ~ 3000 */
    [BET_RATIO[12]]:5000, /* 20 000 / 3 = 6666 ~ 5000 */
    [BET_RATIO[18]]:10000,/* 20 000 / 2 = 10000 */
}

export const CHIP = {
    c1: 'c1',
    c5: 'c5',
    c10: 'c10',
    c25: 'c25',
    c50: 'c50',
    c100: 'c100',
    c500: 'c500',
    c1000: 'c1000',
    c5000: 'c5000'
}
export const CHIP_DATA = {
    scale: 0.36
}

export const SPIEL = {
    width: 1204,
    height: 312,
    sectors: {
        [SECTOR.zero]: {x: 174, y: 156},
        [SECTOR.vois]: {x: 406, y: 156},
        [SECTOR.orph]: {x: 730, y: 156},
        [SECTOR.tier]: {x: 933, y: 156},
    },
    numbers: [
        /*  0 */ {x: 69, y: 84},
        /*  1 */ {x: 861, y: 259},
        /*  2 */ {x: 471, y: 52},
        /*  3 */ {x: 83, y: 241},
        /*  4 */ {x: 341, y: 52},
        /*  5 */ {x: 1120, y: 241},
        /*  6 */ {x: 731, y: 52},
        /*  7 */ {x: 341, y: 259},
        /*  8 */ {x: 1121, y: 71},
        /*  9 */ {x: 601, y: 259},
        /* 10 */ {x: 1145, y: 199},
        /* 11 */ {x: 991, y: 52},
        /* 12 */ {x: 211, y: 259},
        /* 13 */ {x: 861, y: 52},
        /* 14 */ {x: 731, y: 259},
        /* 15 */ {x: 211, y: 52},
        /* 16 */ {x: 991, y: 259},
        /* 17 */ {x: 601, y: 52},
        /* 18 */ {x: 471, y: 259},
        /* 19 */ {x: 276, y: 52},
        /* 20 */ {x: 796, y: 259},
        /* 21 */ {x: 406, y: 52},
        /* 22 */ {x: 536, y: 259},
        /* 23 */ {x: 1145, y: 114},
        /* 24 */ {x: 1062, y: 257},
        /* 25 */ {x: 536, y: 52},
        /* 26 */ {x: 58, y: 198},
        /* 27 */ {x: 796, y: 52},
        /* 28 */ {x: 276, y: 259},
        /* 29 */ {x: 406, y: 259},
        /* 30 */ {x: 1062, y: 55},
        /* 31 */ {x: 666, y: 259},
        /* 32 */ {x: 141, y: 54},
        /* 33 */ {x: 926, y: 259},
        /* 34 */ {x: 666, y: 52},
        /* 35 */ {x: 140, y: 257},
        /* 36 */ {x: 926, y: 52},
    ]
}

export const FIELD = {
    width: 1204,
    height: 504,
    points: {
        top: [
            [
                [ 0,  1,  3],
                [ 1,  3], [ 1,  3,  4,  6], [ 4,  6], [ 4,  6,  7,  9], [ 7,  9], [ 7,  9, 10, 12],
                [10, 12], [10, 12, 13, 15], [13, 15], [13, 15, 16, 18], [16, 18], [16, 18, 19, 21],
                [19, 21], [19, 21, 22, 24], [22, 24], [22, 24, 25, 27], [25, 27], [25, 27, 28, 30],
                [28, 30], [28, 30, 31, 33], [31, 33], [31, 33, 34, 36], [34, 36], [34, 36,  1,  3],
            ],
            [
                [ 0,  2,  3],
                [ 2,  3], [ 2,  3,  5,  6], [ 5,  6], [ 5,  6,  8,  9], [ 8,  9], [ 8,  9, 11, 12],
                [11, 12], [11, 12, 14, 15], [14, 15], [14, 15, 17, 18], [17, 18], [17, 18, 20, 21],
                [20, 21], [20, 21, 23, 24], [23, 24], [23, 24, 26, 27], [26, 27], [26, 27, 29, 30],
                [29, 30], [29, 30, 32, 33], [32, 33], [32, 33, 35, 36], [35, 36], [35, 36,  2,  3],
            ],
            [
                [ 0,  1,  2],
                [ 1,  2], [ 1,  2,  4,  5], [ 4,  5], [ 4,  5,  7,  8], [ 7,  8], [ 7,  8, 10, 11],
                [10, 11], [10, 11, 13, 14], [13, 14], [13, 14, 16, 17], [16, 17], [16, 17, 19, 20],
                [19, 20], [19, 20, 22, 23], [22, 23], [22, 23, 25, 26], [25, 26], [25, 26, 28, 29],
                [28, 29], [28, 29, 31, 32], [31, 32], [31, 32, 34, 35], [34, 35], [34, 35,  1,  2],
            ]
        ],
        mid: [
            [
                [ 0,  3], [ 3,  6], [ 6,  9], [ 9, 12], [12, 15], [15, 18],
                [18, 21], [21, 24], [24, 27], [27, 30], [30, 33], [33, 36], [36, 3],
            ],
            [
                [ 0,  2], [ 2,  5], [ 5,  8], [ 8, 11], [11, 14], [14, 17],
                [17, 20], [20, 23], [23, 26], [26, 29], [29, 32], [32, 35], [35, 2],
            ],
            [
                [ 0,  1], [ 1,  4], [ 4,  7], [ 7, 10], [10, 13], [13, 16],
                [16, 19], [19, 22], [22, 25], [25, 28], [28, 31], [31, 34], [34, 1],
            ]
        ],
        bot: [
            [ 0,  1,  2,  3],
            [ 1,  2,  3], [ 1,  2,  3,  4,  5,  6], [ 4,  5,  6], [ 4,  5,  6,  7,  8,  9],
            [ 7,  8,  9], [ 7,  8,  9, 10, 11, 12], [10, 11, 12], [10, 11, 12, 13, 14, 15],
            [13, 14, 15], [13, 14, 15, 16, 17, 18], [16, 17, 18], [16, 17, 18, 19, 20, 21],
            [19, 20, 21], [19, 20, 21, 22, 23, 24], [22, 23, 24], [22, 23, 24, 25, 26, 27],
            [25, 26, 27], [25, 26, 27, 28, 29, 30], [28, 29, 30], [28, 29, 30, 31, 32, 33],
            [31, 32, 33], [31, 32, 33, 34, 35, 36], [34, 35, 36], [34, 35, 36,  1,  2,  3],
        ]
    },
    ceils: {
        numbers: [
            /*  0 */ {x:    2, y:   2, w: 80, h: 300, centerX: 0, centerY: 0},

            /*  1 */ {x:   82, y: 202, w: 80, h: 100, centerX: 0, centerY: 0},
            /*  2 */ {x:   82, y: 102, w: 80, h: 100, centerX: 0, centerY: 0},
            /*  3 */ {x:   82, y:   2, w: 80, h: 100, centerX: 0, centerY: 0},

            /*  4 */ {x:  162, y: 202, w: 80, h: 100, centerX: 0, centerY: 0},
            /*  5 */ {x:  162, y: 102, w: 80, h: 100, centerX: 0, centerY: 0},
            /*  6 */ {x:  162, y:   2, w: 80, h: 100, centerX: 0, centerY: 0},

            /*  7 */ {x:  242, y: 202, w: 80, h: 100, centerX: 0, centerY: 0},
            /*  8 */ {x:  242, y: 102, w: 80, h: 100, centerX: 0, centerY: 0},
            /*  9 */ {x:  242, y:   2, w: 80, h: 100, centerX: 0, centerY: 0},

            /* 10 */ {x:  322, y: 202, w: 80, h: 100, centerX: 0, centerY: 0},
            /* 11 */ {x:  322, y: 102, w: 80, h: 100, centerX: 0, centerY: 0},
            /* 12 */ {x:  322, y:   2, w: 80, h: 100, centerX: 0, centerY: 0},

            /* 13 */ {x:  402, y: 202, w: 80, h: 100, centerX: 0, centerY: 0},
            /* 14 */ {x:  402, y: 102, w: 80, h: 100, centerX: 0, centerY: 0},
            /* 15 */ {x:  402, y:   2, w: 80, h: 100, centerX: 0, centerY: 0},

            /* 16 */ {x:  482, y: 202, w: 80, h: 100, centerX: 0, centerY: 0},
            /* 17 */ {x:  482, y: 102, w: 80, h: 100, centerX: 0, centerY: 0},
            /* 18 */ {x:  482, y:   2, w: 80, h: 100, centerX: 0, centerY: 0},

            /* 19 */ {x:  562, y: 202, w: 80, h: 100, centerX: 0, centerY: 0},
            /* 20 */ {x:  562, y: 102, w: 80, h: 100, centerX: 0, centerY: 0},
            /* 21 */ {x:  562, y:   2, w: 80, h: 100, centerX: 0, centerY: 0},

            /* 22 */ {x:  642, y: 202, w: 80, h: 100, centerX: 0, centerY: 0},
            /* 23 */ {x:  642, y: 102, w: 80, h: 100, centerX: 0, centerY: 0},
            /* 24 */ {x:  642, y:   2, w: 80, h: 100, centerX: 0, centerY: 0},

            /* 25 */ {x:  722, y: 202, w: 80, h: 100, centerX: 0, centerY: 0},
            /* 26 */ {x:  722, y: 102, w: 80, h: 100, centerX: 0, centerY: 0},
            /* 27 */ {x:  722, y:   2, w: 80, h: 100, centerX: 0, centerY: 0},

            /* 28 */ {x:  802, y: 202, w: 80, h: 100, centerX: 0, centerY: 0},
            /* 29 */ {x:  802, y: 102, w: 80, h: 100, centerX: 0, centerY: 0},
            /* 30 */ {x:  802, y:   2, w: 80, h: 100, centerX: 0, centerY: 0},

            /* 31 */ {x:  882, y: 202, w: 80, h: 100, centerX: 0, centerY: 0},
            /* 32 */ {x:  882, y: 102, w: 80, h: 100, centerX: 0, centerY: 0},
            /* 33 */ {x:  882, y:   2, w: 80, h: 100, centerX: 0, centerY: 0},

            /* 34 */ {x:  962, y: 202, w: 80, h: 100, centerX: 0, centerY: 0},
            /* 35 */ {x:  962, y: 102, w: 80, h: 100, centerX: 0, centerY: 0},
            /* 36 */ {x:  962, y:   2, w: 80, h: 100, centerX: 0, centerY: 0},
        ],
        sections: {
            top2to1: {x: 1042, y:   2, w: 160, h: 100, centerX: 0, centerY: 0},
            mid2to1: {x: 1042, y: 102, w: 160, h: 100, centerX: 0, centerY: 0},
            bot2to1: {x: 1042, y: 202, w: 160, h: 100, centerX: 0, centerY: 0},

            twelve1: {x:   82, y: 302, w: 320, h: 100, centerX: 0, centerY: 0},
            twelve2: {x:  402, y: 302, w: 320, h: 100, centerX: 0, centerY: 0},
            twelve3: {x:  722, y: 302, w: 320, h: 100, centerX: 0, centerY: 0},

            at1to18: {x:   82, y: 402, w: 160, h: 100, centerX: 0, centerY: 0},
            at19to36:{x:  882, y: 402, w: 160, h: 100, centerX: 0, centerY: 0},

            even:    {x:  242, y: 402, w: 160, h: 100, centerX: 0, centerY: 0},
            odd:     {x:  722, y: 402, w: 160, h: 100, centerX: 0, centerY: 0},

            red:    {x:  402, y: 402, w: 160, h: 100, centerX: 0, centerY: 0},
            black:  {x:  562, y: 402, w: 160, h: 100, centerX: 0, centerY: 0},
        },
    }
}
FIELD.ceils.numbers.forEach( n => {
    n.centerX = n.x + n.w * 0.5
    n.centerY = n.y + n.h * 0.5
})
Object.keys(FIELD.ceils.sections).forEach( key => {
    FIELD.ceils.sections[key].centerX = FIELD.ceils.sections[key].x + FIELD.ceils.sections[key].w * 0.5
    FIELD.ceils.sections[key].centerY = FIELD.ceils.sections[key].y + FIELD.ceils.sections[key].h * 0.5
})

export const BALL = {
    size: 24,
    delayMin: 600,
    delayMax: 1200,
    speedMin: 0.036,
    speedMax: 0.048,
    speedBias: 0.024, // speed for start resize rotation radius
    friction: 0.00006,
    gravity: 2.7,
    speedJump: 0.006, // final move speed to target number
    rotationRadiusStart: 326,
    rotationRadiusStop: 256,
    rotationRadiusEnd: 162
}

export const WHEEL = {
    borderSize: 728,
    centerSize: 512,

    speedMin: 0.009, // 0.008 -  sec 6, 4, 8, 21, 9
    speedMax: 0.018,
    acceleration: 0.0006,
    slowdown: 0.00007, // speed -= slowdown * deltaTime
    
    sectorStep: (2 * Math.PI) / 37,

    deflectorCenterOrbit: 283,
    deflectorHalfLength: 16,
    deflectors: [
        {angle: Math.PI * 0.125, isTransverse: true},
        {angle: Math.PI * 0.375, isTransverse: false},
        {angle: Math.PI * 0.625, isTransverse: true},
        {angle: Math.PI * 0.875, isTransverse: false},
        {angle: Math.PI * 1.125, isTransverse: true},
        {angle: Math.PI * 1.375, isTransverse: false},
        {angle: Math.PI * 1.625, isTransverse: true},
        {angle: Math.PI * 1.875, isTransverse: false},
     ]
}
WHEEL.deflectors.forEach( deflector => {
    const centerX = Math.cos(deflector.angle) * WHEEL.deflectorCenterOrbit
    const centerY = Math.sin(deflector.angle) * WHEEL.deflectorCenterOrbit
    const HalfPI = Math.PI * 0.5
    
    if (deflector.isTransverse) {
        deflector.p1 = {
            x: centerX + Math.cos(deflector.angle) * WHEEL.deflectorHalfLength,
            y: centerY + Math.sin(deflector.angle) * WHEEL.deflectorHalfLength
        }
        deflector.p2 = {
            x: centerX + Math.cos(deflector.angle + Math.PI) * WHEEL.deflectorHalfLength,
            y: centerY + Math.sin(deflector.angle + Math.PI) * WHEEL.deflectorHalfLength
        }
    } else {
        deflector.p1 = {
            x: centerX + Math.cos(deflector.angle + HalfPI) * WHEEL.deflectorHalfLength,
            y: centerY + Math.sin(deflector.angle + HalfPI) * WHEEL.deflectorHalfLength
        }
        deflector.p2 = {
            x: centerX + Math.cos(deflector.angle - HalfPI) * WHEEL.deflectorHalfLength,
            y: centerY + Math.sin(deflector.angle - HalfPI) * WHEEL.deflectorHalfLength
        }
    }
    
    deflector.center = { x: centerX, y: centerY }
})

export const BUTTON = {
    width: 320,
    height: 100,
    borderRadius: 50,
}

export const REAL_RESULTS = [
    8, 35, 0, 5, 11, 15, 35, 4, 14, 33, 16, 33, 19, 16, 27, 33, 0, 2, 36, 16, 17, 16,
    6, 8, 26, 27, 21, 7, 6, 28, 28, 4, 6, 3, 8, 10, 17, 3, 1, 25, 11, 32, 11, 18, 25,
    27, 10, 0, 25, 9, 29, 14, 19, 19, 33, 17, 11, 9, 14, 26, 13, 10, 4, 35, 9, 30, 11,
    34, 11, 33, 15, 23, 3, 23, 8, 18, 17, 18, 32, 36, 22, 32, 25, 25, 17, 10, 2,
    26, 20, 15, 3, 17, 10, 35, 28, 5, 19, 27, 19, 28, 4, 32, 28, 35, 29, 21, 36, 20,
    16, 27, 20, 6, 26, 15, 2, 32, 6, 21, 33, 30, 13, 22, 0, 17, 21, 28, 18, 27, 35, 36,
    12, 7, 17, 0, 34, 19, 8, 22, 31, 10, 20, 19, 15, 24, 36, 25, 35, 22, 33, 30, 30,
    29, 28, 7, 10, 16, 31, 0, 34, 7, 23, 29, 0, 9, 14, 4, 16, 3, 18, 31, 29
]

export const TEST_RESULTS = Array.from({ length: 1_000_000 }, () => {
    const randomIndex = Math.floor(Math.random() * NUMBERS.length)
    return NUMBERS[randomIndex]
})

export const UI = {
    contextOpenMinDuration: 500,

    borderRadius: 20,
    bg: 0x135507,

    size: 60,
    iconOffset: 4,
    iconRealImageSize: 120,
    iconSize: 0,
    iconScale: 0,
    offset: 0, /* from side to icon center */

    bets: {
        width: 340,
        height: 40,
        bg: 0x000000,
        alpha: 0.5,
        iconSize: 0,
        iconScale: 0
    }
}
UI.offset = UI.size * 0.5
UI.iconSize = UI.size - UI.iconOffset * 2
UI.iconScale = UI.iconSize / UI.iconRealImageSize
UI.bets.iconSize = UI.bets.height - UI.iconOffset * 2
UI.bets.iconScale = UI.bets.iconSize / UI.iconRealImageSize

export const GAME_OFFSET = 24 /* offset between screen borders and between game containers */
export const GAME_CONTAINERS = {
    wheel: {
        width: Math.max(WHEEL.borderSize, BUTTON.width),
        height: WHEEL.borderSize + GAME_OFFSET * 3 + BUTTON.height,
        pointWheel: {x: 0, y: 0},
        pointButton: {x: 0, y: 0}
    },
    field: {
        width: Math.max(FIELD.width, SPIEL.width),
        height: SPIEL.height + GAME_OFFSET * 3 + FIELD.height,
        pointSpiel: {x: 0, y: 0},
        pointField: {x: 0, y: 0}
    },
    game: {
        portrait: { width: 0, height: 0 },
        landscape: { width: 0, height: 0 },
    }
}
GAME_CONTAINERS.wheel.pointWheel.y = GAME_CONTAINERS.wheel.height * -0.5 + WHEEL.borderSize * 0.5 + GAME_OFFSET
GAME_CONTAINERS.wheel.pointButton.y = GAME_CONTAINERS.wheel.height * 0.5 - BUTTON.height * 0.5 - GAME_OFFSET
GAME_CONTAINERS.field.pointSpiel.x = -GAME_CONTAINERS.field.width * 0.5
GAME_CONTAINERS.field.pointSpiel.y = GAME_CONTAINERS.field.height * -0.5 + GAME_OFFSET
GAME_CONTAINERS.field.pointField.x = GAME_CONTAINERS.field.pointSpiel.x
GAME_CONTAINERS.field.pointField.y = GAME_CONTAINERS.field.height * 0.5 - GAME_OFFSET - FIELD.height
// portrait sizes
GAME_CONTAINERS.game.portrait.width =
    Math.max(GAME_CONTAINERS.wheel.width, GAME_CONTAINERS.field.width) + GAME_OFFSET * 2
GAME_CONTAINERS.game.portrait.height =
    GAME_CONTAINERS.wheel.height + GAME_OFFSET * 3 + GAME_CONTAINERS.field.height
// landscape sizes
GAME_CONTAINERS.game.landscape.width =
    GAME_CONTAINERS.wheel.width + GAME_OFFSET * 3 + GAME_CONTAINERS.field.width
GAME_CONTAINERS.game.landscape.height =
    Math.max(GAME_CONTAINERS.wheel.height, GAME_CONTAINERS.field.height) + GAME_OFFSET * 2

export const POPUP_TYPE = {
    EMPTY: '',
    bet: 'bet',
    logs: 'logs',
}
export const POPUP = {
    width: 480,
    height: 480,
    size: 0,
    margin: 30,
    padding: 20,
    x: 0,
    y: 0,
    sellColor: 0x000000,
    sellAlpha: 0.75,
    bg: UI.bg,
    borderRadius: UI.borderRadius,
    borderWidth: 4,
    borderColor: 0xffffff,
    closeButton: { x: 0, y: 0, scale: 0.5 }
}
POPUP.x = -POPUP.width * 0.5
POPUP.y = -POPUP.height * 0.5
POPUP.size = Math.max(POPUP.width + POPUP.margin * 2, POPUP.height + POPUP.margin * 2)
POPUP.closeButton.y = POPUP.height * 0.5 - POPUP.padding - (BUTTON.height * 0.5) * POPUP.closeButton.scale

export const LOGS = {
    piecesInRow: 12,
    lines: 8,
    max: 0,

    x: 12,
    y: -150,
    
    stepX: 0,
    stepY: 0,

    fontSizes: [30, 22, 18],
}
LOGS.max = LOGS.lines * LOGS.piecesInRow
LOGS.stepX = Math.ceil(POPUP.width / (LOGS.piecesInRow + 2))
LOGS.stepY = LOGS.stepX + 4
LOGS.x += Math.ceil(-POPUP.width * 0.5 + LOGS.stepX)
