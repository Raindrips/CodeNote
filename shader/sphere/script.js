
async function fetchShaderSource(url)
{
    const response = await fetch(url);
    return await response.text();
}

async function loadImage(url)
{
    return new Promise((resolve, reject) =>
    {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = url;
    });
}

function createShader(gl, type, source)
{
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

function createProgram(gl, vertexShader, fragmentShader)
{
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

function createSphereVertices(radius, subdivisionsAxis, subdivisionsHeight)
{
    const positions = [];
    const normals = [];
    const texCoords = [];

    for (let y = 0; y <= subdivisionsHeight; ++y) {
        const v = y / subdivisionsHeight;
        const theta = v * Math.PI;

        for (let x = 0; x <= subdivisionsAxis; ++x) {
            const u = x / subdivisionsAxis;
            const phi = u * 2 * Math.PI;

            const sinTheta = Math.sin(theta);
            const cosTheta = Math.cos(theta);
            const sinPhi = Math.sin(phi);
            const cosPhi = Math.cos(phi);

            const ux = cosPhi * sinTheta;
            const uy = cosTheta;
            const uz = sinPhi * sinTheta;

            positions.push(radius * ux, radius * uy, radius * uz);
            normals.push(ux, uy, uz);
            texCoords.push(u, v);
        }
    }

    const indices = [];
    const numVertsAround = subdivisionsAxis + 1;

    for (let x = 0; x < subdivisionsAxis; ++x) {
        for (let y = 0; y < subdivisionsHeight; ++y) {
            indices.push(
                y * numVertsAround + x,
                y * numVertsAround + x + 1,
                (y + 1) * numVertsAround + x
            );
            indices.push(
                (y + 1) * numVertsAround + x,
                y * numVertsAround + x + 1,
                (y + 1) * numVertsAround + x + 1
            );
        }
    }

    return {
        position: positions,
        normal: normals,
        texCoord: texCoords,
        indices: indices,
    };
}

async function main()
{
    const canvas = document.getElementById('canvas');
    const gl = canvas.getContext('webgl');

    canvas.width = window.innerWidth;
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
    const textureUniformLocation = gl.getUniformLocation(program, 'u_texture');

    const sphereData = createSphereVertices(1, 30, 30);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereData.position), gl.STATIC_DRAW);

    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sphereData.texCoord), gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(sphereData.indices), gl.STATIC_DRAW);

    const image = await loadImage('texture.jpg');
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);

    gl.useProgram(program);

    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(texCoordAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.vertexAttribPointer(texCoordAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    gl.uniform1i(textureUniformLocation, 0);

    let rotation = 0;

    function drawScene()
    {
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        const aspect = canvas.clientWidth / canvas.clientHeight;
        const fieldOfViewRadians = Math.PI * 0.5;
        const zNear = 0.1;
        const zFar = 10;
        const projectionMatrix = mat4.perspective([], fieldOfViewRadians, aspect, zNear, zFar);

        const cameraPosition = [0, 0, 2];
        const up = [0, 1, 0];
        const target = [0, 0, 0];
        const cameraMatrix = mat4.lookAt([], cameraPosition, target, up);

        const viewMatrix = mat4.invert([], cameraMatrix);

        const viewProjectionMatrix = mat4.multiply([], projectionMatrix, viewMatrix);

        rotation += 0.01;
        const modelMatrix = mat4.identity([]);
        mat4.rotateY(modelMatrix, modelMatrix, rotation);

        const matrix = mat4.multiply([], viewProjectionMatrix, modelMatrix);

        gl.uniformMatrix4fv(matrixUniformLocation, false, matrix);

        gl.drawElements(gl.TRIANGLES, sphereData.indices.length, gl.UNSIGNED_SHORT, 0);

        requestAnimationFrame(drawScene);
    }

    requestAnimationFrame(drawScene);
}

window.onload = main;