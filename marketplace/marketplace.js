document.addEventListener('DOMContentLoaded', function() {
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
        
        // Simulated data for demonstration
        const sampleListings = [
            {
                id: 1,
                name: "Golden Retriever Puppy",
                price: 800,
                location: "New York, NY",
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
                price: 450,
                location: "Chicago, IL",
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
                price: 1200,
                location: "Los Angeles, CA",
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
                price: 250,
                location: "Boston, MA",
                type: "dog",
                breed: "Labrador",
                age: "1 year",
                gender: "Female",
                description: "Sweet lab looking for a forever home. Spayed and up to date on shots.",
                image: "../../assets/images/pet4.jpg"
            }
        ];
        
        displayPetListings(sampleListings);
        updatePagination(3, 1);
    }
    
    function displayPetListings(listings) {
        const listingsContainer = document.getElementById('petListings');
        listingsContainer.innerHTML = '';
        
        listings.forEach(pet => {
            const petCard = document.createElement('div');
            petCard.className = 'pet-card';
            petCard.innerHTML = `
                <img src="${pet.image}" alt="${pet.name}">
                <div class="pet-info">
                    <h3>${pet.name}</h3>
                    <p class="price">$${pet.price}</p>
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
    
    // Search functionality
    document.getElementById('searchBtn').addEventListener('click', function() {
        const searchTerm = document.getElementById('searchInput').value;
        const typeFilter = document.getElementById('typeFilter').value;
        const locationFilter = document.getElementById('locationFilter').value;
        
        // BACKEND INTEGRATION: Apply filters and reload listings
        loadPetListings(1, {
            search: searchTerm,
            type: typeFilter,
            location: locationFilter
        });
    });
    
    // Load initial listings
    loadPetListings();
    
    // Thumbnail image click handler for pet details
    const thumbnails = document.querySelectorAll('.thumbnail-images img');
    const mainImage = document.getElementById('mainPetImage');
    
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