function getPoints(series, dataKey, width, height) {
  const values = series.map((item) => item[dataKey]);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  return series
    .map((item, index) => {
      const x = series.length === 1 ? width / 2 : (index / (series.length - 1)) * (width - 20) + 10;
      const y = height - ((item[dataKey] - min) / range) * (height - 20) - 10;
      return `${x},${y}`;
    })
    .join(" ");
}

export function TrendChart({
  title,
  series,
  dataKey = "value",
  color = "#0f766e",
  description,
  valueFormatter = (value) => `${value}`,
}) {
  const filteredSeries = series.filter((item) => item[dataKey] !== null && item[dataKey] !== undefined);

  if (!filteredSeries.length) {
    return (
      <div className="chart-card">
        <div className="chart-header">
          <h3>{title}</h3>
        </div>
        <p className="helper-text">No published values are available for this chart in the current government snapshot.</p>
      </div>
    );
  }

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <h3>{title}</h3>
          {description ? <p>{description}</p> : null}
        </div>
        <p>{filteredSeries.map((item) => item.period).join(" • ")}</p>
      </div>
      <svg viewBox="0 0 320 160" role="img" aria-label={title} className="trend-chart">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="4"
          points={getPoints(filteredSeries, dataKey, 320, 160)}
        />
      </svg>
      <div className="chart-values">
        {filteredSeries.map((item) => (
          <div key={item.period}>
            <strong>{item.period}</strong>
            <span>{valueFormatter(item[dataKey])}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
