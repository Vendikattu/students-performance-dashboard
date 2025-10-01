import { useMemo, useState } from 'react';
import { Student } from '../lib/analytics';

type Props = {
  data: Student[];
  onSelect?: (s: Student) => void;
};

export default function Table({ data, onSelect }: Props) {
  const [q, setQ] = useState('');
  const [sortKey, setSortKey] = useState<keyof Student>('assessment_score');
  const [asc, setAsc] = useState(false);
  const [activeId, setActiveId] = useState<number | null>(null);

  // filter
  const filtered = useMemo(() => {
    const s = q.toLowerCase().trim();
    if (!s) return data;
    return data.filter(
      (d) =>
        d.name.toLowerCase().includes(s) ||
        d.class.toLowerCase().includes(s) ||
        String(d.student_id).includes(s)
    );
  }, [q, data]);

  // sort
  const sorted = useMemo(() => {
    const arr = filtered.slice();
    arr.sort((a, b) => {
      const A = a[sortKey] as any;
      const B = b[sortKey] as any;
      const cmp = A < B ? -1 : A > B ? 1 : 0;
      return asc ? cmp : -cmp;
    });
    return arr;
  }, [filtered, sortKey, asc]);

  // headers to show (order)
  const headers: (keyof Student)[] = [
    'student_id',
    'name',
    'class',
    'comprehension',
    'attention',
    'focus',
    'retention',
    'engagement_time',
    'assessment_score',
  ];

  const setSort = (k: keyof Student) => {
    if (k === sortKey) {
      setAsc(!asc);
    } else {
      setSortKey(k);
      setAsc(true);
    }
  };

  const arrow = (k: keyof Student) =>
    sortKey === k ? (asc ? '▲' : '▼') : '';

  return (
    <div className="card">
      <div
        style={{
          display: 'flex',
          gap: 12,
          alignItems: 'center',
          marginBottom: 12,
          justifyContent: 'space-between',
          flexWrap: 'wrap',
        }}
      >
        <input
          placeholder="Search by name, class, or ID..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search students"
          style={{ minWidth: 260 }}
        />
        <div className="muted" style={{ fontSize: 12 }}>
          Click a header to sort • Click a row to view on radar
        </div>
      </div>

      <div style={{ maxHeight: 420, overflow: 'auto' }}>
        <table>
          <thead>
            <tr>
              {headers.map((h) => (
                <th
                  key={String(h)}
                  onClick={() => setSort(h)}
                  title={`Sort by ${String(h)}`}
                  style={{
                    userSelect: 'none',
                    position: 'sticky',
                    top: 0,
                    background: '#0c1628',
                  }}
                >
                  {String(h)} {arrow(h)}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {sorted.map((s, idx) => (
              <tr
                key={s.student_id}
                onClick={() => {
                  setActiveId(s.student_id);
                  onSelect && onSelect(s);
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLTableRowElement).style.transform =
                    'scale(1.002)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLTableRowElement).style.transform =
                    'none';
                }}
                style={{
                  cursor: 'pointer',
                  transition: 'transform .08s ease, background .15s ease',
                  background:
                    activeId === s.student_id
                      ? 'rgba(99,102,241,.12)'
                      : idx % 2
                      ? 'transparent'
                      : 'rgba(255,255,255,0.01)',
                }}
              >
                <td>{s.student_id}</td>
                <td>{s.name}</td>
                <td>{s.class}</td>
                <td>{s.comprehension}</td>
                <td>{s.attention}</td>
                <td>{s.focus}</td>
                <td>{s.retention}</td>
                <td>{s.engagement_time}</td>
                <td>
                  <b>{s.assessment_score}</b>
                </td>
              </tr>
            ))}

            {!sorted.length && (
              <tr>
                <td colSpan={headers.length} className="muted">
                  No students match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
