import { Container, Sprite } from "pixi.js";
import { tickerAdd } from "../../../app/application";
import { images } from "../../../app/assets";
import { GAME_CONTAINERS, WHEEL } from "../../constants";
import { isOnSpin, setSpin } from "../../state";
import Button from './UI/Button'

export default class Wheel extends Container {
    constructor() {
        super()

        this.wheel = new Container()
        this.wheel.position.set(
            GAME_CONTAINERS.wheel.pointWheel.x, GAME_CONTAINERS.wheel.pointWheel.y
        )
        this.addChild(this.wheel)

        this.border = new Sprite(images.wheel_border)
        this.border.anchor.set(0.5)
        this.wheel.addChild(this.border)

        this.center = new Sprite(images.wheel_center)
        this.center.anchor.set(0.5)
        this.wheel.addChild(this.center)

        this.ball = new Sprite(images.ball)
        this.ball.anchor.set(0.5)
        this.ball.position.set(WHEEL.startBallOrbitRadius, 0)
        // this.wheel.addChild(this.ball)

        this.ballAngle = 0
        this.ballRadius = WHEEL.startBallOrbitRadius
        this.ballSpeed = WHEEL.ballSpeed

        this.isRotationDirectionClockWise = Math.random() < 0.5
        this.rotationSpeed = this.isRotationDirectionClockWise
        this.setRotation()

        this.runButton = new Button(
            "КРУТИМ", GAME_CONTAINERS.wheel.pointButton.x, GAME_CONTAINERS.wheel.pointButton.y,
            this.run.bind(this)
        )
        this.addChild(this.runButton)

        // tickerAdd(this)
    }

    setRotation() {
        this.isRotationDirectionClockWise = !this.isRotationDirectionClockWise
        this.rotationSpeed = this.isRotationDirectionClockWise ? WHEEL.rotationSpeed : -WHEEL.rotationSpeed
        this.ballSpeed = this.isRotationDirectionClockWise ? -WHEEL.ballSpeed : WHEEL.ballSpeed
    }

    setBallInSector(number) {
        const index = WHEEL.numbers.indexOf(number)

        // Устанавливаем фиксированный радиус для шарика
        this.ballRadius = WHEEL.endBallOrbitRadius
            
        // Для числа 0 - самый верх (угол -π/2 или 3π/2 радиан)
        if (index === 0) {
            this.ballAngle = -Math.PI / 2; // или 3 * Math.PI / 2
        } else {
            // Для чисел 1-36 вычисляем угол на основе секторов
            // Сектора идут по часовой стрелке, начиная с верха
            // Номер 1 соответствует углу -π/2 + sectorStep и т.д.
            this.ballAngle = -Math.PI / 2 + (index * WHEEL.sectorStep);
        }

        // Вычисляем позицию шарика по полярным координатам
        const x = Math.cos(this.ballAngle) * this.ballRadius;
        const y = Math.sin(this.ballAngle) * this.ballRadius;

        // Устанавливаем позицию шарика
        this.ball.position.set(x, y);

        // Сбрасываем скорость шарика, чтобы он оставался на месте
        this.ballSpeed = 0;
    }

    run() {
        if (isOnSpin) return

        this.runButton.setActive(false)
        setSpin(true)
        this.wheel.addChild(this.ball)
        tickerAdd(this)
    }

    tick(time) {
        this.center.rotation += time.deltaTime * this.rotationSpeed

        this.ballAngle += this.ballSpeed
        const x = Math.cos(this.ballAngle) * this.ballRadius
        const y = Math.sin(this.ballAngle) * this.ballRadius
        this.ball.position.set(x, y)
    }
}