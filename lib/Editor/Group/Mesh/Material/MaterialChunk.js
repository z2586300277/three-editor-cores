import * as THREE from 'three'

export const materialList = ['基础材质', '标准材质', '镜面高光材质', 'Lambert材质', '物理材质', '卡通材质']

/* 根据类型获取材质 */
export function getMaterial(T, params = null) {

    let material = null

    switch (T) {

        case '基础材质':

            material = getBasicMaterial(params)

            break

        case '标准材质':

            material = getStandardMaterial(params)

            break

        case '镜面高光材质':

            material = getPhongMaterial(params)

            break

        case 'Lambert材质':

            material = getLambertMaterial(params)

            break

        case '物理材质':

            material = getPhysicalMaterial(params)

            break

        case '卡通材质':

            material = getToonMaterial(params)

            break

        default:

            material = getBasicMaterial(params)

    }

    material.materialType = T

    material.transparent = true

    return material

}

/* 获取基础材质 */
function getBasicMaterial(params) {

    return new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, ...params })

}

/* 获取标准材质 */
function getStandardMaterial(params) {

    return new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide, ...params })

}

/* 获取镜面高光材质 */
function getPhongMaterial(params) {

    return new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.DoubleSide, ...params })

}

/* 获取Lambert材质 */
function getLambertMaterial(params) {

    return new THREE.MeshLambertMaterial({ color: 0xffffff, side: THREE.DoubleSide, ...params })

}

/* 获取物理材质 */
function getPhysicalMaterial(params) {

    return new THREE.MeshPhysicalMaterial({ color: 0xffffff, side: THREE.DoubleSide, ...params })

}

/* 获取卡通材质 */
export function getToonMaterial(params) {

    return new THREE.MeshToonMaterial({ color: 0xffffff, side: THREE.DoubleSide, ...params })

}