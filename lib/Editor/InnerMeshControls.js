import { getInnerMeshStorage, setInnerMeshStorage, setInnerMeshPanel, getMesh } from './InnerMesh/InnerMesh.js'
import { geometryList, getGeometry } from './Group/Mesh/Geometry/GeometryChunk.js'
import { materialList, getMaterial } from './Group/Mesh/Material/MaterialChunk.js'

export const innerMeshControls = {

    geometryType: '立方体',

    materialType: '标准材质',

    meshList: null

}

export function getInnerMeshListStorage(meshList) {

    return meshList.map(i => getInnerMeshStorage(i))

}

export function setInnerMeshListStorage(scene, CommonFrameList, meshList) {

    innerMeshControls.meshList = meshList?.map(i => setInnerMeshStorage(scene, CommonFrameList, i))

}

/* 设置 面板 */
export function setInnerMeshControlsPanel(scene, transformControls, CommonFrameList, folder) {

    innerMeshControls.listFolder = folder.addFolder('已有列表')

    folder.add(innerMeshControls, 'geometryType', geometryList).name('几何体')

    folder.add(innerMeshControls, 'materialType', materialList).name('材质')

    folder.add({

        add: () => {

            const geometry = getGeometry(innerMeshControls.geometryType)

            const material = getMaterial(innerMeshControls.materialType)

            const mesh = getMesh(geometry, material)

            scene.add(mesh)

            transformControls.attach(mesh)

            setInnerMeshPanel(scene, transformControls, CommonFrameList, mesh, innerMeshControls.listFolder.addFolder(mesh.geometry.geometryType + ':' + mesh.name + mesh.id))

        }

    }, 'add').name('添加')

    innerMeshControls.meshList?.forEach(i => setInnerMeshPanel(scene, transformControls, CommonFrameList, i, innerMeshControls.listFolder.addFolder(i.geometry.geometryType + ':' + i.name + i.id)))

}