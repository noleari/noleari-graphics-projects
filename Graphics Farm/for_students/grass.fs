uniform sampler2D colorMap;

varying vec2 v_uv;

void main() {
    vec3 color = texture2D(colorMap, v_uv).xyz;

    gl_FragColor = vec4(color, 1.0);
}