/* 获取存储 */
export function getMiniMaterialStorage(material) {

    const { visible, color, opacity, transparent, wireframe, metalness, roughness } = material

    return { visible, color, opacity, transparent, wireframe, metalness, roughness }

}

/* 设置 存储 */
export function setMiniMaterialStorage(material, storage) {

    if (!storage) return

    const { visible, color, opacity, transparent, wireframe, metalness, roughness } = storage

    material.visible = visible

    material.wireframe = wireframe

    material.transparent = transparent

    material.opacity = opacity

    material.color.set(color)

    material.metalness = metalness

    material.roughness = roughness

}

/* 面板 */
export function setMiniMaterialPanel(material, folder) {

    if (material.isShaderMaterial) return

    folder.add(material, 'name').name('名称')

    folder.add(material, 'visible').name('显示')

    folder.add(material, 'wireframe').name('线框')

    folder.add(material, 'transparent').name('透明')

    folder.add(material, 'opacity', 0, 1).name('透明度')

    folder.addColor({ color: material.color.getHex() }, 'color').name('颜色').onChange(v => material.color.setHex(v))

    if (material.metalness != undefined) folder.add(material, 'metalness', 0, 1).name('金属度')

    if (material.roughness != undefined) folder.add(material, 'roughness', 0, 1).name('粗糙度')

}

/* 多材质 设置面板 */
export function setMiniRootMaterialsPanel(RootMaterials, folder) {

    folder.add({ transparent: false }, 'transparent').name('整体透明').onChange(v => RootMaterials.forEach(i => i.transparent = v))

    folder.add({ opacity: 1 }, 'opacity').min(0).max(1).name('整体透明度').onChange(v => RootMaterials.forEach(i => i.opacity = v))

    folder.add({ wireframe: false }, 'wireframe').name('整体线框').onChange(v => RootMaterials.forEach(i => i.wireframe = v))

    folder.addColor({ color: 0xffffff }, 'color').name('整体颜色').onChange(v => RootMaterials.forEach(i => i.color.set(v)))

    folder.add({ metalness: 0 }, 'metalness').min(0).max(1).name('整体金属度').onChange(v => RootMaterials.forEach(i => i.metalness != undefined && (i.metalness = v)))

    folder.add({ roughness: 0 }, 'roughness').min(0).max(1).name('整体粗糙度').onChange(v => RootMaterials.forEach(i => i.roughness != undefined && (i.roughness = v)))

    folder.add({ fn: () => RootMaterials.forEach(i => i.needsUpdate = true) }, 'fn').name('未变化手动更新')

}