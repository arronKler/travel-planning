"use client"

import { getGeoCode } from "@/request/geo"
import { usePlanStore } from "@/store/plan"
import { resolveSteps } from "@/utils/routes"
import AMapLoader from "@amap/amap-jsapi-loader"
import { useEffect, useState } from "react"

export function MapComp() {
  const [amapLoaded, setAmapLoaded] = useState(false)
  const [amap, setAmap] = useState<any>()

  const { routeNodes, initDemoRoute, updateRouteNode } = usePlanStore()

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
    initDemoRoute()

    async function load() {
      await getGeoCode("北京市朝阳区阜通东大街6号", "成都")
      await getGeoCode("天水", "天水")
    }
    load()
  }, [])

  useEffect(() => {
    if (!amap) return
    if (routeNodes && routeNodes.length > 0) {
      // @ts-ignore
      AMap.plugin(["AMap.Driving"], function () {
        // @ts-ignore
        const driving = new AMap.Driving({
          map: amap,
          extentions: "all",
        })
        //获取起终点规划线路
        /* const points = routeNodes.map((node) => ({
          keyword: node.keyword,
          city: node.city,
        })) */

        const startLngLat = [116.379028, 39.865042] //起始点坐标
        const endLngLat = [105.724828, 34.581514] //终点坐标
        const points = [startLngLat, endLngLat]
        console.log("print points", points)
        driving.search(
          startLngLat,
          endLngLat,
          function (status: any, result: any) {
            if (status === "complete") {
              //status：complete 表示查询成功，no_data 为查询无结果，error 代表查询错误
              //查询成功时，result 即为对应的驾车导航信息
              console.log(result)
              const allSteps = result.routes[0].steps
              const edges = resolveSteps(allSteps)
              console.log("get edges", edges)

              edges.forEach((edge, idx) => {
                updateRouteNode(idx, { edge })
              })
            } else {
              console.log("获取驾车数据失败：" + result)
            }
          }
        )
      })
    }
  }, [amap])

  return (
    <>
      <div id="container" className="h-full" />
    </>
  )
}
