// Telegram Web App Integration
const tg = window.Telegram.WebApp;

// Obtener el alto estable del contenedor
document.body.style.height = `${tg.viewportStableHeight}px`;

// Generar Datos de Ejemplo
const generateData = () => {
  const now = new Date();
  const timestamps = Array.from({ length: 20 }, (_, i) => new Date(now - i * 1000 * 60).toISOString());
  const values = Array.from({ length: 20 }, () => Math.random() * 100);
  return { timestamps: timestamps.reverse(), values: values.reverse() };
};

// Configurar el gráfico con Plotly
const drawPlot = () => {
  const data = generateData();
  const trace = {
    x: data.timestamps,
    y: data.values,
    mode: "lines+markers",
    marker: { color: "blue" },
    line: { shape: "spline" },
    name: "Random Data"
  };

  const layout = {
    title: "Ejemplo de Gráfico en Telegram",
    xaxis: { title: "Tiempo", type: "date" },
    yaxis: { title: "Valores Aleatorios" },
    margin: { t: 50, l: 50, r: 20, b: 50 },
    responsive: true // Permitir que sea responsivo
  };

  Plotly.newPlot("plot", [trace], layout, { responsive: true });
};

// Dibujar el gráfico al cargar la página
drawPlot();
