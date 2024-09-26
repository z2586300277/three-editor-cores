/* 同步控制 */
export function setSyncTransformPanel(handler, folder) {

    const rotationFolder = folder.addFolder('旋转控制')

    const rotationInfo = {

        axies: 'x',

        rotation: 0,

        fn() {

            if (handler.currentInfo?.currentRootModel) {

                handler.currentInfo.currentRootModel.rotation.set(0, 0, 0)

            }

        },

        setFn() {

            if (handler.currentInfo?.currentRootModel) {

                handler.currentInfo.currentRootModel.rotation[this.axies] += this.rotation / 180 * Math.PI

            }

        }

    }

    rotationFolder.add(rotationInfo, 'axies', ['x', 'y', 'z']).name('旋转轴')

    rotationFolder.add(rotationInfo, 'rotation').name('旋转角度')

    rotationFolder.add(rotationInfo, 'fn').name('旋转归零')

    rotationFolder.add(rotationInfo, 'setFn').name('应用')

    const transformRecordFolder = folder.addFolder('记录信息')

    const transformInfo = {

        recordModel: null,

        recordFn() {

            this.recordModel = handler.currentInfo?.currentRootModel

            while (transformRecordFolder.__controllers.length > 0) {

                transformRecordFolder.__controllers[0].remove()

            }

            if (this.recordModel) {

                transformRecordFolder.open()

                transformRecordFolder.add(this.recordModel, 'visible').name('显示')

                transformRecordFolder.add(this.recordModel, 'name').name('模型名称')

                transformRecordFolder.add(this.recordModel, 'id').name('模型id')

                transformRecordFolder.add({ fn: () => handler.currentInfo?.currentRootModel.position.copy(this.recordModel.position) }, 'fn').name('选中模型位置与记录同步')

                transformRecordFolder.add({ fn: () => handler.currentInfo?.currentRootModel.rotation.copy(this.recordModel.rotation) }, 'fn').name('选中模型旋转与记录同步')

                transformRecordFolder.add({ fn: () => handler.currentInfo?.currentRootModel.scale.copy(this.recordModel.scale) }, 'fn').name('选中模型缩放与记录同步')

            }

        },

        // 同步变换列表
        syncTransformList: [],

        syncTransformFn() {

            if (handler.currentInfo?.currentRootModel) {

                if (this.syncTransformList.indexOf(handler.currentInfo.currentRootModel) === -1) {

                    transformSyncFolder.open()

                    const model = handler.currentInfo.currentRootModel

                    this.syncTransformList.push(model)

                    const transformSyncModelFolder = transformSyncFolder.addFolder(model.id + '[' + Date.now() + ']')

                    transformSyncModelFolder.add(model, 'visible').name('显示')

                    transformSyncModelFolder.add({

                        fn: () => {

                            this.syncTransformList.splice(this.syncTransformList.indexOf(model), 1)

                            transformSyncFolder.removeFolder(transformSyncModelFolder)

                        }

                    }, 'fn').name('移除同步变换列表')

                }

            }

        }

    }

    folder.add(transformInfo, 'recordFn').name('#记录根选择模型信息');

    const transformSyncFolder = folder.addFolder('同步变换列表')

    folder.add(transformInfo, 'syncTransformFn').name('#加入同步变换列表');

    const transformSyncConfFolder = transformSyncFolder.addFolder('列表变换同步操作');

    const transformSyncParams = {

        position: { x: 0, y: 0, z: 0 },

        rotation: { x: 0, y: 0, z: 0 },

        scale: { x: 0, y: 0, z: 0 },

        oldPosition: { x: 0, y: 0, z: 0 },

        oldRotation: { x: 0, y: 0, z: 0 },

        oldScale: { x: 0, y: 0, z: 0 },

    };

    ['x', 'y', 'z'].forEach(j => transformSyncConfFolder.add(transformSyncParams.position, j).name('位置' + j).onChange(v => {

        transformInfo.syncTransformList.forEach(i => i.position[j] += v - transformSyncParams.oldPosition[j])

        transformSyncParams.oldPosition[j] = v

    }));

    ['x', 'y', 'z'].forEach(j => transformSyncConfFolder.add(transformSyncParams.rotation, j, -2 * Math.PI, 2 * Math.PI).name('旋转' + j).onChange(v => {

        transformInfo.syncTransformList.forEach(i => i.rotation[j] += v - transformSyncParams.oldRotation[j])

        transformSyncParams.oldRotation[j] = v

    }));

    ['x', 'y', 'z'].forEach(j => transformSyncConfFolder.add(transformSyncParams.scale, j).step(0.01).name('缩放' + j).onChange(v => {

        transformInfo.syncTransformList.forEach(i => i.scale[j] += i.scale[j] * (v - transformSyncParams.oldScale[j]))

        transformSyncParams.oldScale[j] = v

    }));

}