"use client"
import { AnimatedPinDemo } from "@/components/Animated"
import { Button, Textarea } from "@nextui-org/react"
import { produce } from "immer"
import { useState } from "react"
import { PlanList } from "./planlist"
import { usePlanStore } from "@/store/plan"
import { resolveRoutesForSearch } from "@/utils/routes"
import { getGeoCode } from "@/request/geo"
import { resolveSteps } from "@/utils/routes"

export function Planner() {
  const [input, setInput] = useState("")

  const { replaceSmartKeywordsCity } = usePlanStore()

  const smartPlan = async () => {
    const keywords = ["成都", "天水", "张掖", "敦煌"]
    replaceSmartKeywordsCity(keywords.map((k) => ({ keyword: k, city: "" })))
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-auto">
        <PlanList></PlanList>
        {/* <AnimatedPinDemo></AnimatedPinDemo> */}
      </div>
      <div className="shrink-0 p-4 flex items-center border-t border-t-gray-600">
        <Textarea
          minRows={1}
          value={input}
          onValueChange={(val) => setInput(val as string)}
          //   onChange={(e) => setInput(e.target.value || '')}
          variant="bordered"
          labelPlacement="outside"
          placeholder="输入你的想法，比如：来个川西5日游规划"
          className="w-full"
        />

        <div className="flex items-center ml-1">
          <Button color="primary" className="" onClick={smartPlan}>
            发送
          </Button>
        </div>
      </div>
    </div>
  )
}
