"use client"
import { usePlanStore } from "@/store/plan"
import { Button, Textarea } from "@nextui-org/react"
import { RouteNode } from "@/constants/routes"
import { resolveRoutesForSearch } from "@/utils/routes"
import { getGeoCode } from "@/request/geo"
import { resolveSteps } from "@/utils/routes"
import { useState } from "react"
import { produce } from "immer"
import { Input } from "@nextui-org/react"

export function PlanList() {
  const [routeNodes, driving, updateRouteNode, replaceRouteNodes] =
    usePlanStore((state) => [
      state.routeNodes,
      state.driving,
      state.updateRouteNode,
      state.replaceRouteNodes,
    ])

  const [loading, setLoading] = useState(false)

  const [keywords, setKeywords] = useState<string[]>(["", "", ""])

  const updateKeywords = (idx: number, keyword: string) => {
    setKeywords(
      produce((state) => {
        state[idx] = keyword
      })
    )
  }

  const addOne = (idx: number) => {
    setKeywords(
      produce((state) => {
        state.splice(idx + 1, 0, "")
      })
    )
  }

  const removeOne = (idx: number) => {
    setKeywords(
      produce((state) => {
        state.splice(idx, 1)
      })
    )
  }

  const planIt = async () => {
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

    replaceRouteNodes(demoRoutesWithCodes)
    setLoading(true)

    const { start, end, waypoints } =
      resolveRoutesForSearch(demoRoutesWithCodes)

    driving.search(
      start,
      end,
      { waypoints: waypoints },
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

        setLoading(false)
      }
    )
  }

  return (
    <>
      <div className="w-96">
        {keywords.map((keyword, idx) => {
          return (
            <div className="" key={idx}>
              <section className=" border border-black rounded-3xl py-1 px-2">
                {/* <span></span> */}
                <Input
                  value={keyword}
                  onValueChange={(val: string) => updateKeywords(idx, val)}
                ></Input>
                <Button onClick={() => addOne(idx)}>加一</Button>
                {keywords.length > 2 && (
                  <Button onClick={() => removeOne(idx)}>减一</Button>
                )}
              </section>
              {routeNodes[idx]?.edge && (
                <section className="flex rounded flex-col items-center">
                  <div className="border-r border-r-black border-dashed h-10"></div>
                  <div>
                    <span className="border-r border-r-black mr-1 pr-1">
                      距离: {routeNodes[idx]?.edge?.distance_str} 米
                    </span>
                    <span className="border-r border-r-black mr-1 pr-1">
                      路费: {routeNodes[idx]?.edge?.tolls_str} 元
                    </span>
                    <span>时间: {routeNodes[idx]?.edge?.time_str}</span>
                  </div>
                  <div className="border-r border-r-black border-dashed h-10"></div>
                </section>
              )}
            </div>
          )
        })}
      </div>
      <Button color="primary" onClick={planIt} isLoading={loading}>
        帮我规划
      </Button>
    </>
  )
}
