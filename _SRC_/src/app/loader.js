import { Assets } from 'pixi.js'
import { path, fonts, images, atlases, sounds, voices, music, loadConfig } from './assets'
import { initFontStyles, styles } from './styles'
import { playMusic, stopMusic, setMusic } from './sound'
import LoadScene from '../game/scenes/loading/LoadScene'

function isString( value ) {
    return (typeof value === 'string' || value instanceof String)
}

export function uploadAssets( loadingCallback ) {
    const assetData = {fonts, images, atlases, sounds, voices, music}
    // count assets and update assets paths
    let assetCount = 0
    for (let assetType in assetData) {
        if (assetType === 'images' || assetType === 'atlases' || assetType === 'sounds' || assetType === 'voices') {
            assetCount += Object.keys(assetData[assetType]).length
        }
        for (let key in assetData[assetType]) {
            assetData[assetType][key] = path[assetType] + assetData[assetType][key]
        }
    }
    let progressPerAsset = 100 / assetCount

    // preload fonts if it is first loading
    if (!styles.isReady) {
        Assets.addBundle('fonts', fonts)
        Assets.loadBundle('fonts').then( fontData => {
            // update font values by font family
            for(let key in fontData) fonts[key] = fontData[key].family
            initFontStyles()
            initLoader()
        })
    } else {
        initLoader()
    }
    
    // prepare loading scene
    let loadScene = null
    function initLoader() {
        if ('musicKey' in loadConfig) {
            setMusic(assetData.music[loadConfig.musicKey])
            //playMusic()
        }

        if ('imageKey' in loadConfig) {
            // check is a tile loader BG image
            const isTile = ('isImageTile' in loadConfig) && loadConfig.isImageTile

            // check is already loaded or not
            if ( isString(images[loadConfig.imageKey]) ) {
                Assets.add( {alias: loadConfig.imageKey, src: assetData.images[loadConfig.imageKey]} )
                Assets.load( loadConfig.imageKey ).then(data => {
                    images[loadConfig.imageKey] = data
                    startLoading(loadConfig.imageKey, isTile)
                })
            } else startLoading(loadConfig.imageKey, isTile)
        } else {
            startLoading()
        }
    }

    const multiPacksMap = new Map()

    // start load assets
    function startLoading(imageKey, isTile) {
        loadScene = new LoadScene(imageKey, isTile)

        for (let assetType in assetData) {
            if (assetType === 'images' || assetType === 'atlases'
            || assetType === 'sounds' || assetType === 'voices') {
                for (let assetKey in assetData[assetType]) {
                    if (assetType === 'images' && !isString(assetData[assetType][assetKey])) {
                        sourceLoaded()
                    } else {
                        Assets.add( {alias: assetKey, src: assetData[assetType][assetKey]} )
                        Assets.load( assetKey ).then(data => {
                            if ('data' in data && 'related_multi_packs' in data.data.meta
                            && 'animations' in data.data) {
                                multiPacksMap.set(assetKey, data.data.animations)
                            }
                            assetData[assetType][assetKey] = data
                            sourceLoaded()
                        })
                    }
                }
            }
        }
    }

    // asset is loaded
    let loadCount = 0
    function sourceLoaded() {
        loadCount++
        loadScene.update(progressPerAsset * loadCount)
        if (assetCount === loadCount) {
            multiPacksMap.forEach( (animations, atlasKey) => {
                // update all textures in all animations at MultiPack atlas
                for(let animationName in atlases[atlasKey].animations) {
                    atlases[atlasKey].animations[animationName].forEach( (frame, index) => {
                        if (!!frame) return // texture is already loaded, go to next frame
                        const texture = Assets.cache.get(animations[animationName][index])
                        atlases[atlasKey].animations[animationName][index] = texture
                    })
                }
            })
            multiPacksMap.clear()

            stopMusic()
            loadScene.kill()
            loadingCallback()
        }
    }
}