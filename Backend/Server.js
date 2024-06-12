const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

let windowSize = 10;
let numberWindow = [];

const thirdPartyAPI = 'http://localhost:4000/numbers';

const isQualifiedID = (id) => ['p', 'f', 'e', 'r'].includes(id);

const fetchNumbers = async (id) => {
    try {
        const response = await axios.get(`${thirdPartyAPI}/${id}`, { timeout: 500 });
        console.log(`Fetched numbers for ${id}:`, response.data.numbers);
        return response.data.numbers;
    } catch (error) {
        console.error(`Error fetching numbers: ${error.message}`);
        return [];
    }
};

const updateNumberWindow = (numbers) => {
    const uniqueNumbers = [...new Set(numbers)];
    uniqueNumbers.forEach(num => {
        if (!numberWindow.includes(num)) {
            if (numberWindow.length >= windowSize) {
                numberWindow.shift();
            }
            numberWindow.push(num);
        }
    });
    console.log('Updated number window:', numberWindow);
};

const calculateAverage = () => {
    if (numberWindow.length === 0) return 0;
    const sum = numberWindow.reduce((acc, num) => acc + num, 0);
    return (sum / numberWindow.length).toFixed(2);
};

app.get('/numbers/:id', async (req, res) => {
    const id = req.params.id;
    if (!isQualifiedID(id)) {
        return res.status(400).json({ error: 'Invalid ID' });
    }

    const windowPrevState = [...numberWindow];
    const numbers = await fetchNumbers(id);
    updateNumberWindow(numbers);
    const windowCurrState = [...numberWindow];
    const avg = calculateAverage();

    res.json({
        windowPrevState,
        windowCurrState,
        numbers,
        avg
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
