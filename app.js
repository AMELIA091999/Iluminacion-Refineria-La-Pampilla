const SUPABASE_URL =
  "https://ezkgqclkwloebgxkdkns.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_eXj1eu9n9xHIVSWn6365rw_KLxjGBRe";

const clienteSupabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);


let mapa;

function mostrarMapa() {

    document.getElementById("contenedorMapa").style.display = "block";
    document.getElementById("contenedorFormulario").style.display = "none";

}

function mostrarFormulario() {

    document.getElementById("contenedorMapa").style.display = "none";
    document.getElementById("contenedorFormulario").style.display = "block";

}

mapa = L.map('map').setView([-12.061, -77.045], 15);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 22
}).addTo(mapa);

async function cargarLuminarias() {

    const { data, error } = await clienteSupabase
        .from("Luminarias")
        .select("*");
    
    
    if (error) {
        console.error(error);
        return;
    }

    data.forEach(poste => {

        let marcador = L.marker([
            poste.Latitud,
            poste.Longitud
        ]).addTo(mapa);

        marcador.on("click", () => {

            document.getElementById("codigo").value =
                poste.codigo || "";

            document.getElementById("tipoPoste").value =
                poste.tipo_poste || "";

            document.getElementById("tipoLuminaria").value =
                poste.tipo_luminaria || "";

            document.getElementById("funcionamiento").value =
                poste.Estado || "";

            document.getElementById("tipoFalla").value =
                poste.tipo_falla || "";

            mostrarFormulario();

        });

    });

}

cargarLuminarias();