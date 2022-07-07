import React, { HtmlHTMLAttributes } from "react";
import { Color } from 'three'
import { initShaders } from '../../utils/shader'
import { getMousePosInWebgl } from '../../utils/utils'
import Poly from '../../utils/poly'
import Sky from '../../utils/sky'
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
class Demo5 extends React.Component {
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
  }
  initWebGl = (cb?: Function[]) => {
    const canvas: any = document.getElementById('canvas')
    canvas.width = window.innerWidth - 32 - 200
    canvas.height = window.innerHeight
    canvas.oncontextmenu = function() {
      return false
    }
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
      // polyIns: new Poly({
      //   types: ['POINTS', 'LINE_STRIP'],
      //   gl,
      // })
    }, () => {
      Array.isArray(cb) && cb.forEach((fn: Function) => {
        typeof fn === 'function' && fn()
      })
    })
  }

  createpoly = (x: number, y: number) => {
    return new Poly({
      vertices: [x, y, x, y],
      types: ['POINTS', 'LINE_STRIP'],
    })
  }

  drawSky = (skyIns: any) => {
    const { gl } = this.state
    gl.clear(gl.COLOR_BUFFER_BIT)
    skyIns.draw()
  }

  initCanvasClick = () => {
    const { canvas, gl } = this.state;
    let polyIns: any = null;
    let skyIns = new Sky(gl)
    canvas.addEventListener('mousedown', ({ clientX, clientY, button }: { clientX: number, clientY: number, button: number }) => {
      const { x, y } = getMousePosInWebgl({ clientX, clientY }, canvas);
      if (button === 2) {
        // 右击
        if (polyIns) {
          polyIns.popVertice()
          polyIns = null
        }
      } else {
        if (polyIns) {
          polyIns.addVertice(x, y)
          this.drawSky(skyIns)
        } else {
          polyIns = this.createpoly(x, y)
          skyIns.add(polyIns)
          this.drawSky(skyIns)
        }
      }
    })
    canvas.addEventListener('mousemove', ({ clientX, clientY }: { clientX: number, clientY: number}) => {
      if (polyIns) {
        const { x, y } = getMousePosInWebgl({ clientX, clientY }, canvas);
        polyIns.setVertice(polyIns.count - 1, x, y)
        this.drawSky(skyIns)
      }
    })
  }

  componentDidMount() {
    this.initWebGl([
      this.initCanvasClick
    ])
  }
  render() {
    return <canvas className="canvas" id="canvas"></canvas>
  }
}

export default Demo5