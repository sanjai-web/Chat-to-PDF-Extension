# AI Chats to PDF

A Chrome extension that allows you to download your AI chat conversations from ChatGPT, DeepSeek, Grok, and Gemini as beautifully formatted PDF files with a dark theme.

<img width="1906" height="1148" alt="image" src="https://github.com/user-attachments/assets/cf4b4568-7d60-4fb5-9aae-1166b3c11bbb" />


## Features

- 🎨 **Dark Mode PDFs** - Professional dark-themed PDF output with custom styling
- 🤖 **Multi-Platform Support** - Works with ChatGPT, DeepSeek, Grok (x.ai & grok.com), and Gemini
- 📄 **Smart Formatting** - Preserves code blocks, tables, and markdown formatting
- 🎯 **User-Friendly** - Simple one-click download from browser toolbar
- 🔒 **Privacy First** - All processing happens locally in your browser

## Supported Platforms

| Platform | URL | Status |
|----------|-----|--------|
| ChatGPT | chatgpt.com | ✅ Supported |
| DeepSeek | chat.deepseek.com | ✅ Supported |
| Grok | x.ai, grok.com | ✅ Supported |
| Gemini | gemini.google.com | ✅ Supported |


<img width="1901" height="1139" alt="image" src="https://github.com/user-attachments/assets/4af5a8cd-e020-41b7-9a48-779fdd9c5e6e" />


## Installation


### From Source

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top-right corner)
4. Click **Load unpacked**
5. Select the extension directory

## Usage

1. Navigate to any supported AI chat platform
2. Open a conversation
3. Click the **AI Chats to PDF** extension icon in your browser toolbar
4. Click **Download Chat as PDF**
5. Your PDF will be saved automatically

## PDF Features

### Dark Theme Design
- Dark background (#262626) for comfortable reading
- Light text with high contrast
- Distinct styling for user vs AI messages
- User messages: Purple background (#2e1065)
- AI messages: Dark gray background

### Content Preservation
- ✅ Code blocks with syntax highlighting
- ✅ Tables with proper formatting
- ✅ Markdown elements (headers, lists, etc.)
- ✅ Page break optimization to prevent content splitting
- ✅ Footer with generation date

## Project Structure

```
Extension for chat to pdf/
├── manifest.json           # Extension configuration
├── popup/
│   ├── popup.html         # Extension popup UI
│   ├── popup.js           # PDF generation logic
│   └── popup.css          # Popup styling
├── content/
│   ├── chatgpt.js         # ChatGPT content extraction
│   ├── deepseek.js        # DeepSeek content extraction
│   ├── grok.js            # Grok content extraction
│   └── gemini.js          # Gemini content extraction
├── lib/
│   └── html2pdf.bundle.min.js  # PDF generation library
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## Technical Details

### Technologies Used
- **Manifest V3** - Latest Chrome extension standard
- **html2pdf.js** - PDF generation from HTML
- **Content Scripts** - Platform-specific message extraction
- **Chrome Extension APIs** - Tab management and messaging

### How It Works

1. **Detection**: Extension detects which AI platform you're on
2. **Extraction**: Content script extracts chat messages from the page DOM
3. **Formatting**: Messages are formatted with dark theme styling
4. **Generation**: html2pdf converts styled HTML to PDF
5. **Download**: PDF is automatically saved to your downloads folder

## Troubleshooting

### "Could not establish connection" Error
This error occurs when the extension is updated but the chat page hasn't been refreshed.

**Solution**: Refresh the chat page and try again.

### Empty PDF or Missing Content
The chat may not be fully loaded when you clicked download.

**Solution**: 
- Scroll through the entire chat first
- Wait for all messages to load
- Try downloading again

### PDF Styling Issues
If the PDF doesn't look right, try:
- Reloading the extension
- Refreshing the chat page
- Clearing browser cache

## Development

### Prerequisites
- Google Chrome or Chromium-based browser
- Basic knowledge of JavaScript and Chrome Extensions

### Local Development
1. Make changes to the source files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension card
4. Refresh any open chat tabs
5. Test your changes

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Built with [html2pdf.js](https://github.com/eKoopmans/html2pdf.js)
- Inspired by the need for better AI chat archiving

## Version History

### v1.0
- Initial release
- Support for ChatGPT, DeepSeek, Grok, and Gemini
- Dark theme PDF generation
- Smart content extraction with heuristics

---

**Note**: This extension is not affiliated with OpenAI, DeepSeek, xAI, or Google. It's an independent tool for personal use.
