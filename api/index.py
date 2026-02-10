from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

# Seus dados da conta BOT extraídos do .dat
BOT_UID = "4355218281"
BOT_PW = "3C85A1BFF4790142BB264BC5AA92F8F91ACEAD2214BEEB50A644F369FB2A05B9"

@app.route('/api/account', methods=['GET'])
def get_account():
    uid = request.args.get('uid')
    region = request.args.get('region', 'br').lower()

    if not uid:
        return jsonify({"error": "UID obrigatorio"}), 400

    # Lista de regiões permitidas
    regioes = ["ind", "br", "sg", "ru", "id", "tw", "us", "vn", "th", "me", "pk", "cis", "bd"]
    
    # Aqui a lógica muda: Vamos usar um 'Proxy' de consulta que aceita autenticação via Guest
    # Existem APIs que fazem o trabalho pesado de Protobuf pra você se você passar seu Guest
    try:
        # Exemplo de consulta usando uma ponte que aceita credenciais de bot
        # Nota: Você pode precisar de uma URL de um servidor que suporte o handshake da Garena
        url = f"https://freefire-api-bot-bridge.vercel.app/lookup?uid={uid}&region={region}&bot_uid={BOT_UID}&bot_pw={BOT_PW}"
        
        response = requests.get(url, timeout=10)
        data = response.json()

        return jsonify(data)

    except Exception as e:
        return jsonify({
            "basicInfo": {
                "nickname": "ERRO NA CONTA BOT",
                "region": region.upper()
            },
            "socialInfo": {"signature": "Verifique o Token da conta Guest."}
        }), 500

# Necessário para a Vercel
def handler(event, context):
    return app(event, context)
  
