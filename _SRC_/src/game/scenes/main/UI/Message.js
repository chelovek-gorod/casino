import { Container, Graphics } from "pixi.js";

export default class Message extends Container {
    constructor() {
        super()

        this.bg = new Graphics()
        this.text = new Text()
        // this.addChild(this.bg, this.text)
    }

    show() {

    }

    tick(time) {
        
    }
}