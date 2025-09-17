document.addEventListener('DOMContentLoaded', function() {
    // BACKEND INTEGRATION: Load pet shops from API
    function loadPetShops(page = 1, filters = {}) {
        /*
        // Example of actual backend integration:
        const queryParams = new URLSearchParams({
            page: page,
            category: filters.category || '',
            location: filters.location || '',
            search: filters.search || ''
        });
        
        fetch(`/api/shops?${queryParams}`)
            .then(response => response.json())
            .then(data => {
                displayPetShops(data.shops);
                updatePagination(data.totalPages, data.currentPage);
            })
            .catch(error => {
                console.error('Error loading pet shops:', error);
                alert('Failed to load pet shops. Please try again.');
            });
        */
        
        // Simulated data for demonstration
        const sampleShops = [
            {
                id: 1,
                name: "Paws & Claws Pet Store",
                rating: 4.7,
                reviewCount: 128,
                location: "Kandy, Dalada Vidiya",
                categories: ["food", "toys", "grooming"],
                description: "Your one-stop shop for all pet supplies. We offer premium pet food, toys, and grooming services.",
                image: "../../assets/images/shop1.jpg",
                hours: "9 AM - 8 PM",
                phone: "081 555-1234"
            },
            {
                id: 2,
                name: "Aqua World Fish Store",
                rating: 4.5,
                reviewCount: 86,
                location: "Colombo, Kirulupana",
                categories: ["supplies"],
                description: "Specializing in aquarium supplies and exotic fish. We have everything for your aquatic pets.",
                image: "../../assets/images/shop2.jpg",
                hours: "10 AM - 7 PM",
                phone: "011 555-5678"
            },
            {
                id: 3,
                name: "Bark Avenue Boutique",
                rating: 4.9,
                reviewCount: 204,
                location: "Gampaha, Negombo Road",
                categories: ["toys", "grooming"],
                description: "Luxury pet boutique offering designer accessories, gourmet treats, and spa services.",
                image: "../../assets/images/shop3.webp",
                hours: "10 AM - 6 PM",
                phone: "033 555-9012"
            },
            {
                id: 4,
                name: "Healthy Pets Nutrition",
                rating: 4.8,
                reviewCount: 153,
                location: "Kurunagala, Kandy Road",
                categories: ["food", "supplies"],
                description: "Organic and natural pet foods and supplements. We care about your pet's health.",
                image: "../../assets/images/shop4.jpg",
                hours: "9 AM - 7 PM",
                phone: "081 555-3456"
            }
        ];
        
        displayPetShops(sampleShops);
        updatePagination(3, 1);
    }
    
    function displayPetShops(shops) {
        const shopsContainer = document.getElementById('shopsListings');
        shopsContainer.innerHTML = '';
        
        shops.forEach(shop => {
            const shopCard = document.createElement('div');
            shopCard.className = 'shop-card';
            
            // Generate star rating HTML
            const stars = '★'.repeat(Math.floor(shop.rating)) + '☆'.repeat(5 - Math.floor(shop.rating));
            
            shopCard.innerHTML = `
                <img src="${shop.image}" alt="${shop.name}">
                <div class="shop-info">
                    <h3>${shop.name}</h3>
                    <div class="rating">
                        ${stars} <span>(${shop.reviewCount} reviews)</span>
                    </div>
                    <p class="location"><i class="fas fa-map-marker-alt"></i> ${shop.location}</p>
                    <div class="shop-meta">
                        ${shop.categories.map(cat => `<span>${cat}</span>`).join('')}
                    </div>
                    <p class="description">${shop.description}</p>
                    <a href="shop-details.html?id=${shop.id}" class="btn">View Details</a>
                </div>
            `;
            shopsContainer.appendChild(shopCard);
        });
    }
    
    function updatePagination(totalPages, currentPage) {
        const paginationContainer = document.getElementById('pagination');
        paginationContainer.innerHTML = '';
        
        // Previous button
        const prevBtn = document.createElement('button');
        prevBtn.id = 'prevBtn';
        prevBtn.textContent = 'Previous';
        prevBtn.disabled = currentPage === 1;
        prevBtn.addEventListener('click', () => loadPetShops(currentPage - 1));
        paginationContainer.appendChild(prevBtn);
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.textContent = i;
            pageBtn.className = i === currentPage ? 'active' : '';
            pageBtn.addEventListener('click', () => loadPetShops(i));
            paginationContainer.appendChild(pageBtn);
        }
        
        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.id = 'nextBtn';
        nextBtn.textContent = 'Next';
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.addEventListener('click', () => loadPetShops(currentPage + 1));
        paginationContainer.appendChild(nextBtn);
    }
    
    // Search functionality
    document.getElementById('searchBtn').addEventListener('click', function() {
        const searchTerm = document.getElementById('searchInput').value;
        const categoryFilter = document.getElementById('categoryFilter').value;
        const locationFilter = document.getElementById('locationFilter').value;
        
        // BACKEND INTEGRATION: Apply filters and reload shops
        loadPetShops(1, {
            search: searchTerm,
            category: categoryFilter,
            location: locationFilter
        });
    });
    
    // Add shop button
    document.getElementById('addShopBtn').addEventListener('click', function() {
        // BACKEND INTEGRATION: Redirect to shop registration
        /*
        if (userIsLoggedIn) {
            window.location.href = 'add-shop.html';
        } else {
            window.location.href = '../../user-authentication/login.html';
        }
        */
        
        alert('This would redirect to shop registration page');
    });
    
    // Load initial shops
    loadPetShops();
    
    // Thumbnail image click handler for shop details
    const thumbnails = document.querySelectorAll('.thumbnail-images img');
    const mainImage = document.getElementById('mainShopImage');
    
    if (thumbnails && mainImage) {
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                // This would be more dynamic with real data
                const newSrc = this.src.replace('-thumb', '-large');
                mainImage.src = newSrc;
                
                // Update active thumbnail
                thumbnails.forEach(t => t.style.borderColor = 'transparent');
                this.style.borderColor = '#6C63FF';
            });
        });
    }
});

// // JavaScript for Shop Form
// document.addEventListener('DOMContentLoaded', function() {
//     // Check if user is authenticated
//     checkAuthentication();
    
//     // Highlight current page in navigation
//     const currentPage = window.location.pathname.split('/').pop() || 'post-shop.html';
//     const navLinks = document.querySelectorAll('.marketplace-header .nav-links a');
    
//     navLinks.forEach(link => {
//         link.classList.remove('active');
//         if (link.getAttribute('href') === currentPage) {
//             link.classList.add('active');
//         }
//     });

//     // Photo upload functionality
//     const uploadArea = document.getElementById('shopUploadArea');
//     const fileInput = document.getElementById('shop-photos');
//     const previewArea = document.getElementById('shopUploadPreview');

//     uploadArea.addEventListener('click', () => {
//         fileInput.click();
//     });

//     uploadArea.addEventListener('dragover', (e) => {
//         e.preventDefault();
//         uploadArea.style.borderColor = 'var(--primary)';
//         uploadArea.style.backgroundColor = 'rgba(108, 99, 255, 0.1)';
//     });

//     uploadArea.addEventListener('dragleave', () => {
//         uploadArea.style.borderColor = '#ddd';
//         uploadArea.style.backgroundColor = 'transparent';
//     });

//     uploadArea.addEventListener('drop', (e) => {
//         e.preventDefault();
//         uploadArea.style.borderColor = '#ddd';
//         uploadArea.style.backgroundColor = 'transparent';
        
//         if (e.dataTransfer.files.length > 0) {
//             handleFiles(e.dataTransfer.files);
//         }
//     });

//     fileInput.addEventListener('change', () => {
//         if (fileInput.files.length > 0) {
//             handleFiles(fileInput.files);
//         }
//     });

//     function handleFiles(files) {
//         const maxFiles = 8;
//         const currentCount = previewArea.children.length;
        
//         if (currentCount + files.length > maxFiles) {
//             alert(`You can only upload up to ${maxFiles} photos total.`);
//             return;
//         }

//         Array.from(files).forEach(file => {
//             if (!file.type.match('image.*')) {
//                 alert('Please upload only image files.');
//                 return;
//             }

//             if (file.size > 5 * 1024 * 1024) {
//                 alert('File size must be less than 5MB.');
//                 return;
//             }

//             const reader = new FileReader();
//             reader.onload = function(e) {
//                 const img = document.createElement('img');
//                 img.src = e.target.result;
//                 img.style.cursor = 'pointer';
                
//                 const container = document.createElement('div');
//                 container.style.position = 'relative';
//                 container.style.display = 'inline-block';
                
//                 const removeBtn = document.createElement('button');
//                 removeBtn.innerHTML = '×';
//                 removeBtn.style.position = 'absolute';
//                 removeBtn.style.top = '5px';
//                 removeBtn.style.right = '5px';
//                 removeBtn.style.background = 'red';
//                 removeBtn.style.color = 'white';
//                 removeBtn.style.border = 'none';
//                 removeBtn.style.borderRadius = '50%';
//                 removeBtn.style.width = '20px';
//                 removeBtn.style.height = '20px';
//                 removeBtn.style.cursor = 'pointer';
//                 removeBtn.style.fontSize = '12px';
//                 removeBtn.style.lineHeight = '1';
                
//                 removeBtn.addEventListener('click', (e) => {
//                     e.stopPropagation();
//                     container.remove();
//                 });
                
//                 container.appendChild(img);
//                 container.appendChild(removeBtn);
//                 previewArea.appendChild(container);
//             };
//             reader.readAsDataURL(file);
//         });
//     }

//     // Form submission
//     document.getElementById('shopForm').addEventListener('submit', function(e) {
//         e.preventDefault();
        
//         // Basic validation
//         const shopName = document.getElementById('shop-name').value;
//         const shopEmail = document.getElementById('shop-email').value;
//         const shopAddress = document.getElementById('shop-address').value;
        
//         if (!shopName || !shopEmail || !shopAddress) {
//             alert('Please fill in all required fields.');
//             return;
//         }
        
//         // Here you would typically send the data to your backend
//         // For demonstration, we'll just show a success message
//         alert('Shop information submitted successfully! It will be reviewed before going live.');
        
//         // Reset form or redirect
//         this.reset();
//         previewArea.innerHTML = '';
//     });

//     // BACKEND INTEGRATION: Logout functionality
//     document.getElementById('logout-link').addEventListener('click', function(e) {
//         e.preventDefault();
//         performLogout();
//     });
// });

// // Check if user is authenticated
// function checkAuthentication() {
//     const isAuthenticated = localStorage.getItem('userAuthenticated') === 'true';
    
//     if (!isAuthenticated) {
//         // Redirect to login page if not authenticated
//         window.location.href = '../../user-authentication/login.html';
//         return;
//     }
// }

// // Perform logout
// function performLogout() {
//     // Clear authentication data
//     localStorage.removeItem('userAuthenticated');
//     sessionStorage.removeItem('userAuthenticated');
    
//     // Clear any cookies related to authentication
//     document.cookie = 'userAuth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
//     // Redirect to login page
//     window.location.href = '../../user-authentication/login.html';
// }