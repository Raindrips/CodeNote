attribute vec4 a_position;
attribute vec2 a_texCoord;

uniform mat4 u_matrix;
uniform float u_flipProgress;

varying vec2 v_texCoord;

void main() {
    // 翻页变形计算
    float angle = u_flipProgress * 3.14159265;
    float x = a_position.x * cos(angle) - a_position.z * sin(angle);
    float z = a_position.x * sin(angle) + a_position.z * cos(angle);
    vec4 transformedPosition = vec4(x, a_position.y, z, 1.0);

    // 将变形后的顶点位置转换到屏幕坐标
    gl_Position = u_matrix * transformedPosition;

    // 传递纹理坐标
    v_texCoord = a_texCoord;
}