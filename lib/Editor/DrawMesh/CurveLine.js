import * as THREE from 'three'
import { getMaterial } from '../Group/Mesh/Material/MaterialChunk'

export function setUpdateCurveLineMesh(scene, drawParams) {

    const { drawPointList, height, axial, tubularSegments, radius, radialSegments, closed } = drawParams

    if (drawPointList.length < 2) {

        if (drawParams.mesh) {

            scene.remove(drawParams.mesh)

            drawParams.mesh = null

            drawParams.callback?.('remove')

        }

        return

    }

    const points = drawPointList.map(i => new THREE.Vector3(i.x, i.y, i.z)).map((i, k, arr) => {

        if (arr[k + 1]) {

            const center = i.clone().add(arr[k + 1]).divideScalar(2)

            center[axial] += height

            return [i, center]

        }

        else return [i]

    }).flat()

    const curve = new THREE.CatmullRomCurve3(points)

    if (!drawParams.mesh) {

        const geometry = new THREE.TubeGeometry(curve, tubularSegments, radius, radialSegments, closed)

        const material = getMaterial(drawParams.materialType, { color: 0xffffff })

        const mesh = new THREE.Mesh(geometry, material)

        mesh.isCurveMesh = true

        mesh.isDrawMesh = true

        mesh.drawParams = drawParams

        drawParams.mesh = mesh

        scene.add(drawParams.mesh)

        drawParams.callback?.('set')

    }

    else {

        drawParams.mesh.geometry.dispose()

        drawParams.mesh.geometry = new THREE.TubeGeometry(curve, tubularSegments, radius, radialSegments, closed)

    }

}