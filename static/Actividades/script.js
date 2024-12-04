let respuestasUsuarioH, respuestasUsuarioC, respuestasUsuarioK, horaExacta, info, estado;
async function verificarAutenticacion() {
    const response = await fetch('http://127.0.0.1:8000/user/me', {
        method: 'GET',
        headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    });
    info = await response.json();
    data = info
    if (!response.ok || data.error) {
        window.location.href = 'http://127.0.0.1:8000/Skillmap/';
    }else{
        document.querySelector('header').style.opacity = 1;
        let chaside = true;
        let kuder = true;
        let holland = true;
        try {
        const response = await fetch(`http://127.0.0.1:8000/answersC?correo=${encodeURIComponent(info.correo)}&formulario=false`, {
            method: 'GET',
            headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        });
        respuestasUsuarioC = await response.json();
        const chaside = respuestasUsuarioC.formulario;
        } catch (error) {
        console.error('Error al cargar respuestas: ', error.message);
        }
        try {
        const response = await fetch(`http://127.0.0.1:8000/answersK?correo=${encodeURIComponent(info.correo)}&formulario=false`, {
            method: 'GET',
            headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        });
        respuestasUsuarioK = await response.json();
        kuder = respuestasUsuarioK.formularioK;
        } catch (error) {
        console.error('Error al cargar respuestas: ', error.message);
        }
        try {
        const response = await fetch(`http://127.0.0.1:8000/answersH?correo=${encodeURIComponent(info.correo)}&formulario=false`, {
            method: 'GET',
            headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        });
        respuestasUsuarioH = await response.json();
        holland = respuestasUsuarioH.formularioH;
        } catch (error) {
        console.error('Error al cargar respuestas: ', error.message);
        }
        if (!chaside || !kuder || !holland){
            window.location.href = "http://127.0.0.1:8000/Skillmap/Empezar";
        } else {
            try {
                const response = await fetch(`http://127.0.0.1:8000/resultados/calculos/?correo=${encodeURIComponent(info.correo)}`, {
                    method: 'GET',
                    headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token')
                    }
                });
                base = await response.json();
                if (base.error) {
                    resC = calcularResultadosC();
                    resH = calcularResultadosH();
                    resK = calcularResultadosK();                    
                    crearBson(resC, resH, resK);
                }
                
                cargarVideo();
            } catch (error) {
                console.error('Error al cargar respuestas: ', error.message);
            }
        }
    }
}

function calcularResultadosC() {
    let CI = 0, HI = 0, AI = 0, SI = 0, II = 0, DI = 0, EI = 0;
    let CA = 0, HA = 0, AA = 0, SA = 0, IA = 0, DA = 0, EA = 0; 
    const valCI = ["res1", "res12", "res20", "res53", "res64", "res71", "res78", "res85", "res91", "res98"];
    const valHI = ["res9", "res25", "res34", "res41", "res56", "res67", "res74", "res80", "res89", "res95"];
    const valAI = ["res3", "res11", "res21", "res28", "res36", "res45", "res50", "res57", "res81", "res96"];
    const valSI = ["res8", "res16", "res23", "res33", "res44", "res52", "res62", "res70", "res87", "res92"];
    const valII = ["res6", "res19", "res27", "res38", "res47", "res54", "res60", "res75", "res83", "res97"];
    const valDI = ["res5", "res14", "res24", "res31", "res37", "res48", "res58", "res65", "res73", "res84"];
    const valEI = ["res17", "res32", "res35", "res42", "res49", "res61", "res68", "res77", "res88", "res93"];
    const valCA = ["res2", "res15", "res46", "res51"];
    const valHA = ["res30", "res63", "res72", "res86"];
    const valAA = ["res22", "res39", "res76", "res82"];
    const valSA = ["res4", "res29", "res40", "res69"];
    const valIA = ["res10", "res26", "res59", "res90"];
    const valDA = ["res13", "res18", "res43", "res66"];
    const valEA = ["res7", "res55", "res79", "res94"];
    for (const [pregunta, respuesta] of Object.entries(respuestasUsuarioC)) {
    if ((respuesta == true || respuesta == false) && pregunta != "formularioC") {
        if (valCI.includes(pregunta) && respuesta === true) CI++;
        if (valHI.includes(pregunta) && respuesta === true) HI++;
        if (valAI.includes(pregunta) && respuesta === true) AI++;
        if (valSI.includes(pregunta) && respuesta === true) SI++;
        if (valII.includes(pregunta) && respuesta === true) II++;
        if (valDI.includes(pregunta) && respuesta === true) DI++;
        if (valEI.includes(pregunta) && respuesta === true) EI++;
        if (valCA.includes(pregunta) && respuesta === true) CA++;
        if (valHA.includes(pregunta) && respuesta === true) HA++;
        if (valAA.includes(pregunta) && respuesta === true) AA++;
        if (valSA.includes(pregunta) && respuesta === true) SA++;
        if (valIA.includes(pregunta) && respuesta === true) IA++;
        if (valDA.includes(pregunta) && respuesta === true) DA++;
        if (valEA.includes(pregunta) && respuesta === true) EA++;
    }
    }
    const scoresI = [
        { name: "CI", value: CI },
        { name: "HI", value: HI },
        { name: "AI", value: AI },
        { name: "SI", value: SI },
        { name: "II", value: II },
        { name: "DI", value: DI },
        { name: "EI", value: EI }
    ];

    const scoresA = [
        { name: "CA", value: CA },
        { name: "HA", value: HA },
        { name: "AA", value: AA },
        { name: "SA", value: SA },
        { name: "IA", value: IA },
        { name: "DA", value: DA },
        { name: "EA", value: EA }
    ];
    scoresI.sort((a, b) => b.value - a.value);
    scoresA.sort((a, b) => b.value - a.value);

    const scoresCombinados = [...scoresI, ...scoresA];
    const IAOrdenados = scoresCombinados.map(score => score.name);

    return IAOrdenados;
}

function calcularResultadosH() {
    let d1 = 0, d2 = 0, d3 = 0, d4 = 0, d5 = 0, d6 = 0;
    const valA = Array.from({ length: 45 }, (_, i) => `res${i + 1}`);
    const valB = Array.from({ length: 18 }, (_, i) => `res${i + 46}`);
    const valC = Array.from({ length: 18 }, (_, i) => `res${i + 64}`);
    const valD = Array.from({ length: 5 }, (_, i) => `res${i + 82}`);
    const valA1 = ["res3", "res11", "res18", "res21", "res24", "res27", "res35", "res44"];
    const valA2 = ["res8", "res19", "res29", "res31", "res33", "res36", "res37", "res43"];
    const valA3 = ["res4", "res14", "res15", "res16", "res17", "res22"];
    const valA4 = ["res5", "res6", "res7", "res9", "res10", "res26", "res28", "res42"];
    const valA5 = ["res2", "res12", "res23", "res32", "res38", "res39", "res40", "res41"];
    const valA6 = ["res1", "res13", "res20", "res25", "res30", "res34", "res45"];
    const valB1 = ["res46", "res55", "res61"];
    const valB2 = ["res54", "res58", "res59"];
    const valB3 = ["res50", "res53", "res62"];
    const valB4 = ["res48", "res49", "res63"];
    const valB5 = ["res52", "res57", "res60"];
    const valB6 = ["res47", "res51", "res56"];
    const valC1 = ["res65", "res68", "res75"];
    const valC2 = ["res67", "res72", "res73"];
    const valC3 = ["res66", "res77", "res81"];
    const valC4 = ["res64", "res71", "res76"];
    const valC5 = ["res69", "res70", "res80"];
    const valC6 = ["res74", "res78", "res79"];
    for (const [pregunta, respuesta] of Object.entries(respuestasUsuarioH)) {
        if (valA.includes(pregunta)) {
            if (valA1.includes(pregunta) && respuesta === true) d1++;
            if (valA2.includes(pregunta) && respuesta === true) d2++;
            if (valA3.includes(pregunta) && respuesta === true) d3++;
            if (valA4.includes(pregunta) && respuesta === true) d4++;
            if (valA5.includes(pregunta) && respuesta === true) d5++;
            if (valA6.includes(pregunta) && respuesta === true) d6++;
        }
        if (valB.includes(pregunta)) {
            if (valB1.includes(pregunta) && respuesta === "a") d1++;
            if (valB2.includes(pregunta) && respuesta === "a") d2++;
            if (valB3.includes(pregunta) && respuesta === "a") d3++;
            if (valB4.includes(pregunta) && respuesta === "a") d4++;
            if (valB5.includes(pregunta) && respuesta === "a") d5++;
            if (valB6.includes(pregunta) && respuesta === "a") d6++;
        }
        if (valC.includes(pregunta)) {
            if (valC1.includes(pregunta) && respuesta === "a") d1++;
            if (valC2.includes(pregunta) && respuesta === "a") d2++;
            if (valC3.includes(pregunta) && respuesta === "a") d3++;
            if (valC4.includes(pregunta) && respuesta === "a") d4++;
            if (valC5.includes(pregunta) && respuesta === "a") d5++;
            if (valC6.includes(pregunta) && respuesta === "a") d6++;
        }
        if (valD.includes(pregunta)){
            if (pregunta === "res82") {
                if (respuesta === "e") d1++;
                if (respuesta === "a") d2++;
                if (respuesta === "d") d3++;
                if (respuesta === "b") d4++;
                if (respuesta === "c") d5++;
                if (respuesta === "f") d6++;
            }
            if (pregunta === "res83") {
                if (respuesta === "f") d1++;
                if (respuesta === "c") d2++;
                if (respuesta === "e") d3++;
                if (respuesta === "a") d4++;
                if (respuesta === "d") d5++;
                if (respuesta === "b") d6++;
            }
            if (pregunta === "res84") {
                if (respuesta === "c") d1++;
                if (respuesta === "e") d2++;
                if (respuesta === "a") d3++;
                if (respuesta === "f") d4++;
                if (respuesta === "b") d5++;
                if (respuesta === "d") d6++;
            }
            if (pregunta === "res85") {
                if (respuesta === "b") d1++;
                if (respuesta === "f") d2++;
                if (respuesta === "e") d3++;
                if (respuesta === "d") d4++;
                if (respuesta === "a") d5++;
                if (respuesta === "c") d6++;
            }
            if (pregunta === "res86") {
                if (respuesta === "d") d1++;
                if (respuesta === "c") d2++;
                if (respuesta === "f") d3++;
                if (respuesta === "b") d4++;
                if (respuesta === "e") d5++;
                if (respuesta === "a") d6++;
            }
        }
    }
    const scoresD = [
        { name: "D1", value: d1 },
        { name: "D2", value: d2 },
        { name: "D3", value: d3 },
        { name: "D4", value: d4 },
        { name: "D5", value: d5 },
        { name: "D6", value: d6 }
    ];
    scoresD.sort((a, b) => b.value - a.value);
    
    return scoresD.map(score => score.name);
}

function calcularResultadosK() {
    let p0 = 0, p1 = 0, p2 = 0, p3 = 0, p4 = 0, p5 = 0, p6 = 0, p7 = 0, p8 = 0, p9 = 0;
    const valP0 = ["res1_1", "res1_2", "res3_1", "res3_2", "res4_1", "res4_2", "res6_1", "res6_2", "res8_1", "res8_2", "res15_1", "res15_2", "res16_1", "res16_2", "res17_1", "res17_2", "res18_1", "res18_2", "res19_1", "res19_2", "res20_1", "res20_2", "res30_1", "res30_2", "res31_1", "res31_2", "res32_1", "res32_2", "res33_1", "res33_2", "res44_1", "res44_2", "res48_1", "res48_2", "res53_1", "res53_2", "res60_1", "res60_2", "res62_1", "res62_2", "res74_1", "res74_2", "res75_1", "res75_2", "res76_1", "res76_2", "res85_1", "res85_2", "res86_1", "res86_2", "res88_1", "res88_2", "res105_1", "res105_2", "res126_1", "res126_2", "res131_1", "res133_2", "res141_1", "res141_2", "res142_1", "res142_2", "res143_1", "res143_2", "res144_1", "res144_2", "res147_1", "res147_2", "res148_1", "res148_2", "res149_1", "res149_2", "res156_1", "res156_2", "res161_1", "res161_2"];
    const valP1 = ["res10_1", "res10_2", "res11_1", "res11_2", "res12_1", "res12_2", "res14_1", "res14_2", "res56_1", "res56_2", "res66_1", "res66_2", "res68_1", "res68_2", "res70_1", "res70_2", "res78_1", "res78_2", "res79_1", "res79_2", "res80_1", "res80_2", "res82_1", "res82_2", "res83_1", "res83_2", "res84_1", "res84_2", "res92_1", "res92_2", "res95_1", "res95_2", "res96_1", "res96_2", "res98_1", "res98_2", "res107_1", "res107_2", "res109_1", "res109_2", "res112_1", "res112_2", "res121_1", "res121_2", "res123_1", "res123_2", "res124_1", "res124_2", "res125_1", "res125_2", "res135_1", "res135_2", "res136_1", "res136_2", "res1_137", "res137_2", "res140_1", "res140_2", "res150_1", "res150_2", "res152_1", "res152_2", "res153_1", "res153_2", "res164_1", "res164_2", "res167_1", "res167_2", "res168_1", "res168_2"];
    const valP2 = ["res2_1", "res2_2", "res57_1", "res57_2", "res58_2", "res59_2", "res73_1", "res73_2", "res78_1", "res78_2", "res80_1", "res80_2", "res92_1", "res92_2", "res99_1", "res99_2", "res101_1", "res101_2", "res106_1", "res106_2", "res107_1", "res107_2", "res108_1", "res108_2", "res109_1", "res109_2", "res121_1", "res121_2", "res122_2", "res123_2", "res124_1", "res124_2", "res129_1", "res129_2", "res137_1", "res137_2", "res146_1", "res146_2", "res150_1", "res150_2", "res161_2", "res164_1"];
    const valP3 = ["res7_1", "res7_2", "res10_1", "res10_2", "res20_1", "res20_2", "res26_1", "res26_2", "res27_1", "res27_2", "res28_1", "res28_2", "res34_1", "res34_2", "res35_1", "res35_2", "res37_1", "res37_2", "res38_1", "res38_2", "res40_1", "res40_2", "res41_1", "res41_2", "res42_1", "res42_2", "res49_1", "res49_2", "res51_1", "res51_2", "res54_1", "res54_2", "res55_1", "res55_2", "res56_1", "res56_2", "res62_1", "res62_2", "res63_1", "res63_2", "res65_1", "res65_2", "res67_1", "res67_2", "res68_1", "res68_2", "res69_1", "res69_2", "res75_1", "res75_2", "res76_1", "res76_2", "res77_1", "res77_2", "res91_1", "res91_2", "res97_1", "res97_2", "res98_1", "res98_2", "res125_1", "res125_2", "res126_1", "res126_2", "res167_1", "res167_2"];
    const valP4 = ["res2_1", "res2_2", "res8_1", "res8_2", "res10_1", "res10_2", "res17_1", "res17_2", "res23_1", "res23_2", "res25_1", "res25_2", "res29_1", "res29_2", "res43_1", "res43_2", "res45_1", "res45_2", "res48_1", "res48_2", "res51_1", "res51_2", "res52_1", "res52_2", "res53_1", "res53_2", "res57_1", "res57_2", "res58_1", "res58_2", "res60_1", "res60_2", "res62_1", "res62_2", "res63_1", "res63_2", "res66_1", "res66_2", "res67_1", "res67_2", "res73_1", "res73_2", "res78_1", "res78_2", "res79_1", "res79_2", "res80_1", "res80_2", "res87_1", "res87_2", "res90_1", "res90_2", "res95_1", "res95_2", "res100_1", "res100_2", "res101_1", "res101_2", "res102_1", "res102_2", "res103_1", "res103_2", "res114_1", "res114_2", "res115_1", "res115_2", "res116_2", "res128_1", "res128_2", "res129_1", "res129_2", "res143_1", "res143_2", "res144_1", "res144_2", "res155_1", "res155_2", "res157_1", "res157_2", "res160_1"];
    const valP5 = ["res12_1", "res12_2", "res13_1", "res13_2", "res14_1", "res14_2", "res25_1", "res25_2", "res26_1", "res26_2", "res53_1", "res53_2", "res54_1", "res54_2", "res56_1", "res56_2", "res67_1", "res67_2", "res90_1", "res90_2", "res91_1", "res91_2", "res95_1", "res95_2", "res98_1", "res98_2", "res106_1", "res106_2", "res108_1", "res108_2", "res111_1", "res111_2", "res118_1", "res118_2", "res119_1", "res119_2", "res122_1", "res122_2", "res125_1", "res125_2", "res132_1", "res132_2", "res147_1", "res147_2", "res160_1", "res160_2", "res163_1", "res163_2", "res165_1", "res165_2", "res167_1", "res167_2"];
    const valP6 = ["res29_1", "res29_2", "res34_1", "res34_2", "res45_1", "res45_2", "res46_1", "res46_2", "res47_1", "res47_2", "res49_1", "res49_2", "res59_1", "res59_2", "res71_1", "res71_2", "res77_1", "res77_2", "res90_1", "res90_2", "res91_1", "res91_2", "res114_1", "res114_2", "res115_1", "res118_1", "res118_2", "res119_1", "res119_2", "res130_1", "res130_2", "res132_1", "res132_2", "res1_144", "res144_2", "res147_1", "res147_2", "res160_1", "res160_2"];
    const valP7 = ["res8_1", "res8_2", "res14_1", "res14_2", "res27_1", "res27_2", "res28_1", "res28_2", "res41_1", "res41_2", "res65_1", "res65_2", "res66_1", "res66_2", "res79_1", "res79_2", "res83_1", "res83_2", "res101_1", "res101_2", "res126_1", "res126_2", "res139_1", "res139_2", "res149_1", "res149_2", "res165_1", "res165_2"];
    const valP8 = ["res2_1", "res2_2", "res21_1", "res21_2", "res23_1", "res23_2", "res34_1", "res34_2", "res36_1", "res36_2", "res37_1", "res37_2", "res38_1", "res38_2", "res40_1", "res40_2", "res49_1", "res49_2", "res51_1", "res51_2", "res54_1", "res54_2", "res58_1", "res58_2", "res59_1", "res59_2", "res60_1", "res60_2", "res66_1", "res66_2", "res69_1", "res69_2", "res79_1", "res79_2", "res81_1", "res81_2", "res83_1", "res83_2", "res85_1", "res85_2", "res87_1", "res87_2", "res97_1", "res97_2", "res99_1", "res99_2", "res115_1", "res115_2", "res118_1", "res118_2", "res136_1", "res136_2", "res139_1", "res139_2", "res140_1", "res140_2", "res148_1", "res148_2", "res152_1", "res152_2", "res163_1", "res163_2", "res168_1", "res168_2"];
    const valP9 = ["res9_1", "res9_2", "res20_1", "res20_2", "res24_1", "res24_2", "res27_1", "res27_2", "res29_1", "res29_2", "res36_1", "res36_2", "res37_1", "res37_2", "res40_1", "res40_2", "res42_1", "res42_2", "res45_1", "res45_2", "res46_1", "res46_2", "res48_1", "res48_2", "res51_1", "res51_2", "res52_1", "res52_2", "res55_1", "res55_2", "res59_1", "res59_2", "res64_1", "res64_2", "res68_1", "res68_2", "res71_1", "res71_2", "res78_1", "res78_2", "res81_1", "res81_2", "res82_1", "res82_2", "res85_1", "res85_2", "res87_1", "res87_2", "res89_1", "res89_2", "res93_1", "res93_2", "res94_1", "res94_2", "res99_1", "res99_2", "res100_1", "res100_2", "res102_1", "res102_2", "res113_1", "res113_2", "res119_1", "res119_2", "res121_1", "res121_2", "res123_1", "res123_2", "res130_1", "res130_2", "res136_1", "res136_2", "res138_1", "res138_2", "res146_1", "res146_2", "res149_1", "res149_2", "res150_1", "res152_1", "res152_2", "res154_1", "res154_2", "res155_1", "res155_2", "res157_1", "res157_2", "res159_1", "res159_2", "res160_1", "res160_2", "res161_1", "res161_2", "res162_1", "res162_2", "res168_1", "res168_2"];
    const respuestasP0 = {
        "res1_1": ["b", "c"],
        "res1_2": ["a"],
        "res3_1": ["i"],
        "res3_2": ["g", "h"],
        "res4_1": ["k"],
        "res4_2": ["j", "l"],
        "res6_1": ["q", "r"],
        "res6_2": ["p"],
        "res8_1": ["x"],
        "res8_2": ["v", "w"],
        "res15_1": ["q", "s"],
        "res15_2": ["r"],
        "res16_1": ["u"],
        "res16_2": ["t", "v"],
        "res17_1": ["x"],
        "res17_2": ["w", "y"],
        "res18_1": ["a", "b"],
        "res18_2": ["z"],
        "res19_1": ["e"],
        "res19_2": ["c", "d"],
        "res20_1": ["g"],
        "res20_2": ["f", "h"],
        "res30_1": ["l"],
        "res30_2": ["j", "k"],
        "res31_1": ["n"],
        "res31_2": ["m", "n", "o"],
        "res32_1": ["q", "r"],
        "res32_2": ["p"],
        "res33_1": ["s", "u"],
        "res33_2": ["t"],
        "res44_1": ["a"],
        "res44_2": ["z", "b"],
        "res48_1": ["n"],
        "res48_2": ["l", "m"],
        "res53_1": ["c"],
        "res53_2": ["a", "b"],
        "res60_1": ["x"],
        "res60_2": ["v", "w"],
        "res62_1": ["c", "d"],
        "res62_2": ["b"],
        "res74_1": ["n"],
        "res74_2": ["l", "m"],
        "res75_1": ["o"],
        "res75_2": ["p", "q"],
        "res76_1": ["r", "s"],
        "res76_2": ["t"],
        "res85_1": ["t"],
        "res85_2": ["s", "u"],
        "res86_1": ["v", "w"],
        "res86_2": ["x"],
        "res88_1": ["c"],
        "res88_2": ["b", "d"],
        "res105_1": ["b", "c"],
        "res105_2": ["a"],
        "res126_1": ["m"],
        "res126_2": ["l", "n"],
        "res131_1": ["c"],
        "res133_2": ["a", "b"],
        "res141_1": ["h", "i"],
        "res141_2": ["g"],
        "res142_1": ["f", "g"],
        "res142_2": ["e"],
        "res143_1": ["j"],
        "res143_2": ["h", "i"],
        "res144_1": ["k"],
        "res144_2": ["l", "m"],
        "res147_1": ["p"],
        "res147_2": ["n", "o"],
        "res148_1": ["x"],
        "res148_2": ["w", "y"],
        "res149_1": ["a"],
        "res149_2": ["z", "b"],
        "res156_1": ["c"],
        "res156_2": ["d", "e"],
        "res161_1": ["n"],
        "res161_2": ["m", "o"]
    };

    const respuestasP1 = {
        "res10_1": ["d"],
        "res10_2": ["b", "c"],
        "res11_1": ["g"],
        "res11_2": ["e", "f"],
        "res12_1": ["j"],
        "res12_2": ["h", "i"],
        "res14_1": ["n"],
        "res14_2": ["o", "p"],
        "res56_1": ["k"],
        "res56_2": ["j", "l"],
        "res66_1": ["p"],
        "res66_2": ["n", "o"],
        "res68_1": ["u"],
        "res68_2": ["t", "v"],
        "res70_1": ["z"],
        "res70_2": ["a", "b"],
        "res78_1": ["y"],
        "res78_2": ["x", "z"],
        "res79_1": ["a"],
        "res79_2": ["b", "c"],
        "res80_1": ["d"],
        "res80_2": ["e", "f"],
        "res82_1": ["j"],
        "res82_2": ["k", "l"],
        "res83_1": ["n"],
        "res83_2": ["m", "o"],
        "res84_1": ["p"],
        "res84_2": ["q", "r"],
        "res92_1": ["p"],
        "res92_2": ["n", "o"],
        "res95_1": ["y"],
        "res95_2": ["w", "x"],
        "res96_1": ["a"],
        "res96_2": ["z", "b"],
        "res98_1": ["h"],
        "res98_2": ["f", "g"],
        "res107_1": ["g"],
        "res107_2": ["h", "i"],
        "res109_1": ["o"],
        "res109_2": ["m", "n"],
        "res112_1": ["w"],
        "res112_2": ["v", "x"],
        "res121_1": ["w"],
        "res121_2": ["x", "y"],
        "res123_1": ["c"],
        "res123_2": ["d", "e"],
        "res124_1": ["h"],
        "res124_2": ["f", "g"],
        "res125_1": ["j"],
        "res125_2": ["i", "k"],
        "res135_1": ["o"],
        "res135_2": ["m", "n"],
        "res136_1": ["r"],
        "res136_2": ["p", "q"],
        "res137_1": ["t"],
        "res137_2": ["s", "u"],
        "res140_1": ["c"],
        "res140_2": ["b", "d"],
        "res150_1": ["g"],
        "res150_2": ["f", "h"],
        "res152_1": ["l"],
        "res152_2": ["m", "n"],
        "res153_1": ["o"],
        "res153_2": ["p", "q"],
        "res164_1": ["x"],
        "res164_2": ["v", "w"],
        "res167_1": ["e"],
        "res167_2": ["f", "g"],
        "res168_1": ["h"],
        "res168_2": ["i", "j"]
    };
    
    const respuestasP2 = {
        "res2_1": ["e"],
        "res2_2": ["d", "f"],
        "res57_1": ["o"],
        "res57_2": ["m"],
        "res58_2": ["q", "r"],
        "res59_2": ["t", "u"],
        "res73_1": ["j"],
        "res73_2": ["i", "k"],
        "res78_1": ["x"],
        "res78_2": ["y", "z"],
        "res80_1": ["f"],
        "res80_2": ["d"],
        "res92_1": ["o"],
        "res92_2": ["n", "p"],
        "res99_1": ["i"],
        "res99_2": ["j", "k"],
        "res101_1": ["o"],
        "res101_2": ["p", "q"],
        "res106_1": ["f"],
        "res106_2": ["e"],
        "res107_1": ["h"],
        "res107_2": ["g", "i"],
        "res108_1": ["k"],
        "res108_2": ["j", "l"],
        "res109_1": ["o"],
        "res109_2": ["m", "n"],
        "res121_1": ["x"],
        "res121_2": ["w", "y"],
        "res122_2": ["z", "b"],
        "res123_2": ["c", "d"],
        "res124_1": ["g"],
        "res124_2": ["f", "h"],
        "res129_1": ["u"],
        "res129_2": ["v", "w"],
        "res137_1": ["u"],
        "res137_2": ["s", "t"],
        "res146_1": ["t"],
        "res146_2": ["u", "v"],
        "res150_1": ["h"],
        "res150_2": ["f", "g"],
        "res161_2": ["n"],
        "res164_1": ["v"]
    };
    
    const respuestasP3 = {
        "res7_1": ["u"],
        "res7_2": ["s", "t"],
        "res10_1": ["b"],
        "res10_2": ["c", "d"],
        "res20_1": ["g"],
        "res20_2": ["f", "h"],
        "res26_1": ["y"],
        "res26_2": ["x", "z"],
        "res27_1": ["a"],
        "res27_2": ["b", "c"],
        "res28_1": ["e"],
        "res28_2": ["d", "f"],
        "res34_1": ["v"],
        "res34_2": ["w", "x"],
        "res35_1": ["z"],
        "res35_2": ["y", "a"],
        "res37_1": ["f"],
        "res37_2": ["e", "g"],
        "res38_1": ["j"],
        "res38_2": ["h", "i"],
        "res40_1": ["o"],
        "res40_2": ["n", "p"],
        "res41_1": ["s"],
        "res41_2": ["q", "r"],
        "res42_1": ["t", "u"],
        "res42_2": ["v"],
        "res49_1": ["p"],
        "res49_2": ["o", "q"],
        "res51_1": ["v"],
        "res51_2": ["u", "w"],
        "res54_1": ["d"],
        "res54_2": ["e", "f"],
        "res55_1": ["g"],
        "res55_2": ["h", "i"],
        "res56_1": ["k"],
        "res56_2": ["j", "l"],
        "res62_1": ["d"],
        "res62_2": ["b", "c"],
        "res63_1": ["e"],
        "res63_2": ["f", "g"],
        "res65_1": ["l"],
        "res65_2": ["k", "m"],
        "res67_1": ["s"],
        "res67_2": ["q", "r"],
        "res68_1": ["v"],
        "res68_2": ["t", "u"],
        "res69_1": ["y"],
        "res69_2": ["x"],
        "res75_1": ["q"],
        "res75_2": ["o", "p"],
        "res76_1": ["t"],
        "res76_2": ["r", "s"],
        "res77_1": ["v"],
        "res77_2": ["u", "w"],
        "res91_1": ["k"],
        "res91_2": ["l", "m"],
        "res97_1": ["c", "d"],
        "res97_2": ["e"],
        "res98_1": ["g"],
        "res98_2": ["f", "h"],
        "res125_1": ["i", "j"],
        "res125_2": ["k"],
        "res126_1": ["l"],
        "res126_2": ["m", "n"],
        "res167_1": ["g"],
        "res167_2": ["e", "f"]
    };

    const respuestasP4 = {
        "res2_1": ["f"],
        "res2_2": ["d", "e"],
        "res8_1": ["v"],
        "res8_2": ["w", "x"],
        "res10_1": ["c"],
        "res10_2": ["b", "d"],
        "res17_1": ["y"],
        "res17_2": ["w", "x"],
        "res23_1": ["p"],
        "res23_2": ["o", "q"],
        "res25_1": ["u"],
        "res25_2": ["v", "w"],
        "res29_1": ["i"],
        "res29_2": ["g", "h"],
        "res43_1": ["w"],
        "res43_2": ["x", "y"],
        "res45_1": ["c"],
        "res45_2": ["d", "e"],
        "res48_1": ["l"],
        "res48_2": ["m", "n"],
        "res51_1": ["u"],
        "res51_2": ["v", "w"],
        "res52_1": ["y"],
        "res52_2": ["x", "z"],
        "res53_1": ["b"],
        "res53_2": ["a", "c"],
        "res57_1": ["m"],
        "res57_2": ["n", "o"],
        "res58_1": ["q"],
        "res58_2": ["p", "r"],
        "res60_1": ["w"],
        "res60_2": ["v", "x"],
        "res62_1": ["b"],
        "res62_2": ["c", "d"],
        "res63_1": ["g"],
        "res63_2": ["e", "f"],
        "res66_1": ["o"],
        "res66_2": ["n", "p"],
        "res67_1": ["r"],
        "res67_2": ["q", "s"],
        "res73_1": ["i", "k"],
        "res73_2": ["j"],
        "res78_1": ["z"],
        "res78_2": ["x", "y"],
        "res79_1": ["b"],
        "res79_2": ["a", "c"],
        "res80_1": ["d"],
        "res80_2": ["e", "f"],
        "res87_1": ["a"],
        "res87_2": ["y", "z"],
        "res90_1": ["i", "j"],
        "res90_2": ["h"],
        "res95_1": ["x"],
        "res95_2": ["w", "y"],
        "res100_1": ["l"],
        "res100_2": ["m", "n"],
        "res101_1": ["p"],
        "res101_2": ["o", "q"],
        "res102_1": ["s"],
        "res102_2": ["r", "t"],
        "res103_1": ["v"],
        "res103_2": ["u", "w"],
        "res114_1": ["d"],
        "res114_2": ["b"],
        "res115_1": ["f", "g"],
        "res115_2": ["e"],
        "res116_2": ["h", "j"],
        "res128_1": ["r","t"],
        "res128_2": ["s"],
        "res129_1": ["v"],
        "res129_2": ["u", "w"],
        "res143_1": ["m"],
        "res143_2": ["k", "l"],
        "res144_1": ["n"],
        "res144_2": ["o", "p"],
        "res155_1": ["w"],
        "res155_2": ["u", "v"],
        "res157_1": ["c"],
        "res157_2": ["a", "b"],
        "res160_1": ["l"]
    };
    
    const respuestasP5 = {
        "res12_1": ["h"],
        "res12_2": ["i", "j"],
        "res13_1": ["m"],
        "res13_2": ["k", "l"],
        "res14_1": ["p"],
        "res14_2": ["n", "o"],
        "res25_1": ["w"],
        "res25_2": ["u", "v"],
        "res26_1": ["x"],
        "res26_2": ["y", "z"],
        "res53_1": ["a"],
        "res53_2": ["b", "c"],
        "res54_1": ["f"],
        "res54_2": ["d", "e"],
        "res56_1": ["j"],
        "res56_2": ["k", "l"],
        "res67_1": ["q"],
        "res67_2": ["r", "s"],
        "res90_1": ["h"],
        "res90_2": ["i", "j"],
        "res91_1": ["l"],
        "res91_2": ["k", "m"],
        "res95_1": ["w"],
        "res95_2": ["x", "y"],
        "res98_1": ["f"],
        "res98_2": ["g", "h"],
        "res106_1": ["e"],
        "res106_2": ["d", "f"],
        "res108_1": ["j"],
        "res108_2": ["k", "l"],
        "res111_1": ["t"],
        "res111_2": ["s", "u"],
        "res118_1": ["p"],
        "res118_2": ["n", "o"],
        "res119_1": ["r", "s"],
        "res119_2": ["q"],
        "res122_1": ["b"],
        "res122_2": ["z", "a"],
        "res125_1": ["k"],
        "res125_2": ["i", "j"],
        "res132_1": ["d"],
        "res132_2": ["e", "f"],
        "res147_1": ["y"],
        "res147_2": ["w", "x"],
        "res160_1": ["l"],
        "res160_2": ["j", "k"],
        "res163_1": ["t"],
        "res163_2": ["s", "u"],
        "res165_1": ["z"],
        "res165_2": ["y", "a"],
        "res167_1": ["f"],
        "res167_2": ["e", "g"]
    };
    
    const respuestasP6 = {
        "res29_1": ["g"],
        "res29_2": ["h", "i"],
        "res34_1": ["w", "x"],
        "res34_2": ["v"],
        "res45_1": ["d"],
        "res45_2": ["c", "e"],
        "res46_1": ["h"],
        "res46_2": ["f", "g"],
        "res47_1": ["i"],
        "res47_2": ["j", "k"],
        "res49_1": ["o"],
        "res49_2": ["p", "q"],
        "res59_1": ["t"],
        "res59_2": ["s", "u"],
        "res71_1": ["e"],
        "res71_2": ["c", "d"],
        "res77_1": ["w"],
        "res77_2": ["u", "v"],
        "res90_1": ["i"],
        "res90_2": ["h", "j"],
        "res91_1": ["m"],
        "res91_2": ["k", "l"],
        "res114_1": ["b"],
        "res114_2": ["c", "d"],
        "res115_1": ["e"],
        "res118_1": ["o"],
        "res118_2": ["n", "p"],
        "res119_1": ["s"],
        "res119_2": ["q", "r"],
        "res130_1": ["x"],
        "res130_2": ["y", "z"],
        "res132_1": ["e"],
        "res132_2": ["d", "f"],
        "res144_1": ["o"],
        "res144_2": ["n", "p"],
        "res147_1": ["x"],
        "res147_2": ["w", "y"],
        "res160_1": ["k"],
        "res160_2": ["j", "l"]
    };

    const respuestasP7 = {
        "res8_1": ["w"],
        "res8_2": ["v", "x"],
        "res14_1": ["o"],
        "res14_2": ["n", "p"],
        "res27_1": ["c"],
        "res27_2": ["a", "b"],
        "res28_1": ["f"],
        "res28_2": ["d", "e"],
        "res41_1": ["r"],
        "res41_2": ["q", "s"],
        "res65_1": ["m"],
        "res65_2": ["k", "l"],
        "res66_1": ["o"],
        "res66_2": ["n", "p"],
        "res79_1": ["c"],
        "res79_2": ["a", "b"],
        "res83_1": ["m"],
        "res83_2": ["n", "o"],
        "res101_1": ["o"],
        "res101_2": ["p", "q"],
        "res126_1": ["m"],
        "res126_2": ["l", "n"],
        "res139_1": ["z"],
        "res139_2": ["y", "a"],
        "res149_1": ["c"],
        "res149_2": ["d", "e"],
        "res165_1": ["a"],
        "res165_2": ["y", "z"]
    };
    
    const respuestasP8 = {
        "res2_1": ["d"],
        "res2_2": ["e", "f"],
        "res21_1": ["i"],
        "res21_2": ["j", "k"],
        "res23_1": ["o"],
        "res23_2": ["p", "q"],
        "res34_1": ["w"],
        "res34_2": ["v", "x"],
        "res36_1": ["b"],
        "res36_2": ["c", "d"],
        "res37_1": ["g"],
        "res37_2": ["e", "f"],
        "res38_1": ["i"],
        "res38_2": ["h", "j"],
        "res40_1": ["o"],
        "res40_2": ["n", "p"],
        "res49_1": ["q"],
        "res49_2": ["o", "p"],
        "res51_1": ["w"],
        "res51_2": ["u", "v"],
        "res54_1": ["e"],
        "res54_2": ["d", "f"],
        "res58_1": ["r"],
        "res58_2": ["p", "q"],
        "res59_1": ["u"],
        "res59_2": ["s", "t"],
        "res60_1": ["v"],
        "res60_2": ["w", "x"],
        "res66_1": ["n"],
        "res66_2": ["o", "p"],
        "res69_1": ["w"],
        "res69_2": ["x", "y"],
        "res79_1": ["b"],
        "res79_2": ["a", "c"],
        "res81_1": ["h"],
        "res81_2": ["g", "i"],
        "res83_1": ["o"],
        "res83_2": ["m", "n"],
        "res85_1": ["u"],
        "res85_2": ["s", "t"],
        "res87_1": ["y"],
        "res87_2": ["z", "a"],
        "res97_1": ["d", "e"],
        "res97_2": ["c"],
        "res99_1": ["i"],
        "res99_2": ["j", "k"],
        "res115_1": ["e"],
        "res115_2": ["f", "g"],
        "res118_1": ["n"],
        "res118_2": ["o", "p"],
        "res136_1": ["q"],
        "res136_2": ["p", "r"],
        "res139_1": ["a"],
        "res139_2": ["y", "z"],
        "res140_1": ["d"],
        "res140_2": ["b", "c"],
        "res148_1": ["b"],
        "res148_2": ["z", "a"],
        "res152_1": ["n"],
        "res152_2": ["l", "m"],
        "res163_1": ["u"],
        "res163_2": ["s", "t"],
        "res168_1": ["i"],
        "res168_2": ["h", "j"]
    };
    
    const respuestasP9 = {
        "res9_1": ["a"],
        "res9_2": ["y", "z"],
        "res20_1": ["h"],
        "res20_2": ["f", "g"],
        "res24_1": ["t"],
        "res24_2": ["r", "s"],
        "res27_1": ["b"],
        "res27_2": ["c"],
        "res29_1": ["h"],
        "res29_2": ["g", "i"],
        "res36_1": ["d"],
        "res36_2": ["b", "c"],
        "res37_1": ["e"],
        "res37_2": ["f", "g"],
        "res40_1": ["p"],
        "res40_2": ["n", "o"],
        "res42_1": ["v"],
        "res42_2": ["t", "u"],
        "res45_1": ["e"],
        "res45_2": ["c", "d"],
        "res46_1": ["g"],
        "res46_2": ["f", "h"],
        "res48_1": ["m"],
        "res48_2": ["l", "n"],
        "res51_1": ["u"],
        "res51_2": ["v", "w"],
        "res52_1": ["z"],
        "res52_2": ["x", "y"],
        "res55_1": ["h"],
        "res55_2": ["g", "i"],
        "res59_1": ["s"],
        "res59_2": ["t", "u"],
        "res64_1": ["h"],
        "res64_2": ["i", "j"],
        "res68_1": ["t", "v"],
        "res68_2": ["u"],
        "res71_1": ["d"],
        "res71_2": ["c", "e"],
        "res78_1": ["x"],
        "res78_2": ["y", "z"],
        "res81_1": ["g"],
        "res81_2": ["h", "i"],
        "res82_1": ["l"],
        "res82_2": ["j", "k"],
        "res85_1": ["s"],
        "res85_2": ["t", "u"],
        "res87_1": ["z"],
        "res87_2": ["y", "a"],
        "res89_1": ["f"],
        "res89_2": ["e"],
        "res93_1": ["r"],
        "res93_2": ["q", "s"],
        "res94_1": ["t"],
        "res94_2": ["u", "v"],
        "res99_1": ["j"],
        "res99_2": ["i", "k"],
        "res100_1": ["l", "n"],
        "res100_2": ["m"],
        "res102_1": ["r"],
        "res102_2": ["s", "t"],
        "res113_1": ["a"],
        "res113_2": ["y", "z"],
        "res119_1": ["q"],
        "res119_2": ["r", "s"],
        "res121_1": ["y"],
        "res121_2": ["w", "x"],
        "res123_1": ["d", "e"],
        "res123_2": ["c"],
        "res130_1": ["y", "z"],
        "res130_2": ["x"],
        "res136_1": ["p"],
        "res136_2": ["q", "r"],
        "res138_1": ["w"],
        "res138_2": ["v", "x"],
        "res146_1": ["v"],
        "res146_2": ["t", "u"],
        "res149_1": ["d"],
        "res149_2": ["c"],
        "res150_1": ["g", "h"],
        "res152_1": ["l"],
        "res152_2": ["m", "n"],
        "res154_1": ["s"],
        "res154_2": ["r", "t"],
        "res155_1": ["u", "v"],
        "res155_2": ["w"],
        "res157_1": ["a"],
        "res157_2": ["b", "c"],
        "res159_1": ["i"],
        "res159_2": ["g", "h"],
        "res160_1": ["j"],
        "res160_2": ["k", "l"],
        "res161_1": ["m", "o"],
        "res161_2": ["n"],
        "res162_1": ["r"],
        "res162_2": ["p", "q"],
        "res168_1": ["j"],
        "res168_2": ["h", "i"]
    };
    for (const [pregunta, respuesta] of Object.entries(respuestasUsuarioK)) {
        if (valP0.includes(pregunta)) {
            for (const elemento of valP0) {
                if (pregunta === elemento && respuestasP0[elemento]?.includes(respuesta)) {
                    p0++;
                }
            }
        }
        if (valP1.includes(pregunta)) {
            for (const elemento of valP1) {
                if (pregunta === elemento && respuestasP1[elemento]?.includes(respuesta)) {
                    p1++;
                }
            }
        }
        if (valP2.includes(pregunta)) {
            for (const elemento of valP2) {
                if (pregunta === elemento && respuestasP2[elemento]?.includes(respuesta)) {
                    p2++;
                }
            }
        }
        if (valP3.includes(pregunta)) {
            for (const elemento of valP3) {
                if (pregunta === elemento && respuestasP3[elemento]?.includes(respuesta)) {
                    p3++;
                }
            }
        }
        if (valP4.includes(pregunta)) {
            for (const elemento of valP4) {
                if (pregunta === elemento && respuestasP4[elemento]?.includes(respuesta)) {
                    p4++;
                }
            }
        }
        if (valP5.includes(pregunta)) {
            for (const elemento of valP5) {
                if (pregunta === elemento && respuestasP5[elemento]?.includes(respuesta)) {
                    p5++;
                }
            }
        }
        if (valP6.includes(pregunta)) {
            for (const elemento of valP6) {
                if (pregunta === elemento && respuestasP6[elemento]?.includes(respuesta)) {
                    p6++;
                }
            }
        }
        if (valP7.includes(pregunta)) {
            for (const elemento of valP7) {
                if (pregunta === elemento && respuestasP7[elemento]?.includes(respuesta)) {
                    p7++;
                }
            }
        }
        if (valP8.includes(pregunta)) {
            for (const elemento of valP8) {
                if (pregunta === elemento && respuestasP8[elemento]?.includes(respuesta)) {
                    p8++;
                }
            }
        }
        if (valP9.includes(pregunta)) {
            for (const elemento of valP9) {
                if (pregunta === elemento && respuestasP9[elemento]?.includes(respuesta)) {
                    p9++;
                }
            }
        }
    }
    perP0 = valP0.length / p0;
    perP1 = valP1.length / p1;
    perP2 = valP2.length / p2;
    perP3 = valP3.length / p3;
    perP4 = valP4.length / p4;
    perP5 = valP5.length / p5;
    perP6 = valP6.length / p6;
    perP7 = valP7.length / p7;
    perP8 = valP8.length / p8;
    perP9 = valP9.length / p9;
    const scoresP = [
        { name: "P0", value: perP0 },
        { name: "P1", value: perP1 },
        { name: "P2", value: perP2 },
        { name: "P3", value: perP3 },
        { name: "P4", value: perP4 },
        { name: "P5", value: perP5 },
        { name: "P6", value: perP6 },
        { name: "P7", value: perP7 },
        { name: "P8", value: perP8 },
        { name: "P9", value: perP9 }
    ];
    scoresP.sort((a, b) => b.value - a.value);
    
    return scoresP.map(score => score.name);
}

async function crearBson (resC, resH, resK) {
    const resultados = {
        id_usuario: (info).correo,
        In1: resC[0],
        In2: resC[1],
        In3: resC[2],
        In4: resC[3],
        In5: resC[4],
        In6: resC[5],
        In7: resC[6],
        Ha1: resC[7],
        Ha2: resC[8],
        Ha3: resC[9],
        Ha4: resC[10],
        Ha5: resC[11],
        Ha6: resC[12],
        Ha7: resC[13],
        D1: resH[0],
        D2: resH[1],
        D3: resH[2],
        D4: resH[3],
        D5: resH[4],
        D6: resH[5],
        EI1: resK[0],
        EI2: resK[1],
        EI3: resK[2],
        EI4: resK[3],
        EI5: resK[4],
        EI6: resK[5],
        EI7: resK[6],
        EI8: resK[7],
        EI9: resK[8],
        EI10: resK[9],
        id_carrera1: "NA",
        id_carrera2: "NA",
        id_carrera3: "NA",
        id_carrera4: "NA",
        id_carrera5: "NA",
        id_carrera6: "NA",
        id_carrera7: "NA",
        id_carrera8: "NA",
        val_carrera1: 0.0,
        val_carrera2: 0.0,
        val_carrera3: 0.0,
        val_carrera4: 0.0,
        val_carrera5: 0.0,
        val_carrera6: 0.0,
        val_carrera7: 0.0,
        val_carrera8: 0.0,
        Actividad: false
    };
    try {
        const response = await fetch('http://127.0.0.1:8000/resultados', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(resultados),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
    } catch (error) {
        console.error('Error during registration:', error);
    }
}

async function cargarVideo () {
    try {
        const response = await fetch(`http://127.0.0.1:8000/resultados/video?correo=${encodeURIComponent((info).correo)}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        estado = data.estado;
        if (data.error){
            console.log(data.error)
        }else {
            ocultarEmergente();
            if (estado) {
                const botonRegresar = document.getElementById("regresar")
                botonRegresar.classList.remove('hidden');
                botonRegresar.classList.add('enviar');
            }
            const videoUrl = `http://127.0.0.1:8000/static/Videos/${data.exito}`;
            const videoElement = document.querySelector('video');
            videoElement.src = videoUrl;
            if (!estado){
                videoElement.addEventListener('ended', function() {
                    const finalizarBtn = document.getElementById('finalizarBtn');
                    finalizarBtn.classList.remove('hidden');
                    finalizarBtn.classList.add('enviar');
                    videoElement.removeEventListener('pause', preventPause);
                });

                function preventPause() {
                    if (videoElement.paused) {
                        videoElement.play();
                    }
                }
                videoElement.addEventListener('pause', preventPause);

                videoElement.addEventListener('play', function() {
                    horaExacta = new Date();
                });
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function terminarActividad() {
    try {
        abrirEmergente("Se estan procesando sus datos, no cierre esta ventana")
        let correo = info.correo
        const response = await fetch(`http://127.0.0.1:8000/resultados/?correo=${encodeURIComponent(correo)}`, {
            method: 'PUT',
            headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
            }
        });
        data = await response.json();
        if (data.exito) {
            const response = await fetch(`http://127.0.0.1:8000/banda/svmVideo`, {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: correo,
                    horaExacta: horaExacta.toISOString()
                })
            });
            data = await response.json();
            if (data.exito) {
                ocultarEmergente();
                window.location.href = 'http://127.0.0.1:8000/Skillmap/Empezar';
            }
            
        }
    } catch (error) {
        console.error('Error al cargar respuestas: ', error.message);
    }

}

function regresar() {
    window.location.href = 'http://127.0.0.1:8000/Skillmap/Empezar';
}


function abrirEmergente(msg) {
    const emergente = document.getElementById('miEmergente');
    const mensaje = document.getElementById('Mensaje');
    mensaje.innerText = msg;
    emergente.style.display = "block";
}

function ocultarEmergente() {
    const emergente = document.getElementById('miEmergente');
    if (emergente) {
        emergente.style.display = "none";
    }
}

function valRegresar() {
    const botonRegresar = document.getElementById("regresar");
    return botonRegresar.classList.contains('enviar')

}

document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacion();
    const cerrarSesionBtn = document.getElementById('cerrar_sesion');
    const emergente = document.getElementById('miEmergente');
    const mensaje = document.getElementById('Mensaje');

    if (emergente && mensaje) {
        abrirEmergente("Tome un respiro mientras espera por su video");
    }

    if (cerrarSesionBtn) {
        cerrarSesionBtn.addEventListener('click', function() {
            localStorage.removeItem('access_token');
            window.location.href = 'http://127.0.0.1:8000/Skillmap/';
        });
    } else {
        console.error('El botón con id "cerrar_sesion" no se encontró.');
    }    
});