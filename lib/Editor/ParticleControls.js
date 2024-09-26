import { createParticleMesh } from './Particle/CreateParticle.js'
import { getParticleStorage, setParticleStorage, setParticlePanel } from './Particle/Particle.js'
import { Shader_Library_Particles } from '../Shader/ShaderApi'

/* 粒子控制 */
export const particleControls = {

    particlesSum: 100000,

    inner: 0,

    outer: 2000,

    maxVelocity: 50,

    mapUrl: 'https://z2586300277.github.io/three-editor/dist/files/channels/snow.png',

    sportType: '全随机',

    shaderCodeName: '水波纹',

    meshList: null

}

/* 设置粒子 */
export function setParticleListStorage(scene, DOM, CommonFrameList, List) {

    particleControls.meshList = List?.map(i => setParticleStorage(scene, DOM, CommonFrameList, i))

}

/* 获取粒子存储 */
export function getParticleListStorage(List) {

    return List.map(i => getParticleStorage(i))

}

/* 生成粒子面板 */
export function setParticleControlsPanel(scene, transformControls, DOM, CommonFrameList, folder) {

    const listFolder = folder.addFolder('粒子列表')

    const initFolder = folder.addFolder('初始化参数')

    initFolder.add(particleControls, 'particlesSum').name('数量')

    initFolder.add(particleControls, 'inner').name('内半径')

    initFolder.add(particleControls, 'outer').name('外半径')

    initFolder.add(particleControls, 'maxVelocity').name('最大速度')

    initFolder.add(particleControls, 'mapUrl').name('贴图路径')

    initFolder.add(particleControls, 'shaderCodeName', Object.keys(Shader_Library_Particles)).name('着色器')

    initFolder.add(particleControls, 'sportType', ['全随机', '随机向下', '随机向上', '直线匀速向上', '直线匀速向下']).name('运动方式')

    folder.add({

        fn: () => {

            const { particlesSum, inner, outer, maxVelocity, sportType, mapUrl, shaderCodeName } = particleControls

            const mesh = createParticleMesh(scene, DOM, CommonFrameList, {

                particlesSum,

                inner,

                outer,

                maxVelocity,

                sportType,

                mapUrl,

                shaderCodeName,

            })

            setParticlePanel(scene, transformControls, mesh, listFolder.addFolder(mesh.name + mesh.id))

            listFolder.open()

        }

    }, 'fn').name('增加一个粒子物体')

    particleControls.meshList?.forEach(i => setParticlePanel(scene, transformControls, i, listFolder.addFolder(i.name + i.id)))

}

