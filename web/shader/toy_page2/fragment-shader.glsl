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

#define texture texture2D

#define pi 3.14159265359
// #define radius .1

// 画线函数
float drawLine(vec2 uv, vec2 a, vec2 b, float width) {
    vec2 ba = b - a;
    vec2 pa = uv - a;
    float t = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    vec2 projection = a + t * ba;
    float dist = length(uv - projection);
    return smoothstep(width * 0.5 + 0.001, width * 0.5 - 0.001, dist);
}

// 画矩形（填充）
float drawRect(vec2 uv, vec2 center, vec2 size) {
    vec2 d = abs(uv - center) - size * 0.5;
    return smoothstep(0.001, -0.001, max(d.x, d.y));
}

// 画圆形（填充）
float drawCircle(vec2 uv, vec2 center, float radius) {
    float d = length(uv - center) - radius;
    return smoothstep(0.001, -0.001, d);
}

float drawArc(vec2 uv, vec2 pos, float startAngle, float endAngle, float width, float radius) {
    const float PI = 3.1415926535;
    startAngle *= PI;
    endAngle *= PI;
    uv = uv - pos;
    float dist = length(uv);
    float angle = atan(uv.y, uv.x);
    float inAngle = step(startAngle, angle) * (1.0 - step(endAngle, angle));

    float inRadius = step(radius - width * .5, dist) *
        (1.0 - step(radius + width * .5, dist));
    float alpha = inAngle * inRadius;
    return alpha;
}

// float drawArc(vec2 uv, vec2 pos, float startAngle, float endAngle, float width, float radius) {
//     const float PI = 3.1415926535;
//     startAngle *= PI;  // 输入度数，转换为弧度
//     endAngle *= PI;
//     uv = uv - pos;
//     float dist = length(uv);
//     float angle = atan(uv.y, uv.x);  // 返回 -π 到 π

//     // 将角度归一化到 0 到 2π
//     angle = mod(angle + 2.0 * PI, 2.0 * PI);
//     startAngle = mod(startAngle + 2.0 * PI, 2.0 * PI);
//     endAngle = mod(endAngle + 2.0 * PI, 2.0 * PI);

//     // 判断角度是否在范围内
//     float inAngle;
//     if (startAngle <= endAngle) {
//         inAngle = step(startAngle, angle) * step(angle, endAngle);
//     } else {
//         // 跨越 0/2π 的情况
//         inAngle = step(startAngle, angle) + step(0.0, angle) * step(angle, endAngle);
//         inAngle = min(inAngle, 1.0);  // 确保值不超过 1
//     }

//     // 判断半径
//     float inRadius = step(radius - width * 0.5, dist) * (1.0 - step(radius + width * 0.5, dist));

//     float alpha = inAngle * inRadius;
//     return alpha;
// }

void mainImage(out vec4 fragColor, in vec2 fragCoord) {

    vec2 uv = fragCoord.xy / iResolution.xy;  // 归一化坐标

    vec3 color = vec3(0.);

    color += vec3(drawLine(uv, vec2(.1, .5), vec2(.5, .8), 0.01), 0., 0.);
    color += vec3(0., drawRect(uv, vec2(0.5, 0.5), vec2(0.2, 0.2)), 0.);
    color += vec3(.0, .0, drawCircle(uv, vec2(0.4, 0.3), 0.1));

    // float arc = drawArc(uv, vec2(0.0), 0.25, radians(30.0), radians(300.0), 0.02);
    // color += vec3(arc, arc, 0.);

    float alpha = drawArc(uv, vec2(.5, .5), -.5, .5, .01, .2);
    color += vec3(alpha, alpha, 0.);

    fragColor = vec4(color, 1.0);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
