// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

$(document).ready(function () {


// Evento change del input file para habilitar/deshabilitar el botón de exportar
$("#formFileMultiple").change(function () {
    let files = $(this).prop("files");
    if (files.length == 0) {
        $("#exportBtn").prop("disabled", true);
    } else {
        $("#exportBtn").prop("disabled", false);
    }
});

// Evento click del botón exportar
$("#exportBtn").click(async function () {
    // Deshabilitar el botón mientras se procesa
    $("#exportBtn").prop('disabled', true);

    // Limpiar mensajes de alerta previos
    $("#msjAlert").empty();

    // Obtener archivos seleccionados
    let files = $("#formFileMultiple").prop("files");

    // Validar que se haya seleccionado al menos un archivo
    if (files.length == 0) {
        let alerty = AlertDiv("Debe Seleccionar Al menos un Archivo JSON");
        $("#msjAlert").append(alerty);
        $("#formFileMultiple").focus();
        $("#exportBtn").prop('disabled', false);
        return;
    }

    // Validar que se haya ingresado un nombre para el archivo
    let filename = $("#filename").val();
    if (isNullOrEmpty(filename)) {
        let alerty = AlertDiv("Ingrese un nombre para el archivo");
        $("#msjAlert").append(alerty);
        $("#exportBtn").prop('disabled', false);
        $("#filename").focus();
        return;
    }

    // Array para almacenar los datos de los archivos JSON
    var ElectronicArray = [];
    try {
        // Leer cada archivo JSON seleccionado y parsearlo
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            let jsonstring = await readFileAsText(file);
            let objjson = JSON.parse(jsonstring);
            ElectronicArray.push(objjson);
        }
    } catch (ex) {
        // Mostrar mensaje de error si ocurre un problema al procesar los archivos JSON
        let alerty = AlertDiv("Los archivos JSON no tienen la estructura esperada. " + ex);
        $("#msjAlert").append(alerty);
        $("#exportBtn").prop('disabled', false);
        return;
    }

    // Array para almacenar los datos que se convertirán en el archivo Excel
    var excelarray = [];
    for (var i = 0; i < ElectronicArray.length; i++) {
        try {
            var objson = ElectronicArray[i];
            let obj = {
                // "Correlativo": `${i + 1}`,
                "FechaEmision": objson.identificacion.fecEmi,
                "NumeroUnicoComprobante": objson.identificacion.codigoGeneracion,
                "NumeroComprobante": objson.identificacion.numeroControl,
                "NRC": objson.emisor.nrc,
                // "NumeroSerie": objson.selloRecibido || objson.respuestaHacienda.selloRecibido || "No se encontro",
                "NIT": objson.emisor.nit,
                "NombreProveedor": objson.emisor.nombre,
                "ComprasExentaInterna": objson.resumen.totalExenta,
                "ComprasGrabadasInterna": objson.resumen.totalGravada,
                // "CreditoFiscal": 0.0,
                "IVA": (objson.resumen.tributos.find(tributo => tributo.codigo === "20") || {}).valor || "No IVA",
                "SubTotal": objson.resumen.subTotal,
                "TotalCompras": objson.resumen.montoTotalOperacion,
                "ComprasSujetosExcluidos": objson.resumen.descuNoSuj
            };
            excelarray.push(obj);
        } catch (ex) {
            // Mostrar mensaje de error si hay un problema con la estructura del JSON
            let alerty = AlertDiv("Los archivos JSON no tienen la estructura esperada. " + ex);
            $("#msjAlert").append(alerty);
            $("#exportBtn").prop('disabled', false);
            return;
        }
    }

    // Mostrar en consola el JSON que se convertirá a tabla de Excel
    console.log("JSON Tabla de excel");
    console.log(JSON.stringify(excelarray));


     TabularJson(excelarray);
    $("#divTable").empty();



    // Habilitar el botón de exportar y limpiar los campos
    $("#exportBtn").prop('disabled', false);
    $("#formFileMultiple").val(null);
    $("#filename").val(null);

});

// Inicializar los campos y botones al cargar la página
$("#exportBtn").prop('disabled', false);
$("#formFileMultiple").val(null);
$("#filename").val(null);
});

