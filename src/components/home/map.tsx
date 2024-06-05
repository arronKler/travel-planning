"use client"

import { getGeoCode } from "@/request/geo"
import { resolveSteps } from "@/utils/routes"
import { usePlanStore } from "@/store/plan"
import AMapLoader from "@amap/amap-jsapi-loader"
import { useEffect, useState } from "react"
import { resolveRoutesForSearch } from "@/utils/routes"

export function MapComp() {
  const [amapLoaded, setAmapLoaded] = useState(false)
  const [amap, setAmap] = useState<any>()

  const { routeNodes, initDemoRoute, updateDriving } = usePlanStore()

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("@amap/amap-jsapi-loader").then((AMapLoader) => {
        // @ts-ignore
        window._AMapSecurityConfig = {
          securityJsCode: "9121756cb285025b388a7f1f0e7b8a41",
        }

        AMapLoader.load({
          key: "d1478fde69a16e6deab71cb621a7f79f",
          version: "2.0",
        }).then(() => {
          setAmapLoaded(true)

          //   @ts-ignore
          const amapObj = new AMap.Map("container", {
            // 设置地图容器id
            viewMode: "3D", // 是否为3D地图模式
            zoom: 5, // 初始化地图级别
            center: [105.602725, 22.076636], // 初始化地图中心点位置
          })

          setAmap(amapObj)
        })
      })
    }
  }, [])

  useEffect(() => {
    // initDemoRoute()
    console.log(process.env.API_KEY)
  }, [])

  useEffect(() => {
    if (!amap) return

    // @ts-ignore
    AMap.plugin(["AMap.Driving"], function () {
      // @ts-ignore
      const driving = new AMap.Driving({
        map: amap,
        extentions: "all",
      })

      console.log("init driving", driving)
      //获取起终点规划线路
      /* const points = routeNodes.map((node) => ({
          keyword: node.keyword,
          city: node.city,
        })) */

      // const startLngLat = [116.379028, 39.865042] //起始点坐标
      // const endLngLat = [105.724828, 34.581514] //终点坐标

      // const points = [startLngLat, endLngLat]

      updateDriving(driving)
    })
  }, [amap])

  return (
    <>
      <div id="container" className="h-full" />
    </>
  )
}
