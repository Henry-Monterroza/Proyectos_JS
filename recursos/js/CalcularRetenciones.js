// Permitir solo números y limitar la entrada a 9 dígitos.
function OnlyNumbers(evt) {
    const keynum = evt.keyCode || evt.which;
    const input = evt.target;

    // Verifica que solo se ingresen números y no supere los 9 dígitos.
    return (keynum >= 48 && keynum <= 57) && input.value.length < 9;
}

// Calcula la retención del ISSS (Seguro Social) de acuerdo al salario.
// Si el salario es mayor a $999.99, el máximo de retención es $30.
// De lo contrario, se retiene el 3% del salario.
function CalculateISSS(salary) {
    return salary > 999.99 ? 30 : 0.03 * salary;
}

// Calcula la retención de AFP (Administradora de Fondos de Pensiones) en función del salario.
// Si el salario es mayor a $6500, se retiene el 7.25% de $6500 como máximo.
// Si es menor, se retiene el 7.25% del salario actual.
function CalculateAFP(salary) {
    const limit = 6500;
    return 0.0725 * Math.min(salary, limit);
}

// Calcula la retención del impuesto sobre la renta (ISR) en función del salario.
// Los tramos están definidos de acuerdo a la legislación fiscal de El Salvador:
// - Tramo I: No se retiene renta si el salario es menor o igual a $472.
// - Tramo II: Retención del 10% sobre el excedente de $472 más una base de $17.67.
// - Tramo III: Retención del 20% sobre el excedente de $895.24 más una base de $60.
// - Tramo IV: Retención del 30% sobre el excedente de $2038.10 más una base de $288.57.
function CalculateRent(paid) {
    if (paid <= 472) return 0;
    if (paid <= 895.24) return 17.67 + (0.1 * (paid - 472));
    if (paid <= 2038.10) return 60 + (0.2 * (paid - 895.24));
    return 288.57 + (0.3 * (paid - 2038.10));
}

// Calcula las retenciones y los valores netos mensuales y quincenales.
function CalcularRetenciones() {
    const salary = parseFloat($('#Salary').val());
    if (!salary) return false;

    $("#recalcular").removeClass("collapse");
    $("#calcular").addClass("collapse");


    $('#Salary').prop('disabled', true);

   

    // Calcula retenciones mensuales y quincenales
    let MesAfp = CalculateAFP(salary);
    let MesIsss = CalculateISSS(salary);
    let MesNetSalary = salary - MesAfp;
    let MesRent = CalculateRent(MesNetSalary - MesIsss);


    // Redondeamos Justo despues de calcular
    MesAfp = parseFloat(MesAfp.toFixed(2));
    MesIsss = parseFloat(MesIsss.toFixed(2));
    MesNetSalary = parseFloat(MesNetSalary.toFixed(2));
    MesRent = parseFloat(MesRent.toFixed(2));
  //  MesTotalRetentions = parseFloat(MesTotalRetentions.toFixed(2));
 //   MesSalary = parseFloat(MesSalary.toFixed(2));


    let MesTotalRetentions = MesAfp + MesIsss + MesRent;
    let MesSalary = salary - MesTotalRetentions;

    // Calcula valores quincenales
    const QuinceSalary = MesSalary / 2;
    const QuinceAfp = MesAfp / 2;
    const QuinceIsss = MesIsss / 2;
    const QuinceRent = MesRent / 2;
    const QuinceRetentions = QuinceAfp + QuinceIsss + QuinceRent;

    // Actualiza la tabla con los resultados
    updateTable({
        salary, 
        MesAfp, MesIsss, MesRent, MesNetSalary, MesTotalRetentions, MesSalary,
        QuinceAfp, QuinceIsss, QuinceRent, QuinceSalary, QuinceRetentions
    });
}

function InicializarTabla() {
    $("#recalcular").addClass("collapse");
    $("#calcular").removeClass("collapse");
    $('#Salary').prop('disabled', false).val("");

    updateTable({
        salary: 0,
        MesAfp: 0, MesIsss: 0, MesRent: 0, MesNetSalary: 0, MesTotalRetentions: 0, MesSalary: 0,
        QuinceAfp: 0, QuinceIsss: 0, QuinceRent: 0, QuinceSalary: 0, QuinceRetentions: 0
    });


}

// Actualiza la tabla HTML con los valores calculados
function updateTable(values) {
    $('#tdMesSalary').html(formatNumber(values.salary));
    $('#tdQuinceSalary').html(formatNumber(values.salary / 2));
    $('#tdMesISSS').html(formatNumber(values.MesIsss));
    $('#tdQuinceISSS').html(formatNumber(values.QuinceIsss));
    $('#tdMesAFP').html(formatNumber(values.MesAfp));
    $('#tdQuinceAFP').html(formatNumber(values.QuinceAfp));
    $('#tdMesRent').html(formatNumber(values.MesRent));
    $('#tdQuinceRent').html(formatNumber(values.QuinceRent));
    $('#tdMesAFPs').html(formatNumber(values.MesNetSalary));
    $('#tdQuinceAFPs').html(formatNumber(values.MesNetSalary / 2));
    $('#tdMesRetentions').html(formatNumber(values.MesTotalRetentions));
    $('#tdQuinceRententions').html(formatNumber(values.QuinceRetentions));
    $('#tdMesSalarioNeto').html(formatNumber(values.MesSalary));
    $('#tdQuinceSalarioNeto').html(formatNumber(values.QuinceSalary));
}

// Da formato a los números en formato moneda.
function formatNumber(num) {
    return '$ ' + parseFloat(num).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

