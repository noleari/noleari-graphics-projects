uniform float time;

varying vec2 v_uv;

attribute vec3 bladePosition;
attribute float angle;

void main() {

    vec3 pos = position;

    if (pos.y > .45) {
        pos.x += sin(time * 0.001 * angle) * 0.1;
        pos.z += cos(time * 0.001 * angle) * 0.1;
    }

    //quaternion around y axis
    vec4 quaternion = vec4(0.0, 1.0 * sin(angle * 0.5), 0.0, cos(angle * 0.5));
    pos = pos + 2.0 * cross(quaternion.xyz, cross(quaternion.xyz, pos) + quaternion.w * pos);

    pos += bladePosition;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    v_uv = uv;

}