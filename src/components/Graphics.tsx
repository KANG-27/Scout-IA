import  { FC, useEffect, useRef } from "react";
import { Chart, registerables  } from "chart.js";
interface GraphicsProps {
    predictions: Prediction[];
}
interface Prediction {
    probability: number;
    className: string;
    bbox?: number[];

}
Chart.register(...registerables);
const Graphics: FC<GraphicsProps> = ({predictions}) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstanceRef = useRef<Chart | null>(null);
    if (chartRef.current) {
        const ctx = chartRef.current.getContext('2d');
        // Verificar si existe un gráfico previo y destruirlo
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy();
        }
        if (ctx) {
            chartInstanceRef.current = new Chart(ctx, {
              type: 'bar',
              data: {
                labels: predictions.map(p => p.className),
                datasets: [{
                  label: 'Probability',
                  data: predictions.map(p => p.probability * 100),
                  backgroundColor: ['rgba(75, 192, 192, 2)', 'rgba(54, 162, 235, 2)', 'rgba(255, 99, 132, 2)','rgba(227, 134, 0, 2)'],
                  borderColor: ['rgba(75, 192, 192, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
                  borderWidth: 1
                }]
              },
              options: {
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }
            });
        }
    }
    return(
        <div>
            {predictions.length > 0 && (
                <canvas ref={chartRef} width="400" height="400"></canvas>
            )}
        </div>
    )
}
export default Graphics