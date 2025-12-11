export const assetType = {
    images : 'images',
    atlases: 'atlases',
    sounds : 'sounds',
    music : 'music',
    fonts : 'fonts',
}

export const path = {
    images : './images/',
    atlases: './atlases/',
    sounds : './sounds/',
    music : './music/',
    fonts : './fonts/',
}
export const fonts = {
    Title: 'Unbounded-Bold.ttf',
    Subtitle: 'ComforterBrush-Regular.ttf',
    
    Manrope300: 'Manrope-Light.ttf',
    Manrope400: 'Manrope-Regular.ttf',
    Manrope600: 'Manrope-SemiBold.ttf',
    Manrope700: 'Manrope-Bold.ttf',
    Manrope800: 'Manrope-ExtraBold.ttf',
}

export const images = {
    bg_green: 'ground_green.png',
    bg_red: 'ground_red.png',

    button: 'button.png',

    field: 'field_1204x504px.png',
    field_ru: 'field_ru_1204x504px.png',
    spiel_bg: 'spiel_bg_1204x312px.png',
    spiel_top: 'spiel_top_1204x312px.png',
    spiel_top_ru: 'spiel_top_ru_1204x312px.png',
    dolly: 'dolly.png',

    ball: 'wheel_ball_24x24px.png',
    wheel_border: 'wheel_border_728x728px.png',
    wheel_center: 'wheel_center_512x512px.png',
    point: 'point_36x36px.png',

    slot_border: 'slots_border.png',
    slots_bank: 'slots_bank_icon.png',

    img_finger: 'finger.png',
    img_logo: 'logo.png',
}
export const atlases = {
   icon: 'icon.json',
   chip: 'chip.json',
   shop: 'shop.json',
   short_btn: 'short_btn.json',
   field_light: 'field_light.json',
   spiel_light: 'spiel_light.json',
   slots: 'slots.json',
   coin: 'coin.json',
   button_lamps: 'button_lamps.json',
   for_bg: 'for_bg.json',
   options: 'options.json',
}
export const sounds = {
    se_swipe: 'se_swipe.mp3',
    se_click: 'se_click.mp3',
    se_bonus: 'se_bonus.mp3',
    se_ball_roll: 'se_ball_roll.mp3',
    se_ball_stop: 'se_ball_stop.mp3',
    se_coins: 'se_coins.mp3',
    se_coin_to_bank: 'se_coin_to_bank.mp3',
    se_low_money: 'se_low_money.mp3',
    se_set: 'se_set.mp3',
    se_jackpot: 'se_jackpot.mp3',
    se_fortuna: 'se_fortuna.mp3',
    se_clover: 'se_clover.mp3',
    se_line: 'se_line.mp3',
    se_gold: 'se_gold.mp3',
    se_slots_spin: 'se_slots_spin.mp3',
}
export const music = {
    bgm_0: 'bgm_0.mp3',
    bgm_1: 'bgm_1.mp3',
    bgm_2: 'bgm_2.mp3',
    bgm_3: 'bgm_3.mp3',
    bgm_4: 'bgm_4.mp3',
    bgm_5: 'bgm_5.mp3',
}

export const assets = {fonts, images, atlases, sounds, music}
for (let assetType in assets) {
    for (let key in assets[assetType]) {
        assets[assetType][key] = path[assetType] + assets[assetType][key]
    }
}

// check duplicated keys
const allKeys = new Map()
const duplicates = new Set()

for (const [assetTypeName, assetCollection] of Object.entries(assets)) {
    for (const key of Object.keys(assetCollection)) {
        if (allKeys.has(key)) duplicates.add(key)
        allKeys.set(key, assetTypeName)
    }
}

if (duplicates.size > 0) {
    const duplicateDetails = Array.from(duplicates).map(key => {
        const types = []
        for (const [typeName, assetCollection] of Object.entries(assets)) {
            if (Object.prototype.hasOwnProperty.call(assetCollection, key)) {
                types.push(typeName)
            }
        }
        return `"${key}" (${types.join(', ')})`
    }).join(', ')
    
    throw new Error(`Duplicate asset keys detected: ${duplicateDetails}`)
}