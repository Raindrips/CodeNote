attribute vec4 a_position;
attribute vec2 a_texCoord;

uniform mat4 u_matrix;
uniform float u_foldProgress;

varying vec2 v_texCoord;

void main() {
    // 模拟沿y轴折叠的效果
    float angle = u_foldProgress * 3.14159265; // 折叠角度从0到π
    float foldFactor = cos(angle); // 用余弦控制折叠程度

    // 将顶点位置变形，根据y轴进行折叠
    vec4 transformedPosition = a_position;
    if (a_position.x > 0.0) {
        transformedPosition.x *= foldFactor;
    }

    // 将变形后的顶点位置转换到屏幕坐标
    gl_Position = u_matrix * transformedPosition;

    // 传递纹理坐标
    v_texCoord = a_texCoord;
}
