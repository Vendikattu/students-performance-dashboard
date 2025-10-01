import { Bar, Scatter, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, RadialLinearScale,
  PointElement, LineElement, BarElement,
  Title, Tooltip, Legend, Filler,
  type ChartData, type ChartOptions
} from 'chart.js';
import { Student, skills, corr } from '../lib/analytics';

ChartJS.register(
  CategoryScale, LinearScale, RadialLinearScale,
  PointElement, LineElement, BarElement,
  Title, Tooltip, Legend, Filler
);

const axisColor = '#334155';      // slate-700
const gridColor = 'rgba(51,65,85,.35)';
const textColor = '#e5e7eb';      // gray-200
const primary = '#6366f1';        // indigo-500
const primaryFill = 'rgba(99,102,241,.25)';
const accent = '#22c55e';         // green-500
const accentFill = 'rgba(34,197,94,.25)';

const baseOptions: ChartOptions<'bar' | 'scatter' | 'radar'> = {
  responsive: true,
  plugins: {
    legend: { labels: { color: textColor } },
    title: { display: false }
  }
};

export default function Charts({ data, profile }: { data: Student[]; profile: Student | null }) {
  const labels = skills.slice() as string[];

  const barData: ChartData<'bar'> = {
    labels,
    datasets: [{
      label: 'Correlation with Assessment',
      data: skills.map(s => corr(data.map(d => d[s]), data.map(d => d.assessment_score))),
      backgroundColor: primaryFill,
      borderColor: primary,
      borderWidth: 2,
      borderRadius: 8
    }]
  };
  const barOptions: ChartOptions<'bar'> = {
    ...baseOptions,
    scales: {
      x: { ticks: { color: textColor }, grid: { color: gridColor } },
      y: { ticks: { color: textColor }, grid: { color: gridColor }, suggestedMin: -1, suggestedMax: 1 }
    }
  };

  const scatterData: ChartData<'scatter', { x: number; y: number }[]> = {
    datasets: [{
      label: 'Attention vs Assessment',
      data: data.map(d => ({ x: d.attention, y: d.assessment_score })),
      backgroundColor: accent, pointRadius: 3
    }]
  };
  const scatterOptions: ChartOptions<'scatter'> = {
    ...baseOptions,
    scales: {
      x: { title: { display: true, text: 'Attention', color: textColor }, ticks: { color: textColor }, grid: { color: gridColor } },
      y: { title: { display: true, text: 'Assessment', color: textColor }, ticks: { color: textColor }, grid: { color: gridColor } }
    }
  };

  const radarData: ChartData<'radar'> = profile ? {
    labels: ['Comprehension','Attention','Focus','Retention'],
    datasets: [{
      label: profile.name,
      data: [profile.comprehension, profile.attention, profile.focus, profile.retention],
      backgroundColor: primaryFill, borderColor: primary, borderWidth: 2, pointBackgroundColor: primary
    }]
  } : { labels: [], datasets: [{ label: '', data: [] }] };
  const radarOptions: ChartOptions<'radar'> = {
    ...baseOptions,
    scales: {
      r: {
        grid: { color: gridColor },
        angleLines: { color: gridColor },
        pointLabels: { color: textColor },
        ticks: { showLabelBackdrop: false, color: textColor }
      }
    }
  };

  return (
    <div className="grid">
      <div className="card"><Bar data={barData} options={barOptions} /></div>
      <div className="card"><Scatter data={scatterData} options={scatterOptions} /></div>
      <div className="card"><Radar data={radarData} options={radarOptions} /></div>
      <div className="muted" style={{padding:'8px 12px'}}>Tip: Select a student or click a row to populate the radar profile.</div>
    </div>
  );
}
