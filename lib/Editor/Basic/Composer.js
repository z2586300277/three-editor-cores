import { getUnrealBloomPassStorage, setUnrealBloomPassStorage, setUnrealBloomPassPanel } from './Composer/UnrealBloomPass.js'
import { getOutlinePassStorage, setOutlinePassStorage, setOutlinePassPanel } from './Composer/OutlinePass.js'
import { getFxaaPassStorage, setFxaaPassStorage, setFxaaPassPanel } from './Composer/FxaaPass.js'
import { getScreenMaskPassStorage, setScreenMaskPassStorage, setScreenMaskPassPanel } from './Composer/ScreenMaskPass.js'
import { getSsrPassStorage, setSsrPassStorage, setSsrPassPanel } from './Composer/SsrPass.js'
import { getSaoPassStorage, setSaoPassStorage, setSaoPassPanel } from './Composer/SaoPass.js'

export function getComposerStorage(Composer) {

    const { unrealBloomPass, outlinePass, fxaaPass, screenMaskPass, ssrPass, saoPass } = Composer.effectPass

    return {

        renderWay: Composer.renderWay,

        saoPass: getSaoPassStorage(saoPass),

        unrealBloomPass: getUnrealBloomPassStorage(unrealBloomPass),

        outlinePass: getOutlinePassStorage(outlinePass),

        fxaaPass: getFxaaPassStorage(fxaaPass),

        screenMaskPass: getScreenMaskPassStorage(screenMaskPass),

        ssrPass: getSsrPassStorage(ssrPass)

    }

}

export function setComposerStorage(Composer, storage) {

    if (!storage) return

    const { saoPass, unrealBloomPass, outlinePass, fxaaPass, screenMaskPass, ssrPass } = Composer.effectPass

    Composer.setRenderWay(storage.renderWay)

    setSaoPassStorage(saoPass, storage.saoPass)

    setUnrealBloomPassStorage(unrealBloomPass, storage.unrealBloomPass)

    setOutlinePassStorage(outlinePass, storage.outlinePass)

    setFxaaPassStorage(fxaaPass, storage.fxaaPass)

    setScreenMaskPassStorage(screenMaskPass, storage.screenMaskPass)

    setSsrPassStorage(ssrPass, storage.ssrPass)

}

export function setComposerPanel(Composer, folder) {

    const { saoPass, unrealBloomPass, outlinePass, fxaaPass, screenMaskPass, ssrPass } = Composer.effectPass

    folder.add(Composer, 'renderWay', ['源渲染', '效果渲染']).name('渲染方式').onChange(v => Composer.setRenderWay(v))

    setSaoPassPanel(saoPass, folder.addFolder('环境光遮蔽配置'))

    setUnrealBloomPassPanel(unrealBloomPass, folder.addFolder('泛光配置'))

    setOutlinePassPanel(outlinePass, folder.addFolder('轮廓光配置'))

    setFxaaPassPanel(fxaaPass, folder.addFolder('抗锯齿配置'))

    setScreenMaskPassPanel(screenMaskPass, folder.addFolder('屏幕遮罩配置'))

    setSsrPassPanel(ssrPass, folder.addFolder('屏幕空间反射配置'))

}
