# 🧠 Cognitive Skills & Student Performance Dashboard

This project analyzes a **synthetic student dataset** and builds a dashboard to explore how cognitive skills (attention, comprehension, focus, retention, engagement) impact student performance. It combines **data analysis + ML in Jupyter Notebook** and an **interactive Next.js dashboard**.

---

## 📊 Dataset
Synthetic dataset with the following columns:

- `student_id`  
- `name`  
- `class`  
- `comprehension`  
- `attention`  
- `focus`  
- `retention`  
- `engagement_time`  
- `assessment_score`

---

## ✅ Tasks Completed
- Used a synthetic dataset of student cognitive + performance metrics.  
- Analyzed **correlations** between cognitive skills and assessment scores.  
- Built a **Linear Regression model** to predict `assessment_score`.  
- Clustered students into **learning personas** using K-Means.  
- Developed a **Next.js dashboard** with:
  - Overview stats (average scores, skills, engagement)
  - **Bar chart** → skill vs score correlations
  - **Scatter plot** → attention vs performance
  - **Radar chart** → student profile
  - **Searchable & sortable table** of students
  - **Insights section** with key findings

---

## 📦 Deliverables
- 📒 **Jupyter Notebook** → `notebooks/analysis.ipynb`  
- 🖥️ **Next.js Dashboard** → `/pages`, `/components`, `/public/data/students.json`  
- 💻 **GitHub Repo** → [students-performance-dashboard](https://github.com/Vendikattu/students-performance-dashboard)  
- 🌍 **Live Demo (Vercel)** → https://<your-vercel-app>.vercel.app  

---

## 🚀 Setup Instructions

### 1. Clone the repo
```bash
git clone https://github.com/Vendikattu/students-performance-dashboard.git
cd students-performance-dashboard

2. Install dependencies
npm install

3. Run the development server
npm run dev


Now open http://localhost:3000
 in your browser.

4. Build for production
npm run build
npm start

5. Run the Jupyter Notebook
python -m pip install -U notebook pandas numpy scikit-learn matplotlib
jupyter notebook notebooks/analysis.ipynb

🔍 Key Findings

Strongest driver of assessment score: <TOP_SKILL> (r = <TOP_R>)

Model performance: Linear Regression achieved a Mean Absolute Error (MAE) of ~<MAE> points

Personas identified:

Analytical

Balanced

Hands-on

Students with low engagement (<40 min) consistently scored lower (<60 points), suggesting targeted interventions can help.

📌 Notes

This project uses a synthetic dataset — no real student data.

Dashboard built with Next.js + Chart.js.

Analysis performed with pandas, NumPy, scikit-learn, matplotlib.


---

⚡ Next step for you:
1. Paste this into your `README.md`.  
2. Replace:
   - `<your-vercel-app>` → https://students-performance-dashboard.vercel.app/  
   - `<TOP_SKILL=comprehension>` `<TOP_R=0.745>` `<MAE=5.22>`
