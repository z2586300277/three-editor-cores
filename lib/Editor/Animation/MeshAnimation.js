import { setTransformInfo, getTransformInfo, getMeshAction, setGsapMeshAction } from '../../Api/ThreeApi';

/* 动画 面板 */
export function setMeshAnimationPanel(handler, transformControls, folder) {

    const gsapParams = setGsapPanel(folder.addFolder('动画属性配置'))

    let meshGsapFolder = null

    // 加载物体相关信息
    folder.add({

        fn: function () {

            const { currentInfo } = handler

            if (!currentInfo) return

            let model;

            if (handler.mode == '选择') model = currentInfo.currentModel

            else if (handler.mode == '根选择') model = currentInfo.currentRootModel

            else if (handler.mode == '变换') model = !handler.isTransformChildren ? currentInfo.currentRootModel : currentInfo.currentModel

            meshGsapFolder && folder.removeFolder(meshGsapFolder)

            meshGsapFolder = folder.addFolder(model.name + model.id + '动画配置')

            transformControls.attach(model)

            setMeshGsapAnimatesPanel(model, gsapParams, meshGsapFolder)

        }

    }, 'fn').name('加载当前物体信息')

}

/* gsap 属性控制面板 */
function setGsapPanel(folder) {

    const gsapParams = {

        mode: 'to',

        query: {

            duration: 2,

            ease: 'none',

            repeat: 0,

            yoyo: false

        }

    }

    folder.add(gsapParams, 'mode', ['to', 'from', 'fromTo']).name('动画模式');

    folder.add(gsapParams.query, 'duration', 0, 10).name('动画时长');

    folder.add(gsapParams.query, 'ease', ['none', 'power1', 'power2', 'power3', 'power4', 'back', 'elastic', 'bounce']).name('动画缓动');

    folder.add(gsapParams.query, 'repeat', 0).name('动画重复次数');

    folder.add(gsapParams.query, 'yoyo').name('动画循环');

    return gsapParams

}

/* mesh gsap panel */
function setMeshGsapAnimatesPanel(mesh, gsapParams, folder) {

    const folderList = folder.addFolder('动画列表')

    mesh._transformInfo = getTransformInfo(mesh)

    if (!mesh.transformAnimationList) mesh.transformAnimationList = []

    else mesh.transformAnimationList.forEach((i, k) => setMeshActionPanel(mesh, i, folderList.addFolder('动作' + '[' + Date.now() + k + ']')))

    folder.add({ fn: () => setTransformInfo(mesh, mesh._transformInfo) }, 'fn').name('还原为源信息')

    folder.add({ fn: () => mesh._transformInfo = getTransformInfo(mesh) }, 'fn').name('当前状态更新为源信息')

    folder.add({ fn: () => setGsapMeshAction(mesh, mesh._transformInfo, getTransformInfo(mesh), gsapParams) }, 'fn').name('预览动画')

    folder.add({

        fn: () => {

            const action = getMeshAction(mesh, gsapParams)

            mesh.transformAnimationList.push(action)

            folderList.open()

            setMeshActionPanel(mesh, action, folderList.addFolder('动作' + '[' + Date.now() + ']'))

        }

    }, 'fn').name('保存动画')

}

/* mesh  动作 面板 */
function setMeshActionPanel(mesh, action, folder) {

    folder.add(action, 'name').name('动作名')

    const fn = {

        play: () => {

            const { gsapParams, _transformInfo, transformInfo_ } = action

            setGsapMeshAction(mesh, _transformInfo, transformInfo_, gsapParams)

        },

        del: () => {

            mesh.transformAnimationList.splice(mesh.transformAnimationList.indexOf(action), 1)

            folder.parent.removeFolder(folder)

        }

    }

    folder.add(fn, 'play').name('播放动作')

    folder.add(fn, 'del').name('删除动作')

}



