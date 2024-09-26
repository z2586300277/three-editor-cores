/* group global panel */
export function setGroupGlobalPanel(group, folder) {

    folder.add(group.globalConfig, 'isSaveChildren').name('子物体更改存储')

    folder.add(group.globalConfig, 'isSaveMaterials').name('单材质更改存储')

    folder.add(group.globalConfig, 'useGlobalConfig').name('使用全局配置')

    setGlobalMeshPanel(group, folder.addFolder('全局阴影配置'))

    setGlobalMaterialPanel(group, folder.addFolder('全局材质配置'))

}

/* group Mesh panel */
function setGlobalMeshPanel(group, folder) {

    folder.add(group.globalConfig.mesh, 'castShadow').name('产生阴影').onChange(v => group.traverse(i => i.castShadow = v))

    folder.add(group.globalConfig.mesh, 'receiveShadow').name('接收阴影').onChange(v => group.traverse(i => i.receiveShadow = v))

}

/* group Material panel */
function setGlobalMaterialPanel(group, folder) {

    folder.add(group.globalConfig.material, 'envMap').name('环境贴图').onChange(v => {

        group.RootMaterials.forEach(m => {

            m.envMap = v ? group.parent.background : null

        })

    })

    folder.add(group.globalConfig.material, 'envMapIntensity').name('环境贴图强度').onChange(v => group.RootMaterials.forEach(m => m.envMapIntensity = v)).onFinishChange(v => group.RootMaterials.forEach(m => m.needsUpdate = true))

    folder.add(group.globalConfig.material, 'reflectivity', 0, 1).name('反射强度').onChange(v => group.RootMaterials.forEach(m => m.reflectivity = v)).onFinishChange(v => group.RootMaterials.forEach(m => m.needsUpdate = true))

    folder.add(group.globalConfig.material, 'isGlobalMap').name('全局贴图').onChange(v => {

        group.RootMaterials.forEach(i => {

            if (v) {

                i.map = i.recordMap

                i.needsUpdate = true

            }

            else {

                i.recordMap = i.map

                i.map = null

                i.needsUpdate = true

            }

        })

    }).onFinishChange(v => group.RootMaterials.forEach(m => m.needsUpdate = true))

}

/*  group storage */
export function setGlobalStorage(group, storage) {

    group.globalConfig = storage

    if (!storage.useGlobalConfig) return

    const { mesh, material } = storage

    setGlobalMeshStorage(group, mesh)

    setGlobalMaterialStorage(group, material)

}

/* group mesh storage */
function setGlobalMeshStorage(group, storage) {

    group.traverse(i => {

        i.castShadow = storage.castShadow

        i.receiveShadow = storage.receiveShadow

    })

}

/* group material storage */
function setGlobalMaterialStorage(group, storage) {

    group.RootMaterials.forEach(m => {

        m.envMapIntensity = storage.envMapIntensity

        m.reflectivity = storage.reflectivity

        storage.envMap && (m.envMap = group.parent.EnvBackground)

        if (storage.isGlobalMap === false) {

            m.recordMap = m.map

            m.map = null

        }

        m.needsUpdate = true

    })

    storage.envMap && group.parent.MeshEnvMapChangeUseList.push(() => group.RootMaterials.forEach(i => i.envMap = group.parent.EnvBackground))

}