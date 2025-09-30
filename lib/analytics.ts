export type Student = {
  student_id: number; name: string; class: string;
  comprehension: number; attention: number; focus: number; retention: number;
  engagement_time: number; assessment_score: number; persona?: string;
};

export const skills = ['comprehension','attention','focus','retention'] as const;
export type Skill = typeof skills[number];

export function mean(xs:number[]){return xs.reduce((a,b)=>a+b,0)/xs.length;}
export function corr(x:number[],y:number[]){ // Pearson r
  const mx=mean(x), my=mean(y);
  const num = x.reduce((s,xi,i)=>s+(xi-mx)*(y[i]-my),0);
  const den = Math.sqrt(x.reduce((s,xi)=>s+(xi-mx)**2,0)*y.reduce((s,yi)=>s+(yi-my)**2,0));
  return den===0?0:num/den;
}

// Simple linear regression via normal equations
export function linreg(students: Student[]){
  const X = students.map(s=>[1, s.comprehension, s.attention, s.focus, s.retention, s.engagement_time]);
  const y = students.map(s=>s.assessment_score);
  const d = X[0].length;
  const XtX = Array.from({length:d},()=>Array(d).fill(0));
  const XtY = Array(d).fill(0);
  for(let r=0;r<X.length;r++){
    const row=X[r];
    for(let i=0;i<d;i++){
      XtY[i]+=row[i]*y[r];
      for(let j=0;j<d;j++) XtX[i][j]+=row[i]*row[j];
    }
  }
  function inv(A:number[][]){
    const n=A.length, M=A.map(r=>r.slice()), I=Array.from({length:n},(_,i)=>Array.from({length:n},(__,j)=>i===j?1:0));
    for(let i=0;i<n;i++){
      let p=i; for(let r=i;r<n;r++) if(Math.abs(M[r][i])>Math.abs(M[p][i])) p=r;
      [M[i],M[p]]=[M[p],M[i]]; [I[i],I[p]]=[I[p],I[i]];
      const div=M[i][i]; for(let j=0;j<n;j++){M[i][j]/=div; I[i][j]/=div;}
      for(let r=0;r<n;r++) if(r!==i){ const f=M[r][i]; for(let c=0;c<n;c++){M[r][c]-=f*M[i][c]; I[r][c]-=f*I[i][c];} }
    }
    return I;
  }
  const XtX_inv = inv(XtX);
  const beta = Array(d).fill(0);
  for(let i=0;i<d;i++) for(let j=0;j<d;j++) beta[i]+=XtX_inv[i][j]*XtY[j];
  const predict = (s:Student)=> beta[0] + beta[1]*s.comprehension + beta[2]*s.attention + beta[3]*s.focus + beta[4]*s.retention + beta[5]*s.engagement_time;
  return { beta, predict };
}

// k-means for personas
export function kmeans(data:number[][], k=3, iters=50){
  const n=data.length, d=data[0].length;
  const centroids=data.slice(0,k).map(v=>v.slice());
  let labels=new Array(n).fill(0);
  const dist=(a:number[],b:number[])=>Math.sqrt(a.reduce((s,ai,i)=>s+(ai-b[i])**2,0));
  for(let t=0;t<iters;t++){
    for(let i=0;i<n;i++){
      let best=0,bd=Infinity;
      for(let c=0;c<k;c++){const dd=dist(data[i],centroids[c]); if(dd<bd){bd=dd;best=c;}}
      labels[i]=best;
    }
    const sums=Array.from({length:k},()=>Array(d).fill(0)), counts=Array(k).fill(0);
    for(let i=0;i<n;i++){counts[labels[i]]++; for(let j=0;j<d;j++) sums[labels[i]][j]+=data[i][j];}
    for(let c=0;c<k;c++){ if(counts[c]===0) continue; for(let j=0;j<d;j++) centroids[c][j]=sums[c][j]/counts[c]; }
  }
  return {labels,centroids};
}
