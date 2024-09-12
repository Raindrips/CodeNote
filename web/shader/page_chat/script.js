// 获取 WebGL 上下文
const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl");

if (!gl) {
    console.error("WebGL not supported, falling back on experimental-webgl");
    gl = canvas.getContext("experimental-webgl");
}

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

// 片元着色器代码
const fragmentShaderSource = `
    precision mediump float;

    uniform float uFlipProgress; // 翻页进度，范围从 0.0 到 1.0
    uniform sampler2D uTexture; // 书页的纹理
    uniform vec2 uResolution; // 视口分辨率
    varying vec2 vTexCoord;

    void main() {
        vec2 uv = vTexCoord;

        // 计算翻页的中心线，基于翻页进度
        float center = 0.5 + 0.5 * uFlipProgress;

        // 计算左右两侧的纹理坐标
        vec2 texCoord;
        if (uv.x < center) {
            // 左侧页
            float dist = center - uv.x;
            float bendAmount = pow(dist, 2.0) * 2.0; // 控制弯曲程度
            texCoord = vec2(uv.x + bendAmount, uv.y);
        } else {
            // 右侧页
            float dist = uv.x - center;
            float bendAmount = pow(dist, 2.0) * 2.0; // 控制弯曲程度
            texCoord = vec2(uv.x - bendAmount, uv.y);
        }

        // 镜像翻转纹理坐标，使右侧页在翻转时表现正确
        if (uFlipProgress > 0.5) {
            texCoord.x = 1.0 - texCoord.x;
        }

        // 在边缘应用阴影效果
        float shadow = smoothstep(0.4, 0.5, abs(uv.x - center));

        // 从纹理中采样颜色
        vec4 color = texture2D(uTexture, texCoord);

        // 应用阴影效果
        color.rgb *= 1.0 - shadow;

        // 输出最终颜色
        gl_FragColor = color;
    }
`;

// 创建着色器
function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

// 创建程序
function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
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
const resolutionLocation = gl.getUniformLocation(program, "uResolution");
const flipProgressLocation = gl.getUniformLocation(program, "uFlipProgress");
const textureLocation = gl.getUniformLocation(program, "uTexture");

// 创建缓冲区并绑定位置
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

// 定义四个顶点，分别代表书页的四个角
const positions = [
    0, 0,
    1, 0,
    0, 1,
    1, 1
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

// 告诉 WebGL 如何从缓冲区中提取位置
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

// 加载纹理
const texture = gl.createTexture();
const image = new Image();
image.src = 'texture1.png'; // 替换为你自己的图片链接
image.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);

    requestAnimationFrame(animate);
};

// 动画变量
let flipProgress = 0.0;
const maxProgress = 1.0;
const speed = 0.01;

function animate() {
    // 更新翻页进度
    flipProgress += speed;
    if (flipProgress > maxProgress) flipProgress = 0.0;

    // 设置翻页进度
    gl.uniform1f(flipProgressLocation, flipProgress);

    // 设置视口分辨率
    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

    // 绘制
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // 循环动画
    requestAnimationFrame(animate);
}

gl.clearColor(0.0, 0.0, 0.0, 1.0);