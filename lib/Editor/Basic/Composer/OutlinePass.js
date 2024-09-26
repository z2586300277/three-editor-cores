import { Blending_Lib, Blending_Equ_Lib, Blending_Src_Lib, Blending_Dst_Lib } from '../../Group/Mesh/Material/CommonMaterial'

/* 获取 OutlinePass 存储 */
export function getOutlinePassStorage(outlinePass) {

    return {

        enabled: outlinePass.enabled,

        edgeStrength: outlinePass.edgeStrength,

        edgeGlow: outlinePass.edgeGlow,

        edgeThickness: outlinePass.edgeThickness,

        pulsePeriod: outlinePass.pulsePeriod,

        usePatternTexture: outlinePass.usePatternTexture,

        visibleEdgeColor: outlinePass.visibleEdgeColor.getHex(),

        hiddenEdgeColor: outlinePass.hiddenEdgeColor.getHex(),

        overlayMaterial: getOverlayMaterialStorage(outlinePass.overlayMaterial)

    }

}

/* 设置 OutlinePass 存储 */
export function setOutlinePassStorage(outlinePass, storage) {

    if (!storage) return

    outlinePass.enabled = storage.enabled

    outlinePass.edgeStrength = storage.edgeStrength

    outlinePass.edgeGlow = storage.edgeGlow

    outlinePass.edgeThickness = storage.edgeThickness

    outlinePass.pulsePeriod = storage.pulsePeriod

    outlinePass.usePatternTexture = storage.usePatternTexture

    outlinePass.visibleEdgeColor.setHex(storage.visibleEdgeColor)

    outlinePass.hiddenEdgeColor.setHex(storage.hiddenEdgeColor)

    setOverlayMaterialStorage(outlinePass.overlayMaterial, storage.overlayMaterial)

}

/* 设置 OutlinePass 控制面板 */
export function setOutlinePassPanel(outlinePass, folder) {

    folder.add(outlinePass, 'enabled').name('轮廓光开启')

    folder.add(outlinePass, 'edgeStrength').name('轮廓光强度')

    folder.add(outlinePass, 'edgeGlow').name('轮廓光辉度')

    folder.add(outlinePass, 'edgeThickness').name('轮廓光厚度')

    folder.add(outlinePass, 'pulsePeriod').min(0).max(5).name('轮廓光脉冲周期')

    folder.add(outlinePass, 'usePatternTexture').name('轮廓光纹理开启')

    folder.addColor({ color: outlinePass.visibleEdgeColor.getHex() }, 'color').onChange((v) => outlinePass.visibleEdgeColor.set(v)).name('轮廓光颜色')

    folder.addColor({ color: outlinePass.hiddenEdgeColor.getHex() }, 'color').onChange((v) => outlinePass.hiddenEdgeColor.set(v)).name('轮廓光隐藏颜色')

    setOverlayMaterialPanel(outlinePass.overlayMaterial, folder.addFolder('边缘混合'))

}

function getOverlayMaterialStorage(overlayMaterial) {

    return {

        blending: overlayMaterial.blending,

        blendEquation: overlayMaterial.blendEquation,

        blendSrc: overlayMaterial.blendSrc,

        blendDst: overlayMaterial.blendDst,

    }

}

function setOverlayMaterialStorage(overlayMaterial, storage) {

    if (!storage) return

    overlayMaterial.blending = storage.blending

    overlayMaterial.blendEquation = storage.blendEquation

    overlayMaterial.blendSrc = storage.blendSrc

    overlayMaterial.blendDst = storage.blendDst

}

function setOverlayMaterialPanel(overlayMaterial, folder) {

    folder.add(overlayMaterial, 'blending', Blending_Lib).name('混合模式').onChange(v => overlayMaterial.blending = Number(v))

    folder.add(overlayMaterial, 'blendEquation', Blending_Equ_Lib).name('混合方程式').onChange(v => overlayMaterial.blendingEquation = Number(v))

    folder.add(overlayMaterial, 'blendSrc', Blending_Src_Lib).name('混合源').onChange(v => overlayMaterial.blendingSrc = Number(v))

    folder.add(overlayMaterial, 'blendDst', Blending_Dst_Lib).name('混合目标').onChange(v => overlayMaterial.blendingDst = Number(v))

}