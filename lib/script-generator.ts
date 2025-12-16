import type { Database } from './db.types';

type Team = Database['public']['Tables']['teams']['Row'];
type Player = Database['public']['Tables']['players']['Row'];

interface RosterPlayer extends Player {
  is_captain: boolean | null;
  is_player_coach: boolean | null;
}

interface TeamData {
  team: Team;
  players: RosterPlayer[];
}

/**
 * Generate a browser console script to auto-fill a league registration form
 * Specifically designed for Dunk League registration form: https://dunk-league.com/szn-registration/
 */
export function generateScript(teamData: TeamData): string {
  const { team, players } = teamData;

  // Escape string for use in JavaScript template literal
  const escapeJsString = (str: string): string => {
    return str
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t');
  };

  // Map database position values to form dropdown values
  const mapPosition = (position: string | null): string => {
    if (!position) return '';
    const positionMap: Record<string, string> = {
      'Point Guard': 'PG',
      'Shooting Guard': 'SG',
      'Lock': 'LK',
      'Power Forward': 'PF',
      'Center': 'C',
    };
    return positionMap[position] || '';
  };

  // Find captain (first captain found, or first player if no captain)
  const captain = players.find(p => p.is_captain) || players[0];
  const captainTwitter = 'o_ihoop5_o'; // Hardcoded captain Twitter handle
  const teamTwitter = team.team_twitter || '';

  const teamNameEscaped = escapeJsString(team.name);
  const captainTwitterEscaped = escapeJsString(captainTwitter);
  const teamTwitterEscaped = escapeJsString(teamTwitter);

  const script = `
// Dunk League Registration Form Auto-Filler
// Generated for: ${team.name}
// Players: ${players.length}
// Form URL: https://dunk-league.com/szn-registration/

(function() {
  console.log('🚀 Starting Dunk League form auto-fill for ${teamNameEscaped}...');
  
  let filledCount = 0;
  let errorCount = 0;
  
  // Helper function to set field value
  function setField(selector, value, fieldType = 'input') {
    const field = document.querySelector(selector);
    if (field) {
      if (fieldType === 'select') {
        field.value = value;
        field.dispatchEvent(new Event('change', { bubbles: true }));
      } else {
        field.value = value;
        field.dispatchEvent(new Event('input', { bubbles: true }));
        field.dispatchEvent(new Event('change', { bubbles: true }));
      }
      filledCount++;
      console.log('✅ Filled:', selector, '=', value);
      return true;
    }
    return false;
  }
  
  // Helper function to find field by label text (case-insensitive, partial match)
  function findFieldByLabel(labelText) {
    const labels = Array.from(document.querySelectorAll('label'));
    const label = labels.find(l => {
      const text = l.textContent || l.innerText || '';
      return text.toLowerCase().includes(labelText.toLowerCase());
    });
    if (label) {
      const forAttr = label.getAttribute('for');
      if (forAttr) {
        const field = document.getElementById(forAttr);
        if (field) return field;
      }
      // Try to find input/select/textarea in the same container or next sibling
      const container = label.closest('div, p, td, li') || label.parentElement;
      if (container) {
        const field = container.querySelector('input, select, textarea');
        if (field) return field;
      }
      // Try next sibling
      const nextSibling = label.nextElementSibling;
      if (nextSibling) {
        const field = nextSibling.querySelector('input, select, textarea');
        if (field) return field;
      }
    }
    return null;
  }
  
  // Map position values
  const positionMap = {
    'Point Guard': 'PG',
    'Shooting Guard': 'SG',
    'Lock': 'LK',
    'Power Forward': 'PF',
    'Center': 'C'
  };
  
  // Fill Email Address
  const emailField = findFieldByLabel('Email Address');
  if (emailField) {
    emailField.value = 'bodegacatsgc@gmail.com';
    emailField.dispatchEvent(new Event('input', { bubbles: true }));
    emailField.dispatchEvent(new Event('change', { bubbles: true }));
    filledCount++;
    console.log('✅ Filled Email Address');
  }
  
  // Fill Team Name
  let teamNameFilled = false;
  const teamNameField = findFieldByLabel('Team Name');
  if (teamNameField) {
    teamNameField.value = '${teamNameEscaped}';
    teamNameField.dispatchEvent(new Event('input', { bubbles: true }));
    teamNameField.dispatchEvent(new Event('change', { bubbles: true }));
    filledCount++;
    teamNameFilled = true;
    console.log('✅ Filled Team Name');
  }
  
  // Fill Team Captain Twitter Username
  const captainTwitterField = findFieldByLabel('Team Captain Twitter Username');
  if (captainTwitterField) {
    captainTwitterField.value = '${captainTwitterEscaped}';
    captainTwitterField.dispatchEvent(new Event('input', { bubbles: true }));
    captainTwitterField.dispatchEvent(new Event('change', { bubbles: true }));
    filledCount++;
    console.log('✅ Filled Team Captain Twitter');
  }
  
  // Fill Team Twitter Username
  ${teamTwitter ? `
  const teamTwitterField = findFieldByLabel('Team Twitter Username');
  if (teamTwitterField) {
    teamTwitterField.value = '${teamTwitterEscaped}';
    teamTwitterField.dispatchEvent(new Event('input', { bubbles: true }));
    teamTwitterField.dispatchEvent(new Event('change', { bubbles: true }));
    filledCount++;
    console.log('✅ Filled Team Twitter');
  }
  ` : ''}
  
  // Fill roster spots
  const players = ${JSON.stringify(players.map(p => ({
    gamertag: p.gamertag,
    position: p.position,
    is_captain: p.is_captain,
  })))};
  
  // Sort players: captain first, then others
  const sortedPlayers = [...players].sort((a, b) => {
    if (a.is_captain && !b.is_captain) return -1;
    if (!a.is_captain && b.is_captain) return 1;
    return 0;
  });
  
  sortedPlayers.forEach((player, index) => {
    const spotNum = index + 1;
    if (spotNum > 10) return; // Form only has spots 1-10
    
    // Fill Roster Spot field
    const rosterSpotLabel = spotNum === 1 ? 'Team Captian Roster Spot 1' : \`Roster Spot \${spotNum}\`;
    const rosterSpotField = findFieldByLabel(rosterSpotLabel);
    if (rosterSpotField) {
      rosterSpotField.value = player.gamertag;
      rosterSpotField.dispatchEvent(new Event('input', { bubbles: true }));
      rosterSpotField.dispatchEvent(new Event('change', { bubbles: true }));
      filledCount++;
      console.log(\`✅ Filled Roster Spot \${spotNum}: \${player.gamertag}\`);
    }
    
    // Fill Position dropdown
    if (player.position) {
      const mappedPosition = positionMap[player.position] || '';
      if (mappedPosition) {
        const positionLabel = \`PLAYER \${spotNum} POSITION\`;
        const positionField = findFieldByLabel(positionLabel);
        if (positionField && positionField.tagName === 'SELECT') {
          // Try to find option by value or text
          const options = Array.from(positionField.options);
          const option = options.find(opt => 
            opt.value === mappedPosition || 
            opt.text.trim() === mappedPosition ||
            opt.text.trim().toUpperCase() === mappedPosition
          );
          if (option) {
            positionField.value = option.value;
            positionField.dispatchEvent(new Event('change', { bubbles: true }));
            filledCount++;
            console.log(\`✅ Filled Position \${spotNum}: \${mappedPosition}\`);
          }
        }
      }
    }
  });
  
  // Summary
  console.log(\`\\n✨ Auto-fill complete! Filled \${filledCount} field(s).\`);
  if (errorCount > 0) {
    console.warn(\`⚠️  \${errorCount} field(s) could not be filled. Please check manually.\`);
  }
  
  // Visual feedback
  const notification = document.createElement('div');
  notification.style.cssText = \`
    position: fixed;
    top: 20px;
    right: 20px;
    background: #10b981;
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    z-index: 10000;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 14px;
  \`;
  notification.textContent = \`✅ Form auto-filled! (\${filledCount} fields)\`;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 3000);
})();
`.trim();

  return script;
}

