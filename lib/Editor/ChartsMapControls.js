import { materialList } from "./Group/Mesh/Material/MaterialChunk"
import { initGeoGroup, createGeoGroup, getGeoGroupStorage, setGeoGroupStorage, setGeoGroupPanel } from './ChartsMap/GeoGroup'

/* 地图控制 */
export const chartsMapControls = {

    url: '',

    materialType: '标准材质',

    geoGroupCallPanel: null,

    geoGroupLoadCall: null,

    geoGroupAllLoadedCall: null,

}

/* 地图控制面板 */
export function setChartsMapControlsPanel(scene, transformControls, CommonFrameList, folder) {

    const mapListFolder = folder.addFolder('地图列表')

    folder.add(chartsMapControls, 'url').name('地图数据地址')

    folder.add(chartsMapControls, 'materialType', materialList).name('地图材质类型')

    folder.add({

        fn: () => {

            createGeoGroup(scene, initGeoGroup(chartsMapControls.url|| 'https://z2586300277.github.io/3d-file-server/files/json/guangdong.json', chartsMapControls.materialType)).then(group => {

                setGeoGroupPanel(scene, transformControls, CommonFrameList, group, mapListFolder.addFolder(group.name + group.id))

            })

        }

    }, 'fn').name('添加地图')

    chartsMapControls.geoGroupCallPanel = group => setGeoGroupPanel(scene, transformControls, CommonFrameList, group, mapListFolder.addFolder(group.name + group.id))

}

/* 获取地图存储 */
export function getGeoGroupListStorage(List) {

    return List.map(i => getGeoGroupStorage(i))

}

/* 设置地图存储 */
export function setGeoGroupListStorage(scene, CommonFrameList, storage) {

    if (!storage) return

    const promise_list = storage?.map(i => setGeoGroupStorage(scene, CommonFrameList, i).then(group => {

        chartsMapControls.geoGroupCallPanel?.(group)

        chartsMapControls.geoGroupLoadCall?.(group)

    }))

    Promise.all(promise_list).then(() => chartsMapControls.geoGroupAllLoadedCall?.())

}