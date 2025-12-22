const WHEEL_SIZE = 728
const FIELD_WIDTH = 1204
const FIELD_HEIGHT = 504
const SPIEL_WIDTH = 1204
const SPIEL_HEIGHT = 312
export const RESULTS = {
    width: WHEEL_SIZE - 120,
    height: 60,
    borderRadius: 30,
    color: 0xffffff,
    alpha: 0.4,

    winSumHeight: 40,
}

export const HELP_TEXT = {
    home: {
        ru: 'В главное меню',
        en: 'To main menu',
        tr: 'Ana menüye dön',
        es: 'Al menú principal',
        de: 'Zum Hauptmenü',
        pt: 'Para o menu principal',
        fr: 'Vers le menu principal',
        pl: 'Do menu głównego',
        id: 'Ke menu utama',
        ms: 'Ke menu utama'
    },
    money: {
        ru: 'Ваш текущий счет',
        en: 'Your current money',
        tr: 'Mevcut bakiyeniz',
        es: 'Su dinero actual',
        de: 'Ihr aktuelles Guthaben',
        pt: 'Seu saldo atual',
        fr: 'Votre argent actuel',
        pl: 'Twoje aktualne środki',
        id: 'Uang Anda saat ini',
        ms: 'Wang semasa anda'
    },
    addMoney: {
        ru: 'Пополнить счет',
        en: 'Get extra money',
        tr: 'Ekstra para al',
        es: 'Obtener dinero extra',
        de: 'Extra Geld bekommen',
        pt: 'Obter dinheiro extra',
        fr: 'Obtenir de l’argent supplémentaire',
        pl: 'Zdobądź dodatkowe środki',
        id: 'Dapatkan uang tambahan',
        ms: 'Dapatkan wang tambahan'
    },
    config: {
        ru: 'Настройки игры',
        en: 'Game settings',
        tr: 'Oyun ayarları',
        es: 'Configuración del juego',
        de: 'Spiel-Einstellungen',
        pt: 'Configurações do jogo',
        fr: 'Paramètres du jeu',
        pl: 'Ustawienia gry',
        id: 'Pengaturan game',
        ms: 'Tetapan permainan'
    },
    logButton: {
        ru: 'История выпавших значений',
        en: 'List of last results',
        tr: 'Sonuç geçmişi',
        es: 'Historial de resultados',
        de: 'Liste der letzten Ergebnisse',
        pt: 'Histórico de resultados',
        fr: 'Historique des résultats',
        pl: 'Historia wyników',
        id: 'Riwayat hasil',
        ms: 'Sejarah keputusan'
    },
    rulesButton: {
        ru: 'Правила игры',
        en: 'Gameplay rules',
        tr: 'Oyun kuralları',
        es: 'Reglas del juego',
        de: 'Spielregeln',
        pt: 'Regras do jogo',
        fr: 'Règles du jeu',
        pl: 'Zasady gry',
        id: 'Aturan permainan',
        ms: 'Peraturan permainan'
    },
    bet: {
        ru: 'Текущая ставка',
        en: 'Current bet',
        tr: 'Mevcut bahis',
        es: 'Apuesta actual',
        de: 'Aktueller Einsatz',
        pt: 'Aposta atual',
        fr: 'Pari actuel',
        pl: 'Aktualny zakład',
        id: 'Taruhan saat ini',
        ms: 'Pertaruhan semasa'
    },
    bets: {
        ru: 'Сумма ставок / текущая ставка',
        en: 'Total of bets / current bet',
        tr: 'Bahis toplamı / mevcut bahis',
        es: 'Total de apuestas / apuesta actual',
        de: 'Summe der Einsätze / aktueller Einsatz',
        pt: 'Total de apostas / aposta atual',
        fr: 'Total des paris / pari actuel',
        pl: 'Suma zakładów / aktualny zakład',
        id: 'Total taruhan / taruhan saat ini',
        ms: 'Jumlah pertaruhan / pertaruhan semasa'
    },
    currentBet: {
        ru: 'Ткущая ставка',
        en: 'Current bet',
        tr: 'Mevcut bahis',
        es: 'Apuesta actual',
        de: 'Aktueller Einsatz',
        pt: 'Aposta atual',
        fr: 'Pari actuel',
        pl: 'Aktualny zakład',
        id: 'Taruhan saat ini',
        ms: 'Pertaruhan semasa'
    },
    setBet: {
        ru: 'Изменить ставку',
        en: 'Set bet',
        tr: 'Bahsi ayarla',
        es: 'Establecer apuesta',
        de: 'Einsatz festlegen',
        pt: 'Definir aposta',
        fr: 'Définir le pari',
        pl: 'Ustaw zakład',
        id: 'Tetapkan taruhan',
        ms: 'Tetapkan pertaruhan'
    },
    repeatBets: {
        ru: 'Повторить последние ставки',
        en: 'Repeat all recent bets',
        tr: 'Son bahisleri tekrarla',
        es: 'Repetir todas las apuestas recientes',
        de: 'Alle letzten Einsätze wiederholen',
        pt: 'Repetir todas as apostas recentes',
        fr: 'Répéter tous les derniers paris',
        pl: 'Powtórz ostatnie zakłady',
        id: 'Ulangi semua taruhan terakhir',
        ms: 'Ulang semua pertaruhan terkini'
    },
    clearBets: {
        ru: 'Очистить все ставки',
        en: 'Clear all bets',
        tr: 'Tüm bahisleri temizle',
        es: 'Borrar todas las apuestas',
        de: 'Alle Einsätze löschen',
        pt: 'Limpar todas as apostas',
        fr: 'Effacer tous les paris',
        pl: 'Wyczyść wszystkie zakłady',
        id: 'Bersihkan semua taruhan',
        ms: 'Kosongkan semua pertaruhan'
    },
    betOnHoverMaxBet: {
        ru: (values) => `Ставка ${values[0]}. Макс. ставка ${values[1]}`,
        en: (values) => `Bet ${values[0]}. Max bet ${values[1]}`,
        tr: (values) => `Bahis ${values[0]}. Maks bahis ${values[1]}`,
        es: (values) => `Apuesta ${values[0]}. Apuesta máxima ${values[1]}`,
        de: (values) => `Einsatz ${values[0]}. Max. Einsatz ${values[1]}`,
        pt: (values) => `Aposta ${values[0]}. Aposta máxima ${values[1]}`,
        fr: (values) => `Pari ${values[0]}. Pari max ${values[1]}`,
        pl: (values) => `Zakład ${values[0]}. Maks. zakład ${values[1]}`,
        id: (values) => `Taruhan ${values[0]}. Taruhan maks ${values[1]}`,
        ms: (values) => `Pertaruhan ${values[0]}. Pertaruhan maks ${values[1]}`
    },
    betOnHoverRateBet: {
        ru: (values) => `Выплата ${values[0]}:1. Макс. ставка ${values[1]}`,
        en: (values) => `Payout ${values[0]}:1. Max bet ${values[1]}`,
        tr: (values) => `Kazanç ${values[0]}:1. Maks bahis ${values[1]}`,
        es: (values) => `Pago ${values[0]}:1. Apuesta máxima ${values[1]}`,
        de: (values) => `Auszahlung ${values[0]}:1. Max. Einsatz ${values[1]}`,
        pt: (values) => `Pagamento ${values[0]}:1. Aposta máxima ${values[1]}`,
        fr: (values) => `Gain ${values[0]}:1. Pari max ${values[1]}`,
        pl: (values) => `Wypłata ${values[0]}:1. Maks. zakład ${values[1]}`,
        id: (values) => `Pembayaran ${values[0]}:1. Taruhan maks ${values[1]}`,
        ms: (values) => `Bayaran ${values[0]}:1. Pertaruhan maks ${values[1]}`
    },
    betOnHoverBet: {
        ru: 'Ставка',
        en: 'Bet',
        tr: 'Bahis',
        es: 'Apuesta',
        de: 'Einsatz',
        pt: 'Aposta',
        fr: 'Pari',
        pl: 'Zakład',
        id: 'Taruhan',
        ms: 'Pertaruhan'
    },
    betOnHoverRate: {
        ru: 'Выплата',
        en: 'Payout',
        tr: 'Kazanç',
        es: 'Pago',
        de: 'Auszahlung',
        pt: 'Pagamento',
        fr: 'Gain',
        pl: 'Wypłata',
        id: 'Pembayaran',
        ms: 'Bayaran'
    },
    betOnHoverMax: {
        ru: 'Макс. ставка',
        en: 'Max bet',
        tr: 'Maks bahis',
        es: 'Apuesta máxima',
        de: 'Max. Einsatz',
        pt: 'Aposta máxima',
        fr: 'Pari max',
        pl: 'Maks. zakład',
        id: 'Taruhan maks',
        ms: 'Pertaruhan maks'
    },
    btnSpinR: {
        ru: 'Запуск',
        en: 'Spin',
        tr: 'Dön',
        es: 'Girar',
        de: 'Drehen',
        pt: 'Girar',
        fr: 'Lancer',
        pl: 'Zakręć',
        id: 'Putar',
        ms: 'Putar'
    },
    btnSpinS: {
        ru: 'Запуск',
        en: 'Spin',
        tr: 'Dön',
        es: 'Girar',
        de: 'Drehen',
        pt: 'Girar',
        fr: 'Lancer',
        pl: 'Zakręć',
        id: 'Putar',
        ms: 'Putar'
    },
    btnAutoSpinS: {
        ru: 'Авто запуск',
        en: 'Auto spin',
        tr: 'Otomatik dön',
        es: 'Giro automático',
        de: 'Automatisch drehen',
        pt: 'Giro automático',
        fr: 'Rotation auto',
        pl: 'Auto spin',
        id: 'Putar otomatis',
        ms: 'Putar automatik'
    },
    slotsBank: {
        ru: 'Резерв банка',
        en: 'Bank reserve',
        tr: 'Banka rezervi',
        es: 'Reserva del banco',
        de: 'Bankreserve',
        pt: 'Reserva do banco',
        fr: 'Réserve de la banque',
        pl: 'Rezerwa banku',
        id: 'Cadangan bank',
        ms: 'Simpanan bank'
    },
    repeatBetsNotMoney: {
        ru: 'Недостаточно средств!',
        en: 'Not enough money!',
        tr: 'Yetersiz bakiye!',
        es: '¡Dinero insuficiente!',
        de: 'Nicht genug Geld!',
        pt: 'Dinheiro insuficiente!',
        fr: 'Fonds insuffisants!',
        pl: 'Niewystarczające środki!',
        id: 'Uang tidak cukup!',
        ms: 'Wang tidak cukup!'
    },
    repeatBetsExceedLimit: {
        ru: 'Повтор превысит лимит ставки!',
        en: 'Repeat would exceed bet limit!',
        tr: 'Tekrar bahis limitini aşar!',
        es: '¡La repetición superaría el límite de apuesta!',
        de: 'Wiederholung würde Einsatzlimit überschreiten!',
        pt: 'A repetição excederia o limite de aposta!',
        fr: 'La répétition dépasserait la limite de pari!',
        pl: 'Powtórzenie przekroczyłoby limit zakładu!',
        id: 'Pengulangan akan melebihi batas taruhan!',
        ms: 'Pengulangan akan melebihi had pertaruhan!'
    },
    repeatBetsNoPrevious: {
        ru: 'Нет предыдущих ставок',
        en: 'No previous bets',
        tr: 'Önceki bahis yok',
        es: 'No hay apuestas anteriores',
        de: 'Keine vorherigen Einsätze',
        pt: 'Sem apostas anteriores',
        fr: 'Aucun pari précédent',
        pl: 'Brak poprzednich zakładów',
        id: 'Tidak ada taruhan sebelumnya',
        ms: 'Tiada pertaruhan sebelumnya'
    }
}

export const UI_TEXT = {
    totalBet: {
        ru: 'Сумма',
        en: 'Total',
        tr: 'Toplam',
        es: 'Total',
        de: 'Summe',
        pt: 'Total',
        fr: 'Total',
        pl: 'Suma',
        id: 'Jumlah',
        ms: 'Jumlah'
    }
}

export const MESSAGE_TEXT = {
    lowMoney: {
        ru: 'Недостаточно\nсредств',
        en: 'not enough\nmoney',
        tr: 'Yetersiz\nbakiye',
        es: 'No hay\nsuficiente dinero',
        de: 'Nicht genug\nGeld',
        pt: 'Dinheiro\ninsuficiente',
        fr: 'Pas assez\nd’argent',
        pl: 'Niewystarczająco\nśrodków',
        id: 'Uang\ntidak cukup',
        ms: 'Wang\ntidak cukup'
    },
    winMoney: {
        ru: 'Вы выиграли\n',
        en: 'You win\n',
        tr: 'Kazandınız\n',
        es: 'Has ganado\n',
        de: 'Sie gewinnen\n',
        pt: 'Você ganhou\n',
        fr: 'Vous gagnez\n',
        pl: 'Wygrałeś\n',
        id: 'Anda menang\n',
        ms:'Anda menang\n'
    },
    betLimit: {
        ru: 'Лимит ставки\nпревышен!',
        en: 'This bet\n is too high!',
        tr: 'Bahis limiti\naşıldı!',
        es: '¡Límite de apuesta\nsuperado!',
        de: 'Einsatzlimit\nüberschritten!',
        pt: 'Limite de aposta\nexcedido!',
        fr: 'Limite de pari\ndépassé!',
        pl: 'Limit zakładu\nprzekroczony!',
        id: 'Batas taruhan\nterlampaui!',
        ms: 'Had pertaruhan\nterlebih!'
    },

    'LINE': {
        ru: ' в ряд\n',
        en: ' in line\n',
        tr: ' sıraya\n',
        es: ' en línea\n',
        de: ' in Reihe\n',
        pt: ' na linha\n',
        fr: ' en ligne\n',
        pl: ' w rzędzie\n',
        id: ' dalam baris\n',
        ms: ' dalam barisan\n'
    },
    'BONUS': {
        ru: 'БОНУС\n',
        en: 'BONUS\n',
        tr: 'BONUS\n',
        es: 'BONO\n',
        de: 'BONUS\n',
        pt: 'BÔNUS\n',
        fr: 'BONUS\n',
        pl: 'BONUS\n',
        id: 'BONUS\n',
        ms: 'BONUS\n'
    },
    'BONUS2': {
        ru: ' за ряды',
        en: ' for lines',
        tr: ' satır için',
        es: ' por líneas',
        de: ' für Reihen',
        pt: ' por linhas',
        fr: ' pour les lignes',
        pl: ' za linie',
        id: ' untuk baris',
        ms: ' untuk barisan'
    },
    '7x7': {
        ru: 'Джекпот 7x7 !!!\n',
        en: 'Jackpot 7x7 !!!\n',
        tr: '7x7 Jackpot !!!\n',
        es: '¡Jackpot 7x7 !!!\n',
        de: 'Jackpot 7x7 !!!\n',
        pt: 'Jackpot 7x7 !!!\n',
        fr: 'Jackpot 7x7 !!!\n',
        pl: 'Jackpot 7x7 !!!\n',
        id: 'Jackpot 7x7 !!!\n',
        ms: 'Jackpot 7x7 !!!\n'
    },
    'SET': {
        ru: 'За коллекцию\n',
        en: 'Set bonus\n',
        tr: 'Koleksiyon için\n',
        es: 'Por colección\n',
        de: 'Für Satz\n',
        pt: 'Por coleção\n',
        fr: 'Pour la collection\n',
        pl: 'Za zestaw\n',
        id: 'Untuk koleksi\n',
        ms: 'Untuk koleksi\n'
    },
    'PRESENT': {
        ru: 'Находка!\n',
        en: 'Lucky Find!\n',
        tr: 'Şanslı Buluntu!\n',
        es:'¡Hallazgo afortunado!\n',
        de: 'Glücklicher Fund!\n',
        pt: 'Achado de sorte!\n',
        fr: 'Trouvaille chanceuse!\n',
        pl: 'Szczęśliwe znalezisko!\n',
        id: 'Temuan beruntung!\n',
        ms: 'Penemuan bertuah!\n'
    },
    'CLOVER': {
        ru: 'Возврат ставки\n',
        en: 'Return bet\n',
        tr: 'Bahsi iade et\n',
        es: 'Devolver apuesta\n',
        de: 'Einsatz zurück\n',
        pt: 'Retornar aposta\n',
        fr: 'Retour du pari\n',
        pl: 'Zwrot zakładu\n',
        id: 'Kembalikan taruhan\n',
        ms: 'Pulangkan pertaruhan\n'
    },
    'COIN': {
        ru: 'В банк\n',
        en: 'Add to bank\n',
        tr: 'Banka ekle\n',
        es: 'Añadir al banco\n',
        de: 'Zur Bank\n',
        pt: 'Adicionar ao banco\n',
        fr: 'Ajouter à la banque\n',
        pl: 'Do banku\n',
        id: 'Masukkan ke bank\n',
        ms: 'Masukkan ke bank\n'
    },
    'GOLD': {
        ru: 'Прибыль ',
        en: 'Income ',
        tr: 'Kazanç ',
        es: 'Ganancia ',
        de: 'Gewinn ',
        pt: 'Lucro ',
        fr: 'Revenu ',
        pl: 'Zysk ',
        id: 'Pendapatan ',
        ms: 'Pendapatan '
    },
    'GOLD2': {
        ru: ' из банка',
        en: ' from bank',
        tr: ' banka karı',
        es: ' del banco',
        de: ' aus der Bank',
        pt: ' do banco',
        fr: ' de la banque',
        pl: ' z banku',
        id: ' dari bank',
        ms: ' dari bank'
    },
}

export const LAST_WIN = {
    ru: (sum) => `Выигрыш ${sum}`,
    en: (sum) => `Win ${sum}`,
    tr: (sum) => `Kazanç ${sum}`,
    es: (sum) => `Ganancia ${sum}`,
    de: (sum) => `Gewinn ${sum}`,
    pt: (sum) => `Ganho ${sum}`,
    fr: (sum) => `Gain ${sum}`,
    pl: (sum) => `Wygrana ${sum}`,
    id: (sum) => `Menang ${sum}`,
    ms: (sum) => `Kemenangan ${sum}`
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
    done: {
        ru: 'Готово',
        en: 'Done',
        tr: 'Tamam',
        es: 'Hecho',
        de: 'Fertig',
        pt: 'Concluído',
        fr: 'Fait',
        pl: 'Gotowe',
        id: 'Selesai',
        ms: 'Selesai'
    },
    spin: {
        ru: 'КРУТИМ',
        en: 'SPIN',
        tr: 'ÇEVİR',
        es: 'GIRAR',
        de: 'DREHEN',
        pt: 'GIRAR',
        fr: 'TOURNER',
        pl: 'KRĘĆ',
        id: 'PUTAR',
        ms: 'PUTAR'
    },
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
        offset: 60,
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
        height: WHEEL_SIZE + BUTTON.height + RESULTS.height + RESULTS.winSumHeight + GAME_OFFSET * 6,
        pointResults: {x: 0, y: 0},
        pointResultsSum: {x: 0, y: 0},
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
GAME_CONTAINERS.wheel.pointResults.y = -GAME_CONTAINERS.wheel.height * 0.5 + RESULTS.height + GAME_OFFSET * 2
GAME_CONTAINERS.wheel.pointResultsSum.y = GAME_CONTAINERS.wheel.pointResults.y + RESULTS.winSumHeight * 0.5 + GAME_OFFSET
GAME_CONTAINERS.wheel.pointWheel.y = GAME_CONTAINERS.wheel.pointResultsSum.y + WHEEL_SIZE * 0.5 + GAME_OFFSET
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
    fontSize: 100,
    fontSizeForText: 48,
    bg: 0xffffff,
    alpha: 0.6,
    showDuration: 800,
    inOutDuration: 200,
}
MESSAGE.y = -MESSAGE.height * 0.5