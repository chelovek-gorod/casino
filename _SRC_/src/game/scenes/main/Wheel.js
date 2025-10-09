import { Container, Sprite } from "pixi.js";
import { tickerAdd, tickerRemove } from "../../../app/application";
import { images } from "../../../app/assets";
import { getLinesIntersectionPoint } from "../../../utils/functions";
import { BUTTON_TEXT, GAME_CONTAINERS, WHEEL, BALL, NUMBERS, SHOW_RESULT_DELAY } from "../../constants";
import { isLangRu, isOnSpin, setSpin, setSpinResult } from "../../state";
import Button from './UI/Button'

const HalfPI = Math.PI * 0.5
const DoublePI = Math.PI * 2

const STATE = {
    start: 'start',
    ball_delay: 'ball_delay',
    ball_on_border: 'ball_on_border',
    ball_on_wood: 'ball_on_wood',
    ball_move_to_target: 'ball_move_to_target',
    slowdown: 'slowdown',
    stop: 'stop',
}

function getRandom(min, max) {
    return min + Math.random() * (max - min);
}

function normalizeAngleDiff(angle) {
    let normalizedAngle = (angle + Math.PI) % (2 * Math.PI)
    if (normalizedAngle <= 0) normalizedAngle += 2 * Math.PI
    return normalizedAngle - Math.PI
}

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

        this.ballMoveAngle = 0
        this.ballRotationRadius = 0
        this.ballSpeed = 0
        this.ballDirectionRate = 0 // 1 or -1
        this.ballDelay = 0
        this.ballTargetAngle = 0

        this.isRotationDirectionClockWise = Math.random() < 0.5
        this.rotationSpeed = 0
        this.targetSpeed = 0

        this.state = STATE.stop

        this.runButton = new Button(
            isLangRu ? BUTTON_TEXT.spin.ru : BUTTON_TEXT.spin.en,
            GAME_CONTAINERS.wheel.pointButton.x, GAME_CONTAINERS.wheel.pointButton.y,
            this.run.bind(this)
        )
        this.addChild(this.runButton)
    }

    run() {
        if (isOnSpin) return

        this.runButton.setActive(false)
        setSpin(true)

        // reverse rotation direction
        this.isRotationDirectionClockWise = !this.isRotationDirectionClockWise

        // reset ball
        this.wheel.removeChild(this.ball)
        this.ballMoveAngle = getRandom(0, DoublePI)
        this.ballRotationRadius = BALL.rotationRadiusStart
        this.ballDelay = getRandom(BALL.delayMin, BALL.delayMax)
        this.ballSpeed = getRandom(BALL.speedMin, BALL.speedMax)
        this.ballDirectionRate = this.isRotationDirectionClockWise ? -1 : 1
        this.updateBallPosition()

        // setup wheel
        this.rotationSpeed = 0
        const rotationSpeed = getRandom(WHEEL.speedMin, WHEEL.speedMax)
        this.targetSpeed = this.isRotationDirectionClockWise ? rotationSpeed : -rotationSpeed

        // run animation
        this.state = STATE.start
        tickerAdd(this)
    }

    stop() {
        this.state = STATE.stop
        this.rotationSpeed = 0
        this.targetSpeed = 0

        this.ballMoveAngle = 0
        this.ballRotationRadius = 0
        this.ballSpeed = 0
        this.ballDirectionRate = 0
        this.ballDelay = 0
        this.ballTargetAngle = 0

        setSpin(false)
        tickerRemove(this)
        this.runButton.setActive(true)
    }

    moveBallForward(deltaTime) {
        this.ballSpeed = Math.max(0, this.ballSpeed - BALL.friction * deltaTime)
        this.ballMoveAngle += this.ballSpeed * this.ballDirectionRate * deltaTime
    }

    moveBallToCenter(deltaTime) {
        const normalized = this.ballSpeed / BALL.speedBias
        const angle = (1 - normalized) * HalfPI 
        const biasSpeed = BALL.gravity * Math.sin(angle) 
        this.ballRotationRadius = Math.max(
            this.ballRotationRadius - biasSpeed * deltaTime, BALL.rotationRadiusEnd
        )
    }

    moveBallToTargetNumber(deltaTime) {      
        if (this.ballTargetAngle === 0) return

        const moveDistance = BALL.speedJump * deltaTime

        let targetAngle = this.ballTargetAngle + this.center.rotation

        let normalAngle = normalizeAngleDiff(targetAngle - this.ballMoveAngle)

        if (Math.abs(normalAngle) <= moveDistance) {
            this.ballMoveAngle = targetAngle
            this.ballTargetAngle = 0
            return
        }

        const step = Math.min(Math.abs(normalAngle), moveDistance)
        this.ballMoveAngle += Math.sign(normalAngle) * step

        /*
        let remaining = normalizeAngleDiff(targetAngle - this.ballMoveAngle)
        if (Math.abs(remaining) <= 1e-6) {
            this.ballMoveAngle = targetAngle;
            this.ballTargetAngle = null;
        }
        */
    }

    updateBallPosition() {
        this.ball.prevX = this.ball.position.x
        this.ball.prevY = this.ball.position.y
        const ballX = Math.cos(this.ballMoveAngle) * this.ballRotationRadius
        const ballY = Math.sin(this.ballMoveAngle) * this.ballRotationRadius
        this.ball.position.set(ballX, ballY)
    }

    checkDeflectorCollisions() {
        let intersection, deflector
        
        WHEEL.deflectors.forEach(localDeflector => {
            if (intersection) return
    
            const localIntersection = getLinesIntersectionPoint(
                this.ball.prevX, this.ball.prevY,
                this.ball.position.x, this.ball.position.y,
                localDeflector.p1.x, localDeflector.p1.y,
                localDeflector.p2.x, localDeflector.p2.y
            )
            if (localIntersection) {
                intersection = localIntersection
                deflector = localDeflector
            }
        })
        
        if (!intersection) return
    
        // apply collision effect with deflector
        if (deflector.isTransverse) this.ballSpeed *= 0.45 + Math.random() * 0.15
        else this.ballSpeed *= 0.65 + Math.random() * 0.1
    }

    getWinningSector() {
        // wheel angle
        let wheelRotation = this.center.rotation % DoublePI
        if (wheelRotation < 0) wheelRotation += DoublePI

        // ball angle
        let ballAngleNormalized = this.ballMoveAngle % DoublePI
        if (ballAngleNormalized < 0) ballAngleNormalized += DoublePI

        // ball angle relative wheel angle
        let ballAngleRelativeToWheel = ballAngleNormalized - wheelRotation
        if (ballAngleRelativeToWheel < 0) ballAngleRelativeToWheel += DoublePI

        // adjust ball angle by top point
        let adjustedAngle = ballAngleRelativeToWheel + HalfPI
        if (adjustedAngle >= DoublePI) adjustedAngle -= DoublePI

        // get index and set result
        const sectorIndex = Math.floor(adjustedAngle / WHEEL.sectorStep)
        setTimeout( setSpinResult, SHOW_RESULT_DELAY, NUMBERS[sectorIndex] )

        // get angle to target sector
        this.ballTargetAngle = -HalfPI + (sectorIndex * WHEEL.sectorStep)
    }

    tick(time) {
        const rotationSpeed = time.deltaTime * this.rotationSpeed

        switch(this.state) {
            case STATE.start :
                if (this.targetSpeed > 0) {
                    this.rotationSpeed = Math.min(
                        this.targetSpeed, this.rotationSpeed + (WHEEL.acceleration * time.deltaTime)
                    )
                } else {
                    this.rotationSpeed = Math.max(
                        this.targetSpeed, this.rotationSpeed - (WHEEL.acceleration * time.deltaTime)
                    )
                }
                this.center.rotation += this.rotationSpeed
                
                if (this.rotationSpeed === this.targetSpeed) {
                    this.state = STATE.ball_delay
                }
            break

            case STATE.ball_delay :
                this.center.rotation += rotationSpeed
                this.ballDelay -= time.deltaMS
                if (this.ballDelay <= 0) {
                    this.wheel.addChild(this.ball)
                    this.state = STATE.ball_on_border
                }
            break

            case STATE.ball_on_border :
                this.center.rotation += rotationSpeed
                this.moveBallForward(time.deltaTime)
                this.updateBallPosition()
                if (this.ballSpeed < BALL.speedBias) {
                    this.state = STATE.ball_on_wood
                }
            break

            case STATE.ball_on_wood :
                this.center.rotation += rotationSpeed
                this.moveBallForward(time.deltaTime)
                this.moveBallToCenter(time.deltaTime)
                this.checkDeflectorCollisions()
                this.updateBallPosition()
                if (this.ballRotationRadius < BALL.rotationRadiusStop) {
                    this.getWinningSector()
                    this.state = STATE.ball_move_to_target
                }
            break

            case STATE.ball_move_to_target :
                this.center.rotation += rotationSpeed
                this.ballMoveAngle += rotationSpeed

                if (this.ballRotationRadius > BALL.rotationRadiusEnd) {
                    this.moveBallToCenter(time.deltaTime)
                }

                if (this.ballTargetAngle !== 0) {
                    this.moveBallToTargetNumber(time.deltaTime)
                }

                this.updateBallPosition()

                if (this.ballTargetAngle === 0 && this.ballRotationRadius === BALL.rotationRadiusEnd) {
                    this.state = STATE.slowdown;
                }
            break

            case STATE.slowdown :               
                if (this.rotationSpeed > 0) {
                    this.rotationSpeed = Math.max(0, this.rotationSpeed - (WHEEL.slowdown * time.deltaTime))
                } else if (this.rotationSpeed < 0) {
                    this.rotationSpeed = Math.min(0, this.rotationSpeed + (WHEEL.slowdown * time.deltaTime))
                } else {
                    this.rotationSpeed = 0
                }

                this.center.rotation += this.rotationSpeed
                this.ballMoveAngle += this.rotationSpeed
                this.updateBallPosition()

                if (this.rotationSpeed === 0) {
                    this.state = STATE.stop
                    this.stop()
                }
            break

            default : return
        }
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