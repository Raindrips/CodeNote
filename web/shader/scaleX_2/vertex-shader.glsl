attribute vec4 a_position;
attribute vec2 a_texCoord;

uniform mat4 u_matrix;
uniform float u_flipProgress;

varying vec2 v_texCoord;

void main() {
    // 模拟沿y轴翻页的效果
    float angle = u_flipProgress * 3.14159265; // 翻转角度从0到π
    float bendFactor = sin(angle); // 用正弦控制弯曲程度

    // 将顶点位置变形，根据x轴进行翻页和弯曲
    vec4 transformedPosition = a_position;
    transformedPosition.x = transformedPosition.x * cos(angle) - abs(bendFactor) * transformedPosition.z;
    transformedPosition.z = transformedPosition.x * sin(angle);

    // 将变形后的顶点位置转换到屏幕坐标
    gl_Position = u_matrix * transformedPosition;

    // 传递纹理坐标
    v_texCoord = a_texCoord;
}
