import { Bar, Scatter, Radar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, RadialLinearScale, Title, Tooltip, Legend } from 'chart.js';
import { Student, skills, corr } from '../lib/analytics';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, RadialLinearScale, Title, Tooltip, Legend);

export default function Charts({ data, profile }:{ data: Student[], profile: Student | null }){
  const barData = { labels: skills, datasets: [{ label: 'Correlation with Assessment', data: skills.map(s => corr(data.map(d=>d[s]), data.map(d=>d.assessment_score))) }] };
  const scatterData = { datasets: [{ label: 'Attention vs Assessment', data: data.map(d => ({ x: d.attention, y: d.assessment_score })) }] };
  const radarData = profile
    ? { labels: ['Comprehension','Attention','Focus','Retention'], datasets: [{ label: profile.name, data: [profile.comprehension, profile.attention, profile.focus, profile.retention] }] }
    : { labels: [], datasets:[{label:'', data:[]}] };

  return (
    <div className="grid">
      <div className="card"><Bar data={barData} /></div>
      <div className="card"><Scatter data={scatterData} /></div>
      <div className="card"><Radar data={radarData} /></div>
      <div className="muted" style={{padding:'8px 12px'}}>Tip: Select or click a student to populate the Radar profile.</div>
    </div>
  );
}
