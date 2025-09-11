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
                location: "New York, NY",
                categories: ["food", "toys", "grooming"],
                description: "Your one-stop shop for all pet supplies. We offer premium pet food, toys, and grooming services.",
                image: "../../assets/images/shop1.jpg",
                hours: "9 AM - 8 PM",
                phone: "(212) 555-1234"
            },
            {
                id: 2,
                name: "Aqua World Fish Store",
                rating: 4.5,
                reviewCount: 86,
                location: "Los Angeles, CA",
                categories: ["supplies"],
                description: "Specializing in aquarium supplies and exotic fish. We have everything for your aquatic pets.",
                image: "../../assets/images/shop2.jpg",
                hours: "10 AM - 7 PM",
                phone: "(310) 555-5678"
            },
            {
                id: 3,
                name: "Bark Avenue Boutique",
                rating: 4.9,
                reviewCount: 204,
                location: "Chicago, IL",
                categories: ["toys", "grooming"],
                description: "Luxury pet boutique offering designer accessories, gourmet treats, and spa services.",
                image: "../../assets/images/shop3.jpg",
                hours: "10 AM - 6 PM",
                phone: "(312) 555-9012"
            },
            {
                id: 4,
                name: "Healthy Pets Nutrition",
                rating: 4.8,
                reviewCount: 153,
                location: "San Francisco, CA",
                categories: ["food", "supplies"],
                description: "Organic and natural pet foods and supplements. We care about your pet's health.",
                image: "../../assets/images/shop4.jpg",
                hours: "9 AM - 7 PM",
                phone: "(415) 555-3456"
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