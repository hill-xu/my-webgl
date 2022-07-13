const defaultAttr = () => ({
    gl: null,
    size: 2,
    vertices: [],
    geoData: [],
    attrName: 'a_position',
    types: ['POINTS'],
    count: 0,
    circleDot: false,
    u_IsPOINTS: null
})

export default class Poly {
    constructor(attr) {
        Object.assign(this, defaultAttr(), attr);
        this.init()
    }
    init() {
        const { gl, attrName, size, circleDot } = this;
        if (!gl) {
            return
        }
        // 创建缓冲区
        const vertexBuffer = gl.createBuffer();
        // 绑定缓冲区
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        // 更新缓冲区
        this.updateBuffer();
        // 获取索引
        const a_Position = gl.getAttribLocation(gl.program, attrName);
        gl.vertexAttribPointer(a_Position, size, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position)
        if (circleDot) {
            this.u_IsPOINTS = gl.getUniformLocation(gl.program, 'u_IsPOINTS')
        }
    }
    updateBuffer() {
        const { gl, vertices } = this;
        // 更新count
        this.updataCount();
        // 设置缓冲区对象
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    }
    updataCount() {
        const { size, vertices } = this;
        this.count = vertices.length / size
    }
    addVertice(...params) {
        this.vertices.push(...params);
        this.updateBuffer();
    }
    popVertice() {
        const { vertices, size } = this;
        const len = vertices.length;
        vertices.splice(len - size, size);
        this.updataCount();
    }
    setVertice(index, ...params) {
        const { vertices, size } = this;
        const i = index * size;
        params.forEach((param, paramIndex) => {
            vertices[i + paramIndex] = param;
        })
    }
    updateVertices(params) {
        const { geoData } = this;
        const vertices = [];
        geoData.forEach(data => {
            params.forEach(key => {
                vertices.push(data[key])
            })
        })
        this.vertices = vertices;
    }
    draw(types = this.types) {
        const { gl, count, circleDot, u_IsPOINTS } = this;
        types.forEach(type => {
            circleDot && gl.uniform1f(u_IsPOINTS, type === 'POINTS')
            gl.drawArrays(gl[type], 0, count)
        })
    }
}