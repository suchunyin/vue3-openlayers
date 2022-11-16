<template>
    <el-form class="transform-wapper" :model="form" label-width="120px">
        <el-form-item label="坐标：">
            <el-input v-model="cood" clearable />
            eg: 113.27143,23.135336 or 113°16′17″, 23°8′7″
        </el-form-item>
        <el-form-item>
            <el-button @click="onSubmit">转换1</el-button>
            <el-button @click="onSubmitTran">转换2</el-button>
        </el-form-item>
    </el-form>
    <el-descriptions class="data" title="转换结果" :column="1" border>
        <el-descriptions-item label="DD.DDDDDD" align="center">{{resultForm.DD}}</el-descriptions-item>
        <el-descriptions-item label="DD.FF.MM" align="center">{{resultForm.DMS}}</el-descriptions-item>
    </el-descriptions>
    <div class="wktContainer">
        <div id="map"></div>
        <div>
            <el-descriptions class="wktdata" title="WKT转换" :column="1" border>
                <el-descriptions-item label="WKT" align="center">{{wkts.wkt}}</el-descriptions-item>
                <el-descriptions-item label="Geojson" align="center">{{wkts.geojson}}</el-descriptions-item>
                <el-descriptions-item label="DD.FF.MM" align="center">{{wkts.DFM}}</el-descriptions-item>
                <el-descriptions-item label="DD.DDDDDD" align="center">{{wkts.DDD}}</el-descriptions-item>
            </el-descriptions>
        </div>

    </div>

    <div>

    </div>
</template>

<script>
import { ref, reactive } from 'vue';
import { onMounted } from "@vue/runtime-core";
// import WKT from "terraformer-wkt-parser"
import { Map, View } from "ol"; // 地图实例方法、视图方法
import "ol/ol.css"; // 地图样式
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from 'ol/Feature';
import { LineString, MultiPoint, Point, Polygon } from "ol/geom";
import WKT from "ol/format/WKT"
import { toDDD, toDFM } from "../utils/transform"

export default {
    setup() {
        const cood = ref('')
        const resultForm = reactive({
            DD: '',
            DMS: '',
        })

        const onSubmit = () => {
            let temp = cood.value.split(',')
            let long = parseFloat(temp[0])
            const rs1 = toDFM(long)
            let lat = parseFloat(temp[1])
            const rs2 = toDFM(lat)
            resultForm.DD = cood.value
            resultForm.DMS = rs1 + ", " + rs2
        }

        const onSubmitTran = () => {
            let temp = cood.value.split(',') //113°16′17″, 23°8′7″
            let rs1 = toDDD(temp[0])
            let rs2 = toDDD(temp[1])

            resultForm.DMS = cood.value
            resultForm.DD = rs1 + ", " + rs2

        }


        // POINT (30 10)
        // LINESTRING (30 10, 10 30, 40 40)
        // POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10))
        // POLYGON ((35 10, 45 45, 15 40, 10 20, 35 10),(20 30, 35 35, 30 20, 20 30))
        // MULTIPOINT ((10 40), (40 30), (20 20), (30 10))
        // MULTILINESTRING ((10 10, 20 20, 10 40),(40 40, 30 30, 40 20, 30 10))
        // MULTIPOLYGON (((30 20, 45 40, 10 40, 30 20)),((15 5, 40 10, 10 20, 5 10, 15 5)))
        // MULTIPOLYGON (((40 40, 20 45, 45 30, 40 40)),((20 35, 10 30, 10 10, 30 5, 45 20, 20 35),(30 20, 20 15, 20 25, 30 20)))
        // POLYGON ((71.48856 42.069675, 104.07979 59.010237, 139.07882 48.089164, 137.27298 24.011207, 116.89271 8.532521, 81.72169 8.876491, 66.84495 23.753229, 71.48856 42.069675))
        const wkts = reactive({
            // wkt: 'POLYGON ((35 10, 45 45, 15 40, 10 20, 35 10),(20 30, 35 35, 30 20, 20 30))',
            wkt: 'POLYGON ((71.48856 42.069675, 104.07979 59.010237, 139.07882 48.089164, 137.27298 24.011207, 116.89271 8.532521, 81.72169 8.876491, 66.84495 23.753229, 71.48856 42.069675))',
            geojson: '',
            DFM: '',
            DDD: '',
        })

        let map
        var format = new WKT();

        var feature = format.readFeature(wkts.wkt, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:4326'
        });
        let layer = new VectorLayer({
            source: new VectorSource({
                features: [feature]
            })
        })
        const initmap = () => {
            map = new Map({
                target: "map",
                layers: [layer],
                view: new View({
                    projection: "EPSG:4326",
                    // center: [110.88, 37.85],
                    // center: [120.160318, 30.293255],
                    center: [110, 30],
                    // minZoom: 10,
                    zoom: 2,
                }),
            })
            map.getView().fit(feature.getGeometry().getExtent(), { padding: [10, 100, 10, 10] })
        }
        onMounted(() => {
            initmap(), toGeojson(), wktToDFM(), wktToDDD()
        })
        const toGeojson = () => {

            console.log(wkts.wkt.split('('));

            let data = []
            for (let item of wkts.wkt.split('(')) {
                if (item) {
                    console.log(item.split(')'));
                    for (let item1 of item.split(')')) {
                        if (item1) data.push(item1.trim())
                    }
                }
            }
            console.log(data);

            const type =
                data[0] == "LINESTRING" ? "LineString" : data[0] == "POLYGON" ? "Polygon" : data[0] == "POINT" ? "Point" : data[0] == "MULTIPOINT" ? "MultiPoint"
                    : data[0] == "MULTILINESTRING" ? "MultiLineString" : data[0] == "MULTIPOLYGON" ? "MultiPolygon" : data[0]
            const coord = []

            for (let item0 of data.splice(1, data.length - 1)) {
                const coordtemp = []
                console.log(item0);
                for (let item of item0.split(',')) {
                    if (item) {
                        let temp = []
                        for (let item1 of item.split(' ')) {
                            if (item1) {
                                temp.push(parseFloat(item1))
                            }
                        }
                        if (type != "MultiPoint") coordtemp.push(temp)
                        else { coord.push(temp) }
                    }
                }
                if (coordtemp[0] && type != "MultiPoint") {
                    if (type == "MultiPolygon") { coord.push([coordtemp]) }
                    else { coord.push(coordtemp) }
                }
            }

            console.log(coord);

            wkts.geojson =
                type == "Point" ? { "type": type, "coordinates": coord[0][0] }
                    : type == "LineString" ? { "type": type, "coordinates": coord[0] }
                        : type == "Polygon" ? { "type": type, "coordinates": coord }
                            : type == "MultiPoint" ? { "type": type, "coordinates": coord }
                                : type == "MultiPolygon" ? { "type": type, "coordinates": coord }
                                    : { "type": type, "coordinates": [coord] }

            // wkts.geojson = WKT.parse(wkts.wkt)

            console.log(type.toUpperCase())
            // wkts.geojson = {
            //     "type":"Polygon",
            //     "coordinates": [[[71.48856, 42.069675], [104.07979, 59.010237], [139.07882, 48.089164], [137.27298, 24.011207], [116.89271, 8.532521], [81.72169, 8.876491], [66.84495, 23.753229], [71.48856, 42.069675]]]
            // }

            // wkts.wkt = WKT.convert(wkts.geojson)


        }

        const wktToDFM = () => {
            let str = wkts.wkt
            let tem = str.split(/[\(\,\) ]/)

            for (let item of tem) {
                if (Number(item)) {
                    // console.log(item);
                    let rep = toDFM(Number(item))
                    // console.log(rep);
                    str = str.replaceAll(item, rep)
                }
            }

            // console.log(str);
            wkts.DFM = str
        }
        const wktToDDD = () => {
            let str = wkts.DFM
            let tem = str.split(/[\(\,\) ]/)

            for (let item of tem) {
                if (item != "POLYGON" && item) {
                    // console.log(item);
                    let rep = toDDD(item).toFixed(6)
                    // console.log(rep);
                    str = str.replaceAll(item, rep)
                }
            }

            console.log(str);
            wkts.DDD = str
        }

        return {
            cood,
            onSubmit,
            onSubmitTran,
            resultForm,
            wkts
        }
    }
}
</script>
<style lang="scss">
.transform-wapper {
    padding-top: 50px;

    .el-input {
        width: 400px;
    }
}

.data {
    width: 800px;
    padding: 50px;
}

.wktContainer {
    display: flex;
    padding-block: 50px;
    padding-inline-end: 50px;

    #map {
        width: 600px;
        height: 300px;
        margin-inline: 50px;
        // background-color: aquamarine;
        border: 1px solid #a8abb2;
    }

}
</style>