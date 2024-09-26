import * as dat from 'dat.gui'

export function setMainPanel(proxy, autoPlace) {

    dat.GUI.TEXT_CLOSED = '收起场景配置'

    dat.GUI.TEXT_OPEN = '展开场景配置'

    const ProxyGUI = {

        open: () => ProxyGUI,

        close: () => ProxyGUI,

        destroy: () => ProxyGUI,

        add: () => ProxyGUI,

        remove: () => ProxyGUI,

        addFolder: () => ProxyGUI,

        removeFolder: () => ProxyGUI,

        addColor: () => ProxyGUI,

        removeColor: () => ProxyGUI,

        min: () => ProxyGUI,

        max: () => ProxyGUI,

        step: () => ProxyGUI,

        name: () => ProxyGUI,

        listen: () => ProxyGUI,

        onChange: () => ProxyGUI,

        onFinishChange: () => ProxyGUI,

        addFolder: () => ProxyGUI,

        updateDisplay: () => ProxyGUI,

        domElement: () => ProxyGUI,

    }

    const GUI = proxy ? ProxyGUI : new dat.GUI({ autoPlace })

    GUI.__closeButton?.remove()

    return GUI

}