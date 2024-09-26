/* 获取阴影存储 */
export function getShadowStorage(shadow) {

    if (!shadow) return

    const { camera } = shadow

    return {

        bias: shadow.bias,

        radius: shadow.radius,

        mapSize: shadow.mapSize,

        normalBias: shadow.normalBias,

        camera: camera ? {

            near: camera.near,

            far: camera.far,

            fov: camera.fov,

            left: camera.left,

            right: camera.right,

            top: camera.top,

            bottom: camera.bottom

        } : null

    }

}

/* 设置Shadow storage */
export function setShadowStorage(shadow, storage) {

    if (!storage) return

    shadow.bias = storage.bias

    shadow.radius = storage.radius

    shadow.mapSize.set(storage.mapSize.x, storage.mapSize.y)

    shadow.normalBias = storage.normalBias

    const { camera } = storage

    if (camera && shadow.camera) {

        Object.keys(camera).forEach(key => shadow.camera[key] = camera[key])

        shadow.camera.updateProjectionMatrix()

    }

}

/* 设置阴影面板 */
export function setShadowPanel(shadow, folder) {

    folder.add(shadow, 'bias').name('偏移')

    folder.add(shadow, 'radius').name('半径')

    folder.add(shadow, 'normalBias').name('法线偏移')

    folder.add(shadow.mapSize, 'width').name('阴影贴图宽度')

    folder.add(shadow.mapSize, 'height').name('阴影贴图高度')

    const cameraFolder = folder.addFolder('投影相机')

    cameraFolder.add(shadow.camera, 'near').name('近平面').onChange(() => shadow.camera.updateProjectionMatrix())

    cameraFolder.add(shadow.camera, 'far').name('远平面').onChange(() => shadow.camera.updateProjectionMatrix())

    if (shadow.camera.isOrthographicCamera) {

        cameraFolder.add(shadow.camera, 'left').name('左平面').onChange(() => shadow.camera.updateProjectionMatrix())

        cameraFolder.add(shadow.camera, 'right').name('右平面').onChange(() => shadow.camera.updateProjectionMatrix())

        cameraFolder.add(shadow.camera, 'top').name('上平面').onChange(() => shadow.camera.updateProjectionMatrix())

        cameraFolder.add(shadow.camera, 'bottom').name('下平面').onChange(() => shadow.camera.updateProjectionMatrix())

    }

    else cameraFolder.add(shadow.camera, 'fov').name('视角').onChange(() => shadow.camera.updateProjectionMatrix())

}