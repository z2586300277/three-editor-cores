import * as THREE from 'three'

export function setSkyPanel(texture, folder) {

    folder.open()

    if (!texture) return

    folder.add(texture, 'colorSpace', [THREE.SRGBColorSpace, THREE.LinearSRGBColorSpace]).name('色彩空间').onChange(() => texture.needsUpdate = true)

    return folder

}

export function getSkyStorage(texture) {

    if (!texture) return

    return {

        colorSpace: texture.colorSpace

    }

}

export function setSkyStorage(texture, storage) {

    if (!storage) return

    texture.colorSpace = storage.colorSpace

}
