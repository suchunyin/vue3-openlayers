import { Map, View } from "ol"; // 地图实例方法、视图方法
import Tile from "ol/layer/Tile"; // 瓦片渲染方法
import "ol/ol.css"; // 地图样式
import WMTS from "ol/source/WMTS";
import WMTSTileGrid from "ol/tilegrid/WMTS";
import { get as getProjection } from "ol/proj.js";
import { getWidth, getTopLeft } from "ol/extent.js";
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
import Style from "ol/style/Style";
import { Point } from "ol/geom";
import Stroke from "ol/style/Stroke";
import Fill from "ol/style/Fill";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import CircleStyle from "ol/style/Circle";
import pointdata from "./Judge";
import axios from "axios";
import Cluster from "ol/source/Cluster"
import Text from "ol/style/Text";
import GeoJSON from 'ol/format/GeoJSON';
import Feature from 'ol/Feature';
import TileWMS from "ol/source/TileWMS";
import Image from "ol/layer/Image";
import ImageWMS from "ol/source/ImageWMS";
export async function initmap(mapid, siderbarid, functrl) {
    const key = "6957aa7a30010e691a3362a1f1d9283b";          //天地图密钥
    const wtms1 = "http://t0.tianditu.gov.cn/vec_c/wmts?tk=";//天地图矢量地图
    const wtms2 = "http://t0.tianditu.gov.cn/cva_c/wmts?tk=";//天地图矢量注记
    var projection1 = getProjection("EPSG:4326");
    var projectionExtent = projection1.getExtent();
    var size = getWidth(projectionExtent) / 256;
    var resolutions1 = new Array(18);
    var matrixIds1 = new Array(18);
    for (var i = 1; i < 19; ++i) {
        resolutions1[i] = size / Math.pow(2, i);
        matrixIds1[i] = i;
    }
    var overviewCtrl = new OverviewMap({
        collapsed: false,
        layers: [new Tile({
            // opacity: 0.7,
            source: new WMTS({
                url: wtms1 + key,
                layer: "vec",
                matrixSet: "c",
                format: "tiles",
                style: "default",
                projection: projection1,
                tileGrid: new WMTSTileGrid({
                    origin: getTopLeft(projectionExtent),
                    resolutions: resolutions1,
                    matrixIds: matrixIds1,
                }),
                wrapX: true,
            }),
        }),
        new Tile({
            // opacity: 0.7,
            source: new WMTS({
                url: wtms2 + key,
                layer: "cva",
                matrixSet: "c",
                format: "tiles",
                style: "default",
                projection: projection1,
                tileGrid: new WMTSTileGrid({
                    origin: getTopLeft(projectionExtent),
                    resolutions: resolutions1,
                    matrixIds: matrixIds1,
                }),
                wrapX: true,
            }),
        }),]
    });

    var mousepositionCtrl = new MousePosition({
        coordinateFormat: function (e) {
            let stringifyFunc = createStringXY(4);
            let str = stringifyFunc(e);
            return (
                "经度：" +
                str.split(",")[0] +
                "&nbsp; " +
                "纬度：" +
                str.split(",")[1]
            );
        },
        projection: "EPSG:4326",
        className: "custom-mouse-position",
        target: document.getElementById("mouseposition"),
        undefinedHTML: "&nbsp",
    });

    //设置图层
    const layers1 = [
        // new Tile({
        //   source: new OSM(),
        // }),
        new Tile({
            // opacity: 0.7,
            source: new WMTS({
                url: wtms1 + key,
                layer: "vec",
                matrixSet: "c",
                format: "tiles",
                style: "default",
                projection: projection1,
                tileGrid: new WMTSTileGrid({
                    origin: getTopLeft(projectionExtent),
                    resolutions: resolutions1,
                    matrixIds: matrixIds1,
                }),
                wrapX: true,
            }),
        }),
        new Tile({
            // opacity: 0.7,
            source: new WMTS({
                url: wtms2 + key,
                layer: "cva",
                matrixSet: "c",
                format: "tiles",
                style: "default",
                projection: projection1,
                tileGrid: new WMTSTileGrid({
                    origin: getTopLeft(projectionExtent),
                    resolutions: resolutions1,
                    matrixIds: matrixIds1,
                }),
                wrapX: true,
            }),
        }),
    ];

    let map = new Map({
        target: mapid,
        controls: defaultControls({ zoon: true }).extend([
            mousepositionCtrl, overviewCtrl
        ]), //添加鼠标位置控件，鹰眼地图控件
        layers: layers1,
        view: new View({
            projection: "EPSG:4326",
            center: [113.38, 22.94],
            // minZoom: 10,
            zoom: 6,
        }),
    });
    map.addControl(new ScaleLine()); //添加比例尺控件
    map.addControl(
        new ZoomToExtent({
            extent: [113.2699, 22.8646, 113.4898, 23.0162],
        })
    );
    map.addControl(new FullScreen()); //添加全屏控件
    map.addControl(new ZoomSlider());
    // map.addControl(mousepositionCtrl);


    const targetNode = document.getElementById(siderbarid);
    const config = { attributes: true, childList: true, subtree: true };
    const callback = function (mutationList, observer) {
        for (let mutation of mutationList) {
            if (mutation.type === "childList") {
                console.log("A child node has been added or removed.");
            } else if (mutation.type === "attributes") {
                map.updateSize();
            }
        }
    };
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);


    let style0 = new Style({
        image: new CircleStyle({
            radius: 5,
            stroke: new Stroke({
                color: '#fff',
            }),
            fill: new Fill({
                color: '#3399cc',
            })
        })
    })
    const idlist = new Array();
    const latlist = new Array();
    const lonlist = new Array();
    await axios.get('./station.txt').then((res) => {
        // readstr(data);
        const line = res.data.split("\r\n");
        // console.log(line);
        for (var i = 0; i < line.length; i++) {
            const temp = line[i].split("\t");
            if (temp != "") {
                idlist.push(Number(temp[0]));
                latlist.push(parseFloat(temp[1]) / 100);
                lonlist.push(parseFloat(temp[2]) / 100);
            }
        }
    });
    let feature0 = new Feature({
        geometry: new Point([113.38, 22.94])
    })
    feature0.setStyle(style0)
    const featurearr = new Array()
    for (var i in idlist) {
        let feature1 = new Feature({
            geometry: new Point([lonlist[i], latlist[i]])
        })
        feature1.setStyle(style0)
        featurearr.push(feature1)
    }
    let pointlayer = new VectorLayer({
        source: new VectorSource({
            features: featurearr
        })
    })
    let cluster = new VectorLayer({
        opacity: 0.7,
        source: new Cluster({
            distance: 20,
            minDistance: 30,
            source: new VectorSource({
                features: featurearr
            })
        }),
        style: function (feature, resolution) {
            var size = feature.get('features').length;
            //如果是聚合数为1也就是最底层的则是定位图标
            if (size == 1) {
                return style0
                // new Style({
                //     image: new Icon({
                //         anchor: [0.5, 1],
                //         src: require("../../assets/Img/marker_yes.png"),
                //     })
                // })
            } else {
                //这里设置聚合部分的样式
                return new Style({
                    image: new CircleStyle({
                        radius: 10,
                        stroke: new Stroke({
                            color: 'white'
                        }),
                        fill: new Fill({
                            color: 'blue',

                        })
                    }),
                    text: new Text({
                        text: size.toString(),
                        fill: new Fill({
                            color: 'white'
                        })
                    })
                })
            }
        }
    })
    if (functrl == 'cluster') {
        map.addLayer(cluster);
    }

    return { map }
}

export default function createPoint() {
}

export function handleLayer() {
    const key = "6957aa7a30010e691a3362a1f1d9283b";          //天地图密钥
    const wtms1 = "http://t0.tianditu.gov.cn/vec_c/wmts?tk=";//天地图矢量地图
    const wtms2 = "http://t0.tianditu.gov.cn/cva_c/wmts?tk=";//天地图矢量注记
    var projection1 = getProjection("EPSG:4326");
    var projectionExtent = projection1.getExtent();
    var size = getWidth(projectionExtent) / 256;
    var resolutions1 = new Array(18);
    var matrixIds1 = new Array(18);
    for (var i = 1; i < 19; ++i) {
        resolutions1[i] = size / Math.pow(2, i);
        matrixIds1[i] = i;
    }

    //设置图层
    const layers1 = [
        // new Tile({
        //   source: new OSM(),
        // }),
        new Tile({
            // opacity: 0.7,
            source: new WMTS({
                url: wtms1 + key,
                layer: "vec",
                matrixSet: "c",
                format: "tiles",
                style: "default",
                projection: projection1,
                tileGrid: new WMTSTileGrid({
                    origin: getTopLeft(projectionExtent),
                    resolutions: resolutions1,
                    matrixIds: matrixIds1,
                }),
                wrapX: true,
            }),
        }),
        new Tile({
            // opacity: 0.7,
            source: new WMTS({
                url: wtms2 + key,
                layer: "cva",
                matrixSet: "c",
                format: "tiles",
                style: "default",
                projection: projection1,
                tileGrid: new WMTSTileGrid({
                    origin: getTopLeft(projectionExtent),
                    resolutions: resolutions1,
                    matrixIds: matrixIds1,
                }),
                wrapX: true,
            }),
        }),
    ];

    return layers1

}

export const geoserverlayer = [
    new Tile({
        source: new TileWMS({
            url: 'http://localhost:8080/geoserver/mydemo-test/wms',//服务发布的地址
            params: {
                'FORMAT': 'image/png',
                'VERSION': '1.1.0',
                tiled: true,
                STYLES: '',
                LAYERS: 'mydemo-test:railwaydouble' //服务发布的图层名称
            }
        })
    })
]
//方法一：加载ImageWMS
export const geolayer1 = new Image({
    source: new ImageWMS({
        url: 'http://localhost:8080/geoserver/mydemo-test/wms',
        params: {
            'FORMAT': 'image/png',
            'VERSION': '1.1.0',
            tiled: true,
            STYLES: '',
            LAYERS: 'mydemo-test:railwaydouble'
        }
    })
})
//方法二：加载wfs
export const wfslayer = new VectorLayer({
    source: new VectorSource({
        format: new GeoJSON(),
        url: 'http://localhost:8080/geoserver/mydemo-test/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=mydemo-test%3Arailwaydouble&maxFeatures=500000000&outputFormat=application%2Fjson'
    }),
    style: new Style({
        stroke: new Stroke({
            color: 'blue',
            // width: 3
        })
    }),
})
