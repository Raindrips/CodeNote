precision mediump float;

varying vec2 v_texCoord;
uniform sampler2D u_texture;

void main() {
    // 采样并输出纹理颜色
    gl_FragColor = texture2D(u_texture, v_texCoord);
}