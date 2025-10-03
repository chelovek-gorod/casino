const russianFormatter = new Intl.NumberFormat('ru-RU')
export function formatNumber(number) {
    return russianFormatter.format(number);
}

export function setCursorPointer(target) {
    target.eventMode = 'static'
    target.on('pointerover', () => document.body.style.cursor = 'pointer')
    target.on('pointerout', () => document.body.style.cursor = 'auto')
}
export function removeCursorPointer(target) {
    target.eventMode = 'none'
    target.off('pointerover', () => document.body.style.cursor = 'pointer')
    target.off('pointerout', () => document.body.style.cursor = 'auto')
}

export function getLinesIntersectionPoint(x1, y1, x2, y2, x3, y3, x4, y4) {
    const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1)
    if (denom === 0) return null // Параллельные линии
       
    const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom
    const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom

    if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
        // Возвращаем точку пересечения
        return { x: x1 + ua * (x2 - x1), y: y1 + ua * (y2 - y1) }
    }
    return null // Нет пересечения
}

export function getDistance(sprite, target) {
    let dx = target.x - sprite.x;
    let dy = target.y - sprite.y;
    return Math.sqrt(dx * dx + dy * dy);
}

export function moveSprite(sprite, pathSize) {
    sprite.x += Math.cos(sprite.rotation) * pathSize;
    sprite.y += Math.sin(sprite.rotation) * pathSize;
}

const _2PI = Math.PI * 2
export function turnSpriteToTarget(sprite, target, turnAngle) {
    let pointDirection = Math.atan2(target.y - sprite.y, target.x - sprite.x);
    let deflection = (pointDirection - sprite.rotation) % _2PI;
    if (!deflection) return true;

    if (deflection < -Math.PI) deflection += _2PI;
    if (deflection >  Math.PI) deflection -= _2PI;

    if (Math.abs(deflection) <= turnAngle) sprite.rotation = pointDirection;
    else sprite.rotation += (deflection <  0) ? -turnAngle : turnAngle;
    return false;
}

export function moveToTarget( sprite, target, pathSize ) {
    const distance = getDistance(sprite, target)
    
    if (distance <= pathSize) {
        sprite.position.x = target.position.x
        sprite.position.y = target.position.y

        return true
    }

    const moveRate = pathSize / distance
    sprite.position.x += moveRate * (target.position.x - sprite.position.x)
    sprite.position.y += moveRate * (target.position.y - sprite.position.y)

    return false
}