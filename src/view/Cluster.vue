<template>
  <div id="map"><div id="mouseposition"></div></div>
  <!-- <mymap ></mymap> -->
</template>

<script>
import axios from "axios";
import { onMounted } from "@vue/runtime-core";
import initmap from "../utils/smap";
import pointdata from "../utils/Judge";
import Style from "ol/style/Style";
import { Circle, Point } from "ol/geom";
import Stroke from "ol/style/Stroke";
import Fill from "ol/style/Fill";
import { Feature } from "ol";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
export default {
  // components:{mymap},
  setup() {
    let map = initmap("map", "siderbar");
    // axios.get("./station.txt").then((res) => {
    //   // console.log(res);
    //   // console.log(res.data);
    //   readstr(res.data);
    // });
    // function readstr(data) {
    //   const line = data.split("\r\n");
    //   // console.log(line);
    //   for (var i = 0; i < line.length; i++) {
    //     const temp = line[i].split("\t");
    //     if (temp != "") {
    //       const id = Number(temp[0]);
    //       const lat = parseFloat(temp[1]) / 100;
    //       const lon = parseFloat(temp[2]) / 100;
    //       console.log(lat + ", " + lon);
    //       // console.log(lon);
    //     }
    //   }
    // }
    // let {id,lat,lon}=pointdata("./station.txt");
    function pointload(map){
      let style0=new Style({
        image: new Circle({
          radius:10,
          stroke: new Stroke({
            color:'#fff',
          }),
          fill: new Fill({
            color:'#3399cc'
          })
        })
      })
      let feature0=new Feature({
        geometry: new Point([113.38, 22.94])
      })
      feature0.setStyle(style0)
      let layer0 = new VectorLayer({
        source: new VectorSource({
          features: feature0
        })
      })
      map.addLayer(layer0);
    }
    onMounted(() => {
      initmap("map", "siderbar",'cluster');
      // pointload(map);
      // console.log(id+'88888')
      // observer();
    });
    return {
      // fs
      // readstr,
      
      // id
    };
  },
};
</script>

<style>
#map {
  width: 100%;
  height: 100%;
}
#mouseposition {
  bottom: 0;
  right: 20px;
  font-size: 18px;
  position: absolute;
  z-index: 999;
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