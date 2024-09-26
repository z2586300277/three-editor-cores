/* 获取灯光类型存储 */
export function getLightTypeStorage(light) {

    switch (light.type) {

        case 'PointLight':

            return {

                distance: light.distance,

                decay: light.decay,

                power: light.power

            }

        case 'SpotLight':

            return {

                distance: light.distance,

                decay: light.decay,

                power: light.power,

                angle: light.angle,

                penumbra: light.penumbra

            }

        case 'HemisphereLight':

            return {

                groundColor: light.groundColor

            }

        case 'RectAreaLight':

            return {

                width: light.width,

                height: light.height,

                rotation: { x: light.rotation.x, y: light.rotation.y, z: light.rotation.z }

            }

    }

}

/* 设置灯光类型存储 */
export function setLightTypeStorage(light, storage) {

    if (!storage) return

    switch (light.type) {

        case 'PointLight':

            light.distance = storage.distance

            light.decay = storage.decay

            light.power = storage.power

            break

        case 'SpotLight':

            light.distance = storage.distance

            light.decay = storage.decay

            light.power = storage.power

            light.angle = storage.angle

            light.penumbra = storage.penumbra

            break

        case 'HemisphereLight':

            light.groundColor.set(storage.groundColor)

            break

        case 'RectAreaLight':

            light.width = storage.width

            light.height = storage.height

            light.rotation.set(storage.rotation.x, storage.rotation.y, storage.rotation.z)

            break

    }

}

/* 设置灯光类型面板 */
export function setLightTypePanel(light, folder) {

    switch (light.type) {

        case 'PointLight':

            folder.add(light, 'distance').name('距离')

            folder.add(light, 'decay').name('衰减')

            folder.add(light, 'power').name('功率')

            break

        case 'SpotLight':

            folder.add(light, 'distance').name('距离')

            folder.add(light, 'decay').name('衰减')

            folder.add(light, 'power').name('功率')

            folder.add(light, 'angle').name('角度')

            folder.add(light, 'penumbra').name('边缘')

            break

        case 'HemisphereLight':

            folder.addColor({ color: light.groundColor.getHex() }, 'color').name('基色').onChange(v => light.groundColor.set(v))

            break

        case 'RectAreaLight':

            folder.add(light.rotation, 'x').name('旋转X').min(-Math.PI / 2).max(Math.PI / 2)

            folder.add(light.rotation, 'y').name('旋转y').min(-Math.PI / 2).max(Math.PI / 2)

            folder.add(light.rotation, 'z').name('旋转z').min(-Math.PI / 2).max(Math.PI / 2)

            folder.add(light, 'width').name('宽度')

            folder.add(light, 'height').name('高度')

            break

    }

}