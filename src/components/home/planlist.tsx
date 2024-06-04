"use client"
import { usePlanStore } from "@/store/plan"

export function PlanList() {
  const { routeNodes } = usePlanStore()

  return (
    <div className="w-96">
      {routeNodes.map((node, idx) => {
        return (
          <div className="" key={node.keyword + idx}>
            <section className=" border rounded-3xl py-1 px-2">
              {/* <span></span> */}
              <span>{node.keyword}</span>
            </section>
            {node.edge && (
              <section className="flex border rounded ">
                <span>距离: {node.edge.distance_str} 米</span>
                <span>路费: {node.edge.tolls_str} 元</span>
                <span>时间: {node.edge.time_str}</span>
              </section>
            )}
          </div>
        )
      })}
    </div>
  )
}
