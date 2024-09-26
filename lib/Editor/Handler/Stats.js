export const stats = {

    showStats: false,

    statsMode: 0,

}

/* 获取stats 存储值 */
export function getStatsStorage(stats) {

    const { showStats, statsMode } = stats

    return {

        showStats,

        statsMode

    }

}

/* 设置stats 存储值 */
export function setStatsStorage(Stats, stats, storage) {

    if (!storage) return

    const { showStats, statsMode } = storage

    stats.showStats = showStats

    stats.statsMode = statsMode

    resolveStats(Stats, stats)

}

/* 设置stats 面板 */
export function setStatsPanel(Stats, stats, folder) {

    folder.add(stats, 'showStats').name('开启').listen().onChange(() => resolveStats(Stats, stats))

    folder.add(stats, 'statsMode', [0, 1, 2]).name('模式').listen().onChange(() => resolveStats(Stats, stats))

}

/* 设置stats */
export function resolveStats(Stats, stats) {

    if (stats.showStats) {

        Stats.setStats()

        Stats.setMode(Number(stats.statsMode))

    } else {

        Stats.destroy()

    }

}
