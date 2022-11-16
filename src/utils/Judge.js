import axios from "axios";
import GeoJSON from 'ol/format/GeoJSON';
import * as turf from '@turf/turf'
import Draw from "ol/interaction/Draw";

export default function pointdata(path) {
    const idlist = new Array();
    const latlist = new Array();
    const lonlist = new Array();
    axios.get(path).then((res) => {
        // readstr(data);
        const line = res.data.split("\r\n");
        // console.log(line);
        for (var i = 0; i < line.length; i++) {
            const temp = line[i].split("\t");
            if (temp != "") {
                idlist[idlist.length] = Number(temp[0]);
                latlist[latlist.length] = parseFloat(temp[1]) / 100;
                lonlist[lonlist.length] = parseFloat(temp[2]) / 100;

                // idlist.push(Number(temp[0]));
                // latlist.push(parseFloat(temp[1]) / 100);
                // lonlist.push(parseFloat(temp[2]) / 100);
                // console.log(lat + ", " + lon);
                // console.log(lon);
            }
        }
    });
    const list = [idlist, latlist, lonlist]
    // function readstr(data) {

    // }
    return { idlist, latlist, lonlist }
}

export const handleDraw = (map, draw, typeValue, source, style) => {
    draw = new Draw({
        source: source,
        type: typeValue,
        style: style
    });
    map.addInteraction(draw);
}



export const coordturf = {
    Point: function (coords) {
        return turf.point(coords)
    },
    MultiPoint: function (coords) {
        return turf.multiPoint(coords)
    },
    LineString: function (coords) {
        return turf.lineString(coords)
    },
    MultiLineString: function (coords) {
        return turf.multiLineString(coords)
    },
    Polygon: function (coords) {
        return turf.polygon(coords)
    },
    MultiPolygon: function (coords) {
        return turf.multiPolygon(coords)
    }
}


/**
 * 通过鼠标点击地图要素为该要素添加缓冲区
 * @param {ol-map} map 地图
 * @param {ol-layer} layer 添加缓冲区的图层
 * @param {object} bufferParam 缓冲区的参数（半径，半径单位）
 */
export const createBuffer = (map, layer, bufferParam) => {
    const handler = function (e) {
        let feature = map.getFeaturesAtPixel(e.pixel, { hitTolerance: 1 });
        if (feature[0]) {
            const geometry = feature[0].getGeometry()
            const type = geometry.getType()
            const coord = geometry.getCoordinates()
            const tfGeom = coordturf[type](coord)

            const tfbuffer = turf.buffer(tfGeom, Number(bufferParam.distance), { units: bufferParam.unit })
            const obj = new GeoJSON().readFeatures(tfbuffer)
            layer.getSource()?.addFeatures(obj)
        }
    }
    map.on('singleclick', handler)
    return handler
}

export const stopCreateBuffer = (map) => {

}

/**
 * 判断点是否在面上
 * @param {Array} point 点的坐标
 * @param {Array} polygon 多边形的坐标
 * @returns 
 */
export const isInPolygon = (point, polygon) => {
    let crox = 0
    for (var i = 0; i < polygon.length - 1; i++) {
        let pi = polygon[i]
        let pj = polygon[i + 1]

        let slop = (pj[1] - pi[1]) / (pj[0] - pi[0])
        const cod1 = (pi[0] <= point[0]) && (point[0] < pj[0])
        const cod2 = (pj[0] <= point[0]) && (point[0] < pi[0])
        const abo = (point[1] < slop * (point[0] - pi[0]) + pi[1])

        if ((cod1 || cod2) && abo) {
            crox++
        }
    }
    return (crox % 2 != 0)
}
/**
 * 判断点是否在线上
 * @param {Array} point 
 * @param {Array} line 
 * @returns 
 */
export const isOnLine = (point, line) => {
    let Q = { x: point[0], y: point[1] }
    for (var i = 0; i < line.length - 1; i++) {
        let pi = { x: line[i][0], y: line[i][1] }
        let pj = { x: line[i + 1][0], y: line[i + 1][1] }
        if ((Q.x - pi.x) * (pj.y - pi.y) == (pj.x - pi.x) * (Q.y - pi.y) && Math.min(pi.x, pj.x) <= Q.x
            && Q.x <= Math.max(pi.x, pj.x) && Math.min(pi.y, pj.y) <= Q.y && Q.y <= Math.max(pi.y, pj.y)) {
            return true
        }
    }

    return false
}

/**
 * 计算点到线做垂线的交点
 * @param {Array} point 
 * @param {Array} line 
 * @returns 
 */
export const getCrossPoint = (point, line) => {
    let linepoint_1 = line[0]
    let linepoint_2 = line[1]
    let a = (linepoint_1[1] - linepoint_2[1]) / (linepoint_1[0] - linepoint_2[0])
    let a_ver = -1 / a
    let b_ver = point[1] - a_ver * point[0]
    let b = linepoint_1[1] - a * linepoint_1[0]
    let point_long = (b_ver - b) / (a - a_ver)
    let point_lat = a * point_long + b
    return [point_long, point_lat]
}

export const pointNearestPolyline = (point, line) => {
    let plDistance = turf.pointToLineDistance(coordturf['Point'](point), line);
    console.log(line);
    console.log('pl', plDistance);

    for (let i = 0; i < line.length - 1; i++) {
        let cross = getCrossPoint(point, [line[i], line[i + 1]])
        // console.log(cross);
        var ppDistance = turf.distance(coordturf['Point'](cross), coordturf['Point'](point));
        console.log(ppDistance);

        console.log(turf.booleanPointOnLine(coordturf['Point'](cross), coordturf['LineString'](line)));
        if (ppDistance.toFixed(9) == plDistance.toFixed(9)) {
            console.log('cross', cross);
            return cross
        }
    }
}
export const getNearestPointOnLine = (point, line) => {

    var line1 = turf.lineString(line);
    var pt = turf.point(point);
    let nearest = turf.nearestPointOnLine(line1, pt,{units: 'miles'});
    console.log(nearest);
    return nearest
}