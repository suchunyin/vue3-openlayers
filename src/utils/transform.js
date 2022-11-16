export default function ex(params) {
    
}

export const toDDD = (data) => {
    let g1 = parseFloat(data.split('°')[0])//113
    let g2 = data.split('°')[1].split('′') //16′17″
    let g3 = parseFloat(g2[0]) / 60 //16*60
    // console.log(g3);
    let g4 = g2[1].split('″')[0] / 60 / 60   // 17/60/60
    // console.log(g4);
    let rs1 = g1 + g3 + g4
    // console.log(rs1);

    return rs1
}

export const toDFM = (data) => {
    let g1 = Math.floor(data)
    // console.log('g1: ' + g1);

    let g2 = parseFloat('0.' + String(data).split('.')[1]) * 60
    // console.log('g2: ' + g2);

    let g3 = (g2 - Math.floor(g2)) * 60
    // console.log('g3: ' + g3);
    let rs1 = g1 + '°' + Math.floor(g2) + '′' + g3.toFixed(3) + '″'

    // console.log('rs1: ' + rs1);
    return rs1
}
