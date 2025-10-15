// Global Variables
let currentFilter = 'all';
let displayedBooks = 9;
const booksPerLoad = 9;

// DOM Elements
const searchToggle = document.getElementById('searchToggle');
const searchOverlay = document.getElementById('searchOverlay');
const closeSearch = document.getElementById('closeSearch');
const searchInput = document.getElementById('searchInput');
const menuToggle = document.getElementById('menuToggle');
const booksGrid = document.getElementById('booksGrid');
const loadMoreBtn = document.getElementById('loadMore');
const bookModal = document.getElementById('bookModal');
const closeModal = document.getElementById('closeModal');
const modalBody = document.getElementById('modalBody');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    loadBooks();
    setupEventListeners();
    setupSmoothScroll();
    setupCategoryCards();
    setupFilterTabs();
}

// Event Listeners
function setupEventListeners() {
    // Search Toggle
    searchToggle.addEventListener('click', () => {
        searchOverlay.classList.add('active');
        searchInput.focus();
    });

    closeSearch.addEventListener('click', () => {
        searchOverlay.classList.remove('active');
    });

    // Close search on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchOverlay.classList.remove('active');
            bookModal.classList.remove('active');
        }
    });

    // Search functionality
    searchInput.addEventListener('input', handleSearch);

    // Menu Toggle (Mobile)
    menuToggle.addEventListener('click', toggleMobileMenu);

    // Load More Button
    loadMoreBtn.addEventListener('click', loadMoreBooks);

    // Modal Close
    closeModal.addEventListener('click', () => {
        bookModal.classList.remove('active');
    });

    // Close modal on outside click
    bookModal.addEventListener('click', (e) => {
        if (e.target === bookModal) {
            bookModal.classList.remove('active');
        }
    });
}

// Smooth Scroll
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update active nav link
                document.querySelectorAll('.nav a').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });
}

// Category Cards Click
function setupCategoryCards() {
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            currentFilter = category;
            displayedBooks = booksPerLoad;
            
            // Update filter tabs
            document.querySelectorAll('.filter-tab').forEach(tab => {
                tab.classList.remove('active');
                if (tab.getAttribute('data-filter') === category) {
                    tab.classList.add('active');
                }
            });
            
            loadBooks();
            
            // Scroll to books section
            document.getElementById('books').scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}

// Filter Tabs
function setupFilterTabs() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            filterTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Update filter
            currentFilter = this.getAttribute('data-filter');
            displayedBooks = booksPerLoad;
            
            // Reload books
            loadBooks();
        });
    });
}

// Load Books
function loadBooks() {
    const filteredBooks = currentFilter === 'all' 
        ? booksData 
        : booksData.filter(book => book.category === currentFilter);
    
    const booksToShow = filteredBooks.slice(0, displayedBooks);
    
    booksGrid.innerHTML = '';
    
    booksToShow.forEach((book, index) => {
        const bookCard = createBookCard(book);
        booksGrid.appendChild(bookCard);
        
        // Add animation delay
        setTimeout(() => {
            bookCard.style.opacity = '1';
            bookCard.style.transform = 'translateY(0)';
        }, index * 50);
    });
    
    // Show/Hide Load More button
    if (displayedBooks >= filteredBooks.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'inline-block';
    }
}

// Create Book Card
function createBookCard(book) {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.5s ease';
    
    card.innerHTML = `
        <div class="book-cover">
            <img src="${book.cover}" alt="${book.title}">
            ${book.badge ? `<span class="book-badge">${book.badge}</span>` : ''}
        </div>
        <div class="book-info">
            <div class="book-category">${book.categoryName}</div>
            <h3 class="book-title">${book.title}</h3>
            <p class="book-author">${book.author}</p>
            <div class="book-meta">
                <div class="book-pages">
                    <i class="fas fa-file-alt"></i>
                    <span>${book.pages} صفحة</span>
                </div>
                <div class="book-rating">
                    <i class="fas fa-star"></i>
                    <span>${book.rating}</span>
                </div>
            </div>
            <div class="book-actions">
                <button class="btn-read" onclick="openBookModal(${book.id})">
                    <i class="fas fa-book-open"></i>
                    قراءة
                </button>
                <button class="btn-download" onclick="downloadBook(${book.id})">
                    <i class="fas fa-download"></i>
                    تحميل
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Load More Books
function loadMoreBooks() {
    displayedBooks += booksPerLoad;
    loadBooks();
}

// Search Handler
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        loadBooks();
        return;
    }
    
    const filteredBooks = booksData.filter(book => {
        return book.title.toLowerCase().includes(searchTerm) ||
               book.author.toLowerCase().includes(searchTerm) ||
               book.categoryName.toLowerCase().includes(searchTerm) ||
               book.description.toLowerCase().includes(searchTerm);
    });
    
    booksGrid.innerHTML = '';
    
    if (filteredBooks.length === 0) {
        booksGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <i class="fas fa-search" style="font-size: 4rem; color: #ccc; margin-bottom: 1rem;"></i>
                <h3 style="color: #666;">لم يتم العثور على نتائج</h3>
                <p style="color: #999;">جرب البحث بكلمات مختلفة</p>
            </div>
        `;
        loadMoreBtn.style.display = 'none';
        return;
    }
    
    filteredBooks.forEach((book, index) => {
        const bookCard = createBookCard(book);
        booksGrid.appendChild(bookCard);
        
        setTimeout(() => {
            bookCard.style.opacity = '1';
            bookCard.style.transform = 'translateY(0)';
        }, index * 50);
    });
    
    loadMoreBtn.style.display = 'none';
}

// Open Book Modal
function openBookModal(bookId) {
    const book = booksData.find(b => b.id === bookId);
    if (!book) return;
    
    modalBody.innerHTML = `
        <div class="modal-book-details">
            <div class="modal-book-cover">
                <img src="${book.cover}" alt="${book.title}">
            </div>
            <div class="modal-book-info">
                <h2>${book.title}</h2>
                <p class="author"><i class="fas fa-user"></i> ${book.author}</p>
                <span class="category">${book.categoryName}</span>
                <p class="description">${book.description}</p>
                
                <div class="modal-book-meta">
                    <div class="meta-item">
                        <i class="fas fa-file-alt"></i>
                        <div class="label">عدد الصفحات</div>
                        <div class="value">${book.pages}</div>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-star"></i>
                        <div class="label">التقييم</div>
                        <div class="value">${book.rating}</div>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-download"></i>
                        <div class="label">التحميلات</div>
                        <div class="value">${book.downloads.toLocaleString()}</div>
                    </div>
                </div>
                
                <div class="modal-book-meta">
                    <div class="meta-item">
                        <i class="fas fa-calendar"></i>
                        <div class="label">سنة النشر</div>
                        <div class="value">${book.publishYear}</div>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-building"></i>
                        <div class="label">الناشر</div>
                        <div class="value">${book.publisher}</div>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-language"></i>
                        <div class="label">اللغة</div>
                        <div class="value">العربية</div>
                    </div>
                </div>
                
                <div class="modal-actions">
                    <button class="btn-read" onclick="readBook(${book.id})">
                        <i class="fas fa-book-open"></i>
                        قراءة الكتاب
                    </button>
                    <button class="btn-download" onclick="downloadBook(${book.id})">
                        <i class="fas fa-download"></i>
                        تحميل PDF
                    </button>
                </div>
            </div>
        </div>
    `;
    
    bookModal.classList.add('active');
}

// Read Book
function readBook(bookId) {
    // This function is now handled by pdf-reader.js
    // It will be overridden when pdf-reader.js loads
    if (window.openPdfReader) {
        window.openPdfReader(bookId);
    } else {
        const book = booksData.find(b => b.id === bookId);
        alert(`جاري فتح كتاب: ${book.title}\n\nملاحظة: جاري تحميل قارئ الكتب...`);
    }
}

// Download Book
function downloadBook(bookId) {
    const book = booksData.find(b => b.id === bookId);
    
    // Check if PDF file exists
    if (book.pdfFile) {
        // Create a temporary notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
            padding: 1.5rem 2rem;
            border-radius: 10px;
            box-shadow: 0 5px 25px rgba(0,0,0,0.2);
            z-index: 9999;
            animation: slideIn 0.5s ease;
            font-family: 'Cairo', sans-serif;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1rem;">
                <i class="fas fa-download" style="font-size: 1.5rem;"></i>
                <div>
                    <div style="font-weight: 700; margin-bottom: 0.3rem;">جاري التحميل...</div>
                    <div style="font-size: 0.9rem; opacity: 0.9;">${book.title}</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Start actual download
        setTimeout(() => {
            const link = document.createElement('a');
            link.href = book.pdfFile;
            link.download = `${book.title}.pdf`;
            link.click();
            
            notification.querySelector('div div').textContent = 'تم التحميل بنجاح!';
            notification.querySelector('i').className = 'fas fa-check-circle';
            
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.5s ease';
                setTimeout(() => {
                    notification.remove();
                }, 500);
            }, 2000);
        }, 500);
    } else {
        alert('عذراً، ملف PDF غير متوفر لهذا الكتاب حالياً.\n\nيرجى إضافة ملف PDF في مجلد books/');
    }
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    const nav = document.querySelector('.nav');
    nav.style.display = nav.style.display === 'block' ? 'none' : 'block';
}

// Contact Form
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
            padding: 1.5rem 2rem;
            border-radius: 10px;
            box-shadow: 0 5px 25px rgba(0,0,0,0.2);
            z-index: 9999;
            font-family: 'Cairo', sans-serif;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1rem;">
                <i class="fas fa-check-circle" style="font-size: 1.5rem;"></i>
                <div>
                    <div style="font-weight: 700;">تم إرسال الرسالة بنجاح!</div>
                    <div style="font-size: 0.9rem; opacity: 0.9;">سنتواصل معك قريباً</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
        
        this.reset();
    });
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Scroll to top on page load
window.scrollTo(0, 0);

// ===== Enhanced Features =====

// Scroll to Top Button
function createScrollToTopButton() {
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.setAttribute('data-tooltip', 'العودة للأعلى');
    document.body.appendChild(scrollBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top on click
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Reading Progress Bar
function createReadingProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.pageYOffset;
        const progress = (scrolled / documentHeight) * 100;
        progressBar.style.width = progress + '%';
    });
}

// Enhanced Book Card Animations
function enhanceBookCards() {
    const bookCards = document.querySelectorAll('.book-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    bookCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
}

// Add Star Rating System
function addStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHTML = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

// Enhanced Search with Suggestions
function enhanceSearch() {
    const searchInput = document.getElementById('searchInput');
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'search-suggestions';
    suggestionsContainer.style.cssText = `
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border-radius: 15px;
        margin-top: 10px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        max-height: 400px;
        overflow-y: auto;
        display: none;
    `;
    
    searchInput.parentElement.appendChild(suggestionsContainer);
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        if (searchTerm.length < 2) {
            suggestionsContainer.style.display = 'none';
            return;
        }
        
        const suggestions = booksData.filter(book => 
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm)
        ).slice(0, 5);
        
        if (suggestions.length > 0) {
            suggestionsContainer.innerHTML = suggestions.map(book => `
                <div class="suggestion-item" style="
                    padding: 1rem;
                    border-bottom: 1px solid #eee;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    transition: background 0.3s;
                " onmouseover="this.style.background='#f8f9fa'" 
                   onmouseout="this.style.background='white'"
                   onclick="openBookModal(${book.id})">
                    <img src="${book.cover}" alt="${book.title}" style="
                        width: 50px;
                        height: 70px;
                        object-fit: cover;
                        border-radius: 5px;
                    ">
                    <div style="flex: 1;">
                        <div style="font-weight: 600; color: var(--primary-color); margin-bottom: 0.3rem;">
                            ${book.title}
                        </div>
                        <div style="font-size: 0.85rem; color: #666;">
                            ${book.author}
                        </div>
                    </div>
                    <i class="fas fa-arrow-left" style="color: var(--accent-color);"></i>
                </div>
            `).join('');
            suggestionsContainer.style.display = 'block';
        } else {
            suggestionsContainer.style.display = 'none';
        }
    });
    
    // Close suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
            suggestionsContainer.style.display = 'none';
        }
    });
}

// Add Book Statistics
function addBookStatistics() {
    const stats = {
        totalBooks: booksData.length,
        totalAuthors: new Set(booksData.map(b => b.author)).size,
        totalDownloads: booksData.reduce((sum, book) => sum + book.downloads, 0)
    };
    
    // Update hero stats
    const statItems = document.querySelectorAll('.stat-item h3');
    if (statItems.length >= 3) {
        statItems[0].textContent = stats.totalBooks + '+';
        statItems[1].textContent = stats.totalAuthors + '+';
        statItems[2].textContent = (stats.totalDownloads / 1000).toFixed(0) + 'K+';
    }
}

// Add Loading Animation
function showLoadingAnimation() {
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 99999;
        transition: opacity 0.5s, visibility 0.5s;
    `;
    
    loader.innerHTML = `
        <div class="loading-spinner"></div>
        <h3 style="margin-top: 2rem; color: var(--primary-color); font-family: 'Cairo', sans-serif;">
            جاري تحميل المكتبة...
        </h3>
    `;
    
    document.body.appendChild(loader);
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
            setTimeout(() => loader.remove(), 500);
        }, 500);
    });
}

// Add Keyboard Shortcuts
function addKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('searchToggle').click();
        }
        
        // Ctrl/Cmd + H for home
        if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}

// Enhanced Category Cards with Count
function updateCategoryCount() {
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        const category = card.getAttribute('data-category');
        const count = booksData.filter(book => book.category === category).length;
        const countElement = card.querySelector('p');
        if (countElement) {
            countElement.textContent = `${count} كتاب`;
        }
    });
}

// Add Favorites System (using localStorage)
function initializeFavorites() {
    window.favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    window.toggleFavorite = function(bookId) {
        const index = window.favorites.indexOf(bookId);
        if (index > -1) {
            window.favorites.splice(index, 1);
        } else {
            window.favorites.push(bookId);
        }
        localStorage.setItem('favorites', JSON.stringify(window.favorites));
        updateFavoriteButtons();
    };
    
    window.isFavorite = function(bookId) {
        return window.favorites.includes(bookId);
    };
}

function updateFavoriteButtons() {
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        const bookId = parseInt(btn.getAttribute('data-book-id'));
        if (window.isFavorite(bookId)) {
            btn.innerHTML = '<i class="fas fa-heart"></i>';
            btn.style.color = '#e74c3c';
        } else {
            btn.innerHTML = '<i class="far fa-heart"></i>';
            btn.style.color = '#666';
        }
    });
}

// Initialize all enhanced features
function initializeEnhancedFeatures() {
    showLoadingAnimation();
    createScrollToTopButton();
    createReadingProgressBar();
    enhanceSearch();
    addBookStatistics();
    addKeyboardShortcuts();
    updateCategoryCount();
    initializeFavorites();
    
    // Re-enhance book cards after they're loaded
    setTimeout(() => {
        enhanceBookCards();
    }, 500);
}

// Call enhanced features on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeEnhancedFeatures);
} else {
    initializeEnhancedFeatures();
}