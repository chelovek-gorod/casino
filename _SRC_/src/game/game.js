import { EventHub, events } from "../app/events";
import { SCENE_NAME } from "./scenes/constants";
import SceneManager from "./scenes/SceneManager";
import LoadScene from "./scenes/load/LoadScene";
import MenuScene from "./scenes/menu/MenuScene";
import RouletteScene from "./scenes/roulette/RouletteScene";
import SlotsScene from "./scenes/slots/SlotsScene";

let sceneManager = null

export function startGame() {
    sceneManager = new SceneManager()
    sceneManager.add( new LoadScene() )

    EventHub.on(events.startScene, (sceneName) => {
        switch (sceneName) {
            case SCENE_NAME.Roulette : return sceneManager.add( new RouletteScene() )
            case SCENE_NAME.Slots : return sceneManager.add( new SlotsScene() )
            default : return sceneManager.add( new MenuScene() )
        }
    })
}

