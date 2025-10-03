import Main from "./scenes/main/Main";
import SceneManager from "./SceneManager";

let sceneManager = null

export function startGame() {
    sceneManager = new SceneManager()
    sceneManager.add( new Main() )
}