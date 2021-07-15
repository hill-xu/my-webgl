import React from "react";
import './index.css'
interface initState {
  webGlIns: any
}
class Demo1 extends React.Component<any, initState> {
  state = {
    webGlIns: null
  }
  initWebGl = () => {
    const canvas: any = document.getElementById('canvas')
    canvas.width = 500
    canvas.height = 500
    const webGlIns = canvas.getContext('webgl')
    webGlIns.clearColor(0,0,0,1)
    webGlIns.clear(webGlIns.COLOR_BUFFER_BIT)
    this.setState({
      webGlIns
    })
  }
  componentDidMount() {
    this.initWebGl()
  }
  render() {
    return <canvas className="canvas" id="canvas">
      哈哈哈
    </canvas>
  }
}

export default Demo1