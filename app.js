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

const iconoUsuario = L.divIcon({
    className: "ubicacion-usuario",
    html: `
        <div style="
            width:18px;
            height:18px;
            background:#0078ff;
            border:3px solid white;
            border-radius:50%;
            box-shadow:0 0 10px rgba(0,120,255,0.7);
        "></div>
    `,
    iconSize: [18,18],
    iconAnchor: [9,9]
});


function mostrarMiUbicacion() {

    if (!navigator.geolocation) {
        alert("Tu navegador no soporta geolocalización");
        return;
    }

    navigator.geolocation.getCurrentPosition(

        function(posicion) {

            const lat = posicion.coords.latitude;
            const lng = posicion.coords.longitude;

            L.marker([lat, lng], {
                icon: iconoUsuario
            })
                .addTo(mapa)
                .bindPopup("Mi ubicación")
                .openPopup();

            mapa.setView([lat, lng], 18);
        },

        function(error) {
            console.error(error);
            alert(
                "Error GPS: " +
                error.code +
                " - " +
                error.message
            );
        }

    );
}

mapa = L.map('map').setView([-12.061, -77.045], 15);

const capaMapa = L.tileLayer(
    'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        maxZoom: 22
    }
);

const capaSatelite = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    {
        maxZoom: 22
    }
);

capaMapa.addTo(mapa);

L.control.layers(
    {
        "Mapa": capaMapa,
        "Satélite": capaSatelite
    }
).addTo(mapa);

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

     console.log("codigo:", document.getElementById("nuevoCodigo").value);
        console.log("latitud:", document.getElementById("nuevoLatitud").value);
        console.log("longitud:", document.getElementById("nuevoLongitud").value);
        console.log("estado:", document.getElementById("nuevoEstado").value);
        console.log("tipo_poste:", document.getElementById("nuevoTipoPoste").value);
        console.log("tipo_luminaria:", document.getElementById("nuevoTipoLuminaria").value);
        console.log("potencia:", document.getElementById("nuevoPotencia").value);
        console.log("altura:", document.getElementById("nuevoAltura").value);
        console.log("ubicacion:", document.getElementById("nuevoUbicacion").value);



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

    const { data, error } = await clienteSupabase
        .from("Luminarias")
        .insert([{
            codigo: document.getElementById("nuevoCodigo").value,

            latitud: parseFloat(
                document.getElementById("nuevoLatitud").value
            ),

            longitud: parseFloat(
                document.getElementById("nuevoLongitud").value
            ),

            estado: document.getElementById("nuevoEstado").value || null,

            tipo_poste: document.getElementById("nuevoTipoPoste").value || null,

            tipo_luminaria: document.getElementById("nuevoTipoLuminaria").value || null,

            potencia: document.getElementById("nuevoPotencia").value
                ? parseInt(document.getElementById("nuevoPotencia").value)
                : null,

            altura: document.getElementById("nuevoAltura").value
                ? parseInt(document.getElementById("nuevoAltura").value)
                : null,

            ubicacion: document.getElementById("nuevoUbicacion").value || null

        }]);

    console.log("DATA:", data);
    console.log("ERROR:", error);

    if(error){
        console.error(error);
        alert("Error: " + error.message);
        return;
    }

    alert("Luminaria registrada");
    location.reload();
}