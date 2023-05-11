import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import { shaderMaterial } from "../libs/CS559-Framework/shaderHelper.js";
import * as T from "../libs/CS559-Three/build/three.module.js";
import { GLTFLoader } from "../libs/CS559-Three/examples/jsm/loaders/GLTFLoader.js";
import { GrassField } from "./grass.js";

let txloader = new T.TextureLoader();
let wood = txloader.load("./images/wood.jpg");


let mailboxctr = 0;

export class Mailbox extends GrObject {
    constructor() {
        let mailbox = new T.Group();

        let baseG = new T.BoxGeometry(.25, 2, .25);
        let baseM = new T.MeshStandardMaterial({map: wood});
        let base = new T.Mesh(baseG, baseM);
        base.translateY(1);
        mailbox.add(base);

        let top = new T.Group();
        top.translateY(2.25);
        mailbox.add(top);

        let topM = new T.MeshStandardMaterial({color: 0xDA291C, metalness: 0.1});
        let topBoxG = new T.BoxGeometry(.5, .5, .75);
        let topBox = new T.Mesh(topBoxG, topM);
        //topBox.translateY(2.25);
        top.add(topBox);

        let topCylinderG = new T.CylinderGeometry(.25, .25, .75, undefined, undefined, undefined, 0, Math.PI);
        let topCylinder = new T.Mesh(topCylinderG, topM);
        topCylinder.translateY(.25);
        topCylinder.rotateX(Math.PI / 2);
        topCylinder.rotateY(Math.PI / 2);
        top.add(topCylinder);
        

        super(`Mailbox-${mailboxctr++}`, mailbox);
        this.mailbox = mailbox;
        this.top = top;
        this.topM = topM;
        this.base = base;
    }
}

export class Bee extends T.Group {
    constructor() {
        super();

        let body = new T.Group()
        this.add(body);
        
        let bodyTX1 = new T.TextureLoader().load("./images/beeStripes.jpeg");
        let bodyTX2 = new T.TextureLoader().load("./images/beeStripes2.jpg");

        let bfBodyG = new T.SphereGeometry(.5, undefined, undefined, undefined, undefined, 0, Math.PI / 2);
        let bfBodyM = new T.MeshStandardMaterial({map: bodyTX1});
        let bBody = new T.Mesh(bfBodyG, bfBodyM);
        bBody.translateX(.75);
        bBody.rotateZ(-Math.PI / 2);
        body.add(bBody);
        let fBody = new T.Mesh(bfBodyG, bfBodyM);
        fBody.translateX(-.75);
        fBody.rotateZ(Math.PI / 2);
        body.add(fBody);

        let bodyCG = new T.CylinderGeometry(.5, .5, 1.5, undefined, undefined, true);
        let bodyCM = new T.MeshStandardMaterial({map: bodyTX2});
        let bodyC = new T.Mesh(bodyCG, bodyCM);
        bodyC.rotateZ(Math.PI / 2);
        body.add(bodyC);

        let stingerG = new T.ConeGeometry(.075, .35);
        let stingerM = new T.MeshStandardMaterial({color: "black", roughness: 0.9,metalness: 0.9});
        let stinger = new T.Mesh(stingerG, stingerM);
        stinger.translateX(1.4);
        stinger.rotateZ(-Math.PI / 2);
        body.add(stinger);


        let head = new T.Group();
        this.add(head);

        let mainHeadG = new T.SphereGeometry(.45);
        let mainHeadM = new T.MeshStandardMaterial({color: "rgb(251, 223, 11)"});
        let mainHead = new T.Mesh(mainHeadG, mainHeadM);
        mainHead.translateX(-1.35);
        mainHead.translateY(.2);
        head.add(mainHead);

        let eyeG = new T.SphereGeometry(.15, 12, 8);
        let eyeM = new T.MeshStandardMaterial({color: "black", roughness: 0.25});
        let eye1 = new T.Mesh(eyeG, eyeM);
        eye1.translateY(.35)
        eye1.translateX(-1.7);
        eye1.translateZ(.15);
        let eye2 = new T.Mesh(eyeG, eyeM);
        eye2.translateY(.35)
        eye2.translateX(-1.7);
        eye2.translateZ(-.15);
        head.add(eye1, eye2);

        let antennaG = new T.CylinderGeometry(.03, .03, .25);
        let antennaM = new T.MeshStandardMaterial({color: "black"});
        let antenna1 = new T.Mesh(antennaG, antennaM);
        antenna1.translateX(-1.4);
        antenna1.translateY(.75);
        antenna1.translateZ(.25);
        antenna1.rotateX(Math.PI / 8);
        let antenna2 = new T.Mesh(antennaG, antennaM);
        antenna2.translateX(-1.4);
        antenna2.translateY(.75);
        antenna2.translateZ(-.25);
        antenna2.rotateX(-Math.PI / 8);
        head.add(antenna1, antenna2);

        let wingShape = new T.Shape();
        wingShape.ellipse(0, 4, 2, 4, 0, 2 * Math.PI, true, 0);
        let wingG = new T.ShapeGeometry(wingShape);
        wingG.scale(.15, .15, .15);
        let wingM = new T.MeshStandardMaterial({color: 0xf5d297, side: 2, opacity: .75});
        wingM.transparent = true;
        let wing1 = new T.Mesh(wingG, wingM);
        wing1.translateY(.475);
        wing1.translateZ(.05);
        wing1.rotateX(Math.PI / 4);
        let wing2 = new T.Mesh(wingG, wingM);
        wing2.translateY(.475);
        wing2.translateZ(-.05);
        wing2.rotateX(-Math.PI / 4);
        this.add(wing1, wing2);

        this.leftWing = wing1;
        this.rightWing = wing2;

        this.rotateY(Math.PI);
        this.scale.set(.25, .25, .25);
    }
}

let apiaryTX = new T.TextureLoader().load("./images/smooth-wooden-plank-textured-background.jpg");

export class ApiaryBox extends T.Group {
    constructor(color = 0xffffff) {
        super();

        let mainBoxG = new T.BoxGeometry(.75, .75, .85);
        let mainBoxM = new T.MeshStandardMaterial({color: color, map: apiaryTX});
        let mainBox = new T.Mesh(mainBoxG, mainBoxM);
        mainBox.translateY(.375);
        this.add(mainBox);

        let boxTopG = new T.BoxGeometry(.8, .2, .9);
        let boxTop = new T.Mesh(boxTopG, mainBoxM);
        boxTop.translateY(.65);
        this.add(boxTop);

        this.scale.set(1.5, 1.5, 1.5);
    }
}

let apiaryCtr = 0;

export class Apiary extends GrObject {
    constructor() {
        let apiary = new T.Group();
        let boxes = new T.Group();
        apiary.add(boxes);

        let box1 = new ApiaryBox(0x55cbcd);
        boxes.add(box1);
        let box2 = new ApiaryBox(0x8294C4);
        box2.translateY(1.15);
        box2.rotateY(.2);
        boxes.add(box2);
        let box3 = new ApiaryBox(0xF4B183);
        box3.translateY(2.3);
        box3.rotateY(-.1);
        boxes.add(box3);
        let box4 = new ApiaryBox(0xFFF2CC);
        box4.translateX(1.45);
        box4.rotateY(.1);
        boxes.add(box4);
        let box5 = new ApiaryBox(0xAEC2B6);
        box5.translateX(1.45);
        box5.translateY(1.15);
        boxes.add(box5);
        let box6 = new ApiaryBox(0xAEC2B6);
        box6.translateX(-1.7);
        box6.translateZ(1);
        box6.rotateY(.5);
        boxes.add(box6);
        let box7 = new ApiaryBox(0xB9F3E4);
        box7.translateX(-1.7);
        box7.translateZ(-.9);
        boxes.add(box7);
        let box8 = new ApiaryBox(0xC7E9B0);
        box8.translateX(-1.8);
        box8.translateZ(-.15);
        box8.translateY(1.15);
        boxes.add(box8);

        boxes.scale.set(1.35, 1.35, 1.35);
        
        let grassField = new GrassField(-1, 15, 15);
        apiary.add(grassField.grassField);

        let beeGroup = new T.Group();
        apiary.add(beeGroup);
        let beeGroupClockwise = new T.Group();
        let beeGroupCounter = new T.Group();
        beeGroup.add(beeGroupClockwise, beeGroupCounter);
        

        super(`Apiary-${apiaryCtr++}`, apiary);
        this.obj = apiary;
        this.grassField = grassField;
        this.bees = beeGroup;
        this.beeGroupClockwise = beeGroupClockwise;
        this.beeGroupCounter = beeGroupCounter;
        this.beeList = spawnBees();
        this.time = 0;

        function spawnBees() {
            let beeList = [];

            for (let i = 0; i < 10; ++i) {
                let b = new Bee();
                let x = Math.random() * 13 - 6.5;
                let y = Math.random() * 3 + 4;
                let z = Math.random() * 13 - 6.5;
                if (x < 2.5 && x > -2 || z < 1 && z > -1) {
                    y = Math.random() * 1 + 6;
                }
                b.position.set(x, y, z);
                let theta = Math.atan2(x, z);
                b.rotateY(theta);
                beeGroupCounter.add(b);
                beeList.push(b);
            }
            for (let i = 0; i < 10; ++i) {
                let b = new Bee();
                let x = Math.random() * 13 - 6.5;
                let y = Math.random() * 3 + 4;
                let z = Math.random() * 13 - 6.5;
                if (x < 2.5 && x > -2 || z < 1 && z > -1) {
                    y = Math.random() * 1 + 6;
                }
                b.position.set(x, y, z);
                let theta = Math.atan2(x, z);
                b.rotateY(theta - Math.PI);
                beeGroupClockwise.add(b);
                beeList.push(b);
            }

            return beeList;
        }
    }

    stepWorld(delta, timeOfDay) {
        this.time += delta;
        this.grassField.grassBlades.material.uniforms.time.value += delta * .5;
        this.beeGroupClockwise.rotateY(-delta * 0.002);
        this.beeGroupCounter.rotateY(delta * 0.002);
        this.beeList.forEach((bee) => {
            bee.translateY(Math.cos((this.time + Math.random()) * .0005) * .005);
            bee.leftWing.rotateX(Math.cos(this.time * .1) * .3);
            bee.rightWing.rotateX(-Math.cos(this.time * .1) * .3);
        });
    }
}


export class Fence extends T.Group {
    constructor(open = true) {
        super();

        let postG = new T.BoxGeometry(.35, 2, .35);
        //postG.translate(0, 1, 0);
        let postM = new T.MeshStandardMaterial({map: wood});
        let post1 = new T.Mesh(postG, postM);
        post1.translateX(-.9);
        post1.translateY(1);
        this.add(post1);

        let cross1 = new T.Mesh(postG, postM);
        cross1.translateY(1.5);
        cross1.rotateZ(Math.PI / 2);
        this.add(cross1);

        let cross2 = new T.Mesh(postG, postM);
        cross2.translateY(.5);
        cross2.rotateZ(Math.PI / 2);
        this.add(cross2);

        if (!open) {
            let post2 = new T.Mesh(postG, postM);
            post2.translateX(.9);
            post2.translateY(1);
            this.add(post2);
        }
    }
}

export class TractorShed extends GrObject {
    constructor() {
        let tractorShed = new T.Group();

        let postG = new T.BoxGeometry(.5, 8, .5);
        postG.translate(0, 4, 0);
        let woodM = new T.MeshStandardMaterial({map: wood});
        let postfr = new T.Mesh(postG, woodM);
        postfr.translateX(-8);
        postfr.translateZ(6);
        let postfl = new T.Mesh(postG, woodM);
        postfl.translateX(8);
        postfl.translateZ(6);
        let postbr = new T.Mesh(postG, woodM);
        postbr.translateX(-8);
        postbr.translateZ(-6);
        let postbl = new T.Mesh(postG, woodM);
        postbl.translateX(8);
        postbl.translateZ(-6);
        tractorShed.add(postfr, postfl, postbl, postbr);

        let shedGroundG = new T.PlaneGeometry(16.25, 12.25);
        let groundTX = new T.TextureLoader().load("./images/rockRoad.jpg");
        let shedGroundM = new T.MeshStandardMaterial({map: groundTX});
        let shedGround = new T.Mesh(shedGroundG, shedGroundM);
        shedGround.rotateX(-Math.PI / 2);
        tractorShed.add(shedGround);

        let roofG = new T.PlaneGeometry(19, 15);
        let roofTX = new T.TextureLoader().load("./images/RoofShingles.png");
        let roofM = new T.MeshStandardMaterial({map: roofTX, side: 2, color: 0xb90e0a});
        let roof = new T.Mesh(roofG, roofM);
        roof.translateY(8.52);
        roof.rotateX(-Math.PI / 2);
        tractorShed.add(roof);

        let acrossG = new T.BoxGeometry(17, .5, .5);
        let across1 = new T.Mesh(acrossG, woodM);
        across1.translateZ(6);
        across1.translateY(8.25);
        let across2 = new T.Mesh(acrossG, woodM);
        across2.translateZ(-6);
        across2.translateY(8.25);
        tractorShed.add(across1, across2);

        let acG = new T.BoxGeometry(.5, .5, 13);
        let ac1 = new T.Mesh(acG, woodM);
        ac1.translateX(-8);
        ac1.translateY(8.25);
        let ac2 = new T.Mesh(acG, woodM);
        ac2.translateX(8);
        ac2.translateY(8.25);
        tractorShed.add(ac1, ac2);

        let supportG = new T.BoxGeometry(.45, 2.5, .45);
        let support1 = new T.Mesh(supportG, woodM);
        support1.translateX(-7.2);
        support1.translateY(7.3);
        support1.translateZ(6);
        support1.rotateZ(-Math.PI / 4);
        let support2 = new T.Mesh(supportG, woodM);
        support2.translateX(7.2);
        support2.translateY(7.3);
        support2.translateZ(6);
        support2.rotateZ(Math.PI / 4);
        let support3 = new T.Mesh(supportG, woodM);
        support3.translateX(-7.2);
        support3.translateY(7.3);
        support3.translateZ(-6);
        support3.rotateZ(-Math.PI / 4);
        let support4 = new T.Mesh(supportG, woodM);
        support4.translateX(7.2);
        support4.translateY(7.3);
        support4.translateZ(-6);
        support4.rotateZ(Math.PI / 4);
        let support5 = new T.Mesh(supportG, woodM);
        support5.translateX(-8);
        support5.translateY(7.3);
        support5.translateZ(5.2);
        support5.rotateX(-Math.PI / 4);
        let support6 = new T.Mesh(supportG, woodM);
        support6.translateX(8);
        support6.translateY(7.3);
        support6.translateZ(5.2);
        support6.rotateX(-Math.PI / 4);
        let support7 = new T.Mesh(supportG, woodM);
        support7.translateX(8);
        support7.translateY(7.3);
        support7.translateZ(-5.2);
        support7.rotateX(Math.PI / 4);
        let support8 = new T.Mesh(supportG, woodM);
        support8.translateX(-8);
        support8.translateY(7.3);
        support8.translateZ(-5.2);
        support8.rotateX(Math.PI / 4);

        tractorShed.add(support1, support2, support3, support4, support5, support6, support7, support8);

        super("TractorShed", tractorShed);
        this.obj = tractorShed;
    }
}

export class CornField extends GrObject {
    constructor() {
        let cornField = new T.Group();
        

        let grassField = new GrassField(90000, 60, 60).grassField;
        cornField.add(grassField);

        let loader = new GLTFLoader();
        loader.load("./resources/Field-of-corn.glb", 
            (gltf) => {
                if (gltf.scene instanceof T.Group) {
                    gltf.scene.scale.set(.5, .5, .5);
                    for (let i = 0; i < 8; ++i) {
                        for (let j = 0; j < 5; ++j) {
                            let c = gltf.scene.clone(true);
                            c.position.set(i * 7 - 24.5, 0, j * 12 -24.5);
                            cornField.add(c);
                        } 
                    }
                }
            }
        )

        super("Cornfield", cornField);
        this.obj = cornField;
    }
}

export class Silo extends GrObject {
    constructor() {
        let silo = new T.Group();

        let baseG = new T.CylinderGeometry(4, 4, 15, undefined, undefined, true);
        let baseTX = new T.TextureLoader().load("./images/blue-corrugated-surface.jpg");
        let baseM = new T.MeshStandardMaterial({map: baseTX, color: 0xff0000});
        let base = new T.Mesh(baseG, baseM);
        base.rotateY(Math.PI);
        base.translateY(7.5);
        silo.add(base);

        let topG = new T.SphereGeometry(4, undefined, undefined, undefined, undefined, 0, Math.PI / 2);
        let topTX = new T.TextureLoader().load("./images/white-blue-metal-background.jpg");
        let topM = new T.MeshStandardMaterial({map: topTX});
        let top = new T.Mesh(topG, topM);
        top.translateY(15);
        silo.add(top);

        super("Silo", silo);
        this.obj = silo;
    }
}

export class Billboard extends GrObject {
    constructor() {
        let billBoard = new T.Group();

        let postG = new T.BoxGeometry(.35, 6, .35);
        postG.translate(0, 3, 0);
        let postM = new T.MeshStandardMaterial({color: 0xffffff, map: wood});
        let post1 = new T.Mesh(postG, postM);
        post1.translateX(-3);
        let post2 = new T.Mesh(postG, postM);
        post2.translateX(3);
        billBoard.add(post1, post2);

        let planeG = new T.PlaneGeometry(6, 4);
        let planeTX = new T.TextureLoader().load("./images/farmSign.jpg");
        let planeM = new T.MeshStandardMaterial({map: planeTX, side: 2});
        let plane = new T.Mesh(planeG, planeM);
        plane.translateY(3);
        billBoard.add(plane);

        super("Billboard", billBoard);
        this.obj = billBoard;
    }
}