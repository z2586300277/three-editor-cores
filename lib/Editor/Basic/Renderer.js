import * as THREE from 'three'

/* 获取renderer 存储 */
export function getRendererStorage(renderer) {

    return {

        outputColorSpace: renderer.outputColorSpace,

        toneMapping: renderer.toneMapping,

        toneMappingExposure: renderer.toneMappingExposure,

        shadowMap: {

            enabled: renderer.shadowMap.enabled,

            type: renderer.shadowMap.type,

        },

        color: renderer.getClearColor(new THREE.Color()).getHex(),

        opacity: renderer.getClearAlpha(),

        sortObjects: renderer.sortObjects,

    }

}

/*  设置renderer 值 */
export function setRendererStorage(renderer, storage) {

    if (!storage) return

    renderer.outputColorSpace = storage.outputColorSpace

    renderer.toneMapping = storage.toneMapping

    renderer.toneMappingExposure = storage.toneMappingExposure

    renderer.shadowMap.enabled = storage.shadowMap.enabled

    renderer.shadowMap.type = storage.shadowMap.type

    renderer.setClearColor(storage.color, storage.opacity)

    renderer.sortObjects = storage.sortObjects

}

/*  renderer 控制板 */
export function setRendererPanel(renderer, folder) {

    folder.addColor({ color: renderer.getClearColor(new THREE.Color()).getHex() }, 'color').onChange((v) => renderer.setClearColor(v, renderer.getClearAlpha())).name('渲染器背景色')

    folder.add({ opacity: renderer.getClearAlpha() }, 'opacity').min(0).max(1).onChange((v) => renderer.setClearAlpha(v)).name('渲染器背景透明度')

    folder.add(renderer, 'outputColorSpace', [THREE.SRGBColorSpace, THREE.LinearSRGBColorSpace]).name('渲染器输出编码')

    folder.add(renderer, 'toneMapping', [0, 1, 2, 3, 4]).name('色调映射').onChange(v => renderer.toneMapping = [THREE.NoToneMapping, THREE.LinearToneMapping, THREE.ReinhardToneMapping, THREE.CineonToneMapping, THREE.ACESFilmicToneMapping][v])

    folder.add(renderer, 'toneMappingExposure').min(0).max(50).name('色调映射曝光度')

    folder.add(renderer.shadowMap, 'enabled').name('阴影贴图')

    folder.add(renderer.shadowMap, 'type', [0, 1, 2, 3]).name('阴影贴图类型').onChange((v) => renderer.shadowMap.type = [THREE.BasicShadowMap, THREE.PCFShadowMap, THREE.PCFSoftShadowMap, THREE.VSMShadowMap][v])

    folder.add(renderer, 'sortObjects').name('排序对象')

}