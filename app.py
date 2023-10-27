from flask import Flask, render_template, jsonify,request
import requests

app = Flask(__name__)

API_BASE_URL = 'https://usvlbrk01rn001.azurewebsites.net' 
CLIENT_ID = 'falcon_financiamentos'
CLIENT_SECRET = 'F@lc0NF1n@nc1@m3nt0s'
GRANT_TYPE = 'client_credentials'  # Apenas um exemplo, ajuste conforme necessário


@app.route('/')
def index():
    return render_template('index.html')

def get_token():
    token_response = requests.post(
        f"{API_BASE_URL}/token_endpoint",
        data={
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET,
            'grant_type': GRANT_TYPE
        }
    )
    return token_response.json().get("access_token")


@app.route('/simular', methods=['POST'])
def get_dados():
   # Pegar dados do POST
    data = request.json

    #Valida os daos de entrada
    

    # Autenticar para obter o token
    token = get_token()
    if not token:
        return jsonify({"error": "Failed to get access token."}), 401

    headers = {
        'Authorization': f"Bearer {token}"
    }

    # Construir dados completos para simulação
    simulation_data = {
        "Nome": data.get("Nome"),
        "CPF": data.get("CPF"),
        "Email": data.get("Email"),
        "Celular": data.get("Celular"),
        "LocalizacaoImovel": data.get("LocalizacaoImovel"),
        "EscolheuImovel": True,  # Padrão
        "FinanciarDespesas": False,  # Padrão
        "OutroParticipante": False,  # Padrão
        "TipoImovel": data.get("TipoImovel"),
        "ValorImovel": data.get("ValorImovel"),
        "ValorEntrada": data.get("ValorEntrada"),
        "PrazoMeses": data.get("PrazoMeses"),
        "Nascimento": "1979-05-23",  # Padrão para este exemplo
        "RendaMensal": 100000,  # Padrão para este exemplo
        "SistemaAmortizador": 1,  # Padrão
        "Seguradora": "ITAU",  # Padrão
        "SeguradoraSantander": "ZURICH SANTANDER"  # Padrão
    }


    response = requests.post(f"{API_BASE_URL}/api/simulacao", headers=headers, json=simulation_data)

    return response.json()
   


if __name__ == '__main__':
    app.run(debug=True)
