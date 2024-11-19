// Función para obtener los datos de la API de Alpha Vantage
async function fetchData(ticker, days) {
    try {
        // Reemplaza con tu clave de API de Alpha Vantage
        const apiKey = 'UICGYCMY2MBB2IIC'; // Obtén tu clave desde https://www.alphavantage.co/support/#api-key
        const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&outputsize=compact&apikey=${apiKey}`;
        
        console.log(`Fetching URL: ${apiUrl}`); // Verificar la URL construida

        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error("Error al obtener los datos de la API");
        }
        const data = await response.json();
        console.log(`Fetched data:`, data); 

        // Verificamos si los datos de la respuesta son correctos
        if (data['Time Series (Daily)']) {
            const timeSeries = data['Time Series (Daily)'];
            const dates = Object.keys(timeSeries).slice(0, days); // Obtener los últimos 'days' días
            const prices = dates.map(date => timeSeries[date]['4. close']); // Obtener los precios de cierre

            // Actualizar el título con el ticker de la acción o criptomoneda
            document.getElementById('chartTitle').textContent = `Gráfico de ${ticker.toUpperCase()}`;

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
function updateChart(days) {
    const urlParams = new URLSearchParams(window.location.search);
    const ticker = urlParams.get('ticker') || 'AAPL'; // Si no se encuentra 'ticker', por defecto es 'AAPL' (Apple)
    fetchData(ticker, days); // Llamada a fetchData con el ticker y los días seleccionados
}

// Leer el parámetro 'ticker' de la URL y actualizar el gráfico con el ticker correcto
window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const ticker = urlParams.get('ticker') || 'AAPL'; // Si no se encuentra 'ticker', por defecto es 'AAPL' (Apple)
    
    // Actualizar el título con el ticker de la URL
    document.getElementById('chartTitle').textContent = `Gráfico de ${ticker.toUpperCase()}`;

    // Llamar a la función updateChart para mostrar el gráfico de los últimos 7 días por defecto
    updateChart(7); // Aquí pasas los últimos 7 días como valor predeterminado
});
