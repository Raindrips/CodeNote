precision mediump float;

uniform float uFlipProgress; // 翻页进度，范围从 0.0 到 1.0
uniform sampler2D uTexture; // 书页的纹理
uniform vec2 uResolution; // 视口分辨率

void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;

    // 计算翻页的中心线，基于翻页进度
    float center = 0.5 + 0.5 * uFlipProgress;

    // 计算左右两侧的纹理坐标
    vec2 texCoord;
    if (uv.x < center) {
        // 左侧页
        float dist = center - uv.x;
        float bendAmount = pow(dist, 2.0) * 2.0; // 控制弯曲程度
        texCoord = vec2(uv.x + bendAmount, uv.y);
    } else {
        // 右侧页
        float dist = uv.x - center;
        float bendAmount = pow(dist, 2.0) * 2.0; // 控制弯曲程度
        texCoord = vec2(uv.x - bendAmount, uv.y);
    }

    // 镜像翻转纹理坐标，使右侧页在翻转时表现正确
    if (uFlipProgress > 0.5) {
        texCoord.x = 1.0 - texCoord.x;
    }

    // 在边缘应用阴影效果
    float shadow = smoothstep(0.4, 0.5, abs(uv.x - center));

    // 从纹理中采样颜色
    vec4 color = texture2D(uTexture, texCoord);

    // 应用阴影效果
    color.rgb *= 1.0 - shadow;

    // 输出最终颜色
    gl_FragColor = color;
}
