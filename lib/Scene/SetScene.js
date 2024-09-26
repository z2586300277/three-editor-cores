import * as THREE from 'three'
import { createScene, disposeScene, setStats, setCamera, setRenderer, setControls, setTransformControls, setEffectComposer, setCss2DRenderer, setCss3DRenderer, setFpsClock } from '../Api/ThreeApi'
import { initSceneEditor } from '../Editor/Editor.js'

/* 初始化场景 */
export function initScene(DOM, initParams, sceneParams, saveScene) {

    // 创建场景
    const scene = createScene()

    // 创建相机
    const camera = setCamera(scene, DOM)

    // 渲染场景
    const renderer = setRenderer(initParams, DOM)

    // 轨道控制
    const controls = setControls(camera, renderer)

    // 变换控制
    const transformControls = setTransformControls(scene, camera, renderer, controls)

    // 后期渲染
    const { Composer } = setEffectComposer(scene, camera, renderer, DOM)

    // Css3DOM
    const { Css3Render, CSS3DObject } = setCss3DRenderer(DOM)

    // Css2DOM
    const { CssRender, CSS2DObject } = setCss2DRenderer(DOM)

    // 模型动画
    const MixerList = []

    // 着色动画
    const ShaderList = []

    // 公共动画
    const CommonFrameList = []

    // 性能监控
    const Stats = setStats(DOM)

    // 控制面板
    const args = initSceneEditor(scene, camera, renderer, controls, transformControls, Composer, MixerList, ShaderList, CommonFrameList, Stats, DOM, { ...sceneParams }, (sceneParams, meshListParams) => saveScene(sceneParams, meshListParams), initParams.userPermissions)

    // 帧率控制
    const renderFps = setFpsClock(initParams.fps)

    // 渲染id
    let RENDER_ID = null

    // 渲染
    render()

    // 窗口变化
    function renderSceneResize() {

        camera.aspect = DOM.clientWidth / DOM.clientHeight

        camera.updateProjectionMatrix()

        renderer.setSize(DOM.clientWidth, DOM.clientHeight)

        Composer.resize()

        ShaderList.forEach(shaderMesh => shaderMesh.uniforms.iResolution && (shaderMesh.uniforms.iResolution.value = new THREE.Vector2(DOM.clientWidth, DOM.clientHeight)))

        Css3Render.resize()

        CssRender.resize()

    }

    // 销毁场景
    function destroySceneRender() {

        cancelAnimationFrame(RENDER_ID)

        disposeScene(scene)

        renderer.dispose()

        args.GUI?.destroy?.()

        while (DOM.children.length) DOM.removeChild(DOM.firstChild)

    }

    // 渲染函数
    function render() {

        renderFps(() => {

            Stats.update()  // 性能监控

            controls.update() // 更新控制器

            MixerList.forEach(mixer => mixer.mixerRender()) // 模型动画

            ShaderList.forEach(shader => shader.ShaderAnimateRender()) //着色器动画

            CommonFrameList.forEach(object => object.frameAnimationRender?.()) // 公共动画

            Composer.EffectComposerRender() // 后期渲染

            Css3Render.render(scene, camera) // Css3D渲染

            CssRender.render(scene, camera) // Css2D渲染

        })

        RENDER_ID = requestAnimationFrame(render)

    }

    return { scene, camera, renderer, controls, transformControls, MixerList, ShaderList, CommonFrameList, Stats, Composer, CSS3DObject, CSS2DObject, renderSceneResize, destroySceneRender, ...args }

}