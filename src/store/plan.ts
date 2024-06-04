import { create } from "zustand"
import { immer } from "zustand/middleware/immer"

import { RouteNode } from "@/constants/routes"

interface PlanStore {
  routeNodes: RouteNode[]
  initDemoRoute: () => void
  updateRouteNode: (idx: number, node: Partial<RouteNode>) => void
}

export const usePlanStore = create<PlanStore>()(
  immer((set) => ({
    routeNodes: [] as RouteNode[],

    // TODO: should remove
    initDemoRoute: () => {
      set((state) => {
        state.routeNodes = [
          { lng: 0, lat: 0, keyword: "成都市", city: "成都" },
          { lng: 0, lat: 0, keyword: "天水", city: "天水" },
          { lng: 0, lat: 0, keyword: "兰州", city: "兰州" },
          { lng: 0, lat: 0, keyword: "西宁", city: "西宁" },
        ]
        return state
      })
      console.log("init down")
    },

    updateStartNode: (node: RouteNode) => {
      set((state) => {
        const prevNode = state.routeNodes[0]
        state.routeNodes[0] = {
          ...prevNode,
          ...node,
        }

        return state
      })
    },

    updateEndNode: (node: RouteNode) => {
      set((state) => {
        const prevNode = state.routeNodes[state.routeNodes.length - 1]
        state.routeNodes[state.routeNodes.length - 1] = {
          ...prevNode,
          ...node,
        }

        return state
      })
    },

    updateRouteNode: (idx: number, node: Partial<RouteNode>) => {
      set((state) => {
        console.log("update idx", idx, node)
        state.routeNodes[idx] = {
          ...state.routeNodes[idx],
          ...node,
        }
      })
    },

    removeRoutesNode: (idx: number) => {
      set((state) => {
        state.routeNodes.splice(idx, 1)
        return state
      })
    },
  }))
)
