'use client';
import { AnimatedPinDemo } from '@/components/Animated';
import { Button, Textarea } from '@nextui-org/react';
import { useState } from 'react';

export function Planner() {
  const [input, setInput] = useState('');

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        <AnimatedPinDemo></AnimatedPinDemo>
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
          <Button color="primary" className="">
            发送
          </Button>
        </div>
      </div>
    </div>
  );
}
