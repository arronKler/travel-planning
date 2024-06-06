import { create } from "zustand"
import { immer } from "zustand/middleware/immer"

import { RouteNode } from "@/constants/routes"
import { getGeoCode } from "@/request/geo"

interface KC {
  keyword: string
  city: string
}

interface PlanStore {
  routeNodes: RouteNode[]
  smartKeywordsCity: KC[]

  replaceSmartKeywordsCity: (k: KC[]) => void
  driving: any
  updateDriving: (d: any) => void
  initDemoRoute: () => void
  updateRouteNode: (idx: number, node: Partial<RouteNode>) => void
  setRouteNodes: (k: string[]) => Promise<void>
  replaceRouteNodes: (r: RouteNode[]) => void
}

export const usePlanStore = create<PlanStore>()(
  immer((set) => ({
    routeNodes: [] as RouteNode[],
    driving: null,
    smartKeywordsCity: [] as KC[],

    replaceRouteNodes: (nodes: RouteNode[]) => {
      set((state) => {
        state.routeNodes = nodes
      })
    },

    // TODO: should remove
    initDemoRoute: async () => {
      const demoRoutes = [
        { lng: 0, lat: 0, keyword: "成都市", city: "成都" },
        { lng: 0, lat: 0, keyword: "天水", city: "天水" },
        { lng: 0, lat: 0, keyword: "兰州", city: "兰州" },
        { lng: 0, lat: 0, keyword: "西宁", city: "西宁" },
      ]

      const geoCodesRequests = []
      // @ts-ignore
      for (const route of demoRoutes) {
        // set((state) => {
        //   state.routeNodes.push({
        //     ...node,
        //   })
        // })
        geoCodesRequests.push(getGeoCode(route.keyword, route.city))
      }
      const codes = await Promise.all(geoCodesRequests)
      const demoRoutesWithCodes = demoRoutes.map((route, idx) => {
        const [lng, lat] = codes[idx][0].location.split(",")
        return {
          ...route,
          lng: lng,
          lat: lat,
        }
      })

      set((state) => {
        console.log("init down", demoRoutesWithCodes)
        state.routeNodes = demoRoutesWithCodes
      })
    },

    setRouteNodes: async (keywords: string[]) => {
      const demoRoutes = keywords.map((k) => ({
        lng: 0,
        lat: 0,
        keyword: k,
        city: "成都",
      }))

      const geoCodesRequests = []

      // @ts-ignore
      for (const route of demoRoutes) {
        geoCodesRequests.push(getGeoCode(route.keyword, route.city))
      }
      const codes = await Promise.all(geoCodesRequests)
      const demoRoutesWithCodes = demoRoutes.map((route, idx) => {
        const [lng, lat] = codes[idx][0].location.split(",")
        return {
          ...route,
          lng: lng,
          lat: lat,
        }
      })

      set((state) => {
        state.routeNodes = demoRoutesWithCodes
      })
    },

    updateStartNode: (node: RouteNode) => {
      set((state) => {
        const prevNode = state.routeNodes[0]
        state.routeNodes[0] = {
          ...prevNode,
          ...node,
        }
      })
    },

    updateEndNode: (node: RouteNode) => {
      set((state) => {
        const prevNode = state.routeNodes[state.routeNodes.length - 1]
        state.routeNodes[state.routeNodes.length - 1] = {
          ...prevNode,
          ...node,
        }
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
      })
    },

    updateDriving: (driving: any) => {
      set((state) => {
        state.driving = driving
      })
    },

    replaceSmartKeywordsCity: (kc: KC[]) => {
      set((state) => {
        state.smartKeywordsCity = kc
      })
    },
  }))
)
