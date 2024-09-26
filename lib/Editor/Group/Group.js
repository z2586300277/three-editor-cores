import { getMaterials, createGsap, getBestViewTarget } from '../../Api/ThreeApi'
import { getMeshStorage, setMeshStorage, setMeshPanel } from './Mesh'
import { getMiniMaterialStorage, setMiniMaterialStorage } from './Mesh/MiniMaterial'
import { setGlobalStorage, setGroupGlobalPanel } from './GroupGlobal'
import { setGroupAnimationStorage, setGroupAnimationPanel } from '../Model/Animation'

/* 处理 group */
export function resolveGroup(group) {

    // 全局控制
    group.globalConfig = {

        useGlobalConfig: false,

        isSaveChildren: true,

        isSaveMaterials: true,

        mesh: {

            castShadow: false,

            receiveShadow: false,

        },

        material: {

            envMap: false,

            envMapIntensity: 1,

            reflectivity: 0.98,

            isGlobalMap: true

        },

        geometry: {

        }

    }

    // 材质
    group.RootMaterials = getMaterials(group)

    // 动画
    if (group.animations?.length > 0) {

        group.animationPlayParams = {

            initPlay: false,

            speed: 0.5,

            actionIndexs: new Array(group.animations.length).fill(false),

            startTime: 0,

            loop: false,

            frameCallback: () => { }

        }

    }

    return group

}

/* 获取存储 */
export function getGroupStorage(group) {

    const { animationPlayParams, children, RootMaterials, rootInfo } = group

    return {

        group: {

            ...getMeshStorage(group),

            globalConfig: group.globalConfig,

            animationPlayParams,

            RootMaterials: group.globalConfig.isSaveMaterials ? RootMaterials.map(m => getMiniMaterialStorage(m)) : undefined,

            children: group.globalConfig.isSaveChildren ? getMeshTreeStorage(children) : undefined,

        },

        rootInfo

    }

}

/* 设置存储 */
export function setGroupStorage(MixerList, group, storage) {

    if (!storage) return

    // 组项
    setMeshStorage(group, storage)

    // 全局配置项
    setGlobalStorage(group, storage.globalConfig)

    // 子项 Mesh
    group.globalConfig.isSaveChildren && setMeshTreeStorage(group.children, storage.children)

    // 子项 材质
    group.globalConfig.isSaveMaterials && group.RootMaterials.forEach((i, index) => setMiniMaterialStorage(i, storage.RootMaterials[index]))

    // 动画项
    setGroupAnimationStorage(MixerList, group, storage.animationPlayParams)

}

/* 控制面板 */
export function setGroupPanel(controls, transformControls, Composer, MixerList, group, folder) {

    setMeshPanel(group, folder.addFolder('物体控制'))

    setGroupGlobalPanel(group, folder.addFolder('全局和子项控制'))

    setGroupAnimationPanel(MixerList, group, folder.addFolder('动画配置'))

    folder.add({ fn: () => transformControls.attach(group) }, 'fn').name('选中')

    folder.add({

        focus: () => {

            const { position, target } = getBestViewTarget(group)

            createGsap(controls.object.position, position)

            createGsap(controls.target, target)

            transformControls.attach(group)

            Composer.effectPass.outlinePass.selectedObjects = [group]

        }

    }, 'focus').name('定位物体')

    folder.add({

        delete: () => {

            transformControls.detach()

            group.parent.remove(group)

            folder.parent.removeFolder(folder)

        }

    }, 'delete').name('删除')

}

/* 子项 存储 */
export function getMeshTreeStorage(List) {

    return List.map(i => {

        return {

            ...getMeshStorage(i),

            children: getMeshTreeStorage(i.children)

        }

    })

}

/* setMeshTreeStorage */
export function setMeshTreeStorage(List, storage) {

    List.forEach((i, index) => {

        setMeshStorage(i, storage[index])

        i.children && setMeshTreeStorage(i.children, storage[index].children)

    })

}