import { EventHub, events } from "../app/events";
import { SCENE_NAME } from "./constants";
import Roulette from "./scenes/casino/Roulette";
import Menu from "./scenes/menu/Menu";
import SceneManager from "./scenes/SceneManager";

let sceneManager = null

export function startGame() {
    sceneManager = new SceneManager()
    sceneManager.add( new Menu() )

    EventHub.on(events.startScene, (sceneName) => {
        switch (sceneName) {
            case SCENE_NAME.Roulette : return sceneManager.add( new Roulette() )
            case SCENE_NAME.Slots : return sceneManager.add( new Roulette() )
            default : return sceneManager.add( new Menu() )
        }
    })
}

