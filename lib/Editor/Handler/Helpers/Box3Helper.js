import * as THREE from 'three'

export const box3 = {

    useBox3: true,

    color: 0xffff00

}

/* 获取box3 存储 */
export function getBox3HelperStorage(box3) {

    return {

        useBox3: box3.useBox3,

        color: box3.color

    }

}

/* 设置box3 存储 */
export function setBox3HelperStorage(scene, transformControls, box3, storage) {

    if (!storage) return

    box3.useBox3 = storage.useBox3

    box3.color = storage.color

    resolveBox3Helper(scene, transformControls, box3)

}

/* 设置box3 面板 */
export function setBox3HelperPanel(scene, transformControls, box3, folder) {

    folder.add(box3, 'useBox3').name('使用Box3').listen().onChange(() => resolveBox3Helper(scene, transformControls, box3))

    folder.addColor(box3, 'color').name('颜色').onFinishChange(() => resolveBox3Helper(scene, transformControls, box3))

}

/* 创建或者移除 */
export function resolveBox3Helper(scene, transformControls, box3) {

    if (transformControls.box3Helper) {

        scene.remove(transformControls.box3Helper)

        transformControls.box3Helper.geometry.dispose()

        transformControls.box3Helper.material.dispose()

        transformControls.box3Helper = null

    }

    if (box3.useBox3) {

        transformControls.box3Helper = setBox3Helper(box3.color)

        scene.add(transformControls.box3Helper)

        if (transformControls.object) {

            transformControls.box3Helper.box = new THREE.Box3().setFromObject(transformControls.object)

            transformControls.box3Helper.visible = true

        }

    }

}

/* 创建 box3Helper */
function setBox3Helper(color = 0xffff00) {

    const box = new THREE.Box3()

    const box3Helper = new THREE.Box3Helper(box, color);

    box3Helper.name = 'Box3Helper'

    box3Helper.visible = false

    return box3Helper

}