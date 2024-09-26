import * as THREE from 'three'
import { createVideoTexture } from '../../../../Api/ThreeApi'

/* 获取贴图存储 */
export function getMapStorage(material) {

    const { mapType, mapUrl, map } = material

    if (!mapUrl || !map) return

    return {

        mapType,

        mapUrl,

        map: {

            wrapS: map.wrapS,

            wrapT: map.wrapT,

            rotation: map.rotation,

            center: map.center,

            repeat: map.repeat,

            offset: map.offset,

            textureAnimation: map.textureAnimation

        }

    }

}

/* 贴图 还原 */
export function setMapStorage(CommonFrameList, material, storage) {

    if (!material.mapUrl) return material.map = null

    if (material.mapType == '视频') material.map = createVideoTexture(material.mapUrl)

    else material.map = new THREE.TextureLoader().load(material.mapUrl)

    if (storage) {

        material.map.wrapS = storage.wrapS

        material.map.wrapT = storage.wrapT

        material.map.repeat.set(storage.repeat.x, storage.repeat.y)

        material.map.offset.set(storage.offset.x, storage.offset.y)

        material.map.center.set(storage.center.x, storage.center.y)

        material.map.rotation = storage.rotation

        if (storage.textureAnimation?.isTextureAnimation) {

            material.map.textureAnimation = storage.textureAnimation

            material.map.frameAnimationRender = function () {

                material.map.offset.x += storage.textureAnimation.offset.x

                material.map.offset.y += storage.textureAnimation.offset.y

                material.map.rotation += storage.textureAnimation.rotation

            }

            CommonFrameList.push(material.map)

        }

    }

    material.map.center.set(0.5, 0.5)

    material.isCustomTexture = true

    material.needsUpdate = true

}

/* 贴材质 面板 */
export function setMaterialMapPanel(CommonFrameList, material, folder) {

    !Reflect.has(material, 'mapUrl') && (material.mapUrl = '')

    folder.add(material, 'mapUrl').name('贴图')

    !Reflect.has(material, 'mapType') && (material.mapType = '图片')

    folder.add(material, 'mapType', ['图片', '视频']).name('贴图类型')

    folder.add({ updateMap: () => setMapStorage(CommonFrameList, material) }, 'updateMap').name('更新贴图')

}

export function setMapPanel(map, folder) {

    folder.add(map, 'wrapS', [THREE.ClampToEdgeWrapping, THREE.RepeatWrapping, THREE.MirroredRepeatWrapping]).name('水平环绕方式').onChange(v => map.needsUpdate = true)

    folder.add(map, 'wrapT', [THREE.ClampToEdgeWrapping, THREE.RepeatWrapping, THREE.MirroredRepeatWrapping]).name('垂直环绕方式').onChange(v => map.needsUpdate = true)

    folder.add(map, 'rotation').name('旋转').min(0).max(Math.PI * 2)

    folder.add(map.repeat, 'x').name('x重复')

    folder.add(map.repeat, 'y').name('y重复')

    folder.add(map.offset, 'x').name('x偏移').min(0).max(1)

    folder.add(map.offset, 'y').name('y偏移').min(0).max(1)

    folder.add(map.center, 'x').name('x中心').min(0).max(1)

    folder.add(map.center, 'y').name('y中心').min(0).max(1)

}

/* 贴图动画面板 */
export function setMapAnimationPanel(CommonFrameList, map, folder) {

    if (!Reflect.has(map, 'textureAnimation')) {

        map.textureAnimation = {

            isTextureAnimation: false,

            offset: { x: 0, y: 0 },

            rotation: 0,

        }

    }

    folder.add(map.textureAnimation, 'isTextureAnimation').name('贴图动画').onChange(v => {

        if (v) {

            map.frameAnimationRender = function () {

                map.offset.x += map.textureAnimation.offset.x

                map.offset.y += map.textureAnimation.offset.y

                map.rotation += map.textureAnimation.rotation

            }

            CommonFrameList.push(map)

        }

        else {

            delete map.frameAnimationRender

            CommonFrameList.splice(CommonFrameList.findIndex(j => j.uuid == map.uuid), 1)

        }

    })

    folder.add(map.textureAnimation, 'rotation').name('旋转速度')

    folder.add(map.textureAnimation.offset, 'x').name('x偏移速度')

    folder.add(map.textureAnimation.offset, 'y').name('y偏移速度')

}
