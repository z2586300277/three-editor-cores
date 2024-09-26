import * as THREE from 'three'
import { getMapStorage, setMapStorage, setMaterialMapPanel } from './Map.js'

export const Blending_Lib = [THREE.NoBlending, THREE.NormalBlending, THREE.AdditiveBlending, THREE.SubtractiveBlending, THREE.MultiplyBlending, THREE.CustomBlending]

export const Blending_Equ_Lib = [THREE.AddEquation, THREE.SubtractEquation, THREE.ReverseSubtractEquation, THREE.MinEquation, THREE.MaxEquation]

export const Blending_Src_Lib = [THREE.ZeroFactor, THREE.OneFactor, THREE.SrcColorFactor, THREE.OneMinusSrcColorFactor, THREE.SrcAlphaFactor, THREE.OneMinusSrcAlphaFactor, THREE.DstAlphaFactor, THREE.OneMinusDstAlphaFactor, THREE.DstColorFactor, THREE.OneMinusDstColorFactor, THREE.SrcAlphaSaturateFactor]

export const Blending_Dst_Lib = [THREE.ZeroFactor, THREE.OneFactor, THREE.SrcColorFactor, THREE.OneMinusSrcColorFactor, THREE.SrcAlphaFactor, THREE.OneMinusSrcAlphaFactor, THREE.DstAlphaFactor, THREE.OneMinusDstAlphaFactor, THREE.DstColorFactor, THREE.OneMinusDstColorFactor]

/* 获取通用存储 */
export function getCommonMaterialStorage(material) {

    const { visible, color, wireframe, transparent, opacity, alphaTest, blending } = material;

    return {

        visible,

        color,

        wireframe,

        transparent,

        opacity,

        alphaTest,

        blending,

        ...getMapStorage(material)

    }

}

/* 设置通用存储 */
export function setCommonMaterialStorage(CommonFrameList, material, storage) {

    const { visible, color, wireframe, transparent, opacity, alphaTest, blending, map, mapUrl, mapType } = storage;

    material.visible = visible;

    material.color.setHex(color);

    material.wireframe = wireframe;

    material.transparent = transparent;

    material.opacity = opacity;

    material.alphaTest = alphaTest;

    material.blending = blending;

    if (mapUrl) {

        material.mapUrl = mapUrl

        material.mapType = mapType

        setMapStorage(CommonFrameList, material, map)

    }

}

/* 获取通用 面板 */
export function setCommonMaterialPanel(CommonFrameList, material, folder) {

    folder.add(material, 'visible').name('显示')

    folder.addColor({ color: material.color.getHex() }, 'color').name('颜色').onChange(v => material.color.setHex(v))

    folder.add(material, 'wireframe').name('线框模式')

    folder.add(material, 'transparent').name('透明')

    folder.add(material, 'opacity', 0, 1).name('透明度')

    folder.add(material, 'alphaTest', 0, 1).name('剔除阈值')

    folder.add(material, 'blending', [0, 1, 2, 3, 4, 5]).name('混合模式').onChange(v => {

        material.blending = Blending_Lib[v]

        material.needsUpdate = true

    })

    setMaterialMapPanel(CommonFrameList, material, folder.addFolder('贴图'))

}
