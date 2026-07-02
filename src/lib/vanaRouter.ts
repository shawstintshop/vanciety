export type AIAgentRole = 
  | 'vana'
  | 'builder' 
  | 'mechanic' 
  | 'travel' 
  | 'marketplace' 
  | 'emergency' 
  | 'support';

/**
 * vanaRouter.ts — Unified Vanciety AI Agent Orchestrator
 * ========================================================
 * Implements routing between multiple specialized agents.
 */

export interface VanaResponse {
  answer: string;
  agentRole: AIAgentRole;
  page?: string;
  pageLabel?: string;
}

export const AGENT_CONFIGS: Record<AIAgentRole, { name: string; description: string }> = {
  vana: { name: 'Vana', description: 'General van life guide.' },
  builder: { name: 'Builder AI', description: 'Van build and carpentry expert.' },
  mechanic: { name: 'Mechanic AI', description: 'Mechanical and electrical systems diagnostic expert.' },
  travel: { name: 'Travel AI', description: 'Routes and camping specialist.' },
  marketplace: { name: 'Marketplace AI', description: 'Gear and vendor matching assistant.' },
  emergency: { name: 'Emergency AI', description: 'Safety and recovery specialist.' },
  support: { name: 'Support AI', description: 'Technical site assistant.' }
};

export function routeVanaQuestion(question: string): VanaResponse {
  const lower = question.toLowerCase();
  
  // Classification logic (Keyword fallback for client-side)
  let role: AIAgentRole = 'vana';
  let page = '/forum';
  let label = 'Ask in the Forum';
  let answer = "I'm Vana, your general guide. How can I help with your van life journey?";

  if (lower.match(/repair|fix|broke|engine|oil|transmission|fault|mechanic/)) {
    role = 'mechanic';
    page = '/van-intelligence';
    label = 'Open Repair Guides';
    answer = "[Mechanic AI]: Sounds like a technical issue. I can help troubleshoot your systems or find repair documentation.";
  } else if (lower.match(/build|layout|galley|cabinet|insulation|80\/20/)) {
    role = 'builder';
    page = '/van-builder';
    label = 'Open Build Planner';
    answer = "[Builder AI]: I'm here to help with your build. We can work on cut lists, layout designs, or material choices.";
  } else if (lower.match(/emergency|safety|stuck|call 911|accident|medical/)) {
    role = 'emergency';
    page = '/resource-board';
    label = 'Emergency Resources';
    answer = "[Emergency AI]: **PRIORITIZE SAFETY.** If this is a life-threatening emergency, call 911. I am prepared to assist with survival and recovery procedures.";
  } else if (lower.match(/camp|route|spot|park|blm|travel/)) {
    role = 'travel';
    page = '/van-life-spots';
    label = 'Find Spots';
    answer = "[Travel AI]: Let's find some great locations. I can check for camping spots, weather, and verified routes.";
  } else if (lower.match(/buy|sell|price|gear|product|listing/)) {
    role = 'marketplace';
    page = '/marketplace';
    label = 'Visit Marketplace';
    answer = "[Marketplace AI]: Looking for gear? I can help you find products, compare prices, or match you with vendors.";
  } else if (lower.match(/bug|broken link|problem|issue/)) {
    role = 'support';
    page = '/accessibility';
    label = 'Report Issue';
    answer = "[Support AI]: I've detected a possible site issue. I'll log this for the admin team.";
  }

  return {
    answer,
    agentRole: role,
    page,
    pageLabel: label
  };
}
