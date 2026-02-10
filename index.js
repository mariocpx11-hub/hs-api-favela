const express = require('express');
const axios = require('axios'); 
const app = express();

app.get('/api/account', async (req, res) => {
    const { uid } = req.query;
    const region = req.query.region || 'br';

    if (!uid) {
        return res.status(400).json({ error: "UID obrigatorio" });
    }

    try {
        // Esta linha faz a busca real do jogador
        const response = await axios.get(`https://freefireapi.com.br/api/info_player/${uid}?region=${region}`);
        
        // Retorna os dados reais para o seu App ADJUSTE
        res.json(response.data);

    } catch (error) {
        // Se o servidor de consulta estiver fora ou o UID não existir
        res.json({
            basicInfo: {
                nickname: "ID NAO ENCONTRADO",
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
                clanName: "Erro na Busca",
                clanId: "0"
            },
            socialInfo: {
                signature: "Tente novamente mais tarde."
            }
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
