import * as THREE from 'three'
import { getMaterial } from '../Group/Mesh/Material/MaterialChunk'
import { multShapeGroup, multShapePlaneGeometry, updateMultShapePlaneGeometry } from '../../Api/ThreeApi'

/* 根据点去创建或更新面片物体 */
export function setUpdateFaceMesh(scene, drawParams) {

    const pointList = [...drawParams.drawPointList]

    if (pointList.length < 3) {

        if (drawParams.mesh) {

            scene.remove(drawParams.mesh)

            drawParams.mesh = null

            drawParams.callback?.('remove')

        }

        return

    }

    pointList.forEach(i => i.y += 0.1)

    const { indexGroup, faceGroup, uvGroup } = multShapeGroup(pointList, 'face')

    if (drawParams.drawPointList.length > 2 && !drawParams.mesh) {

        const geometry = multShapePlaneGeometry(faceGroup, indexGroup, uvGroup)

        const material = getMaterial(drawParams.materialType, { color: 0xffffff })

        const mesh = new THREE.Mesh(geometry, material)

        mesh.isDrawMesh = true

        mesh.drawParams = drawParams

        drawParams.mesh = mesh

        scene.add(drawParams.mesh)

        drawParams.callback?.('set')

    }

    else if (drawParams.mesh) updateMultShapePlaneGeometry(drawParams.mesh.geometry, faceGroup, indexGroup, uvGroup)

}