document.addEventListener('DOMContentLoaded', function() {
    // All available shops data
    const allShops = [
        {
            id: 1,
            name: "Paws & Claws Pet Store",
            rating: 4.7,
            reviewCount: 128,
            location: "Kandy, Dalada Vidiya",
            locationKey: "ny",
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
            locationKey: "la",
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
            locationKey: "la",
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
            locationKey: "ch",
            categories: ["food", "supplies"],
            description: "Organic and natural pet foods and supplements. We care about your pet's health.",
            image: "../../assets/images/shop4.jpg",
            hours: "9 AM - 7 PM",
            phone: "081 555-3456"
        },
        {
            id: 5,
            name: "Pet Paradise",
            rating: 4.6,
            reviewCount: 95,
            location: "Kagalle, Main Street",
            locationKey: "sf",
            categories: ["food", "toys"],
            description: "Complete pet care solutions with a wide range of products for all types of pets.",
            image: "../../assets/images/shop1.jpg",
            hours: "8 AM - 8 PM",
            phone: "081 555-7890"
        },
        {
            id: 6,
            name: "Grooming Gallery",
            rating: 4.9,
            reviewCount: 187,
            location: "Kandy, Peradeniya Road",
            locationKey: "ny",
            categories: ["grooming"],
            description: "Professional pet grooming services with experienced staff and modern facilities.",
            image: "../../assets/images/shop2.jpg",
            hours: "9 AM - 6 PM",
            phone: "081 555-2468"
        }
    ];
    
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
        
        // Filter shops based on search criteria
        let filteredShops = allShops;
        
        // Apply search filter
        if (filters.search && filters.search.trim() !== '') {
            const searchTerm = filters.search.toLowerCase();
            filteredShops = filteredShops.filter(shop => 
                shop.name.toLowerCase().includes(searchTerm) ||
                shop.description.toLowerCase().includes(searchTerm) ||
                shop.location.toLowerCase().includes(searchTerm)
            );
        }
        
        // Apply category filter
        if (filters.category && filters.category !== '') {
            filteredShops = filteredShops.filter(shop => 
                shop.categories.includes(filters.category)
            );
        }
        
        // Apply location filter
        if (filters.location && filters.location !== '') {
            filteredShops = filteredShops.filter(shop => 
                shop.locationKey === filters.location
            );
        }
        
        displayPetShops(filteredShops);
        updatePagination(3, 1);
        
        // Update results count
        const resultsText = filteredShops.length === 1 ? '1 shop' : `${filteredShops.length} shops`;
        console.log(`Showing ${resultsText}`);
    }
    
    function displayPetShops(shops) {
        const shopsContainer = document.getElementById('shopsListings');
        shopsContainer.innerHTML = '';
        
        if (shops.length === 0) {
            shopsContainer.innerHTML = `
                <div style="text-align: center; padding: 3rem; grid-column: 1 / -1;">
                    <i class="fas fa-search" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                    <h3 style="color: var(--gray);">No shops found</h3>
                    <p style="color: var(--gray);">Try adjusting your search filters</p>
                </div>
            `;
            return;
        }
        
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
    document.getElementById('searchBtn').addEventListener('click', performSearch);
    
    // Allow Enter key to trigger search
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // Real-time filtering on input change
    document.getElementById('searchInput').addEventListener('input', performSearch);
    document.getElementById('categoryFilter').addEventListener('change', performSearch);
    document.getElementById('locationFilter').addEventListener('change', performSearch);
    
    function performSearch() {
        const searchTerm = document.getElementById('searchInput').value;
        const categoryFilter = document.getElementById('categoryFilter').value;
        const locationFilter = document.getElementById('locationFilter').value;
        
        // BACKEND INTEGRATION: Apply filters and reload shops
        loadPetShops(1, {
            search: searchTerm,
            category: categoryFilter,
            location: locationFilter
        });
    }
    
    // Load initial shops
    loadPetShops();
    
    // Thumbnail image click handler for shop details - Swap functionality
    const thumbnails = document.querySelectorAll('.thumbnail-images img');
    const mainImage = document.getElementById('mainShopImage');
    
    if (thumbnails.length > 0 && mainImage) {
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                // Store the current main image source
                const currentMainSrc = mainImage.src;
                const currentMainAlt = mainImage.alt;
                
                // Store the clicked thumbnail source
                const clickedThumbSrc = this.src;
                const clickedThumbAlt = this.alt;
                
                // Swap: Set main image to clicked thumbnail
                mainImage.src = clickedThumbSrc;
                mainImage.alt = clickedThumbAlt;
                
                // Swap: Set clicked thumbnail to previous main image
                this.src = currentMainSrc;
                this.alt = currentMainAlt;
                
                // Add visual feedback with a subtle animation
                mainImage.style.opacity = '0.7';
                setTimeout(() => {
                    mainImage.style.opacity = '1';
                }, 150);
            });
            
            // Add hover effect styling
            thumb.style.cursor = 'pointer';
            thumb.style.transition = 'all 0.3s ease';
            
            thumb.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.1)';
                this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
            });
            
            thumb.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
                this.style.boxShadow = 'none';
            });
        });
    }
});


                    // Back to top button
            const backToTopButton = document.createElement('button');
            backToTopButton.innerHTML = '↑';
            backToTopButton.className = 'back-to-top';
            backToTopButton.style.display = 'none';
            document.body.appendChild(backToTopButton);

            window.addEventListener('scroll', function() {
                if (window.pageYOffset > 300) {
                    backToTopButton.style.display = 'block';
                } else {
                    backToTopButton.style.display = 'none';
                }
            });

            backToTopButton.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });

        // Add styles for back-to-top button
        const style = document.createElement('style');
        style.textContent = `
        .back-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: var(--primary);
            color: white;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
            z-index: 100;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .back-to-top:hover {
            background-color: var(--secondary);
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }
        `;
        document.head.appendChild(style);

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