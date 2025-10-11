import { Container, Sprite } from "pixi.js";
import { tickerAdd, tickerRemove } from "../../../app/application";

function getRandom(min, max) {
    return min + Math.random() * (max - min);
}

export default class Line extends Container {
    constructor() {
        super()

        
    }

    run() {
        
        tickerAdd(this)
    }

    stop() {
        tickerRemove(this)
    }

    tick(time) {
        // time.deltaMS
        // time.deltaTime
    }

    kill() {
        tickerRemove(this)

        while(this.children.length) {
            if ('kill' in this.children[0]) this.children[0].kill()
            else this.children[0].destroy()
        }
        this.destroy()
    }
}