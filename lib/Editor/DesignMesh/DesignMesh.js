import { createMirror, setMirrorPanel } from './Mirror'

export const designMeshTypeList = [

    { name: '镜面', createFunc: createMirror, setPanel: setMirrorPanel }

]

const designTypeNameList = designMeshTypeList.map(i => i.name)

export function setDesignPanel(scene, renderer, DOM, model, folder) {

    if (!model.designPrograms) {

        model.designPrograms = {

            designProgramsCodeName: '',

            isDesignPrograms: false,

            designParams: null

        }

    }

    folder.add(model.designPrograms, 'isDesignPrograms').name('开启设计').onChange(v => {

        if (v) {

            const { geometry } = model

            const mesh = createMirror(geometry, { renderer, DOM })

            mesh.position.copy(model.position)

            mesh.rotation.copy(model.rotation)

            mesh.scale.copy(model.scale)

            model.visible = false

            scene.add(mesh)

        }

    })

    folder.add(model.designPrograms, 'designProgramsCodeName', designTypeNameList).name('设计标码')

}