precision mediump float;

varying vec2 v_texCoord;
uniform sampler2D u_texture;

void main() {
    vec2 centeredCoord = v_texCoord * 2.0 - 1.0;
    float radius = length(centeredCoord);
    float angle = atan(centeredCoord.y, centeredCoord.x);
    vec2 distortedCoord = vec2(radius, angle / (2.0 * 3.1415926535897932384626433832795) + 0.5);
    gl_FragColor = texture2D(u_texture, distortedCoord);
}
