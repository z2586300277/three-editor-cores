
import { setMeshMaterialsBlendShader, Shader_Library } from '../../../Shader/ShaderApi'
import { getUniformsStorage, setUniformsStorage, setUniformsPanel } from './Uniforms.js'

export const shaderControls = {

    DOM: null,

    ShaderList: null

}

/* install */
export function shaderInstall(ShaderList, DOM) {

    shaderControls.ShaderList = ShaderList

    shaderControls.DOM = DOM

}

/* 跟获取mesh 对象是否存在 混合着色器 */
export function getBlendShaderProgramsStorage(mesh) {

    const { blendShaderPrograms } = mesh

    if (!blendShaderPrograms) return

    return {

        shaderProgramsCodeName: blendShaderPrograms.shaderProgramsCodeName,

        isBlendShaderPrograms: blendShaderPrograms.isBlendShaderPrograms,

        uniforms: getUniformsStorage(mesh.uniforms)

    }

}

/* 设置 storage */
export function setBlendShaderProgramsStorage(model, storage) {

    if (!storage) return

    model.blendShaderPrograms = storage

    const { DOM, ShaderList } = shaderControls

    const { shaderProgramsCodeName, isBlendShaderPrograms, uniforms } = storage

    if (!isBlendShaderPrograms) return

    const shaderProgram = Shader_Library[shaderProgramsCodeName](DOM)

    ShaderList.push(setMeshMaterialsBlendShader(model, shaderProgram))

    setUniformsStorage(model.uniforms, uniforms)

}

/* 根据 着色器编码着色 */
export function setShaderBlendWithCodeName(model, shaderProgramsCodeName) {

    model.blendShaderPrograms = {

        shaderProgramsCodeName,

        isBlendShaderPrograms: true,

        uniforms: null

    }

    const { DOM, ShaderList } = shaderControls

    const shaderProgram = Shader_Library[shaderProgramsCodeName](DOM)

    ShaderList.push(setMeshMaterialsBlendShader(model, shaderProgram))

}

/* 着色器程序面板  */
export function setShaderPanel(ShaderList, DOM, model, folder) {

    let uniformsPanel = null

    if (!model.blendShaderPrograms) {

        model.blendShaderPrograms = {

            shaderProgramsCodeName: '',

            isBlendShaderPrograms: false,

            uniforms: null

        }

    }

    else {

        if (model.uniforms) uniformsPanel = setUniformsPanel(model.uniforms, folder.addFolder(model.blendShaderPrograms.shaderProgramsCodeName + '配置'))

    }

    const { blendShaderPrograms } = model

    folder.add(blendShaderPrograms, 'shaderProgramsCodeName', Object.keys(Shader_Library)).name('着色标码')

    folder.add(blendShaderPrograms, 'isBlendShaderPrograms').name('混合着色器').onChange((v) => {

        if (v) {

            if (blendShaderPrograms.shaderProgramsCodeName) {

                const shaderProgram = Shader_Library[blendShaderPrograms.shaderProgramsCodeName](DOM)

                ShaderList.push(setMeshMaterialsBlendShader(model, shaderProgram))

                uniformsPanel = setUniformsPanel(shaderProgram.uniforms, folder.addFolder(blendShaderPrograms.shaderProgramsCodeName + '配置'))

            }

        }

        else {

            const index = ShaderList.findIndex(i => i.uuid == model.uuid)

            if (index !== -1) {

                ShaderList.splice(index, 1)

                model.destroyShaderProgram()

                uniformsPanel && folder.removeFolder(uniformsPanel)

            }

        }

    })

}




