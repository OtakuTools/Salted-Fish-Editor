<template>
  <v-container id="ieContainer">
    <v-row>
      <v-col cols="12" style="text-align: center; padding: 5px 0 0 0">
        <img v-show="editMode === 'crop'" id="imageCrop" :src="cropImage" width="800" height="600" />
        <canvas v-show="editMode !== 'crop'" id="imageEditor" style="background-color: #ddd; max-width: 800px; max-height: 600px;" width="800" height="600"></canvas>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" style="text-align: center">
        <v-menu
          :v-model="picker.pen"
          :close-on-content-click="false"
          :nudge-width="200"
          offset-y
        >
          <template v-slot:activator="{ on }">
            <v-btn depressed color="white" v-on="on" @click="handleMode('pen')" v-bind:class="{'v-btn--active': editMode === 'pen'}">
              <v-icon>mdi-draw</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  {{'色彩'}}
                  <v-btn v-for="(c, index) in colorOpt" :key="index" :color="c" dense depressed tile small icon @click="colorSelector('pen', c)">
                    <v-icon v-if="color.pen !== c">mdi-checkbox-blank-circle</v-icon>
                    <v-icon v-else>mdi-record-circle</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  {{'粗细'}}
                  <v-btn v-for="(width, index) in widthOpt" :key="index" :color="lineWidth.pen === width? 'primary' : 'black'" dense depressed tile small icon @click="widthSelector('pen', width)">
                    <v-icon>{{`mdi-numeric-${width}-box-outline`}}</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-menu>

        <v-menu
          :v-model="picker.line"
          :close-on-content-click="false"
          :nudge-width="200"
          offset-y
        >
          <template v-slot:activator="{ on }">
            <v-btn depressed color="white" v-on="on" @click="handleMode('line')" v-bind:class="{'v-btn--active': editMode === 'line'}">
              <v-icon>mdi-minus</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  {{'色彩'}}
                  <v-btn v-for="(c, index) in colorOpt" :key="index" :color="c" dense depressed tile small icon @click="colorSelector('line', c)">
                    <v-icon v-if="color.line !== c">mdi-checkbox-blank-circle</v-icon>
                    <v-icon v-else>mdi-record-circle</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  {{'粗细'}}
                  <v-btn v-for="(width, index) in widthOpt" :key="index" :color="lineWidth.line === width? 'primary' : 'black'" dense depressed tile small icon @click="widthSelector('line', width)">
                    <v-icon>{{`mdi-numeric-${width}-box-outline`}}</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-menu>

        <v-menu
          :v-model="picker.rectangle"
          :close-on-content-click="false"
          :nudge-width="200"
          offset-y
        >
          <template v-slot:activator="{ on }">
            <v-btn depressed color="white" v-on="on" @click="handleMode('rectangle')" v-bind:class="{'v-btn--active': editMode === 'rectangle'}">
              <v-icon>mdi-rectangle-outline</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  {{'色彩'}}
                  <v-btn v-for="(c, index) in colorOpt" :key="index" :color="c" dense depressed tile small icon @click="colorSelector('rectangle', c)">
                    <v-icon v-if="color.rectangle !== c">mdi-checkbox-blank-circle</v-icon>
                    <v-icon v-else>mdi-record-circle</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  {{'粗细'}}
                  <v-btn v-for="(width, index) in widthOpt" :key="index" :color="lineWidth.rectangle === width? 'primary' : 'black'" dense depressed tile small icon @click="widthSelector('rectangle', width)">
                    <v-icon>{{`mdi-numeric-${width}-box-outline`}}</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-menu>

        <v-menu
          :v-model="picker.circle"
          :close-on-content-click="false"
          :nudge-width="200"
          offset-y
        >
          <template v-slot:activator="{ on }">
            <v-btn depressed color="white" v-on="on" @click="handleMode('circle')" v-bind:class="{'v-btn--active': editMode === 'circle'}">
              <v-icon>mdi-circle-outline</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  {{'色彩'}}
                  <v-btn v-for="(c, index) in colorOpt" :key="index" :color="c" dense depressed tile small icon @click="colorSelector('circle', c)">
                    <v-icon v-if="color.circle !== c">mdi-checkbox-blank-circle</v-icon>
                    <v-icon v-else>mdi-record-circle</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  {{'粗细'}}
                  <v-btn v-for="(width, index) in widthOpt" :key="index" :color="lineWidth.circle === width? 'primary' : 'black'" dense depressed tile small icon @click="widthSelector('circle', width)">
                    <v-icon>{{`mdi-numeric-${width}-box-outline`}}</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-menu>

        <!-- <v-btn depressed color="white" @click="handleMode('colorpicker')">
          <v-icon>mdi-eyedropper-variant</v-icon>
        </v-btn> -->

        <v-btn depressed color="white" @click="handleMode('move')" v-bind:class="{'v-btn--active': editMode === 'move'}">
          <v-icon>mdi-hand-right</v-icon>
        </v-btn>

        <v-btn depressed color="white" @click="handleMode('crop')" v-bind:class="{'v-btn--active': editMode === 'crop'}">
          <v-icon>mdi-crop</v-icon>
        </v-btn>

        <v-btn depressed color="white" @click="handleMode('undo')" :disabled="current_obj_idx < 0">
          <v-icon>mdi-undo</v-icon>
        </v-btn>

        <v-btn depressed color="white" @click="handleMode('redo')" :disabled="current_obj_idx >= objQueue.length - 1">
          <v-icon>mdi-redo</v-icon>
        </v-btn>

        <v-btn depressed color="white" @click="handleMode('save')">
          <v-icon color="green">mdi-check</v-icon>
        </v-btn>

        <v-btn depressed color="white" @click="handleMode('cancel')">
          <v-icon color="red">mdi-close</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
/* #imageEditor {
  width: 100%;
  height: 600px;
} */
</style>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
// import elementResizeDetectorMaker from 'element-resize-detector'
const elementResizeDetectorMaker = require('element-resize-detector')

class Point {
  x: number
  y: number
  constructor (x: number, y: number) {
    this.x = x
    this.y = y
  }
}

class Pen {
  name = 'pen'
  pointList: Array<Point>
  lineWidth: string
  color: string
  lineCap = 'round'
  show = true
  constructor (obj: any) {
    this.pointList = obj.pointList
    this.lineWidth = obj.lineWidth
    this.color = obj.color
  }
}

class Line {
  name = 'line'
  startPoint: Point
  endPoint: Point
  lineWidth: string
  color: string
  lineCap = 'round'
  show = true
  constructor (obj: any) {
    this.startPoint = obj.startPoint
    this.endPoint = obj.endPoint
    this.lineWidth = obj.lineWidth
    this.color = obj.color
  }
}

class Rectangle {
  name = 'rectangle'
  startPoint: Point
  width: number
  height: number
  lineWidth: string
  color: string
  show = true
  constructor (obj: any) {
    this.startPoint = obj.startPoint
    this.width = obj.width
    this.height = obj.height
    this.lineWidth = obj.lineWidth
    this.color = obj.color
  }
}

class Circle {
  name = 'circle'
  startPoint: Point
  centerPoint: Point
  radiusX: number
  radiusY: number
  rotation = 0
  startAngle = 0
  endAngle: number = Math.PI * 2
  lineWidth: string
  color: string
  show = true
  constructor (obj: any) {
    this.startPoint = obj.startPoint
    this.centerPoint = obj.startPoint
    this.radiusX = obj.radiusX
    this.radiusY = obj.radiusY
    this.lineWidth = obj.lineWidth
    this.color = obj.color
  }
}

class Picture {
  name = 'picture'
  data: any
  startPoint: Point
  width: number
  height: number
  show = true
  constructor (obj: any) {
    this.data = obj.data
    this.startPoint = obj.startPoint
    this.width = obj.width
    this.height = obj.height
  }
}

class ColorRec {
  pen = '#FF0000'
  line = '#FF0000'
  rectangle = '#FF0000'
  circle = '#FF0000'
}

class WidthRec {
  pen = 1
  line = 1
  rectangle = 1
  circle = 1
}

class Picker {
  pen = false
  line = false
  rectangle = false
  circle = false
}

@Component
export default class ImageEditor extends Vue {
  container: any = null
  ctx: any = null
  cropper: any = null

  // offscreen_canvas : any = document.createElement('canvas')

  editMode: any = ''

  isDrawing = false
  startPosition: any = { x: 0, y: 0 }

  objQueue: Array<any> = []
  current_obj_idx = -1

  colorOpt: Array<string> = ['#FF0000', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#673AB7', '#FF9800']
  widthOpt: Array<number> = [1, 2, 3, 4, 5, 6, 7]

  picker: Picker = new Picker()
  color: ColorRec = new ColorRec()
  lineWidth: WidthRec = new WidthRec()

  imgReader: any = null
  cropImage: any = ''

  imageScale = 1

  originImageWidth = 0
  originImageHeight = 0
  maxViewPortWidth = 800
  maxViewPortHeight = 600
  viewPortWidth = 800
  viewPortHeight = 600
  viewPortOffset: Point = new Point(0, 0)

  moveDistance: any = new Point(0, 0)
  lastMovePosition: any = new Point(0, 0)

  mounted () {
    this.container = document.getElementById('imageEditor')
    this.ctx = this.container.getContext('2d')
    this.ctx.imageSmoothingEnabled = false
    this.initImageReader()

    this.container.addEventListener('mousedown', this.mouseDownHandler, false)
    this.container.addEventListener('mousemove', this.mouseMoveHandler, false)
    this.container.addEventListener('mouseup', this.mouseUpHandler, false)
    this.container.addEventListener('mousewheel', this.mouseScrollHandler, false)
    document.body.addEventListener('paste', this.pasteFromClipboard, false)
  }

  reset (): void {
    this.moveDistance = new Point(0, 0)
    this.editMode = ''
    this.isDrawing = false

    this.objQueue = []
    this.current_obj_idx = -1

    if (this.cropper) {
      this.cropper.destroy()
    }
    this.cropper = null
    this.container.width = 800
    this.container.height = 600
    this.originImageWidth = 0
    this.originImageHeight = 0
    this.maxViewPortWidth = 800
    this.maxViewPortHeight = 600
    this.viewPortWidth = 800
    this.viewPortHeight = 600
    this.viewPortOffset.x = 0
    this.viewPortOffset.y = 0
    this.imageScale = 1
  }

  beforeDestroy () {
    this.container.removeEventListener('mousedown', this.mouseDownHandler)
    this.container.removeEventListener('mousemove', this.mouseMoveHandler)
    this.container.removeEventListener('mouseup', this.mouseUpHandler)
    this.container.removeEventListener('mousewheel', this.mouseScrollHandler)
    document.body.removeEventListener('paste', this.pasteFromClipboard)
  }

  colorSelector (type: string, color: string): void {
    // this.color[type] = color
  }

  widthSelector (type: string, width: number): void {
    // this.lineWidth[type] = width
  }

  updatePickerShow (type: string): void {
    this.picker = new Picker()
    // this.picker[type] = true
  }

  handleMode (val: string): void {
    if (val === 'undo') {
      if (this.current_obj_idx >= 0) {
        this.objQueue[this.current_obj_idx].show = false
        --this.current_obj_idx
        this.clearCanvas()
        this.renderObj()
      }
    } else if (val === 'redo') {
      if (this.current_obj_idx < this.objQueue.length - 1) {
        ++this.current_obj_idx
        this.objQueue[this.current_obj_idx].show = true
        this.clearCanvas()
        this.renderObj()
      }
    } else if (val === 'crop') {
      this.editMode = val
      if (!this.cropper) {
        this.cropImage = this.container.toDataURL('image/png')
        this.$nextTick(() => {
          this.cropper = new window.Cropper(document.getElementById('imageCrop'), {
            viewMode: 1,
            autoCrop: false,
            background: false
          })
        })
      }
    } else if (val === 'save') {
      this.saveImage()
    } else if (val === 'cancel') {
      this.cancel()
    } else {
      this.editMode = val
      this.updatePickerShow(val)
      if (this.cropper) {
        this.cropper.destroy()
      }
      this.cropper = null
      this.$nextTick(() => {
        this.clearCanvas()
        this.renderObj()
      })
    }
  }

  handleMousePosition (e: MouseEvent): Point {
    e.preventDefault()
    return new Point(e.offsetX, e.offsetY)
  }

  coordinateTrans (mode: string, pos: number): number {
    return pos + this.moveDistance[mode]
  }

  getAbsolutePos (mode: string, pos: number): number {
    return 0
    // return pos * this.imageScale + this.viewPortOffset[mode]
  }

  clearCanvas (): void {
    this.container.width = this.container.width
  }

  renderObj (): void {
    const qlen: number = this.objQueue.length
    // 离屏渲染
    for (let i = 0; i < qlen; i++) {
      const obj = this.objQueue[i]
      if (!obj.show) {
        continue
      }
      switch (obj.name) {
        case 'pen':
          const pointList: Array<Point> = obj.pointList
          const startPoint: Point = pointList[0]
          const endPoint: Point = pointList[pointList.length - 1]
          const len: number = pointList.length
          this.ctx.beginPath()
          if (len >= 4) {
            this.ctx.moveTo(
              this.coordinateTrans('x', startPoint.x),
              this.coordinateTrans('y', startPoint.y)
            )
            for (let i = 3; i < len; i += 2) {
              const ctrlPoint1: Point = pointList[i - 2]
              const ctrlPoint2: Point = pointList[i - 1]
              const targ_x: number = (pointList[i - 1].x + pointList[i].x) / 2
              const targ_y: number = (pointList[i - 1].y + pointList[i].y) / 2
              this.ctx.bezierCurveTo(
                this.coordinateTrans('x', ctrlPoint1.x),
                this.coordinateTrans('y', ctrlPoint1.y),
                this.coordinateTrans('x', ctrlPoint2.x),
                this.coordinateTrans('y', ctrlPoint2.y),
                this.coordinateTrans('x', targ_x),
                this.coordinateTrans('y', targ_y)
              )
            }
          } else if (len == 3) {
            const ctrlPoint: Point = pointList[1]
            this.ctx.moveTo(
              this.coordinateTrans('x', startPoint.x),
              this.coordinateTrans('y', startPoint.y)
            )
            this.ctx.quadraticCurveTo(
              this.coordinateTrans('x', ctrlPoint.x),
              this.coordinateTrans('y', ctrlPoint.y),
              this.coordinateTrans('x', endPoint.x),
              this.coordinateTrans('y', endPoint.y)
            )
          } else {
            this.ctx.moveTo(
              this.coordinateTrans('x', startPoint.x),
              this.coordinateTrans('y', startPoint.y)
            )
            this.ctx.lineTo(
              this.coordinateTrans('x', endPoint.x),
              this.coordinateTrans('y', endPoint.y)
            )
          }
          this.ctx.lineCap = obj.lineCap
          this.ctx.lineWidth = obj.lineWidth
          this.ctx.strokeStyle = obj.color
          this.ctx.stroke()
          this.ctx.closePath()
          break
        case 'line':
          this.ctx.beginPath()
          this.ctx.moveTo(
            this.coordinateTrans('x', obj.startPoint.x),
            this.coordinateTrans('y', obj.startPoint.y)
          )
          this.ctx.lineTo(
            this.coordinateTrans('x', obj.endPoint.x),
            this.coordinateTrans('y', obj.endPoint.y)
          )
          this.ctx.lineCap = obj.lineCap
          this.ctx.lineWidth = obj.lineWidth
          this.ctx.strokeStyle = obj.color
          this.ctx.stroke()
          this.ctx.closePath()
          break
        case 'rectangle':
          this.ctx.beginPath()
          this.ctx.rect(
            this.coordinateTrans('x', obj.startPoint.x),
            this.coordinateTrans('y', obj.startPoint.y),
            obj.width, obj.height
          )
          this.ctx.lineWidth = obj.lineWidth
          this.ctx.strokeStyle = obj.color
          this.ctx.stroke()
          this.ctx.closePath()
          break
        case 'circle':
          this.ctx.beginPath()
          this.ctx.ellipse(
            this.coordinateTrans('x', obj.centerPoint.x),
            this.coordinateTrans('y', obj.centerPoint.y),
            obj.radiusX, obj.radiusY, obj.rotation, obj.startAngle, obj.endAngle
          )
          this.ctx.lineWidth = obj.lineWidth
          this.ctx.strokeStyle = obj.color
          this.ctx.stroke()
          this.ctx.closePath()
          break
        case 'picture':
          this.ctx.drawImage(
            obj.data,
            this.coordinateTrans('x', obj.startPoint.x),
            this.coordinateTrans('y', obj.startPoint.y),
            obj.width, obj.height
          )
          break
      }
    }
  }

  removeUnvisibleObj (): void {
    while (this.objQueue.length > this.current_obj_idx + 1) {
      this.objQueue.pop()
    }
  }

  mouseDownHandler (e: MouseEvent): void {
    if (this.isDrawing) return
    this.isDrawing = true

    const position: Point = this.handleMousePosition(e)
    this.removeUnvisibleObj()
    switch (this.editMode) {
      case 'pen':
        const penObj: Pen = new Pen({
          pointList: [new Point(this.getAbsolutePos('x', position.x), this.getAbsolutePos('y', position.y))],
          lineWidth: this.lineWidth.pen,
          color: this.color.pen
        })
        this.objQueue.push(penObj)
        this.current_obj_idx++
        break
      case 'line':
        const lineObj: Line = new Line({
          startPoint: new Point(this.getAbsolutePos('x', position.x), this.getAbsolutePos('y', position.y)),
          endPoint: new Point(this.getAbsolutePos('x', position.x), this.getAbsolutePos('y', position.y)),
          lineWidth: this.lineWidth.line,
          color: this.color.line
        })
        this.objQueue.push(lineObj)
        this.current_obj_idx++
        break
      case 'rectangle':
        const rectObj: Rectangle = new Rectangle({
          startPoint: new Point(this.getAbsolutePos('x', position.x), this.getAbsolutePos('y', position.y)),
          width: 1,
          height: 1,
          lineWidth: this.lineWidth.rectangle,
          color: this.color.rectangle
        })
        this.objQueue.push(rectObj)
        this.current_obj_idx++
        break
      case 'circle':
        const circObj: Circle = new Circle({
          startPoint: new Point(this.getAbsolutePos('x', position.x), this.getAbsolutePos('y', position.y)),
          radiusX: 1,
          radiusY: 1,
          lineWidth: this.lineWidth.circle,
          color: this.color.circle
        })
        this.objQueue.push(circObj)
        this.current_obj_idx++
        break
      case 'move':
        this.lastMovePosition = new Point(position.x, position.y)
        break
    }
    this.clearCanvas()
    this.renderObj()
  }

  mouseMoveHandler (e: MouseEvent): void {
    if (!this.isDrawing) return
    const position: Point = this.handleMousePosition(e)
    switch (this.editMode) {
      case 'pen':
        const penObj: Pen = this.objQueue.pop()
        penObj.pointList.push(new Point(this.getAbsolutePos('x', position.x), this.getAbsolutePos('y', position.y)))
        this.objQueue.push(penObj)
        break
      case 'line':
        const lineObj: Line = this.objQueue.pop()
        lineObj.endPoint = new Point(this.getAbsolutePos('x', position.x), this.getAbsolutePos('y', position.y))
        this.objQueue.push(lineObj)
        break
      case 'rectangle':
        const rectObj: Rectangle = this.objQueue.pop()
        rectObj.width = this.getAbsolutePos('x', position.x) - rectObj.startPoint.x
        rectObj.height = this.getAbsolutePos('y', position.y) - rectObj.startPoint.y
        this.objQueue.push(rectObj)
        break
      case 'circle':
        const circObj: Circle = this.objQueue.pop()
        circObj.radiusX = Math.abs(this.getAbsolutePos('x', position.x) - circObj.startPoint.x) / 2
        circObj.radiusY = Math.abs(this.getAbsolutePos('y', position.y) - circObj.startPoint.y) / 2
        circObj.centerPoint = new Point((this.getAbsolutePos('x', position.x) + circObj.startPoint.x) / 2, (this.getAbsolutePos('y', position.y) + circObj.startPoint.y) / 2)
        this.objQueue.push(circObj)
        break
      case 'move':
        this.moveDistance.x += (position.x - this.lastMovePosition.x)
        this.moveDistance.y += (position.y - this.lastMovePosition.y)
        this.lastMovePosition = new Point(position.x, position.y)
        this.viewPortOffset.x = -this.moveDistance.x
        this.viewPortOffset.y = -this.moveDistance.y
        break
    }
    this.clearCanvas()
    this.renderObj()
  }

  mouseUpHandler (e: MouseEvent): void {
    if (!this.isDrawing) return
    this.isDrawing = false
    const position: Point = this.handleMousePosition(e)
    switch (this.editMode) {
      case 'pen':
        const penObj: Pen = this.objQueue.pop()
        penObj.pointList.push(new Point(this.getAbsolutePos('x', position.x), this.getAbsolutePos('y', position.y)))
        this.objQueue.push(penObj)
        break
      case 'line':
        const lineObj: Line = this.objQueue.pop()
        lineObj.endPoint = new Point(this.getAbsolutePos('x', position.x), this.getAbsolutePos('y', position.y))
        this.objQueue.push(lineObj)
        break
      case 'rectangle':
        const rectObj: Rectangle = this.objQueue.pop()
        rectObj.width = this.getAbsolutePos('x', position.x) - rectObj.startPoint.x
        rectObj.height = this.getAbsolutePos('y', position.y) - rectObj.startPoint.y
        this.objQueue.push(rectObj)
        break
      case 'circle':
        const circObj: Circle = this.objQueue.pop()
        circObj.radiusX = Math.abs(this.getAbsolutePos('x', position.x) - circObj.startPoint.x) / 2
        circObj.radiusY = Math.abs(this.getAbsolutePos('y', position.y) - circObj.startPoint.y) / 2
        circObj.centerPoint = new Point((this.getAbsolutePos('x', position.x) + circObj.startPoint.x) / 2, (this.getAbsolutePos('y', position.y) + circObj.startPoint.y) / 2)
        this.objQueue.push(circObj)
        break
      case 'move':
        this.moveDistance.x += (position.x - this.lastMovePosition.x)
        this.moveDistance.y += (position.y - this.lastMovePosition.y)
        this.viewPortOffset.x = -this.moveDistance.x
        this.viewPortOffset.y = -this.moveDistance.y
        break
    }
    this.clearCanvas()
    this.renderObj()
  }

  mouseScrollHandler (e: any): void {
    if (this.editMode !== 'move') return
    let scale = 1
    if (e.deltaY > 0) {
      // 向下滚动
      scale = 1.1
    } else {
      scale = 0.9
    }
    this.container.width = Math.max(Math.min(this.container.width * scale, this.originImageWidth), this.maxViewPortWidth)
    this.container.height = Math.max(Math.min(this.container.height * scale, this.originImageHeight), this.maxViewPortHeight)

    this.imageScale = this.container.width / this.viewPortWidth
    this.renderObj()
  }

  addImage (img: any): void {
    this.container.width = img.width
    this.container.height = img.height

    this.originImageWidth = img.width
    this.originImageHeight = img.height

    this.viewPortWidth = this.container.offsetWidth
    this.viewPortHeight = this.container.offsetHeight

    this.maxViewPortHeight = this.maxViewPortWidth * (this.originImageHeight / this.originImageWidth)

    this.imageScale = this.container.width / this.viewPortWidth

    const picObj: Picture = new Picture({
      startPoint: new Point(0, 0),
      data: img,
      width: img.width,
      height: img.height
    })
    this.objQueue.push(picObj)
    this.current_obj_idx++

    this.clearCanvas()
    this.renderObj()
  }

  initImageReader (): void {
    this.imgReader = (item: any) => {
      const blob: any = item.getAsFile()
      const reader: FileReader = new FileReader()

      reader.onload = (e: any) => {
        const img: any = new Image()
        img.onload = () => {
          this.addImage(img)
        }
        img.src = e.target.result
      }
      reader.readAsDataURL(blob)
    }
  }

  pasteFromClipboard (e: any): void {
    const clipboardData: any = e.clipboardData
    let i = 0
    let items: any = null
    let item: any = null
    let types: any = null
    let len = 0
    this.reset()
    if (clipboardData) {
      items = clipboardData.items

      if (!items) {
        return
      }

      item = items[0]
      types = clipboardData.types || []
      len = types.length

      for (; i < len; i++) {
        if (types[i] === 'Files') {
          item = items[i]
          break
        }
      }

      if (item && item.kind === 'file' && item.type.match(/^image\//i)) {
        this.imgReader(item)
      }
    }
  }

  S4 () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }

  guid () {
    return (this.S4() + this.S4() + '-' + this.S4() + '-' + this.S4() + this.S4())
  }

  saveImage (): void {
    const image = new Image()
    if (this.editMode === 'crop') {
      image.src = this.cropper.getCroppedCanvas({ imageSmoothingEnabled: false }).toDataURL('image/png')
      this.cropper && this.cropper.destroy()
    } else {
      this.moveDistance = new Point(0, 0)
      this.container.width = this.originImageWidth
      this.container.height = this.originImageHeight
      this.renderObj()
      image.src = this.container.toDataURL('image/png')
    }
    this.reset()
    this.$emit('getImage', { image, name: `pic${this.guid()}.png` })
  }

  cancel (): void {
    this.reset()
    this.$emit('cancel', { image: null })
  }
}
</script>
