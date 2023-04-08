import React, { HtmlHTMLAttributes } from "react";
import { Color } from 'three'
import { initShaders } from '../../utils/shader'
import { getMousePosInWebgl } from '../../utils/utils'
import Poly from '../../utils/poly'
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
  polyIns: any
}
class Demo4 extends React.Component {
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
        gl_FragColor=vec4(1,1,0,1);
      }
    `, // 片元着色器
    // 要提前设置精度
    polyIns: null
  }
  initWebGl = (cb?: Function[]) => {
    const canvas: any = document.getElementById('canvas')
    canvas.width = window.innerWidth - 32 - 200
    canvas.height = window.innerHeight
    const gl = canvas.getContext('webgl')
    const color = new Color("burlywood")
    const { vertsxShader, fragmentShader } = this.state 
    initShaders(gl, vertsxShader, fragmentShader)
    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT);
    this.setState({
      gl,
      color,
      canvas,
      polyIns: new Poly({
        types: ['POINTS', 'LINE_STRIP'],
        gl,
      })
    }, () => {
      Array.isArray(cb) && cb.forEach((fn: Function) => {
        typeof fn === 'function' && fn()
      })
    })
  }

  initCanvasClick = () => {
    const { canvas, polyIns, gl } = this.state;
    canvas.addEventListener('click', ({ clientX, clientY }: { clientX: number, clientY: number }) => {
      const { x, y } = getMousePosInWebgl({ clientX, clientY }, canvas);
      polyIns.addVertice(x, y);
      gl.clear(gl.COLOR_BUFFER_BIT);
      polyIns.draw();
    })
  }

  componentDidMount() {
    this.initWebGl([
      this.initCanvasClick
    ])
    console.log(111);
    
  }
  render() {
    return <canvas className="canvas" id="canvas"></canvas>
  }
}

export default Demo4