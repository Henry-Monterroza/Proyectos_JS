
$(document).ready(function () {
    // $("#textarray").attr("placeholder", getPlaceholderData());
    $("#ArrayEjemplo").val(getSampleData());
    $('#copyButton').click(handleCopyButtonClick);
    $("#exportBtn").click(handleExportButtonClick);
});

function handleCopyButtonClick() {
    let textArea = $("#ArrayEjemplo");
    textArea.prop("disabled", false);

    // Obtener el texto del área de texto
    const textToCopy = textArea.val();
    textArea.select();// solo para que se vea selecionado.
    // Copiar el texto al portapapeles usando Clipboard API
    navigator.clipboard.writeText(textToCopy).then(function() {
        console.log('Texto copiado al portapapeles con éxito.');
    }).catch(function(err) {
        console.error('Error al copiar texto al portapapeles: ', err);
    });

    textArea.prop("disabled", true);
}



async function handleExportButtonClick() {
    let stringArray = $("#textarray").val();
    let filename = $("#filename").val();

    if (isNullOrEmpty(filename)) {
        mostrarAlerta("Ingrese un nombre para el archivo", "#filename");
        return;
    }

    if (isNullOrEmpty(stringArray)) {
        mostrarAlerta("Ingrese un array en formato JSON", "#textarray");
        return;
    }

    $("#exportBtn").prop('disabled', true);

    if (esJsonArray(stringArray)) {
        let data = JSON.parse(stringArray);
        TabularJson(data);
    } else {
        mostrarAlerta("El texto ingresado no es un array JSON válido", "#textarray");
    }

    $("#exportBtn").prop('disabled', false);
    $("#filename").val(null);
}

function mostrarAlerta(mensaje, selector) {
    let alertMessage = AlertDiv(mensaje);
    $("#msjAlert").html(alertMessage);
    $("#exportBtn").prop('disabled', false);
    $(selector).focus();
}


function esJsonArray(str) {
    try {
        const data = JSON.parse(str);
        return Array.isArray(data);
    } catch (e) {
        return false;
    }
}

function getSampleData() {
    return JSON.stringify([
        { "id": 1, "nombre": "Juan", "edad": 28, "ciudad": "Madrid", "ocupacion": "Ingeniero" },
        { "id": 2, "nombre": "María", "edad": 34, "ciudad": "Barcelona", "ocupacion": "Diseñadora" },
        { "id": 3, "nombre": "Carlos", "edad": 22, "ciudad": "Valencia", "ocupacion": "Estudiante" },
        { "id": 4, "nombre": "Ana", "edad": 45, "ciudad": "Sevilla", "ocupacion": "Médico" },
        { "id": 5, "nombre": "Luis", "edad": 30, "ciudad": "Zaragoza", "ocupacion": "Abogado" }
    ], null, 4);
}

function getPlaceholderData(){
    return JSON.stringify([
        { "nombre": "Juan", "edad": 30, "ciudad": "Madrid" },
        { "nombre": "María", "edad": 25, "ciudad": "Barcelona" },
        { "nombre": "Pedro", "edad": 35, "ciudad": "Valencia" }
    ], null, 4); // Formateado con indentación

}
