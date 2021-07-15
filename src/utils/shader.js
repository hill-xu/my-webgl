export function initShaders(gl, vsSource, fsSource) {
  // 创建程序对象
  const program = gl.createProgram();
  // 建立着色器对象
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource)
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource)
  // 把着色器对象放入程序对象
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  // 链接webgl上下文对象和程序对象
  gl.linkProgram(program)
  // 启动程序对象
  gl.useProgram(program)
  gl.program = program
  return true
}

function loadShader(gl, type, source) {
  // 根据着色器类型，建立着色器对象
  const shader = gl.createShader(type)
  // 将着色器源文件传入着色器对象中
  gl.shaderSource(shader, source);
  // 编译着色器对象
  gl.compileShader(shader);
  return shader
}