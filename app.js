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

fetch("luminarias.json")
.then(res => res.json())
.then(datos => {

    datos.forEach(poste => {

        let marcador = L.marker([
            poste.lat,
            poste.lng
        ]).addTo(mapa);

        marcador.on("click", () => {

            document.getElementById("codigo").value =
                poste.codigo;

            document.getElementById("tipoPoste").value =
                poste.tipoPoste;

            document.getElementById("tipoLuminaria").value =
                poste.tipoLuminaria;

            document.getElementById("funcionamiento").value =
                poste.funcionamiento;

            document.getElementById("tipoFalla").value =
                poste.tipoFalla;

            mostrarFormulario();

        });

    });

});