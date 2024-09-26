import * as THREE from 'three'
import { getMaterial } from '../Group/Mesh/Material/MaterialChunk'
import { multShapeGroup, multShapePlaneGeometry, updateMultShapePlaneGeometry } from '../../Api/ThreeApi'

/* 围栏物体 */
export function setUpdateFenceMesh(scene, drawParams) {

    const pointList = [...drawParams.drawPointList]

    if (pointList.length < 2) {

        if (drawParams.mesh) {

            scene.remove(drawParams.mesh)

            drawParams.mesh = null

            drawParams.callback?.('remove')

        }

        return

    }

    if (drawParams.fenceClose && drawParams.drawPointList.length > 2) pointList.push(drawParams.drawPointList[0])

    const formatPoints = pointList.reduce((i, j) => {

        const k = new THREE.Vector3().copy(j)

        k.y += drawParams.fenceHeight

        return [...i, k, j]

    }, [])

    const { indexGroup, faceGroup, uvGroup } = multShapeGroup(formatPoints)

    if (formatPoints.length > 3 && !drawParams.mesh) {

        const geometry = multShapePlaneGeometry(faceGroup, indexGroup, uvGroup)

        const material = getMaterial(drawParams.materialType, { color: 0xffffff });

        const mesh = new THREE.Mesh(geometry, material);

        mesh.isDrawMesh = true

        mesh.drawParams = drawParams

        drawParams.mesh = mesh

        scene.add(drawParams.mesh)

        drawParams.callback?.('set')

    }

    else if (drawParams.mesh) updateMultShapePlaneGeometry(drawParams.mesh.geometry, faceGroup, indexGroup, uvGroup)

}