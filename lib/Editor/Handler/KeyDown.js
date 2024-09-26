import { restoreHistoryHandler } from './History'

/* 设置操作快捷键 */
export function setHandlerKey(handler, transformControls) {

    // mesh 变换
    function meshSport(k, v) {

        if (!transformControls.object) return

        const mesh = transformControls.object

        switch (transformControls.mode) {

            case 'translate':

                mesh.position[k] += v

                break

            case 'scale':

                mesh.scale[k] += v * 0.001 * mesh.scale[k]

                break

            case 'rotate':

                mesh.rotation[k] += v * Math.PI / 360

                break

        }

    }

    // 按键事件
    function keydown(e) {

        if (e.target.tagName === 'INPUT') return

        if (e.ctrlKey) return

        switch (e.key) {

            case '1':

                handler.mode = '选择'

                break

            case '2':

                handler.mode = '根选择'

                break

            case '3':

                handler.mode = '变换'

                break

            case '4':

                handler.mode = '场景绘制'

                break

            case '5':

                handler.mode = '点击信息'

                break

            case 'Tab':

                const { currentInfo } = handler

                if (currentInfo) {

                    if (handler.mode === '选择') transformControls.attach(currentInfo.currentModel)

                    else if (handler.mode === '根选择') transformControls.attach(currentInfo.currentRootModel)

                    else if (handler.mode === '变换') {

                        e.preventDefault()

                        if (e.shiftKey) transformControls.setSpace(transformControls.space === 'local' ? 'world' : 'local')

                        else {

                            handler.isTransformChildren = !handler.isTransformChildren

                            transformControls.detach()

                        }

                    }

                }

                break

            case 'Delete':

                if (!handler.currentInfo) break

                const { currentModel, currentRootModel } = handler.currentInfo

                if (handler.mode === '选择' && currentModel) {

                    currentModel.visible = false

                }

                else if (handler.mode === '根选择' && currentRootModel) {

                    transformControls.detach()

                    currentRootModel.parent.remove(currentRootModel)

                }

                else if (handler.mode === '变换' && currentRootModel && !handler.isTransformChildren) {

                    const removeModel = transformControls.object || currentRootModel

                    transformControls.detach()

                    removeModel.parent?.remove(removeModel)

                }

                else if (handler.mode === '变换' && currentModel && handler.isTransformChildren) {

                    currentModel.visible = false

                }

                break

            case 'g':

                transformControls.setMode('translate')

                break

            case 't':

                transformControls.setMode('scale')

                break

            case 'r':

                transformControls.setMode('rotate')

                break

            case 'w':

                meshSport('y', 1)

                break

            case 's':

                meshSport('y', -1)

                break

            case 'a':

                meshSport('x', -1)

                break

            case 'd':

                meshSport('x', 1)

                break

            case 'q':

                meshSport('z', 1)

                break

            case 'e':

                meshSport('z', -1)

                break

            case 'z':

                restoreHistoryHandler('z')

                break

            case 'y':

                restoreHistoryHandler('y')

                break

            case 'Escape':

                transformControls.detach()

                break

        }

        handler.keyDownCallback?.(e.key)

    }

    return keydown

}