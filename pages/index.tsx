import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';
import Stats from '../components/Stats';
import Charts from '../components/Charts';
import Table from '../components/Table';
import { Student, linreg, kmeans } from '../lib/analytics';

export default function Home(){
  const [data,setData]=useState<Student[]>([]);
  const [selected, setSelected] = useState<Student|null>(null);
  const [insights, setInsights] = useState<string[]>([]);

  useEffect(()=>{
    fetch('/data/students.json').then(r=>r.json()).then((d:Student[])=>{
      const M = d.map(s=>[s.comprehension,s.attention,s.focus,s.retention]);
      const {labels} = kmeans(M,3,60);
      const named = d.map((s,i)=>({...s, persona: ['Analytical','Balanced','Hands-on'][labels[i]%3]}));
      setData(named);
    });
  },[]);

  const model = useMemo(()=> data.length? linreg(data): null, [data]);

  useEffect(()=>{
    if(!data.length || !model) return;
    const corrs = ['comprehension','attention','focus','retention'].map(k=>{
      const xs = data.map((s:any)=>s[k]); const ys=data.map(s=>s.assessment_score);
      const mx=xs.reduce((a,b)=>a+b,0)/xs.length, my=ys.reduce((a,b)=>a+b,0)/ys.length;
      const num = xs.reduce((s,xi,i)=>s+(xi-mx)*(ys[i]-my),0);
      const den = Math.sqrt(xs.reduce((s,xi)=>s+(xi-mx)**2,0)*ys.reduce((s,yi)=>s+(yi-my)**2,0));
      return {k, r: den? num/den : 0};
    }).sort((a,b)=>Math.abs(b.r)-Math.abs(a.r));

    const top = corrs[0];
    const mae = (function(){
      const errs = data.map(s=>Math.abs((model!.predict(s))-s.assessment_score));
      return (errs.reduce((a,b)=>a+b,0)/errs.length).toFixed(2);
    })();
    const lowEng = data.filter(s=>s.engagement_time<40 && s.assessment_score<60).length;
    setInsights([
      `Strongest driver appears to be ${top.k} (r=${top.r.toFixed(2)}).`,
      `Linear model MAE ≈ ${mae} points (baseline illustrative).`,
      `${lowEng} students are low engagement (<40 min) with low scores (<60). Consider interventions.`
    ]);
  },[data, model]);

  return (
    <div className="container">
      <Head><title>Cognitive Skills & Student Performance Dashboard</title></Head>
      <h1>Cognitive Skills & Student Performance Dashboard</h1>
      <p className="muted">Synthetic dataset • Correlations • Simple ML prediction • Personas</p>

      <Stats data={data} />
      <div className="card" style={{display:'flex',gap:12,alignItems:'center',flexWrap:'wrap'}}>
        <label htmlFor="studentSel">Radar student:</label>
        <select id="studentSel" onChange={(e)=>{
          const id = Number(e.target.value);
          const s = data.find(d=>d.student_id===id) || null;
          setSelected(s);
        }}>
          <option value="">-- Select --</option>
          {data.map(s=>(<option key={s.student_id} value={s.student_id}>{s.name} ({s.class})</option>))}
        </select>
        <span className="muted">Or click a row in the table below.</span>
      </div>

      <Charts data={data} profile={selected} />
      <Table data={data} onSelect={setSelected} />

      <div className="card">
        <h3>Insights</h3>
        <ul>{insights.map((i,idx)=>(<li key={idx}>{i}</li>))}</ul>
      </div>
    </div>
  );
}
