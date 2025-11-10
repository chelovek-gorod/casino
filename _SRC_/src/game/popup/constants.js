import { UI, BUTTON } from "../UI/constants"

export const POPUP_TEXT = {
    bet: {ru: 'РЕДАКТОР СТАВОК', en: 'BET EDITOR'},
    nearest: {ru: 'Число соседей:', en: 'Nearest count:'},
    spielSplits: {ru: 'Ставки на секторах:', en: 'Sector-based bets:'},
    spielSplitsValues: [
        {ru: 'в номера', en: 'straight'},
        {ru: 'сплитами', en: ' splits '}
    ],
    logs: {ru: 'ИСТОРИЯ РЕЗУЛЬТАТОВ', en: 'LAST RESULTS'},
}

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