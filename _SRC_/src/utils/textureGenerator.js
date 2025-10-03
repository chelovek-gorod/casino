import { BlurFilter, Container, Graphics, RenderTexture } from "pixi.js"
import { getAppRenderer } from "../app/application"

export function getRRTexture(width, height, borderRadius, color, alpha = 1) {
    const appRenderer = getAppRenderer()

    const container = new Container()

    const RR = new Graphics()
    RR.roundRect(0, 0, width, height, borderRadius)
    RR.fill(color)
    RR.alpha = alpha
    container.addChild(RR)
  
    const resolution = appRenderer.resolution ?? 1
    const rt = RenderTexture.create({
        width: Math.ceil(width),
        height: Math.ceil(height),
        resolution,
    })
  
    appRenderer.render({
        container: container,
        target: rt
    })

    RR.destroy()
    container.destroy()
  
    return rt
}

export function getRRTextureWithShadow(
    width, height, borderRadius, color, offsetX = 0, offsetY = 0, alpha = 0.5, blur = 8
) {
    const appRenderer = getAppRenderer()

    const padding = blur * 4 + Math.max(Math.abs(offsetX), Math.abs(offsetY))
    const totalW = width + padding * 2
    const totalH = height + padding * 2

    const container = new Container()

    const shadow = new Graphics()
    shadow.roundRect(padding + offsetX, padding + offsetY, width, height, borderRadius)
    shadow.fill(0x000000)
    
    const blurFilter = new BlurFilter({ 
        strength: blur, 
        quality: 4 
    })
    shadow.filters = [blurFilter]
    shadow.alpha = alpha
    container.addChild(shadow)

    const RR = new Graphics()
    RR.roundRect(padding, padding, width, height, borderRadius)
    RR.fill(color)
    container.addChild(RR)

    const rt = RenderTexture.create({
        width: totalW,
        height: totalH,
        resolution: appRenderer.resolution
    })

    appRenderer.render({
        container: container,
        target: rt
    })

    RR.destroy()
    shadow.destroy()
    container.destroy()

    return [rt, padding]
}