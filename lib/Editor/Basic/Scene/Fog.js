import * as THREE from 'three'

/* 获取雾 存储 */
export function getFogStorage(fog) {

    if (!fog) return

    return {

        name: fog.name,

        type: fog instanceof THREE.Fog ? 'linear' : 'exp2',

        density: fog.density,

        color: fog.color.getHex(),

        near: fog.near,

        far: fog.far,

    }

}

/* 根据类型获取雾 */
function getFog(type, ...args) {

    if (type === 'linear') return new THREE.Fog(...args)

    else return new THREE.FogExp2(...args)

}

/* 设置 根据存储设置雾 */
export function setFogStorage(scene, storage) {

    if (!storage) return

    const fog = getFog(storage.type)

    fog.name = storage.name

    fog.color.set(storage.color)

    if (storage.type === 'linear') {

        fog.near = storage.near

        fog.far = storage.far

    }

    else fog.density = storage.density

    scene.fog = fog

}

/* 设置雾控制面板 */
export function setFogPanel(scene, folder) {

    let fogFolder = null

    const fogOption = { type: scene.fog instanceof THREE.FogExp2 ? 'exp2' : 'linear', enable: !!scene.fog }

    folder.add(fogOption, 'type', ['linear', 'exp2']).name('雾类型').onChange((v) => {

        scene.fog = getFog(v, scene.fog?.color)

        setFogFolder(v)

    })

    folder.add(fogOption, 'enable').name('启用雾').onChange((v) => {

        if (v) scene.fog = getFog(fogOption.type)

        else scene.fog = null

        setFogFolder(fogOption.type)

    })

    fogOption.enable && setFogFolder(fogOption.type)

    function setFogFolder(type) {

        if (fogFolder) {

            folder.removeFolder(fogFolder)

            fogFolder = null

        }

        if (!scene.fog) return

        fogFolder = folder.addFolder(type + '雾')

        fogFolder.addColor({ color: scene.fog.color.getHex() }, 'color').name('颜色').onChange((v) => scene.fog.color.set(v))

        if (type === 'linear') {

            fogFolder.add(scene.fog, 'near').name('近点')

            fogFolder.add(scene.fog, 'far').name('远点')

        }

        else {

            fogFolder.add(scene.fog, 'density').name('密度')

        }

    }

}

