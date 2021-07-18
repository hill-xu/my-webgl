import React from "react";
import { Color } from 'three'
import { initShaders } from '../../utils/shader'
import './index.css'
interface initState {
  gl: any
  color: any
  canvas: any
  vertsxShader: string
  fragmentShader: string
}
class Demo1 extends React.Component {
  state: initState = {
    gl: null,
    color: null,
    canvas: null,
    vertsxShader: `
     attribute vec4 a_position;
     void main() {
       gl_Position = a_position;
       gl_PointSize = 10.0;
     }
    `, // 顶点着色器
    fragmentShader: `
      void main() {
        gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);
      }
    ` // 片元着色器
  }
  initWebGl = (cb?: Function[]) => {
    const canvas: any = document.getElementById('canvas')
    canvas.width = 1000
    canvas.height = 1000
    const gl = canvas.getContext('webgl')
    const color = new Color("rgba(255, 0, 0, 1)")
    const { r, g, b } = color
    gl.clearColor(r, g, b, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)
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
    const { canvas, gl } = this.state
    canvas.addEventListener('click', ({ clientX, clientY }: { clientX: number, clientY: number }) => {
      console.log(clientX, clientY)
      const { top, left, height, width } = canvas.getBoundingClientRect()
      // 计算鼠标与canvas画布点相对位置
      const [rX, rY] = [clientX - left, clientY - top]
      // 计算gl的中心点
      const [glCenterX, glCenterY] = [width/2, height/2]
      // 根据鼠标位置计算gl位置
      // gl单位和像素单位映射
      const [gX, gY] = [(rX - glCenterX)/glCenterX, -(rY - glCenterY)/glCenterY]
      // 获取顶点着色器位置信息
      const a_position = gl.getAttribLocation(gl.program, 'a_position')
      // 设置顶点着色器位置信息
      gl.vertexAttrib2f(a_position, gX, gY)
      gl.drawArrays(gl.POINTS, 0, 1)
    })
  }
  componentDidMount() {
    this.initWebGl([
      this.drawPoints,
      // this.chnageCanvasColor
      this.initCanvasClick
    ])
  }
  render() {
    return <canvas className="canvas" id="canvas"></canvas>
  }
}

export default Demo1