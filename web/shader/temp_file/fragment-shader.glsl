precision mediump float;
varying vec2 v_uv;
uniform vec4 u_color1;
uniform vec4 u_color2;
uniform vec4 u_color3;

void main() {
    float t = v_uv.x;
    vec4 color1To2 = mix(u_color1, u_color2, clamp(t * 2.0, 0.0, 1.0));
    vec4 color2To3 = mix(u_color2, u_color3, clamp((t - 0.5) * 2.0, 0.0, 1.0));
    float mid = step(0.5, t);
    gl_FragColor = mix(color1To2, color2To3, mid);
}