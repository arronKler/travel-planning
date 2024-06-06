"use client"
import { usePlanStore } from "@/store/plan"
import { Button, Textarea } from "@nextui-org/react"
import { RouteNode } from "@/constants/routes"
import { calculateTotalDistance, resolveRoutesForSearch } from "@/utils/routes"
import { getGeoCode } from "@/request/geo"
import { resolveSteps } from "@/utils/routes"
import { useState, useEffect } from "react"
import { produce } from "immer"
import { Input } from "@nextui-org/react"
import { calculateTotalTolls } from "@/utils/routes"

export function PlanList() {
  const [keywords, setKeywords] = useState<string[]>(["", "", ""])
  const [
    routeNodes,
    driving,
    updateRouteNode,
    replaceRouteNodes,
    smartKeywordsCity,
  ] = usePlanStore((state) => [
    state.routeNodes,
    state.driving,
    state.updateRouteNode,
    state.replaceRouteNodes,
    state.smartKeywordsCity,
  ])

  useEffect(() => {
    const nodesStr = localStorage.getItem("draft")
    if (nodesStr) {
      const nodes = JSON.parse(nodesStr)
      // replaceRouteNodes(nodes)
      // console.log("nodes", nodesStr, nodes)
      setKeywords(nodes)
    }
  }, [])

  const [total, setTotal] = useState<{
    tolls: string
    distance: string
    predict_gas: string
  }>({ tolls: "0", distance: "0", predict_gas: "0" })

  const [loading, setLoading] = useState(false)

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

    localStorage.setItem("draft", JSON.stringify(keywords))

    const geoCodesRequests = []

    // @ts-ignore
    for (const route of demoRoutes) {
      geoCodesRequests.push(getGeoCode(route.keyword, route.city))
    }
    const codes = await Promise.all(geoCodesRequests)
    console.log("codes", codes)
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

          const { predict_gas, distance } = calculateTotalDistance(edges as any)
          setTotal({
            tolls: calculateTotalTolls(edges as any),
            distance,
            predict_gas,
          })
        } else {
          console.log("获取驾车数据失败：" + result)
        }

        setLoading(false)
      }
    )
  }

  const exportPlan = () => {
    let planStr = ""
    // @ts-ignore
    for (const [idx, node] of routeNodes
      .slice(0, routeNodes.length - 1)
      .entries()) {
      console.log("idx, ", idx, node)
      planStr += `第 ${idx + 1} 段: 【${node.keyword} - ${
        routeNodes[idx + 1].keyword
      }】距离 ${node.edge.distance_str} 公里, 开车时间 ${
        node.edge.time_str
      } 小时\n`
    }

    console.log(planStr)
  }

  const [autoPlan, setAutoPlan] = useState(false)
  useEffect(() => {
    console.log("go smart", smartKeywordsCity)
    if (smartKeywordsCity.length > 0) {
      console.log(
        "let words",
        smartKeywordsCity.map((kc) => kc.keyword)
      )
      setKeywords(smartKeywordsCity.map((kc) => kc.keyword))
      setAutoPlan(true)
      // setTimeout(() => {
      //   planIt()
      // }, 0)
    }
  }, [smartKeywordsCity])

  useEffect(() => {
    if (autoPlan) {
      planIt()
      setAutoPlan(false)
    }
  }, [autoPlan, planIt])

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
                <section className="flex rounded flex-col items-center text-sm">
                  <div className="border-r border-dashed h-4"></div>
                  <div>
                    <span className="border-r mr-1 pr-1">
                      距离: {routeNodes[idx]?.edge?.distance_str} 公里
                    </span>
                    <span className="border-r mr-1 pr-1">
                      路费: {routeNodes[idx]?.edge?.tolls_str} 元
                    </span>
                    <span>时间: {routeNodes[idx]?.edge?.time_str} 小时</span>
                  </div>
                  <div className="border-r border-dashed h-4"></div>
                </section>
              )}
            </div>
          )
        })}
      </div>

      <div className="">
        总开销: {total.tolls} 元，总里程: {total.distance} 公里, 预估油费:
        {total.predict_gas}
      </div>
      <Button color="primary" onClick={planIt} isLoading={loading}>
        帮我规划
      </Button>
      <Button onClick={exportPlan}>导出</Button>
    </>
  )
}
