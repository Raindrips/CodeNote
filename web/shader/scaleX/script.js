async function fetchShaderSource(url) {
    const response = await fetch(url);
    return await response.text();
}

async function loadImage(url) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = url;
    });
}

function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Error compiling shader:', gl.getShaderInfoLog(shader));
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
        console.error('Error linking program:', gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }
    return program;
}

function createPageVertices() {
    const positions = [
        -1, -1, 0,
        1, -1, 0,
        -1,  1, 0,
        1,  1, 0,
    ];

    const texCoords = [
        0, 0,
        1, 0,
        0, 1,
        1, 1,
    ];

    const indices = [0, 1, 2, 2, 1, 3];

    return { positions, texCoords, indices };
}

async function main() {
    const canvas = document.getElementById('canvas');
    const gl = canvas.getContext('webgl');

    canvas.width = window.innerHeight;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);

    const vertexShaderSource = await fetchShaderSource('vertex-shader.glsl');
    const fragmentShaderSource = await fetchShaderSource('fragment-shader.glsl');

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = createProgram(gl, vertexShader, fragmentShader);

    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    const texCoordAttributeLocation = gl.getAttribLocation(program, 'a_texCoord');
    const matrixUniformLocation = gl.getUniformLocation(program, 'u_matrix');
    const flipProgressUniformLocation = gl.getUniformLocation(program, 'u_flipProgress');
    const textureUniformLocation = gl.getUniformLocation(program, 'u_texture');

    const pageData = createPageVertices();

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pageData.positions), gl.STATIC_DRAW);

    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pageData.texCoords), gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(pageData.indices), gl.STATIC_DRAW);

    const page1 = await loadImage('page1.jpg');
    const page2 = await loadImage('page2.jpg');

    const texture1 = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, page1);
    gl.generateMipmap(gl.TEXTURE_2D);

    const texture2 = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture2);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, page2);
    gl.generateMipmap(gl.TEXTURE_2D);

    gl.useProgram(program);

    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(texCoordAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.vertexAttribPointer(texCoordAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    let flipProgress = 0;
    let flippingForward = true;

    function drawScene() {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        const aspect = canvas.clientWidth / canvas.clientHeight;
        const projectionMatrix = mat4.ortho([], -aspect, aspect, -1, 1, -1, 1);

        flipProgress += (flippingForward ? 0.01 : -0.01);
        if (flipProgress >= 1.0) {
            flippingForward = false;
            flipProgress = 1.0;
        } else if (flipProgress <= 0.0) {
            flippingForward = true;
            flipProgress = 0.0;
        }

        gl.uniformMatrix4fv(matrixUniformLocation, false, projectionMatrix);
        gl.uniform1f(flipProgressUniformLocation, flipProgress);

        gl.bindTexture(gl.TEXTURE_2D, flipProgress < 0.5 ? texture1 : texture2);
        gl.uniform1i(textureUniformLocation, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.drawElements(gl.TRIANGLES, pageData.indices.length, gl.UNSIGNED_SHORT, 0);

        requestAnimationFrame(drawScene);
    }

    requestAnimationFrame(drawScene);
}

window.onload = main;