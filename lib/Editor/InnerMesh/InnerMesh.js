import * as THREE from 'three'
import { getMeshStorage, setMeshStorage, setMeshPanel } from '../Group/Mesh.js'
import { getGeometry } from '../Group/Mesh/Geometry/GeometryChunk.js'
import { setGeometryPanel } from '../Group/Mesh/Geometry'
import { getMaterialStorage, setMaterialStorage, setMaterialPanel } from '../Group/Mesh/Material.js'
import { getMaterial } from '../Group/Mesh/Material/MaterialChunk'

/* 获取存储 */
export function getInnerMeshStorage(i) {

    const { material, geometry } = i

    const { geometryType, parameters } = geometry

    return {

        ...getMeshStorage(i),

        geometry: {

            geometryType,

            parameters

        },

        material: getMaterialStorage(material)

    }

}

/* 设置 存储 */
export function setInnerMeshStorage(scene, CommonFrameList, storage) {

    if (!storage) return

    const { geometry, material } = storage

    const { geometryType, parameters } = geometry

    const g = getGeometry(geometryType, parameters)

    const m = getMaterial(material.materialType)

    const mesh = getMesh(g, m)

    scene.add(mesh)

    setMaterialStorage(scene, CommonFrameList, mesh.material, material)

    setMeshStorage(mesh, storage)

    return mesh

}

/* 设置 面板 */
export function setInnerMeshPanel(scene, transformControls, CommonFrameList, mesh, folder) {

    setMeshPanel(mesh, folder.addFolder('基础配置'))

    setGeometryPanel(mesh, folder.addFolder('几何体'))

    setMaterialPanel(scene, CommonFrameList, mesh.material, folder.addFolder('材质'))

    folder.add({

        fn: () => {

            transformControls.detach()

            scene.remove(mesh)

            const index = CommonFrameList.findIndex(j => j.uuid == mesh.uuid)

            if (index > -1) CommonFrameList.splice(index, 1)

            folder.parent.removeFolder(folder)

        }

    }, 'fn').name('删除')

}

export function getMesh(geometry, material) {

    const mesh = new THREE.Mesh(geometry, material)

    mesh.isInnerMesh = true

    return mesh

}

