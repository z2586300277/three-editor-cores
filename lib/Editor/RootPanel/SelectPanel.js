import { createSelectMeshPanel } from './Select/SelectMesh'
import { createSelectRootGroupPanel } from './Select/SelectRootGroup'

/* 选择子物体 */
export function setSelectPanel(scene, renderer, ShaderList, DOM, CommonFrameList, GUI) {

    GUI.createSelectMeshPanel = model => {

        destoryFolder()

        createSelectMeshPanel(scene, renderer, ShaderList, DOM, CommonFrameList, model, GUI)

    }

    GUI.createSelectRootGroupPanel = (model) => {

        destoryFolder()

        createSelectRootGroupPanel(ShaderList, DOM, model, GUI, m => {

            if (m.isMesh) GUI.createSelectMeshPanel(m)

        })

    }

    function destoryFolder() {

        if (GUI.selectPanel) {

            GUI.removeFolder(GUI.selectPanel)

            GUI.selectPanel = null

        }

    }

}

