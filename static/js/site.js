// Seleciona o elemento input e label
const inputRange = document.getElementById('form-porcentagem');//form-label-porcentagem
const labelValor = document.getElementById('form-label-porcentagem');

//Valor imovel
const inputValorImovel = document.getElementById('form-valor-imovel');

//Valor de entrada
const inputValorEntrada = document.getElementById('form-valor-entrada');

//Valor a financiar
const labelValorFinanciar = document.getElementById('form-label-valor-financiar');

//Total a financiar
const labelTotalFinanciar = document.getElementById('form-label-total-financiar');

function converterStringParaNumero(valorString) {
    let valorFormatado = valorString.replace(/\./g, '').replace(',', '.');
    return parseFloat(valorFormatado);
}


inputRange.addEventListener('input', function () {
    if (inputValorImovel.value) {
        let valorNumerico = converterStringParaNumero(inputValorImovel.value);

        if (valorNumerico > 0) {
            calcular_range();
        }
    }

    labelValor.textContent = inputRange.value + " %";
});

//VALOR DO IMOVEL
inputValorImovel.addEventListener('input', function() {
    let valorImovel = converterStringParaNumero(inputValorImovel.value);
    let valorEntrada = converterStringParaNumero(inputValorEntrada.value);

    // Se o valor da entrada for maior que o valor do imóvel, ajuste-o
    if (valorEntrada > 0) {
        
        //atualizarPercentual();
        calcular_range();
    }
    
});
inputValorImovel.addEventListener('blur', function() {
    atualizaTotalFinanciamento();
    
});


//VALOR DE ENTRADA
inputValorEntrada.addEventListener('blur', function() {
    let valorImovel = converterStringParaNumero(inputValorImovel.value);
    let valorEntrada = converterStringParaNumero(inputValorEntrada.value);

    // Se o valor da entrada for maior que o valor do imóvel, ajuste-o
    if (valorEntrada > valorImovel) {
        //inputValorEntrada.value = inputValorImovel.value; // Defina o valor da entrada igual ao valor do imóvel
        $('#form-valor-entrada').val(inputValorImovel.value).mask('#.##0,00', {reverse: true}).trigger('input');
    }

    // Atualizar o percentual após qualquer mudança no valor da entrada
    atualizarPercentual();
    
});



function calcular_range() {
    let valorNumerico = converterStringParaNumero(inputValorImovel.value);
    var result = (inputRange.value / 100) * valorNumerico;

    // Convertendo o valor para o formato brasileiro
    var valorFormatadoBrasileiro = parseFloat(result).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    $('#form-valor-entrada').val(valorFormatadoBrasileiro).mask('#.##0,00', {reverse: true}).trigger('input');
    atualizaTotalFinanciamento();

}


function atualizarPercentual() {
    let valorImovel = converterStringParaNumero(inputValorImovel.value);
    let valorEntrada = converterStringParaNumero(inputValorEntrada.value);
    
    // Cálculo do percentual
    let percentual = (valorEntrada / valorImovel) * 100;

    // Atualizando o inputRange com o percentual
    labelValor.textContent = percentual + " %";
    inputRange.value = percentual;

}

function atualizaTotalFinanciamento() {
    let valorImovel = converterStringParaNumero(inputValorImovel.value);
    let valorEntrada = converterStringParaNumero(inputValorEntrada.value);
    
    let totalFinanciar = valorImovel - valorEntrada;

    // Convertendo o valor para o formato brasileiro
    let totalFormatadoBrasileiro = parseFloat(totalFinanciar).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    labelTotalFinanciar.textContent = "FINANCIAR: R$ " + totalFormatadoBrasileiro;
}
