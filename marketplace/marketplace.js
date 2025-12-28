document.addEventListener('DOMContentLoaded', function() {
    // All available pet listings
    const allListings = [
        {
            id: 1,
            name: "Golden Retriever Puppy",
            price: 20000,
            location: "Kandy, Pilimathalawa",
            type: "dog",
            breed: "Golden Retriever",
            age: "8 weeks",
            gender: "Male",
            description: "Beautiful golden retriever puppy from champion bloodline. Vaccinated and vet checked.",
            image: "../../assets/images/pet1.jpg"
        },
        {
            id: 2,
            name: "Siamese Cat",
            price: 45000,
            location: "Gampaha, Nittabuwa",
            type: "cat",
            breed: "Siamese",
            age: "6 months",
            gender: "Female",
            description: "Purebred Siamese cat with blue eyes. Litter trained and very affectionate.",
            image: "../../assets/images/pet2.webp"
        },
        {
            id: 3,
            name: "African Grey Parrot",
            price: 20000,
            location: "Kurunagala, Kuliyapitiya",
            type: "bird",
            breed: "African Grey",
            age: "2 years",
            gender: "Male",
            description: "Smart and talkative African Grey. Comes with large cage and toys.",
            image: "../../assets/images/pet3.webp"
        },
        {
            id: 4,
            name: "Labrador Retriever",
            price: 25000,
            location: "Kagalle, Mawanella",
            type: "dog",
            breed: "Labrador",
            age: "1 year",
            gender: "Female",
            description: "Sweet lab looking for a forever home. Spayed and up to date on shots.",
            image: "../../assets/images/pet4.jpg"
        }
    ];

    // BACKEND INTEGRATION: Load pet listings from API
    function loadPetListings(page = 1, filters = {}) {
        /*
        // Example of actual backend integration:
        const queryParams = new URLSearchParams({
            page: page,
            type: filters.type || '',
            location: filters.location || '',
            search: filters.search || ''
        });
        
        fetch(`/api/marketplace/listings?${queryParams}`)
            .then(response => response.json())
            .then(data => {
                displayPetListings(data.listings);
                updatePagination(data.totalPages, data.currentPage);
            })
            .catch(error => {
                console.error('Error loading pet listings:', error);
                alert('Failed to load pet listings. Please try again.');
            });
        */
        
        // Filter listings based on search criteria
        let filteredListings = allListings;
        
        // Apply search filter
        if (filters.search && filters.search.trim() !== '') {
            const searchTerm = filters.search.toLowerCase();
            filteredListings = filteredListings.filter(pet => 
                pet.name.toLowerCase().includes(searchTerm) ||
                pet.breed.toLowerCase().includes(searchTerm) ||
                pet.description.toLowerCase().includes(searchTerm) ||
                pet.location.toLowerCase().includes(searchTerm)
            );
        }
        
        // Apply type filter
        if (filters.type && filters.type !== '') {
            filteredListings = filteredListings.filter(pet => 
                pet.type === filters.type
            );
        }
        
        // Apply location filter
        if (filters.location && filters.location !== '') {
            filteredListings = filteredListings.filter(pet => 
                pet.location.toLowerCase().includes(filters.location.toLowerCase())
            );
        }
        
        displayPetListings(filteredListings);
        updatePagination(3, 1);
        
        // Update results count
        const resultsText = filteredListings.length === 1 ? '1 pet' : `${filteredListings.length} pets`;
        const resultsEl = document.getElementById('resultsCount');
        if (resultsEl) resultsEl.textContent = `Showing ${resultsText}`;
        console.log(`Showing ${resultsText}`);
    }
    
    function displayPetListings(listings) {
        const listingsContainer = document.getElementById('petListings');
        listingsContainer.innerHTML = '';
        
        if (listings.length === 0) {
            listingsContainer.innerHTML = `
                <div style="text-align: center; padding: 3rem; grid-column: 1 / -1;">
                    <i class="fas fa-search" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                    <h3 style="color: var(--gray);">No pets found</h3>
                    <p style="color: var(--gray);">Try adjusting your search filters</p>
                </div>
            `;
            return;
        }
        
        listings.forEach(pet => {
            const petCard = document.createElement('div');
            petCard.className = 'pet-card';
            petCard.innerHTML = `
                <img src="${pet.image}" alt="${pet.name}">
                <div class="pet-info">
                    <h3>${pet.name}</h3>
                    <p class="price">RS.${pet.price}</p>
                    <p class="location"><i class="fas fa-map-marker-alt"></i> ${pet.location}</p>
                    <div class="pet-meta">
                        <span>${pet.type}</span>
                        <span>${pet.age}</span>
                        <span>${pet.gender}</span>
                    </div>
                    <p class="description">${pet.description}</p>
                    <a href="pet-details.html?id=${pet.id}" class="btn">View Details</a>
                </div>
            `;
            listingsContainer.appendChild(petCard);
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
        prevBtn.addEventListener('click', () => loadPetListings(currentPage - 1));
        paginationContainer.appendChild(prevBtn);
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.textContent = i;
            pageBtn.className = i === currentPage ? 'active' : '';
            pageBtn.addEventListener('click', () => loadPetListings(i));
            paginationContainer.appendChild(pageBtn);
        }
        
        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.id = 'nextBtn';
        nextBtn.textContent = 'Next';
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.addEventListener('click', () => loadPetListings(currentPage + 1));
        paginationContainer.appendChild(nextBtn);
    }
    
    // Marketplace page guards
    const searchBtnEl = document.getElementById('searchBtn');
    const searchInputEl = document.getElementById('searchInput');
    const typeFilterEl = document.getElementById('typeFilter');
    const locationFilterEl = document.getElementById('locationFilter');
    const listingsContainerEl = document.getElementById('petListings');

    // Perform search using current filter inputs
    function performSearch() {
        const filters = {
            search: searchInputEl ? searchInputEl.value.trim() : '',
            type: typeFilterEl ? typeFilterEl.value : '',
            location: locationFilterEl ? locationFilterEl.value : ''
        };
        loadPetListings(1, filters);
    }

    if (listingsContainerEl && searchBtnEl && searchInputEl && typeFilterEl && locationFilterEl) {
        // Search functionality
        searchBtnEl.addEventListener('click', performSearch);

        // Allow Enter key to trigger search
        searchInputEl.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });

        // Real-time filtering on input change
        searchInputEl.addEventListener('input', performSearch);
        typeFilterEl.addEventListener('change', performSearch);
        locationFilterEl.addEventListener('change', performSearch);

        // Load initial listings
        loadPetListings();
    }
    
    // Thumbnail image click handler for pet details - Swap functionality
    const thumbnails = document.querySelectorAll('.thumbnail-images img');
    const mainImage = document.getElementById('mainPetImage');
    
    if (thumbnails.length > 0 && mainImage) {
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                // Store the current main image source/alt
                const currentMainSrc = mainImage.src;
                const currentMainAlt = mainImage.alt;
                
                // Store the clicked thumbnail source/alt
                const clickedThumbSrc = this.src;
                const clickedThumbAlt = this.alt;
                
                // Swap: Set main image to clicked thumbnail
                mainImage.src = clickedThumbSrc;
                mainImage.alt = clickedThumbAlt;
                
                // Swap: Set clicked thumbnail to previous main image
                this.src = currentMainSrc;
                this.alt = currentMainAlt;
                
                // Visual feedback on swap
                mainImage.style.opacity = '0.7';
                setTimeout(() => {
                    mainImage.style.opacity = '1';
                }, 150);
            });
            
            // Hover and cursor feedback
            thumb.style.cursor = 'pointer';
            thumb.style.transition = 'all 0.3s ease';
            
            thumb.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05)';
                this.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
            });
            
            thumb.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
                this.style.boxShadow = 'none';
            });
        });
    }
    
    // Photo upload preview for post listing
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('pet-photos');
    const uploadPreview = document.getElementById('uploadPreview');
    
    if (uploadArea && fileInput && uploadPreview) {
        uploadArea.addEventListener('click', () => fileInput.click());
        
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#6C63FF';
            uploadArea.style.backgroundColor = 'rgba(108, 99, 255, 0.1)';
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = '#ddd';
            uploadArea.style.backgroundColor = 'transparent';
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#ddd';
            uploadArea.style.backgroundColor = 'transparent';
            
            if (e.dataTransfer.files.length) {
                fileInput.files = e.dataTransfer.files;
                handleFiles(fileInput.files);
            }
        });
        
        fileInput.addEventListener('change', () => {
            if (fileInput.files.length) {
                handleFiles(fileInput.files);
            }
        });
        
        function handleFiles(files) {
            uploadPreview.innerHTML = '';
            
            // Limit to 10 files
            const filesToShow = Array.from(files).slice(0, 10);
            
            filesToShow.forEach(file => {
                if (!file.type.startsWith('image/')) return;
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    uploadPreview.appendChild(img);
                };
                reader.readAsDataURL(file);
            });
        }
    }
    
    const listingForm = document.querySelector('.listing-form');
    if (listingForm) {
        listingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const petName = document.getElementById('pet-name').value;
            const petType = document.getElementById('pet-type').value;
            
            if (!petName || !petType) {
                alert('Please fill in all required fields');
                return;
            }
            
            // BACKEND INTEGRATION: Submit form data to API
            /*
            const formData = new FormData();
            formData.append('petName', petName);
            formData.append('petType', petType);
            // Append all other form fields...
            
            // Append uploaded files
            const files = document.getElementById('pet-photos').files;
            for (let i = 0; i < files.length; i++) {
                formData.append('photos', files[i]);
            }
            
            fetch('/api/marketplace/listings', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Listing created successfully!');
                    window.location.href = 'marketplace.html';
                } else {
                    alert('Error creating listing: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error creating listing:', error);
                alert('Failed to create listing. Please try again.');
            });
            */
            
            // For demonstration purposes
            console.log('Form would be submitted with:', {
                petName,
                petType,
                breed: document.getElementById('pet-breed').value,
                age: document.getElementById('pet-age').value,
                gender: document.getElementById('pet-gender').value,
                listingType: document.querySelector('input[name="listing-type"]:checked').value,
                price: document.getElementById('pet-price').value,
                location: document.getElementById('pet-location').value,
                description: document.getElementById('pet-description').value,
                vaccinationStatus: Array.from(document.querySelectorAll('input[name="vaccinations"]:checked')).map(cb => cb.value),
                healthNotes: document.getElementById('pet-health-notes').value,
                veterinaryInformation: document.getElementById('pet-vet').value,
            });
            
            alert('Listing created successfully! (This is a demo)');
            // window.location.href = 'marketplace.html';
        });
    }
    
    // Toggle price field based on listing type
    const listingTypeRadios = document.querySelectorAll('input[name="listing-type"]');
    const priceGroup = document.querySelector('.price-group');
    
    if (listingTypeRadios && priceGroup) {
        listingTypeRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'adoption') {
                    priceGroup.querySelector('label').textContent = 'Adoption Fee';
                    priceGroup.querySelector('input').placeholder = 'Suggested donation amount';
                } else if (this.value === 'rehoming') {
                    priceGroup.querySelector('label').textContent = 'Rehoming Fee (if any)';
                    priceGroup.querySelector('input').placeholder = '0 for free';
                } else {
                    priceGroup.querySelector('label').textContent = 'Price';
                    priceGroup.querySelector('input').placeholder = '';
                }
            });
        });
    }
});

// Add event listener to Marketplace button
document.addEventListener('DOMContentLoaded', function() {
    const marketplaceBtn = document.querySelector('.form-actions .btn-primary:last-child');
    if (marketplaceBtn) {
        marketplaceBtn.addEventListener('click', function() {
            window.location.href = 'marketplace/marketplace.html';
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