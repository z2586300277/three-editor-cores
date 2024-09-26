import * as THREE from 'three';

export const grid = {

    showGrid: true,

    size: 1000,

    divisions: 100,

    colorCenterLine: 0x444444,

    colorGrid: 0x888888,

    gridHelper: null

}

/* 设置grid Helper存储 */
export function getGridHelperStorage(grid) {

    return {

        showGrid: grid.showGrid,

        size: grid.size,

        divisions: grid.divisions,

        colorCenterLine: grid.colorCenterLine,

        colorGrid: grid.colorGrid

    }

}

/* 设置grid Helper存储 */
export function setGridHelperStorage(scene, grid, storage) {

    if (!storage) return

    grid.showGrid = storage.showGrid

    grid.size = storage.size

    grid.divisions = storage.divisions

    grid.colorCenterLine = storage.colorCenterLine

    grid.colorGrid = storage.colorGrid

    resolveGridHelper(scene, grid)

}

/* 设置grid Helper面板 */
export function setGridHelperPanel(scene, grid, folder) {

    folder.add(grid, 'showGrid').name('显示网格').listen().onChange(() => resolveGridHelper(scene, grid))

    folder.add(grid, 'size').name('大小').onFinishChange(() => resolveGridHelper(scene, grid)).min(1)

    folder.add(grid, 'divisions').name('分割数').onFinishChange(() => resolveGridHelper(scene, grid)).min(1)

    folder.addColor(grid, 'colorCenterLine').name('中心线颜色').onFinishChange(() => resolveGridHelper(scene, grid))

    folder.addColor(grid, 'colorGrid').name('网格颜色').onFinishChange(() => resolveGridHelper(scene, grid))

}

/* 创建grid Helper */
function setGridHelper(size = 1000, divisions = 100, colorCenterLine = 0x444444, colorGrid = 0x888888) {

    const gridHelper = new THREE.GridHelper(size, divisions, colorCenterLine, colorGrid)

    gridHelper.name = 'GridHelper'

    return gridHelper

}

/* 添加或者移除 grid Helper */
export function resolveGridHelper(scene, grid) {

    if (grid.gridHelper) {

        scene.remove(grid.gridHelper)

        grid.gridHelper.geometry.dispose()

        grid.gridHelper.material.dispose()

        grid.gridHelper = null

    }

    if (grid.showGrid) {

        grid.gridHelper = setGridHelper(grid.size, grid.divisions, grid.colorCenterLine, grid.colorGrid)

        scene.add(grid.gridHelper)

    }

}