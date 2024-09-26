import { getDrawMeshStorage, setDrawMeshStorage, setDrawMeshPanel } from "./DrawMesh/DrawMesh"
import { materialList } from './Group/Mesh/Material/MaterialChunk'

/* 绘制配置 */
export const drawControls = {

    mode: '围栏物体',

    pointMode: '场景交点',

    pointModeList: ['场景交点', '地图区域中心', '地图行政中心'],

    modeList: ['围栏物体', '平面绘制', '曲线路径', '直线路径'],

    materialType: '标准材质',

    meshList: null,

    drawRootFolder: null,

    sceneEventCall: function (point, object) {

        switch (this.pointMode) {

            case '场景交点':

                return this.drawEventCall?.(point)

            case '地图区域中心':

                if (!object.geoInfo?.properties.centroidCoord3) return

                return this.drawEventCall?.(object.parent.getTransformedVector((object.geoInfo.properties.centroidCoord3.clone().add(object.position).sub(object.initTranslate))))

            case '地图行政中心':

                if (!object.geoInfo?.properties.centerCoord3) return

                return this.drawEventCall?.(object.parent.getTransformedVector((object.geoInfo.properties.centerCoord3.clone().add(object.position).sub(object.initTranslate))))

        }

    },

    drawEventCall: null,

    currentDrawFolder: null,

}

/* 获取存储 */
export function getDrawMeshListStorage(drawMeshList) {

    return drawMeshList.map(i => getDrawMeshStorage(i))

}

/* 设置绘制物体 */
export function setDrawMeshListStorage(drawControls, scene, CommonFrameList, List) {

    drawControls.meshList = List?.map(i => setDrawMeshStorage(scene, CommonFrameList, i))

}

/* 绘制配置面板 */
export function setDrawControlsPanel(scene, transformControls, CommonFrameList, folder) {

    drawControls.drawRootFolder = folder

    folder.add(drawControls, 'mode', drawControls.modeList).name('绘制模式')

    folder.add(drawControls, 'pointMode', drawControls.pointModeList).name('点模式')

    folder.add(drawControls, 'materialType', materialList).name('材质')

    folder.add({

        fn: () => {

            drawControls.currentDrawFolder && drawControls.currentDrawFolder.close()

            drawControls.currentDrawFolder = folder.addFolder(drawControls.mode + '-' + Date.now(), {})

            setDrawMeshPanel(drawControls, scene, transformControls, CommonFrameList, drawControls.currentDrawFolder)

            drawControls.currentDrawFolder.open()

        }

    }, 'fn').name('添加绘制组')


    drawControls.meshList?.forEach(i => {

        const { mesh } = i

        setDrawMeshPanel(drawControls, scene, transformControls, CommonFrameList, folder.addFolder(mesh.name + mesh.id), i)

    })

}
