// Función para obtener los datos de la API de Yahoo Finance o cualquier otra API para obtener precios históricos
async function fetchData(ticker, days) {
    try {
        // Construir la URL en función del ticker y los días solicitados
        let url;
        
        // Usaremos Yahoo Finance para obtener precios históricos de acciones y otros activos
        // Asumimos que el ticker puede ser una acción (ejemplo: AAPL) o criptomoneda (ejemplo: BTC)
        url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?range=${days}d&interval=1d`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Error al obtener los datos de la API");
        }
        const data = await response.json();

        // Verificamos si los datos de la respuesta son correctos
        if (data.chart && data.chart.result) {
            const timestamps = data.chart.result[0].timestamp;
            const prices = data.chart.result[0].indicators.quote[0].close;
            const dates = timestamps.map(ts => new Date(ts * 1000).toLocaleDateString()); // Convertir timestamps a fechas

            createOrUpdateChart(dates, prices, ticker);
        } else {
            throw new Error("No se encontraron datos válidos para este ticker.");
        }

    } catch (error) {
        console.error("Error al obtener los datos:", error);
        alert("Hubo un problema al cargar los datos. Por favor, inténtalo de nuevo más tarde.");
    }
}

// Variable para guardar la instancia del gráfico
let chartInstance;

// Crear o actualizar el gráfico con los datos recibidos
function createOrUpdateChart(labels, data, ticker) {
    const ctx = document.getElementById('btcChart').getContext('2d');

    // Si el gráfico ya existe, destrúyelo antes de crear uno nuevo
    if (chartInstance) {
        chartInstance.destroy();
    }

    // Crear el gráfico
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `Precio de ${ticker.toUpperCase()}`,
                data: data,
                borderColor: 'rgba(0, 123, 255, 1)', // Azul corporativo
                backgroundColor: 'rgba(0, 123, 255, 0.1)', // Azul con transparencia
                borderWidth: 1.5,
                tension: 0.3,
                pointRadius: 2, 
                pointHoverRadius: 5,
            }]
        },
        options: {
            responsive: true, // Gráfico responsivo
            maintainAspectRatio: false, // Permite alto dinámico
            scales: {
                x: {
                    ticks: {
                        maxTicksLimit: 10, // Limita etiquetas en el eje X para claridad
                        color: '#495057' // Color de las etiquetas
                    },
                    grid: {
                        color: 'rgba(108, 117, 125, 0.1)' // Líneas sutiles
                    }
                },
                y: {
                    ticks: {
                        color: '#495057', // Color de las etiquetas
                        callback: function(value) {
                            return `$${value.toFixed(2)}`;  // Añadir "USD $" a cada valor en el eje Y
                        }
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
function updateChart(ticker, days) {
    fetchData(ticker, days);
}

// Leer el parámetro 'ticker' de la URL y actualizar el gráfico con el ticker correcto
window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const ticker = urlParams.get('ticker') || 'AAPL'; // Si no se encuentra 'ticker', por defecto es 'AAPL' (Apple)
    updateChart(ticker, 7); // Por defecto, muestra los últimos 7 días
});
