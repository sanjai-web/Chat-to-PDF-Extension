chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extract' && request.platform === 'ChatGPT') {
    const messages = [];
    const articles = document.querySelectorAll('article');

    articles.forEach(article => {
      const isUser = article.querySelector('[data-message-author-role="user"]');
      const contentDiv = article.querySelector('.markdown') || article.querySelector('[data-message-author-role] > div');
      
      if (contentDiv) {
        messages.push({
          sender: isUser ? 'User' : 'ChatGPT',
          content: contentDiv.innerHTML,
          timestamp: request.includeTimestamps ? new Date().toLocaleTimeString() : ''
        });
      }
    });
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
