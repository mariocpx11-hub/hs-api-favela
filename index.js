const express = require('express');
const axios = require('axios'); // Vamos usar axios para buscar dados de fora
const app = express();

app.get('/api/account', async (req, res) => {
    const { uid } = req.query;
    const region = req.query.region || 'br';

    if (!uid) {
        return res.status(400).json({ error: "UID obrigatorio" });
    }

    try {
        // Tentando buscar dados de um servidor de consulta real
        // Nota: Se este link cair, avisar para trocarmos a fonte
        const response = await axios.get(`https://freefireapi.com.br/api/info_player/${uid}?region=${region}`);
        
        // Retornamos exatamente o que o seu código Java espera ler
        res.json(response.data);

    } catch (error) {
        // Se a consulta real falhar, mandamos o "Modo Offline" para o app não crashar
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
