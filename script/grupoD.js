const equipos = [
    "EE.UU.",
    "Paraguay",
    "Turquía",
    "Australia"
];

// Cambiar por A, B, C, etc.
const CLAVE_STORAGE = "grupoA_resultados";

function guardarResultados() {

    const resultados = [];

    document.querySelectorAll("#partidos tr").forEach((row) => {

        const td = row.querySelectorAll("td");

        resultados.push({
            local: td[5].querySelector("input").value,
            visita: td[7].querySelector("input").value
        });

    });

    localStorage.setItem(
        CLAVE_STORAGE,
        JSON.stringify(resultados)
    );
}

function cargarResultados() {

    const resultados = JSON.parse(
        localStorage.getItem(CLAVE_STORAGE)
    );

    if (!resultados) return;

    document.querySelectorAll("#partidos tr").forEach((row, i) => {

        const td = row.querySelectorAll("td");

        if (resultados[i]) {

            td[5].querySelector("input").value =
                resultados[i].local;

            td[7].querySelector("input").value =
                resultados[i].visita;
        }

    });

}

function actualizarTabla() {

    const data = {};

    equipos.forEach(e => {

        data[e] = {
            equipo: e,
            pj: 0,
            pg: 0,
            pe: 0,
            pp: 0,
            gf: 0,
            gc: 0,
            dg: 0,
            pts: 0
        };

    });

    document.querySelectorAll("#partidos tr").forEach(row => {

        const td = row.querySelectorAll("td");

        const local = td[4].innerText.trim();
        const visita = td[8].innerText.trim();

        const gl = td[5].querySelector("input").value;
        const gv = td[7].querySelector("input").value;

        if (gl === "" || gv === "") return;

        const l = parseInt(gl);
        const v = parseInt(gv);

        if (!data[local] || !data[visita]) {
            console.error(
                "Equipo no encontrado:",
                local,
                visita
            );
            return;
        }

        data[local].pj++;
        data[visita].pj++;

        data[local].gf += l;
        data[local].gc += v;

        data[visita].gf += v;
        data[visita].gc += l;

        if (l > v) {

            data[local].pg++;
            data[local].pts += 3;

            data[visita].pp++;

        }
        else if (v > l) {

            data[visita].pg++;
            data[visita].pts += 3;

            data[local].pp++;

        }
        else {

            data[local].pe++;
            data[visita].pe++;

            data[local].pts++;
            data[visita].pts++;

        }

    });

    Object.values(data).forEach(e => {
        e.dg = e.gf - e.gc;
    });

    const tabla = Object.values(data).sort((a, b) =>
        b.pts - a.pts ||
        b.dg - a.dg ||
        b.gf - a.gf
    );

    const tbody = document.getElementById(
        "tablaPosiciones"
    );

    tbody.innerHTML = "";

    tabla.forEach((e, i) => {

        let clase = "";

        if (i === 0) clase = "first";
        if (i === 1) clase = "second";

        tbody.innerHTML += `
            <tr class="${clase}">
                <td>${i + 1}</td>
                <td>${e.equipo}</td>
                <td>${e.pj}</td>
                <td>${e.pg}</td>
                <td>${e.pe}</td>
                <td>${e.pp}</td>
                <td>${e.gf}</td>
                <td>${e.gc}</td>
                <td>${e.dg}</td>
                <td><b>${e.pts}</b></td>
            </tr>
        `;

    });

}

document.addEventListener("input", (e) => {

    if (e.target.classList.contains("score")) {

        guardarResultados();
        actualizarTabla();

    }

});

cargarResultados();
actualizarTabla();