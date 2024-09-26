import { getTransformInfo, setTransformInfo } from "../../Api/ThreeApi"

export const handlerHistory = {

    list: [],

    reList: [],

    index: -1

}

export function setHandlerHistory(transformControls) {

    transformControls.drag_change_callback = function (v) {

        handlerHistory.index = -1

        const { list, reList } = handlerHistory

        const { object } = transformControls

        if (v) {

            list.push({ object, transform: getTransformInfo(object) })

        }

        else {

            reList.push({ object, transform: getTransformInfo(object) })

        }

    }

    return handlerHistory

}

/* 恢复操作 */
export function restoreHistoryHandler(type) {

    const { list, reList, index } = handlerHistory

    if (type === 'z') {

        const record = list.at(index)

        if (record) {

            setTransformInfo(record.object, record.transform)

            handlerHistory.index -= 1

        }

    }

    else if (type === 'y') {

        if (index === -1) return

        const record = reList.at(index + 1)

        if (record) {

            setTransformInfo(record.object, record.transform)

            handlerHistory.index += 1

        }

    }

}