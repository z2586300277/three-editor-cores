import { designMeshTypeList } from './DesignMesh/DesignMesh'

export const designMeshControls = {

    type: '镜面'

}

export function setDesignMeshControlsPanel(scene, renderer, transformControls, DOM, CommonFrameList, folder) {

    const folderList = folder.addFolder('列表')

    folder.add(designMeshControls, 'type', designMeshTypeList.map(i => i.name)).name('类型')

    folder.add({

        fn: () => {

            const _design_ = designMeshTypeList.find(i => designMeshControls.type === i.name)

            const mesh = _design_.createFunc(null, { DOM, renderer })

            mesh.designType = designMeshControls.type

            scene.add(mesh)

            _design_.setPanel(mesh, folderList.addFolder(mesh.id + (mesh.name || '')))

        }

    }, 'fn').name('添加')

}