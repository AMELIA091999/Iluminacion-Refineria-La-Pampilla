const SUPABASE_URL =
  "https://ezkgqclkwloebgxkdkns.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_eXj1eu9n9xHIVSWn6365rw_KLxjGBRe";

const clienteSupabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);


let mapa;

let seleccionandoUbicacion = false;

function mostrarMapa() {

    document.getElementById("contenedorMapa").style.display = "flex";
    document.getElementById("contenedorFormulario").style.display = "none";
    document.getElementById("contenedorNuevo").style.display = "none";

    setTimeout(() => {
        mapa.invalidateSize();
    }, 100);
}

function mostrarFormulario() {

    document.getElementById("contenedorMapa").style.display = "none";
    document.getElementById("contenedorFormulario").style.display = "block";
    document.getElementById("contenedorNuevo").style.display = "none";
}

function mostrarNuevo() {

    document.getElementById("contenedorMapa").style.display = "none";
    document.getElementById("contenedorFormulario").style.display = "none";
    document.getElementById("contenedorNuevo").style.display = "block";
}

mapa = L.map('map').setView([-12.061, -77.045], 15);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 22
}).addTo(mapa);


mapa.on("click", function(e){

    if(!seleccionandoUbicacion){
        return;
    }

    document.getElementById("nuevoLatitud").value =
        e.latlng.lat.toFixed(6);

    document.getElementById("nuevoLongitud").value =
        e.latlng.lng.toFixed(6);

    seleccionandoUbicacion = false;

    mostrarNuevo();

});


function activarSeleccionMapa(){

    mostrarMapa();

    seleccionandoUbicacion = true;

    alert("Haz clic sobre el mapa para seleccionar la ubicación");
}


async function cargarLuminarias() {

    const { data, error } = await clienteSupabase
        .from("Luminarias")
        .select("*");
    
    if (error) {
        console.error(error);
        return;
    }

    data.forEach(poste => {

        console.log("Creando marcador:", poste);
        console.log("Latitud:", poste.latitud);
        console.log("Longitud:", poste.longitud);

        
        let marcador = L.marker([
            poste.latitud,
            poste.longitud
        ]).addTo(mapa);

        marcador.on("click", () => {

            document.getElementById("infoCodigo").textContent =
            poste.codigo || "-";

            document.getElementById("infoEstado").textContent =
            poste.estado || "-";

            document.getElementById("infoTipo").textContent =
            poste.tipo_luminaria || "-";

            document.getElementById("infoPoste").textContent =
            poste.tipo_poste || "-";

            document.getElementById("infoPotencia").textContent =
            poste.potencia || "-";

            document.getElementById("infoAltura").textContent =
            poste.altura || "-";

            document.getElementById("infoUbicacion").textContent =
            poste.ubicacion || "-";

        });

    });

}

cargarLuminarias();

async function guardarNuevoPoste(){

    const { error } = await clienteSupabase
        .from("Luminarias")
        .insert([{
            codigo: document.getElementById("nuevoCodigo").value,
            latitud: parseFloat(document.getElementById("nuevoLatitud").value),
            longitud: parseFloat(document.getElementById("nuevoLongitud").value),
            estado: document.getElementById("nuevoEstado").value,
            tipo_poste: document.getElementById("nuevoTipoPoste").value,
            tipo_luminaria: document.getElementById("nuevoTipoLuminaria").value,
            potencia: document.getElementById("nuevoPotencia").value,
            altura: document.getElementById("nuevoAltura").value,
            ubicacion: document.getElementById("nuevoUbicacion").value
        }]);

    if(error){
        alert("Error al guardar");
        console.error(error);
        return;
    }

    alert("Luminaria registrada");

    location.reload();
}

