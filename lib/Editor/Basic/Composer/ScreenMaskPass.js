export function getScreenMaskPassStorage(screenMaskPass) {

    if (!screenMaskPass) return

    const { uniforms } = screenMaskPass

    return {

        enabled: screenMaskPass.enabled,

        intensity: uniforms.intensity.value,

        maskColor: uniforms.maskColor.value.getHex(),

        R: uniforms.R.value,

        sr: uniforms.sr.value

    }

}

export function setScreenMaskPassStorage(screenMaskPass, storage) {

    if (!screenMaskPass) return

    const { uniforms } = screenMaskPass

    if (!storage) return

    screenMaskPass.enabled = storage.enabled

    uniforms.intensity.value = storage.intensity

    uniforms.maskColor.value.set(storage.maskColor)

    uniforms.R.value = storage.R

    uniforms.sr.value = storage.sr

}

export function setScreenMaskPassPanel(screenMaskPass, folder) {

    if (!screenMaskPass) return

    const { uniforms } = screenMaskPass

    folder.add(screenMaskPass, 'enabled').name('启用')

    folder.add(uniforms.intensity, 'value').name('强度')

    folder.addColor({ color: uniforms.maskColor.value.getHex() }, 'color').name('颜色').onChange((value) => uniforms.maskColor.value.set(value))

    folder.add(uniforms.R, 'value').name('半径')

    folder.add(uniforms.sr, 'value').name('sr参数')

}