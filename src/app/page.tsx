// import Image from 'next/image';
import { Planner } from '@/components/home/planner';

import { MapComp } from '@/components/home/map';

export default function Home() {
  return (
    <>
      <main className="w-screen h-screen flex dark">
        <div className="w-1/2 shrink-0 border-r border-r-gray-600">
          <Planner></Planner>
        </div>
        <div className="w-1/2 shrink-0">
          <MapComp></MapComp>
        </div>
      </main>
    </>
  );
}
