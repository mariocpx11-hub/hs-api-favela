const express = require('express');
const axios = require('axios');
const app = express();

app.get('/api/account', async (req, res) => {
    const { uid } = req.query;
    
    // Lista de regiões do seu último código
    const regioes = ["br", "us", "ind", "ru", "sg", "me", "cis", "id", "th", "vn", "tw", "eu"];

    if (!uid) {
        return res.status(400).json({ error: "UID obrigatorio" });
    }

    let finalData = null;

    // Tenta encontrar o UID em cada região, uma por uma
    for (const r of regioes) {
        try {
            // Testamos dois servidores diferentes para cada região
            const urls = [
                `https://ff-api-001.vercel.app/api/info?uid=${uid}&region=${r}`,
                `https://freefireapi.com.br/api/info_player/${uid}?region=${r}`
            ];

            for (const url of urls) {
                const response = await axios.get(url, { timeout: 3000 });
                
                // Se o nickname for válido e não for erro, achamos!
                if (response.data && response.data.basicInfo && response.data.basicInfo.nickname && !response.data.basicInfo.nickname.includes("NAO ENCONTRADO")) {
                    finalData = response.data;
                    break; 
                }
            }
            if (finalData) break; // Se achou em uma região, para de procurar nas outras
        } catch (e) {
            continue; // Se der erro em uma região, pula para a próxima
        }
    }

    if (finalData) {
        res.json(finalData);
    } else {
        // Se percorrer tudo e não achar nada
        res.json({
            basicInfo: {
                nickname: "ID NÃO LOCALIZADO",
                level: 0,
                liked: 0,
                region: "OFFLINE",
                rankingPoints: 0,
                csRankingPoints: 0,
                exp: 0,
                createAt: 0,
                badgeCnt: 0
            },
            clanBasicInfo: { clanName: "Sem Guilda", clanId: "0" },
            socialInfo: { signature: "UID inexistente ou servidor instável." }
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API HS Favela Multiregião online`);
});
