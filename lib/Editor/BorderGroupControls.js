import { createBorderGroup, getBorderGroupStorage, setBorderGroupStorage, setBorderGroupPanel } from "./BorderGroup/BorderGroup"
import { materialList } from "./Group/Mesh/Material/MaterialChunk"

export const borderGroupControls = {

    url: 'https://geo.datav.aliyun.com/areas_v3/bound/100000.json',

    materialType: '基础材质',

    borderGroupCallPanel: null,

    dlength: 0,

}

export function setBorderGroupControlsPanel(scene, transformControls, CommonFrameList, folder) {

    const folderList = folder.addFolder('列表')

    folder.add(borderGroupControls, 'url').name('边界物体数据源')

    folder.add(borderGroupControls, 'materialType', materialList).name('材质类型')

    folder.add(borderGroupControls, 'dlength', 0).name('低于点数舍弃')

    folder.add({

        fn: () => {

            createBorderGroup(borderGroupControls.url, borderGroupControls.materialType, borderGroupControls.dlength).then((group) => {

                scene.add(group)

                transformControls.attach(group)

                setBorderGroupPanel(scene, transformControls, CommonFrameList, group, folderList.addFolder(group.name + group.id))

            })

        }

    }, 'fn').name('添加边界物体')

    borderGroupControls.borderGroupCallPanel = group => setBorderGroupPanel(scene, transformControls, CommonFrameList, group, folderList.addFolder(group.name + group.id))

}

export function getBorderGroupListStorage(list) {

    return list.map(i => getBorderGroupStorage(i))

}

export function setBorderGroupListStorage(scene, CommonFrameList, storage) {

    if (!storage) return

    storage.forEach(i => setBorderGroupStorage(scene, CommonFrameList, i).then(group => {

        borderGroupControls.borderGroupCallPanel?.(group)

    }))

}