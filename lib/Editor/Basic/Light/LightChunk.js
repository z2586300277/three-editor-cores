import * as THREE from 'three'

/* 根据类型获取灯光 */
export function getLight(type, parameters = {}) {

    let light = null

    switch (type) {

        case 'AmbientLight':

            light = getAmbientLight(parameters)

            break

        case 'DirectionalLight':

            light = getDirectionalLight(parameters)

            break

        case 'PointLight':

            light = getPointLight(parameters)

            break

        case 'SpotLight':

            light = getSpotLight(parameters)

            break

        case 'HemisphereLight':

            light = getHemisphereLight(parameters)

            break

        case 'RectAreaLight':

            light = getRectAreaLight(parameters)

            break

    }

    return light

}

/* 环境光 */
function getAmbientLight(parameters = {}) {

    return new THREE.AmbientLight(parameters.color || 0xffffff, parameters.intensity || 1)

}

/* 平行光 */
function getDirectionalLight(parameters = {}) {

    return new THREE.DirectionalLight(parameters.color || 0xffffff, parameters.intensity || 1)

}

/* 点光源 */
function getPointLight(parameters = {}) {

    return new THREE.PointLight(parameters.color || 0xffffff, parameters.intensity || 1, parameters.distance || 0, parameters.decay || 0)

}

/* 聚光灯 */
function getSpotLight(parameters = {}) {

    return new THREE.SpotLight(parameters.color || 0xffffff, parameters.intensity || 1, parameters.distance || 0, parameters.angle || Math.PI / 3, parameters.penumbra || 0, parameters.decay || 0)

}

/* 半球光 */
function getHemisphereLight(parameters = {}) {

    return new THREE.HemisphereLight(parameters.color || 0xffffff, parameters.groundColor || 0x000000, parameters.intensity || 1)

}

/* 矩形区域光 */
function getRectAreaLight(parameters = {}) {

    return new THREE.RectAreaLight(parameters.color || 0xffffff, parameters.intensity || 1, parameters.width || 100, parameters.height || 100)

}
