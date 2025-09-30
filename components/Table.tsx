import { useMemo, useState } from 'react';
import { Student } from '../lib/analytics';

export default function Table({ data, onSelect }:{ data: Student[], onSelect?: (s: Student)=>void }){
  const [q,setQ] = useState('');
  const [sortKey, setSortKey] = useState<keyof Student>('assessment_score');
  const [asc, setAsc] = useState(false);

  const filtered = useMemo(()=>{ const s=q.toLowerCase(); return data.filter(d=> d.name.toLowerCase().includes(s) || d.class.toLowerCase().includes(s)); },[q,data]);
  const sorted = useMemo(()=> filtered.slice().sort((a,b)=>{ const A=a[sortKey] as any, B=b[sortKey] as any; return (A<B?-1:A>B?1:0)*(asc?1:-1); }), [filtered, sortKey, asc]);

  const setSort=(k:keyof Student)=>{ if(k===sortKey) setAsc(!asc); else { setSortKey(k); setAsc(true); } };
  const headers: (keyof Student)[] = ['student_id','name','class','comprehension','attention','focus','retention','engagement_time','assessment_score'];

  return (
    <div className="card">
      <div style={{display:'flex', gap:12, alignItems:'center', marginBottom:12}}>
        <input placeholder="Search by name or class..." value={q} onChange={e=>setQ(e.target.value)} />
      </div>
      <div style={{maxHeight:420, overflow:'auto'}}>
        <table>
          <thead><tr>{headers.map(h=>(<th key={String(h)} onClick={()=>setSort(h)}>{String(h)} {sortKey===h?(asc?'▲':'▼'):''}</th>))}</tr></thead>
          <tbody>
            {sorted.map(s=>(
              <tr key={s.student_id} onClick={()=>onSelect && onSelect(s)} style={{cursor:'pointer'}}>
                <td>{s.student_id}</td><td>{s.name}</td><td>{s.class}</td>
                <td>{s.comprehension}</td><td>{s.attention}</td><td>{s.focus}</td><td>{s.retention}</td><td>{s.engagement_time}</td>
                <td><b>{s.assessment_score}</b></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
