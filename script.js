// Función para obtener los datos de la API de CoinGecko
async function fetchBitcoinData(days) {
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${days}`);
    const data = await response.json();

    // Extraer las fechas y los precios
    const dates = data.prices.map(price => new Date(price[0]).toLocaleDateString());
    const prices = data.prices.map(price => price[1]);

    // Crear o actualizar el gráfico
    createOrUpdateChart(dates, prices);
}

// Variable para guardar la instancia del gráfico
let btcChart;

// Crear o actualizar el gráfico de Bitcoin
function createOrUpdateChart(labels, data) {
    const ctx = document.getElementById('btcChart').getContext('2d');

    // Si el gráfico ya existe, destrúyelo antes de crear uno nuevo
    if (btcChart) {
        btcChart.destroy();
    }

    // Crear el gráfico
    btcChart = new Chart(ctx, {
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
            responsive: true, // Gráfico responsivo
            maintainAspectRatio: false, // Permite que el alto cambie dinámicamente
            scales: {
                y: {
                    beginAtZero: false // No empezar en cero, para ver cambios en el precio
                }
            },
            plugins: {
                legend: {
                    position: 'top', // Ajusta la posición de la leyenda
                }
            }
        }
    });
}

// Función para actualizar el gráfico con un periodo de tiempo específico
function updateChart(days) {
    fetchBitcoinData(days);
}

// Llama a la función con 7 días como valor inicial
window.addEventListener('load', () => {
    updateChart(7); // Por defecto, muestra los últimos 7 días
});
