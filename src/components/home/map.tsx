'use client';

import AMapLoader from '@amap/amap-jsapi-loader';
import { useEffect, useState } from 'react';

export function MapComp() {
  const [amapLoaded, setAmapLoaded] = useState(false);
  const [amap, setAmap] = useState<any>();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('@amap/amap-jsapi-loader').then((AMapLoader) => {
        // @ts-ignore
        window._AMapSecurityConfig = {
          securityJsCode: '9121756cb285025b388a7f1f0e7b8a41',
        };

        AMapLoader.load({
          key: 'd1478fde69a16e6deab71cb621a7f79f',
          version: '2.0',
        }).then(() => {
          setAmapLoaded(true);

          //   @ts-ignore
          const amapObj = new AMap.Map('container', {
            // 设置地图容器id
            viewMode: '3D', // 是否为3D地图模式
            zoom: 5, // 初始化地图级别
            center: [105.602725, 22.076636], // 初始化地图中心点位置
          });

          setAmap(amapObj);
        });
      });
    }
  }, []);

  useEffect(() => {
    if (amap) {
      const points = [
        { keyword: '成都市', city: '成都' },
        { keyword: '天水', city: '天水' },
        { keyword: '兰州', city: '兰州' },
        { keyword: '西宁', city: '西宁' },
      ];

      // @ts-ignore
      AMap.plugin(['AMap.Driving'], function () {
        // @ts-ignore
        const driving = new AMap.Driving({
          map: amap,
          extentions: 'all',
          panel: 'show',
        });
        //获取起终点规划线路
        driving.search(points, function (status: any, result: any) {
          if (status === 'complete') {
            //status：complete 表示查询成功，no_data 为查询无结果，error 代表查询错误
            //查询成功时，result 即为对应的驾车导航信息
            console.log(result);
          } else {
            console.log('获取驾车数据失败：' + result);
          }
        });
      });
    }
  }, [amap]);

  return (
    <>
      <div id="container" className="h-full" /> <div id="show"></div>
    </>
  );
}
