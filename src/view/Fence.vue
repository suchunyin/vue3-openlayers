<template>
    <div class="fenceContainer">
        <div class="fence">
            <div v-if="!dialogFormVisible">
                <div class="btn">
                    <el-button class="add" type="primary" @click="handleAdd">新增电子围栏</el-button>
                    <el-button @click="fenceOnLine">新增电子围栏</el-button>
                    <!-- <el-button class="deleteMore" type="primary">批量删除</el-button> -->
                </div>
                <el-table :data="tableData" style="width: 100%" :key="timeStamp" @row-click="handleRowClick">
                    <el-table-column label="围栏名称" prop="name" />
                    <el-table-column label="围栏类型" prop="type" />
                    <el-table-column align="right">
                        <!-- <template #header>
                            <el-input v-model="search" size="small" placeholder="围栏名称" />
                        </template> -->
                        <template #default="scope">
                            <el-button size="small" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑
                            </el-button>
                            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <br><br>
                <div class="into">
                    <span>开始进入</span><br><br>
                    <el-button @click="jiance('')">
                        <el-icon>
                            <VideoPlay />
                        </el-icon>
                    </el-button>
                    <el-button @click="jiance('restart')">重置</el-button>
                    <!-- <el-icon><VideoPause /></el-icon> -->
                    <div v-if="alarmFlag=='in'" class="alarm_in">
                        进入电子围栏
                    </div>
                    <div v-if="alarmFlag=='out'" class="alarm_out">
                        离开电子围栏
                    </div>
                </div>
            </div>

            <el-container v-if="dialogFormVisible">
                <el-form :model="form">
                    <el-form-item>
                        <span v-if="add_OR_edit=='add'" class="addTitle">新增电子围栏</span>
                        <span v-if="add_OR_edit=='edit'" class="addTitle">编辑电子围栏</span>
                    </el-form-item>
                    <el-form-item label="围栏名称" :label-width="formLabelWidth">
                        <el-input v-model="form.name" autocomplete="off" />
                    </el-form-item>
                    <el-form-item label="围栏类型" :label-width="formLabelWidth">
                        <el-select v-model="form.type" placeholder="请选择">
                            <el-option label="1111" value="1111" />
                            <el-option label="2222" value="2222" />
                            <el-option label="铁路电子围栏" value="铁路电子围栏" />
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button v-if="add_OR_edit=='add'" type="primary" plain @click="w_addInteraction"
                            class="draw">
                            绘制</el-button>
                        <el-button v-if="add_OR_edit=='edit'" type="primary" plain @click="w_addInteraction"
                            class="draw">修改位置</el-button>
                        <!-- <template #footer> -->
                        <!-- <span class="dialog-footer"> -->
                    </el-form-item>
                    <el-form-item>
                        <div class="addBtn">
                            <el-button v-if="add_OR_edit=='add'" type="primary" @click="addConfirm">确认</el-button>
                            <el-button v-if="add_OR_edit=='edit'" type="primary" @click="editConfirm">确认</el-button>
                            <el-button @click="addCanel">取消</el-button>
                        </div>
                    </el-form-item>
                </el-form>
            </el-container>
        </div>
        <div id="mapc"></div>
    </div>
</template>

<script lang="ts">
import {
    VideoPlay,
    VideoPause
} from "@element-plus/icons-vue";
import { Map, View } from "ol"
import "ol/ol.css"; // 地图样式
import { computed, onMounted, reactive, ref } from 'vue'
import { handleLayer, wfslayer } from "../utils/smap"
import { isInPolygon, isOnLine, pointNearestPolyline, getNearestPointOnLine } from "../utils/Judge";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Draw from "ol/interaction/Draw";
import Modify from "ol/interaction/Modify";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import Fill from "ol/style/Fill";
import Circle from "ol/style/Circle";
import { Point, Polygon } from "ol/geom";
import GeoJSON from 'ol/format/GeoJSON';
import Feature from 'ol/Feature';
import { ElMessage } from "element-plus";
import { transform } from "ol/proj";

export default {
    components: { VideoPlay, VideoPause },
    setup() {
        const timeStamp = ref(0)
        interface Fence {
            name: string
            type: string
            id: string
        }

        const add_OR_edit = ref('')
        let editId
        let editFeature
        const handleEdit = (index: number, row: Fence) => {
            handleRowClick(row)
            add_OR_edit.value = 'edit'
            dialogFormVisible.value = true
            form.name = row.name
            form.type = row.type
            console.log(index, row)
            // let feature
            source.getFeatures().forEach((item, index, arr) => {
                if (item.get('id') === row.id) {
                    // feature=item
                    drawsource.addFeature(item)
                    editFeature = item
                }
            })
            editId = row.id
        }
        const editConfirm = () => {
            let df = drawsource.getFeatures()
            if (df[0] && form.name && form.type) {
                // let ft=source.getFeatureByUid(editFeature.ol_uid)
                source.getFeatures().forEach((item, index, arr) => {
                    if (item.get('id') === df[0].get('id')) {
                        // feature=item
                        // drawsource.addFeature(item)
                        item.set('name', form.name)
                        item.set('type', form.type)
                        let igeom = item.getGeometry()
                        igeom?.setCoordinates(df[0].getGeometry()?.getCoordinates())
                        map.getLayers().getArray()[3].setVisible(true)
                        drawsource.removeFeature(df[0])
                        console.log(editFeature.ol_uid);
                        console.log(item.ol_uid);

                        // getData()
                        tableData.forEach((item, index, arr) => {
                            if (item.id === df[0].get('id')) {
                                item.name = form.name
                                item.type = form.type
                                addArray[index].geom = df[0].getGeometry()?.getCoordinates()
                                addArray[index].name = form.name
                                addArray[index].type = form.type
                                localStorage.setItem('addFeatures', JSON.stringify(addArray))
                            }
                        })
                        tableData[index]
                        tableData[index]
                        dialogFormVisible.value = false
                        map.removeInteraction(modify)
                    }
                })
            }

            map.getView().fit(source.getExtent(), { padding: [120, 450, 120, 120] });
        }
        const handleDelete = (index: number, row: Fence) => {
            console.log(index, row)
            let features = source.getFeatures()
            for (let item0 of features) {
                if (item0.get('id') !== row.id) continue;
                source.removeFeature(item0)
                map.getView().fit(source.getExtent(), { padding: [120, 450, 120, 120] });
                tableData.splice(index, 1);
                addArray.forEach(function (item, index0, arr) {
                    if (item.id == row.id) {
                        arr.splice(index0, 1);
                    }
                });
                localStorage.setItem('addFeatures', JSON.stringify(addArray))
                getData()
            }
        }
        const handleRowClick = (row) => {
            let id = row.id
            console.log(row);

            source.getFeatures().forEach((item, index, arr) => {
                if (item.get('id') === row.id) {
                    map.getView().fit(item.getGeometry()?.getExtent(), { padding: [120, 450, 120, 120] })
                }
            })
        }

        const tableData: Fence[] = []
        const search = ref('')
        const toFilter = () => {
            console.log('tableData: ', tableData);

            return computed(() => tableData.filter(
                (data) =>
                    !search.value ||
                    data.name.toLowerCase().includes(search.value.toLowerCase())
            ))
        }
        const toFilter2 = (value) => {
            console.log('tableData: ', tableData);

            return computed(() => tableData.filter(
                (data) =>
                    !value ||
                    data.name.toLowerCase().includes(value.toLowerCase())
            ))
        }
        const filterTableData = reactive(toFilter())

        let map
        const layer0 = handleLayer();
        const source = new VectorSource({})
        const fencelayer = new VectorLayer({
            source: source,
            style: new Style({
                fill: new Fill({
                    color: '#409eff85'
                }),
                stroke: new Stroke({
                    color: '#409eff'
                })
            })
        })
        const drawsource = new VectorSource({})
        const drawlayer = new VectorLayer({
            source: drawsource,
            style: new Style({
                fill: new Fill({
                    color: '#efea53b0'
                }),
                stroke: new Stroke({
                    color: '#bfbb3f',
                    width: 2
                }),
            })
        })
        const jianceLayer = new VectorLayer({
            source: new VectorSource({
                features: [
                    new Feature({
                        geometry: new Point([116.24450048536987, 39.83580301668584])
                    }),
                ]
            })
        })
        const init_map = () => {
            map = new Map({
                target: 'mapc',
                layers: layer0,
                view: new View({
                    projection: "EPSG:4326",
                    center: [116.24776656232041, 39.83386490248254],
                    zoom: 17,
                }),
            });
            map.addLayer(wfslayer)
            map.addLayer(fencelayer)
            map.addLayer(drawlayer)
            map.addLayer(jianceLayer)
        }
        onMounted(() => {
            init_map();
            getData();
            map.getView().fit(source.getExtent(), { padding: [120, 450, 120, 120] });
        })

        const dialogFormVisible = ref(false)
        const formLabelWidth = '100px'

        const form = reactive({
            name: '',
            type: '',
        })
        const handleAdd = () => {
            // addInteraction()
            dialogFormVisible.value = true
            add_OR_edit.value = 'add'
            console.log('filterTableData: ', filterTableData);

        }
        let addArray = localStorage.getItem("addFeatures") ? JSON.parse(localStorage.getItem("addFeatures")) : []
        if (!addArray[0]) {
            addArray.push(
                {
                    geom: [[[116.24426054010205, 39.83609504616222], [116.24437152570415, 39.835909162301036], [116.244458680042, 39.8357260020129], [116.24448046862646, 39.835732810945544], [116.24439808054147, 39.835901672475124], [116.2442843713663, 39.83610662134772], [116.24426054010205, 39.83609504616222]]],
                    name: "围栏11",
                    type: "铁路电子围栏",
                    id: '123456'
                },
                {
                    geom: [[[116.24411866860767, 39.83588776114607], [116.24424908094583, 39.83568628579728], [116.24427953652182, 39.835694094919326], [116.24415146692026, 39.83590494121457], [116.24411866860767, 39.83588776114607]]],
                    name: "围栏22",
                    type: "铁路电子围栏",
                    id: '234567'
                },
                {
                    geom: [[[116.24456884146655, 39.835448889542775], [116.24475907372891, 39.83506144401758], [116.24482713848333, 39.83508413226906], [116.24463341572074, 39.83547157779425], [116.24456884146655, 39.835448889542775]]],
                    name: "围栏33",
                    type: "铁路电子围栏",
                    id: '345678'
                },
            )
        }
        localStorage.setItem('addFeatures', JSON.stringify(addArray))
        const addConfirm = () => {
            let features = drawsource.getFeatures()
            if (features[0] && form.name && form.type) {
                let id = String(Number(source.getFeatures()[source.getFeatures().length - 1].get('id')) + 1)
                let add = new Feature({
                    geometry: features[0].getGeometry(),
                    name: form.name,
                    type: form.type,
                    id: id
                })
                source.addFeature(add)
                map.getView().fit(source.getExtent(), { padding: [120, 450, 120, 120] });
                // drawsource.removeFeature(features[0])
                // console.log(tableData);
                // console.log(source.getFeatures());
                getData()

                let st = {
                    geom: features[0].getGeometry()?.getCoordinates(),
                    name: form.name,
                    type: form.type,
                    id: id
                }
                // 

                addArray.push(st)
                localStorage.setItem('addFeatures', JSON.stringify(addArray))
                // console.log(JSON.parse(temp));


                console.log(typeof (add));

                // dialogFormVisible.value = false
                addCanel()
                return
            } else if (!features[0]) {
                ElMessage({
                    message: "请绘制一个电子围栏",
                    type: "warning"
                })
            } else if (!form.name) {
                ElMessage({
                    message: "请输入围栏名称",
                    type: "warning"
                })
            } else if (!form.type) {
                ElMessage({
                    message: "请选择围栏类型",
                    type: "warning"
                })
            }
            // drawsource.removeFeature()
        }

        let modify
        const w_addInteraction = () => {

            if (add_OR_edit.value == 'add') {
                let draw = new Draw({
                    source: drawsource,
                    type: 'Polygon',
                    style: new Style({
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
                });
                map.addInteraction(draw);

                //限制绘制图层只能画一个电子围栏
                setInterval(() => {
                    if (drawsource.getFeatures().length != 0) {
                        map.removeInteraction(draw)
                    }
                }, 1000)

            } else if (add_OR_edit.value == 'edit') {
                map.getLayers().getArray()[3].setVisible(false)
                modify = new Modify({
                    source: drawsource
                })
                map.addInteraction(modify)
            }
            // else{
            //     map.removeInteraction(modify)
            // }


        }

        const getData = () => {
            let features = source.getFeatures();
            let tempArr = localStorage.getItem("addFeatures")
            tempArr = JSON.parse(tempArr)
            if (tempArr) {
                for (let temp of tempArr) {
                    console.log(temp);
                    let flag = true
                    features.forEach(element => {
                        console.log(element);
                        if (element.get('id') == temp.id) flag = false
                    });
                    if (flag) {
                        let ft = new Feature({
                            geometry: new Polygon(temp.geom),
                            name: temp.name,
                            type: temp.type,
                            id: temp.id
                        })
                        source.addFeature(ft)
                        map.getView().fit(source.getExtent(), { padding: [120, 450, 120, 120] });
                    }
                }
            }
            features = source.getFeatures();
            console.log(features);

            for (let item of features) {
                console.log(item);
                let name = item.get('name')
                console.log("filter:", toFilter2(name).value);

                if (toFilter2(name).value.length !== 0) {
                    console.log('stop');
                    continue
                }
                let fc: Fence = {
                    name: item.get('name'),
                    type: item.get('type'),
                    id: item.get('id')
                }
                console.log(fc);

                tableData.push(fc)
            }
            timeStamp.value++
            console.log(timeStamp.value);
            // filterTableData = toFilter()
        }
        const addCanel = () => {
            if (add_OR_edit.value == 'edit') {
                map.getLayers().getArray()[3].setVisible(true)
                map.removeInteraction(modify)

                addArray.forEach(element => {
                    if (element.id == editId) {
                        let f = source.getFeatureByUid(editFeature.ol_uid)
                        f?.getGeometry()?.setCoordinates(element.geom)
                    }
                });

                editId = ''
                editFeature = null
            }
            dialogFormVisible.value = false
            form.name = ''
            form.type = ''
            drawsource.clear();
            add_OR_edit.value = ''
            map.getView().fit(source.getExtent(), { padding: [120, 450, 120, 120] });
        }

        const alarmFlag = ref('')
        const jiance = (flag) => {

            let p = jianceLayer.getSource()?.getFeatures()[0]
            if (p) {
                let coord = p.getGeometry()?.getCoordinates()
                // if (coord[0] != 116.24450048536987) p.getGeometry()?.setCoordinates([116.24450048536987, coord[1]])
                // console.log(coord);
                if (flag == 'restart') {
                    p.getGeometry()?.setCoordinates([116.24450048536987, coord[1]])
                    return
                }
                let myInterval = setInterval(() => {
                    let in_ = false
                    coord[0] -= 0.000001
                    p.getGeometry()?.setCoordinates(coord)

                    for (let polygon of source.getFeatures()) {
                        let u = polygon.getGeometry()?.getCoordinates()
                        if (isInPolygon(coord, u[0])) {
                            in_ = true
                        }
                    }

                    alarmFlag.value = in_ ? 'in' : 'out'

                    if (coord[0] <= 116.24364862046585) {
                        clearInterval(myInterval)
                    }
                }, 10)
            }

        }

        const fenceOnLine = () => {
            map.on('singleclick', function (e) {
                let point = e.coordinate
                console.log(point);
                let f = wfslayer.getSource().getClosestFeatureToCoordinate(point)
                let line = f.getGeometry().getCoordinates()[0]
                console.log(line);
                let near = new Feature({
                    geometry: new Point(pointNearestPolyline(point, line))
                })
                // let near=getNearestPointOnLine(point, line)
                jianceLayer.getSource().addFeature(near)
                console.log(isOnLine(pointNearestPolyline(point, line), line));
                // console.log(isOnLine(getNearestPointOnLine(point, line), line));
                // console.log(near);
        })
    }
        return {
        timeStamp,
        search,
        filterTableData, tableData,
        add_OR_edit,
        handleEdit,
        editConfirm,
        handleDelete,
        handleRowClick,
        handleAdd,
        w_addInteraction,
        dialogFormVisible,
        formLabelWidth,
        form,
        addConfirm,
        addCanel,
        jiance,
        alarmFlag,
        fenceOnLine,
    }
}
}

</script>

<style lang="scss">
.fenceContainer {
    display: flex;
    width: 100%;
    height: 100%;

    .fence {
        width: 27em;
        padding: 10px;
        // height: 100%;

        .btn {
            padding-bottom: 10px;
        }

        .addTitle {
            font-size: 16px;
            font-weight: 800;
            margin-top: 30px;
            margin-left: 40%;
            color: #606266;
        }

        .draw {
            margin-left: 33%;
            width: 8em;
        }

        .addBtn {
            margin-top: 20px;
            margin-left: 57%;
        }

        .into {
            font-weight: 600;
            color: #706f6f;

            .alarm_out {
                margin: 20px;
                margin-inline-start: 10em;
                width: 10em;
                height: 10em;
                background-color: #b3e19d;
                border-radius: 50%;
                text-align: center;
                line-height: 10em;
            }

            .alarm_in {

                margin: 20px;
                width: 10em;
                height: 10em;
                background-color: #a0cfff;
                border-radius: 50%;
                text-align: center;
                line-height: 10em;
            }
        }

    }

    .el-form {
        text-align: center;
    }


    #mapc {
        width: 100%;
        height: 100%;
        box-shadow: 10px 10px 10px 10px #888888;
    }
}
</style>