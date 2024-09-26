import { getBlendShaderProgramsStorage, setBlendShaderProgramsStorage } from './Shader/Shader'

/* get mesh storage */
export function getMeshStorage(mesh) {

    const { name, visible, castShadow, receiveShadow, position, rotation, scale, renderOrder, transformAnimationList, isSsr } = mesh

    return {

        name,

        visible,

        renderOrder,

        castShadow,

        receiveShadow,

        position: {

            x: position.x,

            y: position.y,

            z: position.z

        },

        rotation: {

            x: rotation.x,

            y: rotation.y,

            z: rotation.z

        },

        scale: {

            x: scale.x,

            y: scale.y,

            z: scale.z

        },

        blendShaderPrograms: getBlendShaderProgramsStorage(mesh),

        transformAnimationList,

        isSsr

    }

}

/* get mesh storage */
export function setMeshStorage(mesh, storage) {

    if (!storage) return

    const { name, visible, castShadow, receiveShadow, position, rotation, scale, renderOrder, blendShaderPrograms, transformAnimationList, isSsr } = storage

    mesh.name = name

    mesh.visible = visible

    mesh.renderOrder = renderOrder

    mesh.castShadow = castShadow

    mesh.receiveShadow = receiveShadow

    mesh.position.set(position.x, position.y, position.z)

    mesh.rotation.set(rotation.x, rotation.y, rotation.z)

    mesh.scale.set(scale.x, scale.y, scale.z)

    setBlendShaderProgramsStorage(mesh, blendShaderPrograms)

    mesh.transformAnimationList = transformAnimationList

    if (isSsr) {

        mesh.isSsr = isSsr

        let object = mesh

        do object = object.parent

        while (object.type !== 'Scene')

        object.SsrMeshList.push(mesh)

    }

}

/* mesh panel */
export function setMeshPanel(mesh, folder) {

    folder.add(mesh, 'name').name('模型名字')

    folder.add(mesh, 'visible').name('显示');

    if (!Reflect.has(mesh, 'isSsr')) mesh.isSsr = false

    folder.add(mesh, 'isSsr').name('SSR').onChange(v => {

        let object = mesh

        do object = object.parent

        while (object.type !== 'Scene')

        if (v) object.SsrMeshList.push(mesh)

        else {

            const index = object.SsrMeshList.indexOf(mesh)

            if (index !== -1) object.SsrMeshList.splice(index, 1)

        }

    })

    folder.add(mesh, 'renderOrder').name('渲染顺序').step(1);

    folder.add(mesh, 'castShadow').name('投影');

    folder.add(mesh, 'receiveShadow').name('接收阴影');

    ['x', 'y', 'z'].forEach(v => folder.add(mesh.position, v).name('位置' + v));

    ['x', 'y', 'z'].forEach(v => folder.add(mesh.rotation, v).name('旋转' + v));

    ['x', 'y', 'z'].forEach(v => folder.add(mesh.scale, v).name('缩放' + v));

}