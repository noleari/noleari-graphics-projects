/*jshint esversion: 6 */
// @ts-check

/**
 * Graphics Town Framework - "Main" File
 *
 * This is the main file - it creates the world, populates it with
 * objects and behaviors, and starts things running
 *
 * The initial distributed version has a pretty empty world.
 * There are a few simple objects thrown in as examples.
 *
 * It is the students job to extend this by defining new object types
 * (in other files), then loading those files as modules, and using this
 * file to instantiate those objects in the world.
 */

import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { WorldUI } from "../libs/CS559-Framework/WorldUI.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import { GableHouse, FlatHipHouse, BasicTree } from "./wb08-buildings.js";
import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrassField } from "./grass.js";
import { Bus } from "./wb08-cars.js";
import { GLTFLoader } from "../libs/CS559-Three/examples/jsm/loaders/GLTFLoader.js";
import { Apiary, ApiaryBox, Bee, Billboard, CornField, Fence, Mailbox, Silo, TractorShed } from "./misc-objects.js";

// make the world
let world = new GrWorld({
    width: 1000,
    height: 750,
    groundplanesize: 50, // make the ground plane big enough for a world of stuff
    lightBrightness: .6
});
world.groundplane.mesh.position.y -= 0.02;
world.scene.background = new T.Color(0xf0f0f0);
// put stuff into the world
// this calls the example code (that puts a lot of objects into the world)
// you can look at it for reference, but do not use it in your assignment

function grassIntoWorld() {
    let g1 = new GrassField(-1, 100, 5);
    g1.grassField.translateZ(47.5);
    world.add(g1);
    let g2 = new GrassField(-1, 47.5, 5);
    g2.grassField.translateZ(37.5);
    g2.grassField.translateX(-26.25);
    world.add(g2);
    let g3 = new GrassField(-1, 47.5, 5);
    g3.grassField.translateZ(37.5);
    g3.grassField.translateX(26.25);
    world.add(g3);
    let g4 = new GrassField(-1, 5.5, 60);
    g4.grassField.translateX(15.25);
    g4.grassField.translateZ(-17.5);
    world.add(g4);
    let g5 = new GrassField(-1, 30, 30);
    g5.grassField.position.set(33, 0, -2.5);
    world.add(g5);
    let g6 = new GrassField(-1, 13, 6);
    g6.grassField.position.set(41.5, 0, 15.5);
    world.add(g6);
    let g7 = new GrassField(-1, 32.5, 22.5);
    g7.grassField.position.set(18.75, 0, 23.75);
    world.add(g7);
    let g8 = new GrassField(-1, 45, 22.5);
    g8.grassField.position.set(-25, 0, 23.75);
    world.add(g8);
    let g9 = new GrassField(-1, 5, 5);
    g9.grassField.position.set(0, 0, 15);
    world.add(g9);
    let g10 = new GrassField(-1, 5, 16);
    g10.grassField.position.set(0, 0, 32);
    g10.grassBlades?.scale.set(1, .5, 1);
    world.add(g10);
}

let road;
function gravelRoad() {
    let txLoader = new T.TextureLoader()
    let gravelTX = txLoader.load("./images/rockRoad.jpg");
    let gravelNormalTX = txLoader.load("./images/rockRoadNormal.jpg");
    let gravelGroup = new T.Group();
    let gravelPlane1 = new T.Mesh(new T.PlaneGeometry(5, 5), new T.MeshStandardMaterial({map: gravelTX, normalMap: gravelNormalTX, color: "beige"}));
    gravelPlane1.translateZ(42.5);
    gravelPlane1.translateX(-47.5);
    gravelPlane1.rotateX(- Math.PI / 2);
    for (let i = 1; i < 20; ++i) {
        let c = gravelPlane1.clone(true);
        c.translateX(i * 5);
        gravelGroup.add(c);
    }
    gravelGroup.add(gravelPlane1);

    road = gravelGroup;
    world.add(new GrObject("gravel-road", gravelGroup));
}

let bus = new Bus();
bus.obj.position.set(47.5, 0, 42.5);
bus.obj.scale.set(1.5, 1.5, 1.5);
let buswait = 2000;
let hasStopped = false;
let womanSpawned = false;
bus.stepWorld = (delta, timeOfDay) => {
    if (bus.obj.position.x > 0 || hasStopped) {
        bus.obj.position.x -= delta * 0.01;
    }
    else if (!womanSpawned) {
        spawnWoman();
        womanSpawned = true;
    }
    else {
        buswait -= delta;
    }

    if (buswait <= 0) {
        hasStopped = true; 
        buswait = 2000;
    }
    if (bus.obj.position.x <= -47.5) {
        bus.obj.position.x = 47.5; 
        hasStopped = false;
        womanSpawned = false;
    }
}
world.add(bus);

let mainHouse = new GableHouse();
mainHouse.obj.translateZ(20);
mainHouse.obj.scale.setScalar(2);
mainHouse.roof.material.color = new T.Color(0x7C0A02)
world.add(mainHouse);

let mailbox = new Mailbox();
mailbox.mailbox.translateZ(39);
mailbox.mailbox.translateX(4);
world.add(mailbox);

let womanGroup = new T.Group();
let grWoman = new GrObject("AnimationWoman", womanGroup);
world.add(grWoman);
function spawnWoman() {
    let loader = new GLTFLoader();
    loader.load("./resources/Animated-Woman.glb", 
        (gltf) => {
            let object;
            if (gltf.scene instanceof T.Group) object = gltf.scene;
            object.children[0].children[1].children.forEach((obj) => {obj.material.metalness = 0;});
            object.children[0].children[2].children.forEach((obj) => {obj.material.metalness = 0;});
            object.children[0].children[3].children.forEach((obj) => {obj.material.metalness = 0;});
            object.children[0].children[4].material.metalness = 0;
            womanGroup.add(object);
            let mixer = new T.AnimationMixer(object);
            let action = mixer.clipAction(T.AnimationClip.findByName(gltf.animations, 'CharacterArmature|Walk'));
            object.translateZ(42.5);
            object.rotateY(Math.PI);
            object.scale.setScalar(1.25);
            let timeWalking = 4750;
            grWoman.stepWorld = (delta, timeOfDay) => {
                mixer.update(delta * 0.002);
                if (timeWalking > 0) {
                    object.translateZ(delta * 0.004);
                    timeWalking -= delta;
                }
                else {
                    womanGroup.children = [];
                }
            }
            action.play();
        }    
    )
}

let apiary1 = new Apiary();
apiary1.obj.position.set(40.5, 0, -40);
world.add(apiary1);
let apiary2 = new Apiary();
apiary2.obj.rotateY(Math.PI / 2);
apiary2.obj.position.set(25.5, 0, -40);
world.add(apiary2);
let apiary3 = new Apiary();
apiary3.obj.position.set(40.5, 0, -25);
apiary3.obj.rotateY(-Math.PI / 2);
world.add(apiary3);
let apiary4 = new Apiary();
apiary4.obj.position.set(25.5, 0, -25);
apiary4.obj.rotateY(Math.PI);
world.add(apiary4);

function fences() {
    let fences = new T.Group();
    for (let i = 0; i < 42; ++i) {
        let f = new Fence();
        f.position.set(49, 0, i * -2 + 33.5);
        f.rotateY(Math.PI / 2);
        fences.add(f);
    }
    for (let i = 0; i < 49; ++i) {
        let f = new Fence();
        f.position.set(48 + i * -2, 0, -49.5);
        f.rotateY(Math.PI);
        fences.add(f);
    }
    for (let i = 0; i < 41; ++i) {
        let f = new Fence();
        f.position.set(-49, 0, i * 2 -48.5);
        f.rotateY(-Math.PI / 2);
        fences.add(f);
    }
    let f = new Fence(false);
    f.position.set(-49, 0, 33.5);
    f.rotateY(-Math.PI / 2);
    fences.add(f);

    world.add(new GrObject("Fence", fences));
}

let tractorShed = new TractorShed();
tractorShed.obj.position.set(42, 0, 26.5);
tractorShed.obj.rotateY(-Math.PI / 2);
world.add(tractorShed);

let tractor = new T.Group();
tractor.position.set(42, 0, 26.5);
tractor.scale.set(.75, .75, .75);
tractor.rotateY(-Math.PI / 2);
let grTractor = new GrObject("Tractor", tractor);
world.add(grTractor);
let loader = new GLTFLoader();
loader.load("./resources/Tractor.glb", 
    (gltf) => {
        tractor.add(gltf.scene);
    }    
)

let shed1 = new FlatHipHouse();
shed1.obj.position.set(44, 0, 10);
shed1.obj.scale.set(2, 2, 2);
shed1.obj.rotateY(-Math.PI / 2);
world.add(shed1);
let shed2 = new FlatHipHouse();
shed2.obj.position.set(44, 0, -5);
shed2.obj.scale.set(2, 2, 2);
shed2.obj.rotateY(-Math.PI / 2);
world.add(shed2);

let cornField = new CornField();
cornField.obj.position.set(-17.5, 0, -17.5);
world.add(cornField);

let silo = new Silo();
silo.obj.position.set(-17.5, 0, 20);
world.add(silo);

let treeLine = new T.Group();
let grTreeLine = new GrObject("Treeline", treeLine);
world.add(grTreeLine);
new GLTFLoader().load("./resources/Tree.glb", 
    (gltf) => {
        let c = gltf.scene;
        c.scale.set(4, 4, 4);
        if (c instanceof T.Group) {
            for (let i = 0; i < 6; ++i) {
                let t = c.clone(true);
                t.position.set(15, 5, -42 + i * 10);
                t.rotateY(Math.PI / 3 * i);
                treeLine.add(t);
            }
        }
    }
);

let farmerG = new T.Group();
let farmerMixer;
let farmerAction;
let grFarmer = new GrObject("Farmer", farmerG);
world.add(grFarmer);
new GLTFLoader().load("./resources/Farmer.glb", 
    (gltf) => {
        /** @type {T.Group} */
        let farmer = gltf.scene;
        farmer.children[0].children[2].material.metalness = 0;
        farmer.children[0].children[3].children.forEach((item) => {item.material.metalness = 0});
        farmer.children[0].children[4].children.forEach((item) => {item.material.metalness = 0});
        //console.log(farmer);
        farmer.scale.set(1.5, 1.5, 1.5);
        farmerG.add(farmer);
        
        farmerMixer = new T.AnimationMixer(farmer);
        farmerAction = farmerMixer.clipAction(T.AnimationClip.findByName(gltf.animations, 'CharacterArmature|Walk'));
        farmerG.position.set(-20, 0, 35);

        let key;
        window.addEventListener('keydown', 
            (event) => {
                key = event.key;
            }
        );
        window.addEventListener('keyup', 
            (event) => {
                key = undefined;
            }
        );

        let prevTime = 0;
        function moveFarmer(time) {
            let delta = time - prevTime;
            prevTime = time;
            
            switch (key) {
                case 'w'://forward
                    farmerAction.play();
                    farmerMixer.update(delta * 0.002);
                    farmerG.position.z -= .15;
                    farmerG.rotation.y = Math.PI;
                    break;
                case 's'://back
                    farmerAction.play();
                    farmerMixer.update(delta * 0.002);
                    farmerG.position.z += .15;
                    farmerG.rotation.y = 0;
                    break;
                case 'a'://left
                    farmerAction.play();
                    farmerMixer.update(delta * 0.002);
                    farmerG.position.x -= .15;
                    farmerG.rotation.y = -Math.PI / 2;
                    break;
                case 'd'://right
                    farmerAction.play();
                    farmerMixer.update(delta * 0.002);
                    farmerG.position.x += .15;
                    farmerG.rotation.y = Math.PI / 2;
                    break;
                default:

            }

        

            requestAnimationFrame(moveFarmer);
        }
        requestAnimationFrame(moveFarmer);
    }
);

let billBoard = new Billboard();
billBoard.obj.position.set(-40, 0, 37.5);
world.add(billBoard);
 
fences();
grassIntoWorld();
gravelRoad();
// while making your objects, be sure to identify some of them as "highlighted"

///////////////////////////////////////////////////////////////
// because I did not store the objects I want to highlight in variables, I need to look them up by name
// This code is included since it might be useful if you want to highlight your objects here
function highlight(obName) {
    const toHighlight = world.objects.find(ob => ob.name === obName);
    if (toHighlight) {
        toHighlight.highlighted = true;
    } else {
        throw `no object named ${obName} for highlighting!`;
    }
}
// of course, the student should highlight their own objects, not these
highlight("Apiary-0");
highlight("Bus-0");
highlight("Grass-12");
highlight("Billboard");
highlight("AnimationWoman");
highlight("Farmer");
highlight("Fence");
highlight("Cornfield");
highlight("FlatHipHouse-0");
highlight("GableHouse-0");
highlight("Mailbox-0");
highlight("Silo");
highlight("Tractor");
highlight("TractorShed");
highlight("Treeline");
highlight("gravel-road");
// highlight("SimpleHouse-5");
// highlight("Helicopter-0");
// highlight("Track Car");
// highlight("MorphTest");

///////////////////////////////////////////////////////////////
// build and run the UI
// only after all the objects exist can we build the UI
// @ts-ignore       // we're sticking a new thing into the world
world.ui = new WorldUI(world);
// now make it go!
world.go();
