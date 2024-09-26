import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { EffectComposer } from 'three/examples/jsm//postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { SSRPass } from 'three/examples/jsm/postprocessing/SSRPass.js';
import { ReflectorForSSRPass } from 'three/examples/jsm/objects/ReflectorForSSRPass.js';
import { SAOPass } from 'three/examples/jsm/postprocessing/SAOPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import { ScreenMaskPass } from '../EffectComposer/ScreenMaskPass.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { ViewHelper } from 'three/examples/jsm/helpers/ViewHelper'
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import * as CANNON from 'cannon-es';
import gsap from 'gsap';
import proj4 from 'proj4';

/* 设置场景 */
export function createScene() {

    const scene = new THREE.Scene()

    scene.EnvBackground = null

    scene.environmentEnabled = false

    scene.envChangeUse = () => scene.environmentEnabled ? scene.environment = scene.EnvBackground : scene.environment = null

    scene.MeshEnvMapChangeUseList = []

    scene.SsrMeshList = []

    return scene

}

/* 设置相机 */
export function setCamera(scene, DOM) {

    const camera = new THREE.PerspectiveCamera(50, DOM.clientWidth / DOM.clientHeight, 0.1, 100000)

    camera.position.set(10, 10, 10)

    camera.name = 'PerspectiveCamera'

    scene.add(camera)

    return camera

}

/* 设置渲染器 */
export function setRenderer(initParams, DOM) {

    const renderer = new THREE.WebGLRenderer(initParams.webglRenderParams)

    renderer.setSize(DOM.clientWidth, DOM.clientHeight)

    renderer.setPixelRatio(initParams.pixelRatio)

    DOM.appendChild(renderer.domElement)

    return renderer

}

/* 轨道控制 */
export function setControls(camera, renderer) {

    const controls = new OrbitControls(camera, renderer.domElement)

    controls.enableDamping = true

    controls.dampingFactor = 0.05

    controls.minDistance = 1

    controls.maxDistance = 5000

    controls.minZoom = 1000

    controls.maxPolarAngle = Math.PI

    return controls

}

/* 根查找 */
export function getRootModel(object) {

    while (object.parent.type !== 'Scene') {

        object = object.parent

    }

    return object

}

/* 小立方体 */
export function setBoxGeometry(size = 1, color = 0xffffff) {

    const g = new THREE.BoxGeometry(size, size, size)

    const m = new THREE.MeshBasicMaterial({ color })

    const mesh = new THREE.Mesh(g, m)

    return mesh

}

/* 设置背景 */
export function setSceneBackground(scene, urls) {

    const sceneTexture = new THREE.CubeTextureLoader().load(urls)

    scene.background = sceneTexture

    scene.backgroundLoadCallback?.(sceneTexture)

}

/* 设置全集环境贴图资源 */
export function setEnvBackground(scene, urls) {

    const sceneEnvTexture = new THREE.CubeTextureLoader().load(urls)

    let sceneEnvBackground = null

    Object.defineProperty(scene, 'EnvBackground', {

        get: () => sceneEnvBackground,

        set: (value) => {

            sceneEnvBackground = value

            scene.envChangeUse?.()

            scene?.MeshEnvMapChangeUseList.forEach(f => f())

        }

    })

    scene.EnvBackground = sceneEnvTexture

}

/* 加载fbx */
export function loadFBX(url = '', callback) {

    const loader = new FBXLoader();

    const loaderService = { progress: () => { }, complete: () => { } }

    loader.load(url, (object3d) => {

        loaderService.complete(object3d)

        object3d.traverse((obj) => {

            if (obj.material) {

                if (Array.isArray(obj.material)) obj.material.map((item) => changeModelMaterial(item))

                else changeModelMaterial(obj.material)

                function changeModelMaterial(material) {

                    material.side = THREE.DoubleSide

                    material.vertexColors = false

                }

            }

        })

        callback(object3d)

    },

        xhr => loaderService.progress(xhr.loaded / xhr.total, xhr)

    )

    return loaderService

}

/* gltf 模型 */
export function loadGLTF(url = '', dracoPath = '/draco/', callback = () => { }) {

    const loader = new GLTFLoader()

    const loaderService = { progress: () => { }, complete: () => { } }

    loader.setDRACOLoader(new DRACOLoader().setDecoderPath(dracoPath))

    loader.load(

        url,

        gltf => {

            loaderService.complete(gltf.scene)

            gltf.scene.animations = gltf.animations

            callback(gltf.scene)
        },

        (xhr) => loaderService.progress(xhr.loaded / xhr.total, xhr),

        (e) => { }

    )

    return loaderService

}

/* 获取材质列表 */
export function getMaterials(object3d) {

    let materialArr = []

    object3d.traverse((c) => {

        if (c.isMesh) {

            if (Array.isArray(c.material)) c.material.forEach((i) => {

                materialArr.push(i)

            })

            else {

                materialArr.push(c.material)

            }

        }

    })

    object3d.disposeRoot = function () {

        this.traverse((c) => c.isMesh && c.geometry?.dispose())

        this?.RootMaterials.forEach((i) => {

            i.dispose()

            i.map?.dispose()

        })

    }

    return [...new Set(materialArr)]

}

/* obj 模型 */
export function loadOBJ(url = '', callback = () => { }) {

    const loader = new OBJLoader()

    const mtlLoader = new MTLLoader()

    const loaderService = { progress: () => { }, complete: () => { } }

    mtlLoader.load(url.replace('.obj', '.mtl'), (mtl) => {

        mtl.preload()

        loader.setMaterials(mtl)

        loader.load(url, (obj) => {

            loaderService.complete(obj)

            callback(obj)

        },

            xhr => loaderService.progress(xhr.loaded / xhr.total, xhr), e => { })

    })

    return loaderService

}

/* 性能监控 */
export function setStats(DOM) {

    let stats = new Stats()

    stats.setMode(0)

    // 设置监视器位置
    stats.domElement.style.position = 'absolute'

    stats.domElement.style.top = DOM.getBoundingClientRect().top + 'px'

    stats.domElement.style.left = DOM.getBoundingClientRect().left + 'px'

    stats.setStats = () => !DOM.contains(stats.domElement) && DOM.appendChild(stats.domElement)

    stats.destroy = () => DOM.contains(stats.domElement) && DOM.removeChild(stats.domElement)

    return stats

}

/* 设置时钟 fps */
export function setFpsClock(FPS = 144) {

    const clock = new THREE.Clock();

    if (FPS === null) return render => render(clock.getDelta())

    const renderT = 1 / FPS

    let timeS = 0;

    return (render) => {

        const T = clock.getDelta()

        timeS = timeS + T;

        if (timeS > renderT) {

            render(T)

            timeS = 0

        }

    }

}

/* 变换控制 */
export function setTransformControls(scene, camera, renderer, orbitControl) {

    const transformControls = new TransformControls(camera, renderer.domElement)

    transformControls.name = 'TransformControls'

    transformControls.traverse((c) => c.text = 'TransformControls')

    scene.add(transformControls)

    const box3 = new THREE.Box3()

    transformControls.addEventListener('dragging-changed', event => {

        orbitControl.enabled = !event.value

        transformControls.drag_change_callback(event.value)

        transformControls.dragChangeCallback?.(event.value)

    })

    transformControls.addEventListener('change', () => {

        if (!transformControls.box3Helper) return

        if (['Group', 'Mesh'].includes(transformControls?.object?.type)) {

            transformControls.box3Helper.box = box3.setFromObject(transformControls.object)

            transformControls.box3Helper.visible = true

        }

        else {

            transformControls.box3Helper.visible = false

        }

    })

    return transformControls

}

/* 鼠标位置 */
export function getWebGLMouse(event) {

    return new THREE.Vector2(

        (event.offsetX / event.target.clientWidth) * 2 - 1,

        -(event.offsetY / event.target.clientHeight) * 2 + 1

    )

}

/* 射线碰撞 */
export function clickIntersect(mouse, CAMERA, SCENE) {

    const raycaster = new THREE.Raycaster()

    raycaster.setFromCamera(mouse, CAMERA)

    //获取射线碰撞的物体
    const intersects = raycaster.intersectObjects(SCENE.children)

    return intersects.filter((i) => i.object.text !== 'TransformControls' && i.object.isMesh && i.object.visible)

}

/* 后期渲染 */
export function setEffectComposer(scene, camera, renderer, threeDom) {

    //创建效果组合器对象，可以在该对象上添加后期处理通道，通过配置该对象，使它可以渲染我们的场景，并应用额外的后期处理步骤，在render循环中，使用EffectComposer渲染场景、应用通道，并输出结果。
    const Composer = new EffectComposer(renderer)

    const pixelRatio = renderer.getPixelRatio()

    Composer.setSize(threeDom.clientWidth, threeDom.clientHeight)

    Composer.setPixelRatio(pixelRatio)

    Composer.setRenderWay = (type = '效果渲染') => {

        if (type === '源渲染') Composer.EffectComposerRender = () => renderer.render(scene, camera)

        else Composer.EffectComposerRender = () => Composer.render()

        Composer.renderWay = type

    }

    Composer.setRenderWay()

    Composer.effectPass = {}

    // 多场景渲染
    const renderPass = new RenderPass(scene, camera)

    Composer.addPass(renderPass);

    // ssao 通道
    const saoPass = new SAOPass(scene, camera)

    saoPass.enabled = false

    saoPass.params.saoIntensity = 0.01

    saoPass.params.saoScale = 100

    Composer.addPass(saoPass)

    Composer.effectPass.saoPass = saoPass

    //unrealBloomPass 泛光通道
    const unrealBloomPass = new UnrealBloomPass(new THREE.Vector2(threeDom.clientWidth, threeDom.clientHeight), 1.5, 0.4, 0.85)

    unrealBloomPass.enabled = false

    Composer.addPass(unrealBloomPass)

    Composer.effectPass.unrealBloomPass = unrealBloomPass

    // ssr 通道
    const ssrPass = new SSRPass({ renderer, scene, camera, width: threeDom.clientWidth, height: threeDom.clientHeight, selects: scene.SsrMeshList })

    ssrPass.thickness = 0.018; //厚度

    ssrPass.infiniteThick = false; //是否无限厚度

    ssrPass.maxDistance = 0.01; //最大距离

    ssrPass.opacity = 0.5;

    ssrPass.enabled = false

    Composer.addPass(ssrPass)

    Composer.effectPass.ssrPass = ssrPass

    // 需要选中的物体对象, 传入需要边界线进行高亮处理的对象
    const outlinePass = new OutlinePass(new THREE.Vector2(threeDom.clientWidth, threeDom.clientHeight), scene, camera)

    outlinePass.renderToScreen = true

    outlinePass.edgeStrength = 4 //粗

    outlinePass.edgeGlow = 0 //发光

    outlinePass.edgeThickness = 2 //光晕粗

    outlinePass.pulsePeriod = 0 //闪烁

    outlinePass.usePatternTexture = false //是否使用贴图

    outlinePass.visibleEdgeColor.set(0xfafe2f); // 设置显示的颜色

    outlinePass.hiddenEdgeColor.set(0xfafe2f); // 设置隐藏的颜色

    outlinePass.overlayMaterial.blending = THREE.CustomBlending;

    outlinePass.overlayMaterial.blendSrc = THREE.OneFactor;

    Composer.addPass(outlinePass)

    Composer.effectPass.outlinePass = outlinePass

    // 颜色校正器
    const outPutPass = new OutputPass()

    Composer.addPass(outPutPass);

    //锯齿处理
    const fxaaPass = new ShaderPass(FXAAShader)

    fxaaPass.multPixel = 1

    fxaaPass.resize = () => {

        fxaaPass.material.uniforms['resolution'].value.x = fxaaPass.multPixel / (threeDom.clientWidth * pixelRatio)

        fxaaPass.material.uniforms['resolution'].value.y = fxaaPass.multPixel / (threeDom.clientHeight * pixelRatio)

    }

    fxaaPass.resize()

    Composer.addPass(fxaaPass)

    Composer.effectPass.fxaaPass = fxaaPass

    // 遮罩通道
    const screenMaskPass = new ScreenMaskPass()

    screenMaskPass.enabled = false

    Composer.addPass(screenMaskPass)

    Composer.effectPass.screenMaskPass = screenMaskPass

    // 渲染器大小改变
    Composer.resize = () => {

        Composer.setSize(threeDom.clientWidth, threeDom.clientHeight)

        unrealBloomPass.setSize(threeDom.clientWidth, threeDom.clientHeight)

        fxaaPass.resize()

    }

    return { Composer, outlinePass, unrealBloomPass }

}

/* css2d渲染 */
export function setCss2DRenderer(threeDom) {

    const CssRender = new CSS2DRenderer()

    CssRender.resize = () => {

        CssRender.setSize(threeDom.clientWidth, threeDom.clientHeight)

        CssRender.domElement.style.zIndex = 0

        CssRender.domElement.style.position = 'relative'

        CssRender.domElement.style.top = -threeDom.clientHeight * 2 + 'px'

        CssRender.domElement.style.height = threeDom.clientHeight + 'px'

        CssRender.domElement.style.width = threeDom.clientWidth + 'px'

        CssRender.domElement.style.pointerEvents = 'none'

    }

    CssRender.resize()

    threeDom.appendChild(CssRender.domElement);

    return { CssRender, CSS2DObject }

}

/* css3d 渲染 */
export function setCss3DRenderer(threeDom) {

    const Css3Render = new CSS3DRenderer()

    Css3Render.resize = () => {

        Css3Render.setSize(threeDom.clientWidth, threeDom.clientHeight)

        Css3Render.domElement.style.zIndex = 0

        Css3Render.domElement.style.position = 'relative'

        Css3Render.domElement.style.top = -threeDom.clientHeight + 'px'

        Css3Render.domElement.style.height = threeDom.clientHeight + 'px'

        Css3Render.domElement.style.width = threeDom.clientWidth + 'px'

        Css3Render.domElement.style.pointerEvents = 'none'

    }

    Css3Render.resize()

    threeDom.appendChild(Css3Render.domElement);

    return { Css3Render, CSS3DObject }

}

/* 获取两点之间指定比例点 */
export function getDistanceScalePoint(point1, point2, scale = 0.9) {

    const distance = point1.distanceTo(point2)

    const direction = new THREE.Vector3().subVectors(point2, point1).normalize()

    return direction.multiplyScalar(distance * scale).add(point1)

}

/* 视角动画 */
export function createGsap(position, position_, gsapQuery = null) {

    //设置动画 x轴运动 持续时间
    return gsap.to(

        position,

        {

            ...position_,

            //间隔时间
            duration: 2,

            //动画参数名
            ease: 'none',

            //重复次数
            repeat: 0,

            //往返移动
            yoyo: false,

            yoyoEase: true,

            ...gsapQuery,

        }

    )

}

/* 动画播放 */
export function setMixerAnimation(object3d, mixerFrameCall = () => { }) {

    const clock = new THREE.Clock();

    const mixer = new THREE.AnimationMixer(object3d);

    object3d.mixerRender = () => {

        const deltaTime = clock.getDelta()

        mixerFrameCall()

        mixer.update(deltaTime);

    }

    return mixer

}

/* 执行 混合器动作 */
export function runMixerAction(mixer, action, speed = 1, startTime = 0, loop = true) {

    const animationAction = mixer.clipAction(action)

    animationAction.loop = loop ? THREE.LoopRepeat : THREE.LoopOnce // 循环

    animationAction.time = startTime

    animationAction.timeScale = speed // 播放速度

    animationAction.clampWhenFinished = true //停留到最后一帧

    return animationAction

}

/* 获取两点之间指定距离点  */
export function getPointDistance(point1, point2, distance) {

    // 获取两向量差值  向量归一化  向量乘距离
    return new THREE.Vector3().subVectors(point2, point1).normalize().multiplyScalar(distance).add(point1)

}

/* 相机目标点 距离点 */
export function getCameraTargetPoint(camera, distance) {

    const dir = new THREE.Vector3(); // 创建方向向量

    camera.getWorldDirection(dir); // 获得相机的朝向方向

    // 计算出距相机一定距离的目标点坐标
    const target = new THREE.Vector3()

    target.copy(camera.position).add(dir.multiplyScalar(distance))

    return target

}

/* 指针锁定控制器 */
export function setPointLockControls(camera, DOM) {

    // 创建 PointerLockControls 对象
    const pointLockControls = new PointerLockControls(camera, DOM);

    // 追加参数
    pointLockControls.speed = 0.5

    // 处理键盘事件以实现相机的移动
    const keyboard = {}

    const moveForward = () => pointLockControls.moveForward(pointLockControls.speed)

    const moveBackward = () => pointLockControls.moveForward(-pointLockControls.speed)

    const moveLeft = () => pointLockControls.moveRight(-pointLockControls.speed)

    const moveRight = () => pointLockControls.moveRight(pointLockControls.speed)

    const moveUp = () => pointLockControls.getObject().position.y += pointLockControls.speed

    const moveDown = () => pointLockControls.getObject().position.y -= pointLockControls.speed

    // 第一人称
    pointLockControls.PointLockRender = (deltaTime) => {

        if (!pointLockControls.disabledMove) {

            if (keyboard['KeyW']) {

                moveForward()

            }

            else if (keyboard['KeyA']) {

                moveLeft()

            }

            else if (keyboard['KeyS']) {

                moveBackward()

            }

            else if (keyboard['KeyD']) {

                moveRight()

            }

            else if (keyboard['Space']) {

                moveUp()

            }

            else if (keyboard['KeyC']) {

                moveDown()

            }

        }

        pointLockControls.renderCallback && pointLockControls.renderCallback(keyboard, pointLockControls.speed, deltaTime)

    }

    // 键盘事件 
    const onKeyDown = function (event) {

        event.preventDefault()

        keyboard[event.code] = true

    }

    // 键盘事件
    const onKeyUp = function (event) {

        event.preventDefault()

        keyboard[event.code] = false

    }

    // 锁定事件
    pointLockControls.addEventListener('lock', () => {

        window.addEventListener('keydown', onKeyDown)

        window.addEventListener('keyup', onKeyUp)

    })

    pointLockControls.addEventListener('change', () => {

    })

    // 解锁事件
    pointLockControls.addEventListener('unlock', () => {

        window.removeEventListener('keydown', onKeyDown)

        window.removeEventListener('keyup', onKeyUp)

        pointLockControls.renderCallback = null

    })

    // 启动指针锁定
    pointLockControls.lockStart = (callback) => {

        window.addEventListener('keydown', onKeyDown)

        window.addEventListener('keyup', onKeyUp)

        pointLockControls.lock()

        pointLockControls.renderCallback = callback

    }

    return pointLockControls

}

/* 获取物体中心等数据 */
export function getObjectBox3(object) {

    const box = new THREE.Box3().setFromObject(object);

    const { max, min } = box

    const center = new THREE.Vector3();

    box.getCenter(center);

    const radius = new THREE.Vector3().subVectors(max, min).length() / 2

    return { max, min, center, radius }

}

/* 获取最佳视角 */
export function getBestViewTarget(object, scale = 2.5) {

    const { center, max } = getObjectBox3(object)

    const distance = new THREE.Vector3().subVectors(max, center).length() * scale

    const position = getPointDistance(center, max, distance)

    return { position, target: center }

}

/* 模型键盘变换 */
export function transformModelWithKeyboard(model, keyboard, speed) {

    if (keyboard['KeyW']) {

        model.position.z -= speed

    }

    else if (keyboard['KeyA']) {

        model.position.x -= speed

    }

    else if (keyboard['KeyS']) {

        model.position.z += speed

    }

    else if (keyboard['KeyD']) {

        model.position.x += speed

    }

    else if (keyboard['ArrowUp']) {

        model.position.y += speed

    }

    else if (keyboard['ArrowDown']) {

        model.position.y -= speed

    }

}

/* 设置mesh 材质属性 */
export function setMeshMaterial(mesh, callback) {

    if (Array.isArray(mesh.material)) {

        mesh.material.forEach((i) => callback(i))

    }

    else {

        callback(mesh.material)

    }

}

/* 多变形顶点组算法处理  生成 索引组 面点组 uv组 */
export function multShapeGroup(pList, type = 'fence') {

    const length = pList.length

    const indexGroup = type === 'fence'

        ? pList.map((i, k) => (k - 1 > -1 && k + 1 < length) && (k % 2 === 0 ? [k, k + 1, k - 1] : [k, k - 1, k + 1])).filter((i) => i).reduce((i, j) => [...i, ...j], [])

        : pList.map((i, k) => (k >= 2) ? [0, k - 1, k] : false).filter((i) => i).reduce((i, j) => [...i, ...j], [])

    const faceGroup = pList.reduce((j, i) => [...j, i.x, i.y, i.z], [])

    const uvMaxMin = pList.reduce((p, i) => ({ x: [...p['x'], i['x']], y: [...p['y'], i['y']], z: [...p['z'], i['z']] }), { x: [], y: [], z: [] })

    // vu 点计算 二维面
    const Maxp = new THREE.Vector3(Math.max(...uvMaxMin.x), Math.max(...uvMaxMin.y), Math.max(...uvMaxMin.z))  // 最大点

    const Minp = new THREE.Vector3(Math.min(...uvMaxMin.x), Math.min(...uvMaxMin.y), Math.min(...uvMaxMin.z))  // 最小点

    const W = Maxp.x - Minp.x

    const H = Maxp.y - Minp.y

    const L = W > H ? W : H  // 以最大为基准

    // 顶点uv计算
    const uvGroup = pList.map((i, k, o) => new THREE.Vector2((i.x - Minp.x) / L, (i.y - Minp.y) / L)).reduce((i, j) => [...i, ...j], [])

    return { indexGroup, faceGroup, uvGroup }

}

/* 根据顶点组生成物体 */
export function multShapePlaneGeometry(faceGroup, indexGroup, uvGroup) {

    const geometry = new THREE.BufferGeometry();

    // 因为在两个三角面片里，这两个顶点都需要被用到。
    const vertices = new Float32Array(faceGroup);

    // itemSize = 3 因为每个顶点都是一个三元组。
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

    // 索引组 面
    if (indexGroup) {

        // 格式化索引面组
        let indexs = new Uint16Array(indexGroup);

        // 添加索引组
        geometry.index = new THREE.BufferAttribute(indexs, 1)

    }

    // uv 是二维坐标相当于三维物体展开图
    if (uvGroup) geometry.attributes.uv = new THREE.Float32BufferAttribute(uvGroup, 2)

    geometry.computeVertexNormals()

    return geometry

}

/* 更新多顶点物体 */
export function updateMultShapePlaneGeometry(geometry, faceGroup, indexGroup, uvGroup) {

    geometry.setIndex(indexGroup)

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(faceGroup, 3))

    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvGroup, 2))

    delete geometry.attributes.normal

    geometry.computeVertexNormals()

}

/* 视频贴图 */
export function createVideoTexture(url) {

    const video = document.createElement('video')

    video.crossOrigin = 'anonymous'

    video.src = url

    video.muted = true

    video.loop = true

    video.play()

    const texture = new THREE.VideoTexture(video)

    return texture

}

/* 将中心点设为原点 */
export function translationOriginForMesh(mesh) {

    // 计算模型的包围盒
    const boundingBox = new THREE.Box3().setFromObject(mesh)

    boundingBox.getCenter(mesh.position)

    mesh.geometry.center()

}

/* 将中心点设为原点 */
export function translationOriginForGroup(group) {

    // 计算模型的包围盒
    const boundingBox = new THREE.Box3().setFromObject(group);

    // 计算模型的中心点
    boundingBox.getCenter(group.position);

    group.translationOriginDiff = group.position.clone()

    // 计算变换后的向量
    group.getTransformedVector = (vec3) => {

        const transformVector = vec3.clone()

        // 中心变换同步
        transformVector.sub(group.translationOriginDiff)

        // 缩放同步
        transformVector.multiply(group.scale)

        // 旋转同步
        transformVector.applyEuler(group.rotation)

        // 位置同步
        transformVector.add(group.position)

        return transformVector

    }

    // 变换子模型位置
    group.traverse((c) => {

        c.isMesh && c.position.sub(group.position)

        c.initTranslate = c.position.clone()

    })

    // 重置模型位置
    group.position.set(0, 0, 0);

}

/* 获取经纬度转换二维坐标方式 */
export function coordToVector2(coord, slace = 10000) {

    const [lng, lat] = coord

    const [x, y] = proj4("EPSG:4326", "EPSG:3857", [lng, lat]);

    return new THREE.Vector2(x / slace, y / slace)

}

/* 转换为三维坐标 */
export function coordToVector3(coord, slace = 10000) {

    const [lng, lat] = coord

    const [x, y] = proj4("EPSG:4326", "EPSG:3857", [lng, lat]);

    return new THREE.Vector3(x / slace, y / slace, 0)

}

/* 处理内存 */
export function meshDispose(mesh) {

    mesh.geometry.dispose()

    if (Array.isArray(mesh.material)) {

        mesh.material.forEach((i) => {

            i.dispose()

            i.map?.dispose()

        })

    }

    else {

        mesh.material.dispose()

        mesh.material.map?.dispose()

    }

}

/* 创建视图 辅助器 */
export function setViewHelper(camera, DOM) {

    const viewHelper = new ViewHelper(camera, DOM)

    const viewHelperDOM = document.createElement('div')

    viewHelperDOM.style.position = 'absolute'

    DOM.appendChild(viewHelperDOM);

    return viewHelper

}

/* 使用贴图创建精灵物体 */
export function setSpriteMesh(texture) {

    const spriteMaterial = new THREE.SpriteMaterial({ sizeAttenuation: true, map: texture });

    const sprite = new THREE.Sprite(spriteMaterial);

    return sprite

}

/* 创建box3辅助器 */
export function setBox3Helper(color = 0xffff00) {

    const box = new THREE.Box3()

    const box3Helper = new THREE.Box3Helper(box, color);

    box3Helper.name = 'Box3Helper'

    box3Helper.visible = false

    return box3Helper

}

/* 创建line2 物体 */
export function createLine2FromPoints(points) {

    const material = new LineMaterial({

        color: 0x000000,

        linewidth: 0.001,

        vertexColors: false,

        dashed: false,

        alphaToCoverage: false,

    });

    const geometry = new LineGeometry().setPositions(points);

    const line = new Line2(geometry, material);

    line.computeLineDistances();

    return line

}

/* 物体修改材质 */
export function meshChangeMaterial(mesh, params) {

    if (Array.isArray(mesh.material)) mesh.material.forEach((i) => materialChangeByParams(i, params))

    else materialChangeByParams(mesh.material, params)

    mesh.meshRevertMaterial = () => {

        if (Array.isArray(mesh.material)) mesh.material.forEach((i) => i.revertMaterial())

        else mesh.material.revertMaterial()

    }

    return mesh

}

/* group 修改材质 */
export function groupChangeMaterial(group, params) {

    let materials = []

    group.traverse((c) => c.isMesh && !materials.includes(c.material) && materials.push(c.material))

    materials.forEach((i) => materialChangeByParams(i, params))

    group.meshRevertMaterial = () => materials.forEach((i) => i.revertMaterial())

    return group

}

/* 根据参数修改材质 */
export function materialChangeByParams(material, params = {}) {

    const revertParams = materialSetProperty(material, params)

    // 恢复材质
    material.revertMaterial = () => {

        materialSetProperty(material, revertParams)

    }

    return material

}

/* 材质修改属性 */
function materialSetProperty(material, params = {}) {

    const revertParams = {}

    Object.keys(params).forEach((key) => {

        if (key === 'color' || key === 'emissive') {

            revertParams[key] = material[key].getHex()

            material[key].set(params[key])

        }

        else {

            revertParams[key] = material[key]

            material[key] = params[key]

        }

    })

    material.needsUpdate = true

    return revertParams

}

/* 修改mesh 属性 */
export function meshChangeTransform(mesh, params = {}) {

    const revertParams = {}

    Object.keys(params).forEach((key) => {

        revertParams[key] = { x: mesh[key].x, y: mesh[key].y, z: mesh[key].z }

        mesh[key].set(params[key].x, params[key].y, params[key].z)

    })

    mesh.meshRevertTransform = () => {

        Object.keys(revertParams).forEach((key) => {

            mesh[key].set(revertParams[key].x, revertParams[key].y, revertParams[key].z)

        })

    }

    return mesh

}

/* 物体材质克隆 */
export function meshGroupCloneMaterial(object) {

    object.traverse((c) => {

        c.isCloneMaterial = true

        if (c.isMesh) {

            c.originMaterial = c.material

            if (Array.isArray(c.material)) c.material = c.material.map((i) => i.clone())

            else c.material = c.material.clone()

        }

    })

}

/* 曲线运动 */
export function createCurveFrame(curve, speed = 1, CommonFrameList) {

    return {

        id: Date.now(),

        curve,

        time: 0,

        pause: false,

        speed,

        start: function () {

            if (CommonFrameList.indexOf(this) > -1) return

            CommonFrameList.push(this)

            this.pause = false

        },

        destroy: function () {

            const index = CommonFrameList.indexOf(this)

            if (index > -1) CommonFrameList.splice(index, 1)

            delete this.start

            delete this.destroy

        },

        frameCallback: null,

        frameEndCallback: null,

        frameAnimationRender: function () {

            if (this.pause) return

            this.time += this.speed / 1000

            if (this.time > 1 || this.time < 0) {

                this.time = this.time > 1 ? 1 : 0

                this.pause = true

                return this.frameEndCallback?.('end')

            }

            this.frameCallback?.(this.curve.getPointAt(this.time))

        }

    }

}

/* 曲线与物体同步 */
export function pointSyncTransform(point, object) {

    // 缩放同步
    point.multiply(object.scale)

    // 旋转同步
    point.applyEuler(object.rotation)

    // 位置同步
    point.add(object.position)

    return point

}

/* 获取变化信息 */
export function getTransformInfo(mesh) {

    const { position, rotation, scale } = mesh

    return {

        position: { x: position.x, y: position.y, z: position.z },

        rotation: { x: rotation.x, y: rotation.y, z: rotation.z },

        scale: { x: scale.x, y: scale.y, z: scale.z },

    }

}

/* 根据变换信息设置物体 */
export function setTransformInfo(mesh, info) {

    if (!info) return

    const { position, rotation, scale } = info

    mesh.position.set(position.x, position.y, position.z)

    mesh.rotation.set(rotation.x, rotation.y, rotation.z)

    mesh.scale.set(scale.x, scale.y, scale.z)

}

/* 执行gsap 动作 */
export function setGsapMeshAction(mesh, _transformInfo, transformInfo_, gsapParams) {

    const { mode, query } = gsapParams

    setTransformInfo(mesh, _transformInfo)

    const promises_gsap = ['position', 'rotation', 'scale'].map(i => {

        return new Promise(resolve => {

            gsap[mode](mesh[i], {

                x: transformInfo_[i].x,

                y: transformInfo_[i].y,

                z: transformInfo_[i].z,

                ...query,

                onComplete: resolve

            })

        })

    })

    return Promise.all(promises_gsap)

}

/* 获取动作对象 */
export function getMeshAction(mesh, gsapParams) {

    const { mode, query } = gsapParams

    return {

        name: '',

        _transformInfo: mesh._transformInfo,

        transformInfo_: getTransformInfo(mesh),

        gsapParams: {

            mode,

            query: { ...query }

        }

    }

}

export function createPhysicsWorld(fixedTimeStep = 1 / 60, maxSubSteps = 10) {

    const world = new CANNON.World({

        gravity: new CANNON.Vec3(0, -9.82, 0), // m/s²

    })

    // 渲染时间略有不同的时间显示物理模拟的状态
    world.PhysicsRender = (deltaTime) => {

        world.step(fixedTimeStep, deltaTime, maxSubSteps)

        world.bodies.forEach(body => body.joinRender?.())

    }

    return world

}

/* 销毁scene */
export function disposeScene(scene) {

    scene.children.forEach(i => {

        scene.remove(i)

        i.traverse(object => {

            object.dispose?.()

            if (object instanceof THREE.Mesh) {

                object.geometry.dispose()

                if (object.material) {

                    if (Array.isArray(object.material)) object.material.forEach(material => {

                        material.dispose()

                        material.map?.dispose()

                    })

                    else {

                        object.material.dispose()

                        object.material.map?.dispose()

                    }

                }

            }

        })

    })

    scene.EnvBackground?.dispose()

    scene.background?.dispose()

    scene.children.length = 0

}

/* 场景划分 */
export function setClassifyScene(scene, arr = '全部') {

    scene.children.forEach(i => {

        if (['Group', 'Mesh'].includes(i.type) || i.isLight) {

            if (arr === '全部') i.visible = true

            else arr.some(j => i.name.indexOf(j) !== -1) ? i.visible = true : i.visible = false

        }

    })

}

/* 文字几何体 */
export function createTextGeometry(url, text, parameters = null) {

    const loader = new FontLoader()

    return new Promise(resolve => {

        loader.load(url, font =>

            resolve(new TextGeometry(text, {

                font,

                size: 1,

                depth: 0.2,

                height: 0.2,

                curveSegments: 12,

                bevelEnabled: true,

                bevelThickness: 0,

                bevelSize: 0,

                bevelSegments: 5,

                ...parameters

            }))

        )

    })

}

export function getObjectViews(object, fov = 50) {

    const { center, radius, max } = getObjectBox3(object)

    const dir = object.getWorldDirection(new THREE.Vector3()) // 物体方向

    const distance = radius / Math.tan(Math.PI * fov / 360) // 根据半径和相机视角 计算出距离

    const vector = dir.multiplyScalar(distance) // 方向距离向量

    const frontView = vector.clone().add(center)

    const leftView = vector.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), -Math.PI / 2).add(center)

    const rightView = vector.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2).add(center)

    const topView = vector.clone().applyAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2).add(center)

    const bottomView = vector.clone().applyAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2).add(center)

    const backView = vector.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI).add(center)

    const maxView = getPointDistance(center, max, center.distanceTo(max) / Math.tan(Math.PI * fov / 360))

    return { frontView, leftView, rightView, topView, bottomView, backView, maxView, target: center }

}