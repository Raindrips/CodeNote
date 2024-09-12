#version 300 es
precision mediump float;

in vec4 a_position;  // 顶点位置
in vec2 a_texCoord;  // 纹理坐标

uniform float u_time;  // 时间参数
uniform vec2 u_resolution;  // 屏幕分辨率
uniform vec2 u_direction;   // 搓牌方向

out vec2 v_texCoord;

void main() {
    float bendStrength = sin(a_position.x * 3.0 + u_time) * 0.1;
    vec4 position = a_position;
    position.xy += u_direction * bendStrength;

    gl_Position = position;
    v_texCoord = a_texCoord;
}