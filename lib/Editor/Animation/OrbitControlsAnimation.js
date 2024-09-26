
import { createGsap } from '../../Api/ThreeApi.js'

/* 视角控制面板 */
export function setOrbitControlsAnimationPanel(controls, folder) {

    const folderList = folder.addFolder('视角列表')

    if (!controls.viewAngleList) controls.viewAngleList = []

    else controls.viewAngleList.forEach((viewAngleInfo, k) => setViewAnglePanel(controls, viewAngleInfo, folderList.addFolder((viewAngleInfo.name || '视角') + '[' + Date.now() + k + ']')))

    folder.add({

        fn: () => {

            const viewAngleInfo = getViewAngleInfo(controls)

            controls.viewAngleList.push(viewAngleInfo)

            setViewAnglePanel(controls, viewAngleInfo, folderList.addFolder(viewAngleInfo.name || '视角' + '[' + Date.now() + ']'))

            folderList.open()

        }
        
    }, 'fn').name('记录当前视角')

}

/* 获取相机和目标信息 */
function getViewAngleInfo(controls) {

    return {

        name: '',

        target: { x: controls.target.x, y: controls.target.y, z: controls.target.z },

        position: { x: controls.object.position.x, y: controls.object.position.y, z: controls.object.position.z }

    }

}

/* 设置视角面板 */
function setViewAnglePanel(controls, viewAngleInfo, folder) {

    folder.add(viewAngleInfo, 'name').name('名称')

    folder.add({ fn: () => setViewAngle(controls, viewAngleInfo) }, 'fn').name('直接查看')

    folder.add({

        fn: () => {

            createGsap(controls.target, viewAngleInfo.target)

            createGsap(controls.object.position, viewAngleInfo.position)

        }

    }, 'fn').name('动画查看')

    folder.add({

        fn: () => {

            const index = controls.viewAngleList.indexOf(viewAngleInfo)

            if (index !== -1) controls.viewAngleList.splice(index, 1)

            folder.parent.removeFolder(folder)

        }

    }, 'fn').name('删除')

}

/* 设置视角 */
function setViewAngle(controls, viewAngleInfo) {

    controls.target.set(viewAngleInfo.target.x, viewAngleInfo.target.y, viewAngleInfo.target.z)

    controls.object.position.set(viewAngleInfo.position.x, viewAngleInfo.position.y, viewAngleInfo.position.z)

    controls.update()

}