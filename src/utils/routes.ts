import { RouteEdge, RouteNode } from "@/constants/routes"
import { AmapStep } from "@/constants/amap"

export function resolveSteps(steps: AmapStep[]): RouteEdge[] {
  let exitFlag = true
  const edges: RouteEdge[] = []
  let startIdx = 0
  let remainedSteps = steps
  while (exitFlag) {
    let waypointIdx = remainedSteps.findIndex((st) =>
      st.instruction.includes("到达途经地")
    )
    console.log("waypoint", waypointIdx)

    // 最后一段路，可以退出了
    if (waypointIdx < 0) {
      waypointIdx = remainedSteps.length - 1
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

export function calculateTotalTolls(steps: AmapStep[]): string {
  return formatTolls(steps.reduce((prev, step) => prev + step.tolls, 0))
}

export function calculateTotalDistance(steps: AmapStep[]): {
  distance: string
  predict_gas: string
} {
  const distance = formatDistance(
    steps.reduce((prev, step) => prev + step.distance, 0)
  )
  return {
    distance: distance,
    predict_gas: ((Number(distance) / 800) * 500).toFixed(2),
  }
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

export function resolveRoutesForSearch(routeNodes: RouteNode[]) {
  const length = routeNodes.length
  console.log("routenodes", routeNodes)
  if (length < 2) {
    throw new Error("Not valid routes")
  }
  if (length == 2) {
    return {
      start: formatRouteSearch(routeNodes[0]),
      end: formatRouteSearch(routeNodes[1]),
    }
  }

  return {
    start: formatRouteSearch(routeNodes[0]),
    end: formatRouteSearch(routeNodes[length - 1]),
    waypoints: routeNodes
      .slice(1, length - 1)
      .map((node) => formatRouteSearch(node)),
  }
}

export function formatRouteSearch(routeNode: RouteNode) {
  return [Number(routeNode.lng), Number(routeNode.lat)]
}
