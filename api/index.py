from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

# Seus dados da conta BOT
BOT_UID = "4355218281"
BOT_PW = "3C85A1BFF4790142BB264BC5AA92F8F91ACEAD2214BEEB50A644F369FB2A05B9"

@app.route('/api/account', methods=['GET'])
def get_account():
    uid = request.args.get('uid')
    region = request.args.get('region', 'br').lower()

    if not uid:
        return jsonify({"error": "UID obrigatorio"}), 400

    try:
        # Ponte de consulta direta
        api_url = f"https://freefire-2-api-check.vercel.app/api/v1/info?uid={uid}&region={region}&token={BOT_PW}&botid={BOT_UID}"
        response = requests.get(api_url, timeout=10)
        
        if response.status_code == 200:
            return jsonify(response.json())
        else:
            return jsonify({"basicInfo": {"nickname": "ERRO NA PONTE", "level": 0}}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Esta linha é OBRIGATÓRIA para a Vercel funcionar com Flask
if __name__ == "__main__":
    app.run()
