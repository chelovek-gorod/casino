const WHEEL_SIZE = 728
const FIELD_WIDTH = 1204
const FIELD_HEIGHT = 504
const SPIEL_WIDTH = 1204
const SPIEL_HEIGHT = 312
export const RESULTS = {
    width: WHEEL_SIZE - 120,
    height: 80,
    borderRadius: 40,
    color: 0xffffff,
    alpha: 0.4
}

export const HELP_TEXT = {
    home: {ru: 'В главное меню', en: 'To main menu'},
    money: {ru: 'Ваш текущий счет', en: 'Your current money'},
    addMoney: {ru: 'Пополнить счет', en: 'Get extra money'},
    config: {ru: 'Настройки игры', en: 'Game settings'},

    logButton: {ru: 'История выпавших значений', en: 'List of last results'},

    rulesButton: {ru: 'Правила игры', en: 'Gameplay rules'},

    bets: {ru: 'Сумма ставок и текущая ставка', en: 'Total of bets and current bet'},
    currentBet: {ru: 'Ткущая ставка', en: 'Current bet'},
    setBet: {ru: 'Изменить ставку', en: 'Set bet'},
    repeatBets: {ru: 'Повторить последние ставки', en: 'Repeat all recent bets'},
    clearBets: {ru: 'Очистить все ставки', en: 'Clear all bets'},

    betOnHoverBet: {ru: 'Ставка', en: 'Bet'},
    betOnHoverRate: {ru: 'Выплата', en: 'Payout'},
    betOnHoverMax: {ru: 'Макс. ставка', en: 'Max bet'},
}

export const MESSAGE_TEXT = {
    lowMoney: {ru: 'Сумма ставки\nпревышает баланс', en: 'Bet amount\nexceeds balance'},
    winMoney: {ru: 'Вы выиграли\n', en: 'You win\n'},
    betLimit: {
        ru: 'Лимит ставки\nпревышен!',
        en: 'This bet\n is too high!'
    },

    'LINE': {ru: ' в ряд\n', en: ' in line\n'},
    'BONUS': {ru: 'БОНУС\n', en: 'BONUS\n'},
    'BONUS2': {ru: ' за ряды', en: ' for lines'},
    '7x7': {ru: 'Джекпот 7x7 !!!\n', en: 'Jackpot 7x7 !!!\n'},
    'SET': {ru: 'За коллекцию\n', en: 'Set bonus\n'},
    'PRESENT': {ru: 'Находка!\n', en: 'Lucky Find!\n'},
    'CLOVER': {ru: 'Возврат ставки\n', en: 'Return bet\n'},
    'COIN': {ru: 'В банк\n', en: 'Add to bank\n'},
    'GOLD': {ru: 'Прибыль ', en: 'Income '},
    'GOLD2': {ru: ' банка', en: ' from bank'},
}

/*
export const MESSAGE_TEXT = {
  lowMoney: {
    ru: () => `Сумма ставки\nпревышает баланс`,
    en: () => `Bet amount\nexceeds balance`
  },
  winMoney: {
    ru: (sum) => `Вы выиграли\n${sum}₽!`,
    en: (sum) => `You win\n${sum}$!`
  }
}

console.log(MESSAGE_TEXT.winMoney.ru(1500)) // → "Вы выиграли\n1500₽!"
console.log(MESSAGE_TEXT.lowMoney.en())     // → "Bet amount\nexceeds balance"
*/

export const BUTTON_TEXT = {
    done: {ru: 'Готово', en: 'Done'},
    spin: {ru: 'КРУТИМ', en: 'SPIN'},
}

export const BUTTON = {
    width: 320,
    height: 100,
    borderRadius: 50,
}

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
        width: Math.max(WHEEL_SIZE, BUTTON.width) + GAME_OFFSET * 2,
        height: WHEEL_SIZE + BUTTON.height + RESULTS.height + GAME_OFFSET * 5,
        pointResults: {x: 0, y: 0},
        pointWheel: {x: 0, y: 0},
        pointButton: {x: 0, y: 0},
        scale: 1,
        scaledWidth: 1,
        scaledHeight: 1
    },
    field: {
        width: Math.max(FIELD_WIDTH, SPIEL_WIDTH) + GAME_OFFSET * 3,
        height: SPIEL_HEIGHT + FIELD_HEIGHT + GAME_OFFSET * 3,
        pointSpiel: {x: 0, y: 0},
        pointField: {x: 0, y: 0},
        scale: 1,
        scaledWidth: 1,
        scaledHeight: 1
    }
}
GAME_CONTAINERS.wheel.pointResults.y = GAME_CONTAINERS.wheel.height * -0.5 + RESULTS.height + GAME_OFFSET
GAME_CONTAINERS.wheel.pointWheel.y = GAME_CONTAINERS.wheel.pointResults.y + WHEEL_SIZE * 0.5 + GAME_OFFSET
GAME_CONTAINERS.wheel.pointButton.y = GAME_CONTAINERS.wheel.height * 0.5 - BUTTON.height * 0.5 - GAME_OFFSET
GAME_CONTAINERS.field.pointSpiel.x = -GAME_CONTAINERS.field.width * 0.5 + GAME_OFFSET
GAME_CONTAINERS.field.pointSpiel.y = GAME_CONTAINERS.field.height * -0.5 + GAME_OFFSET
GAME_CONTAINERS.field.pointField.x = -GAME_CONTAINERS.field.width * 0.5 + GAME_OFFSET
GAME_CONTAINERS.field.pointField.y = GAME_CONTAINERS.field.height * 0.5 - GAME_OFFSET - FIELD_HEIGHT
const [fieldScaleH, wheelScaleH] = (GAME_CONTAINERS.field.height / GAME_CONTAINERS.wheel.height) < 1
    ? [1, GAME_CONTAINERS.field.height / GAME_CONTAINERS.wheel.height]
    : [GAME_CONTAINERS.wheel.height / GAME_CONTAINERS.field.height, 1]
GAME_CONTAINERS.field.scale = fieldScaleH
GAME_CONTAINERS.wheel.scale = wheelScaleH
GAME_CONTAINERS.field.scaledWidth = GAME_CONTAINERS.field.width * GAME_CONTAINERS.field.scale
GAME_CONTAINERS.wheel.scaledWidth = GAME_CONTAINERS.wheel.width * GAME_CONTAINERS.wheel.scale
GAME_CONTAINERS.field.scaledHeight = GAME_CONTAINERS.field.height * GAME_CONTAINERS.field.scale
GAME_CONTAINERS.wheel.scaledHeight = GAME_CONTAINERS.wheel.height * GAME_CONTAINERS.wheel.scale

export const MESSAGE = {
    y: 0,
    height: 160,
    fontSize: 120,
    fontSizeForText: 48,
    bg: 0xffffff,
    alpha: 0.6,
    showDuration: 800,
    inOutDuration: 200,
}
MESSAGE.y = -MESSAGE.height * 0.5