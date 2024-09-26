import * as THREE from 'three'
import { getMeshTreeStorage, setMeshTreeStorage } from '../Group/Group'
import { getMaterial } from "../Group/Mesh/Material/MaterialChunk"
import { setMiniMaterialStorage, getMiniMaterialStorage } from '../Group/Mesh/MiniMaterial'
import { getMeshStorage, setMeshPanel, setMeshStorage } from '../Group/Mesh'
import { coordToVector3, translationOriginForMesh, translationOriginForGroup, getMaterials } from '../../Api/ThreeApi'
import { setGeoGroupGlobalStorage, setGlobalMaterialsPanel } from '../ChartsMap/GeoGroupGlobal'

/* 获取 border group 存储 */
export function getBorderGroupStorage(group) {

    const { children, RootMaterials } = group

    return {

        ...getMeshStorage(group),

        globalConfig: group.globalConfig,

        url: group.url,

        dlength: group.dlength,

        materialType: group.materialType,

        RootMaterials: group.globalConfig.isSaveMaterials ? RootMaterials.map(m => getMiniMaterialStorage(m)) : undefined,

        children: group.globalConfig.isSaveChildren ? getMeshTreeStorage(children) : undefined,

    }

}

/* 设置 border group 存储 */
export async function setBorderGroupStorage(scene, CommonFrameList, storage) {

    if (!storage) return

    const group = await createBorderGroup(storage.url, storage.materialType, storage.dlength)

    group.globalConfig = storage.globalConfig

    const { geometry } = group.globalConfig

    group.children.forEach((i) => {

        i.geometry.dispose()

        i.geometry = new THREE.TubeGeometry(i.curve, (i.curve.points.length - 1) * geometry.tubularSegmentsMultiple, geometry.radius, geometry.radialSegments, geometry.closed)

        i.geometry.center()

    })

    scene.add(group)

    setMeshStorage(group, storage)

    setGeoGroupGlobalStorage(scene, CommonFrameList, group)

    group.globalConfig.isSaveChildren && setMeshTreeStorage(group.children, storage.children)

    group.globalConfig.isSaveMaterials && group.RootMaterials.forEach((i, index) => setMiniMaterialStorage(i, storage.RootMaterials[index]))

    return group

}

/* 边框 面板 */
export function setBorderGroupPanel(scene, transformControls, CommonFrameList, group, folder) {

    setMeshPanel(group, folder.addFolder('基础配置'))

    const { globalConfig } = group

    folder.add(globalConfig, 'isSaveChildren').name('子物体更改存储')

    folder.add(globalConfig, 'isSaveMaterials').name('单材质更改存储')

    folder.add(globalConfig, 'useGlobalConfig').name('全局材质配置')

    const shadowFolder = folder.addFolder('阴影')

    shadowFolder.add(globalConfig.mesh, 'castShadow').name('产生阴影').onChange(() => group.children.forEach(i => i.castShadow = globalConfig.mesh.castShadow))

    shadowFolder.add(globalConfig.mesh, 'receiveShadow').name('接收阴影').onChange(() => group.children.forEach(i => i.receiveShadow = globalConfig.mesh.receiveShadow))

    setBorderGeometryPanel(group, folder.addFolder('几何体'))

    setGlobalMaterialsPanel(scene, CommonFrameList, group, folder.addFolder('材质'))

    folder.add({

        fn: () => {

            folder.parent.removeFolder(folder)

            transformControls.detach()

            scene.remove(group)

            group.disposeRoot?.()

        }

    }, 'fn').name('删除边界')


}

/* 创建 边框 物体 */
export function createBorderGroup(url, materialType, dlength = 0) {

    const group = new THREE.Group()

    group.materialType = materialType

    group.url = url

    group.dlength = dlength

    setBorderGroupGlobal(group)

    return fetch(url).then(r => r.json()).then(res => {

        const { features } = res

        features.forEach((i) => {

            if (i.geometry.type === 'MultiPolygon') i.geometry.coordinates.forEach((j) => j.forEach((z) => createShapeWithCoord(group, z)))

            else if (i.geometry.type === 'Polygon') i.geometry.coordinates.forEach((j) => createShapeWithCoord(group, j))

            else if (i.geometry.type === 'LineString') i.geometry.coordinates.length > 1 && createShapeWithCoord(group, i.geometry.coordinates)

        })

        translationOriginForGroup(group)

        group.RootMaterials = getMaterials(group)

        group.rotation.x = -Math.PI / 2

        group.isBorderGroup = true

        return group

    })

}

/* 通过坐标创建形状 */
function createShapeWithCoord(group, coordinates) {

    if (coordinates.length < group.dlength) return

    const curvePoints = coordinates.map((k) => coordToVector3(k))

    const curve = new THREE.CatmullRomCurve3(curvePoints)

    const geometry = new THREE.TubeGeometry(curve, curvePoints.length - 1, 2, 4, false)

    const material = getMaterial(group.materialType, { color: 0xffffff * Math.random(), transparent: true, alphaHash: true })

    const mesh = new THREE.Mesh(geometry, material)

    mesh.curve = curve

    translationOriginForMesh(mesh)

    group.attach(mesh)

}

/* 设置全局 字段 */
function setBorderGroupGlobal(group) {

    group.globalConfig = {

        useGlobalConfig: false,

        isSaveMaterials: true,

        isSaveChildren: true,

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

            radialSegments: 4,

            radius: 2,

            closed: false,

            tubularSegmentsMultiple: 1,

        },

    }

    return group

}

/* 边框 几何 面板 */
function setBorderGeometryPanel(group, folder) {

    const { globalConfig } = group

    const { geometry } = globalConfig

    let timer = null

    function onChange() {

        if (timer) clearTimeout(timer)

        timer = setTimeout(() => {

            group.children.forEach((i) => {

                i.geometry.dispose()

                i.geometry = new THREE.TubeGeometry(i.curve, (i.curve.points.length - 1) * geometry.tubularSegmentsMultiple, geometry.radius, geometry.radialSegments, geometry.closed)

                i.geometry.center()

            })

            timer = null

        }, 200)

    }

    folder.add(geometry, 'tubularSegmentsMultiple', 1).name('分段倍乘').onChange(onChange).step(1)

    folder.add(geometry, 'radius', 0.01).name('管道半径').onChange(onChange)

    folder.add(geometry, 'radialSegments', 2).name('管道半径分段').onChange(onChange).step(1)

    folder.add(geometry, 'closed').name('管道是否闭合').onChange(onChange)

}

