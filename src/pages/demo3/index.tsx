import React, { HtmlHTMLAttributes } from "react";
import { Color } from 'three'
import { initShaders } from '../../utils/shader'
import './index.css'
interface customWebGLRenderingContext extends WebGLRenderingContext {
  program: WebGLProgram
}
interface initState {
  gl: customWebGLRenderingContext
  color: THREE.Color
  canvas: HTMLCanvasElement
  vertsxShader: string
  fragmentShader: string
}
class Demo3 extends React.Component {
  state: initState = {
    gl: null,
    color: null,
    canvas: null,
    vertsxShader: `
     attribute vec4 a_position;
     void main() {
       gl_Position = a_position;
       gl_PointSize = 50.0;
     }
    `, // 顶点着色器
    fragmentShader: `
      void main() {
        gl_FragColor=vec4(1,1,0,1);
      }
    ` // 片元着色器
    // 要提前设置精度
  }
  initWebGl = (cb?: Function[]) => {
    const canvas: any = document.getElementById('canvas')
    canvas.width = window.innerWidth - 32 - 200
    canvas.height = window.innerHeight
    const gl = canvas.getContext('webgl')
    const color = new Color("burlywood")
    // const { r, g, b } = color
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
    // 设置顶点数据
    const vertices = new Float32Array([
      0.0, 0.0,
      0.2, 0.0,
      0.1, -0.2,
    ])

    // 创建缓冲区
    const vertexBuffer = gl.createBuffer();
    // 绑定缓冲区
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // 设置缓冲区对象
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    // 获取操作对象的索引
    const a_position = gl.getAttribLocation(gl.program, 'a_position');
    // 修改属性
    gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);
    // 批处理
    gl.enableVertexAttribArray(a_position);

    gl.clearColor(0, 0, 0, 1);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.POINTS, 0, 3) // 绘制点
    // gl.drawArrays(gl.LINES, 0, 4); // 两两绘制线
    // gl.drawArrays(gl.LINE_STRIP, 0, 3); // 两两绘制连续的线
    gl.drawArrays(gl.LINE_LOOP, 0, 3); // 绘制封闭的线
    // gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3)
  }
  componentDidMount() {
    this.initWebGl([
      this.drawPoints,
    ])
  }
  render() {
    return <canvas className="canvas" id="canvas"></canvas>
  }
}

export default Demo3