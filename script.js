// Obtener los datos de la API de CoinGecko
async function fetchBitcoinData() {
    const response = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30');
    const data = await response.json();
    
    // Extraer las fechas y los precios
    const dates = data.prices.map(price => new Date(price[0]).toLocaleDateString());
    const prices = data.prices.map(price => price[1]);

    // Crear el gráfico
    createChart(dates, prices);
}

// Crear el gráfico de Bitcoin
function createChart(labels, data) {
    const ctx = document.getElementById('btcChart').getContext('2d');
    const btcChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Precio de Bitcoin (USD)',
                data: data,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

// Llamar la función para obtener los datos al cargar la página
fetchBitcoinData();
