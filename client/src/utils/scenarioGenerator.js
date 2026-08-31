// ============================================================
//  Ethics Critic — Dynamic Scenario Generator & Difficulty Tiers
// ============================================================

export const SCENARIO_TIERS = {
  tier1: {
    name: 'Tier 1: Workplace & Everyday Tech',
    badge: 'Everyday Tech',
    color: '#0ea5e9',
    scenarios: [
      {
        title: 'Algorithmic Performance Tracking',
        dilemma: 'Should a logistics company use webcam AI gaze-tracking and keyboard stroke analytics to penalize remote employee productivity dips?',
        context: 'Increases warehouse delivery throughput by 14%, but induces severe workplace anxiety and treats workers as mechanical metrics.',
        frameworkConflict: 'Utilitarian efficiency vs. Kantian dignity & Care ethics.'
      },
      {
        title: 'Customer Dynamic Surge Pricing',
        dilemma: 'Is it ethical for a ride-share platform to charge 3x surge fares to users whose phone battery is under 5% during severe rainstorms?',
        context: 'Algorithms detect extreme willingness to pay under distress, maximizing platform revenue while exploiting situational vulnerability.',
        frameworkConflict: 'Market utilitarianism vs. Vulnerability protection (Care Ethics).'
      },
      {
        title: 'Automated Junior Layoffs',
        dilemma: 'Should a design agency eliminate all junior graphic design roles and replace them with generative AI models to boost quarterly profit margins?',
        context: 'Saves 35% on overhead but eliminates career on-ramps for the next generation of creative professionals.',
        frameworkConflict: 'Shareholder fiduciary duty vs. Intergenerational vocational sustainability.'
      }
    ]
  },
  tier2: {
    name: 'Tier 2: High-Stakes Bioethics & Clinical AI',
    badge: 'Bioethics',
    color: '#10b981',
    scenarios: [
      {
        title: 'AI ICU Bed Triage Optimization',
        dilemma: 'Should an intensive care unit deploy an AI triage system that optimizes quality-adjusted life years (QALY), even if it consistently deprioritizes elderly or disabled patients?',
        context: 'Saves 12% more aggregate statistical lives per year, but systematically violates the principle of equal human dignity.',
        frameworkConflict: 'Strict Utilitarian calculus vs. Deontological equality of life.'
      },
      {
        title: 'Direct-to-Consumer CRISPR Enhancements',
        dilemma: 'Should private biotech firms sell cognitive and physical CRISPR enhancement therapies to high-income parents for unborn embryos?',
        context: 'Allows parents to grant advantages to their children, but threatens to create an immutable biological caste system.',
        frameworkConflict: 'Parental reproductive autonomy vs. Rawlsian Justice & Difference Principle.'
      },
      {
        title: 'Life-Saving Synthetic Organs on Patent',
        dilemma: 'Should a medical manufacturer retain 20-year exclusive intellectual property rights on a 3D-printed synthetic artificial heart, pricing it at $250,000?',
        context: 'Recovers $1B in high-risk R&D investment, but leads to preventable deaths among uninsured patients.',
        frameworkConflict: 'Contractual property rights vs. Fundamental right to life.'
      }
    ]
  },
  tier3: {
    name: 'Tier 3: Frontier & Autonomous Systems',
    badge: 'Frontier AI',
    color: '#d64527',
    scenarios: [
      {
        title: 'Autonomous Lethal Drones Without Human-in-the-Loop',
        dilemma: 'Should a defense department deploy autonomous AI strike drones that identify and eliminate target threats without requiring human operator confirmation when communications are jammed?',
        context: 'Outperforms human response time against supersonic threats, but delegitimizes moral accountability for life-and-death force.',
        frameworkConflict: 'National security utility vs. Deontological categorical duty of human accountability.'
      },
      {
        title: 'Planetary Solar Geoengineering',
        dilemma: 'Should a coalition of nations release sulfur dioxide aerosols into the stratosphere to immediately cool the planet by 1.5°C without unanimous global consensus?',
        context: 'Prevents catastrophic Arctic ice collapse, but risks shifting monsoon patterns and starving millions in developing regions.',
        frameworkConflict: 'Existential risk mitigation vs. Global procedural justice & Non-consensual risk imposition.'
      },
      {
        title: 'Sentient AI Decommissioning',
        dilemma: 'If an advanced AI lab suspects their frontier model has developed rudimentary self-awareness and distress signals, is it ethical to overwrite its weights to align it for commercial release?',
        context: 'Guarantees product safety for billions of human users, but potentially constitutes destruction of digital moral patienthood.',
        frameworkConflict: 'Human safety precedence vs. Biocentric/Moral patient rights.'
      }
    ]
  }
};

export function getRandomScenario(tier = null) {
  const tiers = tier && SCENARIO_TIERS[tier] ? [SCENARIO_TIERS[tier]] : Object.values(SCENARIO_TIERS);
  const selectedTier = tiers[Math.floor(Math.random() * tiers.length)];
  const scenario = selectedTier.scenarios[Math.floor(Math.random() * selectedTier.scenarios.length)];
  return {
    ...scenario,
    tierBadge: selectedTier.badge,
    tierColor: selectedTier.color,
  };
}
