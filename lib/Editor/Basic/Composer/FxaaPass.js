export function getFxaaPassStorage(fxaaPass) {

    return {

        enabled: fxaaPass.enabled,

        multPixel: fxaaPass.multPixel,

    }

}

export function setFxaaPassStorage(fxaaPass, storage) {

    if (!storage) return

    fxaaPass.enabled = storage.enabled

    if (fxaaPass.multPixel == storage.multPixel) return

    fxaaPass.multPixel = storage.multPixel

    fxaaPass.resize()

}

export function setFxaaPassPanel(fxaaPass, folder) {

    folder.add(fxaaPass, 'enabled').name('开启');

    folder.add(fxaaPass, 'multPixel').name('像素倍数').onChange(fxaaPass.resize);

}