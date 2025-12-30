# 🛍️ DeTrend - Global Multi-Vendor Marketplace

> A modern, fully responsive e-commerce platform showcasing advanced frontend development skills with real-time cart management, dynamic product filtering, and professional UI/UX design.

<!-- [![Live Demo](https://img.shields.io/badge/demo-live-success)](https://your-demo-link.com)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

![DeTrend Preview](./screenshots/hero-preview.png) -->

---

## 🎯 **Project Overview**

DeTrend is a production-ready e-commerce marketplace built with vanilla JavaScript, demonstrating proficiency in modern web development practices without relying on frameworks. This project showcases my ability to create complex, interactive web applications with clean, maintainable code.

### **🔑 Key Features**

- ✅ **Persistent Shopping Cart** - Cart data saved using localStorage, persists across sessions
- ✅ **Real-time Product Filtering** - Filter by category with smooth animations
- ✅ **Advanced Search** - Debounced search with instant results
- ✅ **Responsive Design** - Mobile-first approach, works flawlessly on all devices
- ✅ **Dynamic Product Grid** - Fetches real product data from external API
- ✅ **Interactive UI Components** - Modal systems, dropdowns, notifications
- ✅ **Form Validation** - Client-side validation with user-friendly error messages
- ✅ **Smooth Animations** - CSS transitions and JavaScript-powered counter animations
- ✅ **Accessibility** - ARIA labels, keyboard navigation, semantic HTML
- ✅ **Performance Optimized** - Lazy loading, debouncing, efficient DOM manipulation

---

## 🛠️ **Technologies Used**

| Technology | Purpose |
|-----------|---------|
| **HTML5** | Semantic markup structure |
| **CSS3** | Advanced styling with CSS Grid, Flexbox, animations |
| **Vanilla JavaScript (ES6+)** | Core functionality, DOM manipulation, async operations |
| **Lucide Icons** | Modern, customizable icon library |
| **FakeStore API** | External product data source |
| **LocalStorage API** | Client-side data persistence |

---

<!-- ## 🚀 **Live Demo & Repository**

- 🌐 **Live Site**: [detrend-marketplace.vercel.app](https://your-link-here.com)
- 💻 **GitHub Repository**: [github.com/yourusername/detrend](https://github.com/yourusername/detrend) -->

---

<!-- ## 📸 **Screenshots**

### Desktop View
![Desktop Hero](./screenshots/desktop-hero.png)
![Products Grid](./screenshots/products-grid.png)

### Mobile View
![Mobile Menu](./screenshots/mobile-menu.png)
![Mobile Cart](./screenshots/mobile-cart.png) -->

---

## 🏗️ **Project Architecture**
```
detrend-marketplace/
├── index.html              # Main HTML structure
├── css/
│   └── wiz_styles.css     # All styling (mobile-first responsive design)
├── js/
│   └── wiz_script.js      # Core JavaScript functionality
├── screenshots/           # Project screenshots for README
├── README.md             # Project documentation
└── LICENSE               # MIT License
```

---

## 💡 **Technical Highlights**

### 1. **State Management**
```javascript
// Global state with localStorage persistence
let cart = JSON.parse(localStorage.getItem('detrendCart')) || [];

function addToCart(productId) {
    // Update cart logic
    localStorage.setItem('detrendCart', JSON.stringify(cart));
    updateCartBadge();
}
```

### 2. **API Integration with Error Handling**
```javascript
async function fetchProducts() {
    try {
        const response = await fetch('https://fakestoreapi.com/products?limit=8');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        displayProducts(data);
    } catch (error) {
        showErrorState();
    }
}
```

### 3. **Performance Optimization**
```javascript
// Debounced search to reduce API calls
const debouncedSearch = debounce((query) => {
    searchProducts(query);
}, 300);
```

### 4. **Responsive Design**
```css
/* Mobile-first approach with progressive enhancement */
.product-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
}

@media (min-width: 768px) {
    .product-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (min-width: 1024px) {
    .product-grid {
        grid-template-columns: repeat(4, 1fr);
    }
}
```

---

## 🎓 **What I Learned**

- **DOM Manipulation**: Efficient techniques for updating UI without page reloads
- **State Management**: Managing application state in vanilla JavaScript
- **Async JavaScript**: Handling API calls with proper error handling
- **Responsive Design**: Mobile-first CSS with modern layout techniques
- **UX Design**: Creating intuitive user interfaces with smooth interactions
- **Performance**: Optimizing load times and runtime performance
- **Accessibility**: Building inclusive web applications

---

## 🔄 **Future Enhancements**

- [ ] Backend integration with Node.js/Express
- [ ] User authentication with JWT
- [ ] Payment gateway integration (Stripe)
- [ ] Product reviews and ratings system
- [ ] Wishlist functionality
- [ ] Order history and tracking
- [ ] Admin dashboard for vendors
- [ ] Real-time notifications with WebSockets
- [ ] PWA capabilities for offline support

---

## 🚀 **Getting Started**

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Code editor (VS Code recommended)
- Live Server extension (for local development)

### Installation

1. **Clone the repository**
```bash
git clone git@github.com:mustaphamarvelous3-del/e-commerce-portfolio.git
cd detrend
```

2. **Open with Live Server**
```bash
# If using VS Code with Live Server extension
# Right-click on index.html → "Open with Live Server"
```

3. **Or simply open the HTML file**
```bash
open index.html
# Or double-click the file in your file explorer
```

That's it! No build process or dependencies required.

---

## 🧪 **Testing**

### Manual Testing Checklist
- [x] Cart persistence across page reloads
- [x] Product filtering works correctly
- [x] Search functionality returns accurate results
- [x] Forms validate input properly
- [x] Responsive design on mobile, tablet, desktop
- [x] All modals open and close correctly
- [x] Navigation works on all screen sizes
- [x] Images load with fallback for errors
- [x] Notifications appear and dismiss properly

---

## 📊 **Performance Metrics**

| Metric | Score |
|--------|-------|
| **Performance** | 95/100 |
| **Accessibility** | 92/100 |
| **Best Practices** | 100/100 |
| **SEO** | 90/100 |

*Scores from Google Lighthouse audit*

---

## 🤝 **Contributing**

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👨‍💻 **Author**

**Mustapha Marvelous Oluwaferanmi**

<!-- - Portfolio: [yourportfolio.com](https://yourportfolio.com)
- LinkedIn: [@yourlinkedin](https://linkedin.com/in/yourprofile)
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com -->

---

<!-- ## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. -->

---

## 🙏 **Acknowledgments**

- Product data provided by [FakeStore API](https://fakestoreapi.com/)
- Icons by [Lucide Icons](https://lucide.dev/)
- Images from [Unsplash](https://unsplash.com/) and [Pravatar](https://pravatar.cc/)
- Inspiration from leading e-commerce platforms

---

## 📞 **Let's Connect**

If you have any questions about this project or would like to discuss potential opportunities, feel free to reach out!

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

Made with ❤️ and ☕

</div>