#version 300 es
precision mediump float;

in vec4 a_position;  // 顶点位置
in vec2 a_texCoord;  // 纹理坐标

uniform float u_time;  // 时间参数

out vec2 v_texCoord;

void main() {
    vec4 position = a_position;

    gl_Position = position;
    v_texCoord = a_texCoord;
}