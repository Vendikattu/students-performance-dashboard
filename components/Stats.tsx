import { Student } from '../lib/analytics';

export default function Stats({ data }:{ data: Student[] }){
  const avg = (k:keyof Student)=> (data.reduce((s,d)=>s+Number(d[k]||0),0)/Math.max(1,data.length)).toFixed(1);
  return (
    <div className="grid grid-3">
      <div className="card"><h3>Average Assessment</h3><div className="muted">{avg('assessment_score')}</div></div>
      <div className="card"><h3>Average Cognitive Skills</h3><div className="muted">
        Comp {avg('comprehension')} • Attn {avg('attention')} • Focus {avg('focus')} • Retn {avg('retention')}
      </div></div>
      <div className="card"><h3>Average Engagement (min)</h3><div className="muted">{avg('engagement_time')}</div></div>
    </div>
  );
}
