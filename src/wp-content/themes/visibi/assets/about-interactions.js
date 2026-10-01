document.addEventListener('DOMContentLoaded', () => {
  const section = document.querySelector('#how');
  if (!document.body.classList.contains('visibi-about') || !section) return;
  const layout = section.firstElementChild;
  const tabs = [...(layout?.firstElementChild?.querySelectorAll('button') || [])];
  const cards = [...(layout?.children[1]?.children || [])];
  const cta = layout?.lastElementChild;
  if (tabs.length !== 2 || cards.length !== 5 || !cta) return;

  const paths = {
    geo: [
      ['AI visibility & GEO audit (free)', 'Full analysis of how AI engines interpret your brand, entities and competitors.'],
      ['Entity & knowledge structuring', "Rebuild your brand’s machine-readable foundation: entities, relationships, schemas and core knowledge sources."],
      ['GEO implementation', 'Structured data, content frameworks, entity reinforcement and authority alignment across priority pages.'],
      ['Measurement & iteration', 'Review how AI outputs change — descriptions, citations, sentiment and recommendation frequency.'],
      ['Continuous AI visibility tracking', 'Ongoing dashboard monitoring of citations, mentions, sentiment and competitor presence.']
    ],
    agents: [
      ['Agent opportunity mapping', 'Identify the departments, workflows and use cases where agents deliver the highest ROI.'],
      ['Solution & safety design', 'Define roles, guardrails, permissions, data access, tools and integrations.'],
      ['Custom agent development', 'Build around real workflows: reasoning, tools, APIs, guardrails and knowledge bases.'],
      ['Deployment & AgentOps', 'Production monitoring, observability, optimisation, compliance and human-in-the-loop.'],
      ['Optimisation & scale', 'Extend from one use case to many teams based on proven impact.']
    ]
  };
  const render = choice => {
    const agent = choice === 'agents';
    tabs.forEach((tab, index) => {
      const active = index === Number(agent);
      tab.style.background = active ? '#0b1530' : 'transparent';
      tab.style.color = active ? '#fff' : '#5a6680';
      tab.setAttribute('aria-pressed', String(active));
    });
    cards.forEach((card, index) => {
      const text = card.children[1];
      if (text?.children.length >= 2) {
        text.children[0].textContent = paths[choice][index][0];
        text.children[1].textContent = paths[choice][index][1];
      }
    });
    cta.href = agent ? '/ai-agents/#call' : '/geo/#audit';
    cta.textContent = agent ? 'Book agent opportunity mapping →' : 'Start with a free GEO audit →';
  };
  tabs.forEach((tab, index) => tab.addEventListener('click', () => render(index ? 'agents' : 'geo')));
  render('geo');
});