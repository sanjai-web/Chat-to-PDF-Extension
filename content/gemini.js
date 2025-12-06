chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extract' && request.platform === 'Gemini') {
    const messages = [];
    
    const scroller = document.querySelector('infinite-scroller, .infinite-scroller, main');
    
    if (scroller) {
        const children = Array.from(scroller.children);
        
        children.forEach(child => {
            const text = child.innerText;
            if (!text || text.trim().length === 0) return;

            const html = child.innerHTML;
            
            const isUser = 
                child.classList.contains('user-query') || 
                child.querySelector('.user-query') ||
                child.querySelector('.user-avatar') ||
                html.includes('data-test-id="user-query"') ||
                child.hasAttribute('data-is-user');

            const isModel = 
                !isUser && (
                    child.classList.contains('model-response') ||
                    child.querySelector('.model-response') ||
                    child.querySelector('.model-response-text') ||
                    child.querySelector('.markdown') ||
                    html.includes('data-test-id="model-response"')
                );

            if (isUser || isModel) {
                 let contentNode = 
                    child.querySelector('.model-response-text') || 
                    child.querySelector('.message-content') || 
                    child.querySelector('.markdown') || 
                    child.querySelector('.query-content');

                 if (!contentNode) {
                    contentNode = child.cloneNode(true);
                    const garbage = contentNode.querySelectorAll('input-area, .input-area, .feedback, button-container, .buttons');
                    garbage.forEach(g => g.remove());
                 } else {
                    contentNode = contentNode.cloneNode(true);
                 }

                 contentNode.querySelectorAll('button, mat-icon, img.avatar, .feedback-container').forEach(el => el.remove());

                 messages.push({
                    sender: isUser ? 'User' : 'Gemini',
                    content: contentNode.innerHTML || text,
                    timestamp: request.includeTimestamps ? new Date().toLocaleTimeString() : ''
                 });
            }
        });
    }

    if (messages.length === 0) {
        let nodes = document.querySelectorAll('.user-query, .model-response, .model-response-text');
        nodes.forEach(node => {
             const isUser = node.classList.contains('user-query') || node.matches('.user-query');
             messages.push({
                sender: isUser ? 'User' : 'Gemini',
                content: node.innerHTML,
                timestamp: ''
             });
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
