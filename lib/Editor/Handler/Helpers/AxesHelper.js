import * as THREE from 'three'

export const axes = {

    showAxes: true,

    axesLength: 1000,

    axesHelper: null,

}

/* 获取坐标轴存储 */
export function getAxesHelperStorage(axes) {

    return {

        showAxes: axes.showAxes,

        axesLength: axes.axesLength

    }

}

/* 设置坐标轴存储 */
export function setAxesHelperStorage(scene, axes, storage) {

    if (!storage) return

    axes.showAxes = storage.showAxes

    axes.axesLength = storage.axesLength

    resolveAxesHelper(scene, axes)

}

/* 设置坐标轴面板 */
export function setAxesHelperPanel(scene, axes, folder) {

    folder.add(axes, 'showAxes').name('显示坐标轴').listen().onChange(() => resolveAxesHelper(scene, axes))

    folder.add(axes, 'axesLength').name('长度').onFinishChange(() => resolveAxesHelper(scene, axes))

}

/* 创建坐标轴 */
function setAxesHelper(length = 1000) {

    const axesHelper = new THREE.AxesHelper(length)

    axesHelper.name = 'AxesHelper'

    return axesHelper

}

/* 添加或者移除 坐标轴 */
export function resolveAxesHelper(scene, axes) {

    if (axes.axesHelper) {

        scene.remove(axes.axesHelper)

        axes.axesHelper.geometry.dispose()

        axes.axesHelper.material.dispose()

        axes.axesHelper = null

    }

    if (axes.showAxes) {

        axes.axesHelper = setAxesHelper(axes.axesLength)

        scene.add(axes.axesHelper)

    }

}

