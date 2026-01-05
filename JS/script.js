// ============================================
// GLOBAL STATE
// ============================================
let cart = JSON.parse(localStorage.getItem('marvillyonCart')) || [];
let wishlist = JSON.parse(localStorage.getItem('marvillyonWishlist')) || [];
let currentUser = JSON.parse(localStorage.getItem('marvillyonUser')) || null;
let products = [];
let currentCategory = 'all';

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initializeLucideIcons();
    setupEventListeners();
    fetchProducts();
    animateStats();
    updateAuthUI();
    updateWishlistBadge();
});

// Initialize Lucide Icons
function initializeLucideIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// ============================================
// EVENT LISTENERS
// ============================================
function setupEventListeners() {
    // Mobile Menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const closeMobileMenu = document.getElementById('closeMobileMenu');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuOverlay.classList.add('active');
        });
    }
    
    if (closeMobileMenu) {
        closeMobileMenu.addEventListener('click', () => {
            mobileMenuOverlay.classList.remove('active');
        });
    }
    
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', (e) => {
            if (e.target === mobileMenuOverlay) {
                mobileMenuOverlay.classList.remove('active');
            }
        });
    }
    
    // Close mobile menu when clicking nav items (but NOT dropdown button)
    document.querySelectorAll('.mobile-nav-item:not(.mobile-nav-dropdown-btn)').forEach(item => {
        item.addEventListener('click', () => {
            mobileMenuOverlay.classList.remove('active');
        });
    });
    
    // Filter Tabs
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            tab.classList.add('active');
            // Filter products
            currentCategory = tab.dataset.category;
            filterProducts(currentCategory);
        });
    });
    
    // Search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce((e) => {
            searchProducts(e.target.value);
        }, 300));
    }
    
    // Newsletter Form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = e.target.querySelector('.newsletter-input').value;
            if (email) {
                alert('Thank you for subscribing! 🎉');
                e.target.reset();
            }
        });
    }

    // Mobile Search
    const mobileSearchInput = document.getElementById('mobileSearchInput');
    if (mobileSearchInput) {
        mobileSearchInput.addEventListener('input', debounce((e) => {
            searchProducts(e.target.value);
        }, 300));
    }

    // Mobile Categories Dropdown
    const mobileDropdownBtn = document.querySelector('.mobile-nav-dropdown-btn');
    const mobileDropdown = document.querySelector('.mobile-nav-dropdown');

    if (mobileDropdownBtn && mobileDropdown) {
        mobileDropdownBtn.addEventListener('click', (e) => {
            e.preventDefault();
            mobileDropdown.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking category subitems
    document.querySelectorAll('.mobile-nav-subitem').forEach(item => {
        item.addEventListener('click', () => {
            document.getElementById('mobileMenuOverlay').classList.remove('active');
        });
    });

    // Auth Form Validation
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (loginForm) {
        loginForm.querySelector('.btn-primary').addEventListener('click', (e) => {
            e.preventDefault();
            const email = loginForm.querySelector('input[type="email"]').value;
            const password = loginForm.querySelector('input[type="password"]').value;
            
            if (!email || !password) {
                showNotification('Please fill in all fields', 'info');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email', 'info');
                return;
            }
            
            // Simulate login
            const user = { name: 'Demo User', email: email };
            localStorage.setItem('marvillyonUser', JSON.stringify(user));
            currentUser = user;
            updateAuthUI();
            
            showNotification(`Welcome back, ${user.name}! 🎉`, 'success');
            closeAuthModal();
        });
    }

    if (signupForm) {
        signupForm.querySelector('.btn-primary').addEventListener('click', (e) => {
            e.preventDefault();
            const name = signupForm.querySelector('input[type="text"]').value;
            const email = signupForm.querySelector('input[type="email"]').value;
            const password = signupForm.querySelector('input[type="password"]').value;
            
            if (!name || !email || !password) {
                showNotification('Please fill in all fields', 'info');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email', 'info');
                return;
            }
            
            if (password.length < 6) {
                showNotification('Password must be at least 6 characters', 'info');
                return;
            }
            
            // Simulate signup
            const user = { name: name, email: email };
            localStorage.setItem('marvillyonUser', JSON.stringify(user));
            currentUser = user;
            updateAuthUI();

            showNotification('Account created successfully! 🎉', 'success');
            closeAuthModal();
        });
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
}

// ============================================
// MODAL FUNCTIONS
// ============================================
function openAuthModal(mode) {
    const modal = document.getElementById('authModal');
    const modalTitle = document.getElementById('modalTitle');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (mode === 'login') {
        modalTitle.textContent = 'Welcome Back';
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
    } else {
        modalTitle.textContent = 'Create Account';
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function switchAuthMode(mode) {
    openAuthModal(mode);
}

// Close modal when clicking outside
document.getElementById('authModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'authModal') {
        closeAuthModal();
    }
});

function logout() {
    localStorage.removeItem('marvillyonUser');
    currentUser = null;
    updateAuthUI();
    showNotification('Logged out successfully', 'info');
}

function updateAuthUI() {
    const navActions = document.querySelector('.nav-actions');
    const authButtons = navActions.querySelectorAll('.btn-ghost, .btn-primary:not(.btn-sm)'); // Exclude small buttons if any
    
    // Remove existing auth buttons or profile menu
    const existingProfile = document.getElementById('userProfileMenu');
    if (existingProfile) existingProfile.remove();
    
    if (currentUser) {
        // Hide default login/signup buttons
        authButtons.forEach(btn => btn.style.display = 'none');
        
        // Add User Profile Menu
        const profileHTML = `
            <div id="userProfileMenu" class="dropdown" style="margin-left: 0.5rem;">
                <button class="btn btn-ghost" style="padding: 0.5rem; gap: 0.5rem;">
                    <div style="width: 32px; height: 32px; background: var(--primary); border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold;">
                        ${currentUser.name.charAt(0)}
                    </div>
                </button>
                <div class="dropdown-content" style="right: 0; left: auto; width: 200px;">
                    <div style="padding: 0.75rem 1rem; border-bottom: 1px solid var(--gray-200);">
                        <p style="font-weight: 600; color: var(--gray-900);">${currentUser.name}</p>
                        <p style="font-size: 0.8rem; color: var(--gray-500);">${currentUser.email}</p>
                    </div>
                    <a href="#" onclick="showNotification('Profile coming soon', 'info')">My Profile</a>
                    <a href="#" onclick="showNotification('Orders coming soon', 'info')">Orders</a>
                    <div style="height: 1px; background: var(--gray-200); margin: 0.5rem 0;"></div>
                    <a href="#" onclick="logout()" style="color: var(--danger);">Logout</a>
                </div>
            </div>
        `;
        navActions.insertAdjacentHTML('beforeend', profileHTML);
    } else {
        // Show default login/signup buttons
        authButtons.forEach(btn => btn.style.display = '');
    }
}

// ============================================
// CART MODAL FUNCTIONS
// ============================================
function openCartModal() {
    const modal = document.getElementById('cartModal');
    renderCartItems();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCartModal() {
    const modal = document.getElementById('cartModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function renderCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="cart-empty">
                <i data-lucide="shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <p>Add some products to get started!</p>
            </div>
        `;
        cartTotalElement.textContent = '$0.00';
        initializeLucideIcons();
        return;
    }
    
    const cartHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.title}" class="cart-item-image">
            <div class="cart-item-info">
                <div class="cart-item-title">${truncateText(item.title, 50)}</div>
                <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                <div class="cart-item-actions">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">
                        <i data-lucide="minus"></i>
                    </button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">
                        <i data-lucide="plus"></i>
                    </button>
                    <button class="remove-item-btn" onclick="removeFromCart(${item.id})">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    cartItemsContainer.innerHTML = cartHTML;
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalElement.textContent = `$${total.toFixed(2)}`;
    
    initializeLucideIcons();
}

function updateQuantity(productId, change) {
    const item = cart.find(i => i.id === productId);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        
        localStorage.setItem('marvillyonCart', JSON.stringify(cart));
        updateCartBadge();
        renderCartItems();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('marvillyonCart', JSON.stringify(cart));
    updateCartBadge();
    renderCartItems();
    showNotification('Removed from cart', 'info');
}

function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'info');
        return;
    }
    
    // Calculate total for checkout modal
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('checkoutTotal').textContent = `$${total.toFixed(2)}`;
    
    // Close cart and open checkout
    closeCartModal();
    const checkoutModal = document.getElementById('checkoutModal');
    checkoutModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCheckoutModal() {
    document.getElementById('checkoutModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function processCheckout() {
    const name = document.getElementById('checkoutName').value;
    const address = document.getElementById('checkoutAddress').value;
    const phone = document.getElementById('checkoutPhone').value;
    
    if (!name || !address || !phone) {
        showNotification('Please fill in all shipping details', 'info');
        return;
    }
    
    // Show Loading
    const btn = document.querySelector('#checkoutModal .btn-primary');
    const originalText = btn.textContent;
    btn.textContent = 'Processing...';
    btn.disabled = true;
    
    setTimeout(() => {
        // Success
        cart = [];
        localStorage.setItem('marvillyonCart', JSON.stringify(cart));
        updateCartBadge();
        
        closeCheckoutModal();
        
        // Reset button
        btn.textContent = originalText;
        btn.disabled = false;
        
        showNotification('Order placed successfully! 🚀', 'success');
    }, 2000);
}

// Update cart button click
document.getElementById('cartBtn')?.addEventListener('click', openCartModal);

// Close cart modal when clicking outside
document.getElementById('cartModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'cartModal') {
        closeCartModal();
    }
});

// Close checkout modal when clicking outside
document.getElementById('checkoutModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'checkoutModal') {
        closeCheckoutModal();
    }
});

// Update cart button click
document.getElementById('cartBtn')?.addEventListener('click', openCartModal);

// Close cart modal when clicking outside
document.getElementById('cartModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'cartModal') {
        closeCartModal();
    }
});

// ============================================
// PRODUCTS FETCH & DISPLAY (USING FREE API)
// ============================================
async function fetchProducts() {
    const productsGrid = document.getElementById('productsGrid');
    
    // Show loading spinner
    productsGrid.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <p>Loading products...</p>
        </div>
    `;
    
    try {
        const response = await fetch('https://fakestoreapi.com/products?limit=8');
        
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        
        products = data.map(item => ({
            id: item.id,
            title: item.title,
            price: item.price,
            image: item.image,
            category: item.category,
            rating: item.rating.rate,
            reviews: item.rating.count,
            description: item.description
        }));
        
        displayProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        productsGrid.innerHTML = `
            <div class="loading-spinner">
                <i data-lucide="alert-circle" style="width: 48px; height: 48px; color: var(--danger); margin-bottom: 1rem;"></i>
                <p style="color: var(--danger); font-weight: 600;">Failed to load products</p>
                <button class="btn btn-primary" onclick="fetchProducts()">Try Again</button>
            </div>
        `;
        initializeLucideIcons();
    }
}

function displayProducts(productsToDisplay) {
    const productsGrid = document.getElementById('productsGrid');
    
    if (productsToDisplay.length === 0) {
        productsGrid.innerHTML = `
            <div class="loading-spinner">
                <p>No products found.</p>
            </div>
        `;
        return;
    }
    
    productsGrid.innerHTML = productsToDisplay.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image-container">
            <img src="${product.image}" 
                alt="${product.title}" 
                class="product-image" 
                loading="lazy"
                onerror="this.src='https://via.placeholder.com/280x280?text=No+Image'">
                <button class="wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}" onclick="toggleWishlist(${product.id}, this)">
                    <i data-lucide="heart" class="${isInWishlist(product.id) ? 'fill-current' : ''}"></i>
                </button>
                ${product.price < 50 ? '<div class="product-badge">Sale</div>' : ''}
            </div>
            <div class="product-info">
                <div class="product-category">${formatCategory(product.category)}</div>
                <h3 class="product-title">${truncateText(product.title, 50)}</h3>
                <div class="product-rating">
                    ${generateStars(product.rating)}
                    <span class="product-rating-text">${product.rating} (${product.reviews})</span>
                </div>
                <div class="product-footer">
                    <div>
                        <span class="product-price">$${product.price.toFixed(2)}</span>
                        ${product.price < 50 ? '<span class="product-old-price">$' + (product.price * 1.5).toFixed(2) + '</span>' : ''}
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="addToCart(${product.id})">
                        <i data-lucide="shopping-cart"></i> Add
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Reinitialize Lucide icons for newly added elements
    initializeLucideIcons();
}

// ============================================
// FILTER & SEARCH
// ============================================
function filterProducts(category) {
    if (category === 'all') {
        displayProducts(products);
    } else {
        const filtered = products.filter(p => {
            const productCategory = p.category.toLowerCase();
            const filterCategory = category.toLowerCase();
            return productCategory.includes(filterCategory) || filterCategory.includes(productCategory);
        });
        displayProducts(filtered);
    }
}

function searchProducts(query) {
    if (!query.trim()) {
        displayProducts(products);
        return;
    }
    
    const filtered = products.filter(p => 
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
    );
    
    displayProducts(filtered);
}

// CART FUNCTIONS
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    if (product) {
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        
        // Save to localStorage
        // Save to localStorage
        localStorage.setItem('marvillyonCart', JSON.stringify(cart));
        
        updateCartBadge();
        showNotification('Added to cart!', 'success');
    }
}

function updateCartBadge() {
    const cartBadge = document.getElementById('cartBadge');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cartBadge) {
        cartBadge.textContent = totalItems;
    }
}

// Call this on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeLucideIcons();
    setupEventListeners();
    fetchProducts();
    animateStats();
    updateCartBadge(); // Add this line
    updateWishlistBadge(); // Add this line
    
    // Add active class style for wishlist button if not present
    if (!document.getElementById('wishlistStyle')) {
        const style = document.createElement('style');
        style.id = 'wishlistStyle';
        style.textContent = `
            .wishlist-btn.active { background: var(--danger); color: white; border-color: var(--danger); }
            .wishlist-btn.active svg { fill: white; color: white; }
            .fill-current { fill: currentColor; }
        `;
        document.head.appendChild(style);
    }
});

function isInWishlist(productId) {
    return wishlist.some(item => item.id === productId);
}

function toggleWishlist(productId, btnElement) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const index = wishlist.findIndex(item => item.id === productId);
    
    if (index === -1) {
        // Add to wishlist
        wishlist.push(product);
        showNotification('Added to wishlist! ❤️', 'success');
        if (btnElement) btnElement.classList.add('active');
        if (btnElement) {
            const icon = btnElement.querySelector('svg');
            if(icon) icon.classList.add('fill-current');
        }
    } else {
        // Remove from wishlist
        wishlist.splice(index, 1);
        showNotification('Removed from wishlist', 'info');
        if (btnElement) btnElement.classList.remove('active');
         if (btnElement) {
            const icon = btnElement.querySelector('svg');
            if(icon) icon.classList.remove('fill-current');
        }
    }
    
    localStorage.setItem('marvillyonWishlist', JSON.stringify(wishlist));
    updateWishlistBadge();
}

function updateWishlistBadge() {
    // Assuming the wishlist button is the first one in nav-actions
    // Or we can add an ID to the wishlist button in index.html
    const badge = document.querySelector('.nav-actions .nav-icon-btn[title="Wishlist"] .badge');
    if (badge) {
        badge.textContent = wishlist.length;
    }
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10001;
        animation: slideInRight 0.3s ease;
        font-weight: 600;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
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

// ============================================
// STATS COUNTER ANIMATION
// ============================================
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-card .stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                animateValue(entry.target, 0, target, 2000);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => observer.observe(stat));
}

function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = formatNumber(value);
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    
    window.requestAnimationFrame(step);
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M+';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(0) + 'K+';
    }
    return num.toString();
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
}

function formatCategory(category) {
    // Convert category names to proper format
    const categoryMap = {
        'electronics': 'Electronics',
        "men's clothing": 'Fashion',
        "women's clothing": 'Fashion',
        'jewelery': 'Jewelry',
        'jewelry': 'Jewelry'
    };
    
    return categoryMap[category.toLowerCase()] || category.charAt(0).toUpperCase() + category.slice(1);
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    let starsHTML = '';
    
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            starsHTML += '<i data-lucide="star" style="width: 16px; height: 16px; color: #fbbf24; fill: #fbbf24;"></i>';
        } else {
            starsHTML += '<i data-lucide="star" style="width: 16px; height: 16px; color: #d1d5db;"></i>';
        }
    }
    
    return starsHTML;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================
// SMOOTH SCROLLING FOR ANCHOR LINKS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Don't prevent default for href="#" (used for modal triggers)
        if (href === '#') return;
        
        e.preventDefault();
        
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// LAZY LOADING IMAGES
// ============================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });
    
    // Observe all images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Back to Top Button
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopBtn?.classList.add('visible');
    } else {
        backToTopBtn?.classList.remove('visible');
    }
});

backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ============================================
// CONSOLE EASTER EGG
// ============================================
console.log('%cMarvillyon 🛍️', 'color: #6366f1; font-size: 24px; font-weight: bold;');
console.log('%cWelcome to Marvillyon! Looking to build something amazing? Join our vendor program!', 'color: #8b5cf6; font-size: 14px;');

// Make functions available globally
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.switchAuthMode = switchAuthMode;
window.addToCart = addToCart;
window.addToWishlist = addToWishlist;
window.openCartModal = openCartModal;
window.closeCartModal = closeCartModal;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.checkout = checkout;
window.closeCheckoutModal = closeCheckoutModal;
window.processCheckout = processCheckout;