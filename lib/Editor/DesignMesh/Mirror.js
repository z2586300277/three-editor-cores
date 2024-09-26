import * as THREE from 'three'
import { Reflector } from 'three/examples/jsm/objects/Reflector.js'

export function createMirror(geometry, params) {

    const { DOM, renderer } = params

    const mesh = new Reflector(geometry || new THREE.PlaneGeometry(100, 100), {

        clipBias: 0.03,

        textureWidth: DOM.clientWidth * renderer.getPixelRatio(),

        textureHeight: DOM.clientHeight * renderer.getPixelRatio(),

        color: 0xc1cbcb,

    })

    mesh.rotateX(-Math.PI / 2)

    return mesh

}

export function setMirrorPanel(mesh, folder) {

    const { material } = mesh


    folder.addColor({ color: material.uniforms.color.value.getHex() }, 'color').name('颜色').onChange((e) => material.uniforms.color.value.setHex(e))
}
