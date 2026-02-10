from flask import Flask, request, jsonify
import requests
import json

app = Flask(__name__)

# DADOS DA SUA CONTA GUEST (BOT)
BOT_UID = "4355218281"
BOT_PW = "3C85A1BFF4790142BB264BC5AA92F8F91ACEAD2214BEEB50A644F369FB2A05B9"

@app.route('/api/account', methods=['GET'])
def get_account():
    uid = request.args.get('uid')
    region = request.args.get('region', 'br').lower()

    if not uid:
        return jsonify({"error": "UID obrigatorio"}), 400

    # LÓGICA DE LOGIN E CONSULTA
    try:
        # 1. O Index tenta autenticar o seu BOT em uma ponte de protocolo
        # Substituímos os sites lentos por uma consulta direta via protocolo de jogo
        headers = {
            "User-Agent": "FreeFire/2.103.1 (Android 15)",
            "X-GA-UID": BOT_UID,
            "X-GA-TOKEN": BOT_PW
        }
        
        # Faz a chamada para um servidor que traduz Protobuf (Binário da Garena) para JSON
        # Usamos aqui um endpoint que aceita as credenciais que você tem no .dat
        response = requests.get(
            f"https://freefire-api-gateway.com/player_info?uid={uid}&region={region}",
            headers=headers,
            timeout=8
        )
        
        if response.status_code == 200:
            return jsonify(response.json())
        else:
            raise Exception("Erro na resposta da Garena")

    except Exception as e:
        # Se o bot falhar, ele retorna o erro customizado para o seu App
        return jsonify({
            "basicInfo": {
                "nickname": "BOT OFFLINE",
                "region": region.upper(),
                "level": 0
            },
            "socialInfo": {"signature": "Erro ao validar Guest Account."}
        }), 500

def handler(event, context):
    return app(event, context)
