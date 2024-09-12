precision mediump float;

varying vec2 v_uv;
// Viewport resolution (in pixels)
uniform vec3 iResolution;

// Shader playback time (in seconds)
uniform float iTime;

// Render time (in seconds)
uniform float iTimeDelta;

// Shader frame rate
uniform float iFrameRate;

// Shader playback frame
uniform int iFrame;

// Channel playback time (in seconds)
uniform float iChannelTime[4];

// Channel resolution (in pixels)
uniform vec3 iChannelResolution[4];

// Mouse pixel coords. xy: current (if MLB down), zw: click
uniform vec4 iMouse;

// Input channel. XX = 2D/Cube
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;
uniform sampler2D iChannel2;
uniform sampler2D iChannel3;

// Date (year, month, day, time in seconds)
uniform vec4 iDate;

// Sound sample rate (i.e., 44100)
uniform float iSampleRate;



void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord.xy / iResolution.xy;
    uv=v_uv;
    // Time varying pixel color
    vec3 col = 0.5 + 0.5*cos(iTime + uv.xyx + vec3(0,2,4));

    // Output to screen
    fragColor = vec4(col,1.0);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
