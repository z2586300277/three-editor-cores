import { getSkyStorage, setSkyStorage, setSkyPanel } from "./Scene/Sky"
import { getFogStorage, setFogStorage, setFogPanel } from './Scene/Fog.js';

/* 场景参数 存储 */
export function getEnvironmentStorage(scene) {

    const { background } = scene

    return {

        fog: getFogStorage(scene.fog),

        environmentEnabled: scene.environmentEnabled,

        background: getSkyStorage(background)

    }

}

/* 设置场景参数 */
export function setEnvironmentStorage(scene, storage) {

    if (!storage) return

    setFogStorage(scene, storage.fog)

    scene.environmentEnabled = storage.environmentEnabled

    scene.backgroundLoadCallback = texture => setSkyStorage(texture, storage.background)

}

/* 设置场景参数面板 */
export function setEnvironmentPanel(scene, folder) {

    if (!folder) return

    setFogPanel(scene, folder.addFolder('雾配置'))

    folder.add(scene, 'environmentEnabled').name('全局环境贴图').onChange((value) => {

        scene.environment = value ? scene.EnvBackground : null

    })

    let backFolder = null

    folder.add({

        fn: () => {

            if (backFolder) return

            backFolder = setSkyPanel(scene.background, folder.addFolder('背景配置'))

        }

    }, 'fn').name('加载背景参数')

}


