import { setUpdateFenceMesh } from './Fence.js'
import { setUpdateFaceMesh } from './Face.js'
import { setUpdateCurveLineMesh } from './CurveLine.js'
import { setUpdateLineMesh } from './Line.js'
import { getMeshStorage, setMeshPanel, setMeshStorage } from '../Group/Mesh.js'
import { getMaterialStorage, setMaterialPanel, setMaterialStorage } from '../Group/Mesh/Material.js'

/* 绘制面板 */
export function setDrawMeshPanel(drawControls, scene, transformControls, CommonFrameList, folder, params) {

    const meshFolder = folder.addFolder('相关控制')

    meshFolder.open()

    // 初始化绘制参数
    const draw_Params = params || {

        mode: drawControls.mode,

        materialType: drawControls.materialType,

        drawPointList: [],

        mesh: null,

    }

    draw_Params.callback = function (v) {

        if (v === 'remove') {

            for (const f in meshFolder.__folders) {

                meshFolder.removeFolder(meshFolder.__folders[f])
    
            }

        }

        else {

            setMeshPanel(this.mesh, meshFolder.addFolder('变换配置'))

            const materialFolder = meshFolder.addFolder('材质配置')

            setMaterialPanel(scene, CommonFrameList, this.mesh.material, materialFolder)

            if (this.mode === '直线路径') {

                materialFolder.add(this.mesh.material, 'linewidth').name('线宽')

            }

        }

    }

    // 附加选项
    setAdditionalOptions(scene, draw_Params, folder, params)

    if (params) {

        draw_Params.drawPointList.forEach(i => setPointPanel(scene, draw_Params, i, folder))

        draw_Params.callback('set')

    }

    // 绘制事件
    function drawEventCall(point) {

        draw_Params.drawPointList.push(point)

        setMeshFromPoints(scene, draw_Params)

        setPointPanel(scene, draw_Params, point, folder)

    }

    // 选中物体
    folder.add({ fn: () => draw_Params.mesh && transformControls.attach(draw_Params.mesh) }, 'fn').name('选中物体')

    folder.add({ fn: () => { drawControls.drawEventCall = drawEventCall } }, 'fn').name('操作当前组')

    folder.add({

        delete: () => {

            transformControls.detach()

            folder.parent.removeFolder(folder)

            draw_Params.mesh && scene.remove(draw_Params.mesh)

            drawControls.drawEventCall = null

        }

    }, 'delete').name('移除此组')

    drawControls.drawEventCall = drawEventCall

}

/* 添加点面板  */
function setPointPanel(scene, draw_Params, point, folder) {

    const drawPointList = draw_Params.drawPointList

    const pointController = folder.add({

        fn: () => {

            const index = drawPointList.indexOf(point)

            drawPointList.splice(index, 1)

            setMeshFromPoints(scene, draw_Params)

            folder.remove(pointController)

        }

    }, 'fn').name('移除点' + [point.x, point.y, point.z].map(i => i.toFixed(2)).join(','))

}

/*  附加选项 */
function setAdditionalOptions(scene, draw_Params, folder, params) {

    if (draw_Params.mode === '围栏物体') {

        if (!params) {

            draw_Params.fenceHeight = 50

            draw_Params.fenceClose = true

        }

        folder.add(draw_Params, 'fenceHeight').name('围栏高度').onChange(() => setMeshFromPoints(scene, draw_Params))

        folder.add(draw_Params, 'fenceClose').name('围栏闭合').onChange(() => setMeshFromPoints(scene, draw_Params))

    }

    else if (draw_Params.mode === '曲线路径') {

        if (!params) {

            draw_Params.height = 10

            draw_Params.axial = 'y'

            draw_Params.tubularSegments = 64

            draw_Params.radius = 0.08

            draw_Params.radialSegments = 8

            draw_Params.closed = false

        }

        const curveFolder = folder.addFolder('曲线配置')

        curveFolder.add(draw_Params, 'height').name('高度').onChange(() => setMeshFromPoints(scene, draw_Params))

        curveFolder.add(draw_Params, 'axial', ['x', 'y', 'z']).name('轴向').onChange(() => setMeshFromPoints(scene, draw_Params))

        curveFolder.add(draw_Params, 'tubularSegments', 1).name('管道分段').onChange(() => setMeshFromPoints(scene, draw_Params)).step(1)

        curveFolder.add(draw_Params, 'radius', 0.01).name('管道半径').onChange(() => setMeshFromPoints(scene, draw_Params))

        curveFolder.add(draw_Params, 'radialSegments', 1).name('管道半径分段').onChange(() => setMeshFromPoints(scene, draw_Params)).step(1)

        curveFolder.add(draw_Params, 'closed').name('管道闭合').onChange(() => setMeshFromPoints(scene, draw_Params))

    }

}

/* 生成绘制物体 */
function setMeshFromPoints(scene, params) {

    switch (params.mode) {

        case '围栏物体':

            setUpdateFenceMesh(scene, params)

            break;

        case '平面绘制':

            setUpdateFaceMesh(scene, params)

            break;

        case '曲线路径':

            setUpdateCurveLineMesh(scene, params)

            break;

        case '直线路径':

            setUpdateLineMesh(scene, params)

            break;

    }

}

export function getDrawMeshStorage(mesh) {

    const draw_Params = {}

    Object.keys(mesh.drawParams).forEach(k => {

        if (!['mesh', 'folder', 'callback'].includes(k)) {

            draw_Params[k] = mesh.drawParams[k]

        }

    })

    return {

        ...getMeshStorage(mesh),

        material: getMaterialStorage(mesh.material),

        draw_Params

    }

}

export function setDrawMeshStorage(scene, CommonFrameList, storage) {

    if (!storage) return

    const { draw_Params } = storage

    setMeshFromPoints(scene, draw_Params)

    setMeshStorage(draw_Params.mesh, storage)

    setMaterialStorage(scene, CommonFrameList, draw_Params.mesh.material, storage.material)

    return draw_Params

}