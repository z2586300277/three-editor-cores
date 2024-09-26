import * as THREE from 'three'
import { getMaterials, translationOriginForGroup } from "../../Api/ThreeApi"
import { getMeshStorage, setMeshPanel, setMeshStorage } from '../Group/Mesh'
import { getMeshTreeStorage, setMeshTreeStorage } from '../Group/Group'
import { resolveGeoJson } from './Geo'
import { setGeoGroupLabelPanel, setGeoGroupLabelStorage } from './Label'
import { setGeoGroupGlobalConfig, setGeoGroupGlobalStorage, setGeoGroupGlobalPanel } from './GeoGroupGlobal'
import { getMiniMaterialStorage, setMiniMaterialStorage } from '../Group/Mesh/MiniMaterial'

/* 获取 geo group 存储 */
export function getGeoGroupStorage(group) {

    const { children, RootMaterials } = group

    return {

        ...getMeshStorage(group),

        globalConfig: group.globalConfig,

        url: group.url,

        materialType: group.materialType,

        RootMaterials: group.globalConfig.isSaveMaterials ? RootMaterials.map(m => getMiniMaterialStorage(m)) : undefined,

        children: group.globalConfig.isSaveChildren ? getMeshTreeStorage(children) : undefined,

    }

}

/* 设置 geo group 存储 */
export async function setGeoGroupStorage(scene, CommonFrameList, storage) {

    if (!storage) return

    const group = new THREE.Group()

    group.url = storage.url

    group.materialType = storage.materialType

    group.globalConfig = storage.globalConfig

    await createGeoGroup(scene, group)

    setMeshStorage(group, storage)

    setGeoGroupGlobalStorage(scene, CommonFrameList, group)

    group.globalConfig.isSaveChildren && setMeshTreeStorage(group.children, storage.children)

    group.globalConfig.isSaveMaterials && group.RootMaterials.forEach((i, index) => setMiniMaterialStorage(i, storage.RootMaterials[index]))

    setGeoGroupLabelStorage(scene, group)

    return group

}

/* 初始化 geo group */
export function initGeoGroup(url, materialType) {

    const group = new THREE.Group()

    group.url = url

    group.materialType = materialType

    setGeoGroupGlobalConfig(group)

    return group

}

/* 生成geo 物体 */
export async function createGeoGroup(scene, group) {

    const res = await fetch(group.url).then(r => r.json())

    resolveGeoJson(res.features, group)

    translationOriginForGroup(group)

    group.RootMaterials = getMaterials(group)

    group.rotation.x = -Math.PI / 2

    group.isGeoGroup = true

    scene.add(group)

    return group

}

/* 设置geo group 面板 */
export function setGeoGroupPanel(scene, transformControls, CommonFrameList, group, folder) {

    setMeshPanel(group, folder.addFolder('基础配置'))

    setGeoGroupGlobalPanel(scene, CommonFrameList, group, folder.addFolder('子项和全局配置'))

    setGeoGroupLabelPanel(scene, group, folder.addFolder('标签配置'))

    folder.add({

        fn: () => {

            folder.parent.removeFolder(folder)

            transformControls.detach()

            scene.remove(group)

            group.disposeRoot?.()

        }

    }, 'fn').name('删除地图')

}

