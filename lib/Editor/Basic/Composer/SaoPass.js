export function getSaoPassStorage(saoPass) {

    return {

        enabled: saoPass.enabled,

        saoBias: saoPass.params.saoBias,

        saoIntensity: saoPass.params.saoIntensity,

        saoScale: saoPass.params.saoScale,

        saoKernelRadius: saoPass.params.saoKernelRadius,

        saoMinResolution: saoPass.params.saoMinResolution,

        saoBlur: saoPass.params.saoBlur,

        saoBlurRadius: saoPass.params.saoBlurRadius,

        saoBlurStdDev: saoPass.params.saoBlurStdDev,

        saoBlurDepthCutoff: saoPass.params.saoBlurDepthCutoff

    }

}

export function setSaoPassStorage(saoPass, storage) {

    if (!storage) return

    saoPass.enabled = storage.enabled

    saoPass.params.saoBias = storage.saoBias

    saoPass.params.saoIntensity = storage.saoIntensity

    saoPass.params.saoScale = storage.saoScale

    saoPass.params.saoKernelRadius = storage.saoKernelRadius

    saoPass.params.saoMinResolution = storage.saoMinResolution

    saoPass.params.saoBlur = storage.saoBlur

    saoPass.params.saoBlurRadius = storage.saoBlurRadius

    saoPass.params.saoBlurStdDev = storage.saoBlurStdDev

    saoPass.params.saoBlurDepthCutoff = storage.saoBlurDepthCutoff

}

export function setSaoPassPanel(saoPass, folder) {

    folder.add(saoPass, 'enabled').name('启用')

    folder.add(saoPass.params, 'saoBias').name('偏移')

    folder.add(saoPass.params, 'saoIntensity').name('强度')

    folder.add(saoPass.params, 'saoScale', 0).name('缩放')

    folder.add(saoPass.params, 'saoKernelRadius', 0).name('半径')

    folder.add(saoPass.params, 'saoMinResolution', 0).name('最小分辨率')

    folder.add(saoPass.params, 'saoBlur').name('模糊')

    folder.add(saoPass.params, 'saoBlurRadius', 0).name('模糊半径')

    folder.add(saoPass.params, 'saoBlurStdDev').name('模糊标准差')

    folder.add(saoPass.params, 'saoBlurDepthCutoff').name('模糊深度截断')

}