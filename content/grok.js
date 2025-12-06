chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extract' && request.platform === 'Grok') {
    const messages = [];

    let rows = document.querySelectorAll('div[data-testid="message-row"], .message-row');
    
    if (rows.length === 0) {
        rows = document.querySelectorAll('article, section[aria-label*="message"]');
    }

    if (rows.length > 0) {
        rows.forEach(row => {
            const isUser = 
                row.querySelector('div[data-testid="user-message"]') || 
                row.innerHTML.includes('User') ||
                (window.getComputedStyle(row).direction === 'rtl') || 
                row.querySelector('svg[aria-label="User"]');

            let contentDiv = row.querySelector('.markdown-content') || 
                             row.querySelector('.prose') || 
                             row.querySelector('div[dir="auto"]');

            if (contentDiv) {
                const clone = contentDiv.cloneNode(true);
                const buttons = clone.querySelectorAll('button, [role="button"]');
                buttons.forEach(b => b.remove());

                messages.push({
                  sender: isUser ? 'User' : 'Grok',
                  content: clone.innerHTML,
                  timestamp: request.includeTimestamps ? new Date().toLocaleTimeString() : ''
                });
            }
        });
    }

    if (messages.length === 0) {
        const textBlocks = document.querySelectorAll('div[dir="auto"]');
        textBlocks.forEach((block, index) => {
            if (block.innerText.length > 20) {
                messages.push({
                    sender: index % 2 === 0 ? 'User' : 'Grok',
                    content: block.innerHTML,
                    timestamp: ''
                });
            }
        });
    }

    sendResponse({ html: formatMessages(messages) });
  }
});

function formatMessages(messages) {
  return `<div class="chat-container">
    ${messages.map(msg => `
      <div class="message ${msg.sender === 'User' ? 'user' : 'assistant'}">
        <div class="sender">${msg.sender}</div>
        <div class="content">${msg.content}</div>
        ${msg.timestamp ? `<div class="timestamp">${msg.timestamp}</div>` : ''}
      </div>
    `).join('')}
  </div>`;
}
