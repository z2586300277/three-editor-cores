import { setOrbitControlsAnimationPanel } from "./Animation/OrbitControlsAnimation";
import { setMeshAnimationPanel } from "./Animation/MeshAnimation";
import { setMoveAnimationPanel } from "./Animation/MoveAnimation";


export function setAnimationControlsPanel(handler, controls, transformControls, CommonFrameList, folder) {

    setOrbitControlsAnimationPanel(controls, folder.addFolder('视角控制'));

    setMeshAnimationPanel(handler, transformControls, folder.addFolder('物体动画'));

    setMoveAnimationPanel(handler, transformControls, CommonFrameList, folder.addFolder('运动动画'));

}
