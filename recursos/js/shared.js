$(document).ready(function(){
    // URL del header que quieres obtener
    const headerUrl = 'views/Shared/header.html';
    const footerUrl = 'views/Shared/footer.html';

    // Función para obtener el header y agregarlo al DOM
    $.get(headerUrl, function(data){
        $('#header-placeholder').html(data);
        $("#cuerpo-main").removeClass('collapse')

            // Obtener la ruta actual de la URL
    var path = window.location.pathname;

    // Extraer la última parte después del último '/'
    var segments = path.split('/');
    var lastSegment = segments.pop();

    var foundLink = $("nav a[href$='" + lastSegment + "']");
    foundLink.addClass("active");

    }).fail(function() {
        console.error('Error al obtener el header.');
    });







   // Función para obtener el footer y agregarlo al DOM
    $.get(footerUrl, function(data){
            $('#footer-placeholder').html(data);
    }).fail(function() {
            console.error('Error al obtener el footer.');
    });
});


// Función para convertir una cadena base64 en bytes
function base64ToBytes(base64String) {
let binaryString = atob(base64String);
let len = binaryString.length;
let bytes = new Uint8Array(len);

for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
}

return bytes;
}

// Función para leer un archivo como texto
function readFileAsText(file) {
return new Promise((resolve, reject) => {
    if (!file.type.match('text.*') && !file.type.match('application/json')) {
        reject('El archivo debe ser de tipo texto o JSON.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
        const contents = event.target.result;
        resolve(contents);
    };
    reader.onerror = function (error) {
        reject('Error al leer el archivo: ' + error);
    };
    reader.readAsText(file);
});
}


// Función para verificar si una cadena es nula o vacía
function isNullOrEmpty(str) {
return !str || str.trim() === '';
}



// function jsonToTable(jsonArray) {
//     if (!Array.isArray(jsonArray) || jsonArray.length === 0) {
//         return '<p>No data available</p>';
//     }

//     // Get the headers
//     const headers = Object.keys(jsonArray[0]);

//     // Start building the HTML table

    
//     let tableHtml = '<table id="example" class="table table-striped text-white dataTable" style="width: 100%;" aria-describedby="example_info"><thead><tr>';

//     // Add table headers
//     headers.forEach(header => {
//         tableHtml += `<th>${header}</th>`;
//     });
//     tableHtml += '</tr></thead><tbody>';

//     // Add table rows
//     jsonArray.forEach(item => {
//         tableHtml += '<tr>';
//         headers.forEach(header => {
//             tableHtml += `<td>${item[header]}</td>`;
//         });
//         tableHtml += '</tr>';
//     });

//     tableHtml += '</tbody></table>';

//     return tableHtml;
// }

    // Función para convertir un JSON en una hoja de cálculo y descargarla
    function TabularJson(json) {
        // Convertir JSON a una hoja de cálculo
        const worksheet = XLSX.utils.json_to_sheet(json);

        // Crear un nuevo libro de trabajo
        const workbook = XLSX.utils.book_new();

        // Añadir la hoja de cálculo al libro de trabajo
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

        // Generar un archivo Excel y descargarlo
        let filenombre = $("#filename").val();
        XLSX.writeFile(workbook, `${filenombre}.xlsx`);
    }


    function AlertDiv(msj) {
        var alertDiv = `<div class="alert alert-warning alert-dismissible fade show mt-3" role="alert">
                ${msj}
              <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`
        return alertDiv;
        }

 var btnDown =
        `<a type="button" class="btn btn-outline-primary mt-3" href="default.asp" target="_blank" id="download" >
            <svg  width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5">
            </path>
            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"></path>
            </svg>
            </a>`
        