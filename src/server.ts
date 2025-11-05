import express from 'express';
import path from 'path';

const app = express();
const PORT = 3006;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

interface Risk {
  id: string;
  title: string;
  description: string;
  category: string;
  probability: string;
  impact: string;
  riskLevel: string;
  mitigation: string;
  status: string;
  date: string;
}

let risks: Risk[] = [
  {
    id: '1',
    title: 'Supply Chain Disruption',
    description: 'Risk of supplier failure affecting production',
    category: 'Operational',
    probability: 'Medium',
    impact: 'High',
    riskLevel: 'High',
    mitigation: 'Diversify supplier base',
    status: 'Active',
    date: '2025-01-20'
  },
  {
    id: '2',
    title: 'Equipment Failure',
    description: 'Critical equipment may fail without warning',
    category: 'Technical',
    probability: 'Low',
    impact: 'High',
    riskLevel: 'Medium',
    mitigation: 'Regular maintenance schedule',
    status: 'Mitigated',
    date: '2025-01-15'
  }
];

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/api/risks', (req, res) => {
  res.json(risks);
});

app.post('/api/risks', (req, res) => {
  const riskLevel = calculateRiskLevel(req.body.probability, req.body.impact);
  const newRisk: Risk = {
    id: Date.now().toString(),
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    probability: req.body.probability,
    impact: req.body.impact,
    riskLevel: riskLevel,
    mitigation: req.body.mitigation || '',
    status: req.body.status || 'Active',
    date: new Date().toISOString().split('T')[0]
  };
  risks.push(newRisk);
  res.json(newRisk);
});

function calculateRiskLevel(probability: string, impact: string): string {
  const probMap: { [key: string]: number } = { 'Low': 1, 'Medium': 2, 'High': 3 };
  const impactMap: { [key: string]: number } = { 'Low': 1, 'Medium': 2, 'High': 3 };
  const score = probMap[probability] * impactMap[impact];
  if (score >= 6) return 'High';
  if (score >= 3) return 'Medium';
  return 'Low';
}

app.delete('/api/risks/:id', (req, res) => {
  risks = risks.filter(r => r.id !== req.params.id);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Risk Management System running on http://localhost:${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser`);
});

