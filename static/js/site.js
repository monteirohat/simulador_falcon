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

//Idade
const idadeInput = document.getElementById('form-idade');

function converterStringParaNumero(valorString) {
    let valorFormatado = valorString.replace(/\./g, '').replace(',', '.');
    return parseFloat(valorFormatado);
}

function removerCaracteresEspeciais(texto) {
    return texto.replace(/[^0-9]/g, ''); // Remove tudo que não for dígito
}


//RANGE DE PERCENTUAL
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
inputValorImovel.addEventListener('input', function () {
    let valorImovel = converterStringParaNumero(inputValorImovel.value);
    let valorEntrada = converterStringParaNumero(inputValorEntrada.value);

    // Se o valor da entrada for maior que o valor do imóvel, ajuste-o
    if (valorEntrada > 0) {

        //atualizarPercentual();
        calcular_range();
    }

});
inputValorImovel.addEventListener('blur', function () {
    atualizaTotalFinanciamento();

});


//VALOR DE ENTRADA
inputValorEntrada.addEventListener('blur', function () {
    let valorImovel = converterStringParaNumero(inputValorImovel.value);
    let valorEntrada = converterStringParaNumero(inputValorEntrada.value);

    // Se o valor da entrada for maior que o valor do imóvel, ajuste-o
    if (valorEntrada > valorImovel) {
        //inputValorEntrada.value = inputValorImovel.value; // Defina o valor da entrada igual ao valor do imóvel
        $('#form-valor-entrada').val(inputValorImovel.value).mask('#.##0,00', { reverse: true }).trigger('input');
    }

    // Atualizar o percentual após qualquer mudança no valor da entrada
    atualizarPercentual();

});

//IDADE
idadeInput.addEventListener('blur', function () {
    let valor = parseInt(idadeInput.value, 10);

    if (valor < 18 || valor > 80) {
        alert('Por favor, insira uma idade entre 18 e 80 anos.');
        idadeInput.value = ''; // Limpa o valor se estiver fora do intervalo
    }
});


function calcular_range() {
    let valorNumerico = converterStringParaNumero(inputValorImovel.value);
    var result = (inputRange.value / 100) * valorNumerico;

    // Convertendo o valor para o formato brasileiro
    var valorFormatadoBrasileiro = parseFloat(result).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    $('#form-valor-entrada').val(valorFormatadoBrasileiro).mask('#.##0,00', { reverse: true }).trigger('input');
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


function simular() {
    event.preventDefault();

    //Valida os campos obrigatorios
    const inputNome = document.getElementById('form-nome');
    const inputEmail = document.getElementById('form-email');
    const inputCpf = document.getElementById('form-cpf');
    const inputCelular = document.getElementById('form-celular');
    const inputIdade = document.getElementById('form-idade');
    const selectEstado = document.getElementById('form-estado');

    const cpfLimpo = removerCaracteresEspeciais(inputCpf.value);
    const celularLimpo = removerCaracteresEspeciais(inputCelular.value);

    //Nome
    if (inputNome.value.trim() === "") {
        inputNome.focus();
        return;
    }

    //Email
    if (inputEmail.value.trim() === "") {
        inputEmail.focus();
        return;
    }

    //Cpf
    if (cpfLimpo.trim() === "") {
        inputCpf.focus();
        return;
    }

    //Celular
    if (celularLimpo.trim() === "") {
        inputCelular.focus();
        return;
    }

     //Idade
     if (inputIdade.value.trim() === "") {
        inputIdade.focus();
        return;
    }

    //Estado
    if (!isEstadoSelecionado()) {
        selectEstado.focus();
        console.log("Por favor, selecione um estado.");
        return;
    }


    if (!validaCPF(cpfLimpo)) {
        inputCpf.focus();
        console.log("CPF válido");
        alert('Ops! Parece que o CPF informado não é válido.');
        return;
    }

    //Mostra o preloader
    document.querySelector(".preloader").style.display = "flex";

    //Oculta os dados cadastrais
    $('#dados-cadastrais').hide();

}

function isEstadoSelecionado() {
    const selectEstado = document.getElementById('form-estado');
    // Verificar pelo índice
    if (selectEstado.selectedIndex === 0) {
        return false;
    }
    return true;
}


function validaCPF(cpf) {
    cpf = cpf.replace(/[^0-9]/g, ''); // Remove caracteres não numéricos

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false;
    }

    for (let j = 9; j <= 10; j++) {
        let soma = 0;
        for (let i = 0; i < j; i++) {
            soma += cpf[i] * ((j + 1) - i);
        }
        let resto = soma % 11;
        if (resto < 2) {
            resto = 0;
        } else {
            resto = 11 - resto;
        }
        if (resto !== parseInt(cpf.charAt(j))) {
            return false;
        }
    }
    return true;
}