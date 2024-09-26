export function getSsrPassStorage(ssrPass) {

    return {

        enabled: ssrPass.enabled,

        maxDistance: ssrPass.maxDistance,

        distanceAttenuation: ssrPass.distanceAttenuation,

        opacity: ssrPass.opacity,

        thickness: ssrPass.thickness,

        fresnel: ssrPass.fresnel,

        infiniteThick: ssrPass.infiniteThick,

        bouncing: ssrPass.bouncing

    }

}

export function setSsrPassStorage(ssrPass, storage) {

    if (!storage) return

    ssrPass.enabled = storage.enabled

    ssrPass.maxDistance = storage.maxDistance

    ssrPass.distanceAttenuation = storage.distanceAttenuation

    ssrPass.opacity = storage.opacity

    ssrPass.thickness = storage.thickness

    ssrPass.fresnel = storage.fresnel

    ssrPass.infiniteThick = storage.infiniteThick

    ssrPass.bouncing = storage.bouncing

}

export function setSsrPassPanel(ssrPass,folder) {

    folder.add(ssrPass, 'enabled').name('开启屏幕空间反射')

    folder.add(ssrPass, 'maxDistance').name('最大距离')

    folder.add(ssrPass, 'distanceAttenuation').name('距离衰减')

    folder.add(ssrPass, 'opacity').name('透明度')

    folder.add(ssrPass, 'thickness').name('厚度')

    folder.add(ssrPass, 'fresnel').name('菲涅尔')

    folder.add(ssrPass, 'infiniteThick').name('无限厚度')

    folder.add(ssrPass, 'bouncing').name('反弹')

}