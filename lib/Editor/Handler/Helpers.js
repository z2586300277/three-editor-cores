import { axes, getAxesHelperStorage, setAxesHelperStorage, setAxesHelperPanel } from './Helpers/AxesHelper'
import { grid, getGridHelperStorage, setGridHelperStorage, setGridHelperPanel } from './Helpers/GridHelper'
import { box3, getBox3HelperStorage, setBox3HelperStorage, setBox3HelperPanel } from './Helpers/Box3Helper'
export { resolveAxesHelper } from './Helpers/AxesHelper'
export { resolveGridHelper } from './Helpers/GridHelper'
export { resolveBox3Helper } from './Helpers/Box3Helper'

export const helpers = {

    axes,

    grid,

    box3

}

/* 获取辅助存储 */
export function getHelperStorage(helpers) {

    return {

        axes: getAxesHelperStorage(helpers.axes),

        grid: getGridHelperStorage(helpers.grid),

        box3: getBox3HelperStorage(helpers.box3)

    }

}

/* 设置辅助存储 */
export function setHelperStorage(scene, transformControls, helpers, storage) {

    if (!storage) return

    setAxesHelperStorage(scene, helpers.axes, storage.axes)

    setGridHelperStorage(scene, helpers.grid, storage.grid)

    setBox3HelperStorage(scene, transformControls, helpers.box3, storage.box3)

}

/* 设置辅助面板 */
export function setHelpersPanel(scene, transformControls, helpers, folder) {

    const { axes, grid, box3 } = helpers

    setAxesHelperPanel(scene, axes, folder.addFolder('坐标轴'))

    setGridHelperPanel(scene, grid, folder.addFolder('网格'))

    setBox3HelperPanel(scene, transformControls, box3, folder.addFolder('Box3'))

}