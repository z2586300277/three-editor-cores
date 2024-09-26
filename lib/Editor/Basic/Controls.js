/*  获取轨道控制 存储 */
export function getControlsStorage(controls) {

    return {

        maxPolarAngle: controls.maxPolarAngle,

        autoRotate: controls.autoRotate,

        autoRotateSpeed: controls.autoRotateSpeed,

        rotateSpeed: controls.rotateSpeed,

        panSpeed: controls.panSpeed,

        zoomSpeed: controls.zoomSpeed,

        enableDamping: controls.enableDamping,

        dampingFactor: controls.dampingFactor,

        minDistance: controls.minDistance,

        maxDistance: controls.maxDistance,

        target: { x: controls.target.x, y: controls.target.y, z: controls.target.z },

        viewAngleList: controls.viewAngleList

    }

}

/* 设置轨道控制 存储 */
export function setControlsStorage(controls, storage) {

    if (!storage) return

    controls.maxPolarAngle = storage.maxPolarAngle

    controls.autoRotate = storage.autoRotate

    controls.autoRotateSpeed = storage.autoRotateSpeed

    controls.rotateSpeed = storage.rotateSpeed

    controls.panSpeed = storage.panSpeed

    controls.zoomSpeed = storage.zoomSpeed

    controls.enableDamping = storage.enableDamping

    controls.dampingFactor = storage.dampingFactor

    controls.minDistance = storage.minDistance

    controls.maxDistance = storage.maxDistance

    controls.target.set(storage.target.x, storage.target.y, storage.target.z)

    controls.viewAngleList = storage.viewAngleList

    controls.update()

}

/* 设置轨道控制 面板 */
export function setControlsPanel(controls, folder) {

    folder.add(controls, 'autoRotate').name('自动旋转')

    folder.add(controls, 'autoRotateSpeed', 0, 10).name('自动旋转速度')

    folder.add(controls, 'enableDamping').name('阻尼')

    folder.add(controls, 'dampingFactor', 0, 1).name('阻尼系数')

    folder.add(controls, 'minDistance', 0).name('最小距离')

    folder.add(controls, 'maxDistance', 0).name('最大距离')

    folder.add(controls, 'maxPolarAngle', 0, Math.PI * 2).name('最大仰角')

    folder.add(controls, 'rotateSpeed').name('旋转速度')

    folder.add(controls, 'panSpeed').name('平移速度')

    folder.add(controls, 'zoomSpeed').name('缩放速度')

    folder.add(controls.target, 'x').name('目标位置x')

    folder.add(controls.target, 'y').name('目标位置y')

    folder.add(controls.target, 'z').name('目标位置z')

}