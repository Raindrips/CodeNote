const canvas = document.getElementById("glCanvas");
const gl = canvas.getContext("webgl");

if (!gl) {
    alert("Your browser does not support WebGL");
}

// 顶点着色器代码
const vertexShaderSource = `
    attribute vec2 aPosition;
    varying vec2 vTexCoord;

    void main() {
        vTexCoord = aPosition;
        gl_Position = vec4(aPosition * 2.0 - 1.0, 0.0, 1.0);
    }
`;

// 片元着色器代码 (用于实现书页翻页效果)
const fragmentShaderSource = `
    precision mediump float;

    uniform float uFlipProgress; // 翻页进度
    uniform sampler2D uTexture; // 书页的纹理
    uniform vec2 uResolution; // 视口分辨率
    varying vec2 vTexCoord;

    void main() {
        vec2 uv = vTexCoord;

        // 计算翻页中心线
        float centerX = 0.5 * (1.0 + uFlipProgress);
        
        // 页面弯曲的幅度
        float bend = 0.1 + 0.9 * abs(uv.x - centerX);
        
        // 左边的页面（翻页前）
        if (uv.x < centerX) {
            uv.x = uv.x + bend * (centerX - uv.x);
        }
        // 右边的页面（翻页后）
        else {
            uv.x = uv.x - bend * (uv.x - centerX);
        }

        // 纹理采样，使用修改后的坐标
        vec4 color = texture2D(uTexture, uv);

        // 应用阴影效果
        float shadow = smoothstep(0.45, 0.5, abs(uv.x - centerX));
        color.rgb *= 1.0 - shadow;

        gl_FragColor = color;
    }
`;

// 创建和编译着色器
function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Error compiling shader:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Error linking program:", gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }
    return program;
}

// 初始化着色器程序
const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
const program = createProgram(gl, vertexShader, fragmentShader);
gl.useProgram(program);

// 查找位置
const positionLocation = gl.getAttribLocation(program, "aPosition");
const flipProgressLocation = gl.getUniformLocation(program, "uFlipProgress");
const resolutionLocation = gl.getUniformLocation(program, "uResolution");
const textureLocation = gl.getUniformLocation(program, "uTexture");

// 创建缓冲区
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
const positions = [
    0, 0,
    1, 0,
    0, 1,
    1, 1
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

// 启用顶点属性
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

// 加载纹理
const texture = gl.createTexture();
const image = new Image();
image.src = 'texture0.png'; // 替换为你自己的图片
image.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);

    requestAnimationFrame(animate);
};

// 翻页动画参数
let flipProgress = 0.0;
const maxProgress = 1.0;
const flipSpeed = 0.01;

function animate() {
    flipProgress += flipSpeed;
    if (flipProgress > maxProgress) flipProgress = 0.0;

    gl.uniform1f(flipProgressLocation, flipProgress);
    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

    // 绘制
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    requestAnimationFrame(animate);
}

gl.clearColor(0.0, 0.0, 0.0, 1.0);