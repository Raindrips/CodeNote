precision mediump float;

varying vec2 v_uv;
// Viewport resolution (in pixels)
uniform vec3 iResolution;

// Shader playback time (in seconds)
uniform float iTime;

// Render time (in seconds)
uniform float iTimeDelta;

// Shader frame rate
uniform float iFrameRate;

// Shader playback frame
uniform int iFrame;

// Channel playback time (in seconds)
uniform float iChannelTime[4];

// Channel resolution (in pixels)
uniform vec3 iChannelResolution[4];

// Mouse pixel coords. xy: current (if MLB down), zw: click
uniform vec4 iMouse;

// Input channel. XX = 2D/Cube
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;
uniform sampler2D iChannel2;
uniform sampler2D iChannel3;

// Date (year, month, day, time in seconds)
uniform vec4 iDate;

// Sound sample rate (i.e., 44100)
uniform float iSampleRate;

#define texture texture2D

#define pi 3.14159265359
#define radius .1

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    float aspect = iResolution.x / iResolution.y;       //缩放比

    vec2 uv = fragCoord  / iResolution.xy* vec2(aspect, 1.);
    // vec2 uv=v_uv;
    vec2 mouse = iMouse.xy  * vec2(aspect, 1.) / iResolution.xy;
    vec2 mouseDir = normalize(abs(iMouse.zw) - iMouse.xy);
    vec2 origin = clamp(mouse - mouseDir * mouse.x / mouseDir.x, 0., 1.);
    
    float mouseDist = clamp(length(mouse - origin) 
        + (aspect - (abs(iMouse.z) / iResolution.x) * aspect) / mouseDir.x, 0., aspect / mouseDir.x);
    
    if (mouseDir.x < 0.)
    {
        mouseDist = distance(mouse, origin);
    }
  
    float proj = dot(uv - origin, mouseDir);
    float dist = proj - mouseDist;
    
    vec2 linePoint = uv - dist * mouseDir;
    
    if (dist > radius) 
    {
        fragColor = texture2D(iChannel1, uv * vec2(1. / aspect, 1.));
        fragColor.rgb *= pow(clamp(dist - radius, 0., 1.) * 1.5, .2);
    }
    else if (dist >= 0.)
    {
        // map to cylinder point
        float theta = asin(dist / radius);
        vec2 p2 = linePoint + mouseDir * (pi - theta) * radius;
        vec2 p1 = linePoint + mouseDir * theta * radius;
        uv = (p2.x <= aspect && p2.y <= 1. && p2.x > 0. && p2.y > 0.) ? p2 : p1;
        fragColor = texture(iChannel0, uv * vec2(1. / aspect, 1.));
        fragColor.rgb *= pow(clamp((radius - dist) / radius, 0., 1.), .2);
    }
    else 
    {
        vec2 p = linePoint + mouseDir * (abs(dist) + pi * radius);
        uv = (p.x <= aspect && p.y <= 1. && p.x > 0. && p.y > 0.) ? p : uv;
        fragColor = texture2D(iChannel0, uv * vec2(1. / aspect, 1.));
    }
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
