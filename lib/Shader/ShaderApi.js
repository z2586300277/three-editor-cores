import * as THREE from 'three'
import * as ShaderChunk_A from './ShaderChunk_A'
import * as ShaderChunk_B from './ShaderChunk_B'

const ShaderChunk = { ...ShaderChunk_A, ...ShaderChunk_B }

export const Shader_Library = {

    '彩虹光': ShaderChunk.getRainbowShader,

    '水波纹': ShaderChunk.getWaterLinesShader,

    '光圈扫射': ShaderChunk.getCircularRayLight,

    '晶片着色': ShaderChunk.getCrystalShader,

    '流光围栏': ShaderChunk.getFenceShader,

    '流光围栏2': ShaderChunk.getGradientFenceShader,

    '雪片着色': ShaderChunk.getSnowShader,

    '光线叠加': ShaderChunk.getSelfGlowShader,

    '绚烂线条': ShaderChunk.getBrilliantLineShader,

    '流光闪电': ShaderChunk.getLightningShader,

    '火焰燃烧': ShaderChunk.getFireShader,

    '流光栅格': ShaderChunk.getStreamerGrid,

    '着色天空': ShaderChunk.getShaderSky,

    '水面着色': ShaderChunk.getShaderWaterPlane,

    '热力图': ShaderChunk.getHeatMapShader

}

export const Shader_Library_Particles = {

    '彩虹光': ShaderChunk.getRainbowShader,

    '水波纹': ShaderChunk.getWaterLinesShader,

    '雪片着色': ShaderChunk.getSnowShader,

    '光线叠加': ShaderChunk.getSelfGlowShader,

    '绚烂线条': ShaderChunk.getBrilliantLineShader,

    '流光闪电': ShaderChunk.getLightningShader,

    '火焰燃烧': ShaderChunk.getFireShader,

    '流光栅格': ShaderChunk.getStreamerGrid,

}

/* 材质混合着色器 */
export function setMeshMaterialsBlendShader(model, shaderParams) {

    let shaderMaterials

    if (model.RootMaterials) shaderMaterials = model.RootMaterials

    else if (model.material) {

        if (Array.isArray(model.material)) shaderMaterials = model.material

        else shaderMaterials = [model.material]

    }

    if (!shaderMaterials) return

    const { glslProps, uniforms, ShaderAnimateRender } = shaderParams

    // 模型附加项
    model.ShaderAnimateRender = ShaderAnimateRender

    model.uniforms = uniforms

    // 材质处理
    shaderMaterials.forEach((i) => setMaterialBlendShader(i, uniforms, glslProps))

    // 重置材质
    model.destroyShaderProgram = () => {

        shaderMaterials.forEach((i) => {

            i.onBeforeCompile = () => { }

            i.dispose()

            i.needsUpdate = true

        })

        delete model.ShaderAnimateRender

        delete model.destroyShaderProgram

    }

    // 更新材质
    model.updateShaderProgram = () => {

        let newShader = shaderParams.updateShaderProgram(model.uniforms)

        shaderMaterials.forEach((i) => setMaterialBlendShader(i, newShader.uniforms, newShader.glslProps))

    }

    return model

}

/*  单一材质进行混合 */
function setMaterialBlendShader(material, uniforms, glslProps) {

    material.dispose()

    // 材质加工
    material.onBeforeCompile = (shader) => {

        // 写入变量
        Object.keys(uniforms).forEach((key) => shader.uniforms[key] = uniforms[key])

        // 顶点头部注入
        glslProps.vertexHeader && (shader.vertexShader = shader.vertexShader.replace(`void main() {`, glslProps.vertexHeader))

        // 头部注入
        shader.fragmentShader = shader.fragmentShader.replace(/#include <common>/, glslProps.fragHeader + '\n#include <common>\n' + (glslProps.fragFunc || ``))

        // 躯体注入
        shader.fragmentShader = shader.fragmentShader.replace('vec4 diffuseColor = vec4( diffuse, opacity );', glslProps.fragBody + (glslProps.lightFragEnd || ``))

    }

    material.needsUpdate = true

    return material

}

/* 公共uniforms 对象 */
export function getCommonUniforms(DOM) {

    return {

        iResolution: { type: 'vec2', value: new THREE.Vector2(DOM.clientWidth, DOM.clientHeight), unit: 'vec2' },

        iTime: { type: 'number', value: 1.0, unit: 'float' },

        speed: { type: 'number', value: 0.01, unit: 'float' },

        intensity: { type: 'number', unit: 'float', value: 1 },

        mixRatio: { type: 'number', unit: 'float', value: 0.5 },

        mixColor: { type: 'color', unit: 'vec3', value: new THREE.Color(0xffffff) },

        hasUv: { type: 'bool', unit: 'bool', value: false }

    }

}

/* UV 顶点片段 */
export const UV_VERTEX_HEAD = `varying vec2 vUv; \n void main() { \n vUv = uv;`

/* 获取格式化 uniform  */
export function getFormatFragHeader(uniforms) {

    return Object.keys(uniforms).map(i => 'uniform ' + uniforms[i].unit + ' ' + i + ';').join('\n')

}