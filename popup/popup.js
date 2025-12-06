document.addEventListener('DOMContentLoaded', async () => {
  const statusBadge = document.getElementById('status-badge');
  const platformNameEl = document.getElementById('platform-name');
  const tabUrlEl = document.getElementById('tab-url');
  const downloadBtn = document.getElementById('download-btn');
  const messageArea = document.getElementById('message-area');
  const timestampToggle = document.getElementById('timestamp-toggle');

  // Get current tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (!tab) {
    updateStatus('No active tab', false);
    return;
  }

  const url = new URL(tab.url);
  tabUrlEl.textContent = url.hostname;

  // Detect Platform
  let platform = null;
  if (url.hostname.includes('chatgpt.com')) platform = 'ChatGPT';
  else if (url.hostname.includes('deepseek.com')) platform = 'DeepSeek';
  else if (url.hostname.includes('grok.com') || url.hostname.includes('x.ai')) platform = 'Grok';
  else if (url.hostname.includes('gemini.google.com')) platform = 'Gemini';

  if (platform) {
    updateStatus(`${platform} Detected`, true);
    downloadBtn.disabled = false;
  } else {
    updateStatus('Not supported', false);
    downloadBtn.disabled = true;
  }

  downloadBtn.addEventListener('click', async () => {
    if (!platform) return;

    setLoading(true);
    messageArea.textContent = 'Extracting chat...';
    messageArea.className = 'message-area';

    try {
      // Send message to content script
      const response = await chrome.tabs.sendMessage(tab.id, { 
        action: 'extract', 
        platform: platform,
        includeTimestamps: timestampToggle.checked 
      });

      if (response && response.html) {
        messageArea.textContent = 'Generating PDF...';
        await generatePDF(response.html, platform);
        messageArea.textContent = 'Download started!';
        messageArea.classList.add('message-success');
      } else {
        throw new Error('No content received');
      }
    } catch (error) {
      console.error(error);
      messageArea.textContent = 'Error: ' + (error.message || 'Failed to extract');
      messageArea.classList.add('message-error');
    } finally {
      setLoading(false);
    }
  });

  function updateStatus(text, isActive) {
    platformNameEl.textContent = text;
    if (isActive) {
      statusBadge.classList.add('active');
    } else {
      statusBadge.classList.remove('active');
    }
  }

  function setLoading(isLoading) {
    downloadBtn.disabled = isLoading;
    downloadBtn.querySelector('.btn-text').textContent = isLoading ? 'Processing...' : 'Download Chat as PDF';
  }

  async function generatePDF(htmlContent, platform) {
    const element = document.createElement('div');
    element.innerHTML = htmlContent;
    
    // Basic styling for the PDF content
    const style = document.createElement('style');
    style.textContent = `
      body { 
        font-family: 'Inter', sans-serif; 
        padding: 40px 40px 40px 80px; /* Increased left padding as requested */
        color: #e5e7eb; 
        background-color: #262626; 
        margin: 0; /* Important for no-margin PDF */
      }
      .chat-container { max-width: 100%; }
      /* Page Break Handling - Improved */
      .message, .content, p, ul, ol, li, pre, table, .math-block {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
      
      .message { 
        margin-bottom: 30px; 
        padding: 20px; /* Reset to reasonable padding */
        padding-left: 40px;
        display: flex;
        flex-direction: column;
        margin-right: 20px;
        max-width: 95%;
        border: none; /* REMOVED BORDER as requested */
        border-radius: 15px;
      }
      .user { 
        align-self: flex-end; 
        background-color: #2e1065; 
        margin-left: auto; 
        color: #e9d5ff;
        max-width: 100%;
      }
      .assistant { 
        align-self: flex-start;
        background-color: #262626; 
        margin-right: auto;
      }
      .sender { 
        font-weight: 700; 
        font-size: 11px; 
        margin-bottom: 8px; 
        text-transform: uppercase;
        letter-spacing: 0.8px;
        opacity: 0.8;
      }
      .user .sender { color: #a78bfa; }
      .assistant .sender { color: #34d399; }
      
      .content { 
        font-size: 14px; 
        line-height: 1.6; 
        width: 100%;
      }
      
      /* Markdown Elements */
      h1, h2, h3 { color: #fff; margin-top: 15px; margin-bottom: 8px; }
      p { margin-bottom: 8px; }
      
      /* Code Blocks */
      pre { 
        background-color: #171717; 
        padding: 12px; 
        border-radius: 6px; 
        overflow-x: auto; 
        border: 1px solid #404040;
        margin: 8px 0;
      }
      code { font-family: 'Fira Code', monospace; font-size: 12px; color: #e5e7eb; }
      
      /* Tables */
      table { 
        width: 100%; 
        border-collapse: collapse; 
        margin: 12px 0; 
        background-color: transparent;
        font-size: 13px;
      }
      th, td { 
        border: 1px solid #525252; 
        padding: 8px; 
        text-align: left; 
      }
      th { 
        background-color: #171717; 
        color: #fff;
      }
      
      .timestamp { font-size: 10px; color: #9ca3af; margin-top: 8px; align-self: flex-end; opacity: 0.7; }
    `;
    element.appendChild(style);

    // Force background color on the wrapper
    element.style.backgroundColor = '#262626';
    element.style.width = '100%';
    element.style.boxSizing = 'border-box';

    const opt = {
      margin: [10, 0, 10, 0], // Top, Left, Bottom, Right
      filename: `${platform}_chat_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        backgroundColor: '#262626', 
        useCORS: true,
        logging: true,
        windowWidth: 850 // Fix width for consistency
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Add Footer
    const footer = document.createElement('div');
    footer.innerHTML = `
      <div style="
        margin-top: 40px; 
        padding-top: 10px; 
        border-top: 1px solid #404040; 
        font-size: 10px; 
        color: #6b7280; 
        text-align: center;
        display: flex;
        justify-content: space-between;
      ">
        <span>Printed using AI Chats to PDF</span>
        <span>${new Date().toLocaleDateString()}</span>
      </div>
    `;
    element.appendChild(footer);

    // Use html2pdf with margin and manual background fix for margins
    const worker = html2pdf().set(opt).from(element).toPdf();
    
    await worker.get('pdf').then((pdf) => {
      const totalPages = pdf.internal.getNumberOfPages();
      const pageSize = pdf.internal.pageSize;
      const pageWidth = pageSize.getWidth();
      const pageHeight = pageSize.getHeight();
      
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFillColor('#262626'); // Match dark background
        
        // Paint top margin
        // opt.margin is [top, left, bottom, right] or single number. 
        // We will set margin to 10 (approx 35px) in opt below to be safe, so paint top 10mm
        pdf.rect(0, 0, pageWidth, 10, 'F'); 
        
        // Paint bottom margin if needed (optional, but good for consistency)
        pdf.rect(0, pageHeight - 10, pageWidth, 10, 'F');
      }
    }).save();
  }
});
