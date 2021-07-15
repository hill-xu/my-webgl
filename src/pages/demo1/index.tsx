import React from "react";
import { Color } from 'three'
import { initShaders } from '../../utils/shader'
import './index.css'
interface initState {
  webGlIns: any
  color: any
  vertsxShader: string
  fragmentShader: string
}
class Demo1 extends React.Component {
  state: initState = {
    webGlIns: null,
    color: null,
    vertsxShader: `
     void main() {
       gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
       gl_PointSize = 100.0;
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
    canvas.width = 500
    canvas.height = 500
    const webGlIns = canvas.getContext('webgl')
    const color = new Color("rgba(255, 0, 0, 1)")
    const { r, g, b } = color
    webGlIns.clearColor(r, g, b, 1)
    webGlIns.clear(webGlIns.COLOR_BUFFER_BIT)
    this.setState({
      webGlIns,
      color
    }, () => {
      Array.isArray(cb) && cb.forEach((fn: Function) => {
        typeof fn === 'function' && fn()
      })
    })
  }
  chnageCanvasColor = () => {
    const { webGlIns, color } = this.state
    color.offsetHSL(0.005, 0, 0) //  色相 饱和的 亮度的偏移
    webGlIns.clearColor(color.r, color.g, color.b, 1)
    webGlIns.clear(webGlIns.COLOR_BUFFER_BIT)
    requestAnimationFrame(this.chnageCanvasColor)
  }
  drawPoints = () => {
    const { webGlIns, vertsxShader, fragmentShader } = this.state 
    initShaders(webGlIns, vertsxShader, fragmentShader)
    webGlIns.drawArrays(webGlIns.POINTS, 0, 1)
  }
  componentDidMount() {
    this.initWebGl([
      this.drawPoints, 
      // this.chnageCanvasColor
    ])
  }
  render() {
    return <canvas className="canvas" id="canvas">
      哈哈哈
    </canvas>
  }
}

export default Demo1