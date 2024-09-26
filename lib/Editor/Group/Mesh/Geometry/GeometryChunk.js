import * as THREE from 'three'

export const geometryList = ['立方体', '球体', '平面', '胶囊', '圆锥', '圆面', '圆柱', '圆环', '环面']

/* 根据类型获取几何体 */
export function getGeometry(T, parameters = {}) {

    let geometry = null

    switch (T) {

        case '立方体':

            geometry = getBoxGeometry(parameters)

            break

        case '球体':

            geometry = getSphereGeometry(parameters)

            break

        case '平面':

            geometry = getPlaneGeometry(parameters)

            break

        case '胶囊':

            geometry = getCapsuleGeometry(parameters)

            break

        case '圆锥':

            geometry = getConeGeometry(parameters)

            break

        case '圆面':

            geometry = getCircleGeometry(parameters)

            break

        case '圆柱':

            geometry = getCylinderGeometry(parameters)

            break

        case '圆环':

            geometry = getTorusGeometry(parameters)

            break

        case '环面':

            geometry = getRingGeometry(parameters)

            break

        default:

            geometry = getBoxGeometry(parameters)

    }

    geometry.geometryType = T

    return geometry

}

/* 获取立方体几何体 */
function getBoxGeometry(parameters = {}) {

    return new THREE.BoxGeometry(parameters.width || 5, parameters.height || 5, parameters.depth || 5, parameters.widthSegments || 1, parameters.heightSegments || 1, parameters.depthSegments || 1)

}

/* 获取球几何体 */
function getSphereGeometry(parameters = {}) {

    return new THREE.SphereGeometry(parameters.radius || 5, parameters.widthSegments || 32, parameters.heightSegments || 32)

}

/* 获取平面几何体 */
function getPlaneGeometry(parameters = {}) {

    return new THREE.PlaneGeometry(parameters.width || 5, parameters.height || 5, parameters.widthSegments || 32, parameters.heightSegments || 32)

}

/* 获取圆面几何体 */
function getCircleGeometry(parameters = {}) {

    return new THREE.CircleGeometry(parameters.radius || 5, parameters.segments || 32, parameters.thetaStart || 0, parameters.thetaLength || Math.PI * 2)

}

/* 获取胶囊几何体 */
function getCapsuleGeometry(parameters = {}) {

    return new THREE.CapsuleGeometry(parameters.radius || 5, parameters.length || 5, parameters.capSegments || 32, parameters.radialSegments || 32)

}

/* 获取圆锥几何体 */
function getConeGeometry(parameters = {}) {

    return new THREE.ConeGeometry(parameters.radius || 5, parameters.height || 5, parameters.radialSegments || 32)

}

/* 获取圆柱几何体 */
function getCylinderGeometry(parameters = {}) {

    return new THREE.CylinderGeometry(parameters.radiusTop || 5, parameters.radiusBottom || 5, parameters.height || 5, parameters.radialSegments || 32)

}

/* 获取圆环几何体 */
function getTorusGeometry(parameters = {}) {

    return new THREE.TorusGeometry(parameters.radius || 10, parameters.tube || 3, parameters.radialSegments || 32, parameters.tubularSegments || 32, parameters.arc || Math.PI * 2)

}

/* 获取环面几何体 */
function getRingGeometry(parameters = {}) {

    return new THREE.RingGeometry(parameters.innerRadius || 5, parameters.outerRadius || 10, parameters.thetaSegments || 32, parameters.phiSegments || 32, parameters.thetaStart || 0, parameters.thetaLength || Math.PI * 2)

}