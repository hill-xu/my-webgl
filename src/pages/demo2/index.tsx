import React, { HtmlHTMLAttributes } from "react";
import { Color } from 'three'
import { initShaders } from '../../utils/shader';
import { Compose } from '../../utils/Compose';
import Track from '../../utils/Track';
import ReactAudioPlayer from 'react-audio-player';
import './index.css'
interface customWebGLRenderingContext extends WebGLRenderingContext {
  program: WebGLProgram
}

type pos = {
  x: number;
  y: number;
  s: number;
  a: number
}

interface initState {
  gl: customWebGLRenderingContext
  color: THREE.Color
  canvas: HTMLCanvasElement
  vertsxShader: string
  fragmentShader: string
  pointInfoArr: pos[]
  compose: Compose<any>,
}
class Demo2 extends React.Component {
  state: initState = {
    gl: null,
    color: null,
    canvas: null,
    pointInfoArr: [],
    vertsxShader: `
     attribute vec4 a_position;
     attribute float a_pointSize;
     void main() {
       gl_Position = a_position;
       gl_PointSize = a_pointSize;
     }
    `, // 顶点着色器
    fragmentShader: `
      precision mediump float;
      uniform vec4 u_FragColor;
      void main() {
        float dist = distance(gl_PointCoord, vec2(0.5, 0.5));
        if (dist < 0.5) {
          gl_FragColor = u_FragColor;
        } else {
          discard;
        }
      }
    `, // 片元着色器
    // 要提前设置精度
    compose: new Compose()
  }
  initWebGl = (cb?: Function[]) => {
    const canvas: any = document.getElementById('demo2_canvas')
    canvas.width = window.innerWidth - 32 - 200
    canvas.height = window.innerHeight
    const gl: customWebGLRenderingContext = canvas.getContext('webgl')
    // 开启片元的颜色合成功能
    gl.enable(gl.BLEND)
    // 设置合成方式
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    const color = new Color("transparent")
    const { r, g, b } = color
    // gl.clearColor(r, g, b, 1)
    // gl.clear(gl.COLOR_BUFFER_BIT)
    this.setState({
      gl,
      color,
      canvas
    }, () => {
      Array.isArray(cb) && cb.forEach((fn: Function) => {
        typeof fn === 'function' && fn()
      })
    })
  }
  chnageCanvasColor = () => {
    const { gl, color } = this.state
    color.offsetHSL(0.005, 0, 0) //  色相 饱和的 亮度的偏移
    gl.clearColor(color.r, color.g, color.b, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)
    requestAnimationFrame(this.chnageCanvasColor)
  }
  drawPoints = () => {
    const { gl, vertsxShader, fragmentShader } = this.state 
    initShaders(gl, vertsxShader, fragmentShader)
    // 获取顶点着色器位置信息
    const a_position = gl.getAttribLocation(gl.program, 'a_position')
    // 设置顶点着色器位置信息
    gl.vertexAttrib3f(a_position, 0.0, 0.0, 0.0)
    gl.drawArrays(gl.POINTS, 0, 1)
  }
  initCanvasClick = () => {
    const { canvas, pointInfoArr, compose } = this.state
    const arr = [...pointInfoArr]
    canvas.addEventListener('click', ({ clientX, clientY }: { clientX: number, clientY: number }) => {
      const { top, left, height, width } = canvas.getBoundingClientRect()
      // 计算鼠标与canvas画布点相对位置
      const [rX, rY] = [clientX - left, clientY - top]
      // 计算gl的中心点
      const [glCenterX, glCenterY] = [width/2, height/2]
      // 根据鼠标位置计算gl位置
      // gl单位和像素单位映射
      const [gX, gY] = [(rX - glCenterX)/glCenterX, -(rY - glCenterY)/glCenterY]
      const obj = {
        x: gX,
        y: gY,
        s: Math.random() * 5 + 2,
        // a: Math.random()
        a: 1
      }
      arr.push(obj)
      const track = new Track(obj);
      track.start = new Date().valueOf();
      track.keyMap = new Map([
        [
          'a', [
            [500, obj.a],
            [1000, 0],
            [1500, obj.a],
          ]
        ]
      ])
      track.timeLen = 2000
      track.loop = true
      compose.add(track);
      this.setState({
        pointInfoArr: arr,
        compose
      }, () => {
        this.renderPoint()
      })
    })
  }
  renderPoint() {
      const { gl, pointInfoArr } = this.state
      gl.clear(gl.COLOR_BUFFER_BIT);
      pointInfoArr.forEach(({x, y, s, a}) => {
        const a_position = gl.getAttribLocation(gl.program, 'a_position')
        // 获取顶点着色器大小信息
        const a_pointSize = gl.getAttribLocation(gl.program, 'a_pointSize')
        // 获取uniform 变量
        const u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor')
        // 设置顶点着色器位置信息
        gl.vertexAttrib2f(a_position, x, y)
        // 设置顶点着色器的大小
        gl.vertexAttrib1f(a_pointSize, s)
        // 设置uniform 变量
        gl.uniform4f(u_FragColor, 0.87, 0.91, 1, a)
        gl.drawArrays(gl.POINTS, 0, 1)
      })
  }

  twinkleStars = () => {
    const { compose } = this.state
    compose.update(new Date())
    this.renderPoint()
    requestAnimationFrame(this.twinkleStars.bind(this))
  }

  componentDidMount() {
    this.initWebGl([
      this.drawPoints,
      // this.chnageCanvasColor
      this.initCanvasClick,
      this.twinkleStars
    ])
  }
  render() {
    return <div className="demo2">
      <ReactAudioPlayer
        src="http://yizxq.xyz/asstes/audio/cef.mp3"
        autoPlay
        loop
        controls
        className="audioBox"
      />
      <canvas className="demo2_canvas" id="demo2_canvas"></canvas>
    </div>
  }
}

export default Demo2