
import * as THREE from 'three'
import { shaderInstall } from './Group/Shader/Shader'
import { setMainPanel } from './RootPanel/MainPanel'
import { setSelectPanel } from './RootPanel/SelectPanel'
import { getBasicStorage, setBasicStorage, setBasicPanel } from './Basic'
import { handler, handlerInstall, getHandlerStorage, setHandlerStorage, setHandlerPanel } from './Handler'
import { modelControls, modelControlsInstall, getModelControlsStorage, setModelControlsPanel } from './ModelControls'
import { innerMeshControls, getInnerMeshListStorage, setInnerMeshListStorage, setInnerMeshControlsPanel } from './InnerMeshControls'
import { drawControls, getDrawMeshListStorage, setDrawMeshListStorage, setDrawControlsPanel } from './DrawControls'
import { chartsMapControls, getGeoGroupListStorage, setGeoGroupListStorage, setChartsMapControlsPanel } from './ChartsMapControls'
import { particleControls, getParticleListStorage, setParticleListStorage, setParticleControlsPanel } from './ParticleControls'
import { borderGroupControls, getBorderGroupListStorage, setBorderGroupListStorage, setBorderGroupControlsPanel } from './BorderGroupControls'
import { textMeshControls, getTextMeshListStorage, setTextMeshListStorage, setTextMeshControlsPanel } from './TextMeshControls'
import { setAnimationControlsPanel } from './AnimationControls'
import { setDesignMeshControlsPanel } from './DesignMeshControls'

export function initSceneEditor(scene, camera, renderer, controls, transformControls, Composer, MixerList, ShaderList, CommonFrameList, Stats, DOM, sceneParams, setSceneParams = () => { }, userPermissions) {

    /* 保存当前配置 */
    function saveSceneEditor() {

        scene.tempStorage = { lightList: [], axes: null, gridHelper: null, modelList: [], innerMeshList: [], drawMeshList: [], geoGroupList: [], particleList: [], borderGroupList: [], textMeshList: [] }

        scene.children.forEach(i => {

            if (i instanceof THREE.Light) scene.tempStorage.lightList.push(i)

            else if (i instanceof THREE.AxesHelper) scene.tempStorage.axes = i

            else if (i instanceof THREE.GridHelper) scene.tempStorage.gridHelper = i

            else if (i.rootInfo) scene.tempStorage.modelList.push(i)

            else if (i.isInnerMesh) scene.tempStorage.innerMeshList.push(i)

            else if (i.isDrawMesh) scene.tempStorage.drawMeshList.push(i)

            else if (i.isGeoGroup) scene.tempStorage.geoGroupList.push(i)

            else if (i.isParticleMesh) scene.tempStorage.particleList.push(i)

            else if (i.isBorderGroup) scene.tempStorage.borderGroupList.push(i)

            else if (i.isTextMesh) scene.tempStorage.textMeshList.push(i)

        })

        /* 保存场景参数 */
        setSceneParams({

            ...getBasicStorage(scene, camera, renderer, controls, Composer),

            handler: getHandlerStorage(handler, transformControls),

            innerMeshList: getInnerMeshListStorage(scene.tempStorage.innerMeshList),

            textMeshList: getTextMeshListStorage(scene.tempStorage.textMeshList),

            drawMeshList: getDrawMeshListStorage(scene.tempStorage.drawMeshList),

            geoGroupList: getGeoGroupListStorage(scene.tempStorage.geoGroupList),

            borderGroupList: getBorderGroupListStorage(scene.tempStorage.borderGroupList),

            particleList: getParticleListStorage(scene.tempStorage.particleList),

            core: getCoreStorage(chartsMapControls, particleControls, borderGroupControls, textMeshControls),

        }, getModelControlsStorage(scene.tempStorage.modelList))

        transformControls.detach()

        Composer.effectPass.outlinePass.selectedObjects = []

    }

    /* 安装 */
    handlerInstall(scene, Stats, handler, transformControls)

    modelControlsInstall(scene, controls, transformControls, Composer, MixerList)

    shaderInstall(ShaderList, DOM)

    /* 存储 还原 */
    setCoreStorage({ chartsMapControls, particleControls, borderGroupControls, textMeshControls }, sceneParams.core)

    setBasicStorage(scene, camera, renderer, controls, Composer, sceneParams)

    setHandlerStorage(scene, transformControls, Stats, handler, sceneParams.handler)

    setDrawMeshListStorage(drawControls, scene, CommonFrameList, sceneParams.drawMeshList)

    setInnerMeshListStorage(scene, CommonFrameList, sceneParams.innerMeshList)

    setTextMeshListStorage(scene, CommonFrameList, sceneParams.textMeshList)

    setGeoGroupListStorage(scene, CommonFrameList, sceneParams.geoGroupList)

    setParticleListStorage(scene, DOM, CommonFrameList, sceneParams.particleList)

    setBorderGroupListStorage(scene, CommonFrameList, sceneParams.borderGroupList)

    /* 面板 */
    const GUI = setMainPanel(userPermissions.proxy, userPermissions.autoPlace)

    setBasicPanel(scene, camera, renderer, controls, Composer, transformControls, GUI.addFolder('场景配置'))

    setHandlerPanel(scene, transformControls, Stats, handler, GUI.addFolder('控制配置'))

    /* 3d 物体控制 */
    const Mesh_3D_Folder = GUI.addFolder('3D物体')

    Mesh_3D_Folder.open()

    setModelControlsPanel(modelControls, Mesh_3D_Folder.addFolder('模型配置'))

    setDrawControlsPanel(scene, transformControls, CommonFrameList, Mesh_3D_Folder.addFolder('绘制配置'))

    setInnerMeshControlsPanel(scene, transformControls, CommonFrameList, Mesh_3D_Folder.addFolder('内置物体'))

    setChartsMapControlsPanel(scene, transformControls, CommonFrameList, Mesh_3D_Folder.addFolder('三维地图'))

    setParticleControlsPanel(scene, transformControls, DOM, CommonFrameList, Mesh_3D_Folder.addFolder('粒子物体'))

    setBorderGroupControlsPanel(scene, transformControls, CommonFrameList, Mesh_3D_Folder.addFolder('边界物体'))

    setTextMeshControlsPanel(scene, transformControls, CommonFrameList, Mesh_3D_Folder.addFolder('文本物体'))

    setDesignMeshControlsPanel(scene, renderer, transformControls, DOM, CommonFrameList, Mesh_3D_Folder.addFolder('设计物体'))

    setAnimationControlsPanel(handler, controls, transformControls, CommonFrameList, GUI.addFolder('动画配置'))

    setSelectPanel(scene, renderer, ShaderList, DOM, CommonFrameList, GUI)

    return { handler, GUI, modelControls, chartsMapControls, drawControls, innerMeshControls, particleControls, saveSceneEditor }

}

/* 获取核心存储 */
function getCoreStorage(chartsMapControls, particleControls, borderGroupControls, textMeshControls) {

    return {

        chartsMapControls: {

            url: chartsMapControls.url,

            materialType: chartsMapControls.materialType

        },

        particleControls: {

            mapUrl: particleControls.mapUrl,

            shaderCodeName: particleControls.shaderCodeName

        },

        borderGroupControls: {

            url: borderGroupControls.url,

            materialType: borderGroupControls.materialType,

            dlength: borderGroupControls.dlength

        },

        textMeshControls: {

            fontLink: textMeshControls.fontLink,

            materialType: textMeshControls.materialType,

        }

    }

}

/* 设置核心存储 */
function setCoreStorage(core, storage) {

    if (!storage) return

    Object.keys(storage).forEach(i => {

        Object.keys(storage[i]).forEach(j => {

            core[i][j] = storage[i][j]

        })

    })

}