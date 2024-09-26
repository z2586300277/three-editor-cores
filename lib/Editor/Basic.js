import { getRendererStorage, setRendererStorage, setRendererPanel } from './Basic/Renderer.js';
import { getCameraSrorage, setCameraSrorage, setCameraPanel } from './Basic/Camera.js';
import { getControlsStorage, setControlsStorage, setControlsPanel } from './Basic/Controls.js';
import { getEnvironmentStorage, setEnvironmentStorage, setEnvironmentPanel } from './Basic/Environment.js';
import { getLightGroupStorage, setLightGroupStorage, setLightGroupPanel } from './Basic/LightGroup.js'
import { getComposerStorage, setComposerStorage, setComposerPanel } from './Basic/Composer.js';

/* 获取存储值 */
export function getBasicStorage(scene, camera, renderer, controls, Composer) {

    return {

        camera: getCameraSrorage(camera),

        controls: getControlsStorage(controls),

        renderer: getRendererStorage(renderer),

        lightGroup: getLightGroupStorage(scene.tempStorage.lightList),

        environment: getEnvironmentStorage(scene),

        composer: getComposerStorage(Composer),

    }

}

/* 设置存储值 */
export function setBasicStorage(scene, camera, renderer, controls, Composer, sceneParams) {

    setRendererStorage(renderer, sceneParams.renderer)

    setComposerStorage(Composer, sceneParams.composer)

    setEnvironmentStorage(scene, sceneParams.environment)

    setLightGroupStorage(scene, sceneParams.lightGroup)

    setCameraSrorage(camera, sceneParams.camera)

    setControlsStorage(controls, sceneParams.controls)

}

/* 创建基础控制面板 */
export function setBasicPanel(scene, camera, renderer, controls, Composer, transformControls, folder) {

    setRendererPanel(renderer, folder.addFolder('渲染器配置'))

    setCameraPanel(camera, folder.addFolder('相机配置'))

    setControlsPanel(controls, folder.addFolder('轨道控制'))

    setEnvironmentPanel(scene, folder.addFolder('环境配置'))

    setLightGroupPanel(scene, folder.addFolder('灯光配置'), transformControls)

    setComposerPanel(Composer, folder.addFolder('后期处理'))

}
