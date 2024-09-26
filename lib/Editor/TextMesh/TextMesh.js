import * as THREE from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { createTextGeometry } from '../../Api/ThreeApi.js';
import { getMeshStorage, setMeshStorage, setMeshPanel } from '../Group/Mesh.js'
import { getMaterial } from '../Group/Mesh/Material/MaterialChunk'
import { getMaterialStorage, setMaterialPanel, setMaterialStorage } from '../Group/Mesh/Material.js'

/* 获取存储 */
export function getTextMeshStorage(mesh) {

    const { material, geometry } = mesh

    const { parameters } = geometry

    const { options } = parameters

    return {

        ...getMeshStorage(mesh),

        fontLink: mesh.fontLink,

        text: mesh.text,

        geometry: {

            geometryType: 'TextGeometry',

            parameters: {

                size: options.size,

                depth: options.depth,

                height: options.height,

                curveSegments: options.curveSegments,

                bevelEnabled: options.bevelEnabled,

                bevelThickness: options.bevelThickness,

                bevelSize: options.bevelSize,

                bevelSegments: options.bevelSegments

            }

        },

        material: getMaterialStorage(material)

    }

}

/* 设置存储 */
export async function setTextMeshStorage(scene, CommonFrameList, storage) {

    if (!storage) return

    const { geometry, material } = storage

    const { parameters } = geometry

    const g = await createTextGeometry(storage.fontLink, storage.text, parameters)

    const m = getMaterial(material.materialType)

    const mesh = new THREE.Mesh(g, m)

    mesh.fontLink = storage.fontLink

    mesh.text = storage.text

    mesh.isTextMesh = true

    scene.add(mesh)

    setMaterialStorage(scene, CommonFrameList, mesh.material, material)

    setMeshStorage(mesh, storage)

    return mesh

}

/* 设置文本mesh面板 */
export function setTextMeshPanel(scene, transformControls, CommonFrameList, mesh, folder) {

    setMeshPanel(mesh, folder.addFolder('基础配置'))

    setTextGeometryPanel(mesh, folder.addFolder('几何体'))

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

/* 设置textGeometry */
function setTextGeometryPanel(mesh, folder) {

    const { geometry } = mesh

    const { parameters } = geometry

    const { options } = parameters

    let timer = null

    function onChange() {

        if (timer) clearTimeout(timer)

        timer = setTimeout(() => {

            mesh.geometry.dispose()

            mesh.geometry = new TextGeometry(mesh.text, options)

            timer = null

        }, 200)

    }

    folder.add(mesh, 'text').onChange(onChange).name('文本')

    folder.add(options, 'size').onChange(onChange).name('大小')

    folder.add(options, 'depth').onChange(onChange).name('深度')

    folder.add(options, 'height').onChange(onChange).name('高度')

    folder.add(options, 'curveSegments').onChange(onChange).name('曲线分段').step(1).min(1)

    folder.add(options, 'bevelEnabled').onChange(onChange).name('斜角')

    folder.add(options, 'bevelThickness').onChange(onChange).name('斜角厚度')

    folder.add(options, 'bevelSize').onChange(onChange).name('斜角大小')

    folder.add(options, 'bevelSegments').onChange(onChange).name('斜角分段').step(1).min(0)

}