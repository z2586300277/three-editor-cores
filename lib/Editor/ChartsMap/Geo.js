import * as THREE from 'three'
import { coordToVector2, translationOriginForMesh } from '../../Api/ThreeApi'
import { getMaterial } from '../Group/Mesh/Material/MaterialChunk'

/* 解析GeoJson */
export function resolveGeoJson(features, group) {

    features.forEach((i) => {

        if (i.geometry.type === 'MultiPolygon') i.geometry.coordinates.forEach((j) => j.forEach((z) => createShapeWithCoord(z, group, i)))

        else if (i.geometry.type === 'Polygon') i.geometry.coordinates.forEach((j) => createShapeWithCoord(j, group, i))

    })

}

/* 设置根据坐标形状 */
function createShapeWithCoord(coordinates, group, info = null) {

    const { globalConfig } = group

    const curvePoints = coordinates.map((k) => coordToVector2(k))

    const path = new THREE.Path(curvePoints)

    const shape = new THREE.Shape()

    shape.path = path

    globalConfig.geometry.isEmpty ? shape.holes.push(path) : shape.curves.push(path)

    const geometry = new THREE.ExtrudeGeometry(shape, { depth: 20, bevelEnabled: false, ...globalConfig.geometry.parameters })

    const material = getMaterial(group.materialType, { color: 0xffffff * Math.random(), transparent: true })

    const mesh = new THREE.Mesh(geometry, material)

    setMeshGeoInfo(mesh, info)

    translationOriginForMesh(mesh)

    group.attach(mesh)

}

/* 设置物体 geo 信息 */
export function setMeshGeoInfo(mesh, info) {

    mesh.name = info?.properties?.name

    if (info?.properties.center) {

        const coord2 = coordToVector2(info.properties.center)

        info.properties.centerCoord3 = new THREE.Vector3(coord2.x, coord2.y, 0)

    }

    if (info?.properties?.centroid) {

        const coord2 = coordToVector2(info.properties.centroid)

        info.properties.centroidCoord3 = new THREE.Vector3(coord2.x, coord2.y, 0)

    }

    mesh.geoInfo = info

}
