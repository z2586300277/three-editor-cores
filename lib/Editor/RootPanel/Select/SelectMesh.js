import { setMeshPanel } from '../../Group/Mesh'
import { setMapPanel, setMapAnimationPanel } from '../../Group/Mesh/Material/Map'
import { setMiniMaterialPanel } from '../../Group/Mesh/MiniMaterial'
import { setShaderPanel } from '../../Group/Shader/Shader'
import { setDesignPanel } from '../../DesignMesh/DesignMesh'

/* mesh select panel */
export function createSelectMeshPanel(scene, renderer, ShaderList, DOM, CommonFrameList, model, folder) {

    folder.selectPanel = folder.addFolder('#:' + model.name + '配置')

    setMeshPanel(model, folder.selectPanel.addFolder('基础配置'))

    if (Array.isArray(model.material)) model.material.forEach((i, k) => setMaterialConfig(folder.selectPanel, i, k))

    else setMaterialConfig(folder.selectPanel, model.material)

    setShaderPanel(ShaderList, DOM, model, folder.selectPanel.addFolder('着色器配置'))

    setDesignPanel(scene, renderer, DOM, model, folder.selectPanel.addFolder('设计配置'))

    function setMaterialConfig(folder, i, k = '') {

        setMiniMaterialPanel(i, folder.addFolder('材质配置' + k))

        if (i.isCustomTexture && i.map) {

            setMapPanel(i.map, folder.addFolder('贴图配置' + k))

            setMapAnimationPanel(CommonFrameList, i.map, folder.addFolder('贴图动画' + k))

        }

    }

}