import { Student } from '../lib/analytics';

export default function Stats({ data }: { data: Student[] }) {
  if (!data.length) return <div className="card">No data loaded</div>;

  const avg = (k: keyof Student) =>
    Math.round(data.reduce((s, d) => s + (d[k] as number), 0) / data.length);

  return (
    <div className="grid grid-3">
      <div className="card">
        <h3>Average Assessment</h3>
        <div style={{ fontSize: 28, fontWeight: 700, color: '#fff' }}>
          {avg('assessment_score')}
        </div>
        <div className="muted">/ 100</div>
      </div>

      <div className="card">
        <h3>Average Cognitive Skills</h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 6 }}>
          <span className="badge">Comp {avg('comprehension')}</span>
          <span className="badge">Attn {avg('attention')}</span>
          <span className="badge">Focus {avg('focus')}</span>
          <span className="badge">Retn {avg('retention')}</span>
        </div>
      </div>

      <div className="card">
        <h3>Average Engagement</h3>
        <div style={{ fontSize: 28, fontWeight: 700, color: '#22c55e' }}>
          {avg('engagement_time')} min
        </div>
        <div className="muted">per session</div>
      </div>
    </div>
  );
}
