// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

const _ControlMultiFile ="#formFileMultiple";
let _BtnExport ="#exportBtn";
let _ControlFileName ="#filename";
let _AlertSeccion = "#msjAlert";
let _Disabled = "disabled";

$(document).ready(function () {


    // Evento change del input file para habilitar/deshabilitar el botón de exportar
    $(_ControlMultiFile).change(function () {
        let files = $(this).prop("files");
        if (files.length == 0) {
            $(_BtnExport).prop(_Disabled, true);
        } else {
            $(_BtnExport).prop(_Disabled, false);
        }
    });

    // Evento click del botón exportar
    $(_BtnExport).click(async function () {
        // Deshabilitar el botón mientras se procesa
        $(_BtnExport).prop(_Disabled, true);

        // Limpiar mensajes de alerta previos
        $(_AlertSeccion).empty();

        // Obtener archivos seleccionados
        let files = $(_ControlMultiFile).prop("files");

        // Validar que se haya seleccionado al menos un archivo
        if (files.length == 0) {
            let alerty = AlertDiv("Debe Seleccionar Al menos un Archivo JSON");
            $(_AlertSeccion).append(alerty);
            $(_ControlMultiFile).focus();
            $(_BtnExport).prop(_Disabled, false);
            return;
        }

        // Validar que se haya ingresado un nombre para el archivo
        let filename = $(_ControlFileName).val();
        if (isNullOrEmpty(filename)) {
            let alerty = AlertDiv("Ingrese un nombre para el archivo");
            $(_AlertSeccion).append(alerty);
            $(_BtnExport).prop(_Disabled, false);
            $(_ControlFileName).focus();
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
            $(_AlertSeccion).append(alerty);
            $(_BtnExport).prop(_Disabled, false);
            return;
        }

        // Array para almacenar los datos que se convertirán en el archivo Excel
        var excelarray = [];
        for (var i = 0; i < ElectronicArray.length; i++) {
            try {
                var objson = ElectronicArray[i];
                let obj = {
                    "F_Emision": objson.identificacion.fecEmi,
                    "DTE": objson.identificacion.tipoDte,
                    "DTE_Descripcion": GetDesDTE(objson.identificacion.tipoDte),
                    "Codigo_Generacion": objson.identificacion.codigoGeneracion,
                    "Numero_Control": objson.identificacion.numeroControl,
                    "NRC": objson.emisor.nrc,
                    "NIT": objson.emisor.nit,
                    "Nombre_Proveedor": objson.emisor.nombre,
                    "Total_Exenta": objson.resumen.totalExenta,
                    "Total_Gravada": objson.resumen.totalGravada,
                    "IVA": (objson.resumen?.tributos?.find(tributo => tributo.codigo === "20") || {}).valor || "0",
                    "SubTotal": objson.resumen.subTotal,
                    "Total_Compras": objson.resumen.montoTotalOperacion,
                    "Descuento_No_Sujeto": objson.resumen.descuNoSuj,
                    "SelloRecibido": GetSelloRecibido(objson)
                };
                excelarray.push(obj);
            } catch (ex) {
                // Mostrar mensaje de error si hay un problema con la estructura del JSON
                let alerty = AlertDiv("Los archivos JSON no tienen la estructura esperada. " + ex);
                $(_AlertSeccion).append(alerty);
                $(_BtnExport).prop(_Disabled, false);
                return;
            }
        }

        // Mostrar en consola el JSON que se convertirá a tabla de Excel
        console.log("JSON Tabla de excel");
        console.log(JSON.stringify(excelarray));


        TabularJson(excelarray);




        // Habilitar el botón de exportar y limpiar los campos
        $(_BtnExport).prop(_Disabled, false);
        $(_ControlMultiFile).val(null);
        $(_ControlFileName).val(null);

    });

    function GetSelloRecibido(objson) {
        // Verificar si el propio objeto tiene el atributo selloRecibido
        if (objson.hasOwnProperty('selloRecibido')) {
            return objson.selloRecibido;
        }
        
        // Buscar el atributo selloRecibido dentro de subobjetos
        for (const key in objson) {
            if (objson[key] && typeof objson[key] === 'object') {
                if (objson[key].hasOwnProperty('selloRecibido')) {
                    return objson[key].selloRecibido;
                }
            }
        }
        
        // Si no se encuentra, retornar mensaje de no encontrado
        return "No se encontró selloRecibido";
    }


function GetDesDTE(codigoDTE) {
    switch (codigoDTE) {
        case '01':
            return 'FACTURA';
        case '03':
            return 'COMPROBANTE DE CRÉDITO FISCAL';
        case '04':
            return 'NOTA DE REMISIÓN';
        case '05':
            return 'NOTA DE CRÉDITO';
        case '06':
            return 'NOTA DE DÉBITO';
        case '07':
            return 'COMPROBANTE DE RETENCIÓN';
        case '08':
            return 'COMPROBANTE DE LIQUIDACIÓN';
        case '09':
            return 'DOCUMENTO CONTABLE DE LIQUIDACIÓN';
        case '11':
            return 'FACTURA DE EXPORTACIÓN';
        case '14':
            return 'FACTURA DE SUJETO EXCLUIDO';
        case '15':
            return 'COMPROBANTE DE DONACIÓN';
        default:
            return 'CÓDIGO DTE NO IDENTIFICADO';
    }
}

    

    // Inicializar los campos y botones al cargar la página
    $(_BtnExport).prop(_Disabled, false);
    $(_ControlMultiFile).val(null);
    $(_ControlFileName).val(null);
});

