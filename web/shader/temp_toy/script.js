async function fetchShaderSource(url)
{
    const response = await fetch(url);
    return await response.text();
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

function setupTexture(gl, textureUnit, imageUrl)
{
    const texture = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + textureUnit);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    const image = new Image();
    image.onload = () =>
    {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_2D);
    };
    image.src = imageUrl;

    return texture;
}

function getCurrentDate()
{
    const now = new Date();
    return [
        now.getFullYear(),
        now.getMonth() + 1, // JavaScript months are 0-11
        now.getDate(),
        now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()
    ];
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

    gl.useProgram(program);

    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [
        -1, -1,
        1, -1,
        -1, 1,
        -1, 1,
        1, -1,
        1, 1,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    gl.useProgram(program);
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    // Setting up uniforms
    const iResolution = gl.getUniformLocation(program, 'iResolution');
    const iTime = gl.getUniformLocation(program, 'iTime');
    const iTimeDelta = gl.getUniformLocation(program, 'iTimeDelta');
    const iFrameRate = gl.getUniformLocation(program, 'iFrameRate');
    const iFrame = gl.getUniformLocation(program, 'iFrame');
    const iChannelTime = gl.getUniformLocation(program, 'iChannelTime');
    const iChannelResolution = gl.getUniformLocation(program, 'iChannelResolution');
    const iMouse = gl.getUniformLocation(program, 'iMouse');
    const iDate = gl.getUniformLocation(program, 'iDate');
    const iSampleRate = gl.getUniformLocation(program, 'iSampleRate');

    console.log(iResolution, iTime, iTimeDelta, iFrameRate, iFrame, iChannelTime, iChannelResolution, iMouse, iDate, iSampleRate)

    const startTime = performance.now();
    let previousTime = startTime;
    let frameCount = 0;

    const textures = [
        setupTexture(gl, 0, 'texture0.png'),
        setupTexture(gl, 1, 'texture1.png'),
        setupTexture(gl, 2, 'texture2.png'),
        setupTexture(gl, 3, 'texture3.png')
    ];

    let mousePos = [0, 0, 0, 0];

    canvas.addEventListener('mousemove', (event) =>
    {
        const rect = canvas.getBoundingClientRect();
        mousePos[0] = event.clientX - rect.left;
        mousePos[1] = canvas.height - (event.clientY - rect.top);
    });

    canvas.addEventListener('mousedown', (event) =>
    {
        mousePos[2] = mousePos[0];
        mousePos[3] = mousePos[1];
    });
    function render()
    {
        const currentTime = performance.now();
        const deltaTime = (currentTime - previousTime) / 1000;
        previousTime = currentTime;

        const elapsedTime = (currentTime - startTime) / 1000;
        frameCount += 1;

        gl.uniform3f(iResolution, canvas.width, canvas.height, 1.0);
        gl.uniform1f(iTime, elapsedTime);
        gl.uniform1f(iTimeDelta, deltaTime);
        gl.uniform1f(iFrameRate, 1 / deltaTime);
        gl.uniform1i(iFrame, frameCount);
        gl.uniform4fv(iMouse, mousePos);
        gl.uniform4fv(iDate, getCurrentDate());
        gl.uniform1f(iSampleRate, 44100.0);

        if (iChannelResolution) {
            for (let i = 0; i < 4; i++) {
                const channelResolution = textures[i] ? [canvas.width, canvas.height, 1.0] : [0, 0, 0];

                gl.uniform3fv(iChannelResolution[i], channelResolution);
                gl.uniform1f(iChannelTime[i], elapsedTime);
            }
        }


        // Render scene
        // gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        requestAnimationFrame(render);
    }
    render();
}
// main();
window.onload = main;
