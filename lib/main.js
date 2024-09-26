import * as THREE from 'three'
import gsap from 'gsap'
import { initScene } from './Scene/setScene'
import { sceneClick, rawSceneClick } from './Scene/SceneEvent'
import { getObjectViews, meshGroupCloneMaterial, setClassifyScene, getBestViewTarget, getDistanceScalePoint, createGsap, setGsapMeshAction, setSceneBackground, setEnvBackground, setBoxGeometry, meshChangeMaterial, groupChangeMaterial, meshChangeTransform, createCurveFrame, pointSyncTransform } from './Api/ThreeApi'

export { createSkySphereShader, createScanPlane, createOneHeatMap } from './Editor/Extra/Extra'
export { getLight } from './Editor/Basic/Light/LightChunk'

export class ThreeEditor {

  constructor(params) {

    // 初始化场景
    this.viewer = initScene(

      // HTML DOM容器
      params.threeBoxRef,

      // 渲染器参数传递
      params.rendererParams,

      // 场景参数传递
      params.sceneParams,

      // 存储事件回调
      (sceneParams, meshListParams) => params.saveEditorCallBack(sceneParams, meshListParams)

    )

    // 加载物体
    params.meshListParams?.map(i => this.setModelFromInfo(i.rootInfo, i.group))

    // 加载天空
    if (params.skyParams) {

      setSceneBackground(this.viewer.scene, params.skyParams)

      setEnvBackground(this.viewer.scene, params.skyParams)

    }

  }

  // THREE 对象
  THREE = THREE

  // GSAP 对象
  gsap = gsap

  // 设置 draco 压缩包路径
  static dracoPath = '/draco/'

  // 进度管理控制
  progressList = []

  // 点位同步变换
  pointSyncTransform = pointSyncTransform

  // 获取两点指定距离点
  getDistanceScalePoint = getDistanceScalePoint

  // 执行gsap 动作
  setGsapMeshAction = setGsapMeshAction

  // 获取最佳视角
  getBestViewTarget = getBestViewTarget

  // 克隆材质
  meshGroupCloneMaterial = meshGroupCloneMaterial

  // 渲染2D Dom 元素
  setCss2dDOM(DOM, position) {

    DOM.style.pointerEvents = 'auto'

    const { CSS2DObject, scene } = this.viewer

    const mesh = new CSS2DObject(DOM)

    mesh.position.copy(position)

    scene.add(mesh)

    mesh.destroy = () => scene.remove(mesh)

    return mesh

  }

  // 3D Dom 元素
  setCss3dDOM(DOM, position) {

    const { CSS3DObject, scene } = this.viewer

    const mesh = new CSS3DObject(DOM)

    mesh.position.copy(position)

    scene.add(mesh)

    mesh.destroy = () => scene.remove(mesh)

    return mesh

  }

  // 根据类型加载网格物体
  setModelFromInfo(rootInfo, params = null) {

    const loaderService = this.viewer.modelControls.sceneInsertModel(ThreeEditor.dracoPath, rootInfo, params)

    this.progressList.push({ loaderService, rootInfo, params })

    return { loaderService, rootInfo, params }

  }

  // 设置天空
  setSky(urls) {

    setSceneBackground(this.viewer.scene, urls)

  }

  // 设置环境贴图资源
  setGlobalEnvBackground(urls) {

    setEnvBackground(this.viewer.scene, urls)

  }

  // 设置点击事件
  getSceneEvent(event, callback = () => { }) {

    sceneClick(event, this.viewer, (e) => callback(e))

  }

  // 未加工的点击事件
  getRawSceneEvent() {

    return rawSceneClick(this.viewer)

  }

  // 设置GUI DOM 位置
  setGUIDomPosition(DOM) {

    if (!DOM || !this.viewer.GUI.domElement) return

    DOM.appendChild(this.viewer.GUI.domElement)

    return { GUIDom: this.viewer.GUI.domElement, remove: () => DOM.removeChild(this.viewer.GUI.domElement) }

  }

  // 创建路径动画
  setGsapAnimation(position, position_, gsapQuery) {

    return createGsap(position, position_, gsapQuery)

  }

  // 轮廓光选中
  setOutlinePass(meshList = []) {

    return this.viewer.Composer.effectPass.outlinePass.selectedObjects = meshList

  }

  // 保存场景
  saveSceneEditor() {

    return this.viewer.saveSceneEditor()

  }

  // 刷新GUI
  refreshGUI() {

    return this.viewer.GUI.updateDisplay?.()

  }

  // 获取场景编辑器截图
  getSceneEditorImage(params = []) {

    this.viewer.renderer.render(this.viewer.scene, this.viewer.camera)

    this.viewer.Composer.render()

    return this.viewer.renderer.domElement.toDataURL(...params)

  }

  // 设置场景控制模式
  setSceneControlMode(mode) {

    const { handler } = this.viewer

    handler.mode = mode

  }

  // 设置变换控制器属性
  setTransformControlsProperty(key, value) {

    const { transformControls } = this.viewer

    if (transformControls.hasOwnProperty(key)) transformControls[key] = value

  }

  // 设置操作选项
  setOperateOption(key, value) {

    this.viewer.handler.setHandlerOption(key, value)

  }

  // 播放模型动画
  setModelAnimationPlay(group) {

    if (!group?.animationPlayParams) return

    return this.viewer.modelControls.animationPlay(this.viewer.MixerList, group, group.animationPlayParams)

  }

  // 移除模型动画
  removeModelAnimation(group) {

    if (!group) return

    this.viewer.MixerList.splice(this.viewer.MixerList.findIndex(i => i == group), 1)

  }

  // 生成立方体
  setBoxGeometry(...args) {

    return setBoxGeometry(...args)

  }

  // 物体修改材质
  changeMeshMaterial(mesh, ...args) {

    return mesh.isMesh ? meshChangeMaterial(mesh, ...args) : groupChangeMaterial(mesh, ...args)

  }

  // 物体修改变形
  changeMeshTransform(mesh, ...args) {

    return meshChangeTransform(mesh, ...args)

  }

  // 获取场景所有曲线
  getSceneCurveList() {

    return this.viewer.scene.children.filter(i => i.isCurveMesh).map(i => ({

      path: i.curvePath || i.geometry?.parameters?.path,

      mesh: i

    }))

  }

  // 设置曲线动画
  setCurveAnimation(curve, speed = 1) {

    if (!curve) return

    return createCurveFrame(curve, speed, this.viewer.CommonFrameList)

  }

  // 设置场景分类
  setSceneFromClassify(type) {

    setClassifyScene(this.viewer.scene, type)

  }

  // 获取物体视图
  getObjectViews(object, fov = this.viewer.camera.fov) {

    return getObjectViews(object, fov)

  }

}
