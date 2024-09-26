import { setMixerAnimation, runMixerAction } from '../../Api/ThreeApi'

/* 动画配置还原 */
export function setGroupAnimationStorage(MixerList, group, storage) {

    if (!storage) return

    group.animationPlayParams = storage

    storage.initPlay && animationPlay(MixerList, group, storage)

}

/* 动画配置面板 */
export function setGroupAnimationPanel(MixerList, group, folder) {

    if (!group.animationPlayParams) return

    // 动画参数控制
    folder.add(group.animationPlayParams, 'initPlay').name('初始加载播放')

    folder.add(group.animationPlayParams, 'speed').min(-10).max(10).name('播放速度')

    folder.add(group.animationPlayParams, 'startTime').name('开始时间')

    folder.add(group.animationPlayParams, 'loop').name('循环播放')

    const actionsFolder = folder.addFolder('播放列表')

    group.animations.map((i, k) => actionsFolder.add(group.animationPlayParams.actionIndexs, k).name(i.name + ':' + i.duration.toFixed(2) + 's'))

    actionsFolder.add({ fn: () => animationPlay(MixerList, group, group.animationPlayParams) }, 'fn').name('播放选择动作')

}

/* 动画播放 */
export function animationPlay(MixerList, group, query) {

    const mixer = setMixerAnimation(group, () => query.frameCallback)

    const actions = query.actionIndexs.map((i, k) => i && runMixerAction(mixer, group.animations[k], query.speed, query.startTime, query.loop).play()).filter(i => i)

    !MixerList.find(i => i === group) && MixerList.push(group)

    return { actions, mixer }

}