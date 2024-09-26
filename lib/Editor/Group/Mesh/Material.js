import { getCommonMaterialStorage, setCommonMaterialStorage, setCommonMaterialPanel } from './Material/CommonMaterial.js'
import { getSpecialMaterialStorage, setSpecialMaterialStorage, setSpecialMaterialPanel } from './Material/SpecialMaterial.js'

export function getMaterialStorage(material) {

    return {

        materialType: material.materialType,

        ...getCommonMaterialStorage(material),

        ...getSpecialMaterialStorage(material),

    }

}

export function setMaterialStorage(scene, CommonFrameList, material, storage) {

    if (!storage) return

    setCommonMaterialStorage(CommonFrameList, material, storage)

    setSpecialMaterialStorage(scene, material, storage)

}


/* 面板 */
export function setMaterialPanel(scene, CommonFrameList, material, folder) {

    setCommonMaterialPanel(CommonFrameList, material, folder)

    setSpecialMaterialPanel(scene, material, folder.addFolder(material.materialType + '配置'))

}