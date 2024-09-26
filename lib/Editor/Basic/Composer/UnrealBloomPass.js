/* 获取 UnrealBloomPass 存储路径 */
export function getUnrealBloomPassStorage(unrealBloomPass) {

    return {

        enabled: unrealBloomPass.enabled,

        strength: unrealBloomPass.strength,

        radius: unrealBloomPass.radius,

        threshold: unrealBloomPass.threshold

    }

}

/* 设置 UnrealBloomPass 值 */
export function setUnrealBloomPassStorage(unrealBloomPass, storage) {

    if (!storage) return

    unrealBloomPass.enabled = storage.enabled

    unrealBloomPass.strength = storage.strength

    unrealBloomPass.radius = storage.radius

    unrealBloomPass.threshold = storage.threshold

}

/* 设置 UnrealBloomPass 控制面板 */
export function setUnrealBloomPassPanel(unrealBloomPass, folder) {

    folder.add(unrealBloomPass, 'enabled').name('泛光开启')

    folder.add(unrealBloomPass, 'strength').min(0).max(3).name('泛光强度')

    folder.add(unrealBloomPass, 'radius').min(0).max(1).name('泛光半径')

    folder.add(unrealBloomPass, 'threshold').min(0).max(1).name('泛光阈值')

}
