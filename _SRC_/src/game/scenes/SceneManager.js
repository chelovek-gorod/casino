import { Graphics } from "pixi.js"
import { getAppScreen, kill, sceneAdd, sceneRemove, tickerAdd, tickerRemove } from "../../app/application"
import { EventHub, events } from "../../app/events"
import { SCENE_ALPHA_STEP, SCENE_ALPHA_MIN, SCENE_ALPHA_MAX } from "./constants"

let sceneManager = null

export default class SceneManager {
    constructor() {
        if (sceneManager) return sceneManager

        this.scenesQueue = []
        this.screenData = getAppScreen()

        sceneManager = this

        this.blocker = this.createScreenBlocker()

        EventHub.on( events.screenResize, this.screenResize, this)
    }

    screenResize(screenData) {
        this.screenData = screenData
        this.updateScreenBlockerSize()
        if (this.scenesQueue.length > 0) this.updateSceneSize()
    }
    
    updateSceneSize() {
        if ('screenResize' in this.scenesQueue[0]) {
            this.scenesQueue[0].screenResize(this.screenData)
        }
    }

    createScreenBlocker() {
        const blocker = new Graphics()
        blocker.rect(0, 0, this.screenData.width, this.screenData.height)
        blocker.fill(0x000000)
        blocker.alpha = 0.001
        blocker.interactive = true
        blocker.cursor = "default"
        blocker.visible = false
        return blocker
    }
    updateScreenBlockerSize() {
        this.blocker.clear()
        this.blocker.rect(0, 0, this.screenData.width, this.screenData.height)
        this.blocker.fill(0x000000)
    }
    showScreenBlocker() {
        this.blocker.visible = true
        sceneAdd(this.blocker)
        document.body.style.cursor = "default"
        this.blocker.cursor = "default"
    }
    hideScreenBlocker() {
        this.blocker.visible = false
        sceneRemove(this.blocker)
    }

    add( scene ) {
        this.scenesQueue.push(scene)
        if (this.scenesQueue.length === 1) {
            this.updateSceneSize()
            this.scenesQueue[0].alpha = SCENE_ALPHA_MIN
            sceneAdd(this.scenesQueue[0])
        }
        this.showScreenBlocker()
        tickerAdd(this)
    }

    replaceScenes() {
        sceneRemove(this.scenesQueue[0])
        kill(this.scenesQueue[0])
        this.scenesQueue[0] = this.scenesQueue.pop()
        while(this.scenesQueue.length > 1) kill(this.scenesQueue[1])
        this.updateSceneSize()
        this.scenesQueue[0].alpha = SCENE_ALPHA_MIN
        sceneAdd(this.scenesQueue[0])
    }

    scenesReady() {
        tickerRemove(this)
        this.scenesQueue[0].alpha = SCENE_ALPHA_MAX
        this.hideScreenBlocker()
    }

    tick(time) {
        if (this.scenesQueue.length > 1) {
            this.scenesQueue[0].alpha -= time.elapsedMS * SCENE_ALPHA_STEP
            if (this.scenesQueue[0].alpha <= SCENE_ALPHA_MIN) this.replaceScenes()
            return
        } else {
            this.scenesQueue[0].alpha += time.elapsedMS * SCENE_ALPHA_STEP
            if (this.scenesQueue[0].alpha >= SCENE_ALPHA_MAX) this.scenesReady()
        }
    }

    kill() {
        EventHub.off( events.screenResize, this.screenResize, this)
        while(this.scenesQueue.length) kill(this.scenesQueue[0])
        if (this.blocker) {
            sceneRemove(this.blocker)
            kill(this.blocker)
        }
    }
}