// Función para obtener los datos de la API de CoinGecko
async function fetchBitcoinData(days) {
    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${days}`);
        if (!response.ok) {
            throw new Error("Error al obtener los datos de la API");
        }
        const data = await response.json();

        // Extraer las fechas y los precios
        const dates = data.prices.map(price => new Date(price[0]).toLocaleDateString());
        const prices = data.prices.map(price => price[1]);

        // Crear o actualizar el gráfico
        createOrUpdateChart(dates, prices);
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        alert("Hubo un problema al cargar los datos. Por favor, inténtalo de nuevo más tarde.");
    }
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
                borderColor: 'rgba(0, 123, 255, 1)', // Azul corporativo
                backgroundColor: 'rgba(0, 123, 255, 0.1)', // Azul con transparencia
                borderWidth: 2,
                tension: 0.3 // Suaviza las líneas
            }]
        },
        options: {
            responsive: true, // Gráfico responsivo
            maintainAspectRatio: false, // Permite alto dinámico
            scales: {
                x: {
                    ticks: {
                        maxTicksLimit: 5, // Limita etiquetas en el eje X para claridad
                        color: '#495057' // Color de las etiquetas
                    },
                    grid: {
                        color: 'rgba(108, 117, 125, 0.1)' // Líneas sutiles
                    }
                },
                y: {
                    ticks: {
                        color: '#495057' // Color de las etiquetas
                    },
                    grid: {
                        color: 'rgba(108, 117, 125, 0.1)' // Líneas sutiles
                    },
                    beginAtZero: false // No empezar en cero para resaltar variaciones
                }
            },
            plugins: {
                legend: {
                    position: 'top', // Ajusta la posición de la leyenda
                    labels: {
                        color: '#343a40' // Color del texto de la leyenda
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return `$${tooltipItem.raw.toFixed(2)}`; // Formato de precios
                        }
                    }
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
