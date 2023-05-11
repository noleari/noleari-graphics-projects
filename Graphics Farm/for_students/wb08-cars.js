/*jshint esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";

// define your vehicles here - remember, they need to be imported
// into the "main" program

let busCtr = 0;

export class Bus extends GrObject {
    constructor() {
        let bus = new T.Group();

        let sideG = new T.BufferGeometry();
        const sideVertices = new Float32Array([
            -3, .5, 1,
            3, .5, 1,
            3, 2.5, 1,

            3, 2.5, 1,
            -3, 2.5, 1,
            -3, .5, 1
        ]);
        const sideUV = new Float32Array([
            0, 0,
            1, 0,
            1, 1,

            1, 1,
            0, 1,
            0, 0
        ]);
        sideG.setAttribute('position', new T.BufferAttribute(sideVertices, 3));
        sideG.setAttribute('uv', new T.BufferAttribute(sideUV, 2));
        sideG.computeVertexNormals();
        let sideTX = new T.TextureLoader().load("./images/BusSide.png");
        let sideM = new T.MeshStandardMaterial({color: 0xffffff, map: sideTX});
        let side1Mesh = new T.Mesh(sideG, sideM);
        bus.add(side1Mesh);

        let side2Mesh = side1Mesh.clone(true);
        side2Mesh.rotateY(Math.PI);
        bus.add(side2Mesh);

        let tbfbG = new T.BufferGeometry();
        const tbfbV = new Float32Array([
            3, .5, 1,
            -3, .5, 1,
            -3, .5, -1,

            -3, .5, -1,
            3, .5, -1,
            3, .5, 1,

            -3, 2.5, -1,
            -3, 2.5, 1,
            3, 2.5, 1,

            3, 2.5, 1,
            3, 2.5, -1,
            -3, 2.5, -1,

            3, .5, 1,
            3, .5, -1,
            3, 2.5, -1,

            3, 2.5, -1,
            3, 2.5, 1,
            3, .5, 1,

            -3, 2.5, -1,
            -3, .5, -1,
            -3, .5, 1,

            -3, .5, 1,
            -3, 2.5, 1,
            -3, 2.5, -1,
        ]);
        tbfbG.setAttribute('position', new T.BufferAttribute(tbfbV, 3));
        tbfbG.computeVertexNormals();
        let tbfbM = new T.MeshStandardMaterial({color: 0xffc611});
        let tbfbMesh = new T.Mesh(tbfbG, tbfbM);
        bus.add(tbfbMesh);

        let frontG = new T.BufferGeometry();
        const frontV  = new Float32Array([
            -4, .5, 1,
            -3, .5, 1,
            -4, 1, 1,
            -3, 1.5, 1,
            -4, .5, -1,
            -3, .5, -1,
            -4, 1, -1,
            -3, 1.5, -1
        ]);
        frontG.setAttribute('position', new T.BufferAttribute(frontV, 3));
        frontG.setIndex([
            0, 1, 3,
            3, 2, 0,
            4, 0, 2,
            2, 6, 4,
            5, 4, 6,
            6, 7, 5,
            2, 3, 7,
            7, 6, 2,
            1, 0, 4, 
            4, 5, 1
        ]);
        frontG.computeVertexNormals();
        let frontM = tbfbM;
        let frontMesh = new T.Mesh(frontG, frontM);
        bus.add(frontMesh);

        let wheelG = new T.CylinderGeometry(.5, .5, .5);
        wheelG.rotateX(Math.PI / 2);
        let wheelM = new T.MeshStandardMaterial({color: 0x000000});
        let wheel1 = new T.Mesh(wheelG, wheelM);
        let wheel2 = wheel1.clone(true);
        let wheel3 = wheel1.clone(true);
        let wheel4 = wheel1.clone(true);
        wheel1.position.set(2.25, .5, 1);
        wheel2.position.set(2.25, .5, -1);
        wheel3.position.set(-2.25, .5, 1);
        wheel4.position.set(-2.25, .5, -1);
        bus.add(wheel1, wheel2, wheel3, wheel4);

        let frontWindowG = new T.PlaneGeometry(1.9, .95);
        frontWindowG.rotateY(Math.PI / 2);
        frontWindowG.translate(-3.01, 1.5 + .95 / 2, 0);
        let frontWindowM = new T.MeshStandardMaterial({color: 0x000000, side: 2});
        let frontWindow = new T.Mesh(frontWindowG, frontWindowM);
        bus.add(frontWindow);

        super(`Bus-${busCtr++}`, bus);

        let ridePoint = new T.Object3D();
        ridePoint.translateY(10);
        ridePoint.translateX(8);
        ridePoint.translateZ(12);
        bus.add(ridePoint);
        this.rideable = ridePoint;
        this.obj = bus;
    }
}

let simpleCarCtr = 0;

export class SimpleCar extends GrObject {
    constructor() {
        let simpleCar = new T.Group();

        let carShape = new T.Shape();
        carShape.moveTo(-1.75, .25);
        carShape.lineTo(-1.75, .5);
        carShape.lineTo(-1, .75);
        carShape.lineTo(-.75, 1.25);
        carShape.lineTo(.5, 1.25);
        carShape.lineTo(1, .75);
        carShape.lineTo(1.5, .75);
        carShape.lineTo(1.5, .25);
        carShape.lineTo(-1.75, .25);

        let carG = new T.ExtrudeGeometry(carShape, {depth: 1.5, steps: 2});
        carG.translate(0, 0, -.75);
        let carM = new T.MeshStandardMaterial({color: "silver", roughness: .5});
        let carMesh = new T.Mesh(carG, carM);
        simpleCar.add(carMesh);

        let wheelG = new T.CylinderGeometry(.25, .25, .4);
        wheelG.rotateX(Math.PI / 2);
        let wheelM = new T.MeshStandardMaterial({color: 0x000000});
        let wheel1 = new T.Mesh(wheelG, wheelM);
        let wheel2 = wheel1.clone(true);
        let wheel3 = wheel1.clone(true);
        let wheel4 = wheel1.clone(true);
        wheel1.position.set(-1, .25, .85);
        wheel2.position.set(-1, .25, -.85);
        wheel3.position.set(1, .25, -.85);
        wheel4.position.set(1, .25, .85);
        simpleCar.add(wheel1, wheel2, wheel3, wheel4);

        let fwindG = new T.PlaneGeometry(1.6, .5);
        
        fwindG.rotateX(-1.107 + Math.PI / 2);
        fwindG.rotateY(Math.PI / 2);
        fwindG.translate(-.95, 1.1, 0)
        
        
        let fwindM = new T.MeshStandardMaterial({color: 0x000000, side: 2});
        let fwindMesh = new T.Mesh(fwindG, fwindM);
        simpleCar.add(fwindMesh);


        super(`SimpleCar-${simpleCarCtr++}`, simpleCar);

        this.obj = simpleCar;
    }
}

