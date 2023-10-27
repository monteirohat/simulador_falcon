from flask import Flask, render_template, jsonify, request
import requests

from utils import Validations


app = Flask(__name__)

API_BASE_URL_TOKEN = 'https://usvlbrk01rn001.azurewebsites.net'
API_BASE_URL = 'https://prd-api-simulador.credimorar.me'
CLIENT_ID = 'falcon_financiamentos'
CLIENT_SECRET = 'F@lc0NF1n@nc1@m3nt0s'
GRANT_TYPE = 'client_credentials'  # Apenas um exemplo, ajuste conforme necessário


@app.route('/')
def index():
    return render_template('index.html')


def get_token():
    token_response = requests.post(
        f"{API_BASE_URL_TOKEN}/connect/token",
        data={
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET,
            'grant_type': GRANT_TYPE
        }
    )
    return token_response.json().get("access_token")


@app.route('/simular', methods=['POST'])
def simular():
    data = request.json

    # Valida os dados de entrada
    nome = data.get("Nome")
    cpf = data.get("Cpf")
    email = data.get("Email")
    celular = data.get("Celular")
    estado = data.get("LocalizacaoImovel")
    tipo_imovel = data.get("TipoImovel")
    valor_imovel = data.get("ValorImovel")
    valor_entrada = data.get("ValorEntrada")
    prazo = data.get("PrazoMeses")

    # Validação dos campos
    if not all([nome, cpf, email, celular, estado, tipo_imovel, valor_imovel, valor_entrada, prazo]):
        return jsonify({"error": "Todos os campos são obrigatórios."}), 400


    if not Validations.valida_cpf(cpf):
        return jsonify({"error": "CPF inválido."}), 400

    if not Validations.valida_celular(celular):
        return jsonify({"error": "O celular está no formato incorreto, o número deve começar com 9 e conter 9 dígitos sem contar o DDD."}), 400


    if not valor_imovel > 0:
        return jsonify({"error": "O valor do imóvel deve ser maior que zero."}), 400

    # Autenticar para obter o token
    token = get_token()
    if not token:
        return jsonify({"error": "Failed to get access token."}), 401

    headers = {
        'Authorization': f"Bearer {token}"
    }

    simulation_data = {
        "Nome": nome,
        "CPF": cpf,
        "Email": email,
        "Celular": celular,
        "LocalizacaoImovel": estado,
        "EscolheuImovel": True,  # Padrão
        "FinanciarDespesas": False,  # Padrão
        "OutroParticipante": False,  # Padrão
        "NomeParticipante": "string", # Somente se OutroParticipante = true */
        "CPFParticipante": "string", # Somente se OutroParticipante = true */
        "NascimentoParticipante": "0", # Somente se OutroParticipante = true */
        "RendaMensalParticipante": 0, # Somente se OutroParticipante = true */
        "TipoImovel": tipo_imovel,
        "ValorImovel": valor_imovel,
        "ValorEntrada": valor_entrada,
        "PrazoMeses": prazo,
        "Nascimento": "1979-05-23",  # Padrão para este exemplo
        "RendaMensal": 100000,  # Padrão para este exemplo
        "SistemaAmortizador": 1,  # Padrão
        "Seguradora": "ITAU",  # Padrão
        "SeguradoraSantander": "ZURICH SANTANDER"  # Padrão
    }

    print(simulation_data)
    response = requests.post(
        f"{API_BASE_URL}/api/simulacao", headers=headers, json=simulation_data)

    return response.json()


if __name__ == '__main__':
    app.run(debug=True)
