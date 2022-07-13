import React, { HtmlHTMLAttributes } from "react";
import { Color } from 'three'
import { initShaders } from '../../utils/shader'
import { getMousePosInWebgl, glToCssPos } from '../../utils/utils'
import Poly from '../../utils/poly'
import Sky from '../../utils/sky'
import Track from '../../utils/Track'
import { Compose } from '../../utils/Compose'
import ReactAudioPlayer from 'react-audio-player';
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
class Demo6 extends React.Component {
  state: initState = {
    gl: null,
    color: null,
    canvas: null,
    vertsxShader: `
      attribute vec4 a_attr;
      varying float v_Alpha;
      void main(){
          gl_Position=vec4(a_attr.x,a_attr.y,0.0,1.0);
          gl_PointSize=a_attr.z;
          v_Alpha=a_attr.w;
      }
    `, // 顶点着色器
    fragmentShader: `
      precision mediump float;
      uniform bool u_IsPOINTS;
      varying float v_Alpha;
      void main(){
        if(u_IsPOINTS){
          float dist=distance(gl_PointCoord,vec2(0.5,0.5));
          if(dist<0.5){
            gl_FragColor=vec4(0.87,0.91,1,v_Alpha);
          }else{
            discard;
          }
        }else{
          gl_FragColor=vec4(0.87,0.91,1,v_Alpha);
        }
      }
    `, // 片元着色器
    // 要提前设置精度
  }
  initWebGl = (cb?: Function[]) => {
    const canvas: any = document.getElementById('demo6_canvas')
    canvas.width = window.innerWidth - 32 - 200
    canvas.height = window.innerHeight
    canvas.oncontextmenu = function() {
      return false
    }
    const gl = canvas.getContext('webgl')
    const color = new Color("burlywood")
    const { vertsxShader, fragmentShader } = this.state 
    initShaders(gl, vertsxShader, fragmentShader)
    gl.clearColor(0, 0, 0, 0)
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

  random = () => {
    return Math.random() * 8 + 3;
  }

  createTrack = (obj: any, compose: any) => {
    const { pointSize } = obj;
    const track = new Track(obj);
    track.start = new Date().valueOf();
    track.timeLen = 2000;
    track.loop = true;
    track.keyMap = new Map([
      [
        "pointSize",
        [
          [500, pointSize],
          [1000, 0],
          [1500, pointSize]
        ]
      ],
      [
        "alpha",
        [
          [500, 1],
          [1000, 0],
          [1500, 1]
        ]
      ]
    ])
    compose.add(track)
  }

  createpoly = (x: number, y: number, point: any, skyIns: any, compose: any) => {
    const o1 = point ? point : { x, y, pointSize: this.random(), alpha: 1 };
    const o2 = { x, y, pointSize: this.random(), alpha: 1 };
    const poly = new Poly({
      size: 4,
      geoData: [o1, o2],
      attrName: 'a_attr',
      types: ['POINTS', 'LINE_STRIP'],
      circleDot: true
    })
    skyIns.add(poly);
    this.createTrack(o1, compose);
    this.createTrack(o2, compose);
    return poly
  }

  addVertice = (x: number, y: number, point: any, compose: any, polyIns: any) => {
    const { geoData } = polyIns;
    if (point) {
      geoData[geoData.length - 1] = point;
    }
    let obj = { x, y, pointSize: this.random(), alpha: 1};
    geoData.push(obj);
    this.createTrack(obj, compose);
  }

  popVertice = (polyIns: any, compose: any) => {
    polyIns.geoData.pop();
    compose.children.pop();
  }

  drawSky = (skyIns: any) => {
    const { gl } = this.state
    gl.clear(gl.COLOR_BUFFER_BIT)
    skyIns.draw()
  }

  renderGl = (skyIns: any, gl: any) => {
    gl.clear(gl.COLOR_BUFFER_BIT);
    skyIns.draw()
  }

  initCanvasClick = () => {
    const { canvas, gl } = this.state;
    let polyIns: any = null;
    let skyIns = new Sky(gl);
    let point: any = null;
    let compose: any = new Compose();
    canvas.addEventListener('mousedown', ({ clientX, clientY, button }: { clientX: number, clientY: number, button: number }) => {
      const { x, y } = getMousePosInWebgl({ clientX, clientY }, canvas);
      if (button === 2) {
        // 右击
        if (polyIns) {
          // polyIns.popVertice()
          // polyIns = null
          this.popVertice(polyIns, compose)
          polyIns = null

        }
      } else {
        if (polyIns) {
          // polyIns.addVertice(x, y)
          // this.drawSky(skyIns)
          this.addVertice(x, y, point, compose, polyIns)
        } else {
          polyIns = this.createpoly(x, y, point, skyIns, compose)
          // skyIns.add(polyIns)
          // this.drawSky(skyIns)
        }
      }
    })
    canvas.addEventListener('mousemove', ({ clientX, clientY }: { clientX: number, clientY: number}) => {
      const { canvas } = this.state
      const { x, y } = getMousePosInWebgl({ clientX, clientY }, canvas);
      point = this.hoverPoint(x, y, skyIns, polyIns)
      if (point) {
        canvas.style.cursor = "pointer";
      } else {
        canvas.style.cursor = "default";
      }
      if (polyIns) {
        const obj = polyIns.geoData[polyIns.geoData.length - 1];
        obj.x = x;
        obj.y = y;
      }
      // if (polyIns) {
      //   const { x, y } = getMousePosInWebgl({ clientX, clientY }, canvas);
      //   polyIns.setVertice(polyIns.count - 1, x, y)
      //   this.drawSky(skyIns)
      // }
    });
    const that = this;
    (function ani() {
      compose.update(new Date().valueOf())
      skyIns.updateVertices(['x', 'y', 'pointSize', 'alpha']);
      that.renderGl(skyIns, gl);
      requestAnimationFrame(ani)
    })()
    this.setState({
      skyIns
    })
  }

  hoverPoint = (mx: number, my: number, skyIns: any, polyIns: any) => {
    for (const { geoData } of skyIns.children) {
      for (const obj of geoData) {
        if (polyIns && obj === polyIns.geoData[polyIns.geoData.length - 1]) {
          continue;
        }
        const delta = {
          x: mx - obj.x,
          y: my - obj.y
        }
        const { x, y } = glToCssPos(delta, this.state.canvas);
        const dist = x * x + y * y;
        if (dist < 100) {
          return obj
        }
      }
    }
    return null;
  }

  componentDidMount() {
    this.initWebGl([
      this.initCanvasClick
    ])
  }
  render() {
    return <div className="demo6">
      <ReactAudioPlayer
        src="http://yizxq.xyz/asstes/audio/cef.mp3"
        autoPlay
        loop
        controls
        className="audioBox"
      />
      <canvas className="demo6_canvas" id="demo6_canvas"></canvas>
    </div>
  }
}

export default Demo6