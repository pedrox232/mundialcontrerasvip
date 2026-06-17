const equipos = [
    "Argentina",
    "Argelia",
    "Austria",
    "Jordania"
];

function actualizarTabla(){

    const data = {};

    equipos.forEach(e=>{

        data[e]={
            equipo:e,
            pj:0,
            pg:0,
            pe:0,
            pp:0,
            gf:0,
            gc:0,
            dg:0,
            pts:0
        };

    });

    document.querySelectorAll("#partidos tr").forEach(row=>{

        const td = row.querySelectorAll("td");

        const local = td[4].innerText;
        const visita = td[8].innerText;

        const gl = td[5].querySelector("input").value;
        const gv = td[7].querySelector("input").value;

        if(gl === "" || gv === "")
            return;

        const l = parseInt(gl);
        const v = parseInt(gv);

        data[local].pj++;
        data[visita].pj++;

        data[local].gf += l;
        data[local].gc += v;

        data[visita].gf += v;
        data[visita].gc += l;

        if(l > v){

            data[local].pg++;
            data[local].pts += 3;
            data[visita].pp++;

        }else if(v > l){

            data[visita].pg++;
            data[visita].pts += 3;
            data[local].pp++;

        }else{

            data[local].pe++;
            data[visita].pe++;

            data[local].pts++;
            data[visita].pts++;

        }

    });

    Object.values(data).forEach(e=>{
        e.dg = e.gf - e.gc;
    });

    const tabla = Object.values(data).sort((a,b)=>

        b.pts - a.pts ||
        b.dg - a.dg ||
        b.gf - a.gf

    );

    const tbody = document.getElementById("tablaPosiciones");

    tbody.innerHTML = "";

    tabla.forEach((e,i)=>{

        let clase = "";

        if(i===0) clase="first";
        if(i===1) clase="second";

        tbody.innerHTML += `
        <tr class="${clase}">
            <td>${i+1}</td>
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

document.addEventListener("input", actualizarTabla);

actualizarTabla();