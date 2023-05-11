import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import * as T from "../libs/CS559-Three/build/three.module.js";
import { shaderMaterial } from "../libs/CS559-Framework/shaderHelper.js";



let grassCtr = 0;

export class GrassField extends GrObject {
    constructor(numBlades = -1, w = 10, d = 10) {
        let grassField = new T.Group();

        if (numBlades < 0) {
            numBlades = w * d * 100;
        }

        let grassPlaneG = new T.PlaneGeometry(w, d);
        let grassPlaneM = new T.MeshStandardMaterial({color: 0x047303, side: 2});
        let grassPlane = new T.Mesh(grassPlaneG, grassPlaneM);
        grassPlane.rotateX(Math.PI / 2);
        grassField.add(grassPlane);

        super(`Grass-${grassCtr++}`, grassField);
        this.w = w;
        this.d = d;
        this.instances = numBlades;
        this.grassBlades;
        this.shaderMat;
        this.grassField = grassField;
        this.grassPlane = grassPlane;
        this.createBlades();
    }

    createBlades() {
        let positions = new Float32Array([
            -.15, 0, 0,
            .15, 0, 0,
            0, .75, 0,
        ]);

        let uv = new Float32Array([
            0, 0,
            1, 0,
            .5, 1,
        ]);

        let bladePositions = [];
        let bladeAngles = [];

        for (let i = 0; i < this.instances; ++i) {
            let x = Math.random() * this.w - this.w / 2;
            let y = 0;
            let z = Math.random() * this.d - this.d / 2;

            //x = y = z = 0;

            bladePositions.push(x, y, z);
            bladeAngles.push(Math.random() * 2 * Math.PI);
        }

        let grassG = new T.InstancedBufferGeometry();
        grassG.instanceCount = this.instances;

        grassG.setAttribute('position', new T.BufferAttribute(positions, 3));
        grassG.setAttribute('uv', new T.BufferAttribute(uv, 2));
    
        grassG.setAttribute('bladePosition', new T.InstancedBufferAttribute(new Float32Array(bladePositions), 3));
        grassG.setAttribute('angle', new T.InstancedBufferAttribute(new Float32Array(bladeAngles), 1));

        let bladeTX = new T.TextureLoader().load("./images/grass.png");

        this.shaderMat = shaderMaterial("./grass.vs", "./grass.fs", {
            side: 2,
            uniforms: {
                colorMap: {value: bladeTX},
                time: {value: 0.0}
            }
        });

        this.grassBlades = new T.Mesh(grassG, this.shaderMat);
        this.grassBlades.frustumCulled = false;
        this.grassField.add(this.grassBlades);

    }

    stepWorld(delta, timeOfDay) {
        this.shaderMat.uniforms.time.value += delta * .5;
    }
}