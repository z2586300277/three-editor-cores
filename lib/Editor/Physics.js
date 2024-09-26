import * as CANNON from 'cannon-es'
import { getObjectBox3 } from '../Api/ThreeApi.js'

const physics = {

    list: [],

    mass: 1,

}

export function setPhysicsPanel(PhysicsWorld, handler, folder) {

    const folderList = folder.addFolder('物理列表')

    folderList.open()

    folder.add(physics, 'mass', 0, 100).name('质量')

    folder.add({

        fn: () => {

            const { currentInfo } = handler

            if (!currentInfo) return

            let model = currentInfo.currentRootModel

            if (handler.mode == '根选择' && !model.physicsBody) {

                createPhysicsBody(PhysicsWorld, model, physics)

                physics.list.push(model)

                setPhysicsBodyPanel(model, folderList.addFolder(model.name + model.id))

            }

        }

    }, 'fn').name('为选中物体增加物理')

}

function setPhysicsBodyPanel(model, folder) {

    folder.open()

    folder.add(model, 'visible').name('显示')

    const { physicsBody } = model

    folder.add(physicsBody, 'isUpdate').name('更新').onChange(value => {


    })

}

function createPhysicsBody(PhysicsWorld, model, physics) {

    const { max, min, center } = getObjectBox3(model)

    const body = new CANNON.Body({

        mass: physics.mass,

        shape: new CANNON.Box(new CANNON.Vec3((max.x - min.x) / 2, (max.y - min.y) / 2, (max.z - min.z) / 2)),

        position: center,

    })

    let isUpdate = false

    Object.defineProperty(body, 'isUpdate', {

        get() {

            return isUpdate

        },

        set(value) {

            isUpdate = value

            body.position.copy(model.position)

            if (value) {

                body.joinRender = () => {

                    model.position.copy(body.position)

                }

            }

            else {

                delete body.joinRender

            }
        }

    })

    PhysicsWorld.addBody(body)

    model.physicsBody = body

    body.threeModel = model

    return body

}