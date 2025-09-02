# Web Notepad Application

A modern, responsive web-based notepad application with local storage and web synchronization capabilities.

## Features

✨ **Modern UI/UX**
- Clean, intuitive interface inspired by modern note-taking apps
- Responsive design that works on desktop, tablet, and mobile
- Dark mode support (automatically detects system preference)
- Smooth animations and transitions

📝 **Note Management**
- Create, edit, and delete notes
- Real-time auto-save functionality
- Search through notes by title or content
- Word count and last modified timestamps
- Rich text editing with proper formatting

💾 **Data Persistence**
- Local storage using browser's localStorage
- Notes persist between browser sessions
- No server required for basic functionality



⌨️ **Keyboard Shortcuts**
- `Ctrl/Cmd + N`: Create new note
- `Ctrl/Cmd + S`: Save notes
- `Ctrl/Cmd + F`: Focus search bar

## Getting Started

### Option 1: Direct File Opening
1. Download all files to a folder
2. Open `index.html` in your web browser
3. Start taking notes!

### Option 2: Local Web Server (Recommended)
For the best experience, serve the files through a local web server:

#### Using Python (if installed):
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```
Then open `http://localhost:8000` in your browser.

#### Using Node.js (if installed):
```bash
# Install a simple server
npm install -g http-server

# Run the server
http-server -p 8000
```
Then open `http://localhost:8000` in your browser.

#### Using PHP (if installed):
```bash
php -S localhost:8000
```
Then open `http://localhost:8000` in your browser.

## File Structure

```
WebNotepad/
├── index.html          # Main HTML structure
├── styles.css          # CSS styling and responsive design
├── script.js           # JavaScript functionality
└── README.md           # This file
```



## Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Data Storage

Notes are stored locally in your browser's localStorage. This means:
- Notes are private to your browser/device
- Notes persist between browser sessions
- Notes are not shared between different browsers or devices
- Clearing browser data will delete your notes

## Security Notes

- Notes are stored locally in your browser
- No data is sent to external servers
- Your notes remain private and secure

## Customization

### Styling
Edit `styles.css` to customize:
- Colors and themes
- Fonts and typography
- Layout and spacing
- Animations and transitions

### Functionality
Edit `script.js` to add:
- New keyboard shortcuts
- Additional note features
- Custom export formats
- Integration with other services

## Troubleshooting

### Notes not saving
- Check if localStorage is enabled in your browser
- Ensure you have sufficient storage space
- Try clearing browser cache and reloading



### Performance issues
- Large numbers of notes (>1000) may impact performance
- Consider implementing pagination for very large note collections
- Clear old notes periodically if needed

## Contributing

Feel free to submit issues, feature requests, or pull requests to improve the application.

## License

This project is open source and available under the MIT License.

---

**Enjoy your new web notepad! 📝✨**
"# Midas-Pad" 
