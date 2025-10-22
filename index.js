
import { ThreeEditor } from './lib/main.js'
import { createSkySphereShader, createScanPlane, getLight, createOneHeatMap } from './lib/main.js'

ThreeEditor.dracoPath = '/draco/'

let threeEditor

createScene()

window.onresize = () => threeEditor.viewer.renderSceneResize()

// 作者链接信息交互
const authorLinkElement = document.querySelector('#authorLink')
if (authorLinkElement) {
  // 添加悬停效果
  authorLinkElement.addEventListener('mouseenter', () => {
    authorLinkElement.style.background = 'rgba(0,0,0,0.9)'
    authorLinkElement.style.transform = 'scale(1.05)'
    authorLinkElement.style.transition = 'all 0.3s ease'
  })
  
  authorLinkElement.addEventListener('mouseleave', () => {
    authorLinkElement.style.background = 'rgba(0,0,0,0.7)'
    authorLinkElement.style.transform = 'scale(1)'
  })
}

// 初始化函数
function createScene() {

  threeEditor = new ThreeEditor({

    threeBoxRef: document.querySelector('#threeBox'),

    rendererParams: {

      fps: null,

      pixelRatio: window.devicePixelRatio * 1.5,

      webglRenderParams: { antialias: true, alpha: true, logarithmicDepthBuffer: true },

      userPermissions: { autoPlace: true, proxy: false }

    },

    sceneParams: JSON.parse(localStorage.getItem('sceneParams')),

    meshListParams: JSON.parse(localStorage.getItem('meshListParams')),

    skyParams: JSON.parse(localStorage.getItem('skyParams')),

    saveEditorCallBack: (sceneParams, meshListParams) => {

      localStorage.setItem('sceneParams', JSON.stringify(sceneParams))

      localStorage.setItem('meshListParams', JSON.stringify(meshListParams))

    }

  })

}

// 模型加载进度监听
let controlsIsActived = false

threeEditor.viewer.controls.addEventListener('start', (v) => controlsIsActived = true)

threeEditor.viewer.controls.addEventListener('end', (v) => controlsIsActived = false)

threeEditor.progressList.forEach(e => {

  e.loaderService.complete = (m) => {

    if (e.params.name !== '机房') return

    const { raycaster, getIntersects } = threeEditor.getRawSceneEvent()

    raycaster.far = 100

    let mesh_group = null

    let timer = null

    document.querySelector('#threeBox').addEventListener('mousemove', (e) => {

      if (controlsIsActived) return

      if (timer) return

      timer = setTimeout(() => timer = null, 20)

      const intersects = getIntersects(e, m.children)

      const i = intersects.find((i) => i.object.text !== 'TransformControls' && i.object.isMesh)

      if (!i) return

      mesh_group?.meshRevertMaterial?.()

      mesh_group = i.object.parent

      threeEditor.setOutlinePass([mesh_group])

      if (!mesh_group.isCloneMaterial) threeEditor.meshGroupCloneMaterial(mesh_group)

      threeEditor.changeMeshMaterial(mesh_group, { emissive: 'blue', emissiveIntensity: 0.2, transparent: true, opacity: 0.2, depthTest: true, depthWrite: false })

    })

  }

})

// 地图浮动监听 材质 形状修改
let currnetMeshName = null

let meshs = []

threeEditor.viewer.chartsMapControls.geoGroupAllLoadedCall = () => { }

threeEditor.viewer.chartsMapControls.geoGroupLoadCall = (group) => {

  if (group.name !== '带事件') return

  const { getIntersects } = threeEditor.getRawSceneEvent()

  document.querySelector('#threeBox').addEventListener('mousemove', (e) => {

    const i = getIntersects(e, group.children).find((i) => i.object.text !== 'TransformControls' && i.object.isMesh)

    if (!i) return meshs.forEach(i => {

      i?.meshRevertMaterial()

      i?.meshRevertTransform()

    })

    if (currnetMeshName === i.object.name) return

    currnetMeshName = i.object.name

    meshs.forEach(i => {

      i?.meshRevertMaterial()

      i?.meshRevertTransform()

    })

    meshs = group.children.filter(j => j.name === i.object.name)

    meshs.forEach(i => {

      threeEditor.changeMeshTransform(i, { scale: { x: 1, y: 1, z: 5 } })

      threeEditor.changeMeshMaterial(i, { color: '#fff', opacity: 1 })

    })

  })

}

// 点击信息模式事件监听
document.querySelector('#threeBox').addEventListener('dblclick', (e) => {

  threeEditor.getSceneEvent(e, (info) => {

    threeEditor.setCss2dDOM(document.querySelector('#myDom'), info.point).scale.set(0.01, 0.01, 0.01)

    if (info.mode === '点击信息') {

      const { camera, controls } = threeEditor.viewer

      const p = threeEditor.getDistanceScalePoint(camera.position, info.point, 0.9)

      threeEditor.setGsapAnimation(camera.position, p)

      threeEditor.setGsapAnimation(controls.target, info.point)

    }

  })

})

const HOST = 'https://z2586300277.github.io/3d-file-server/'

const data = [

  { name: '天空', type: 'SKY', getUrls: (k) => [1, 2, 3, 4, 5, 6].map(i => HOST + 'files/sky/skyBox0/' + i + '.png'), getRandom: () => Math.floor(Math.random() * 10) },
 
  { type: 'GLTF', url: HOST + 'files/model/Fox.glb' },

  { type: 'FBX', url: HOST + 'models/fbx/shanghai.FBX' },

  { type: 'OBJ', url: HOST + 'files/model/house/house.obj' },

]

const skyUrls = () => data[0].getUrls(data[0])

window.add = (k) => {

  if (k === 0) threeEditor.setSky(skyUrls())

  else if ([1, 2, 3].includes(k)) threeEditor.setModelFromInfo(data[k]).loaderService.progress = e => console.log()

  else if (k === 6) threeEditor.setGUIDomPosition(document.querySelector('#panel'))

  else if (k === 7) threeEditor.setGsapAnimation()

  else if (k === 8) localStorage.setItem('skyParams', JSON.stringify(skyUrls()))

  else if (k === 9) threeEditor.viewer.scene.background = null

  else if (k === 11) threeEditor.setGlobalEnvBackground(skyUrls())

  else if (k === 12) threeEditor.saveSceneEditor()

  else if (k === 13) threeEditor.refreshGUI()

  else if (k === 14) {

    const base64 = threeEditor.getSceneEditorImage(['image/png', '0.8'])

    const link = document.createElement('a');

    link.href = base64;

    link.download = 'myImage.png';

    link.click();

  }

  else if (k === 15) threeEditor.setTransformControlsProperty('mode', 'translate')

  else if (k === 16) threeEditor.setOperateOption('grid', Math.random() > 0.5 ? true : false)

  else if (k === 17) threeEditor.setOperateOption('stats', Math.random() > 0.5 ? true : false)

  else if (k === 18) threeEditor.setOperateOption('openKey', Math.random() > 0.5 ? true : false)

  else if (k === 19) threeEditor.setOperateOption('axes', Math.random() > 0.5 ? true : false)

  else if (k === 20) {

    const model = threeEditor.viewer.currentInfo?.currentRootModel

    const _actions = Math.random() > 0.5 ? [1, 3, 5, 7] : [2, 4, 6, 8]

    model.animationPlayParams.speed = 0.2

    model.animationPlayParams.actionIndexs.forEach((_, k, arr) => arr[k] = _actions.includes(k))

    const { mixer, actions } = threeEditor.setModelAnimationPlay(model)

    setTimeout(() => {

      actions.forEach(i => i.stop())

    }, 2000)

    mixer.addEventListener('finished', (e) => console.log(123));

  }

  else if (k === 21) playActions.forEach(i => i.paused = !i.paused)

  else if (k === 22) playActions.forEach(i => i.stop())

  else if (k === 23) threeEditor.removeModelAnimation(threeEditor.viewer.currentInfo?.currentRootModel)

  else if (k === 24) {

    const { getTransformedVector } = threeEditor.viewer.currentInfo?.currentRootModel

    threeEditor.viewer.currentInfo?.currentRootModel.children.forEach(i => {

      if (i.geoInfo?.properties?.centroidCoord3) {

        const dom = document.createElement('div')

        dom.style.color = '#fff'

        dom.innerText = i.geoInfo?.properties?.name

        const m = threeEditor.setCss2dDOM(dom, getTransformedVector(i.geoInfo?.properties.centroidCoord3))

        m.scale.multiplyScalar(1)

        dom.style.pointerEvents = 'none'

      }

    })

  }

  else if (k === 27) threeEditor.setSceneControlMode('选择')

  else if (k === 28) console.log(threeEditor.getSceneCurveList())

  else if (k === 29) {

    const { mesh, path } = threeEditor.getSceneCurveList()[0]

    const curveAnimate = threeEditor.setCurveAnimation(path, 1)

    const mesh1 = threeEditor.viewer.scene.getObjectByName('运动')

    curveAnimate.frameCallback = p => {

      mesh1.position.copy(threeEditor.pointSyncTransform(p, mesh))

      threeEditor.viewer.controls.target.copy(mesh1.position)

    }

    curveAnimate.start()

  }

  else if (k === 30) {

    const mesh = threeEditor.viewer.scene.getObjectByName('大楼')

    const { transformAnimationList } = mesh

    transformAnimationList.forEach((i, k) => {

      setTimeout(() => {

        threeEditor.setGsapMeshAction(mesh, i._transformInfo, i.transformInfo_, i.gsapParams)

      }, k * 2000)

    })

  }

  else if (k === 31) {

    const { camera, controls } = threeEditor.viewer

    const [end, start] = controls.viewAngleList

    setGsapAnimationLook(start).then(() => {

      threeEditor.setSceneFromClassify('场景2')

      threeEditor.setSky(skyUrls())

      setGsapAnimationLook(end)

    })

    function setGsapAnimationLook(viewAngle) {

      return Promise.all([

        new Promise((resolve) => threeEditor.setGsapAnimation(camera.position, viewAngle.position, { duration: 2, onComplete: resolve })),

        new Promise((resolve) => threeEditor.setGsapAnimation(controls.target, viewAngle.target, { duration: 2, onComplete: resolve }))

      ])

    }

  }

  else if (k === 32) threeEditor.viewer.destroySceneRender()

  else if (k === 33) createScene()

  else if (k === 34) {

    const mesh = createOneHeatMap()

    threeEditor.viewer.scene.add(mesh)

    const { THREE } = threeEditor

    const arr = [[0., 0., 10.], [.2, .6, 5.], [.25, .7, 8.], [.33, .9, 5.], [.35, .8, 6.], [0.017, 5.311, 6.000], [-.45, .8, 4.], [-.2, -.6, 5.], [-.25, -.7, 8.], [-.33, -.9, 8.], [.35, -.45, 10.], [-.1, -.8, 10.], [.33, -.3, 5.], [-.35, .75, 6.], [.6, .4, 10.], [-.4, -.8, 4.], [.7, -.3, 6.], [.3, -.8, 8.]].map(i => new THREE.Vector3(...i))

    mesh.uniforms.hasUv.value = true

    let k = 0

    setInterval(() => {

      k == arr.length ? k = 1 : k++

      mesh.uniforms.Points.value = arr.slice(0, k)

      mesh.uniforms.PointsCount.value = k

      mesh.updateShaderProgram()

    }, 300)

    mesh.updateShaderProgram()

  }

  else if (k === 35) {

    const m = threeEditor.viewer.scene.getObjectByName('视图')

    const { camera, controls } = threeEditor.viewer

    const { frontView, target } = threeEditor.getObjectViews(m)

    return Promise.all([

      new Promise((resolve) => threeEditor.setGsapAnimation(camera.position, frontView, { duration: 2, onComplete: resolve })),

      new Promise((resolve) => threeEditor.setGsapAnimation(controls.target, target, { duration: 2, onComplete: resolve }))

    ])
    

  }

}

function listFiles(url) {
  function parseFileList(html) {
    const fileList = []
    const regex = /<a href="([^"]+)">([^<]+)<\/a>\s+(\d{2}-[A-Za-z]{3}-\d{4} \d{2}:\d{2})\s+(\d+)/g
    let match
    while ((match = regex.exec(html)) !== null) fileList.push({ name: match[2], url: match[1], created: new Date(match[3]), size: parseInt(match[4]) })
    return fileList
  }
  const xhr = new XMLHttpRequest()
  xhr.open('GET', url)
  xhr.send()
  return new Promise((resolve, reject) => xhr.onload = () => xhr.status === 200 ? resolve(parseFileList(xhr.responseText)) : reject(xhr.statusText))
}