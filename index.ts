const w : number = window.innerWidth
const h : number = window.innerHeight
const scGap : number = 0.02
const sizeFactor : number = 6.9
const barHFactor :number = 3.2
const colors : Array<String> = ["#4CAF50", "#3F51B5", "#9C27B0", "#f44336", "#0091EA"]
const backColor : String = "#BDBDBD"
const delay : number = 20

class ScaleUtil {

    static maxScale(scale : number, i : number, n : number) : number {
        return Math.max(0, scale - i / n)
    }

    static divideScale(scale : number, i : number, n : number) : number {
        return Math.min(1 / n, ScaleUtil.maxScale(scale, i, n)) * n
    }

    static sinify(scale : number) : number {
        return Math.sin(scale * Math.PI)
    }
}

class DrawingUtil {

    static drawRotatingSquareBar(context : CanvasRenderingContext2D, i : number, sf : number) {
        const barSize : number = Math.min(w, h) / sizeFactor
        const barH : number = Math.min(w, h) / barHFactor

        const sc2 : number = ScaleUtil.divideScale(sf, 1, 2)
        const sc2i : number = ScaleUtil.divideScale(sc2, i, 4)
        const hUpdated = barH * sc2i
        context.save()
        context.rotate(i * Math.PI / 2)
        context.fillRect(-barSize / 2, -barSize / 2 - hUpdated, barSize, hUpdated)
        context.restore()
    }

    static drawRotatingSquareBars(context : CanvasRenderingContext2D, scale : number) {
        const size : number = Math.min(w, h) / sizeFactor
        const sf : number = ScaleUtil.sinify(scale)
        const sc1 : number = ScaleUtil.divideScale(sf, 0, 2)
        const updatedSize : number = size * sc1
        context.fillRect(-updatedSize / 2, -updatedSize / 2, updatedSize, updatedSize)
        for (var i = 0; i < 4; i++) {
            DrawingUtil.drawRotatingSquareBar(context, i, sf)
        }
    }

    static drawRSBNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.fillStyle = colors[i]
        context.save()
        context.translate(w / 2, h / 2)
        DrawingUtil.drawRotatingSquareBars(context, scale)
        context.restore()
    }
}
