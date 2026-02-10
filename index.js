const express = require('express');
const axios = require('axios');
const app = express();

app.get('/api/account', async (req, res) => {
    const { uid } = req.query;
    
    // As 13 regiões que você confirmou que funcionam
    const regioes = ["ind", "br", "sg", "ru", "id", "tw", "us", "vn", "th", "me", "pk", "cis", "bd"];

    if (!uid) {
        return res.status(400).json({ error: "UID obrigatorio" });
    }

    let finalData = null;

    for (const r of regioes) {
        try {
            // Lista de APIs de consulta (fontes diferentes)
            const urls = [
                `https://freefireapi.com.br/api/info_player/${uid}?region=${r}`,
                `https://ff-api-001.vercel.app/api/info?uid=${uid}&region=${r}`
            ];

            for (const url of urls) {
                try {
                    const response = await axios.get(url, { timeout: 4000 });
                    const data = response.data;

                    // Validação pesada: Só aceita se tiver nickname REAL
                    if (data && data.basicInfo && data.basicInfo.nickname) {
                        const nick = data.basicInfo.nickname.toUpperCase();
                        
                        // Se o nick NÃO contiver mensagens de erro, nós achamos!
                        if (!nick.includes("NÃO ENCONTRADO") && !nick.includes("NAO ENCONTRADO") && !nick.includes("NOT FOUND") && !nick.includes("ERRO")) {
                            finalData = data;
                            finalData.basicInfo.region = r.toUpperCase(); // Força a região correta no JSON
                            break;
                        }
                    }
                } catch (err) {
                    continue; // Se uma URL falhar, tenta a próxima do array 'urls'
                }
            }
            if (finalData) break; // Se achou o jogador, para de percorrer as regiões
        } catch (e) {
            continue; 
        }
    }

    if (finalData) {
        res.json(finalData);
    } else {
        res.status(404).json({
            basicInfo: {
                nickname: "ID NÃO LOCALIZADO",
                level: 0,
                region: "OFFLINE"
            },
            socialInfo: { signature: "Nenhuma das 13 regiões retornou este UID." }
        });
    }
});

module.exports = app; // Importante para a Vercel
