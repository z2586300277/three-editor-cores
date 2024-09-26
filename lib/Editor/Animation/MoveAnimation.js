export function setMoveAnimationPanel(handler, transformControls, CommonFrameList, folder) {

    // 加载物体相关信息
    folder.add({

        fn: function () {

            const { currentInfo } = handler

            if (!currentInfo) return

            let model;

            if (handler.mode == '选择') model = currentInfo.currentModel

            else if (handler.mode == '根选择') model = currentInfo.currentRootModel

            else if (handler.mode == '变换') model = !handler.isTransformChildren ? currentInfo.currentRootModel : currentInfo.currentModel

            if (!model) return

            function setAnimation(model, num) {

                const start = model.position.y

                const end = model.position.y + num

                return function getRender(speed, type) {

                    if (type == 'down') {

                        model.frameAnimationRender = () => {

                            model.position.y -= speed

                            if (model.position.y < start) getRender(speed, 'up')

                        }

                    }

                    else if (type == 'up') {

                        model.frameAnimationRender = () => {

                            model.position.y += speed

                            if (model.position.y > end) getRender(speed, 'down')

                        }

                    }

                }
            }

            model.frameAnimationRender = () => setAnimation(model, 1)(0.01, 'down')

            CommonFrameList.push(model)

        }

    }, 'fn').name('加载当前物体信息')

}