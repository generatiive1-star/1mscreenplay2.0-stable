/**
 * 1M SCREENPLAY 2.0 - Core Application Logic
 */

const USE_FIXED_35_LINE_MODE = false;
const MAX_LINES_PER_PAGE = 35;
const USE_FIXED_35_LINE_PDF_EXPORT = false;
const PDF_MAX_LINES_PER_PAGE = 35;
const USE_PDF_MIRROR_EXPORT = true;
const USE_DEDICATED_PDF_ENGINE = true;
const USE_EXPORT_MIRROR = true;
let flatLines = [];

// Define Screenplay Elements structure
const SCREENPLAY_ELEMENTS = [
    {
        id: "act",
        name: "ACT",
        icon: "fa-film",
        subterms: [
            "Act I", "Act II", "Act III", "Act IV", "Act V"
        ]
    },
    {
        id: "scene_heading",
        name: "SCENE HEADING",
        icon: "fa-clapperboard",
        subterms: [
            "INT.", "EXT.", "INT./EXT.", "DAY", "NIGHT", "MORNING", 
            "AFTERNOON", "EVENING", "SUNSET", "SUNRISE", "DAWN", 
            "DUSK", "CONTINUOUS", "LATER", "SAME", "MOMENTS LATER"
        ]
    },
    {
        id: "action",
        name: "ACTION",
        icon: "fa-running",
        subterms: [
            "Character Entrance", "Character Exit", "Movement", "Physical Action", 
            "Facial Expression", "Body Language", "Environmental Description", 
            "Object Description", "Sound Effect", "Weather", "Reaction"
        ]
    },
    {
        id: "character",
        name: "CHARACTER",
        icon: "fa-user",
        subterms: [
            "Main Male Lead", "Main Female Lead", "Main Character", "Supporting Character", 
            "Antagonist", "New Character", "Anonymous Character", "Group Character", 
            "V.O.", "O.S.", "O.C.", "CONT'D", "Dual Character", "Narrator"
        ]
    },
    {
        id: "dialogue",
        name: "DIALOGUE",
        icon: "fa-comments",
        subterms: [
            "Normal Dialogue", "Monologue", "Dual Dialogue", "Overlapping Dialogue", 
            "Narration", "Phone Dialogue", "Voice Message", "Announcement", 
            "Interrupted Dialogue", "Continued Dialogue", "Group Dialogue", 
            "V.O.", "O.S.", "O.C.", "Soliloquy", "Subtext", "Beat", 
            "Silence", "CONT'D"
        ]
    },
    {
        id: "parenthetical",
        name: "PARENTHETICAL",
        icon: "fa-comment-dots",
        subterms: [
            "Beat", "Silence", "Whispering", "Softly", "Loudly", 
            "Shouting", "Screaming", "Angrily", "Calmly", "Happily", 
            "Sadly", "Crying", "Laughing", "Smiling", "Nervously", 
            "Sarcastically", "Hesitantly", "To Character", "On Phone", 
            "To Himself/Herself", "Under Breath"
        ]
    },
    {
        id: "transition",
        name: "TRANSITION",
        icon: "fa-right-left",
        subterms: [
            "FADE IN:", "FADE OUT.", "CUT TO:", "HARD CUT TO:", "QUICK CUT TO:", 
            "DISSOLVE TO:", "CROSSFADE TO:", "MATCH CUT TO:", "SMASH CUT TO:", 
            "JUMP CUT TO:", "WIPE TO:", "FADE TO BLACK.", "FADE FROM BLACK.", 
            "INTERCUT:", "SPLIT SCREEN:", "FREEZE FRAME:", "FLASHBACK:", 
            "END FLASHBACK", "FLASH FORWARD:", "END FLASH FORWARD", "CUT BACK TO:", 
            "BACK TO SCENE:", "BACK TO PRESENT:", "BACK TO REALITY:", "MONTAGE", 
            "END MONTAGE", "SERIES OF SHOTS", "END SERIES OF SHOTS", "IRIS IN:", 
            "IRIS OUT:", "TIME CUT:"
        ]
    },
    {
        id: "shot",
        name: "SHOT",
        icon: "fa-video",
        categories: {
            "Camera Shots": [
                "Extreme Extreme Wide Shot", "Extreme Wide Shot", "Very Wide Shot", 
                "Wide Shot", "Full Shot", "Cowboy Shot", "Medium Full Shot", 
                "Medium Long Shot", "Medium Shot", "Medium Close Up", "Close Up", 
                "Extreme Close Up", "Insert Shot", "Cutaway Shot", "Two Shot", 
                "Three Shot", "Group Shot", "Over The Shoulder Shot", "Point Of View Shot", 
                "Reaction Shot", "Establishing Shot", "Master Shot", "Tracking Shot", 
                "Sequence Shot", "Dirty Shot"
            ],
            "Camera Angles": [
                "Eye Level Angle", "High Angle", "Low Angle", "Bird's Eye View", 
                "Worm's Eye View", "Dutch Angle", "Overhead Angle", "Ground Level Angle", 
                "Shoulder Level Angle", "Hip Level Angle", "Knee Level Angle", "POV Angle", 
                "Over The Shoulder Angle", "Reverse Angle", "Aerial / Drone Angle"
            ],
            "Camera Movements": [
                "Pan", "Tilt", "Zoom In", "Zoom Out", "Dolly In", "Dolly Out", 
                "Truck (Track)", "Pedestal Up", "Pedestal Down", "Crane Up", "Crane Down", 
                "Tracking Shot", "Follow Shot", "Arc Shot", "Orbit Shot", "Handheld", 
                "Steadicam Shot", "Gimbal Shot", "Whip Pan", "360° Rotation Shot"
            ],
            "Special Cinematic Shots": [
                "Dolly Zoom", "Bullet Time", "Rack Focus", "Push In", "Pull Out", 
                "Snap Zoom", "Locked-Off Shot", "Long Take", "One Shot", "Split Diopter Shot", 
                "Slow Motion Shot", "Time-Lapse Shot", "Hyperlapse Shot", "Freeze Frame", 
                "Hidden Cut Shot", "Aerial Drone Reveal", "Circular Tracking Shot", "Hero Shot", 
                "Silhouette Shot", "Reflection Shot"
            ]
        }
    },
    {
        id: "text",
        name: "TEXT",
        icon: "fa-font",
        subterms: [
            "SUPER", "TITLE CARD", "ON SCREEN TEXT", "LOCATION TEXT", 
            "DATE & TIME TEXT", "TIME SKIP", "LETTER", "DIARY", 
            "BOOK TEXT", "DOCUMENT", "PHONE SCREEN", "TEXT MESSAGE", 
            "CHAT MESSAGE", "EMAIL", "COMPUTER SCREEN", "WEBSITE", 
            "SOCIAL MEDIA POST", "NEWSPAPER", "MAGAZINE", "NOTICE BOARD", 
            "POSTER", "NEWS REPORT", "TV BROADCAST", "RADIO ANNOUNCEMENT", 
            "WARNING MESSAGE", "SYSTEM MESSAGE", "COUNTDOWN", "CREDITS", 
            "END TITLE"
        ]
    },
    {
        id: "dual_dialogue",
        name: "DUAL DIALOGUE",
        icon: "fa-columns",
        subterms: [
            "Two Character Dialogue", "Three Character Dialogue", "Overlapping Dialogue", 
            "Simultaneous Dialogue", "Group Dialogue", "Interrupted Dual Dialogue", 
            "Dual Monologue"
        ]
    }
];

// Helper to create a new page of 50 empty lines
function createEmptyPage() {
    const lines = [];
    for (let i = 0; i < 50; i++) {
        lines.push({
            text: "",
            type: "empty", // empty, main-term, sub-term, user-text
            elementId: ""
        });
    }
    return lines;
}

function initializeFlatLines() {
    flatLines = [];
    State.pages.forEach(page => {
        page.forEach(line => {
            flatLines.push({
                text: line.text || "",
                type: line.type || "empty",
                elementId: line.elementId || ""
            });
        });
    });
}

function syncFlatLinesToStatePages() {
    const pages = [];
    for (let i = 0; i < flatLines.length; i += 50) {
        const chunk = flatLines.slice(i, i + 50);
        while (chunk.length < 50) {
            chunk.push({ text: "", type: "empty", elementId: "" });
        }
        pages.push(chunk);
    }
    if (pages.length === 0) {
        pages.push(createEmptyPage());
    }
    State.pages = pages;
}

function getPaginatedPages() {
    const pages = [];
    let lastNonEmptyIdx = -1;
    for (let i = flatLines.length - 1; i >= 0; i--) {
        if (flatLines[i] && flatLines[i].type !== 'empty') {
            lastNonEmptyIdx = i;
            break;
        }
    }
    
    const limit = Math.max(35, lastNonEmptyIdx + 1);
    
    for (let i = 0; i < limit; i += 35) {
        const chunk = flatLines.slice(i, i + 35);
        while (chunk.length < 35) {
            chunk.push({ text: "", type: "empty", elementId: "" });
        }
        pages.push(chunk);
    }
    
    if (pages.length === 0) {
        pages.push(Array.from({ length: 35 }, () => ({ text: "", type: "empty", elementId: "" })));
    }
    return pages;
}

function getMaxLineIndex() {
    return USE_FIXED_35_LINE_MODE ? 34 : 49;
}

// App State Management
const State = {
    projectName: "Untitled Screenplay",
    pages: [createEmptyPage()],
    currentPageIndex: 0,
    activeLineIndex: 0,
    favorites: [],
    recentItems: [],
    historyStack: [],
    historyIndex: -1,
    autoSave: true,
    lastOpenedProject: null,
    
    // Save state helper
    saveToHistory() {
        saveActivePageDOM();
        
        // Cut off forward history if we were in the middle of undo stack
        if (this.historyIndex < this.historyStack.length - 1) {
            this.historyStack = this.historyStack.slice(0, this.historyIndex + 1);
        }
        
        // Deep copy pages array
        const pageCopies = this.pages.map(page => page.map(line => ({...line})));
        
        this.historyStack.push({
            projectName: this.projectName,
            pages: pageCopies,
            currentPageIndex: this.currentPageIndex,
            activeLineIndex: this.activeLineIndex
        });
        
        // Limit stack size to 50
        if (this.historyStack.length > 50) {
            this.historyStack.shift();
        }
        this.historyIndex = this.historyStack.length - 1;
        
        if (this.autoSave) {
            this.saveProjectLocally();
        }
    },
    
    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.loadHistoryState();
            return true;
        }
        return false;
    },
    
    redo() {
        if (this.historyIndex < this.historyStack.length - 1) {
            this.historyIndex++;
            this.loadHistoryState();
            return true;
        }
        return false;
    },
    
    loadHistoryState() {
        const state = this.historyStack[this.historyIndex];
        this.projectName = state.projectName;
        this.pages = state.pages.map(page => page.map(line => ({...line})));
        if (USE_FIXED_35_LINE_MODE) {
            initializeFlatLines();
        }
        this.currentPageIndex = state.currentPageIndex;
        this.activeLineIndex = state.activeLineIndex;
        
        // Update elements
        document.getElementById('project-title').innerText = this.projectName;
        updatePageIndicator();
        renderActivePage();
        focusLine(this.activeLineIndex);
    },

    saveProjectLocally(name = this.projectName) {
        saveActivePageDOM();
        
        let projectsList = JSON.parse(localStorage.getItem('1m_screenplay_projects_list') || '[]');
        if (!projectsList.includes(name) && projectsList.length >= 3) {
            alert("Maximum limit of 3 projects reached.\nDelete an existing project before creating or saving another.");
            return;
        }
        
        const projectData = {
            projectName: name,
            pages: this.pages,
            currentPageIndex: this.currentPageIndex,
            activeLineIndex: this.activeLineIndex,
            favorites: this.favorites,
            recentItems: this.recentItems,
            updatedAt: new Date().toISOString()
        };
        
        localStorage.setItem(`1m_screenplay_project_${name.replace(/\s+/g, '_')}`, JSON.stringify(projectData));
        
        // Update project list
        if (!projectsList.includes(name)) {
            projectsList.push(name);
            localStorage.setItem('1m_screenplay_projects_list', JSON.stringify(projectsList));
        }
        
        localStorage.setItem('1m_screenplay_last_project', name);
        showSaveStatus("Saved");
        renderRecentProjectsMenu();
    }
};

// UI Elements
const editor = document.getElementById('screenplay-editor');
const pageIndicatorNum = document.getElementById('current-page-num');
const totalPagesNum = document.getElementById('total-pages-num');
const favoritesList = document.getElementById('favorites-list');
const recentList = document.getElementById('recent-list');
const elementsList = document.getElementById('screenplay-elements-list');
const searchInput = document.getElementById('search-elements');
const projectTitle = document.getElementById('project-title');
const saveStatus = document.getElementById('save-status');

// Init application
document.addEventListener('DOMContentLoaded', () => {
    loadAppState();
    setupEventListeners();
    renderSidebarElements();
    renderFavorites();
    renderRecentItems();
    renderRecentProjectsMenu();
    
    initZoom();
    
    if (USE_FIXED_35_LINE_MODE) {
        initializeFlatLines();
    }
    
    // Save initial state to history stack
    State.saveToHistory();
});

// Safe migration for legacy single-project data
function migrateLegacyData() {
    let projectsList = localStorage.getItem('1m_screenplay_projects_list');
    if (projectsList !== null) {
        return;
    }
    
    const legacyPagesRaw = localStorage.getItem('1m_screenplay_pages');
    const legacyFavsRaw = localStorage.getItem('1m_screenplay_favorites');
    const legacyRecentsRaw = localStorage.getItem('1m_screenplay_recents');
    
    let pages = [createEmptyPage()];
    let favorites = [];
    let recentItems = [];
    let hasLegacy = false;
    
    if (legacyPagesRaw) {
        try {
            pages = JSON.parse(legacyPagesRaw);
            hasLegacy = true;
        } catch (e) {
            console.error("Error parsing legacy pages:", e);
        }
    }
    
    if (legacyFavsRaw) {
        try {
            favorites = JSON.parse(legacyFavsRaw);
            hasLegacy = true;
        } catch (e) {
            console.error("Error parsing legacy favorites:", e);
        }
    }
    
    if (legacyRecentsRaw) {
        try {
            recentItems = JSON.parse(legacyRecentsRaw);
            hasLegacy = true;
        } catch (e) {
            console.error("Error parsing legacy recents:", e);
        }
    }
    
    if (!hasLegacy) {
        const existingProjectRaw = localStorage.getItem('1m_screenplay_project_Untitled_Screenplay');
        if (existingProjectRaw) {
            hasLegacy = true;
            try {
                const data = JSON.parse(existingProjectRaw);
                pages = data.pages || pages;
                favorites = data.favorites || favorites;
                recentItems = data.recentItems || recentItems;
            } catch (e) {
                console.error("Error parsing existing Untitled Screenplay:", e);
            }
        }
    }
    
    const defaultName = "Untitled Screenplay";
    const projectData = {
        projectName: defaultName,
        pages: pages,
        currentPageIndex: 0,
        activeLineIndex: 0,
        favorites: favorites,
        recentItems: recentItems,
        updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem(`1m_screenplay_project_${defaultName.replace(/\s+/g, '_')}`, JSON.stringify(projectData));
    localStorage.setItem('1m_screenplay_projects_list', JSON.stringify([defaultName]));
    localStorage.setItem('1m_screenplay_last_project', defaultName);
}

// Load favorites, recent, and last project from LocalStorage
function loadAppState() {
    migrateLegacyData();
    
    // Check autosave toggle
    const autosaveCheckbox = document.getElementById('toggle-autosave');
    State.autoSave = autosaveCheckbox.checked;
    
    const projectsList = JSON.parse(localStorage.getItem('1m_screenplay_projects_list') || '[]');
    let lastProject = localStorage.getItem('1m_screenplay_last_project');
    
    if (!lastProject || !projectsList.includes(lastProject)) {
        lastProject = projectsList[0] || "Untitled Screenplay";
    }
    
    loadProject(lastProject);
}

// Load project by name from LocalStorage
function loadProject(name) {
    const rawData = localStorage.getItem(`1m_screenplay_project_${name.replace(/\s+/g, '_')}`);
    if (rawData) {
        const data = JSON.parse(rawData);
        State.projectName = data.projectName;
        State.pages = data.pages || [createEmptyPage()];
        if (USE_FIXED_35_LINE_MODE) {
            initializeFlatLines();
        }
        State.currentPageIndex = data.currentPageIndex || 0;
        State.activeLineIndex = data.activeLineIndex !== undefined ? data.activeLineIndex : 0;
        State.favorites = data.favorites || [];
        State.recentItems = data.recentItems || [];
        
        projectTitle.innerText = State.projectName;
        updatePageIndicator();
        renderActivePage();
        renderFavorites();
        renderRecentItems();
        
        // Reset history stack
        State.historyStack = [];
        State.historyIndex = -1;
        State.saveToHistory();
        
        showSaveStatus("Loaded");
        focusLine(State.activeLineIndex);
    }
}

function showSaveStatus(text) {
    saveStatus.innerText = text;
    saveStatus.style.opacity = '1';
    setTimeout(() => {
        saveStatus.style.opacity = '0.7';
    }, 2000);
}

// Read the page lines from DOM and update State.pages array
function saveActivePageDOM() {
    if (USE_FIXED_35_LINE_MODE) {
        const lineDivs = editor.querySelectorAll('.sp-line');
        lineDivs.forEach((div) => {
            const flatIdxAttr = div.getAttribute('data-flat-line-index');
            if (flatIdxAttr === null) return;
            const flatLineIdx = parseInt(flatIdxAttr, 10);
            
            while (flatLines.length <= flatLineIdx) {
                flatLines.push({ text: "", type: "empty", elementId: "" });
            }
            
            const html = div.innerHTML.replace(/\n$/, ''); // Strip contenteditable trailing newline
            const text = div.innerText.replace(/\n$/, '');
            if (text.trim() === '' || html === '<br>' || html === '<br/>' || html === '<br/ >') {
                flatLines[flatLineIdx].text = '';
                flatLines[flatLineIdx].type = 'empty';
                flatLines[flatLineIdx].elementId = '';
            } else {
                flatLines[flatLineIdx].text = html;
                if (flatLines[flatLineIdx].type === 'empty') {
                    flatLines[flatLineIdx].type = 'user-text';
                }
            }
        });
        syncFlatLinesToStatePages();
    } else {
        const pageData = State.pages[State.currentPageIndex];
        if (!pageData) return;
        const lineDivs = editor.querySelectorAll('.sp-line');
        lineDivs.forEach((div, idx) => {
            if (idx < 50) {
                const html = div.innerHTML.replace(/\n$/, ''); // Strip contenteditable trailing newline
                const text = div.innerText.replace(/\n$/, '');
                if (text.trim() === '' || html === '<br>' || html === '<br/>' || html === '<br/ >') {
                    pageData[idx].text = '';
                    pageData[idx].type = 'empty';
                    pageData[idx].elementId = '';
                } else {
                    pageData[idx].text = html;
                    if (pageData[idx].type === 'empty') {
                        pageData[idx].type = 'user-text';
                    }
                }
            }
        });
    }
}

// Setup core Event Listeners
function setupEventListeners() {
    // Title Input
    projectTitle.addEventListener('blur', () => {
        const newTitle = projectTitle.innerText.trim();
        const oldTitle = State.projectName;
        
        if (newTitle === oldTitle) return;
        
        if (!newTitle) {
            alert("Project name cannot be blank.");
            projectTitle.innerText = oldTitle;
            return;
        }
        
        const list = JSON.parse(localStorage.getItem('1m_screenplay_projects_list') || '[]');
        if (list.includes(newTitle)) {
            alert(`A project named "${newTitle}" already exists.`);
            projectTitle.innerText = oldTitle;
            return;
        }
        
        renameProject(oldTitle, newTitle);
        State.saveToHistory();
    });

    projectTitle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            projectTitle.blur();
        }
    });

    // Content Editor Changes (autosave hook)
    let editorTimeout;
    editor.addEventListener('input', (e) => {
        const target = e.target;
        if (target && target.classList.contains('sp-line')) {
            const text = target.innerText.replace(/\n$/, '');
            if (text.trim() !== '') {
                if (target.classList.contains('sp-line-empty')) {
                    target.classList.remove('sp-line-empty');
                    target.classList.add('sp-line-user-text');
                }
            } else {
                target.className = 'sp-line sp-line-empty';
            }
        }

        clearTimeout(editorTimeout);
        editorTimeout = setTimeout(() => {
            saveActivePageDOM();
            State.saveToHistory();
        }, 1000);
    });

    // Handle keydown events inside ContentEditable
    editor.addEventListener('keydown', handleEditorKeyDown);

    // Search Input
    searchInput.addEventListener('input', (e) => {
        renderSidebarElements(e.target.value.toLowerCase());
    });

    // Nav bar buttons
    document.getElementById('btn-prev-page').addEventListener('click', () => navigatePage(-1));
    document.getElementById('btn-next-page').addEventListener('click', () => navigatePage(1));
    document.getElementById('btn-new-page').addEventListener('click', addNewPage);
    document.getElementById('btn-delete-page').addEventListener('click', deleteCurrentPage);
    
    document.getElementById('btn-goto-page').addEventListener('click', () => {
        const num = parseInt(document.getElementById('goto-page-input').value);
        const totalPages = USE_FIXED_35_LINE_MODE ? getPaginatedPages().length : State.pages.length;
        if (num && num > 0 && num <= totalPages) {
            saveActivePageDOM();
            State.currentPageIndex = num - 1;
            State.activeLineIndex = 0;
            renderActivePage();
            updatePageIndicator();
            focusLine(0);
        }
    });

    // Project files buttons
    document.getElementById('btn-new').addEventListener('click', createNewProject);
    document.getElementById('btn-open').addEventListener('click', showOpenProjectModal);
    document.getElementById('btn-save').addEventListener('click', () => State.saveProjectLocally());
    document.getElementById('btn-save-as').addEventListener('click', showSaveAsModal);
    document.getElementById('toggle-autosave').addEventListener('change', (e) => {
        State.autoSave = e.target.checked;
    });

    // Export Event Listeners
    document.getElementById('export-pdf').addEventListener('click', exportToPDF);
    document.getElementById('export-txt').addEventListener('click', exportToTXT);
    document.getElementById('export-docx').addEventListener('click', exportToDOCX);

    // Undo / Redo Click Handlers
    document.getElementById('btn-undo').addEventListener('click', () => State.undo());
    document.getElementById('btn-redo').addEventListener('click', () => State.redo());

    // Modal control
    document.getElementById('modal-btn-cancel').addEventListener('click', hideModal);
    document.getElementById('modal-btn-confirm').addEventListener('click', confirmModalAction);

    // Paste handler for typewriter mode
    editor.addEventListener('paste', handleEditorPaste);

    // Focus active line if clicking empty space inside editor
    editor.addEventListener('click', (e) => {
        if (e.target === editor) {
            focusLine(State.activeLineIndex);
        }
    });

    // Zoom Controls
    const btnZoomOut = document.getElementById('btn-zoom-out');
    const btnZoomIn = document.getElementById('btn-zoom-in');
    const zoomValLabel = document.getElementById('zoom-value');
    
    if (btnZoomOut) btnZoomOut.addEventListener('click', zoomOut);
    if (btnZoomIn) btnZoomIn.addEventListener('click', zoomIn);
    if (zoomValLabel) zoomValLabel.addEventListener('click', resetZoom);

    // Keyboard Shortcuts for Zooming
    window.addEventListener('keydown', (e) => {
        if (e.ctrlKey) {
            if (e.key === '=' || e.key === '+') {
                e.preventDefault();
                zoomIn();
            } else if (e.key === '-') {
                e.preventDefault();
                zoomOut();
            } else if (e.key === '0') {
                e.preventDefault();
                resetZoom();
            }
        }
    });

    // Mouse Wheel Zooming
    const pageViewportEl = document.querySelector('.page-viewport');
    if (pageViewportEl) {
        pageViewportEl.addEventListener('wheel', (e) => {
            if (e.ctrlKey) {
                e.preventDefault();
                if (e.deltaY < 0) {
                    zoomIn();
                } else {
                    zoomOut();
                }
            }
        }, { passive: false });
    }

    // Text Style Dropdown Change Handler
    const styleSelect = document.getElementById('select-text-style');
    if (styleSelect) {
        styleSelect.addEventListener('change', (e) => {
            applyTextStyle(e.target.value);
        });
    }
}

// Navigation implementation
function navigatePage(direction) {
    const totalPages = USE_FIXED_35_LINE_MODE ? getPaginatedPages().length : State.pages.length;
    const nextIndex = State.currentPageIndex + direction;
    if (nextIndex >= 0 && nextIndex < totalPages) {
        saveActivePageDOM();
        State.currentPageIndex = nextIndex;
        State.activeLineIndex = 0;
        renderActivePage();
        updatePageIndicator();
        focusLine(0);
    }
}

function addNewPage() {
    saveActivePageDOM();
    if (USE_FIXED_35_LINE_MODE) {
        // Add 35 empty lines to flatLines
        const newEmptyLines = [];
        for (let i = 0; i < 35; i++) {
            newEmptyLines.push({ text: "", type: "empty", elementId: "" });
        }
        const insertAtFlatIdx = (State.currentPageIndex + 1) * 35;
        flatLines.splice(insertAtFlatIdx, 0, ...newEmptyLines);
        syncFlatLinesToStatePages();
        
        State.currentPageIndex++;
        State.activeLineIndex = 0;
    } else {
        State.pages.splice(State.currentPageIndex + 1, 0, createEmptyPage());
        State.currentPageIndex++;
        State.activeLineIndex = 0;
    }
    renderActivePage();
    updatePageIndicator();
    State.saveToHistory();
    focusLine(0);
}

function deleteCurrentPage() {
    const totalPages = USE_FIXED_35_LINE_MODE ? getPaginatedPages().length : State.pages.length;
    if (totalPages <= 1) {
        alert("You cannot delete the first page.");
        return;
    }
    if (confirm("Are you sure you want to delete this page? This cannot be undone.")) {
        if (USE_FIXED_35_LINE_MODE) {
            const startFlatIdx = State.currentPageIndex * 35;
            flatLines.splice(startFlatIdx, 35);
            syncFlatLinesToStatePages();
            
            const newTotalPages = getPaginatedPages().length;
            if (State.currentPageIndex >= newTotalPages) {
                State.currentPageIndex = newTotalPages - 1;
            }
            State.activeLineIndex = 0;
        } else {
            State.pages.splice(State.currentPageIndex, 1);
            if (State.currentPageIndex >= State.pages.length) {
                State.currentPageIndex = State.pages.length - 1;
            }
            State.activeLineIndex = 0;
        }
        renderActivePage();
        updatePageIndicator();
        State.saveToHistory();
        focusLine(0);
    }
}

function updatePageIndicator() {
    const totalPages = USE_FIXED_35_LINE_MODE ? getPaginatedPages().length : State.pages.length;
    pageIndicatorNum.innerText = State.currentPageIndex + 1;
    totalPagesNum.innerText = totalPages;
    document.getElementById('page-number-footer').innerText = State.currentPageIndex + 1;
}

function renderPageIntoContainer(pageData, targetContainer, isEditable = true, pageIdx = State.currentPageIndex) {
    if (!pageData) return;
    targetContainer.innerHTML = "";
    
    for (let i = 0; i < pageData.length; i++) {
        const lineData = pageData[i];
        if (!lineData) continue;
        
        const lineDiv = document.createElement('div');
        lineDiv.className = 'sp-line';
        if (isEditable) {
            lineDiv.setAttribute('contenteditable', 'true');
            lineDiv.setAttribute('data-line-index', i);
            
            if (USE_FIXED_35_LINE_MODE) {
                const flatIdx = pageIdx * 35 + i;
                lineDiv.setAttribute('data-flat-line-index', flatIdx);
            }
            
            // Focus state sync
            lineDiv.addEventListener('focus', () => {
                State.activeLineIndex = i;
            });
        }
        
        if (lineData.type !== 'empty') {
            lineDiv.classList.add(`sp-line-${lineData.type}`);
            if (lineData.elementId) {
                lineDiv.classList.add(`sp-line-${lineData.elementId.replace('_', '-')}`);
            }
            lineDiv.innerHTML = lineData.text;
        } else {
            lineDiv.classList.add('sp-line-empty');
            lineDiv.innerHTML = '<br>';
        }
        
        targetContainer.appendChild(lineDiv);
    }
}

function renderActivePage() {
    if (USE_FIXED_35_LINE_MODE) {
        const pages = getPaginatedPages();
        if (State.currentPageIndex >= pages.length) {
            State.currentPageIndex = Math.max(0, pages.length - 1);
        }
        const pageData = pages[State.currentPageIndex];
        renderPageIntoContainer(pageData, editor, true, State.currentPageIndex);
    } else {
        const pageData = State.pages[State.currentPageIndex];
        renderPageIntoContainer(pageData, editor, true, State.currentPageIndex);
    }
}

// Caret position detection helpers
function isCaretAtStart(element) {
    try {
        const sel = window.getSelection();
        if (sel.rangeCount > 0) {
            const range = sel.getRangeAt(0);
            const preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(element);
            preCaretRange.setEnd(range.startContainer, range.startOffset);
            return preCaretRange.toString().replace(/\n/g, '').length === 0;
        }
    } catch (e) {
        // Fallback
    }
    return false;
}

function isCaretAtEnd(element) {
    try {
        const sel = window.getSelection();
        if (sel.rangeCount > 0) {
            const range = sel.getRangeAt(0);
            const postCaretRange = range.cloneRange();
            postCaretRange.selectNodeContents(element);
            postCaretRange.setStart(range.endContainer, range.endOffset);
            return postCaretRange.toString().replace(/\n/g, '').length === 0;
        }
    } catch (e) {
        // Fallback
    }
    return false;
}

// Custom Enter Key & Editor KeyDown Handlers
function handleEditorKeyDown(e) {
    // Normal keyboard shortcuts
    if (e.ctrlKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        State.undo();
        return;
    }
    if (e.ctrlKey && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        State.redo();
        return;
    }

    // Carriage control on Enter
    if (e.key === 'Enter') {
        e.preventDefault();
        saveActivePageDOM();
        moveToNextLine(State.activeLineIndex);
        State.saveToHistory();
        return;
    }

    // Carriage control on Backspace
    if (e.key === 'Backspace') {
        const lineDiv = editor.querySelector(`[data-line-index="${State.activeLineIndex}"]`);
        if (lineDiv && isCaretAtStart(lineDiv)) {
            e.preventDefault();
            saveActivePageDOM();
            if (State.activeLineIndex > 0) {
                State.activeLineIndex--;
                focusLine(State.activeLineIndex);
            } else if (State.currentPageIndex > 0) {
                State.currentPageIndex--;
                State.activeLineIndex = getMaxLineIndex();
                updatePageIndicator();
                renderActivePage();
                focusLine(getMaxLineIndex());
            }
            State.saveToHistory();
            return;
        }
    }

    // Carriage control on Delete
    if (e.key === 'Delete') {
        const lineDiv = editor.querySelector(`[data-line-index="${State.activeLineIndex}"]`);
        if (lineDiv && isCaretAtEnd(lineDiv)) {
            e.preventDefault();
            saveActivePageDOM();
            if (State.activeLineIndex < getMaxLineIndex()) {
                State.activeLineIndex++;
                focusLine(State.activeLineIndex, true);
            } else if (State.currentPageIndex < (USE_FIXED_35_LINE_MODE ? getPaginatedPages().length - 1 : State.pages.length - 1)) {
                State.currentPageIndex++;
                State.activeLineIndex = 0;
                updatePageIndicator();
                renderActivePage();
                focusLine(0, true);
            }
            State.saveToHistory();
            return;
        }
    }

    // Carriage control on ArrowUp/ArrowDown
    if (e.key === 'ArrowUp') {
        e.preventDefault();
        saveActivePageDOM();
        if (State.activeLineIndex > 0) {
            State.activeLineIndex--;
            focusLine(State.activeLineIndex);
        } else if (State.currentPageIndex > 0) {
            State.currentPageIndex--;
            State.activeLineIndex = getMaxLineIndex();
            updatePageIndicator();
            renderActivePage();
            focusLine(getMaxLineIndex());
        }
        return;
    }

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        saveActivePageDOM();
        if (State.activeLineIndex < getMaxLineIndex()) {
            State.activeLineIndex++;
            focusLine(State.activeLineIndex);
        } else if (State.currentPageIndex < (USE_FIXED_35_LINE_MODE ? getPaginatedPages().length - 1 : State.pages.length - 1)) {
            State.currentPageIndex++;
            State.activeLineIndex = 0;
            updatePageIndicator();
            renderActivePage();
            focusLine(0);
        }
        return;
    }
}

function handleEditorPaste(e) {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text');
    if (!text) return;
    
    // Split text by newlines
    const lines = text.split(/\r?\n/);
    if (lines.length === 0) return;
    
    saveActivePageDOM();
    
    let currentIdx = State.activeLineIndex;
    
    // Paste first line at selection
    const sel = window.getSelection();
    if (sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        range.deleteContents();
        const textNode = document.createTextNode(lines[0]);
        range.insertNode(textNode);
        range.setStartAfter(textNode);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
    } else {
        const lineDiv = editor.querySelector(`[data-line-index="${currentIdx}"]`);
        if (lineDiv) {
            lineDiv.innerText += lines[0];
        }
    }
    
    // If multiple lines, overflow to subsequent lines
    if (lines.length > 1) {
        saveActivePageDOM();
        if (USE_FIXED_35_LINE_MODE) {
            const flatIdx = State.currentPageIndex * 35 + State.activeLineIndex;
            const newLines = lines.slice(1).map(lineText => ({
                text: lineText,
                type: 'user-text',
                elementId: ''
            }));
            flatLines.splice(flatIdx + 1, 0, ...newLines);
            syncFlatLinesToStatePages();
            
            const targetFlatIdx = flatIdx + lines.length - 1;
            State.currentPageIndex = Math.floor(targetFlatIdx / 35);
            State.activeLineIndex = targetFlatIdx % 35;
            updatePageIndicator();
            renderActivePage();
            focusLine(State.activeLineIndex);
        } else {
            for (let i = 1; i < lines.length; i++) {
                if (currentIdx < 49) {
                    currentIdx++;
                    State.pages[State.currentPageIndex][currentIdx] = {
                        text: lines[i],
                        type: 'user-text',
                        elementId: ''
                    };
                } else {
                    // Move to next page
                    if (State.currentPageIndex < State.pages.length - 1) {
                        State.currentPageIndex++;
                    } else {
                        State.pages.push(createEmptyPage());
                        State.currentPageIndex = State.pages.length - 1;
                    }
                    currentIdx = 0;
                    State.pages[State.currentPageIndex][currentIdx] = {
                        text: lines[i],
                        type: 'user-text',
                        elementId: ''
                    };
                }
            }
            State.activeLineIndex = currentIdx;
            updatePageIndicator();
            renderActivePage();
            focusLine(currentIdx);
        }
    }
    
    saveActivePageDOM();
    State.saveToHistory();
}

function findFirstEmptyLine() {
    if (USE_FIXED_35_LINE_MODE) {
        const pages = getPaginatedPages();
        const pageData = pages[State.currentPageIndex];
        if (pageData) {
            for (let i = 0; i < pageData.length; i++) {
                if (pageData[i].type === 'empty' || pageData[i].text.trim() === '') {
                    return i;
                }
            }
        }
        return getMaxLineIndex();
    }
    const pageData = State.pages[State.currentPageIndex];
    for (let i = 0; i < 50; i++) {
        if (pageData[i].type === 'empty' || pageData[i].text.trim() === '') {
            return i;
        }
    }
    return 49;
}

function moveToNextLine(currentIdx) {
    if (currentIdx < getMaxLineIndex()) {
        State.activeLineIndex = currentIdx + 1;
        focusLine(State.activeLineIndex);
    } else {
        // Automatically create/move to new page
        const totalPages = USE_FIXED_35_LINE_MODE ? getPaginatedPages().length : State.pages.length;
        if (State.currentPageIndex < totalPages - 1) {
            State.currentPageIndex++;
            State.activeLineIndex = 0;
            updatePageIndicator();
            renderActivePage();
            focusLine(0);
        } else {
            if (USE_FIXED_35_LINE_MODE) {
                // Add 35 empty lines to flatLines
                const newEmptyLines = [];
                for (let i = 0; i < 35; i++) {
                    newEmptyLines.push({ text: "", type: "empty", elementId: "" });
                }
                flatLines.push(...newEmptyLines);
                syncFlatLinesToStatePages();
                
                State.currentPageIndex++;
                State.activeLineIndex = 0;
            } else {
                State.pages.push(createEmptyPage());
                State.currentPageIndex = State.pages.length - 1;
                State.activeLineIndex = 0;
            }
            updatePageIndicator();
            renderActivePage();
            focusLine(0);
        }
    }
}

function focusLine(idx, atStart = false) {
    setTimeout(() => {
        const lineDiv = editor.querySelector(`[data-line-index="${idx}"]`);
        if (lineDiv) {
            lineDiv.focus();
            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(lineDiv);
            range.collapse(atStart);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }, 0);
}

// Side-bar rendering and logic
function renderSidebarElements(filter = "") {
    elementsList.innerHTML = "";
    
    SCREENPLAY_ELEMENTS.forEach(el => {
        // If search filter applied, check if match
        const matchesMain = el.name.toLowerCase().includes(filter);
        const matchedSubterms = el.subterms ? el.subterms.filter(sub => sub.toLowerCase().includes(filter)) : [];
        
        let matchedShotCategories = {};
        if (el.categories) {
            Object.keys(el.categories).forEach(cat => {
                const matched = el.categories[cat].filter(s => s.toLowerCase().includes(filter));
                if (matched.length > 0) {
                    matchedShotCategories[cat] = matched;
                }
            });
        }
        
        const hasShotMatches = Object.keys(matchedShotCategories).length > 0;
        
        if (!matchesMain && matchedSubterms.length === 0 && !hasShotMatches) {
            return; // skip
        }

        const elItem = document.createElement('div');
        elItem.className = 'element-item';
        elItem.id = `el-item-${el.id}`;

        const headerBtn = document.createElement('button');
        headerBtn.className = 'element-header-btn';
        headerBtn.innerHTML = `
            <span><i class="fa-solid ${el.icon}"></i> ${el.name}</span>
            <i class="fa-solid fa-chevron-down toggle-icon"></i>
        `;
        
        headerBtn.addEventListener('click', () => {
            handleMainElementClick(el);
        });

        const submenuContainer = document.createElement('div');
        submenuContainer.className = 'submenu-container';

        // Render sub terms
        if (el.subterms) {
            const listToRender = filter ? matchedSubterms : el.subterms;
            listToRender.forEach(term => {
                const subtermRow = createSubtermRow(el.id, term);
                submenuContainer.appendChild(subtermRow);
            });
        }

        // Render Shot Categories if SHOT
        if (el.id === 'shot') {
            const categoryWrapper = document.createElement('div');
            categoryWrapper.className = 'shot-categories';
            
            const subList = document.createElement('div');
            subList.className = 'shot-sub-list';
            
            const cats = el.categories;
            const catNames = Object.keys(cats);
            
            catNames.forEach((catName, idx) => {
                const catBtn = document.createElement('button');
                catBtn.className = `btn-shot-category ${idx === 0 ? 'active' : ''}`;
                catBtn.innerText = catName;
                
                catBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    // Toggle active classes
                    categoryWrapper.querySelectorAll('.btn-shot-category').forEach(b => b.classList.remove('active'));
                    catBtn.classList.add('active');
                    // Render subterms for category
                    renderShotSubterms(subList, catName, cats[catName], filter);
                });
                
                categoryWrapper.appendChild(catBtn);
            });
            
            submenuContainer.appendChild(categoryWrapper);
            submenuContainer.appendChild(subList);
            
            // Initial render of first category
            if (catNames.length > 0) {
                renderShotSubterms(subList, catNames[0], cats[catNames[0]], filter);
            }
        }

        elItem.appendChild(headerBtn);
        elItem.appendChild(submenuContainer);
        elementsList.appendChild(elItem);

        // Keep active submenu expanded if filtering
        if (filter) {
            elItem.classList.add('active');
        }
    });
}

function renderShotSubterms(container, categoryName, terms, filter = "") {
    container.innerHTML = "";
    const filtered = filter ? terms.filter(t => t.toLowerCase().includes(filter)) : terms;
    filtered.forEach(term => {
        const subtermRow = createSubtermRow('shot', `${categoryName}: ${term}`);
        container.appendChild(subtermRow);
    });
}

function createSubtermRow(elementId, term) {
    const row = document.createElement('div');
    row.className = 'subterm-item';

    const btn = document.createElement('button');
    btn.className = 'subterm-btn';
    btn.innerText = term;
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        insertSubterm(elementId, term);
    });

    const isPinned = State.favorites.some(fav => fav.elementId === elementId && fav.term === term);
    const pinBtn = document.createElement('button');
    pinBtn.className = `btn-pin ${isPinned ? 'pinned' : ''}`;
    pinBtn.innerHTML = `<i class="fa-${isPinned ? 'solid' : 'regular'} fa-star"></i>`;
    pinBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFavorite(elementId, term);
    });

    row.appendChild(btn);
    row.appendChild(pinBtn);
    return row;
}

// Toggle favorites
function toggleFavorite(elementId, term) {
    const idx = State.favorites.findIndex(fav => fav.elementId === elementId && fav.term === term);
    if (idx > -1) {
        State.favorites.splice(idx, 1);
    } else {
        State.favorites.push({ elementId, term });
    }
    localStorage.setItem('1m_screenplay_favorites', JSON.stringify(State.favorites));
    renderFavorites();
    renderSidebarElements(searchInput.value.toLowerCase());
}

function renderFavorites() {
    favoritesList.innerHTML = "";
    if (State.favorites.length === 0) {
        favoritesList.innerHTML = '<span class="empty-text">No favorites pinned yet.</span>';
        return;
    }
    
    State.favorites.forEach(fav => {
        const row = document.createElement('div');
        row.className = 'subterm-item';
        
        const btn = document.createElement('button');
        btn.className = 'subterm-btn';
        btn.innerHTML = `<span style="font-size:0.75rem; color:var(--accent-gold);">${fav.elementId.toUpperCase()}</span>: ${fav.term}`;
        btn.addEventListener('click', () => {
            insertSubterm(fav.elementId, fav.term);
        });
        
        const pinBtn = document.createElement('button');
        pinBtn.className = 'btn-pin pinned';
        pinBtn.innerHTML = '<i class="fa-solid fa-star"></i>';
        pinBtn.addEventListener('click', () => {
            toggleFavorite(fav.elementId, fav.term);
        });
        
        row.appendChild(btn);
        row.appendChild(pinBtn);
        favoritesList.appendChild(row);
    });
}

// Maintain recent items
function addToRecent(elementId, term) {
    // Prevent duplicate adjacent additions
    if (State.recentItems.length > 0 && State.recentItems[0].elementId === elementId && State.recentItems[0].term === term) {
        return;
    }
    // Remove if already exists
    const idx = State.recentItems.findIndex(rec => rec.elementId === elementId && rec.term === term);
    if (idx > -1) {
        State.recentItems.splice(idx, 1);
    }
    
    State.recentItems.unshift({ elementId, term });
    if (State.recentItems.length > 5) {
        State.recentItems.pop();
    }
    
    localStorage.setItem('1m_screenplay_recents', JSON.stringify(State.recentItems));
    renderRecentItems();
}

function renderRecentItems() {
    recentList.innerHTML = "";
    if (State.recentItems.length === 0) {
        recentList.innerHTML = '<span class="empty-text">No recently used elements.</span>';
        return;
    }
    
    State.recentItems.forEach(rec => {
        const row = document.createElement('div');
        row.className = 'subterm-item';
        
        const btn = document.createElement('button');
        btn.className = 'subterm-btn';
        btn.innerHTML = `<span style="font-size:0.75rem; color:var(--accent-gold);">${rec.elementId.toUpperCase()}</span>: ${rec.term}`;
        btn.addEventListener('click', () => {
            insertSubterm(rec.elementId, rec.term);
        });
        
        row.appendChild(btn);
        recentList.appendChild(row);
    });
}

/// Handle clicking a main element in the left sidebar
function handleMainElementClick(element) {
    const elNode = document.getElementById(`el-item-${element.id}`);
    const isCurrentlyActive = elNode.classList.contains('active');
    
    // Close all other submenus first to keep UI elegant
    document.querySelectorAll('.element-item').forEach(node => {
        node.classList.remove('active');
    });

    if (isCurrentlyActive) {
        // Just close it, do not insert text
        elNode.classList.remove('active');
    } else {
        // Open it and print main title
        elNode.classList.add('active');
        
        // Print the main term to the page
        insertMainElement(element.id, element.name);
    }
}

// Insert elements helper functions
function insertMainElement(elementId, elementName) {
    let lineIdx = State.activeLineIndex !== undefined ? State.activeLineIndex : findFirstEmptyLine();
    const pageData = State.pages[State.currentPageIndex];
    
    pageData[lineIdx] = {
        text: elementName.toUpperCase(),
        type: 'main-term',
        elementId: elementId
    };
    
    // Rerender page
    renderActivePage();
    
    // Move to next line
    moveToNextLine(lineIdx);
    
    State.saveToHistory();
}

function selectTextRange(element, start, end) {
    setTimeout(() => {
        element.focus();
        const range = document.createRange();
        const sel = window.getSelection();
        
        let textNode = element.firstChild;
        if (!textNode) return;
        if (textNode.nodeType !== Node.TEXT_NODE) {
            textNode = textNode.firstChild;
        }
        if (!textNode) return;
        
        range.setStart(textNode, start);
        range.setEnd(textNode, end);
        sel.removeAllRanges();
        sel.addRange(range);
    }, 0);
}

function updateSceneType(currentText, newPrefix) {
    const prefixes = ["INT./EXT. ", "INT. ", "EXT. "];
    for (let pref of prefixes) {
        if (currentText.startsWith(pref)) {
            return newPrefix + " " + currentText.substring(pref.length);
        }
    }
    return newPrefix + " " + currentText;
}

function updateSceneTime(currentText, newTime) {
    const times = [
        "MOMENTS LATER", "CONTINUOUS", "AFTERNOON", "MORNING", "EVENING",
        "SUNRISE", "SUNSET", "LATER", "NIGHT", "DUSK", "DAWN", "SAME", "DAY"
    ];
    for (let t of times) {
        if (currentText.endsWith(" " + t)) {
            return currentText.substring(0, currentText.length - t.length) + newTime;
        }
    }
    return currentText + " " + newTime;
}

function insertHtmlAtRange(range, html) {
    range.deleteContents();
    const el = document.createElement("div");
    el.innerHTML = html;
    const fragment = document.createDocumentFragment();
    let node;
    let lastNode;
    while ((node = el.firstChild)) {
        lastNode = fragment.appendChild(node);
    }
    range.insertNode(fragment);
    
    const newRange = document.createRange();
    if (lastNode) {
        newRange.setStartAfter(lastNode);
        newRange.collapse(true);
    } else {
        newRange.selectNodeContents(range.startContainer);
        newRange.collapse(false);
    }
    return newRange;
}

function insertSubterm(elementId, term) {
    // Intercept shot clicks to insert camera system printable elements at the cursor
    if (elementId === 'shot') {
        let category = "Camera Shots";
        let itemText = term;
        if (term.includes(': ')) {
            const parts = term.split(': ');
            category = parts[0];
            itemText = parts[1];
        }
        
        const categoryMap = {
            "Camera Shots": "Camera Shot",
            "Camera Angles": "Camera Angle",
            "Camera Movements": "Camera Movement",
            "Special Cinematic Shots": "Special Cinematic Shot"
        };
        const label = categoryMap[category] || "Camera Shot";
        const htmlToInsert = `${label}:<br>${itemText}<br><br>`;
        
        let lineIdx = State.activeLineIndex !== undefined ? State.activeLineIndex : findFirstEmptyLine();
        let lineDiv = editor.querySelector(`[data-line-index="${lineIdx}"]`);
        let range = null;
        
        if (lastEditorSelection) {
            const selLineDiv = editor.querySelector(`[data-line-index="${lastEditorSelection.lineIndex}"]`);
            if (selLineDiv && editor.contains(selLineDiv) && selLineDiv.contains(lastEditorSelection.range.startContainer)) {
                lineDiv = selLineDiv;
                range = lastEditorSelection.range;
                lineIdx = lastEditorSelection.lineIndex;
            }
        }
        
        if (lineDiv) {
            if (!range) {
                range = document.createRange();
                range.selectNodeContents(lineDiv);
                range.collapse(false); // caret at the end
            }
            
            // Remove empty styles
            lineDiv.classList.remove('sp-line-empty');
            lineDiv.classList.add('sp-line-user-text');
            
            // Insert HTML
            const newRange = insertHtmlAtRange(range, htmlToInsert);
            
            // Focus and restore range
            lineDiv.focus();
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(newRange);
            
            // Update last selection
            lastEditorSelection = {
                range: newRange.cloneRange(),
                lineIndex: lineIdx
            };
            
            // Save state
            saveActivePageDOM();
            State.saveToHistory();
        }
        return;
    }

    let lineIdx = State.activeLineIndex !== undefined ? State.activeLineIndex : findFirstEmptyLine();
    const pageData = State.pages[State.currentPageIndex];
    
    // Clean shot name representation
    let cleanTerm = term;
    if (elementId === 'shot' && term.includes(': ')) {
        cleanTerm = term.split(': ')[1];
    }
    
    // Smart Scene Heading implementation
    if (elementId === 'scene_heading') {
        const types = ["INT.", "EXT.", "INT./EXT."];
        const isType = types.includes(cleanTerm);
        
        let lineData = pageData[lineIdx];
        
        if (lineData.elementId === 'scene_heading') {
            // Update existing scene heading
            let newText = "";
            if (isType) {
                newText = updateSceneType(lineData.text, cleanTerm);
            } else {
                newText = updateSceneTime(lineData.text, cleanTerm);
            }
            
            lineData.text = newText;
            renderActivePage();
            focusLine(lineIdx, false); // Focus at end
        } else {
            // Create new scene heading
            let typePart = isType ? cleanTerm : "INT.";
            let timePart = isType ? "DAY" : cleanTerm;
            
            lineData.text = `${typePart} __________ ${timePart}`;
            lineData.type = 'sub-term';
            lineData.elementId = 'scene_heading';
            
            renderActivePage();
            
            // Highlight the selection of the blank "__________"
            const lineDiv = editor.querySelector(`[data-line-index="${lineIdx}"]`);
            if (lineDiv) {
                const text = lineDiv.innerText;
                const startIdx = text.indexOf("__________");
                if (startIdx > -1) {
                    selectTextRange(lineDiv, startIdx, startIdx + 10);
                } else {
                    focusLine(lineIdx, false);
                }
            }
        }
        
        State.saveToHistory();
        return;
    }
    
    pageData[lineIdx] = {
        text: cleanTerm,
        type: 'sub-term',
        elementId: elementId
    };
    
    // Rerender page
    renderActivePage();
    
    // Move to next line
    moveToNextLine(lineIdx);
    
    State.saveToHistory();
}

// Modal handling
let activeModalAction = null;

function showModal(title, bodyHtml, confirmText, actionCallback) {
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-body').innerHTML = bodyHtml;
    const confirmBtn = document.getElementById('modal-btn-confirm');
    confirmBtn.innerText = confirmText;
    confirmBtn.style.display = ''; // Reset display style
    activeModalAction = actionCallback;
    document.getElementById('modal-project').classList.add('active');
}

function hideModal() {
    document.getElementById('modal-project').classList.remove('active');
    activeModalAction = null;
}

function confirmModalAction() {
    if (activeModalAction) {
        activeModalAction();
    }
    hideModal();
}

// Save & New dialog triggers
function createNewProject() {
    const list = JSON.parse(localStorage.getItem('1m_screenplay_projects_list') || '[]');
    if (list.length >= 3) {
        alert("Maximum limit of 3 projects reached.\nDelete an existing project before creating another.");
        return;
    }
    
    const name = prompt("Project Name");
    if (name === null) return; // Cancelled
    
    const trimmed = name.trim();
    if (!trimmed) {
        alert("Project name cannot be blank.");
        return;
    }
    
    if (list.includes(trimmed)) {
        alert(`A project named "${trimmed}" already exists.`);
        return;
    }
    
    // Auto-save current project first
    saveActivePageDOM();
    State.saveProjectLocally();
    
    // Set up new project state
    State.projectName = trimmed;
    State.pages = [createEmptyPage()];
    if (USE_FIXED_35_LINE_MODE) {
        initializeFlatLines();
    }
    State.currentPageIndex = 0;
    State.activeLineIndex = 0;
    State.favorites = [];
    State.recentItems = [];
    
    projectTitle.innerText = State.projectName;
    updatePageIndicator();
    renderActivePage();
    renderFavorites();
    renderRecentItems();
    
    // Save the new project immediately
    State.saveProjectLocally(trimmed);
    
    // Reset history stack
    State.historyStack = [];
    State.historyIndex = -1;
    State.saveToHistory();
    
    focusLine(0);
}

function showSaveAsModal() {
    const html = `
        <label>Enter Project Name:</label>
        <input type="text" id="project-save-name" class="modal-input" value="${State.projectName}">
    `;
    showModal("Save Project As", html, "Save", () => {
        const name = document.getElementById('project-save-name').value.trim();
        if (name) {
            State.projectName = name;
            projectTitle.innerText = name;
            State.saveProjectLocally(name);
        }
    });
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

function showOpenProjectModal() {
    const list = JSON.parse(localStorage.getItem('1m_screenplay_projects_list') || '[]');
    if (list.length === 0) {
        alert("No saved projects found.");
        return;
    }
    
    let html = '<div style="max-height: 250px; overflow-y:auto; display: flex; flex-direction: column; gap: 8px;">';
    list.forEach(proj => {
        const isActive = proj === State.projectName;
        const escapedProj = proj.replace(/'/g, "\\'").replace(/"/g, '&quot;');
        const safeName = escapeHtml(proj);
        html += `
            <div class="project-item-row" style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid var(--border-color); ${isActive ? 'background-color: rgba(255, 199, 44, 0.03); border-left: 3px solid var(--accent-gold);' : ''}">
                <span class="project-item-name" onclick="switchProject('${escapedProj}'); hideModal();" style="flex-grow: 1; display: flex; align-items: center; gap: 8px; cursor: pointer; color: ${isActive ? 'var(--accent-gold)' : 'var(--text-main)'}; font-weight: ${isActive ? '600' : 'normal'};">
                    <i class="fa-solid fa-file-lines"></i> ${safeName}
                </span>
                <div class="project-item-actions" style="display: flex; gap: 8px;">
                    <button class="btn-project-action" onclick="event.stopPropagation(); promptRenameProject('${escapedProj}');" title="Rename" style="background: transparent; border: none; color: var(--text-muted); cursor: pointer; padding: 4px; font-size: 0.9rem; transition: color 0.2s ease;"><i class="fa-solid fa-pen"></i></button>
                    <button class="btn-project-action delete" onclick="event.stopPropagation(); deleteProject('${escapedProj}');" title="Delete" style="background: transparent; border: none; color: var(--text-muted); cursor: pointer; padding: 4px; font-size: 0.9rem; transition: color 0.2s ease;"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
        `;
    });
    html += '</div>';

    // Show modal without confirming button
    showModal("Project Manager", html, "Close", () => {});
    document.getElementById('modal-btn-confirm').style.display = 'none';
}

function renderRecentProjectsMenu() {
    const list = JSON.parse(localStorage.getItem('1m_screenplay_projects_list') || '[]');
    const container = document.getElementById('recent-projects-list');
    container.innerHTML = "";
    
    if (list.length === 0) {
        container.innerHTML = '<span class="empty-text">No recent projects</span>';
        return;
    }
    
    // Show max 3 projects
    list.slice(-3).reverse().forEach(proj => {
        const btn = document.createElement('button');
        btn.innerText = ` ${proj}`;
        btn.insertAdjacentHTML('afterbegin', '<i class="fa-solid fa-file-lines"></i>');
        btn.addEventListener('click', () => {
            switchProject(proj);
        });
        container.appendChild(btn);
    });
}

function switchProject(name) {
    if (name === State.projectName) return;
    
    // Save current active project state first
    saveActivePageDOM();
    State.saveProjectLocally();
    
    // Load the selected project
    loadProject(name);
}

function promptRenameProject(oldName) {
    const newName = prompt("Rename project to:", oldName);
    if (newName === null) return; // Cancelled
    
    const trimmed = newName.trim();
    if (!trimmed) {
        alert("Project name cannot be blank.");
        return;
    }
    
    if (trimmed === oldName) return;
    
    const list = JSON.parse(localStorage.getItem('1m_screenplay_projects_list') || '[]');
    if (list.includes(trimmed)) {
        alert(`A project named "${trimmed}" already exists.`);
        return;
    }
    
    renameProject(oldName, trimmed);
    
    // Refresh modal if it is active
    const modal = document.getElementById('modal-project');
    if (modal && modal.classList.contains('active')) {
        showOpenProjectModal();
    }
}

function renameProject(oldName, newName) {
    const list = JSON.parse(localStorage.getItem('1m_screenplay_projects_list') || '[]');
    
    // Save current active project state first if renaming it
    if (oldName === State.projectName) {
        saveActivePageDOM();
    }
    
    const oldKey = `1m_screenplay_project_${oldName.replace(/\s+/g, '_')}`;
    const newKey = `1m_screenplay_project_${newName.replace(/\s+/g, '_')}`;
    const rawData = localStorage.getItem(oldKey);
    
    let projectData;
    if (rawData) {
        try {
            projectData = JSON.parse(rawData);
            projectData.projectName = newName;
            projectData.updatedAt = new Date().toISOString();
        } catch (e) {
            console.error(e);
        }
    }
    
    if (!projectData) {
        projectData = {
            projectName: newName,
            pages: State.pages,
            currentPageIndex: State.currentPageIndex,
            activeLineIndex: State.activeLineIndex,
            favorites: State.favorites,
            recentItems: State.recentItems,
            updatedAt: new Date().toISOString()
        };
    }
    
    localStorage.setItem(newKey, JSON.stringify(projectData));
    if (oldKey !== newKey) {
        localStorage.removeItem(oldKey);
    }
    
    const newList = list.map(name => name === oldName ? newName : name);
    localStorage.setItem('1m_screenplay_projects_list', JSON.stringify(newList));
    
    if (oldName === State.projectName) {
        State.projectName = newName;
        projectTitle.innerText = newName;
        localStorage.setItem('1m_screenplay_last_project', newName);
    }
    
    renderRecentProjectsMenu();
    showSaveStatus("Renamed");
}

function deleteProject(name) {
    if (confirm(`Delete Project?\nThis action cannot be undone.`)) {
        const list = JSON.parse(localStorage.getItem('1m_screenplay_projects_list') || '[]');
        
        // Remove storage key
        const key = `1m_screenplay_project_${name.replace(/\s+/g, '_')}`;
        localStorage.removeItem(key);
        
        // Update list
        const newList = list.filter(item => item !== name);
        localStorage.setItem('1m_screenplay_projects_list', JSON.stringify(newList));
        
        // If deleted project was active
        if (name === State.projectName) {
            if (newList.length > 0) {
                // Switch to next available project
                loadProject(newList[0]);
            } else {
                // Create new default Untitled Screenplay project
                const defaultName = "Untitled Screenplay";
                State.projectName = defaultName;
                State.pages = [createEmptyPage()];
                if (USE_FIXED_35_LINE_MODE) {
                    initializeFlatLines();
                }
                State.currentPageIndex = 0;
                State.activeLineIndex = 0;
                State.favorites = [];
                State.recentItems = [];
                
                projectTitle.innerText = defaultName;
                updatePageIndicator();
                renderActivePage();
                renderFavorites();
                renderRecentItems();
                
                State.saveProjectLocally(defaultName);
                
                State.historyStack = [];
                State.historyIndex = -1;
                State.saveToHistory();
            }
        } else {
            renderRecentProjectsMenu();
        }
        
        // Refresh modal if it is active
        const modal = document.getElementById('modal-project');
        if (modal && modal.classList.contains('active')) {
            showOpenProjectModal();
        }
        
        showSaveStatus("Deleted");
    }
}

class RenderItem {
    constructor(text, elementId, lineType, originalLineIdx, isBr = false) {
        this.text = text;
        this.elementId = elementId;
        this.lineType = lineType;
        this.originalLineIdx = originalLineIdx;
        this.isBr = isBr;
    }
}

function isStructuralLabel(text, elementId, lineType) {
    if (lineType === 'main-term') return true;
    if (['scene_heading', 'character', 'transition', 'shot', 'act'].includes(elementId)) return true;
    
    // Check for camera shot label prefixes
    const cleanText = text.trim();
    if (cleanText === 'Camera Shot:' || 
        cleanText === 'Camera Angle:' || 
        cleanText === 'Camera Movement:' || 
        cleanText === 'Special Cinematic Shot:') {
        return true;
    }
    return false;
}

function findNextContentItem(renderItems, startIdx) {
    for (let idx = startIdx; idx < renderItems.length; idx++) {
        const item = renderItems[idx];
        if (item.isBr || !item.text.trim()) continue;
        if (isStructuralLabel(item.text, item.elementId, item.lineType)) continue;
        return item;
    }
    return null;
}

function splitTextAtBoundary(text, lineType, elementId, tempScreenplay, remainingSpace) {
    if (!text.trim()) {
        return { fitText: "", remainingText: "" };
    }
    const words = text.split(/(\s+)/); // split by whitespace, preserving whitespace
    
    // Create a temporary testing lineDiv with exact classes
    const testDiv = document.createElement('div');
    testDiv.className = 'sp-line';
    testDiv.style.height = "auto";
    testDiv.style.minHeight = "auto";
    testDiv.style.maxHeight = "none";
    testDiv.style.overflow = "visible";
    testDiv.style.whiteSpace = "pre-wrap";
    testDiv.style.wordBreak = "break-word";
    testDiv.style.display = "block";
    testDiv.style.lineHeight = "inherit";
    
    if (lineType !== 'empty') {
        testDiv.classList.add(`sp-line-${lineType}`);
        if (elementId) {
            testDiv.classList.add(`sp-line-${elementId.replace('_', '-')}`);
        }
    }
    
    // Find the maximum words that fit
    let low = 0;
    let high = words.length;
    let bestFitIdx = 0;
    
    // Check if even the first word fits
    testDiv.innerHTML = words[0];
    tempScreenplay.appendChild(testDiv);
    let h = testDiv.getBoundingClientRect().height;
    tempScreenplay.removeChild(testDiv);
    
    if (h > remainingSpace) {
        return { fitText: "", remainingText: text };
    }
    
    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const testText = words.slice(0, mid).join('');
        
        testDiv.innerHTML = testText;
        tempScreenplay.appendChild(testDiv);
        h = testDiv.getBoundingClientRect().height;
        tempScreenplay.removeChild(testDiv);
        
        if (h <= remainingSpace) {
            bestFitIdx = mid;
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }
    
    if (bestFitIdx === 0) {
        return { fitText: "", remainingText: text };
    }
    
    const fitText = words.slice(0, bestFitIdx).join('');
    const remainingText = words.slice(bestFitIdx).join('');
    return { fitText, remainingText };
}

function exportToPDFWindowPrint() {
    saveActivePageDOM();
    
    const printContainer = document.getElementById('print-container');
    if (!printContainer) return;
    
    printContainer.innerHTML = "";
    
    const oldTitle = document.title;
    document.title = State.projectName;
    
    const basePageContainer = document.getElementById('page-container');
    if (basePageContainer) {
        State.pages.forEach((pageData, pageIdx) => {
            // Clone the base page container template
            const pageClone = basePageContainer.cloneNode(true);
            pageClone.id = ""; // Avoid duplicate IDs
            
            // Find screenplay content area in the clone
            const editorClone = pageClone.querySelector('.screenplay-page');
            if (editorClone) {
                editorClone.id = ""; // Avoid duplicate IDs
                
                // Render page content using the single shared page renderer helper
                renderPageIntoContainer(pageData, editorClone, false);
                
                // Apply print safety styling to cloned screenplay lines inside clone
                const lineDivs = editorClone.querySelectorAll('.sp-line');
                lineDivs.forEach(lineDiv => {
                    lineDiv.style.setProperty('height', 'auto', 'important');
                    lineDiv.style.setProperty('min-height', 'auto', 'important');
                    lineDiv.style.setProperty('max-height', 'none', 'important');
                    lineDiv.style.setProperty('overflow', 'visible', 'important');
                    lineDiv.style.setProperty('white-space', 'pre-wrap', 'important');
                    lineDiv.style.setProperty('word-break', 'break-word', 'important');
                });
                
                // Apply print safety styling to screenplay editor clone
                editorClone.style.setProperty('height', 'auto', 'important');
                editorClone.style.setProperty('min-height', 'auto', 'important');
                editorClone.style.setProperty('max-height', 'none', 'important');
                editorClone.style.setProperty('overflow', 'visible', 'important');
            }
            
            // Apply print safety styling to page container clone
            pageClone.style.setProperty('height', 'auto', 'important');
            pageClone.style.setProperty('min-height', 'var(--page-height)', 'important');
            pageClone.style.setProperty('max-height', 'none', 'important');
            pageClone.style.setProperty('overflow', 'visible', 'important');
            pageClone.style.setProperty('box-sizing', 'border-box', 'important');
            
            // Update page footer
            const footerClone = pageClone.querySelector('.page-number-footer');
            if (footerClone) {
                footerClone.innerText = pageIdx + 1;
            }
            
            printContainer.appendChild(pageClone);
        });
    }
    
    window.print();
    
    document.title = oldTitle;
    printContainer.innerHTML = "";
}

// HTML Tokenizer and Style Parser for screenplay lines
function parseHTMLToStyledChunks(htmlString, defaultStyle) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
    
    const chunks = [];
    
    function traverse(node, currentStyle) {
        if (node.nodeType === Node.TEXT_NODE) {
            if (node.nodeValue) {
                // Replace non-breaking spaces (\u00A0) with standard ASCII spaces to prevent rendering errors in Courier
                const cleanText = node.nodeValue.replace(/\u00a0/g, ' ');
                chunks.push({
                    text: cleanText,
                    ...currentStyle
                });
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            const nextStyle = { ...currentStyle };
            const tagName = node.tagName.toLowerCase();
            
            if (tagName === 'b' || tagName === 'strong') {
                nextStyle.bold = true;
            } else if (tagName === 'i' || tagName === 'em') {
                nextStyle.italic = true;
            } else if (tagName === 'u') {
                nextStyle.underline = true;
            } else if (tagName === 'span' || tagName === 'font') {
                if (node.classList.contains('text-style')) {
                    if (node.classList.contains('text-title')) {
                        nextStyle.fontSize = 36;
                        nextStyle.bold = true;
                    } else if (node.classList.contains('text-subtitle')) {
                        nextStyle.fontSize = 27;
                        nextStyle.bold = true;
                    } else if (node.classList.contains('text-heading')) {
                        nextStyle.fontSize = 22.5;
                        nextStyle.bold = true;
                    } else if (node.classList.contains('text-subheading')) {
                        nextStyle.fontSize = 18;
                        nextStyle.bold = true;
                    } else if (node.classList.contains('text-section')) {
                        nextStyle.fontSize = 15;
                        nextStyle.bold = true;
                    } else if (node.classList.contains('text-subsection')) {
                        nextStyle.fontSize = 13.5;
                        nextStyle.bold = true;
                    }
                }
                if (node.style.fontWeight === 'bold' || node.style.fontWeight === '700') {
                    nextStyle.bold = true;
                }
                if (node.style.fontStyle === 'italic') {
                    nextStyle.italic = true;
                }
                if (node.style.textDecoration && node.style.textDecoration.includes('underline')) {
                    nextStyle.underline = true;
                }
            } else if (tagName === 'br') {
                chunks.push({
                    text: '\n',
                    ...currentStyle
                });
            }
            
            for (let child of node.childNodes) {
                traverse(child, nextStyle);
            }
        }
    }
    
    traverse(tempDiv, defaultStyle || {
        bold: false,
        italic: false,
        underline: false,
        fontSize: 12,
        fontName: 'Courier'
    });
    
    return chunks;
}

// Word wrapping helper operating on styled text chunks
function wrapStyledChunks(chunks, maxWidth, doc) {
    const visualLines = [];
    let currentVisualLine = [];
    let currentLineWidth = 0;
    
    function commitLine() {
        // Strip trailing spaces from the end of the line
        if (currentVisualLine.length > 0) {
            let lastIdx = currentVisualLine.length - 1;
            while (lastIdx >= 0 && currentVisualLine[lastIdx].text.trim() === '' && currentVisualLine[lastIdx].text !== '\n') {
                currentVisualLine.splice(lastIdx, 1);
                lastIdx--;
            }
        }
        if (currentVisualLine.length > 0) {
            visualLines.push(currentVisualLine);
        } else {
            visualLines.push([{ text: '', bold: false, italic: false, underline: false, fontSize: 12, fontName: 'Courier' }]);
        }
        currentVisualLine = [];
        currentLineWidth = 0;
    }
    
    for (let chunk of chunks) {
        const tokens = chunk.text.match(/[^\s\n]+|\n|\s+/g) || [];
        for (let token of tokens) {
            if (token === '\n') {
                commitLine();
                continue;
            }
            
            const style = (chunk.bold && chunk.italic) ? 'bolditalic' : (chunk.bold ? 'bold' : (chunk.italic ? 'italic' : 'normal'));
            doc.setFont(chunk.fontName || 'Courier', style);
            doc.setFontSize(chunk.fontSize || 12);
            const tokenWidth = doc.getStringUnitWidth(token) * (chunk.fontSize || 12);
            
            const isSpaces = /^\s+$/.test(token);
            
            if (currentLineWidth + tokenWidth <= maxWidth) {
                currentVisualLine.push({
                    text: token,
                    bold: chunk.bold,
                    italic: chunk.italic,
                    underline: chunk.underline,
                    fontSize: chunk.fontSize,
                    fontName: chunk.fontName
                });
                currentLineWidth += tokenWidth;
            } else {
                if (isSpaces) {
                    commitLine();
                } else {
                    if (currentVisualLine.length > 0) {
                        commitLine();
                    }
                    if (tokenWidth <= maxWidth) {
                        currentVisualLine.push({
                            text: token,
                            bold: chunk.bold,
                            italic: chunk.italic,
                            underline: chunk.underline,
                            fontSize: chunk.fontSize,
                            fontName: chunk.fontName
                        });
                        currentLineWidth = tokenWidth;
                    } else {
                        let wordPart = '';
                        let wordPartWidth = 0;
                        for (let char of token) {
                            const charWidth = doc.getStringUnitWidth(char) * (chunk.fontSize || 12);
                            if (wordPartWidth + charWidth <= maxWidth) {
                                wordPart += char;
                                wordPartWidth += charWidth;
                            } else {
                                currentVisualLine.push({
                                    text: wordPart,
                                    bold: chunk.bold,
                                    italic: chunk.italic,
                                    underline: chunk.underline,
                                    fontSize: chunk.fontSize,
                                    fontName: chunk.fontName
                                });
                                commitLine();
                                wordPart = char;
                                wordPartWidth = charWidth;
                            }
                        }
                        if (wordPart) {
                            currentVisualLine.push({
                                text: wordPart,
                                bold: chunk.bold,
                                italic: chunk.italic,
                                underline: chunk.underline,
                                fontSize: chunk.fontSize,
                                fontName: chunk.fontName
                            });
                            currentLineWidth = wordPartWidth;
                        }
                    }
                }
            }
        }
    }
    
    if (currentVisualLine.length > 0) {
        let lastIdx = currentVisualLine.length - 1;
        while (lastIdx >= 0 && currentVisualLine[lastIdx].text.trim() === '' && currentVisualLine[lastIdx].text !== '\n') {
            currentVisualLine.splice(lastIdx, 1);
            lastIdx--;
        }
        if (currentVisualLine.length > 0) {
            visualLines.push(currentVisualLine);
        }
    }
    
    return visualLines;
}

// Dedicated PDF Layout Engine Helper
class PDFLayoutEngine {
    constructor(doc) {
        this.doc = doc;
        
        // Dynamically measure page sizes to avoid hardcoding width and height
        this.pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
        this.pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
        
        // Define margins (standard screenplay layout margins translated to points)
        this.leftMargin = 108; // 1.5in
        this.rightMargin = 72;  // 1.0in
        this.topMargin = 36;    // 0.5in
        this.bottomMargin = 756; // 10.5in
        
        // Available width for content
        this.maxWidth = this.pageWidth - this.leftMargin - this.rightMargin;
        
        this.lineHeight = 14.4; // 0.20in
        this.y = this.topMargin;
        this.pageCount = 0;
        this.disablePageBreaks = false;
    }
    
    startNewPage() {
        if (this.pageCount > 0) {
            this.doc.addPage();
        }
        this.pageCount++;
        this.y = this.topMargin;
        this.drawFooter();
    }
    
    drawFooter() {
        this.doc.setFont('Courier', 'normal');
        this.doc.setFontSize(12);
        this.doc.setTextColor(0, 0, 0);
        // Page footer at bottom right (1.0in from right edge, 0.5in from bottom edge)
        const footerX = this.pageWidth - this.rightMargin;
        this.doc.text(String(this.pageCount), footerX, this.bottomMargin, { align: 'right' });
    }
    
    advanceY(spacing) {
        if (!this.disablePageBreaks && (this.y + spacing > this.bottomMargin)) {
            this.startNewPage();
        } else if (this.disablePageBreaks && (this.y + spacing > this.bottomMargin)) {
            console.warn(
                "Mirror Export Overflow",
                this.pageCount - 1,
                this.y,
                this.bottomMargin
            );
        }
        this.y += spacing;
    }
    
    drawEmptyLine() {
        this.advanceY(this.lineHeight);
    }
    
    drawStyledLine(lineText, lineType) {
        const isMainTerm = lineType === 'main-term';
        const defaultFontSize = isMainTerm ? 13.2 : 12;
        const defaultBold = isMainTerm;
        
        const chunks = parseHTMLToStyledChunks(lineText, {
            bold: defaultBold,
            italic: false,
            underline: false,
            fontSize: defaultFontSize,
            fontName: 'Courier'
        });
        
        const visualLines = wrapStyledChunks(chunks, this.maxWidth, this.doc);
        
        for (let visualLine of visualLines) {
            let maxFontSize = 12;
            visualLine.forEach(chunk => {
                if (chunk.fontSize > maxFontSize) {
                    maxFontSize = chunk.fontSize;
                }
            });
            const spacing = maxFontSize > 12 ? maxFontSize * 1.2 : this.lineHeight;
            
            this.advanceY(spacing);
            
            let totalWidth = 0;
            visualLine.forEach(chunk => {
                const style = (chunk.bold && chunk.italic) ? 'bolditalic' : (chunk.bold ? 'bold' : (chunk.italic ? 'italic' : 'normal'));
                this.doc.setFont(chunk.fontName || 'Courier', style);
                this.doc.setFontSize(chunk.fontSize || 12);
                totalWidth += this.doc.getStringUnitWidth(chunk.text) * (chunk.fontSize || 12);
            });
            
            let currentX = this.leftMargin;
            if (isMainTerm) {
                currentX = this.leftMargin + (this.maxWidth - totalWidth) / 2;
            }
            
            for (let chunk of visualLine) {
                const style = (chunk.bold && chunk.italic) ? 'bolditalic' : (chunk.bold ? 'bold' : (chunk.italic ? 'italic' : 'normal'));
                this.doc.setFont(chunk.fontName || 'Courier', style);
                this.doc.setFontSize(chunk.fontSize || 12);
                this.doc.setTextColor(0, 0, 0);
                
                this.doc.text(chunk.text, currentX, this.y);
                
                const chunkWidth = this.doc.getStringUnitWidth(chunk.text) * (chunk.fontSize || 12);
                
                if (chunk.underline) {
                    this.doc.setLineWidth(0.5);
                    this.doc.setDrawColor(0, 0, 0);
                    this.doc.line(currentX, this.y + 1.5, currentX + chunkWidth, this.y + 1.5);
                }
                
                currentX += chunkWidth;
            }
        }
    }
}

function exportToPDF() {
    if (USE_EXPORT_MIRROR) {
        exportToPDFMirror();
    } else {
        exportToPDFLegacy();
    }
}

function exportToPDFMirror() {
    saveActivePageDOM();
    
    try {
        // Show loading state
        const exportBtn = document.getElementById('export-pdf');
        const originalText = exportBtn.innerHTML;
        exportBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating...';
        exportBtn.disabled = true;
        
        // jsPDF is loaded locally from index.html
        const { jsPDF } = window.jspdf;
        
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'pt',
            format: 'letter'
        });
        
        const pages = State.pages;
        
        const engine = new PDFLayoutEngine(doc);
        engine.disablePageBreaks = true;
        
        for (let pageIdx = 0; pageIdx < pages.length; pageIdx++) {
            const pageData = pages[pageIdx];
            
            engine.startNewPage();
            
            for (let i = 0; i < pageData.length; i++) {
                const line = pageData[i];
                if (!line) continue;
                
                if (line.type === 'empty') {
                    engine.drawEmptyLine();
                } else {
                    const rawText = line.type === 'main-term' ? line.text.toUpperCase() : line.text;
                    engine.drawStyledLine(rawText, line.type);
                }
            }
        }
        
        // Debug logging (Phase 6)
        console.log("Editor Pages:", State.pages.length);
        console.log("PDF Pages:", engine.pageCount);
        
        // Verification check (Change 3)
        if (engine.pageCount !== State.pages.length) {
            console.error("Mirror Export Verification Failed", {
                editorPages: State.pages.length,
                pdfPages: engine.pageCount
            });
            // Restore button state
            exportBtn.innerHTML = originalText;
            exportBtn.disabled = false;
            return;
        }
        
        // Save generated PDF
        console.log("Calling doc.save for", State.projectName);
        doc.save(`${State.projectName}.pdf`);
        
        // Restore button state
        exportBtn.innerHTML = originalText;
        exportBtn.disabled = false;
        
    } catch (err) {
        console.error("Mirror PDF exporter failed", err);
        // Restore button state
        const exportBtn = document.getElementById('export-pdf');
        if (exportBtn) {
            exportBtn.disabled = false;
            exportBtn.innerHTML = '<i class="fa-solid fa-file-pdf"></i> Export PDF';
        }
    }
}

function exportToPDFLegacy() {
    saveActivePageDOM();
    
    if (USE_DEDICATED_PDF_ENGINE) {
        try {
            // Show loading state
            const exportBtn = document.getElementById('export-pdf');
            const originalText = exportBtn.innerHTML;
            exportBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating...';
            exportBtn.disabled = true;
            
            // jsPDF is loaded locally from index.html
            const { jsPDF } = window.jspdf;
            
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'pt',
                format: 'letter'
            });
            
            const pages = USE_FIXED_35_LINE_MODE ? getPaginatedPages() : State.pages;
            
            const engine = new PDFLayoutEngine(doc);
            
            for (let pageIdx = 0; pageIdx < pages.length; pageIdx++) {
                const pageData = pages[pageIdx];
                
                engine.startNewPage();
                
                for (let i = 0; i < pageData.length; i++) {
                    const line = pageData[i];
                    if (!line) continue;
                    
                    if (line.type === 'empty') {
                        engine.drawEmptyLine();
                    } else {
                        const rawText = line.type === 'main-term' ? line.text.toUpperCase() : line.text;
                        engine.drawStyledLine(rawText, line.type);
                    }
                }
            }
            
            // Save generated PDF
            doc.save(`${State.projectName}.pdf`);
            
            // Restore button state
            exportBtn.innerHTML = originalText;
            exportBtn.disabled = false;
            
        } catch (err) {
            console.error("Dedicated PDF engine failed, falling back to legacy mirror", err);
            // Restore button state
            const exportBtn = document.getElementById('export-pdf');
            if (exportBtn) {
                exportBtn.disabled = false;
                exportBtn.innerHTML = '<i class="fa-solid fa-file-pdf"></i> Export PDF';
            }
            // Fall back to legacy mirror export
            exportToPDFWindowPrint();
        }
        return;
    }
    
    if (USE_PDF_MIRROR_EXPORT) {
        saveActivePageDOM();
        
        const printContainer = document.getElementById('print-container');
        if (!printContainer) return;
        
        printContainer.innerHTML = "";
        
        const oldTitle = document.title;
        document.title = State.projectName;
        
        const basePageContainer = document.getElementById('page-container');
        if (basePageContainer) {
            // Determine active editor pages (either virtual 35-line or normal pages)
            const pages = USE_FIXED_35_LINE_MODE ? getPaginatedPages() : State.pages;
            
            pages.forEach((pageData, pageIdx) => {
                // Clone the base page container template
                const pageClone = basePageContainer.cloneNode(true);
                pageClone.id = ""; // Avoid duplicate IDs
                
                // Find screenplay content area in the clone
                const editorClone = pageClone.querySelector('.screenplay-page');
                if (editorClone) {
                    editorClone.id = ""; // Avoid duplicate IDs
                    
                    // Render page content using the single shared page renderer helper
                    renderPageIntoContainer(pageData, editorClone, false, pageIdx);
                    
                    // Apply print safety styling to cloned screenplay lines inside clone
                    const lineDivs = editorClone.querySelectorAll('.sp-line');
                    lineDivs.forEach(lineDiv => {
                        lineDiv.style.setProperty('height', 'auto', 'important');
                        lineDiv.style.setProperty('min-height', 'auto', 'important');
                        lineDiv.style.setProperty('max-height', 'none', 'important');
                        lineDiv.style.setProperty('overflow', 'visible', 'important');
                        lineDiv.style.setProperty('white-space', 'pre-wrap', 'important');
                        lineDiv.style.setProperty('word-break', 'break-word', 'important');
                    });
                    
                    // Apply print safety styling to screenplay editor clone
                    editorClone.style.setProperty('height', 'auto', 'important');
                    editorClone.style.setProperty('min-height', 'auto', 'important');
                    editorClone.style.setProperty('max-height', 'none', 'important');
                    editorClone.style.setProperty('overflow', 'visible', 'important');
                }
                
                // Apply print safety styling to page container clone
                pageClone.style.setProperty('height', 'auto', 'important');
                pageClone.style.setProperty('min-height', 'var(--page-height)', 'important');
                pageClone.style.setProperty('max-height', 'none', 'important');
                pageClone.style.setProperty('overflow', 'visible', 'important');
                pageClone.style.setProperty('box-sizing', 'border-box', 'important');
                
                // Update page footer
                const footerClone = pageClone.querySelector('.page-number-footer');
                if (footerClone) {
                    footerClone.innerText = pageIdx + 1;
                }
                
                printContainer.appendChild(pageClone);
            });
        }
        
        window.print();
        
        document.title = oldTitle;
        printContainer.innerHTML = "";
        return;
    }
    
    // Otherwise fallback to legacy exporter
    exportToPDFLegacyPrintFallback();
}

function exportToPDFLegacyPrintFallback() {
    if (USE_FIXED_35_LINE_PDF_EXPORT) {
        saveActivePageDOM();
        
        const printContainer = document.getElementById('print-container');
        if (!printContainer) return;
        
        printContainer.innerHTML = "";
        
        const oldTitle = document.title;
        document.title = State.projectName;
        
        const basePageContainer = document.getElementById('page-container');
        if (basePageContainer) {
            let runningPdfPageIdx = 0;
            State.pages.forEach((pageData, editorPageIdx) => {
                // Find the index of the last non-empty line on this editor page
                let lastNonEmptyIdx = -1;
                for (let i = 49; i >= 0; i--) {
                    if (pageData[i] && pageData[i].type !== 'empty') {
                        lastNonEmptyIdx = i;
                        break;
                    }
                }
                
                // If the editor page is entirely empty, we still render 1 empty page (35 empty lines)
                const totalLinesToExport = Math.max(1, lastNonEmptyIdx + 1);
                const activeLines = pageData.slice(0, totalLinesToExport);
                
                // Segment activeLines into chunks of max 35 lines
                for (let startIdx = 0; startIdx < activeLines.length; startIdx += 35) {
                    const chunk = activeLines.slice(startIdx, startIdx + 35);
                    
                    // Pad chunk to exactly 35 lines
                    while (chunk.length < 35) {
                        chunk.push({ text: "", type: "empty", elementId: "" });
                    }
                    
                    // Clone the base page container template
                    const pageClone = basePageContainer.cloneNode(true);
                    pageClone.id = ""; // Avoid duplicate IDs
                    
                    // Find screenplay content area in the clone
                    const editorClone = pageClone.querySelector('.screenplay-page');
                    if (editorClone) {
                        editorClone.id = ""; // Avoid duplicate IDs
                        
                        // Render page content using the single shared page renderer helper
                        renderPageIntoContainer(chunk, editorClone, false, runningPdfPageIdx);
                        
                        // Apply print safety styling to cloned screenplay lines inside clone
                        const lineDivs = editorClone.querySelectorAll('.sp-line');
                        lineDivs.forEach(lineDiv => {
                            lineDiv.style.setProperty('height', 'auto', 'important');
                            lineDiv.style.setProperty('min-height', 'auto', 'important');
                            lineDiv.style.setProperty('max-height', 'none', 'important');
                            lineDiv.style.setProperty('overflow', 'visible', 'important');
                            lineDiv.style.setProperty('white-space', 'pre-wrap', 'important');
                            lineDiv.style.setProperty('word-break', 'break-word', 'important');
                        });
                        
                        // Apply print safety styling to screenplay editor clone
                        editorClone.style.setProperty('height', 'auto', 'important');
                        editorClone.style.setProperty('min-height', 'auto', 'important');
                        editorClone.style.setProperty('max-height', 'none', 'important');
                        editorClone.style.setProperty('overflow', 'visible', 'important');
                    }
                    
                    // Apply print safety styling to page container clone
                    pageClone.style.setProperty('height', 'auto', 'important');
                    pageClone.style.setProperty('min-height', 'var(--page-height)', 'important');
                    pageClone.style.setProperty('max-height', 'none', 'important');
                    pageClone.style.setProperty('overflow', 'visible', 'important');
                    pageClone.style.setProperty('box-sizing', 'border-box', 'important');
                    
                    // Update page footer
                    const footerClone = pageClone.querySelector('.page-number-footer');
                    if (footerClone) {
                        footerClone.innerText = runningPdfPageIdx + 1;
                    }
                    
                    printContainer.appendChild(pageClone);
                    runningPdfPageIdx++;
                }
            });
        }
        
        window.print();
        
        document.title = oldTitle;
        printContainer.innerHTML = "";
        return;
    }
    
    if (typeof USE_EDITOR_MIRROR_EXPORT !== 'undefined' && USE_EDITOR_MIRROR_EXPORT) {
        exportToPDFWindowPrint();
        return;
    }
    
    saveActivePageDOM();
    
    const printContainer = document.getElementById('print-container');
    if (!printContainer) return;
    
    printContainer.innerHTML = "";
    
    const oldTitle = document.title;
    document.title = State.projectName;
    
    // Create off-screen measurement container
    const measureDiv = document.createElement('div');
    measureDiv.style.position = 'absolute';
    measureDiv.style.left = '-9999px';
    measureDiv.style.top = '0';
    measureDiv.style.width = '8.5in';
    document.body.appendChild(measureDiv);
    
    // Measure usable page height using current styles
    const tempPage = document.createElement('div');
    tempPage.className = 'page-container';
    tempPage.style.boxShadow = 'none';
    tempPage.style.margin = '0';
    tempPage.style.width = '8.5in';
    tempPage.style.height = '11in';
    tempPage.style.padding = '0.5in 1.0in 0.5in 1.5in';
    tempPage.style.boxSizing = 'border-box';
    tempPage.style.display = 'flex';
    tempPage.style.flexDirection = 'column';
    
    const tempScreenplay = document.createElement('div');
    tempScreenplay.className = 'screenplay-page';
    tempScreenplay.style.flex = '1';
    tempScreenplay.style.display = 'flex';
    tempScreenplay.style.flexDirection = 'column';
    tempScreenplay.style.height = '100%';
    
    tempPage.appendChild(tempScreenplay);
    measureDiv.appendChild(tempPage);
    
    const screenplayPageRect = tempScreenplay.getBoundingClientRect();
    const usablePageHeight = screenplayPageRect.height || 960;
    const maxUsableHeight = usablePageHeight - 25; // 25px safety buffer
    
    let runningPageNumber = 1;
    
    State.pages.forEach((pageData, pageIdx) => {
        // Find the index of the last non-empty line
        let lastNonEmptyIdx = 0;
        for (let i = 49; i >= 0; i--) {
            if (pageData[i] && pageData[i].type !== 'empty') {
                lastNonEmptyIdx = i;
                break;
            }
        }
        
        // Build flat render items list
        const renderItems = [];
        for (let i = 0; i <= lastNonEmptyIdx; i++) {
            const lineData = pageData[i];
            if (lineData.type === 'empty') {
                renderItems.push(new RenderItem("", "", "empty", i, true));
            } else {
                const parts = lineData.text.split(/<br\s*\/?>/gi);
                parts.forEach((part, partIdx) => {
                    renderItems.push(new RenderItem(part, lineData.elementId, lineData.type, i));
                    if (partIdx < parts.length - 1) {
                        renderItems.push(new RenderItem("", lineData.elementId, lineData.type, i, true));
                    }
                });
            }
        }
        
        let pageContainer = document.createElement('div');
        pageContainer.className = 'page-container';
        pageContainer.style.setProperty('height', 'auto', 'important');
        pageContainer.style.setProperty('min-height', 'var(--page-height)', 'important');
        pageContainer.style.setProperty('max-height', 'none', 'important');
        pageContainer.style.setProperty('overflow', 'visible', 'important');
        
        let screenplayPage = document.createElement('div');
        screenplayPage.className = 'screenplay-page';
        pageContainer.appendChild(screenplayPage);
        
        let currentY = 0;
        
        for (let itemIdx = 0; itemIdx < renderItems.length; itemIdx++) {
            const item = renderItems[itemIdx];
            
            // Create DOM element for measurement and rendering
            const lineDiv = document.createElement('div');
            lineDiv.className = 'sp-line';
            lineDiv.style.height = "auto";
            lineDiv.style.minHeight = "auto";
            lineDiv.style.maxHeight = "none";
            lineDiv.style.overflow = "visible";
            lineDiv.style.whiteSpace = "pre-wrap";
            lineDiv.style.wordBreak = "break-word";
            lineDiv.style.display = "block";
            lineDiv.style.lineHeight = "inherit";
            
            if (item.isBr) {
                lineDiv.classList.add('sp-line-empty');
                lineDiv.innerHTML = '<br>';
            } else {
                if (item.lineType !== 'empty') {
                    lineDiv.classList.add(`sp-line-${item.lineType}`);
                    if (item.elementId) {
                        lineDiv.classList.add(`sp-line-${item.elementId.replace('_', '-')}`);
                    }
                }
                lineDiv.innerHTML = item.text;
            }
            
            // Measure line height off-screen
            tempScreenplay.appendChild(lineDiv);
            const lineHeight = lineDiv.getBoundingClientRect().height;
            tempScreenplay.removeChild(lineDiv);
            
            // 1. Lookahead pairing for structural labels to keep them with their content
            const isLabel = isStructuralLabel(item.text, item.elementId, item.lineType) && !item.isBr;
            if (isLabel && currentY > 0) {
                const nextContent = findNextContentItem(renderItems, itemIdx + 1);
                if (nextContent) {
                    const testContentDiv = document.createElement('div');
                    testContentDiv.className = 'sp-line';
                    testContentDiv.style.height = "auto";
                    testContentDiv.style.minHeight = "auto";
                    testContentDiv.style.maxHeight = "none";
                    testContentDiv.style.overflow = "visible";
                    testContentDiv.style.whiteSpace = "pre-wrap";
                    testContentDiv.style.wordBreak = "break-word";
                    testContentDiv.style.display = "block";
                    testContentDiv.style.lineHeight = "inherit";
                    
                    if (nextContent.lineType !== 'empty') {
                        testContentDiv.classList.add(`sp-line-${nextContent.lineType}`);
                        if (nextContent.elementId) {
                            testContentDiv.classList.add(`sp-line-${nextContent.elementId.replace('_', '-')}`);
                        }
                    }
                    testContentDiv.innerHTML = nextContent.text;
                    
                    tempScreenplay.appendChild(testContentDiv);
                    const contentHeight = testContentDiv.getBoundingClientRect().height;
                    tempScreenplay.removeChild(testContentDiv);
                    
                    if (currentY + lineHeight + contentHeight > maxUsableHeight) {
                        // Combined label and content exceed page: force new page
                        const footer = document.createElement('div');
                        footer.className = 'page-number-footer';
                        footer.innerText = runningPageNumber;
                        pageContainer.appendChild(footer);
                        printContainer.appendChild(pageContainer);
                        
                        runningPageNumber++;
                        
                        pageContainer = document.createElement('div');
                        pageContainer.className = 'page-container';
                        pageContainer.style.setProperty('height', 'auto', 'important');
                        pageContainer.style.setProperty('min-height', 'var(--page-height)', 'important');
                        pageContainer.style.setProperty('max-height', 'none', 'important');
                        pageContainer.style.setProperty('overflow', 'visible', 'important');
                        
                        screenplayPage = document.createElement('div');
                        screenplayPage.className = 'screenplay-page';
                        pageContainer.appendChild(screenplayPage);
                        
                        currentY = 0;
                    }
                }
            }
            
            // 2. Normal fit check and word-splitting for long content
            if (currentY + lineHeight > maxUsableHeight && currentY > 0) {
                const hasHtmlTags = /<[a-z/][^>]*>/i.test(item.text);
                
                if (!hasHtmlTags && !item.isBr && item.text.trim()) {
                    // Try splitting the plain text block word-by-word
                    const remainingSpace = maxUsableHeight - currentY;
                    const { fitText, remainingText } = splitTextAtBoundary(item.text, item.lineType, item.elementId, tempScreenplay, remainingSpace);
                    
                    if (fitText && remainingText) {
                        lineDiv.innerHTML = fitText;
                        screenplayPage.appendChild(lineDiv);
                        
                        // Render page footer for completed page
                        const footer = document.createElement('div');
                        footer.className = 'page-number-footer';
                        footer.innerText = runningPageNumber;
                        pageContainer.appendChild(footer);
                        printContainer.appendChild(pageContainer);
                        
                        runningPageNumber++;
                        
                        // Create a new print page
                        pageContainer = document.createElement('div');
                        pageContainer.className = 'page-container';
                        pageContainer.style.setProperty('height', 'auto', 'important');
                        pageContainer.style.setProperty('min-height', 'var(--page-height)', 'important');
                        pageContainer.style.setProperty('max-height', 'none', 'important');
                        pageContainer.style.setProperty('overflow', 'visible', 'important');
                        
                        screenplayPage = document.createElement('div');
                        screenplayPage.className = 'screenplay-page';
                        pageContainer.appendChild(screenplayPage);
                        
                        currentY = 0;
                        
                        // Insert the remaining text back into queue
                        renderItems.splice(itemIdx + 1, 0, new RenderItem(remainingText, item.elementId, item.lineType, item.originalLineIdx));
                        continue;
                    }
                }
                
                // If it contains HTML, is a BR, or fits nothing: treat as atomic and wrap whole item to new page
                const footer = document.createElement('div');
                footer.className = 'page-number-footer';
                footer.innerText = runningPageNumber;
                pageContainer.appendChild(footer);
                printContainer.appendChild(pageContainer);
                
                runningPageNumber++;
                
                pageContainer = document.createElement('div');
                pageContainer.className = 'page-container';
                pageContainer.style.setProperty('height', 'auto', 'important');
                pageContainer.style.setProperty('min-height', 'var(--page-height)', 'important');
                pageContainer.style.setProperty('max-height', 'none', 'important');
                pageContainer.style.setProperty('overflow', 'visible', 'important');
                
                screenplayPage = document.createElement('div');
                screenplayPage.className = 'screenplay-page';
                pageContainer.appendChild(screenplayPage);
                
                currentY = 0;
            }
            
            screenplayPage.appendChild(lineDiv);
            currentY += lineHeight;
        }
        
        // Render footer for last print page of this editor page
        const footer = document.createElement('div');
        footer.className = 'page-number-footer';
        footer.innerText = runningPageNumber;
        pageContainer.appendChild(footer);
        printContainer.appendChild(pageContainer);
        
        runningPageNumber++;
    });
    
    // Clean up measurement container
    document.body.removeChild(measureDiv);
    
    window.print();
    
    document.title = oldTitle;
    printContainer.innerHTML = "";
}

function exportToTXT() {
    saveActivePageDOM();
    let outputText = "";
    State.pages.forEach((page, pageIdx) => {
        outputText += `=================== PAGE ${pageIdx + 1} ===================\n\n`;
        page.forEach(line => {
            const text = stripHtml(line.text);
            if (line.type === 'main-term') {
                const pad = Math.max(0, Math.floor((60 - text.length) / 2));
                outputText += " ".repeat(pad) + text.toUpperCase() + "\n";
            } else if (line.type !== 'empty') {
                outputText += text + "\n";
            } else {
                outputText += "\n";
            }
        });
        outputText += "\n\n";
    });

    downloadFile(outputText, `${State.projectName}.txt`, 'text/plain');
}

function exportToDOCX() {
    saveActivePageDOM();
    let htmlContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
        <title>${State.projectName}</title>
        <style>
            body { font-family: 'Courier New', Courier, monospace; font-size: 12pt; color: #000000; margin: 0; padding: 0; }
            .page-container { width: 8.5in; height: 11in; padding: 0.5in 1.0in 0.5in 1.5in; box-sizing: border-box; }
            .sp-main-term { text-align: center; font-weight: bold; font-size: 13.2pt; text-transform: uppercase; margin: 0; padding: 0 4px; line-height: 14.4pt; }
            .sp-sub-term { text-align: left; font-size: 12pt; font-weight: normal; margin: 0; padding: 0 4px; line-height: 14.4pt; }
            .sp-user-text { text-align: left; font-size: 12pt; font-weight: normal; margin: 0; padding: 0 4px; line-height: 14.4pt; }
            .sp-line-empty { margin: 0; padding: 0 4px; line-height: 14.4pt; height: 14.4pt; }
            .page-break { page-break-after: always; }
            .text-style { font-family: 'Courier New', Courier, monospace; display: inline; }
            .text-title { font-size: 48px; font-weight: bold; }
            .text-subtitle { font-size: 36px; font-weight: 600; }
            .text-heading { font-size: 30px; font-weight: 600; }
            .text-subheading { font-size: 24px; font-weight: 600; }
            .text-section { font-size: 20px; font-weight: 600; }
            .text-subsection { font-size: 18px; font-weight: 500; }
        </style>
        </head>
        <body>
    `;

    State.pages.forEach((page, idx) => {
        htmlContent += `<div class="page-container">`;
        page.forEach(line => {
            if (line.type === 'main-term') {
                htmlContent += `<div class="sp-main-term">${line.text}</div>`;
            } else if (line.type !== 'empty') {
                htmlContent += `<div class="sp-sub-term">${line.text}</div>`;
            } else {
                htmlContent += `<div class="sp-line-empty"><br></div>`;
            }
        });
        htmlContent += `</div>`;
        if (idx < State.pages.length - 1) {
            htmlContent += `<div class="page-break"></div>`;
        }
    });

    htmlContent += `</body></html>`;
    downloadFile(htmlContent, `${State.projectName}.doc`, 'application/msword');
}

function downloadFile(content, fileName, contentType) {
    const a = document.createElement("a");
    const file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

// Zoom System Configuration
const ZOOM_LEVELS = [0.5, 0.75, 0.9, 1.0, 1.1, 1.25, 1.5];
let currentZoomIndex = 3; // 1.0 (100%) by default

function initZoom() {
    const savedZoom = localStorage.getItem('1m_screenplay_zoom_level');
    if (savedZoom) {
        const parsed = parseFloat(savedZoom);
        const idx = ZOOM_LEVELS.indexOf(parsed);
        if (idx !== -1) {
            currentZoomIndex = idx;
        }
    }
    updateZoom();
}

function updateZoom() {
    const zoomFactor = ZOOM_LEVELS[currentZoomIndex];
    const viewport = document.querySelector('.page-viewport');
    if (viewport) {
        viewport.style.setProperty('--zoom-factor', zoomFactor);
    }
    const label = document.getElementById('zoom-value');
    if (label) {
        label.innerText = `${Math.round(zoomFactor * 100)}%`;
    }
    localStorage.setItem('1m_screenplay_zoom_level', zoomFactor);
}

function zoomIn() {
    if (currentZoomIndex < ZOOM_LEVELS.length - 1) {
        currentZoomIndex++;
        updateZoom();
    }
}

function zoomOut() {
    if (currentZoomIndex > 0) {
        currentZoomIndex--;
        updateZoom();
    }
}

function resetZoom() {
    currentZoomIndex = ZOOM_LEVELS.indexOf(1.0);
    updateZoom();
}

// =========================================================================
// RICH TEXT STYLING SYSTEM
// =========================================================================

let lastActiveRange = null;
let lastEditorSelection = null;

// Track active selection range inside screenplay editor
document.addEventListener('selectionchange', () => {
    const sel = window.getSelection();
    if (sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        let container = range.commonAncestorContainer;
        if (container.nodeType !== Node.ELEMENT_NODE) {
            container = container.parentElement;
        }
        
        let startNode = range.startContainer;
        if (startNode.nodeType !== Node.ELEMENT_NODE) {
            startNode = startNode.parentElement;
        }
        const editorLine = startNode ? startNode.closest('.sp-line') : null;
        if (editorLine && editorLine.closest('#screenplay-editor')) {
            const lineIdx = parseInt(editorLine.getAttribute('data-line-index'), 10);
            lastEditorSelection = {
                range: range.cloneRange(),
                lineIndex: lineIdx
            };
        }

        if (!range.collapsed) {
            if (container && container.closest('#screenplay-editor')) {
                lastActiveRange = range.cloneRange();
            }
        }
        
        // Update the dropdown value to match styling at the caret/selection
        if (container && container.closest('#screenplay-editor')) {
            updateStyleDropdownVal();
        }
    }
});

// Update style dropdown selection based on current selection/cursor position
function updateStyleDropdownVal() {
    const select = document.getElementById('select-text-style');
    if (!select) return;
    
    const sel = window.getSelection();
    if (!sel.rangeCount) {
        select.value = 'body';
        return;
    }
    
    let node = sel.anchorNode;
    if (!node) {
        select.value = 'body';
        return;
    }
    
    if (node.nodeType !== Node.ELEMENT_NODE) {
        node = node.parentElement;
    }
    
    const styleSpan = node.closest('.text-style');
    if (styleSpan) {
        const classes = styleSpan.classList;
        for (let cls of classes) {
            if (cls.startsWith('text-')) {
                const styleName = cls.substring(5); // e.g. 'title', 'heading'
                if (['title', 'subtitle', 'heading', 'subheading', 'section', 'subsection', 'body'].includes(styleName)) {
                    select.value = styleName;
                    return;
                }
            }
        }
    }
    select.value = 'body';
}

// Wrap selection with styled span element
function applyTextStyle(styleName) {
    const sel = window.getSelection();
    let range = null;
    
    if (sel.rangeCount > 0 && !sel.getRangeAt(0).collapsed) {
        range = sel.getRangeAt(0);
    } else if (lastActiveRange) {
        range = lastActiveRange;
    }
    
    if (!range) return; // No selection to style
    
    // Ensure the range is selected
    sel.removeAllRanges();
    sel.addRange(range);
    
    let parentLine = range.commonAncestorContainer;
    if (parentLine.nodeType !== Node.ELEMENT_NODE) {
        parentLine = parentLine.parentElement;
    }
    parentLine = parentLine.closest('.sp-line');
    if (!parentLine) return; // Must be inside editor
    
    // Extract range content
    const fragment = range.extractContents();
    
    // Clean up existing nested style spans inside the extracted content
    const existingSpans = fragment.querySelectorAll('.text-style');
    existingSpans.forEach(span => {
        const parent = span.parentNode;
        while (span.firstChild) {
            parent.insertBefore(span.firstChild, span);
        }
        parent.removeChild(span);
    });
    
    if (styleName === 'body') {
        // Return to body text by inserting the unwrapped content directly
        range.insertNode(fragment);
        sel.removeAllRanges();
        lastActiveRange = null;
    } else {
        // Create new styled span wrapper
        const span = document.createElement('span');
        span.className = `text-style text-${styleName}`;
        span.appendChild(fragment);
        
        range.insertNode(span);
        
        // Select the newly wrapped node so selection persists
        const newRange = document.createRange();
        newRange.selectNodeContents(span);
        sel.removeAllRanges();
        sel.addRange(newRange);
        lastActiveRange = newRange.cloneRange();
    }
    
    // Save to DOM, LocalStorage and history stack
    saveActivePageDOM();
    State.saveToHistory();
}

// Helper to strip HTML tags
function stripHtml(html) {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html.replace(/<br\s*\/?>/gi, '\n');
    return tmp.textContent || tmp.innerText || "";
}
