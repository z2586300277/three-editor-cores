import * as THREE from 'three'
import { getRootModel, getWebGLMouse, clickIntersect } from '../Api/ThreeApi'

/* 场景点击事件 */
export const sceneClick = (e, viewer, callback) => {

    const { scene, camera, handler, drawControls, transformControls, Composer, GUI } = viewer

    const { outlinePass } = Composer.effectPass

    transformControls.detach()

    const WEBGLMosue = getWebGLMouse(e)

    const intersects = clickIntersect(WEBGLMosue, camera, scene)

    const intersect = intersects.find(i => (i.object.visible == true) && getRootModel(i.object).visible)

    if (!intersect) return

    const { object, point } = intersect

    const rootModel = getRootModel(object)

    // 事件分发
    switch (handler.mode) {

        case '变换':

            outlinePass.selectedObjects = []

            handler.isTransformChildren ? transformControls.attach(object) : transformControls.attach(rootModel)

            break

        case '选择':

            outlinePass.selectedObjects = [object]

            GUI?.createSelectMeshPanel?.(object)

            break

        case '根选择':

            outlinePass.selectedObjects = [rootModel]

            GUI?.createSelectRootGroupPanel?.(rootModel)

            break

        case '场景绘制':

            drawControls.sceneEventCall(point, object)

            break

        case '点击信息':

            break

    }

    // 整理信息
    const currentInfo = { currentModel: object, currentRootModel: rootModel, point, mode: handler.mode }

    viewer.currentInfo = currentInfo

    handler.currentInfo = currentInfo

    callback(currentInfo)

}

/* 未加工场景点击 */
export function rawSceneClick(viewer) {

    const raycaster = new THREE.Raycaster()

    return {

        raycaster,

        getIntersects: (e, list) => {

            raycaster.setFromCamera(getWebGLMouse(e), viewer.camera)

            return raycaster.intersectObjects(list)

        }

    }

}

