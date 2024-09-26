import * as THREE from 'three'
import { getLightStorage, setLightStorage, setLightPanel, getLight } from './Light.js'

/* 获取 lightGroup 存储 */
export function getLightGroupStorage(list) {

    return list.map(i => getLightStorage(i))

}

/* 设置lightGroup */
export function setLightGroupStorage(scene, lightGroup) {

    if (!lightGroup) return

    lightGroup.forEach((i) => {

        const Light = getLight(i.type)

        setLightStorage(Light, i)

        scene.add(Light)

    })

}

/* 设置lightGroupPanel */
export function setLightGroupPanel(scene, folder, transformControls) {

    const lightOption = { lightType: 'AmbientLight' }

    folder.add(lightOption, 'lightType', ['AmbientLight', 'DirectionalLight', 'PointLight', 'SpotLight', 'HemisphereLight', 'RectAreaLight']).name('光源类型')

    folder.add({

        fn: function () {

            const Light = getLight(lightOption.lightType)

            scene.add(Light)

            setLightPanel(Light, folder.addFolder(Light.type + Light.id), transformControls)

            transformControls.attach(Light)

        }

    }, 'fn').name('点击添加光源');

    scene.children.forEach((i) => { i instanceof THREE.Light && setLightPanel(i, folder.addFolder(i.type + i.id), transformControls) })

}