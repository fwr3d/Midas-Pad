// Web Notepad Application
class WebNotepad {
    constructor() {
        this.notes = [];
        this.currentNote = null;
        
        this.initializeApp();
        this.loadNotes();
        this.setupEventListeners();
    }
    
    initializeApp() {
        // Initialize DOM elements
        this.elements = {
            newNoteBtn: document.getElementById('newNoteBtn'),
            createFirstNote: document.getElementById('createFirstNote'),
            notesList: document.getElementById('notesList'),
            welcomeScreen: document.getElementById('welcomeScreen'),
            editorContainer: document.getElementById('editorContainer'),
            noteTitle: document.getElementById('noteTitle'),
            noteContent: document.getElementById('noteContent'),
            deleteNoteBtn: document.getElementById('deleteNoteBtn'),
            saveNoteBtn: document.getElementById('saveNoteBtn'),
            searchInput: document.getElementById('searchInput'),
            noteDate: document.getElementById('noteDate'),
            wordCount: document.getElementById('wordCount'),
            // Toolbar elements
            fontFamily: document.getElementById('fontFamily'),
            fontSize: document.getElementById('fontSize'),
            boldBtn: document.getElementById('boldBtn'),
            italicBtn: document.getElementById('italicBtn'),
            underlineBtn: document.getElementById('underlineBtn'),
            alignLeftBtn: document.getElementById('alignLeftBtn'),
            alignCenterBtn: document.getElementById('alignCenterBtn'),
            alignRightBtn: document.getElementById('alignRightBtn'),
            alignJustifyBtn: document.getElementById('alignJustifyBtn'),
            bulletListBtn: document.getElementById('bulletListBtn'),
            numberListBtn: document.getElementById('numberListBtn'),
            textColor: document.getElementById('textColor'),
            highlightColor: document.getElementById('highlightColor'),
            undoBtn: document.getElementById('undoBtn'),
            redoBtn: document.getElementById('redoBtn'),
            clearFormatBtn: document.getElementById('clearFormatBtn')
        };
    }
    
    setupEventListeners() {
        // Note creation
        this.elements.newNoteBtn.addEventListener('click', () => this.createNote());
        this.elements.createFirstNote.addEventListener('click', () => this.createNote());
        
        // Note editing
        this.elements.noteTitle.addEventListener('input', () => this.updateCurrentNote());
        this.elements.noteContent.addEventListener('input', () => {
            this.updateCurrentNote();
            this.updateWordCount();
        });
        
        // Note actions
        this.elements.deleteNoteBtn.addEventListener('click', () => this.deleteCurrentNote());
        this.elements.saveNoteBtn.addEventListener('click', () => this.saveNotes());
        
        // Search
        this.elements.searchInput.addEventListener('input', (e) => this.filterNotes(e.target.value));
        
        // Toolbar event listeners
        this.setupToolbarListeners();
        
        // Auto-save on content change
        this.elements.noteContent.addEventListener('input', () => {
            clearTimeout(this.autoSaveTimeout);
            this.autoSaveTimeout = setTimeout(() => this.saveNotes(), 1000);
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'n':
                        e.preventDefault();
                        this.createNote();
                        break;
                    case 's':
                        e.preventDefault();
                        this.saveNotes();
                        break;
                    case 'f':
                        e.preventDefault();
                        this.elements.searchInput.focus();
                        break;
                }
            }
        });
    }
    
    createNote() {
        const newNote = {
            id: Date.now().toString(),
            title: 'New Note',
            content: '',
            lastModified: new Date().toISOString(),
            createdAt: new Date().toISOString()
        };
        
        this.notes.unshift(newNote);
        this.currentNote = newNote;
        this.renderNotes();
        this.showEditor();
        this.elements.noteTitle.focus();
        this.elements.noteTitle.select();
        this.saveNotes();
    }
    
    selectNote(noteId) {
        this.currentNote = this.notes.find(note => note.id === noteId);
        this.showEditor();
        this.renderNotes();
    }
    
    showEditor() {
        if (this.currentNote) {
            this.elements.welcomeScreen.style.display = 'none';
            this.elements.editorContainer.style.display = 'flex';
            this.elements.noteTitle.value = this.currentNote.title;
            this.elements.noteContent.value = this.currentNote.content;
            this.updateWordCount();
            this.updateNoteDate();
        }
    }
    
    showWelcomeScreen() {
        this.elements.welcomeScreen.style.display = 'flex';
        this.elements.editorContainer.style.display = 'none';
        this.currentNote = null;
    }
    
    updateCurrentNote() {
        if (this.currentNote) {
            this.currentNote.title = this.elements.noteTitle.value || 'Untitled';
            this.currentNote.content = this.elements.noteContent.value;
            this.currentNote.lastModified = new Date().toISOString();
            this.renderNotes();
        }
    }
    
    deleteCurrentNote() {
        if (this.currentNote && confirm('Are you sure you want to delete this note?')) {
            this.notes = this.notes.filter(note => note.id !== this.currentNote.id);
            this.saveNotes();
            this.renderNotes();
            
            if (this.notes.length === 0) {
                this.showWelcomeScreen();
            } else {
                this.selectNote(this.notes[0].id);
            }
        }
    }
    
    filterNotes(searchTerm) {
        const filteredNotes = this.notes.filter(note => 
            note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.renderNotes(filteredNotes);
    }
    
    renderNotes(notesToRender = this.notes) {
        this.elements.notesList.innerHTML = '';
        
        if (notesToRender.length === 0) {
            this.elements.notesList.innerHTML = '<div class="no-notes">No notes found</div>';
            return;
        }
        
        notesToRender.forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.className = `note-item ${this.currentNote && this.currentNote.id === note.id ? 'active' : ''}`;
            noteElement.innerHTML = `
                <div class="note-item-title">${this.escapeHtml(note.title)}</div>
                <div class="note-item-preview">${this.escapeHtml(note.content.substring(0, 100))}${note.content.length > 100 ? '...' : ''}</div>
                <div class="note-item-date">${this.formatDate(note.lastModified)}</div>
            `;
            
            noteElement.addEventListener('click', () => this.selectNote(note.id));
            this.elements.notesList.appendChild(noteElement);
        });
    }
    
    updateWordCount() {
        const content = this.elements.noteContent.value;
        const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
        this.elements.wordCount.textContent = `${wordCount} words`;
    }
    
    updateNoteDate() {
        if (this.currentNote) {
            this.elements.noteDate.textContent = `Last modified: ${this.formatDate(this.currentNote.lastModified)}`;
        }
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);
        
        if (diffInHours < 1) {
            return 'Just now';
        } else if (diffInHours < 24) {
            return `${Math.floor(diffInHours)} hours ago`;
        } else if (diffInHours < 48) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString();
        }
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    saveNotes() {
        try {
            localStorage.setItem('webNotepadNotes', JSON.stringify(this.notes));
            console.log('Notes saved successfully');
        } catch (error) {
            console.error('Failed to save notes:', error);
            alert('Failed to save notes. Please check your browser storage.');
        }
    }
    
    loadNotes() {
        try {
            const savedNotes = localStorage.getItem('webNotepadNotes');
            if (savedNotes) {
                this.notes = JSON.parse(savedNotes);
                this.renderNotes();
                
                if (this.notes.length > 0) {
                    this.selectNote(this.notes[0].id);
                }
            }
        } catch (error) {
            console.error('Failed to load notes:', error);
            this.notes = [];
        }
    }
    
    setupToolbarListeners() {
        // Font controls
        this.elements.fontFamily.addEventListener('change', () => this.applyFontFamily());
        this.elements.fontSize.addEventListener('change', () => this.applyFontSize());
        
        // Text formatting
        this.elements.boldBtn.addEventListener('click', () => this.toggleBold());
        this.elements.italicBtn.addEventListener('click', () => this.toggleItalic());
        this.elements.underlineBtn.addEventListener('click', () => this.toggleUnderline());
        
        // Text alignment
        this.elements.alignLeftBtn.addEventListener('click', () => this.setAlignment('left'));
        this.elements.alignCenterBtn.addEventListener('click', () => this.setAlignment('center'));
        this.elements.alignRightBtn.addEventListener('click', () => this.setAlignment('right'));
        this.elements.alignJustifyBtn.addEventListener('click', () => this.setAlignment('justify'));
        
        // Lists
        this.elements.bulletListBtn.addEventListener('click', () => this.toggleBulletList());
        this.elements.numberListBtn.addEventListener('click', () => this.toggleNumberList());
        
        // Colors
        this.elements.textColor.addEventListener('change', () => this.applyTextColor());
        this.elements.highlightColor.addEventListener('change', () => this.applyHighlightColor());
        
        // Actions
        this.elements.undoBtn.addEventListener('click', () => this.undo());
        this.elements.redoBtn.addEventListener('click', () => this.redo());
        this.elements.clearFormatBtn.addEventListener('click', () => this.clearFormatting());
    }
    
    // Toolbar functions
    applyFontFamily() {
        const fontFamily = this.elements.fontFamily.value;
        this.applyFormattingToSelection('fontFamily', fontFamily);
    }
    
    applyFontSize() {
        const fontSize = this.elements.fontSize.value;
        this.applyFormattingToSelection('fontSize', fontSize);
    }
    
    toggleBold() {
        this.toggleFormatting('fontWeight', 'bold', 'normal');
    }
    
    toggleItalic() {
        this.toggleFormatting('fontStyle', 'italic', 'normal');
    }
    
    toggleUnderline() {
        this.toggleFormatting('textDecoration', 'underline', 'none');
    }
    
    applyFormattingToSelection(property, value) {
        const textarea = this.elements.noteContent;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        
        if (start === end) {
            // No text selected, apply to entire content
            textarea.style[property] = value;
        } else {
            // Text is selected, we need to use a different approach
            // For textarea, we'll apply to the whole content for now
            // In a real rich text editor, you'd use contentEditable div
            textarea.style[property] = value;
        }
        this.updateCurrentNote();
    }
    
    toggleFormatting(property, activeValue, inactiveValue) {
        const textarea = this.elements.noteContent;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        
        if (start === end) {
            // No text selected, toggle entire content
            const currentValue = textarea.style[property];
            const newValue = currentValue === activeValue ? inactiveValue : activeValue;
            textarea.style[property] = newValue;
            this.updateButtonState(property + 'Btn', newValue === activeValue);
        } else {
            // Text is selected, apply formatting
            const currentValue = textarea.style[property];
            const newValue = currentValue === activeValue ? inactiveValue : activeValue;
            textarea.style[property] = newValue;
            this.updateButtonState(property + 'Btn', newValue === activeValue);
        }
        this.updateCurrentNote();
    }
    
    setAlignment(alignment) {
        this.elements.noteContent.style.textAlign = alignment;
        this.updateAlignmentButtons(alignment);
        this.updateCurrentNote();
    }
    
    updateAlignmentButtons(activeAlignment) {
        const buttons = ['alignLeftBtn', 'alignCenterBtn', 'alignRightBtn', 'alignJustifyBtn'];
        buttons.forEach(btnId => {
            this.elements[btnId].classList.remove('active');
        });
        this.elements[`align${activeAlignment.charAt(0).toUpperCase() + activeAlignment.slice(1)}Btn`].classList.add('active');
    }
    
    toggleBulletList() {
        const currentStyle = this.elements.noteContent.style.listStyleType;
        if (currentStyle === 'disc') {
            this.elements.noteContent.style.listStyleType = 'none';
            this.elements.noteContent.style.paddingLeft = '0';
        } else {
            this.elements.noteContent.style.listStyleType = 'disc';
            this.elements.noteContent.style.paddingLeft = '20px';
        }
        this.updateButtonState('bulletListBtn', this.elements.noteContent.style.listStyleType === 'disc');
        this.updateCurrentNote();
    }
    
    toggleNumberList() {
        const currentStyle = this.elements.noteContent.style.listStyleType;
        if (currentStyle === 'decimal') {
            this.elements.noteContent.style.listStyleType = 'none';
            this.elements.noteContent.style.paddingLeft = '0';
        } else {
            this.elements.noteContent.style.listStyleType = 'decimal';
            this.elements.noteContent.style.paddingLeft = '20px';
        }
        this.updateButtonState('numberListBtn', this.elements.noteContent.style.listStyleType === 'decimal');
        this.updateCurrentNote();
    }
    
    applyTextColor() {
        const color = this.elements.textColor.value;
        this.applyFormattingToSelection('color', color);
    }
    
    applyHighlightColor() {
        const color = this.elements.highlightColor.value;
        this.applyFormattingToSelection('backgroundColor', color);
    }
    
    undo() {
        // Simple undo implementation
        document.execCommand('undo', false, null);
    }
    
    redo() {
        // Simple redo implementation
        document.execCommand('redo', false, null);
    }
    
    clearFormatting() {
        this.elements.noteContent.style.fontWeight = 'normal';
        this.elements.noteContent.style.fontStyle = 'normal';
        this.elements.noteContent.style.textDecoration = 'none';
        this.elements.noteContent.style.textAlign = 'left';
        this.elements.noteContent.style.listStyleType = 'none';
        this.elements.noteContent.style.paddingLeft = '0';
        this.elements.noteContent.style.color = '#ffffff';
        this.elements.noteContent.style.backgroundColor = 'transparent';
        
        // Update button states
        this.updateButtonState('boldBtn', false);
        this.updateButtonState('italicBtn', false);
        this.updateButtonState('underlineBtn', false);
        this.updateAlignmentButtons('left');
        this.updateButtonState('bulletListBtn', false);
        this.updateButtonState('numberListBtn', false);
        
        this.updateCurrentNote();
    }
    
    updateButtonState(buttonId, isActive) {
        if (isActive) {
            this.elements[buttonId].classList.add('active');
        } else {
            this.elements[buttonId].classList.remove('active');
        }
    }

}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.notepad = new WebNotepad();
    
    // Show welcome message
    console.log('Web Notepad initialized successfully!');
    console.log('Keyboard shortcuts:');
    console.log('Ctrl/Cmd + N: New note');
    console.log('Ctrl/Cmd + S: Save notes');
    console.log('Ctrl/Cmd + F: Focus search');
    console.log('Ctrl/Cmd + B: Bold');
    console.log('Ctrl/Cmd + I: Italic');
    console.log('Ctrl/Cmd + U: Underline');
    console.log('Ctrl/Cmd + Z: Undo');
    console.log('Ctrl/Cmd + Y: Redo');
});

// Service Worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
