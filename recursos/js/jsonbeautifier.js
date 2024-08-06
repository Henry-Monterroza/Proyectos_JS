$(document).ready(function() {
    $("#Runbeautifier").click(function(){

        $("#msjAlert").empty();


        $("#Runbeautifier").prop('disabled', true);

        stringJson = $("#OriginalJson").val();
    
        if (isNullOrEmpty(stringJson)) {
            mostrarAlerta("Ingrese objeto en formato JSON", "#OriginalJson");
            return;
        }
        if (!esJsonArray(stringJson)) {
            mostrarAlerta("El texto ingresado no es un  JSON válido", "#OriginalJson");
        }
        stringBeautifierJson =  prettyPrintJSON(stringJson);
        $("#BeautifierJson").val(stringBeautifierJson);

        $("#Runbeautifier").prop('disabled', false);

    });

$("#copyButton").click(function () {
    let textArea = $("#BeautifierJson");
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
});



$("#CleartextArea").click(function(){
    $("#BeautifierJson").val("");


});
});

function esJsonArray(str) {
    try {
        const data = JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
}

function prettyPrintJSON(jsonString) {
    try {
        // Parse the JSON string into an object
        var jsonObject = JSON.parse(jsonString);

        // Convert the JSON object back to a string with pretty print
        var prettyJSONString = JSON.stringify(jsonObject, null, 4);

        return prettyJSONString;
    } catch (error) {
        console.error("Invalid JSON string provided:", error);
        return null;
    }
}

function mostrarAlerta(mensaje, selector) {
    let alertMessage = AlertDiv(mensaje);
    $("#msjAlert").html(alertMessage);
    $("#Runbeautifier").prop('disabled', false);
    $(selector).focus();
}

