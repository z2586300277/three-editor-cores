import * as THREE from 'three'

/* 获取存储 */
export function getUniformsStorage(uniforms) {

    if (!uniforms) return

    return Object.keys(uniforms)

        .filter(

            i => ['color', 'position', 'opacity', 'number', 'bool'].includes(uniforms[i].type)
        )

        .reduce(

            (a, b) => ({ ...a, [b]: uniforms[b].value }), {}

        )

}

/* 着色器参数还原 */
export function setUniformsStorage(uniforms, storage) {

    if (!storage) return

    Object.keys(storage).forEach(i => {

        if (uniforms[i]) switch (uniforms[i].type) {

            case 'color':

                uniforms[i].value.set(storage[i])

                break;

            case 'number':

                uniforms[i].value = storage[i]

                break;

            case 'opacity':

                uniforms[i].value = storage[i]

                break;

            case 'position':

                uniforms[i].value.set(storage[i].x, storage[i].y, storage[i].z)

                break;

            case 'bool':

                uniforms[i].value = storage[i]

                break;

        }

    })

}

/* 着色器参数文件夹 */
export function setUniformsPanel(uniforms, folder) {

    Object.keys(uniforms).forEach((i) => {

        switch (uniforms[i].type) {

            case 'number':

                const numberController = folder.add(uniforms[i], 'value').name(i)

                Reflect.has(uniforms[i], 'min') && numberController.min(uniforms[i].min)

                Reflect.has(uniforms[i], 'max') && numberController.max(uniforms[i].max)

                break;

            case 'color':

                folder.addColor({ value: uniforms[i].value.getHex() }, 'value').onChange(v => uniforms[i].value = new THREE.Color(v)).name(i)

                break;

            case 'opacity':

                folder.add(uniforms[i], 'value').min(0).max(1).name(i)

                break;

            case 'position':

                ['x', 'y', 'z'].forEach(j => folder.add(uniforms[i].value, j).name(i + '-' + j))

                break;

            case 'bool':

                folder.add(uniforms[i], 'value').name(i)

                break;

        }

    })

    return folder

}