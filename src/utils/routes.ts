import { RouteEdge } from "@/constants/routes"
import { AmapStep } from "@/constants/amap"

export function resolveSteps(steps: AmapStep[]): RouteEdge[] {
  let exitFlag = true
  const edges: RouteEdge[] = []
  let startIdx = 0
  let remainedSteps = steps
  while (exitFlag) {
    let waypointIdx = remainedSteps.findIndex((st) =>
      st.instruction.endsWith("途径地")
    )

    // 最后一段路，可以退出了
    if (waypointIdx < 0) {
      waypointIdx = steps.length - 1
      exitFlag = false
    }

    // 下一个搜索的起点，也是当前路段的完全结束点
    const nextStartIdx = waypointIdx + 1
    const currentSlices = remainedSteps.slice(startIdx, nextStartIdx) // 当前要处理的路段
    remainedSteps = remainedSteps.slice(nextStartIdx) // 还没有处理的路段

    // 当前阶段的各个数据
    const distance = currentSlices.reduce((prev, cur) => prev + cur.distance, 0)
    const time = currentSlices.reduce((prev, cur) => prev + cur.time, 0)
    const tolls = currentSlices.reduce((prev, cur) => prev + cur.tolls, 0)

    edges.push({
      distance,
      time,
      tolls,
      time_str: formatTime(time),
      distance_str: formatDistance(distance),
      tolls_str: formatTolls(tolls),
    })
  }

  return edges
}

export function formatDistance(distance: number) {
  return String((distance / 1000).toFixed(2))
}

export function formatTime(time: number) {
  return (time / 60 / 60).toFixed(2)
}

export function formatTolls(tolls: number) {
  return String(tolls)
}
