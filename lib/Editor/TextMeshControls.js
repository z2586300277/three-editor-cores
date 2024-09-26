import * as THREE from 'three'
import { createTextGeometry } from '../Api/ThreeApi'
import { getMaterial, materialList } from './Group/Mesh/Material/MaterialChunk'
import { getTextMeshStorage, setTextMeshStorage, setTextMeshPanel } from './TextMesh/TextMesh'

/* 文本控制 */
export const textMeshControls = {

    fontLink: 'https://z2586300277.github.io/three-editor/dist/files/font/cn1.json',

    text: '',

    materialType: '标准材质',

    textMeshCallPanel: null

}

/* 存储 */
export function getTextMeshListStorage(List) {

    return List.map(i => getTextMeshStorage(i))

}

/* 存储 */
export function setTextMeshListStorage(scene, CommonFrameList, storage) {

    if (!storage) return

    storage.forEach(i => setTextMeshStorage(scene, CommonFrameList, i).then(mesh => {

        textMeshControls.textMeshCallPanel?.(mesh)

    }))

}

/* 设置面板 */
export function setTextMeshControlsPanel(scene, transformControls, CommonFrameList, folder) {

    const folderList = folder.addFolder('列表')

    folder.add(textMeshControls, 'fontLink').name('字体链接')

    folder.add(textMeshControls, 'materialType', materialList).name('材质类型')

    folder.add(textMeshControls, 'text').name('文本内容')

    folder.add({

        fn: () => {

            if (!textMeshControls.text) return

            createTextGeometry(textMeshControls.fontLink, textMeshControls.text).then((geometry) => {

                const material = getMaterial(textMeshControls.materialType)

                const mesh = new THREE.Mesh(geometry, material)

                mesh.fontLink = textMeshControls.fontLink

                mesh.text = textMeshControls.text

                mesh.isTextMesh = true

                scene.add(mesh)

                transformControls.attach(mesh)

                setTextMeshPanel(scene, transformControls, CommonFrameList, mesh, folderList.addFolder(mesh.text + mesh.id))

            })
            
            folderList.open()

        }

    }, 'fn').name('添加文本物体')

    textMeshControls.textMeshCallPanel = mesh => setTextMeshPanel(scene, transformControls, CommonFrameList, mesh, folderList.addFolder(mesh.text + mesh.id))

}