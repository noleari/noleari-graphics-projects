/*jshint esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";

// define your buildings here - remember, they need to be imported
// into the "main" program

let houseFrontTX = new T.TextureLoader().load("./images/HouseFront.png");
let roofShingleTX = new T.TextureLoader().load("./images/RoofShingles.png");

let gableHouseCtr = 0;

export class GableHouse extends GrObject {
    constructor() {
        let gableHouse = new T.Group();

        let bottomGeometry = new T.BufferGeometry();

        const bottomVertices = new Float32Array([
            -4, 0, 2,
            4, 0, 2,
            -4, 4, 2,
            4, 4, 2,
            -4, 0, -2,
            4, 0, -2,
            -4, 4, -2,
            4, 4, -2,
            -4, 6, 0,
            4, 6, 0,
        ]);
        bottomGeometry.setAttribute('position', new T.BufferAttribute(bottomVertices, 3));
        bottomGeometry.setIndex([
            5, 4, 6,
            6, 7, 5,
            4, 0, 2,
            2, 6, 4,
            1, 5, 7,
            7, 3, 1,
            5, 1, 0,
            0, 4, 5,
            6, 2, 8,
            3, 7, 9
        ]);
        bottomGeometry.computeVertexNormals();
        let bottomMaterial = new T.MeshStandardMaterial({color: 0xffffff});
        let bottomMesh = new T.Mesh(bottomGeometry, bottomMaterial);
        gableHouse.add(bottomMesh);

        let houseFrontG = new T.BufferGeometry();
        const frontVertices = new Float32Array([
            -4, 0, 2,
            4, 0, 2,
            -4, 4, 2,
            4, 4, 2
        ]);
        const houseFrontUV = new Float32Array([
            0.01, 0,
            1, 0,
            0.01, 0.99,
            1, 0.99
        ])
        houseFrontG.setAttribute('position', new T.BufferAttribute(frontVertices, 3));
        houseFrontG.setAttribute('uv', new T.BufferAttribute(houseFrontUV, 2));
        houseFrontG.setIndex([
            0, 1, 3,
            3, 2, 0
        ]);
        houseFrontG.computeVertexNormals();
        let houseFrontM = new T.MeshStandardMaterial({color: 0xffffff, map: houseFrontTX});
        let houseFrontMesh = new T.Mesh(houseFrontG, houseFrontM);
        gableHouse.add(houseFrontMesh);

        let roofG = new T.BufferGeometry();
        const roofVertices = new Float32Array([
            -4, 4, 2,
            4, 4, 2,
            4, 6, 0,

            4, 6, 0,
            -4, 6, 0,
            -4, 4, 2,

            4, 4, -2,
            -4, 4, -2,
            -4, 6, 0,

            -4, 6, 0,
            4, 6, 0,
            4, 4, -2
        ]);
        const roofUV = new Float32Array([
            0, 0,
            1, 0,
            1, 1,

            1, 1,
            0, 1,
            0, 0,

            0, 0,
            1, 0,
            1, 1,

            1, 1,
            0, 1,
            0, 0
        ]);

        roofG.setAttribute('position', new T.BufferAttribute(roofVertices, 3));
        roofG.setAttribute('uv', new T.BufferAttribute(roofUV, 2));
        roofG.computeVertexNormals();

        let roofM = new T.MeshStandardMaterial({color: 0xffffff, map: roofShingleTX});
        let roofMesh = new T.Mesh(roofG, roofM);
        gableHouse.add(roofMesh);

        super(`GableHouse-${gableHouseCtr++}`, gableHouse);

        this.front = houseFrontMesh;
        this.roof = roofMesh;
        this.body = bottomMesh;
        this.obj = gableHouse;
    }
}

let flatHipHouseCtr = 0;

export class FlatHipHouse extends GrObject {
    constructor() {
        let flatHipHouse = new T.Group();

        let bodyG = new T.BufferGeometry();
        const bodyVertices = new Float32Array([
            -2, 0, 2,
            2, 0, 2,
            2, 4, 2,

            2, 4, 2,
            -2, 4, 2,
            -2, 0, 2,

            -2, 0, -2,
            -2, 0, 2,
            -2, 4, 2,

            -2, 4, 2,
            -2, 4, -2,
            -2, 0, -2,

            2, 0, 2,
            2, 0, -2,
            2, 4, -2,

            2, 4, -2,
            2, 4, 2,
            2, 0, 2,

            2, 0, -2,
            -2, 0, -2,
            -2, 4, -2,

            -2, 4, -2,
            2, 4, -2,
            2, 0, -2,

            2, 0, -2, 
            2, 0, 2,
            -2, 0, 2,

            -2, 0, 2,
            -2, 0, -2,
            2, 0, -2
        ]);
        const bodyUV = new Float32Array([
            0, 0,
            1, 0,
            1, 1,
            1, 1,
            0, 1,
            0, 0,
            0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1,
            0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1 
        ])
        bodyG.setAttribute('position', new T.BufferAttribute(bodyVertices, 3));
        bodyG.setAttribute('uv', new T.BufferAttribute(bodyUV, 2));
        bodyG.computeVertexNormals();
        let frontTX = new T.TextureLoader().load("./images/shedFront.png");
        let bodyM = new T.MeshStandardMaterial({color: 0xA1662F, map: frontTX});
        let bodyMesh = new T.Mesh(bodyG, bodyM);
        flatHipHouse.add(bodyMesh);

        let roofG = new T.BufferGeometry();
        const roofVertices = new Float32Array([
            -2, 4, 2,
            2, 4, 2,
            1, 5, 1,

            1, 5, 1,
            -1, 5, 1,
            -2, 4, 2,

            -2, 4, -2,
            -2, 4, 2,
            -1, 5, 1,

            -1, 5, 1,
            -1, 5, -1,
            -2, 4, -2,

            2, 4, -2,
            -2, 4, -2,
            -1, 5, -1,

            -1, 5, -1,
            1, 5, -1,
            2, 4, -2,

            2, 4, 2,
            2, 4, -2,
            1, 5, -1,

            1, 5, -1,
            1, 5, 1,
            2, 4, 2,

            -1, 5, 1,
            1, 5, 1,
            1, 5, -1,

            1, 5, -1,
            -1, 5, -1,
            -1, 5, 1
        ]);
        const roofUV = new Float32Array([
            0, 0,
            1, 0,
            1, 1,

            1, 1,
            0, 1,
            0, 0,

            0, 0,
            1, 0,
            1, 1,

            1, 1,
            0, 1,
            0, 0,

            0, 0,
            1, 0,
            1, 1,

            1, 1,
            0, 1,
            0, 0,

            0, 0,
            1, 0,
            1, 1,

            1, 1,
            0, 1,
            0, 0,

            0.1, 0.1,
            0.1, 0.1,
            0.1, 0.1,

            0.1, 0.1,
            0.1, 0.1,
            0.1, 0.1
        ]);
        roofG.setAttribute('position', new T.BufferAttribute(roofVertices, 3));
        roofG.setAttribute('uv', new T.BufferAttribute(roofUV, 2));
        roofG.computeVertexNormals();

        
        let roofM = new T.MeshStandardMaterial({color: 0xb90e0a, map: roofShingleTX});
        let roofMesh = new T.Mesh(roofG, roofM);
        flatHipHouse.add(roofMesh);

        super(`FlatHipHouse-${flatHipHouseCtr++}`, flatHipHouse);

        this.body = bodyMesh;
        this.roof = roofMesh;
        this.obj = flatHipHouse;
    }
}

let basicTreeCtr = 0;

export class BasicTree extends GrObject {
    constructor() {
        let basicTree = new T.Group();

        let baseG = new T.CylinderGeometry(.15, .15, 1);
        baseG.translate(0, .5, 0);
        let baseM = new T.MeshStandardMaterial({color: 0x371d10});
        let baseMesh = new T.Mesh(baseG, baseM);
        basicTree.add(baseMesh);

        let treeG = new T.ConeGeometry(.5, 1.5);
        treeG.translate(0, 1.5, 0);
        let treeM = new T.MeshStandardMaterial({color: 0x05472A});
        let treeMesh = new T.Mesh(treeG, treeM);
        basicTree.add(treeMesh);

        super(`BasicTree-${basicTreeCtr++}`, basicTree);

        this.obj = basicTree;
    }
}
 
