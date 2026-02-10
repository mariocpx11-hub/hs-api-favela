const express = require('express');
const app = express();

// Rota que o seu app ADJUSTE vai ler
app.get('/api/account', (req, res) => {
    const { uid } = req.query;

    res.json({
        basicInfo: {
            nickname: "HS_FAVELA_PRO",
            level: 80,
            liked: 1234,
            region: "BR",
            rankingPoints: 4200,
            exp: 999999,
            createAt: 1609459200,
            badgeCnt: 15
        },
        clanBasicInfo: {
            clanName: "DEVS_DO_MORRO",
            clanId: "777888"
        },
        socialInfo: {
            signature: "Minha API rodando na Vercel! 🔥"
        }
    });
});

// A Vercel define a porta automaticamente, por isso usamos process.env.PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API rodando na porta ${PORT}`);
});
