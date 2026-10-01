/* Keep the approved text strip editable in WordPress and decorate it with local brand marks. */
(() => {
  const icons = {
    'Meta AI': 'metaai-color',
    ChatGPT: 'openai',
    Claude: 'claude-color',
    Gemini: 'gemini-color',
    Copilot: 'copilot-color',
    Perplexity: 'perplexity-color',
    Grok: 'grok',
    DeepSeek: 'deepseek-color',
    Cohere: 'cohere-color',
    'Google AI Overviews': 'google-color'
  };
  const stripLabel = [...document.querySelectorAll('main span')]
    .find(el => el.textContent.trim() === 'OPTIMISED FOR');
  if (!stripLabel) return;
  const strip = stripLabel.parentElement;
  if (!strip) return;
  strip.classList.add('visibi-logo-strip');
  stripLabel.classList.add('visibi-logo-strip__label');
  strip.querySelectorAll('span').forEach(el => {
    const label = [...el.childNodes]
      .filter(node => node.nodeType === Node.TEXT_NODE)
      .map(node => node.textContent.trim()).join('');
    const icon = icons[label];
    if (!icon || el.querySelector('img')) return;
    const img = document.createElement('img');
    img.src = `${window.visibiSite.theme}/assets/ai-icons/${icon}.svg`;
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');
    img.width = 20;
    img.height = 20;
    img.style.cssText = 'width:20px;height:20px;object-fit:contain;flex:none';
    if (icon === 'openai' || icon === 'grok') img.style.filter = 'invert(1)';
    el.style.gap = '8px';
    const separator = el.querySelector('span');
    if (separator) separator.style.marginLeft = '20px';
    el.prepend(img);
  });
})();
