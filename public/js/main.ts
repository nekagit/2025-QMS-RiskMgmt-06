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

document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('htmx:afterSwap', (event: any) => {
    if (event.detail.target.id === 'risk-list') {
      renderRisks(event.detail.xhr.response);
    }
  });
});

function renderRisks(response: any): void {
  const risks: Risk[] = typeof response === 'string' 
    ? JSON.parse(response) 
    : response;
  
  const listElement = document.getElementById('risk-list');
  if (!listElement) return;

  if (risks.length === 0) {
    listElement.innerHTML = '<p class="empty">No risks found</p>';
    return;
  }

  listElement.innerHTML = `
    <table class="risk-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Category</th>
          <th>Probability</th>
          <th>Impact</th>
          <th>Risk Level</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${risks.map(risk => `
          <tr>
            <td>${escapeHtml(risk.title)}</td>
            <td><span class="badge badge-${risk.category.toLowerCase()}">${escapeHtml(risk.category)}</span></td>
            <td><span class="badge badge-${risk.probability.toLowerCase()}">${escapeHtml(risk.probability)}</span></td>
            <td><span class="badge badge-${risk.impact.toLowerCase()}">${escapeHtml(risk.impact)}</span></td>
            <td><span class="badge badge-risk-${risk.riskLevel.toLowerCase()}">${escapeHtml(risk.riskLevel)}</span></td>
            <td><span class="badge badge-${risk.status.toLowerCase()}">${escapeHtml(risk.status)}</span></td>
            <td>
              <button class="btn btn-sm btn-danger" 
                      hx-delete="/api/risks/${risk.id}" 
                      hx-target="#risk-list" 
                      hx-swap="outerHTML"
                      hx-confirm="Are you sure you want to delete this risk?">
                Delete
              </button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

