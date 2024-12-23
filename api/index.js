const express = require('express');
const pipedrive = require('pipedrive');
const bodyParser = require('body-parser');
const path = require("node:path");
require('dotenv').config();

const app = express();
const PORT = 3000;

// Настройка body-parser для обработки данных
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

app.post('/save-deal', async (req, res) => {
    try {
        const { client, job, location, schedule } = req.body;

        const apiClient = new pipedrive.ApiClient();
        apiClient.authentications.api_key.apiKey = process.env.API_TOKEN;

        const dealsApi = new pipedrive.DealsApi(apiClient);

        const deal = await dealsApi.addDeal({
            title: `${client.firstName} ${client.lastName}`,
            person_id: null, // Укажите person_id, если есть
            value: 0,
            status: 'open',
            custom_fields: {
                jobType: job.type,
                jobSource: job.source,
                address: location.address,
                startDate: schedule.startDate,
            },
        });

        res.status(200).json(deal);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).send(error.message);
    }
});

app.post('/save-note', async (req, res) => {
    const { dealId, noteContent } = req.body;

    const apiClient = new pipedrive.ApiClient();
    apiClient.authentications.api_key.apiKey = process.env.API_TOKEN;

    const notesApi = new pipedrive.NotesApi(apiClient);

    try {
        const note = await notesApi.addNote({
            content: noteContent,
            deal_id: dealId,
        });

        res.status(200).json({ message: 'Note added successfully!', note });
    } catch (error) {
        console.error('Error adding note:', error.message);
        res.status(500).json({ error: 'Failed to add note!' });
    }
});

app.get('/', (req, res) => {
    // res.json({ message: "API is working!" });
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api', async (req, res) => {
    try {
        // Создаём клиент API
        const apiClient = new pipedrive.ApiClient();

        // Устанавливаем API токен
        let apiToken = apiClient.authentications.api_key;
        apiToken.apiKey = process.env.API_TOKEN;

        // Создаём объект для работы с ресурсом "Сделки"
        const api = new pipedrive.DealsApi(apiClient);

        // Получаем все сделки
        const deals = await api.getDeals();

        // Отправляем сделки в ответе
        return res.send(deals);
    } catch (error) {
        console.error('Error:', error);

        // Обрабатываем ошибки
        res.status(500).json({
            error: error.message,
        });
    }
});

app.get('/sidepanel', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../public/sidepanel.html'));
});


app.listen(PORT, () => {
    console.log(`Server run PORT: ${PORT}`);
});

module.exports = app;
