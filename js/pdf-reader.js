// PDF Reader - قارئ الكتب الاحترافي
// ========================================

// PDF.js Configuration
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// Global Variables
let pdfDoc = null;
let pageNum = 1;
let pageRendering = false;
let pageNumPending = null;
let scale = 1.5;
let currentBookId = null;
let isDarkMode = false;

// DOM Elements
const pdfReader = document.getElementById('pdfReader');
const pdfCanvas = document.getElementById('pdfCanvas');
const pdfLoading = document.getElementById('pdfLoading');
const pdfBookTitle = document.getElementById('pdfBookTitle');
const pdfPageInput = document.getElementById('pdfPageInput');
const pdfTotalPages = document.getElementById('pdfTotalPages');
const pdfProgressFill = document.getElementById('pdfProgressFill');
const pdfZoomLevel = document.getElementById('pdfZoomLevel');

// Buttons
const pdfClose = document.getElementById('pdfClose');
const pdfPrevPage = document.getElementById('pdfPrevPage');
const pdfNextPage = document.getElementById('pdfNextPage');
const pdfZoomIn = document.getElementById('pdfZoomIn');
const pdfZoomOut = document.getElementById('pdfZoomOut');
const pdfDarkMode = document.getElementById('pdfDarkMode');
const pdfFullscreen = document.getElementById('pdfFullscreen');
const pdfDownload = document.getElementById('pdfDownload');

// Canvas Context
const ctx = pdfCanvas.getContext('2d');

/**
 * Render a specific page
 */
function renderPage(num) {
    pageRendering = true;
    pdfLoading.classList.remove('hidden');

    pdfDoc.getPage(num).then(function(page) {
        const viewport = page.getViewport({ scale: scale });
        pdfCanvas.height = viewport.height;
        pdfCanvas.width = viewport.width;

        const renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };

        const renderTask = page.render(renderContext);

        renderTask.promise.then(function() {
            pageRendering = false;
            pdfLoading.classList.add('hidden');

            if (pageNumPending !== null) {
                renderPage(pageNumPending);
                pageNumPending = null;
            }

            // Update UI
            updatePageInfo();
            updateProgress();
            saveLastPage();
        });
    });
}

/**
 * Queue page rendering
 */
function queueRenderPage(num) {
    if (pageRendering) {
        pageNumPending = num;
    } else {
        renderPage(num);
    }
}

/**
 * Go to previous page
 */
function onPrevPage() {
    if (pageNum <= 1) {
        return;
    }
    pageNum--;
    queueRenderPage(pageNum);
}

/**
 * Go to next page
 */
function onNextPage() {
    if (pageNum >= pdfDoc.numPages) {
        return;
    }
    pageNum++;
    queueRenderPage(pageNum);
}

/**
 * Update page info display
 */
function updatePageInfo() {
    pdfPageInput.value = pageNum;
    pdfTotalPages.textContent = pdfDoc.numPages;
    
    // Update button states
    pdfPrevPage.disabled = pageNum <= 1;
    pdfNextPage.disabled = pageNum >= pdfDoc.numPages;
}

/**
 * Update progress bar
 */
function updateProgress() {
    const progress = (pageNum / pdfDoc.numPages) * 100;
    pdfProgressFill.style.width = progress + '%';
}

/**
 * Zoom In
 */
function zoomIn() {
    if (scale < 3) {
        scale += 0.25;
        updateZoomLevel();
        queueRenderPage(pageNum);
    }
}

/**
 * Zoom Out
 */
function zoomOut() {
    if (scale > 0.5) {
        scale -= 0.25;
        updateZoomLevel();
        queueRenderPage(pageNum);
    }
}

/**
 * Update zoom level display
 */
function updateZoomLevel() {
    const percentage = Math.round(scale * 100);
    pdfZoomLevel.textContent = percentage + '%';
}

/**
 * Toggle Dark Mode
 */
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    pdfReader.classList.toggle('dark-mode');
    
    const icon = pdfDarkMode.querySelector('i');
    if (isDarkMode) {
        icon.className = 'fas fa-sun';
        pdfDarkMode.title = 'الوضع النهاري';
    } else {
        icon.className = 'fas fa-moon';
        pdfDarkMode.title = 'الوضع الليلي';
    }
}

/**
 * Toggle Fullscreen
 */
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        pdfReader.requestFullscreen().catch(err => {
            console.log('خطأ في وضع ملء الشاشة:', err);
        });
        pdfFullscreen.querySelector('i').className = 'fas fa-compress';
        pdfFullscreen.title = 'الخروج من ملء الشاشة';
    } else {
        document.exitFullscreen();
        pdfFullscreen.querySelector('i').className = 'fas fa-expand';
        pdfFullscreen.title = 'ملء الشاشة';
    }
}

/**
 * Download current book
 */
function downloadCurrentBook() {
    if (currentBookId) {
        downloadBook(currentBookId);
    }
}

/**
 * Close PDF Reader
 */
function closePdfReader() {
    pdfReader.classList.remove('active');
    pdfDoc = null;
    pageNum = 1;
    scale = 1.5;
    currentBookId = null;
    
    // Reset dark mode
    if (isDarkMode) {
        toggleDarkMode();
    }
    
    // Exit fullscreen if active
    if (document.fullscreenElement) {
        document.exitFullscreen();
    }
}

/**
 * Save last read page to localStorage
 */
function saveLastPage() {
    if (currentBookId) {
        localStorage.setItem(`book_${currentBookId}_page`, pageNum);
    }
}

/**
 * Load last read page from localStorage
 */
function loadLastPage() {
    if (currentBookId) {
        const savedPage = localStorage.getItem(`book_${currentBookId}_page`);
        if (savedPage) {
            return parseInt(savedPage);
        }
    }
    return 1;
}

/**
 * Open PDF Reader with book
 */
function openPdfReader(bookId) {
    const book = booksData.find(b => b.id === bookId);
    
    if (!book) {
        alert('عذراً، لم يتم العثور على الكتاب!');
        return;
    }

    if (!book.pdfFile) {
        alert('عذراً، ملف PDF غير متوفر لهذا الكتاب حالياً.\n\nيرجى إضافة ملف PDF في مجلد books/');
        return;
    }

    // Set current book
    currentBookId = bookId;
    pdfBookTitle.textContent = book.title;

    // Show reader
    pdfReader.classList.add('active');
    pdfLoading.classList.remove('hidden');

    // Load PDF
    const loadingTask = pdfjsLib.getDocument(book.pdfFile);
    
    loadingTask.promise.then(function(pdf) {
        pdfDoc = pdf;
        
        // Load last read page or start from page 1
        pageNum = loadLastPage();
        
        // Render first page
        renderPage(pageNum);
        
    }).catch(function(error) {
        console.error('خطأ في تحميل PDF:', error);
        pdfLoading.classList.add('hidden');
        alert('عذراً، حدث خطأ في تحميل الكتاب.\n\nتأكد من وجود ملف PDF في المسار الصحيح.');
        closePdfReader();
    });
}

/**
 * Go to specific page
 */
function goToPage() {
    const pageNumber = parseInt(pdfPageInput.value);
    
    if (pageNumber >= 1 && pageNumber <= pdfDoc.numPages) {
        pageNum = pageNumber;
        queueRenderPage(pageNum);
    } else {
        pdfPageInput.value = pageNum;
    }
}

// Event Listeners
// ================

// Close button
pdfClose.addEventListener('click', closePdfReader);

// Navigation buttons
pdfPrevPage.addEventListener('click', onPrevPage);
pdfNextPage.addEventListener('click', onNextPage);

// Zoom buttons
pdfZoomIn.addEventListener('click', zoomIn);
pdfZoomOut.addEventListener('click', zoomOut);

// Dark mode toggle
pdfDarkMode.addEventListener('click', toggleDarkMode);

// Fullscreen toggle
pdfFullscreen.addEventListener('click', toggleFullscreen);

// Download button
pdfDownload.addEventListener('click', downloadCurrentBook);

// Page input
pdfPageInput.addEventListener('change', goToPage);
pdfPageInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        goToPage();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (!pdfReader.classList.contains('active')) return;
    
    switch(e.key) {
        case 'ArrowLeft':
            onNextPage();
            break;
        case 'ArrowRight':
            onPrevPage();
            break;
        case 'Escape':
            closePdfReader();
            break;
        case '+':
        case '=':
            zoomIn();
            break;
        case '-':
            zoomOut();
            break;
    }
});

// Mouse wheel zoom (Ctrl + Scroll)
pdfCanvas.addEventListener('wheel', function(e) {
    if (e.ctrlKey) {
        e.preventDefault();
        if (e.deltaY < 0) {
            zoomIn();
        } else {
            zoomOut();
        }
    }
});

// Update readBook function in script.js
window.readBook = function(bookId) {
    openPdfReader(bookId);
};

console.log('✅ قارئ PDF جاهز للاستخدام!');