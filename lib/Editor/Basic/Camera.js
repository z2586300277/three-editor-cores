/* 获取 Camera 存储的数据 */
export function getCameraSrorage(camera) {

    return {

        fov: camera.fov,

        near: camera.near,

        far: camera.far,

        zoom: camera.zoom,

        position: {

            x: camera.position.x,

            y: camera.position.y,

            z: camera.position.z,

        }

    }

}

/* 设置 Camera 存储的数据 */
export function setCameraSrorage(camera, storage) {

    if (!storage) return

    camera.fov = storage.fov

    camera.near = storage.near

    camera.far = storage.far

    camera.zoom = storage.zoom

    camera.position.set(storage.position.x, storage.position.y, storage.position.z)

    camera.updateProjectionMatrix()

}

/* 设置 Camera 控制面板 */
export function setCameraPanel(camera, folder) {

    const onChange = () => camera.updateProjectionMatrix()

    folder.add(camera, 'fov').min(0).name('视角').onChange(onChange)

    folder.add(camera, 'near').min(0.001).name('近平面').onChange(onChange)

    folder.add(camera, 'far').min(0).name('远平面').onChange(onChange)

    folder.add(camera, 'zoom').min(0).name('缩放').onChange(onChange)

    folder.add(camera.position, 'x').name('相机位置x')

    folder.add(camera.position, 'y').name('相机位置y')

    folder.add(camera.position, 'z').name('相机位置z')

}