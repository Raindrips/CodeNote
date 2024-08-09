attribute vec4 a_position;
varying vec2 v_uv;
void main() {
    v_uv = a_position.xy * 0.5 + 0.5;
    gl_Position = a_position;
}