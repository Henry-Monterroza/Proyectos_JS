$(document).ready(function() {
    $("#AplicarOCR").click(function() {
        var file = $('#imgFile').prop('files')[0];
        if (!file) {
            mostrarAlerta("Seleccione una imagen Primero", "#imgFile");
            return;
        }

        // Desactivar el botón "Aplicar OCR"
        $("#AplicarOCR").prop('disabled', true);

        // Crear un nuevo FileReader
        var reader = new FileReader();

        // Leer el contenido del archivo como una URL de datos
        reader.readAsDataURL(file);

        // Cuando el archivo ha sido leído con éxito
        reader.onload = function(e) {
            var img = new Image();
            let htmlimg = `<img src=""  class="w-100" alt="ocr"></img>`
            let objhtmlimg= $(htmlimg);
            objhtmlimg.attr("src",e.target.result )
            $("#divImg").empty();
            $("#divImg").append(objhtmlimg);
           
           // img.src = e.target.result;
           img.src = e.target.result;
            img.onload = function() {
                Tesseract.recognize(img, 'spa', {
                    logger: m => console.log(m) // Opcional: log para seguimiento del progreso
                })
                .then(function(result) {
                    $('#Ocrtext').text(result.text);
                    // Volver a activar el botón "Aplicar OCR"
                    $("#AplicarOCR").prop('disabled', false);
                })
                .catch(function(error) {
                    console.error(error);
                    mostrarAlerta('Error al procesar la imagen.', "#imgFile");
                    // Volver a activar el botón "Aplicar OCR" en caso de error
                    $("#AplicarOCR").prop('disabled', false);
                });
            };
        };
    });
});

function mostrarAlerta(mensaje, selector) {
    let alertMessage = AlertDiv(mensaje);
    $("#msjAlert").html(alertMessage);
    $("#AplicarOCR").prop('disabled', false);
    $(selector).focus();
}
