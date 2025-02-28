#version 300 es
precision mediump float;

in vec2 v_texCoord;
uniform sampler2D u_texture;

out vec4 fragColor;

uniform vec2 u_resolution;  // 画布分辨率
uniform float u_time;       // 时间变量，可以用来做动画

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;  // 归一化坐标
    uv.x *= u_resolution.x / u_resolution.y;       // 保持宽高比

    // 定义线条的起点和终点
    vec2 lineStart = vec2(0.1f, 0.5f);
    vec2 lineEnd = vec2(0.9f, 0.5f);

    // 计算点到线段的最短距离
    vec2 lineDir = lineEnd - lineStart;
    float lineLength = length(lineDir);
    vec2 lineUnitDir = lineDir / lineLength;

    vec2 pointDir = uv - lineStart;
    float projection = dot(pointDir, lineUnitDir);
    projection = clamp(projection, 0.0f, lineLength);
    vec2 closestPoint = lineStart + lineUnitDir * projection;
    float distanceToLine = length(uv - closestPoint);

    // 定义线条宽度和圆角半径
    float lineWidth = 0.02f;
    float radius = 0.01f;

    // 计算线条的圆角效果
    float alpha = smoothstep(lineWidth + radius, lineWidth, distanceToLine);

    // 设置线条颜色
    vec3 lineColor = vec3(0.0f, 0.0f, 1.0f);  // 蓝色线条
    vec3 finalColor = lineColor * alpha;

    fragColor = vec4(finalColor, 1.0f);

    // fragColor = texture(u_texture, v_texCoord);
}