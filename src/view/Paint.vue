<template>
    <div id="mapf">
        <div class="control">
            <div class="paint">
                <el-button @click="paint(item.name)" :type="paintType===item.name?'primary':''" v-for="item in geomlist"
                    :key="item.id">{{item.label}}</el-button>
                <el-button :type="active=='paint'?'danger':''" plain @click="stopDraw">停止绘制</el-button>
            </div>
            <div class="bufferDIV">
                <span>缓冲区分析</span>
                <el-form v-model="bufferForm" class="bufferForm">
                    <el-form-item label="距离：">
                        <el-input v-model="bufferForm.distance"></el-input>
                    </el-form-item>
                    <el-form-item label="单位：">
                        <el-select v-model="bufferForm.unit" placeholder="">
                            <el-option label="千米" value='kilometers' />
                            <el-option label="英里" value='miles' />
                            <el-option label="度" value='degrees' />
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button :type="active=='buffer'?'info':'primary'" @click="handleBuffer">选择要素</el-button>
                        <el-button :type="active=='buffer'?'danger':''" plain @click="stopBuffer">停止选择</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="relationDIV">
                <el-descriptions class="relation" title="拓扑关系判断" :column="1" border>
                    <!-- <el-descriptions-item v-for="item in geomData" :key="item.id" :label="item.type" align="center">
                        {{item.coords}}</el-descriptions-item> -->
                    <el-descriptions-item v-if="geomData.length>1" :label="geomData[geomData.length-2].type"
                        align="center">{{geomData[geomData.length-2].coords}}</el-descriptions-item>
                    <el-descriptions-item v-if="geomData[geomData.length-1].type"
                        :label="geomData[geomData.length-1].type" align="center">
                        {{geomData[geomData.length-1].coords}}</el-descriptions-item>
                    <el-descriptions-item v-if="result.label" :label="result.label" align="center">{{result.res}}
                    </el-descriptions-item>

                </el-descriptions>
                <el-button :type="active=='judge'?'info':'primary'" @click="relationJudge">选择要素</el-button>
                <el-button :type="active=='judge'?'danger':''" plain @click="stopJudge">停止选择</el-button>
            </div>
        </div>
        <div class="layerDIV">
            <div v-show="layerCtrl" class="layerCtrl">
                <el-checkbox v-for="item in layerList" v-model="item.checked" :label="item.label" :key="item.id"
                    size="large" @change="handleLayerContrl(item)" />
                <!-- <el-checkbox v-model="layerCtrl" label="Option 1" size="large" />
                    <el-checkbox v-model="layerCtrl" label="Option 2" size="large" /> -->
            </div>
            <el-button @click="layerCtrl=!layerCtrl">
                <el-icon>
                    <Operation />
                </el-icon>
            </el-button>
        </div>
        <!-- <div class="info">
            <el-button @click="fenceCtrl=!fenceCtrl">
                <el-icon>
                    <EditPen />
                </el-icon>
            </el-button>
            <div v-show="fenceCtrl" class="fenceCtrl">
                <span>电子围栏生成</span>
                <el-input></el-input>
            </div>
        </div> -->
    </div>

</template>

<script lang="ts">
import {
    Operation, EditPen
} from "@element-plus/icons-vue";
import { onMounted } from "@vue/runtime-core";
import { ref, reactive } from "vue";
import { Map, View } from "ol"; // 地图实例方法、视图方法
import "ol/ol.css"; // 地图样式
import { wfslayer, handleLayer } from "../utils/smap"
import { stopCreateBuffer, coordturf, createBuffer, isInPolygon, isOnLine } from "../utils/Judge";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Draw from "ol/interaction/Draw";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import Fill from "ol/style/Fill";
import Circle from "ol/style/Circle";
import { LineString, Point, Polygon } from "ol/geom";
import Feature from 'ol/Feature';
import { result } from "lodash";
export default {
    components: { Operation, EditPen },
    setup() {
        let map
        let source = new VectorSource({
            features: [
                // new Feature({
                //     geometry: new Point([121.478815, 31.24161])
                // }),
                // new Feature({
                //     geometry: new Point([120.160318, 30.293255]),
                //     name: '杭州市'
                // }),
                // new Feature({
                //     geometry: new LineString([[121.478815, 31.24161], [116.71610413281252, 30.974407343750002]])
                // }),
                // new Feature({
                //     geometry: new LineString([[120.160318, 31.093255], [120.160318, 30.293255], [120.14383850781252, 28.557415156250002]])
                // }),
                // new Feature({
                //     geometry: new LineString([[118.160318, 28.093255], [120.360318, 28.293255], [116.33383850781252, 28.557415156250002]])
                // })
                new Feature({
                    geometry: new LineString([[116.24535062900996, 39.83517129605041], [116.24962772575957, 39.834706005190625]])
                }),
                new Feature({
                    geometry: new Point([116.24962772575957, 39.834706005190625])
                }),
                new Feature({
                    geometry: new Point([116.24776656232041, 39.83386490248254])
                }),
                new Feature({
                    geometry: new Point([116.25141730598953, 39.82976676375593])
                }),
                new Feature({
                    geometry: new Polygon([[[116.24941297613198, 39.83051838745251], [116.25059409908376, 39.82878249462944], [116.25564071533225, 39.82810245414206], [116.25639233902884, 39.827941391921364], [116.25658919285412, 39.82812034994436], [116.25632075581963, 39.82892566104784], [116.25483540422877, 39.8308941993008], [116.24941297613198, 39.83051838745251]]])
                }),
                new Feature({
                    geometry: new LineString([[116.25884177103352, 39.830735132252755], [116.25909926309895, 39.821980402028146], [116.26708151712727, 39.825756952321115], [116.26270415201496, 39.81987755016047], [116.26759650125813, 39.8175601215716]])
                }),
                new Feature({
                    geometry: new Point([116.26708151712727, 39.825756952321115])
                }),
                new Feature({
                    geometry: new Polygon([[[-86.46941125138335, 28.840909090909086], [-76.44668397865607, -17.181818181818187], [-66.62850216047426, -20.25], [-60.69668397865607, -19.227272727272734], [-46.45131369846081, -24.954545454545467], [-15.360404607551715, -18.818181818181827], [16.996226481176592, 7.36363636363636], [12.700771935722045, 16.568181818181813], [-8.776500791550689, 1.636363636363626], [0.42804466299476474, 26.18181818181818], [-18.39013715518705, 9.409090909090907], [19.6553173902675, 18.204545454545453], [-25.958318973368876, 16.568181818181813], [-27.5946826097325, 24.954545454545453], [-32.299228064277955, 20.659090909090907], [-29.23104624609614, 13.09090909090908], [-25.958318973368876, 5.7272727272727195], [-25.3446826097325, 0.4090909090909065], [-31.48104624609614, 9.409090909090907], [-39.049228064277955, 7.1590909090909065], [-53.150358663691996, 16.36363636363636], [-62.76399502732836, 15.34090909090908], [-49.03398978811432, 1.4318181818181728], [-62.943080697205225, 3.2727272727272663], [-61.10217160629614, 8.386363636363626], [-65.39762615175067, 19.022727272727266], [-50.7003367818756, 24.75], [-43.33670041823923, 26.18181818181818], [-41.49579132733014, 19.636363636363626], [-37.63008976008012, 14.522727272727266], [-34.561907941898305, 22.295454545454547], [-86.46941125138335, 28.840909090909086]]])
                }), 
                new Feature({
                    geometry: new LineString([[116.24033472337011, 39.83694105865892], [116.2413124351348, 39.83519602880044], [116.24209212932689, 39.834731925114674]])
                }),
                new Feature({
                    geometry: new Point([116.24062556167986, 39.836099483975396])
                }),
                new Feature({
                    geometry: new Point([116.24025427873126, 39.836099483975396])
                }),
                new Feature({
                    geometry: new Point([116.23974067065234, 39.836693536693176])
                }),
                new Feature({
                    geometry: new Polygon([[[116.23930131916315, 39.83715764037895], [116.23831123130017, 39.83642126253086], [116.23933844745801, 39.835090831965], [116.24053892899185, 39.83551161930676], [116.23930131916315, 39.83715764037895]]])
                })
            ]
        })
        // 添加一个绘制的线使用的layer
        const drawLayer = new VectorLayer({
            //layer所对应的source
            source: source,
            style: new Style({
                fill: new Fill({
                    //填充样式
                    color: "rgba(255, 255, 255, 0.5)",
                }),
                stroke: new Stroke({
                    color: 'blue',
                    width: 3
                }),
                image: new Circle({
                    radius: 5,
                    fill: new Fill({
                        color: 'blue'
                    })
                })
            }),

        })
        const layer1 = new VectorLayer({
            //layer所对应的source
            source: new VectorSource(),
        })

        const layer0 = handleLayer()
        const initmap = () => {
            map = new Map({
                target: 'mapf',
                layers: layer0,
                view: new View({
                    projection: "EPSG:4326",
                    // center: [110.88, 37.85],
                    // center: [120.160318, 30.293255],
                    center: [116.24776656232041, 39.83386490248254],
                    // minZoom: 10,
                    zoom: 15,
                }),
            });
            map.addLayer(wfslayer)
            map.addLayer(layer1)
            //把layer加入到地图中
            map.addLayer(drawLayer);
        }
        onMounted(() => {
            initmap()
        })

        const geomlist = [
            { name: "Point", label: "点绘制" },
            { name: "LineString", label: "线绘制" },
            { name: "Polygon", label: "面绘制" }
        ]


        let draw
        let styleDraw = new Style({
            fill: new Fill({
                color: '#0055ff'
            }),
            stroke: new Stroke({
                color: '#00c033',
                width: 2
            }),
            image: new Circle({
                radius: 7,
                fill: new Fill({
                    color: '#00c033'
                })
            })
        })
        const handleDraw = (typeValue) => {
            draw = new Draw({
                source: source,
                type: typeValue,
                style: styleDraw
            });
            map.addInteraction(draw);
        }
        const active = ref('')
        const paintType = ref('')
        
        const paint = (name) => {
            stopDraw();
            if (handler) map.un('singleclick', handler) //清除点击事件：缓冲区添加
            active.value = 'paint'
            paintType.value = name
            if (paintType.value) {
                handleDraw(name)
            }
        }
        const stopDraw = () => {
            console.log('remove');

            active.value = ''
            paintType.value = ''
            map.removeInteraction(draw);
        }

        const bufferForm = reactive({
            distance: '0.1',
            unit: 'kilometers'
        })

        let handler
        const handleBuffer = () => {
            stopDraw();
            console.log(bufferForm);
            active.value = 'buffer'
            paintType.value = ''
            handler = createBuffer(map, layer1, bufferForm)
        }
        const stopBuffer = () => {
            active.value = ''
            map.un('singleclick', handler) //清除点击事件：缓冲区添加
        }

        const geomData = reactive([
            { type: '', coords: [] },
        ])
        const result = reactive({ label: '', res: '' })
        let turfgeom = [] as any[]
        let featurearr = [] as any[]
        const relationJudge = () => {
            stopDraw();
            if (handler) map.un('singleclick', handler) //清除点击事件：缓冲区添加
            active.value = 'judge'
            let highlight = new Style({
                fill: new Fill({
                    color: '#00c033'
                }),
                stroke: new Stroke({
                    color: '#00c033',
                    width: 5
                }),
                image: new Circle({
                    radius: 7,
                    fill: new Fill({
                        color: '#fdcf04'
                    })
                })
            })
            map.on('singleclick', function (e) {
                let feature = map.getFeaturesAtPixel(e.pixel, { hitTolerance: 1 });
                if (active.value !== 'judge') {
                    if (featurearr.length > 1) {
                        featurearr[featurearr.length - 2].setStyle(null)
                        featurearr[featurearr.length - 1].setStyle(null)
                        geomData.splice(0, geomData.length);
                        geomData.push({ type: '', coords: [] })
                        result.label = ''
                        result.res = ''
                    }
                }
                if (active.value == 'judge' && feature[0]) {
                    result.label = ''
                    result.res = ''
                    if (featurearr.length > 1) {
                        featurearr[featurearr.length - 2].setStyle(null)
                    }
                    featurearr.push(feature[0])
                    feature[0].setStyle(highlight)
                    console.log(feature[0].getProperties());


                    const geometry = feature[0].getGeometry()
                    const type = geometry.getType()
                    const coord = geometry.getCoordinates()

                    let tfGeom = coordturf[type](coord)
                    turfgeom.push(tfGeom)
                    if (geomData[0].type) {
                        // const feature2 = { type: type, coords: coord }
                        geomData.push({ type: type, coords: coord })
                        if (geomData[geomData.length - 2].type == "Point" && geomData[geomData.length - 1].type == "LineString") {
                            result.label = "点是否在线上"
                            // result.res = turf.booleanPointOnLine(turfgeom[turfgeom.length - 2], turfgeom[turfgeom.length - 1]) ? "是" : "否"
                            result.res = isOnLine(geomData[geomData.length - 2].coords, geomData[geomData.length - 1].coords) ? "是" : "否"
                        } else if (geomData[geomData.length - 2].type == "LineString" && geomData[geomData.length - 1].type == "Point") {
                            result.label = "点是否在线上"
                            // result.res = turf.booleanPointOnLine(turfgeom[turfgeom.length - 1], turfgeom[turfgeom.length - 2]) ? "是" : "否"
                            result.res = isOnLine(geomData[geomData.length - 1].coords, geomData[geomData.length - 2].coords) ? "是" : "否"
                        } else if (geomData[geomData.length - 2].type == "Polygon" && geomData[geomData.length - 1].type == "Point") {
                            result.label = "点是否在面上"
                            // result.res = turf.booleanPointInPolygon(turfgeom[turfgeom.length - 1], turfgeom[turfgeom.length - 2]) ? "是" : "否"
                            result.res = isInPolygon(geomData[geomData.length - 1].coords, geomData[geomData.length - 2].coords[0]) ? "是" : "否"
                        } else if (geomData[geomData.length - 2].type == "Point" && geomData[geomData.length - 1].type == "Polygon") {
                            result.label = "点是否在面上"
                            // result.res = turf.booleanPointInPolygon(turfgeom[turfgeom.length - 2], turfgeom[turfgeom.length - 1]) ? "是" : "否"
                            result.res = isInPolygon(geomData[geomData.length - 2].coords, geomData[geomData.length - 1].coords[0]) ? "是" : "否"
                        }
                    } else {
                        geomData[0].type = type
                        geomData[0].coords = coord
                    }
                }
            })
        }
        const stopJudge = () => {
            active.value = ''
        }

        const layerCtrl = ref(false)
        const layerList = reactive([
            { id: 0, label: '天地图图层', checked: true },
            { id: 1, label: '天地图注记', checked: true },
            { id: 2, label: '铁路图层', checked: true },
            { id: 3, label: '缓冲区图层', checked: true },
            { id: 4, label: '绘制图层', checked: true },
        ])
        const handleLayerContrl = (item) => {
            let layers = map.getLayers().getArray()
            console.log(layers[item.id]);
            layers[item.id].setVisible(item.checked)
        }
        const fenceCtrl = ref(false)

        return {
            geomlist,
            active,
            paintType,
            paint,
            stopDraw,
            bufferForm,
            handleBuffer,
            stopBuffer,
            geomData,
            result,
            relationJudge,
            stopJudge,
            layerCtrl,
            layerList,
            handleLayerContrl,
            fenceCtrl,
        }


    }
}
</script>

<style lang="scss">
#mapf {
    width: 100%;
    height: 100%;


}

.control {
    width: 71em;
    margin-top: 0.5em;
    right: 0em;
    position: absolute;
    z-index: 999;
    display: flex;

    .paint {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: flex-end;
        background-color: #60626654;
        padding: 0.5em;
        border-radius: 0.5em;
    }

    .bufferDIV {
        color: #ffff;
        font-size: 16px;
        font-weight: 700;
        width: 16em;
        background-color: #60626654;
        margin-left: 1em;
        padding: 1em;
        border-radius: 0.5em;

        .bufferForm {
            margin-top: 0.5em;
        }
    }

    .relationDIV {
        color: #ffff;
        width: 40em;
        background-color: #60626654;
        margin-left: 1em;
        padding: 1em;
        border-radius: 0.5em;

        .el-descriptions__title {
            color: #ffff;
        }

        .relation {
            margin-bottom: 0.5em;
        }
    }


}

.layerDIV {
    bottom: 10px;
    margin: 1em;
    position: absolute;
    z-index: 999;

    .el-button {
        background-color: #73767a80;
        border: 0;
        // color: #fff;
    }

    .layerCtrl {
        color: #ffff;
        width: 10em;
        background-color: #ffffffa1;
        padding: 1em;
        border-radius: 0.5em;
        display: flex;
        flex-direction: column;
    }
}

.info {

    right: 0em;
    position: absolute;
    z-index: 999;

    .fenceCtrl {
        background-color: #ffffffa1;
    }
}
</style>