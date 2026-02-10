const express = require('express');
const axios = require('axios');
const app = express();

app.get('/api/account', async (req, res) => {
    const { uid } = req.query;
    const region = req.query.region || 'br';

    if (!uid) {
        return res.status(400).json({ error: "UID obrigatorio" });
    }

    // Lista de servidores de consulta para tentar um por um
    const servers = [
        `https://ff-api-001.vercel.app/api/info?uid=${uid}&region=${region}`,
        `https://freefireapi.com.br/api/info_player/${uid}?region=${region}`
    ];

    let data = null;

    // Loop que tenta nos servidores até conseguir um resultado real
    for (const url of servers) {
        try {
            const response = await axios.get(url, { timeout: 5000 });
            // Verifica se o nickname existe e não é erro
            if (response.data && response.data.basicInfo && response.data.basicInfo.nickname) {
                data = response.data;
                break; // Achou os dados! Para de procurar.
            }
        } catch (e) {
            continue; // Falhou esse servidor? Tenta o próximo.
        }
    }

    if (data) {
        res.json(data);
    } else {
        // Se nenhum servidor encontrar o jogador
        res.json({
            basicInfo: {
                nickname: "NOME NÃO LOCALIZADO",
                level: 0,
                liked: 0,
                region: region.toUpperCase(),
                rankingPoints: 0,
                csRankingPoints: 0,
                exp: 0,
                createAt: 0,
                badgeCnt: 0
            },
            clanBasicInfo: {
                clanName: "Sem Guilda",
                clanId: "0"
            },
            socialInfo: {
                signature: "Verifique o UID e tente novamente."
            }
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API HS Favela online na porta ${PORT}`);
});
