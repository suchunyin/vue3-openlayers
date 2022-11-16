<template>
  <div id="map" class="mapc">
    <div id="mouseposition"></div>
  </div>
</template>
<script >
import { onMounted } from "@vue/runtime-core";
import initmap from "../utils/smap";
import { Feature, Map, View } from "ol"; // 地图实例方法、视图方法
import Tile from "ol/layer/Tile"; // 瓦片渲染方法
import "ol/ol.css"; // 地图样式
import Source from "ol/source/Source";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Point } from "ol/geom";
import {
  defaults as defaultControls,
  MousePosition,
  ScaleLine,
  ZoomSlider,
  ZoomToExtent,
  FullScreen,
  OverviewMap,
} from "ol/control";
import { createStringXY } from "ol/coordinate";
export default {
  name: "mymap",
  setup() {
    // let map1 = initmap("map");

    onMounted(() => {
      initmap("map", "siderbar", '');
      // map1.map.addControl(new ZoomSlider()); //添加
      // observer("map", "siderbar");
    });
    return{
      // map1
    }

    // var layer1=new VectorLayer({
    //   source: new VectorSource({
    //     features:new Feature({
    //       geometry: new Point([113.38, 22.94])
    //     })
    //   })
    // });
    // map1.addLayer(layer1);
  },
};
</script>

<style>
.mapc {
  width: 100%;
  height: 100%;
}
#mouseposition {
  bottom: 0;
  right: 20px;
  font-size: 18px;
  position: absolute;
  z-index: 999;
  margin: 10px;
}
.ol-overviewmap {
  left: 0.5em;
  bottom: 2em;
}
.ol-zoom-extent {
  top: 5em;
}
.ol-zoomslider {
  top: 7em;
}
</style>