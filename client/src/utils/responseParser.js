/**
 * responseParser.js
 * Parses the raw streaming markdown response from the Ethics Critic prompt
 * into structured components (Core Tension, Frameworks, Lenses, etc.)
 */

export function parseStandardResponse(text) {
  if (!text) return null;

  const data = {
    coreTension: '',
    frameworks: [], // Array of { name: string, content: string }
    lenses: {
      precedent: '',
      preMortem: '',
      reversibility: ''
    },
    convergence: '',
    missingInfo: '',
    synthesis: ''
  };

  // 1. Detect sections using regex or markers
  // We can scan lines and check which section we are in
  const lines = text.split('\n');
  let currentSection = 'coreTension';
  let currentFramework = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineLower = line.toLowerCase();

    // Check for Main Sections
    if (lineLower.includes('precedent check') || lineLower.includes('historical precedent')) {
      currentSection = 'lens-precedent';
      continue;
    } else if (lineLower.includes('5-year pre-mortem') || lineLower.includes('five-year pre-mortem')) {
      currentSection = 'lens-premortem';
      continue;
    } else if (lineLower.includes('reversibility scale') || lineLower.includes('undo check')) {
      currentSection = 'lens-reversibility';
      continue;
    } else if (lineLower.includes('converge') || lineLower.includes('conflict') || lineLower.includes('alignment')) {
      currentSection = 'convergence';
      continue;
    } else if (lineLower.includes('unstated assumption') || lineLower.includes('missing information')) {
      currentSection = 'missingInfo';
      continue;
    } else if (lineLower.includes('synthesis') || lineLower.includes('tradeoff you\'re actually making')) {
      currentSection = 'synthesis';
      continue;
    }

    // Check for Framework subheaders
    // Look for lines starting with bold framework labels, e.g. - **Consequentialism / Utilitarianism** or **Deontology**
    const fwMatch = line.match(/^\s*[-*]?\s*\*\*(Consequentialism|Utilitarianism|Deontology|Virtue Ethics|Care Ethics|Rights-Based|Contractualism|Justice|Fairness|The Utilitarian|The Deontologist|The Virtue Ethicist|The Care Ethicist|The Rights Theorist)\*\*[-:]?\s*(.*)/i);
    if (fwMatch) {
      currentSection = 'frameworks';
      currentFramework = {
        name: fwMatch[1].trim(),
        content: fwMatch[2] ? fwMatch[2].trim() : ''
      };
      data.frameworks.push(currentFramework);
      continue;
    }

    // Append to current section
    if (currentSection === 'coreTension') {
      data.coreTension += (data.coreTension ? '\n' : '') + line;
    } else if (currentSection === 'frameworks' && currentFramework) {
      currentFramework.content += (currentFramework.content ? '\n' : '') + line;
    } else if (currentSection === 'lens-precedent') {
      data.lenses.precedent += (data.lenses.precedent ? '\n' : '') + line;
    } else if (currentSection === 'lens-premortem') {
      data.lenses.preMortem += (data.lenses.preMortem ? '\n' : '') + line;
    } else if (currentSection === 'lens-reversibility') {
      data.lenses.reversibility += (data.lenses.reversibility ? '\n' : '') + line;
    } else if (currentSection === 'convergence') {
      data.convergence += (data.convergence ? '\n' : '') + line;
    } else if (currentSection === 'missingInfo') {
      data.missingInfo += (data.missingInfo ? '\n' : '') + line;
    } else if (currentSection === 'synthesis') {
      data.synthesis += (data.synthesis ? '\n' : '') + line;
    }
  }

  // Cleanup whitespace and bullet points
  data.coreTension = data.coreTension.trim();
  data.convergence = data.convergence.trim();
  data.missingInfo = data.missingInfo.trim();
  data.synthesis = data.synthesis.trim();
  data.lenses.precedent = data.lenses.precedent.trim().replace(/^[-*\s:\d.]+/, '');
  data.lenses.preMortem = data.lenses.preMortem.trim().replace(/^[-*\s:\d.]+/, '');
  data.lenses.reversibility = data.lenses.reversibility.trim().replace(/^[-*\s:\d.]+/, '');

  data.frameworks = data.frameworks.map(fw => ({
    name: fw.name,
    content: fw.content.trim().replace(/^[:\s-]+/, '')
  }));

  return data;
}

export function parseCouncilResponse(text) {
  if (!text) return null;

  const data = {
    moderatorIntro: '',
    dialogue: [], // array of { speaker: string, text: string }
    overlays: {
      precedent: '',
      preMortem: '',
      reversibility: ''
    },
    closingMap: ''
  };

  const lines = text.split('\n');
  let currentSection = 'intro';
  let currentOverlay = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineLower = line.toLowerCase();

    // Check for diagnostic overlay section
    if (lineLower.includes('diagnostic overlay') || lineLower.includes('diagnostic check') || lineLower.includes('moderator steps back')) {
      currentSection = 'overlays';
      continue;
    } else if (lineLower.includes('closing map') || lineLower.includes('final synthesis') || lineLower.includes('tradeoff')) {
      currentSection = 'closingMap';
      continue;
    }

    if (currentSection === 'overlays') {
      if (lineLower.includes('precedent')) {
        currentOverlay = 'precedent';
        continue;
      } else if (lineLower.includes('pre-mortem') || lineLower.includes('premortem')) {
        currentOverlay = 'preMortem';
        continue;
      } else if (lineLower.includes('reversibility')) {
        currentOverlay = 'reversibility';
        continue;
      }
    }

    // Check for Speaker dialogue turn, e.g. **The Utilitarian:** or **The Deontologist:**
    // Also captures **Moderator:**
    const speakerMatch = line.match(/^\s*\*\*?(The Utilitarian|The Deontologist|The Virtue Ethicist|The Care Ethicist|The Rights Theorist|The Contractualist|The Justiciary|The Moderator|Moderator|Utilitarian|Deontologist|Virtue Ethicist|Care Ethicist|Rights Theorist|Contractualist|Justiciary)\*\*?:?\s*(.*)/i);
    
    if (speakerMatch) {
      currentSection = 'dialogue';
      data.dialogue.push({
        speaker: speakerMatch[1].trim(),
        text: speakerMatch[2] ? speakerMatch[2].trim() : ''
      });
      continue;
    }

    // Append to current section
    if (currentSection === 'intro') {
      data.moderatorIntro += (data.moderatorIntro ? '\n' : '') + line;
    } else if (currentSection === 'dialogue' && data.dialogue.length > 0) {
      data.dialogue[data.dialogue.length - 1].text += '\n' + line;
    } else if (currentSection === 'overlays' && currentOverlay) {
      data.overlays[currentOverlay] += (data.overlays[currentOverlay] ? '\n' : '') + line;
    } else if (currentSection === 'closingMap') {
      data.closingMap += (data.closingMap ? '\n' : '') + line;
    }
  }

  // Cleanup
  data.moderatorIntro = data.moderatorIntro.trim();
  data.closingMap = data.closingMap.trim();
  data.overlays.precedent = data.overlays.precedent.trim().replace(/^[-*\s:\d.]+/, '');
  data.overlays.preMortem = data.overlays.preMortem.trim().replace(/^[-*\s:\d.]+/, '');
  data.overlays.reversibility = data.overlays.reversibility.trim().replace(/^[-*\s:\d.]+/, '');
  
  data.dialogue = data.dialogue.map(d => ({
    speaker: d.speaker,
    text: d.text.trim().replace(/^[:\s-]+/, '')
  }));

  return data;
}
