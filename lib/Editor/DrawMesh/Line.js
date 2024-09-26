import { createLine2FromPoints } from '../../Api/ThreeApi'

export function setUpdateLineMesh(scene, drawParams) {

    const { drawPointList } = drawParams

    if (drawPointList.length < 2) {

        if (drawParams.mesh) {

            scene.remove(drawParams.mesh)

            drawParams.mesh = null

            drawParams.callback?.('remove')

        }

        return

    }

    const formatPoints = drawParams.drawPointList.reduce((i, j) => [...i, j.x, j.y + 1, j.z], [])

    if (!drawParams.mesh && drawParams.drawPointList.length > 1) {

        const mesh = createLine2FromPoints(formatPoints)

        mesh.isDrawMesh = true

        mesh.drawParams = drawParams

        drawParams.mesh = mesh

        scene.add(drawParams.mesh)

        drawParams.callback?.('set')

    }

    else if (drawParams.mesh && drawParams.drawPointList.length > 0) {

        drawParams.mesh.geometry.dispose()

        drawParams.mesh.geometry.setPositions(formatPoints)

        drawParams.mesh.computeLineDistances()

        drawParams.mesh.geometry.attributes.position.needsUpdate = true

    }

}