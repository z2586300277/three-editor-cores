import * as THREE from 'three'

/* 处理 geo Group */
export function setGeoGroupGlobalConfig(group) {

    if (group.globalConfig) return

    group.globalConfig = {

        useGlobalConfig: false,

        isSaveChildren: true,

        isSaveMaterials: true,

        mesh: {

            castShadow: false,

            receiveShadow: false,

        },

        material: {

            color: 0xffffff,

            wireframe: false,

            transparent: true,

            opacity: 1,

            metalness: 0,

            roughness: 0,

            emissive: 0x000000,

            emissiveIntensity: 1,

            // 物理
            clearcoat: 0,

            clearcoatRoughness: 0,

            sheen: 0,

            sheenRoughness: 0,

            sheenColor: 0x000000,

            transmission: 0,

            envMap: false,

            envMapIntensity: 1,

            reflectivity: 0.98,

            mapUrl: '',

            textureAnimation: {

                isTextureAnimation: false,

                offset: { x: 0, y: 0.01 },

                rotation: 0,

            },

            map: {

                repeat: { x: 1, y: 1 },

                offset: { x: 0, y: 0 },

                center: { x: 0, y: 0 },

                rotation: 0,

            }

        },

        geometry: {

            geometryType: '形状路径挤压体',

            isEmpty: false,

            parameters: {

                depth: 16,

                bevelEnabled: false,

                bevelThickness: 0,

                bevelSize: 0,

                bevelOffset: 0,

            }

        },

        label: {

            show: false,

            type: '2D',

            color: '#fff',

            fontSize: 12,

            fontWeight: 400,

            px: 0,

            py: 0,

            pz: 0,

            rx: 0,

            ry: 0,

            rz: 0,

            ss: 1,

            sx: 1,

            sy: 1,

            sz: 1

        }

    }

    return group

}

/* 设置 geo group 存储 */
export function setGeoGroupGlobalStorage(scene, CommonFrameList, group) {

    const { globalConfig } = group

    if (!globalConfig.useGlobalConfig) return

    const { mesh, material } = globalConfig

    group.children.forEach(i => {

        i.castShadow = mesh.castShadow

        i.receiveShadow = mesh.receiveShadow

    })

    if (material.mapUrl) {

        const texture = new THREE.TextureLoader().load(material.mapUrl)

        texture.wrapS = THREE.RepeatWrapping

        texture.wrapT = THREE.RepeatWrapping

        texture.repeat.set(material.map.repeat.x, material.map.repeat.y)

        texture.offset.set(material.map.offset.x, material.map.offset.y)

        texture.center.set(material.map.center.x, material.map.center.y)

        texture.rotation = material.map.rotation

        group.texture = texture

        group.frameAnimationRender = function () {

            this.texture.offset.x += this.globalConfig.material.textureAnimation.offset.x

            this.texture.offset.y += this.globalConfig.material.textureAnimation.offset.y

            this.texture.rotation += this.globalConfig.material.textureAnimation.rotation

        }

        CommonFrameList.push(group)

    }

    group.RootMaterials.forEach(i => {

        i.color.set(material.color)

        i.wireframe = material.wireframe

        i.transparent = material.transparent

        i.opacity = material.opacity

        if (['标准材质', '物理材质'].includes(group.materialType)) {

            i.metalness = material.metalness

            i.roughness = material.roughness

        }

        if (group.materialType !== '基础材质') {

            i.emissive.set(material.emissive)

            i.emissiveIntensity = material.emissiveIntensity

        }

        if (group.materialType === '物理材质') {

            i.clearcoat = material.clearcoat

            i.clearcoatRoughness = material.clearcoatRoughness

            i.sheen = material.sheen

            i.sheenRoughness = material.sheenRoughness

            i.sheenColor.set(material.sheenColor)

            i.transmission = material.transmission

        }

        i.envMap = material.envMap ? scene.EnvBackground : null

        i.envMapIntensity = material.envMapIntensity

        i.reflectivity = material.reflectivity

        i.map = group.texture

        i.needsUpdate = true

    })

    const meshEnvChangeUse = () => group.RootMaterials.forEach(m => {

        m.envMap = group.parent.EnvBackground

        m.envMapIntensity = material.envMapIntensity

        m.reflectivity = material.reflectivity

    })

    group.parent.MeshEnvMapChangeUseList.push(meshEnvChangeUse)

}

/* 面板 */
export function setGeoGroupGlobalPanel(scene, CommonFrameList, group, folder) {

    const { globalConfig } = group

    folder.add(globalConfig, 'isSaveChildren').name('子物体更改存储')

    folder.add(globalConfig, 'isSaveMaterials').name('单材质更改存储')

    folder.add(globalConfig, 'useGlobalConfig').name('全局材质配置')

    const shadowFolder = folder.addFolder('阴影')

    shadowFolder.add(globalConfig.mesh, 'castShadow').name('产生阴影').onChange(() => group.children.forEach(i => i.castShadow = globalConfig.mesh.castShadow))

    shadowFolder.add(globalConfig.mesh, 'receiveShadow').name('接收阴影').onChange(() => group.children.forEach(i => i.receiveShadow = globalConfig.mesh.receiveShadow))

    setGlobalGeometryPanel(group, folder.addFolder('形状配置'))

    setGlobalMaterialsPanel(scene, CommonFrameList, group, folder.addFolder('材质配置'))

}

/* 形状 面板 */
function setGlobalGeometryPanel(group, folder) {

    const { globalConfig } = group

    let timer = null

    function onChange() {

        if (timer) clearTimeout(timer)

        timer = setTimeout(() => {

            group.children.forEach((i) => {

                i.geometry.dispose()

                if (globalConfig.geometry.isEmpty) {

                    i.geometry.parameters.shapes.holes = [i.geometry.parameters.shapes.path]

                    i.geometry.parameters.shapes.curves = []

                }

                else {

                    i.geometry.parameters.shapes.curves = [i.geometry.parameters.shapes.path]

                    i.geometry.parameters.shapes.holes = []

                }

                i.geometry = new THREE.ExtrudeGeometry(i.geometry.parameters.shapes, globalConfig.geometry.parameters)

                i.geometry.center()

            })

            timer = null

        }, 200)

    }

    folder.add(globalConfig.geometry, 'isEmpty').name('镂空').onChange(onChange)

    folder.add(globalConfig.geometry.parameters, 'depth').name('深度').onChange(onChange).min(0.001)

    folder.add(globalConfig.geometry.parameters, 'bevelEnabled').name('斜角').onChange(onChange)

    folder.add(globalConfig.geometry.parameters, 'bevelThickness').name('斜角厚度').onChange(onChange).min(0)

    folder.add(globalConfig.geometry.parameters, 'bevelSize').name('斜角大小').onChange(onChange).min(0)

    folder.add(globalConfig.geometry.parameters, 'bevelOffset').name('斜角偏移').onChange(onChange).min(0)

}

/* 设置整体材质配置文件夹 */
export function setGlobalMaterialsPanel(scene, CommonFrameList, group, folder) {

    const { globalConfig } = group

    const { material } = globalConfig

    folder.addColor(material, 'color').name('颜色').onChange(v => group.RootMaterials.forEach(i => i.color.set(v)))

    folder.add(material, 'wireframe').name('线框').onChange(v => group.RootMaterials.forEach(i => i.wireframe = v))

    folder.add(material, 'transparent').name('透明').onChange(v => group.RootMaterials.forEach(i => i.transparent = v))

    folder.add(material, 'opacity', 0, 1).name('透明度').onChange(v => group.RootMaterials.forEach(i => i.opacity = v))

    if (['标准材质', '物理材质'].includes(group.materialType)) {

        folder.add(material, 'metalness', 0, 1).name('金属感').onChange(v => group.RootMaterials.forEach(i => i.metalness = v))

        folder.add(material, 'roughness', 0, 1).name('粗糙感').onChange(v => group.RootMaterials.forEach(i => i.roughness = v))

    }

    if (group.materialType !== '基础材质') {

        folder.addColor(material, 'emissive').name('自发光').onChange(v => group.RootMaterials.forEach(i => i.emissive.set(v)))

        folder.add(material, 'emissiveIntensity', 0).name('自发光强度').onChange(v => group.RootMaterials.forEach(i => i.emissiveIntensity = v))

    }

    if (group.materialType !== '卡通材质') {

        folder.add(material, 'envMap').name('环境贴图').onChange(v => group.RootMaterials.forEach(i => v ? i.envMap = scene.EnvBackground : i.envMap = null))

        folder.add(material, 'envMapIntensity', 0).name('环境贴图强度').onChange(v => group.RootMaterials.forEach(i => i.envMapIntensity = v))

        folder.add(material, 'reflectivity', 0, 1).name('反射率').onChange(v => group.RootMaterials.forEach(i => i.reflectivity = v))

    }

    if (group.materialType === '物理材质') {

        folder.add(material, 'clearcoat', 0, 1).name('清漆层').onChange(v => group.RootMaterials.forEach(i => i.clearcoat = v))

        folder.add(material, 'clearcoatRoughness', 0, 1).name('清漆层粗糙度').onChange(v => group.RootMaterials.forEach(i => i.clearcoatRoughness = v))

        folder.add(material, 'sheen', 0, 1).name('光泽度').onChange(v => group.RootMaterials.forEach(i => i.sheen = v))

        folder.add(material, 'sheenRoughness', 0, 1).name('光泽粗糙度').onChange(v => group.RootMaterials.forEach(i => i.sheenRoughness = v))

        folder.addColor(material, 'sheenColor').name('光泽颜色').onChange(v => group.RootMaterials.forEach(i => i.sheenColor.set(v)))

        folder.add(material, 'transmission', 0, 1).name('透射率').onChange(v => group.RootMaterials.forEach(i => i.transmission = v))

    }

    folder.add({ fn: () => group.RootMaterials.forEach(i => i.needsUpdate = true) }, 'fn').name('手动更新材质')

    setGlobalTexturePanel(CommonFrameList, group, folder.addFolder('贴图'))

}

/* 设置整体贴图配置文件夹 */
function setGlobalTexturePanel(CommonFrameList, group, folder) {

    const { material } = group.globalConfig

    if (material.mapUrl) {

        setTexture()

        const { textureAnimation } = material

        if (textureAnimation.isTextureAnimation) setTextureAnimation(true)

    }

    folder.add(material, 'mapUrl').name('贴图路径')

    // 贴图属性
    function changeMapProperty(property) {

        group.RootMaterials.forEach(i => {

            i.map && (i.map[property] = material.map[property])

        })

    }

    // 设置贴图
    function setTexture() {

        const { mapUrl, map } = material

        if (!mapUrl) return

        const texture = new THREE.TextureLoader().load(mapUrl)

        texture.wrapS = THREE.RepeatWrapping

        texture.wrapT = THREE.RepeatWrapping

        texture.repeat.set(map.repeat.x, map.repeat.y)

        texture.offset.set(map.offset.x, map.offset.y)

        texture.center.set(map.center.x, map.center.y)

        texture.rotation = map.rotation

        group.texture = texture

        group.RootMaterials.forEach(i => {

            i.map = texture

            i.needsUpdate = true

        })

    }

    // 设置动画
    function setTextureAnimation(v) {

        if (v) {

            group.frameAnimationRender = function () {

                this.texture.offset.x += this.globalConfig.material.textureAnimation.offset.x

                this.texture.offset.y += this.globalConfig.material.textureAnimation.offset.y

                this.texture.rotation += this.globalConfig.material.textureAnimation.rotation

            }

            CommonFrameList.push(group)

        }

        else {

            delete group.texture.frameAnimationRender

            CommonFrameList.splice(CommonFrameList.findIndex(j => j.uuid == group.uuid), 1)

        }

    }

    folder.add(material.map.repeat, 'x').name('水平重复').onChange(v => changeMapProperty('repeat'))

    folder.add(material.map.repeat, 'y').name('垂直重复').onChange(v => changeMapProperty('repeat'))

    folder.add(material.map.offset, 'x').name('水平偏移').onChange(v => changeMapProperty('offset'))

    folder.add(material.map.offset, 'y').name('垂直偏移').onChange(v => changeMapProperty('offset'))

    folder.add(material.map, 'rotation', 0, Math.PI * 2).name('旋转').onChange(v => changeMapProperty('rotation'))

    folder.add(material.map.center, 'x').name('水平中心').onChange(v => changeMapProperty('center'))

    folder.add(material.map.center, 'y').name('垂直中心').onChange(v => changeMapProperty('center'))

    folder.add(material.textureAnimation, 'isTextureAnimation').name('贴图动画').onChange(v => setTextureAnimation(v))

    folder.add(material.textureAnimation.offset, 'x').name('水平偏移动画')

    folder.add(material.textureAnimation.offset, 'y').name('垂直偏移动画')

    folder.add(material.textureAnimation, 'rotation', 0, Math.PI * 2).name('旋转动画')

    folder.add({ fn: () => setTexture() }, 'fn').name('更新贴图')

}