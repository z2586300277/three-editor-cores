import { setMeshPanel } from '../../Group/Mesh'
import { setMiniRootMaterialsPanel } from '../../Group/Mesh/MiniMaterial'
import { setShaderPanel } from '../../Group/Shader/Shader'

/* 设置根面板 */
export function createSelectRootGroupPanel(ShaderList, DOM, model, folder, callback) {

    if (!model.RootMaterials) return callback(model)

    folder.selectPanel = folder.addFolder('$:' + model.name + '配置')

    setMeshPanel(model, folder.selectPanel.addFolder('基础配置'))

    setMiniRootMaterialsPanel(model.RootMaterials, folder.selectPanel.addFolder('遍历材质配置'))

    setShaderPanel(ShaderList, DOM, model, folder.selectPanel.addFolder('着色器配置'))

}