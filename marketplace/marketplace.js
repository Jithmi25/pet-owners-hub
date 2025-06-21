document.addEventListener('DOMContentLoaded', function() {
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
            
            console.log('Form would be submitted with:', {
                petName,
                petType,
                breed,
                age,
                gender,
                listingType,
                priceAdoptionFee,
                location,
                description,
                vaccinationStatus,
                healthNotes,
                veterinaryInformation,
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