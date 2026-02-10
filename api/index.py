from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

# Credenciais da sua conta BOT (HS Favela)
BOT_UID = "4355218281"
BOT_PW = "3C85A1BFF4790142BB264BC5AA92F8F91ACEAD2214BEEB50A644F369FB2A05B9"

@app.route('/api/account', methods=['GET'])
def get_account():
    uid = request.args.get('uid')
    region = request.args.get('region', 'br').lower()

    if not uid:
        return jsonify({"error": "UID obrigatorio"}), 400

    # Lista de regiões suportadas
    regioes_validas = ["ind", "br", "sg", "ru", "id", "tw", "us", "vn", "th", "me", "pk", "cis", "bd"]
    
    if region not in regioes_validas:
        region = "br"

    try:
        # Usando uma ponte de protocolo estável que aceita autenticação via Guest Token
        # Esta URL simula o handshake que o seu bot faria no servidor da Garena
        api_url = f"https://freefire-2-api-check.vercel.app/api/v1/info?uid={uid}&region={region}&token={BOT_PW}&botid={BOT_UID}"
        
        response = requests.get(api_url, timeout=12)
        
        if response.status_code == 200:
            return jsonify(response.json())
        else:
            raise Exception("Falha na ponte")

    except Exception as e:
        # Se o bot falhar ou o token expirar, retorna o template de erro para o App não crashar
        return jsonify({
            "basicInfo": {
                "nickname": "ID NÃO LOCALIZADO",
                "level": 0,
                "region": region.upper(),
                "liked": 0
            },
            "clanBasicInfo": {"clanName": "Sem Guilda"},
            "socialInfo": {"signature": "Servidor instável ou Token expirado."}
        }), 200 # Retornamos 200 para o Android conseguir ler a mensagem de erro no JSON

# Handler para Vercel
def handler(event, context):
    return app(event, context)
    
