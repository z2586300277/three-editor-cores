import { loadFBX, loadGLTF, loadOBJ } from '../../Api/ThreeApi'

/* 加载物体  设置物体参数 GUI管理 */
export function loadModel(url, type, dracoPath, callback = () => { }) {

    switch (type) {

        case 'GLTF':

            return loadGLTF(url, dracoPath, mesh => callback(mesh))

        case 'FBX':

            return loadFBX(url, mesh => callback(mesh))

        case 'OBJ':

            return loadOBJ(url, mesh => callback(mesh))

    }

}