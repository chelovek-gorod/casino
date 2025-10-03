import { getAppScreen, sceneAdd, sceneRemove, tickerAdd, tickerRemove } from "../app/application"
import { EventHub, events } from "../app/events"
import { SCENE_ALPHA_STEP } from "./constants"

let sceneManager = null

export default class SceneManager {
    constructor() {
        if (sceneManager) return sceneManager

        this.currentScene = null
        this.nextScene = null
        this.screenData = getAppScreen()

        sceneManager = this

        EventHub.on( events.screenResize, this.screenResize, this)
    }

    screenResize(screenData) {
        this.screenData = screenData
        this.updateSceneSize()
    }
    
    updateSceneSize() {
        if ('screenResize' in this.currentScene) {
            this.currentScene.screenResize(this.screenData)
        }
    }

    add( scene ) {
        if (this.currentScene) this.nextScene = scene
        else {
            this.currentScene = scene
            this.updateSceneSize()
            this.currentScene.alpha = 0
            sceneAdd(this.currentScene)
        }
        tickerAdd(this)
    }

    replaceScenes() {
        sceneRemove(this.currentScene)
        this.currentScene.kill()
        this.currentScene = this.nextScene
        this.updateSceneSize()
        this.nextScene = null
        this.currentScene.alpha = 0
        sceneAdd(this.currentScene)
    }

    scenesReady() {
        tickerRemove(this)
        this.currentScene.alpha = 1
    }

    tick(time) {
        if (this.nextScene && this.currentScene) {
            this.currentScene.alpha -= time.elapsedMS * SCENE_ALPHA_STEP
            if (this.currentScene.alpha <= 0) this.replaceScenes()
            return
        } else {
            this.currentScene.alpha += time.elapsedMS * SCENE_ALPHA_STEP
            if (this.currentScene.alpha >= 1) this.scenesReady()
        }
    }
}