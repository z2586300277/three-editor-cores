import { getGeometry } from './Geometry/GeometryChunk.js'

/* 创建几何体文件夹 */
export function setGeometryPanel(mesh, folder) {

    const { geometry } = mesh

    const { parameters } = geometry

    const onChange = () => {

        geometry.dispose()

        mesh.geometry = getGeometry(geometry.geometryType, parameters)

    }

    switch (geometry.geometryType) {

        case '立方体':

            folder.add(parameters, 'width', 0).name('宽度').onChange(onChange)

            folder.add(parameters, 'height', 0).name('高度').onChange(onChange)

            folder.add(parameters, 'depth', 0).name('深度').onChange(onChange)

            folder.add(parameters, 'widthSegments', 0).name('宽度分段').onChange(onChange).step(1)

            folder.add(parameters, 'heightSegments', 0).name('高度分段').onChange(onChange).step(1)

            folder.add(parameters, 'depthSegments', 0).name('深度分段').onChange(onChange).step(1)

            break

        case '球体':

            folder.add(parameters, 'radius', 0).name('半径').onChange(onChange)

            folder.add(parameters, 'widthSegments', 0).name('宽度分段').onChange(onChange)

            folder.add(parameters, 'heightSegments', 0).name('高度分段').onChange(onChange)

            break

        case '平面':

            folder.add(parameters, 'width', 0).name('宽度').onChange(onChange)

            folder.add(parameters, 'height', 0).name('高度').onChange(onChange)

            folder.add(parameters, 'widthSegments', 0).name('宽度分段').onChange(onChange)

            folder.add(parameters, 'heightSegments', 0).name('高度分段').onChange(onChange)

            break

        case '胶囊':

            folder.add(parameters, 'radius', 0).name('半径').onChange(onChange)

            folder.add(parameters, 'length', 0).name('高度').onChange(onChange)

            folder.add(parameters, 'capSegments', 0).name('顶部分段').onChange(onChange)

            folder.add(parameters, 'radialSegments', 0).name('半径分段').onChange(onChange)

            break

        case '圆锥':

            folder.add(parameters, 'radius', 0).name('半径').onChange(onChange)

            folder.add(parameters, 'height', 0).name('高度').onChange(onChange)

            folder.add(parameters, 'radialSegments', 0).name('半径分段').onChange(onChange)

            break

        case '圆面':

            folder.add(parameters, 'radius', 0).name('半径').onChange(onChange)

            folder.add(parameters, 'thetaStart', 0).name('起始角度').onChange(onChange)

            folder.add(parameters, 'thetaLength', 0, Math.PI * 2).name('结束角度').onChange(onChange)

            break

        case '圆柱':

            folder.add(parameters, 'radiusTop', 0).name('顶部半径').onChange(onChange)

            folder.add(parameters, 'radiusBottom', 0).name('底部半径').onChange(onChange)

            folder.add(parameters, 'height', 0).name('高度').onChange(onChange)

            folder.add(parameters, 'radialSegments', 0).name('半径分段').onChange(onChange)

            break

        case '圆环':

            folder.add(parameters, 'radius', 0).name('半径').onChange(onChange)

            folder.add(parameters, 'tube', 0).name('管道半径').onChange(onChange)

            folder.add(parameters, 'radialSegments', 0).name('半径分段').onChange(onChange)

            folder.add(parameters, 'tubularSegments', 0).name('管道分段').onChange(onChange)

            folder.add(parameters, 'arc', 0, Math.PI * 2).name('弧度').onChange(onChange)

            break

        case '环面':

            folder.add(parameters, 'innerRadius', 0).name('内半径').onChange(onChange)

            folder.add(parameters, 'outerRadius', 0).name('外半径').onChange(onChange)

            folder.add(parameters, 'thetaSegments', 0).name('弧度分段').onChange(onChange)

            folder.add(parameters, 'phiSegments', 0).name('管道分段').onChange(onChange)

            folder.add(parameters, 'thetaStart', 0).name('起始角度').onChange(onChange)

            folder.add(parameters, 'thetaLength', 0, Math.PI * 2).name('结束角度').onChange(onChange)

            break

    }

}

