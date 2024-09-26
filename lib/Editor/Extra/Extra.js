import * as THREE from 'three'
import { getGeometry } from "../Group/Mesh/Geometry/GeometryChunk";
import { getMaterial } from "../Group/Mesh/Material/MaterialChunk";
import { getMesh } from "../InnerMesh/InnerMesh";
import { setShaderBlendWithCodeName } from "../Group/Shader/Shader";

/* 创建天空球 shader  */
export function createSkySphereShader(params = {}) {

    const geometry = getGeometry('球体')

    const material = getMaterial(params.materialType || '基础材质')

    const mesh = getMesh(geometry, material)

    setShaderBlendWithCodeName(mesh, '着色天空')

    return mesh

}

/* 创建 扫光平面 */
export function createScanPlane(params = {}) {

    const geometry = getGeometry('平面')

    const material = getMaterial(params.materialType || '标准材质')

    if (params.url) material.map = new THREE.TextureLoader().load(params.url)

    const mesh = getMesh(geometry, material)

    setShaderBlendWithCodeName(mesh, '光圈扫射')

    mesh.uniforms.circleWidth.value = 0.4

    mesh.uniforms.isDisCard.value = true

    return mesh

}

/* 创建天空球 shader  */
export function createOneHeatMap(params = {}) {

    const geometry = getGeometry(params.geometryType || '平面')

    const material = getMaterial(params.materialType || '基础材质')

    const mesh = getMesh(geometry, material)

    setShaderBlendWithCodeName(mesh, '热力图')

    return mesh

}