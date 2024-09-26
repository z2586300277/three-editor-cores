import * as THREE from 'three'
import { Blending_Lib } from '../Group/Mesh/Material/CommonMaterial'
import { getMeshStorage, setMeshPanel, setMeshStorage } from "../Group/Mesh"
import { createParticleGeometry, createParticleMesh } from "./CreateParticle"
import { getUniformsStorage, setUniformsPanel, setUniformsStorage } from '../Group/Shader/Uniforms'

/* 获取存储 */
export function getParticleStorage(mesh) {

    const { material } = mesh

    const { uniforms, blending, depthTest } = material

    return {

        ...getMeshStorage(mesh),

        parameters: mesh.parameters,

        material: {

            uniforms: getUniformsStorage(uniforms),

            blending,

            depthTest

        }

    }

}

/* 设置 */
export function setParticleStorage(scene, DOM, CommonFrameList, storage) {

    if (!storage) return

    const mesh = createParticleMesh(scene, DOM, CommonFrameList, storage.parameters)

    setMeshStorage(mesh, storage)

    const { material } = storage

    mesh.material.blending = material.blending

    mesh.material.depthTest = material.depthTest

    setUniformsStorage(mesh.material.uniforms, material.uniforms)

    material.needsUpdate = true

    return mesh

}

/* 设置粒子面板 */
export function setParticlePanel(scene, transformControls, mesh, folder) {

    setMeshPanel(mesh, folder.addFolder('基础属性'))

    setParticleGeometryPanel(mesh, folder.addFolder('几何'))

    setParticleMaterialPanel(mesh.material, folder.addFolder('材质'))

    folder.add({ fn: () => transformControls.attach(mesh), }, 'fn').name('选中')

    folder.add({

        fn: () => {

            transformControls.detach()

            scene.remove(mesh)

            folder.parent.removeFolder(folder)

        },

    }, 'fn').name('删除')

}

/* 设置geometry panel */
export function setParticleGeometryPanel(mesh, folder) {

    let timer = null

    function onChange() {

        if (timer) return

        mesh.geometry.dispose()

        mesh.geometry = new THREE.BufferGeometry()

        timer = setTimeout(() => {

            mesh.geometry = createParticleGeometry(mesh.parameters)

            timer = null

        }, 200)

    }

    folder.add(mesh.parameters, 'particlesSum', 1).name('数量').onChange(onChange)

    folder.add(mesh.parameters, 'inner', 0).name('内半径').onChange(onChange)

    folder.add(mesh.parameters, 'outer', 500).name('外半径').onChange(onChange)

    folder.add(mesh.parameters, 'maxVelocity').name('最大速度').onChange(onChange)

    folder.add(mesh.parameters, 'sportType', ['全随机', '随机向下', '随机向上', '直线匀速向上', '直线匀速向下']).name('运动方式').onChange(onChange)

}

/* 材质 panel */
export function setParticleMaterialPanel(material, folder) {

    folder.add(material, 'depthTest').name('深度测试').onChange(() => material.needsUpdate = true)

    folder.add(material, 'blending', [0, 1, 2, 3, 4, 5]).name('混合模式').onChange(v => {

        material.blending = Blending_Lib[v]

        material.needsUpdate = true

    })

    setUniformsPanel(material.uniforms, folder.addFolder('着色器参数'))

}