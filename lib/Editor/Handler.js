import { setSyncTransformPanel } from './Handler/SyncTransform'
import { setHandlerKey } from './Handler/KeyDown'
import { setHandlerHistory } from './Handler/History'
import { helpers, getHelperStorage, setHelperStorage, setHelpersPanel } from './Handler/Helpers'
import { stats, getStatsStorage, setStatsStorage, setStatsPanel, resolveStats } from './Handler/Stats'
import { resolveAxesHelper, resolveGridHelper } from './Handler/Helpers'
import { getTransformControlsStorage, setTransformControlsStorage, setTransformControlsPanel } from './Handler/TransformControls.js';

export const handler = {

    mode: '选择',

    openKey: false,

    keyDown: null,

    keyDownCallback: null,

    modeList: ['选择', '根选择', '变换', '场景绘制', '点击信息'],

    isTransformChildren: false,

    handlerHistory: null,

    stats,

    helpers

}

/* 安装 */
export function handlerInstall(scene, Stats, handler, transformControls) {

    handler.transformControls = transformControls

    handler.keyDown = setHandlerKey(handler, transformControls)

    resolveAxesHelper(scene, handler.helpers.axes)

    resolveGridHelper(scene, handler.helpers.grid)

    handler.keyDownCallback = () => { }

    handler.setHandlerOption = (k, v) => {

        switch (k) {

            case 'stats':

                handler.stats.showStats = v

                resolveStats(Stats, handler.stats)

                break

            case 'axes':

                handler.helpers.axes.showAxes = v

                resolveAxesHelper(scene, handler.helpers.axes)

                break

            case 'grid':

                handler.helpers.grid.showGrid = v

                resolveGridHelper(scene, handler.helpers.grid)

                break

            case 'openKey':

                handler.openKey = v

                setOpenKey(handler.keyDown, v)

                break

        }

    }

    handler.handlerHistory = setHandlerHistory(transformControls)

}

/* 获取handle 存储值 */
export function getHandlerStorage(handler) {

    const { mode, openKey, isTransformChildren, stats, helpers, transformControls } = handler

    return {

        mode,

        openKey,

        isTransformChildren,

        stats: getStatsStorage(stats),

        helpers: getHelperStorage(helpers),

        transformControls: getTransformControlsStorage(transformControls)

    }

}

/* 设置handle 存储值 */
export function setHandlerStorage(scene, transformControls, Stats, handler, storage) {

    if (!storage) return

    handler.mode = storage.mode

    handler.openKey = storage.openKey

    storage.openKey && setOpenKey(handler.keyDown, storage.openKey)

    handler.isTransformChildren = storage.isTransformChildren

    setStatsStorage(Stats, handler.stats, storage.stats)

    setHelperStorage(scene, transformControls, handler.helpers, storage.helpers)

    setTransformControlsStorage(transformControls, storage.transformControls)

}

/* 设置handle 面板 */
export function setHandlerPanel(scene, transformControls, Stats, handler, folder) {

    const { helpers } = handler

    folder.add(handler, 'mode', handler.modeList).name('模式').listen()

    folder.add(handler, 'isTransformChildren').name('子变换').listen()

    folder.add(handler, 'openKey').name('开启按键').listen().onChange(v => setOpenKey(handler.keyDown, v))

    setSyncTransformPanel(handler, folder.addFolder('同步控制'))

    setStatsPanel(Stats, handler.stats, folder.addFolder('性能监控'))

    setHelpersPanel(scene, transformControls, helpers, folder)

    setTransformControlsPanel(transformControls, folder.addFolder('变换控制器配置'))

}

/* 按键 */
function setOpenKey(keyDown, v) {

    v ? document.addEventListener('keydown', keyDown) : document.removeEventListener('keydown', keyDown)

}


