// Obtener datos de Apple usando la API de Yahoo Finance
async function getAppleData() {
    const response = await fetch('https://query1.finance.yahoo.com/v7/finance/chart/AAPL?range=1mo&interval=1d');
    const data = await response.json();

    // Procesar datos
    const timestamps = data.chart.result[0].timestamp;
    const prices = data.chart.result[0].indicators.quote[0].close;

    const dates = timestamps.map(ts => new Date(ts * 1000).toLocaleDateString());
    
    // Crear el gráfico
    const trace = {
        x: dates,
        y: prices,
        mode: 'lines',
        name: 'Precio de Cierre',
    };

    const layout = {
        title: 'Gráfico de AAPL - Último Mes',
        xaxis: { title: 'Fecha' },
        yaxis: { title: 'Precio de Cierre (USD)' },
    };

    Plotly.newPlot('plot', [trace], layout);
}

// Llamar a la función para generar el gráfico
getAppleData();
