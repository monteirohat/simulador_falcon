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
    const tipoImovelSelecionado = $('input[name="options-tipo-imovel"]:checked').attr('value');

    const valorImovel = converterStringParaNumero(inputValorImovel.value);
    const valorEntrada = converterStringParaNumero(inputValorEntrada.value);

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

    //Valida o celular
    if (!validaCelular(celularLimpo)) {
        inputCelular.focus();
        alert('O celular está no formato incorreto, o número deve começar com 9 e conter 9 dígitos sem contar o DDD.');
        console.log("Número de celular é inválido.");
        return;
    } 

    //Valida se o campo valor foi preenchido
    if(valorImovel <= 0){
        inputValorImovel.focus();
        console.log("Valor do imóvel não informado.");
        alert('Ops! Informe o valor do imóvel.');
        return;
    }


    const datanascimento = generateDataNascimento(inputIdade.value.trim());

    //Mostra o preloader
    document.querySelector(".preloader").style.display = "flex";

    $.ajax({
        url: '/simular',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify({
            Nome: inputNome.value.trim(),
            Email: inputEmail.value.trim(),
            Cpf: cpfLimpo,
            Celular: celularLimpo,
            LocalizacaoImovel: selectEstado.value,
            EscolheuImovel:true,
            FinanciarDespesas:false,
            OutroParticipante:false,
            TipoImovel: tipoImovelSelecionado,
            ValorImovel: valorImovel,
            ValorEntrada: valorEntrada,
            PrazoMeses: 96,
            Nascimento: datanascimento
            
        }),
        success: function (response) {
            // Esconda o preloader
            document.querySelector(".preloader").style.display = "none";

            console.log(response);
            if (response.Sucesso == false){
                alert('Ocorreu um erro a realizar o cálculo.' + response.Erro);
            }
            else{
                var tbody = $("table tbody");
                tbody.empty(); // Limpa as linhas existentes
        
                $.each(response.Simulacao.Calculos, function(i, item) {
                    var imagemSrc = '';
                    if (item.Instituicao === "Bradesco") {
                        imagemSrc = "static/img/logo_bradesco.png";
                    } else if (item.Instituicao === "Itaú") {
                        imagemSrc = "static/img/logo_itau.png";
                    } else if (item.Instituicao === "Santander") {
                        imagemSrc = "static/img/logo_santander.png";
                    }
    
                    var tr = $("<tr></tr>");
                    tr.append('<th><img class="logo-banco" src="' + imagemSrc + '"></th>');
                    tr.append('<td>' + item.TipoOperacao + '</td>');
                    tr.append('<td>' + item.TaxaJuros + '%</td>');
                    tr.append('<td>R$ ' + item.PrimeiraParcela.toFixed(2) + '</td>');
    
                    tbody.append(tr);
                });
            }


            // Mostra os dados cadastrais novamente, se desejar
            //$('#dados-cadastrais').show();
        },
        error: function (error) {
            // Esconda o preloader
            document.querySelector(".preloader").style.display = "none";

            console.error("Erro ao realizar simulação:", error.responseText.toString());
            alert('Ops! Algo deu errado ao tentar realizar a simulação. Tente novamente.');

            // Mostra os dados cadastrais novamente
            $('#dados-cadastrais').show();
        }
    });



    //Oculta os dados cadastrais
    //$('#dados-cadastrais').hide();

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

function validaCelular(celular) {
    // A regex abaixo verifica se o número começa com 2 dígitos de DDD seguidos por um 9 e então 8 dígitos.
    var pattern = /^[0-9]{2}9[0-9]{8}$/;
    return pattern.test(celular);
  }
  

function generateDataNascimento(idade) {
    // Obter a data atual
    let dataAtual = new Date();
  
    // Obter o ano, mês e dia atuais
    let anoAtual = dataAtual.getFullYear();
    let mesAtual = dataAtual.getMonth(); 
    let diaAtual = dataAtual.getDate();
  
    // Calcular o ano de nascimento subtraindo a idade do ano atual
    let anoNascimento = anoAtual - idade;
  
    // Formatar o mês e o dia para garantir que estejam no formato de dois dígitos
    let mesFormatado = (mesAtual + 1).toString().padStart(2, '0'); // Adiciona 1 porque getMonth() retorna de 0 a 11
    let diaFormatado = diaAtual.toString().padStart(2, '0');
  
    // Montar a data de nascimento no formato 'aaaa-mm-dd'
    return `${anoNascimento}-${mesFormatado}-${diaFormatado}`;
  }
  