import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';

/* 设置*/
export function setGeoGroupLabelStorage(scene, group) {

    const { label } = group.globalConfig

    if (!label.show) return

    setGeoGroupLabel(scene, group, label)

}

/* 设置标签配置文件夹 */
export function setGeoGroupLabelPanel(scene, group, labelFolder) {

    const { label } = group.globalConfig

    labelFolder.add(label, 'show').name('显示标签').onChange(v => {

        v ? setGeoGroupLabel(scene, group, label) : clearGroupLabel()

    })

    labelFolder.add(label, 'type', ['2D', '3D']).name('标签类型').onChange(v => changeLabel('type'))

    labelFolder.addColor(label, 'color').name('标签颜色').onChange(v => changeLabel('color'))

    labelFolder.add(label, 'fontSize', 0).name('标签字体大小').onChange(v => changeLabel('fontSize'))

    labelFolder.add(label, 'fontWeight', ['400', '500', '600', '700', '800', '900']).name('标签字体粗细').onChange(v => changeLabel('fontWeight'))

    labelFolder.add(label, 'px').name('标签位置X偏移').onChange(v => changeLabel('px'))

    labelFolder.add(label, 'py').name('标签位置Y偏移').onChange(v => changeLabel('py'))

    labelFolder.add(label, 'pz').name('标签位置Z偏移').onChange(v => changeLabel('pz'))

    labelFolder.add(label, 'rx', 0, Math.PI * 2).name('标签旋转X偏移').onChange(v => changeLabel('rx'))

    labelFolder.add(label, 'ry', 0, Math.PI * 2).name('标签旋转Y偏移').onChange(v => changeLabel('ry'))

    labelFolder.add(label, 'rz', 0, Math.PI * 2).name('标签旋转Z偏移').onChange(v => changeLabel('rz'))

    labelFolder.add(label, 'ss').name('标签缩放').onChange(v => changeLabel('ss'))

    labelFolder.add(label, 'sx').name('标签缩放X').onChange(v => changeLabel('sx'))

    labelFolder.add(label, 'sy').name('标签缩放Y').onChange(v => changeLabel('sy'))

    labelFolder.add(label, 'sz').name('标签缩放Z').onChange(v => changeLabel('sz'))

    function changeLabel(property) {

        if (!group.labelGroup) return

        const labelMeshList = Object.values(group.labelGroup)

        switch (property) {

            case 'type':

                clearGroupLabel()

                setGeoGroupLabel(scene, group, label)

                break;

            case 'color':

                labelMeshList.forEach(i => i.element.style.color = label[property])

                break;

            case 'fontSize':

                labelMeshList.forEach(i => i.element.style.fontSize = label[property] + 'px')

                break;

            case 'fontWeight':

                labelMeshList.forEach(i => i.element.style.fontWeight = label[property])

                break;

            case 'px':

                labelMeshList.forEach(i => i.position.x = i._position.x + label[property])

                break;

            case 'py':

                labelMeshList.forEach(i => i.position.y = i._position.y + label[property])

                break;

            case 'pz':

                labelMeshList.forEach(i => i.position.z = i._position.z + label[property])

                break;

            case 'rx':

                labelMeshList.forEach(i => i.rotation.x = label[property])

                break;

            case 'ry':

                labelMeshList.forEach(i => i.rotation.y = label[property])

                break;

            case 'rz':

                labelMeshList.forEach(i => i.rotation.z = label[property])

                break;

            case 'ss':

                labelMeshList.forEach(i => i.scale.setScalar(label[property]))

                break;

            case 'sx':

                labelMeshList.forEach(i => i.scale.x = label[property])

                break;

            case 'sy':

                labelMeshList.forEach(i => i.scale.y = label[property])

                break;

            case 'sz':

                labelMeshList.forEach(i => i.scale.z = label[property])

                break;

        }

    }

    function clearGroupLabel() {

        group.labelGroup && Object.keys(group.labelGroup).forEach(i => {

            scene.remove(group.labelGroup[i])

            delete group.labelGroup[i]

        })

    }

}

/* 设置标签 */
export function setGeoGroupLabel(scene, group, labelParams) {

    group.labelGroup = {}

    const { type, color, fontSize, fontWeight, px, py, pz, rx, ry, rz, ss, sx, sy, sz } = labelParams

    group.children.forEach((i) => {

        if (i.geoInfo?.properties.name && !group.labelGroup[i.geoInfo.properties.name]) {

            const coord = (i.geoInfo?.properties.centroidCoord3 || i.geoInfo?.properties.centerCoord3).add(i.position).sub(i.initTranslate)

            const point = group.getTransformedVector(coord)

            const labelDOM = document.createElement('div')

            labelDOM.innerText = i.geoInfo?.properties?.name || ''

            labelDOM.style.color = color

            labelDOM.style.fontSize = fontSize + 'px'

            labelDOM.style.fontWeight = fontWeight

            const mesh = type === '2D' ? new CSS2DObject(labelDOM) : new CSS3DObject(labelDOM)

            mesh._position = point

            mesh.position.set(mesh._position.x + px, mesh._position.y + py, mesh._position.z + pz)

            mesh.rotation.set(rx, ry, rz)

            mesh.scale.set(sx, sy, sz)

            mesh.scale.setScalar(ss)

            scene.add(mesh)

            labelDOM.style.pointerEvents = 'none'

            group.labelGroup[i.geoInfo?.properties?.name] = mesh

        }

    })

}
