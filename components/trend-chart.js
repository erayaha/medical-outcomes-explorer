function getPoints(series, key, width, height) {
  const values = series.map((item) => item[key]);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  return series
    .map((item, index) => {
      const x = (index / (series.length - 1 || 1)) * (width - 20) + 10;
      const y = height - ((item[key] - min) / range) * (height - 20) - 10;
      return `${x},${y}`;
    })
    .join(" ");
}

export function TrendChart({ title, series, dataKey, color = "#0f766e" }) {
  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3>{title}</h3>
        <p>{series.map((item) => item.period).join(" • ")}</p>
      </div>
      <svg viewBox="0 0 320 160" role="img" aria-label={title} className="trend-chart">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="4"
          points={getPoints(series, dataKey, 320, 160)}
        />
      </svg>
      <div className="chart-values">
        {series.map((item) => (
          <div key={item.period}>
            <strong>{item.period}</strong>
            <span>{item[dataKey]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
