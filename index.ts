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

class Stage {

    canvas : HTMLCanvasElement = document.createElement('canvas')
    context : CanvasRenderingContext2D

    initCanvas() {
        this.canvas.width = w
        this.canvas.height = h
        this.context = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)
    }

    render() {
        this.context.fillStyle = backColor
        this.context.fillRect(0, 0, w, h)
    }

    handleTap() {
        this.canvas.onmousedown = () => {

        }
    }

    static init() {
        const stage : Stage = new Stage()
        stage.initCanvas()
        stage.render()
        stage.handleTap()
    }
}

class State {

    scale : number = 0
    dir : number = 0
    prevScale : number = 0

    update(cb : Function) {
        this.scale += (scGap * this.dir)
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            cb()
        }
    }

    startUpdating(cb : Function) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale
            cb()
        }
    }
}

class Animator {

    animated : boolean = false
    interval : number

    start(cb : Function) {
        if (!this.animated) {
            this.animated = true
            this.interval = setInterval(cb, delay)
        }
    }

    stop() {
        if (this.animated) {
            this.animated = false
            clearInterval(this.interval)
        }
    }
}


class RSBNode {

    state : State = new State()
    prev : RSBNode = null
    next : RSBNode = null

    constructor(public i : number) {
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < colors.length - 1) {
            this.next = new RSBNode(this.i + 1)
            this.next.prev = this
        }
    }

    draw(context : CanvasRenderingContext2D) {
        DrawingUtil.drawRotatingSquareBar(context, this.i, this.state.scale)
    }

    update(cb : Function) {
        this.state.update(cb)
    }

    startUpdating(cb : Function) {
        this.state.startUpdating(cb)
    }

    getNext(dir : number, cb : Function) : RSBNode {
        var curr : RSBNode = this.prev
        if (dir == 1) {
            curr = this.next
        }
        if (curr != null) {
            return curr
        }
        cb()
        return this
    }
}
