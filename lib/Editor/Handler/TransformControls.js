/* 获取transformControls 存储值 */
export function getTransformControlsStorage(transformControls) {

    return {

        mode: transformControls.mode,

        size: transformControls.size,

        showX: transformControls.showX,

        showY: transformControls.showY,

        showZ: transformControls.showZ,

        translationSnap: transformControls.translationSnap,

        rotationSnap: transformControls.rotationSnap,

        scaleSnap: transformControls.scaleSnap,

    }

}

/* 设置transformControls 存储值 */
export function setTransformControlsStorage(transformControls, storage) {

    if (!storage) return

    transformControls.mode = storage.mode

    transformControls.size = storage.size

    transformControls.showX = storage.showX

    transformControls.showY = storage.showY

    transformControls.showZ = storage.showZ

    transformControls.translationSnap = storage.translationSnap

    transformControls.rotationSnap = storage.rotationSnap

    transformControls.scaleSnap = storage.scaleSnap

}

/* 设置transform 面板 */
export function setTransformControlsPanel(transformControls, folder) {

    folder.add(transformControls, 'mode', ['translate', 'rotate', 'scale'])

    folder.add(transformControls, 'size')

    folder.add(transformControls, 'showX')

    folder.add(transformControls, 'showY')

    folder.add(transformControls, 'showZ')

    !transformControls.rotationSnap && (transformControls.rotationSnap = 0)

    !transformControls.translationSnap && (transformControls.translationSnap = 0)

    !transformControls.scaleSnap && (transformControls.scaleSnap = 0)

    folder.add(transformControls, 'translationSnap')

    folder.add(transformControls, 'rotationSnap')

    folder.add(transformControls, 'scaleSnap')

}

