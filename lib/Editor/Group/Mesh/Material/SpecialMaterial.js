/* 获取特殊材质存储数据 */
export function getSpecialMaterialStorage(material) {

    switch (material.type) {

        case 'MeshBasicMaterial':

            return {

                envMap: !!material.envMap,

                reflectivity: material.reflectivity

            }

        case 'MeshStandardMaterial':

            return {

                emissive: material.emissive.getHex(),

                emissiveIntensity: material.emissiveIntensity,

                metalness: material.metalness,

                roughness: material.roughness,

                envMap: !!material.envMap,

                envMapIntensity: material.envMapIntensity

            }

        case 'MeshLambertMaterial':

            return {

                emissive: material.emissive.getHex(),

                emissiveIntensity: material.emissiveIntensity,

                envMap: !!material.envMap,

                reflectivity: material.reflectivity

            }

        case 'MeshPhongMaterial':

            return {

                shininess: material.shininess,

                specular: material.specular.getHex(),

                emissive: material.emissive.getHex(),

                emissiveIntensity: material.emissiveIntensity,

                envMap: !!material.envMap,

                reflectivity: material.reflectivity

            }

        case 'MeshToonMaterial':

            return {

                emissive: material.emissive.getHex(),

                emissiveIntensity: material.emissiveIntensity

            }

        case 'MeshPhysicalMaterial':

            return {

                metalness: material.metalness,

                roughness: material.roughness,

                clearcoat: material.clearcoat,

                clearcoatRoughness: material.clearcoatRoughness,

                sheen: material.sheen,

                sheenRoughness: material.sheenRoughness,

                sheenColor: material.sheenColor.getHex(),

                specularColor: material.specularColor.getHex(),

                specularIntensity: material.specularIntensity,

                transmission: material.transmission,

                emissive: material.emissive.getHex(),

                emissiveIntensity: material.emissiveIntensity,

                envMap: !!material.envMap,

                envMapIntensity: material.envMapIntensity,

                reflectivity: material.reflectivity

            }

    }

}

/* 设置材质 */
export function setSpecialMaterialStorage(scene, material, storage) {

    switch (material.type) {

        case 'MeshBasicMaterial':

            if (storage.envMap) {

                material.envMap = scene.EnvBackground

                scene.MeshEnvMapChangeUseList.push(() => material.envMap = scene.EnvBackground)

            }

            material.reflectivity = storage.reflectivity

            break

        case 'MeshStandardMaterial':

            material.emissive.setHex(storage.emissive)

            material.emissiveIntensity = storage.emissiveIntensity

            if (storage.envMap) {

                material.envMap = scene.EnvBackground

                scene.MeshEnvMapChangeUseList.push(() => material.envMap = scene.EnvBackground)

            }

            material.envMapIntensity = storage.envMapIntensity

            material.metalness = storage.metalness

            material.roughness = storage.roughness

            break

        case 'MeshLambertMaterial':

            material.emissive.setHex(storage.emissive)

            material.emissiveIntensity = storage.emissiveIntensity

            if (storage.envMap) {

                material.envMap = scene.EnvBackground

                scene.MeshEnvMapChangeUseList.push(() => material.envMap = scene.EnvBackground)

            }

            material.reflectivity = storage.reflectivity

            break

        case 'MeshPhongMaterial':

            material.shininess = storage.shininess

            material.specular.setHex(storage.specular)

            material.emissive.setHex(storage.emissive)

            material.emissiveIntensity = storage.emissiveIntensity

            if (storage.envMap) {

                material.envMap = scene.EnvBackground

                scene.MeshEnvMapChangeUseList.push(() => material.envMap = scene.EnvBackground)

            }

            material.reflectivity = storage.reflectivity

            break

        case 'MeshToonMaterial':

            material.emissive.setHex(storage.emissive)

            material.emissiveIntensity = storage.emissiveIntensity

            break

        case 'MeshPhysicalMaterial':

            material.metalness = storage.metalness

            material.roughness = storage.roughness

            material.clearcoat = storage.clearcoat

            material.clearcoatRoughness = storage.clearcoatRoughness

            material.sheen = storage.sheen

            material.sheenRoughness = storage.sheenRoughness

            material.sheenColor.setHex(storage.sheenColor)

            material.specularColor.setHex(storage.specularColor)

            material.specularIntensity = storage.specularIntensity

            material.transmission = storage.transmission

            material.emissive.setHex(storage.emissive)

            material.emissiveIntensity = storage.emissiveIntensity

            if (storage.envMap) {

                material.envMap = scene.EnvBackground

                scene.MeshEnvMapChangeUseList.push(() => material.envMap = scene.EnvBackground)

            }

            material.envMapIntensity = storage.envMapIntensity

            material.reflectivity = storage.reflectivity

            break

    }

}

/* 设置特殊材质面版 */
export function setSpecialMaterialPanel(scene, material, folder) {

    switch (material.type) {

        case 'MeshBasicMaterial':

            folder.add({ isEnvMap: material.envMap ? true : false }, 'isEnvMap').name('环境贴图').onChange(v => material.envMap = v ? scene.EnvBackground : null)

            folder.add(material, 'reflectivity', 0, 1).name('反射率')

            break

        case 'MeshStandardMaterial':

            folder.addColor({ color: material.emissive.getHex() }, 'color').name('自发光颜色').onChange(v => material.emissive.setHex(v))

            folder.add(material, 'emissiveIntensity', 0).name('自发光强度')

            folder.add(material, 'metalness', 0, 1).name('金属度')

            folder.add(material, 'roughness', 0, 1).name('粗糙度')

            folder.add({ isEnvMap: material.envMap ? true : false }, 'isEnvMap').name('环境贴图').onChange(v => material.envMap = v ? scene.EnvBackground : null)

            folder.add(material, 'envMapIntensity', 0).name('环境贴图强度')

            break

        case 'MeshLambertMaterial':

            folder.addColor({ color: material.emissive.getHex() }, 'color').name('自发光颜色').onChange(v => material.emissive.setHex(v))

            folder.add(material, 'emissiveIntensity', 0).name('自发光强度')

            folder.add({ isEnvMap: material.envMap ? true : false }, 'isEnvMap').name('环境贴图').onChange(v => material.envMap = v ? scene.EnvBackground : null)

            folder.add(material, 'reflectivity', 0, 1).name('反射率')

            break

        case 'MeshPhongMaterial':

            folder.add(material, 'shininess', 0, 100).name('高光亮度').onChange(v => material.needsUpdate = true)

            folder.addColor({ color: material.specular.getHex() }, 'color').name('高光颜色').onChange(v => material.specular.setHex(v))

            folder.addColor({ color: material.emissive.getHex() }, 'color').name('自发光颜色').onChange(v => material.emissive.setHex(v))

            folder.add(material, 'emissiveIntensity', 0).name('自发光强度')

            folder.add({ isEnvMap: material.envMap ? true : false }, 'isEnvMap').name('环境贴图').onChange(v => material.envMap = v ? scene.EnvBackground : null)

            folder.add(material, 'reflectivity', 0, 1).name('反射率')

            break

        case 'MeshToonMaterial':

            folder.addColor({ color: material.emissive.getHex() }, 'color').name('自发光颜色').onChange(v => material.emissive.setHex(v))

            folder.add(material, 'emissiveIntensity', 0).name('自发光强度')

            break

        case 'MeshPhysicalMaterial':

            folder.add(material, 'metalness', 0, 1).name('金属度')

            folder.add(material, 'roughness', 0, 1).name('粗糙度')

            folder.add(material, 'clearcoat', 0, 1).name('清漆层')

            folder.add(material, 'clearcoatRoughness', 0, 1).name('清漆层粗糙度')

            folder.add(material, 'sheen', 0, 1).name('光泽度')

            folder.add(material, 'sheenRoughness', 0, 1).name('光泽粗糙度')

            folder.addColor({ color: material.sheenColor.getHex() }, 'color').name('光泽颜色').onChange(v => material.sheenColor.setHex(v))

            folder.addColor({ color: material.specularColor.getHex() }, 'color').name('高光颜色').onChange(v => material.specularColor.setHex(v))

            folder.add(material, 'specularIntensity', 0, 1).name('高光强度')

            folder.add(material, 'transmission', 0, 1).name('透射率')

            folder.addColor({ color: material.emissive.getHex() }, 'color').name('自发光颜色').onChange(v => material.emissive.setHex(v))

            folder.add(material, 'emissiveIntensity', 0).name('自发光强度')

            folder.add({ isEnvMap: material.envMap ? true : false }, 'isEnvMap').name('环境贴图').onChange(v => material.envMap = v ? scene.EnvBackground : null)

            folder.add(material, 'envMapIntensity', 0).name('环境贴图强度')

            folder.add(material, 'reflectivity', 0, 1).name('反射率')

            break

    }

}