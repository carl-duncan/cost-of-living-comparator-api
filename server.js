const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/scrape', async (req, res) => {
    try {
        const { data } = await axios.get('https://www.numbeo.com/cost-of-living/rankings.jsp');
        const $ = cheerio.load(data);
        const citiesAndIndices = [];

        $('tr').each((i, row) => {
            const city = $(row).find('.cityOrCountryInIndicesTable').text().trim();
            const index = parseFloat($(row).find('td').eq(2).text().trim());

            if (city && !isNaN(index)) {
                citiesAndIndices.push({ city, index });
            }
        });

        res.json(citiesAndIndices);
    } catch (error) {
        res.status(500).send('Error fetching data' + error);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
