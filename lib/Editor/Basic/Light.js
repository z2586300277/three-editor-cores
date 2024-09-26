import { getShadowStorage, setShadowStorage, setShadowPanel } from './Light/Shadow'
import { getLightTypeStorage, setLightTypeStorage, setLightTypePanel } from './Light/LightType'
export { getLight } from './Light/LightChunk'

/* 获取灯光存储 */
export function getLightStorage(light) {

    const { name, type, visible, position, color, intensity, castShadow, shadow } = light

    return {

        name,

        type,

        visible,

        position,

        color,

        intensity,

        castShadow,

        shadow: getShadowStorage(shadow),

        ...getLightTypeStorage(light)

    }

}

/* 设置灯光存储 */
export function setLightStorage(light, storage) {

    if (!storage) return

    light.name = storage.name

    light.visible = storage.visible

    light.color.set(storage.color)

    light.intensity = storage.intensity

    light.castShadow = storage.castShadow

    light.position.set(storage.position.x, storage.position.y, storage.position.z)

    setShadowStorage(light.shadow, storage.shadow)

    setLightTypeStorage(light, storage)

}

/* 设置灯光面板*/
export function setLightPanel(light, folder, transformControls) {

    folder.add(light, 'visible').name('可见性')

    folder.add(light, 'name').name('名称')

    folder.addColor({ color: light.color.getHex() }, 'color').name('颜色').onChange(v => light.color.set(v))

    folder.add(light, 'intensity').name('强度')

    folder.add({ fn: () => transformControls.attach(light) }, 'fn').name('拖拽控制')

    folder.add({

        fn: () => {

            transformControls.detach()

            light.parent.remove(light)

            light.dispose()

            folder.parent.removeFolder(folder)

        }

    }, 'fn').name('删除')

    // 阴影
    if (light.shadow) {

        folder.add(light, 'castShadow').name('投影')

        const shadowFolder = folder.addFolder('阴影配置')

        setShadowPanel(light.shadow, shadowFolder)

    }

    // 变换
    const transformFolder = folder.addFolder('变换配置')

    transformFolder.add(light.position, 'x').name('位置X')

    transformFolder.add(light.position, 'y').name('位置y')

    transformFolder.add(light.position, 'z').name('位置z')

    // 特殊
    const specificFolder = folder.addFolder('特定配置')

    setLightTypePanel(light, specificFolder)

}