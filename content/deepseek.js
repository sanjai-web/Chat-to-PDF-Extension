chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extract' && request.platform === 'DeepSeek') {
    const messages = [];
    
    let messageNodes = document.querySelectorAll('.ds-message, .message-content, [class*="message"]');
    
    if (messageNodes.length < 2) {
       const chatContainer = document.querySelector('main div[class*="chat"]') || document.querySelector('div[role="main"]');
       if (chatContainer) {
         messageNodes = Array.from(chatContainer.children).filter(child => {
            return child.innerText.trim().length > 0 && child.offsetHeight > 0;
         });
       }
    }

    if (messageNodes && messageNodes.length > 0) {
      messageNodes.forEach(node => {
        const text = node.innerText;
        const html = node.innerHTML;
        
        const isUser = 
            node.classList.contains('ds-user') || 
            node.querySelector('.ds-user-avatar') ||
            html.includes('data-role="user"') ||
            !node.querySelector('.ds-markdown') || 
            node.innerHTML.includes('<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"') ||
            text.startsWith('You') || 
            node.style.textAlign === 'right';

        const contentNode = node.querySelector('.ds-markdown') || node.querySelector('.markdown') || node;
        
        const clone = contentNode.cloneNode(true);
        const trash = clone.querySelectorAll('button, svg, .avatar');
        trash.forEach(t => t.remove());

        messages.push({
            sender: isUser ? 'User' : 'DeepSeek',
            content: clone.innerHTML || text,
            timestamp: request.includeTimestamps ? new Date().toLocaleTimeString() : ''
        });
      });
    } else {
       messages.push({
           sender: 'System',
           content: 'Could not automatically detect message structure. Please ensure the chat is fully loaded.',
           timestamp: ''
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
