document.addEventListener('DOMContentLoaded', function() {
    // Clinic Listing Page
    if (document.getElementById('clinics-map')) {
        const map = L.map('clinics-map').setView([7.8731, 80.7718], 8); // Center on Sri Lanka
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        const govHospitals = [
            {
                name: "Peradeniya Veterinary Teaching Hospital",
                lat: 7.2548,
                lng: 80.5972,
                type: "government",
                district: "kandy"
            },
            {
                name: "Colombo Municipal Vet Clinic",
                lat: 6.9271,
                lng: 79.8612,
                type: "government",
                district: "colombo"
            }
        ];

        const privateClinics = [
            {
                name: "Colombo Animal Hospital",
                lat: 6.8969,
                lng: 79.8531,
                type: "private",
                district: "colombo"
            }
        ];

        // Add markers
        [...govHospitals, ...privateClinics].forEach(clinic => {
            const marker = L.marker([clinic.lat, clinic.lng]).addTo(map);
            marker.bindPopup(`<b>${clinic.name}</b><br>${clinic.type.toUpperCase()}`);
        });

        // Filter
        document.getElementById('clinic-type').addEventListener('change', filterClinics);
        document.getElementById('location').addEventListener('change', filterClinics);
        
        function filterClinics() {
            const type = document.getElementById('clinic-type').value;
            const district = document.getElementById('location').value;
            
            console.log(`Filtering by: Type=${type}, District=${district}`);
        }
    }

    // Clinic Details Page
    if (document.getElementById('detail-map')) {
        const clinicData = getClinicData();
        
        const detailMap = L.map('detail-map').setView([clinicData.lat, clinicData.lng], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(detailMap);
        L.marker([clinicData.lat, clinicData.lng]).addTo(detailMap)
            .bindPopup(clinicData.name);

        document.getElementById('appointment-date').addEventListener('change', function() {
            const date = this.value;
            if (date) {
                loadTimeSlots(date);
            }
        });

        document.getElementById('booking-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = {
                petId: document.getElementById('pet-id').value,
                service: document.getElementById('service-type').value,
                date: document.getElementById('appointment-date').value,
                time: document.querySelector('.time-slot.selected')?.textContent
            };
            
            console.log('Booking submitted:', formData);
            alert(`Appointment booked for ${formData.date} at ${formData.time}`);
        });
    }
});

function getClinicData() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    if (id === 'gov01') {
        return {
            name: "Peradeniya Veterinary Teaching Hospital",
            lat: 7.2548,
            lng: 80.5972,
            type: "government",
            address: "Faculty of Veterinary Medicine, Peradeniya",
            phone: "081 238 7654",
            services: ["Vaccination", "Sterilization", "Emergency Care"]
        };
    } else {
        return {
            name: "Colombo Animal Hospital",
            lat: 6.8969,
            lng: 79.8531,
            type: "private",
            address: "123 Galle Road, Colombo 05",
            phone: "011 258 9632",
            services: ["Consultation", "Surgery", "Diagnostics"]
        };
    }
}

function loadTimeSlots(date) {
    const slotsContainer = document.getElementById('time-slots');
    slotsContainer.innerHTML = '';
    
    const availableSlots = ["09:00", "10:30", "13:00", "15:30"];
    const bookedSlots = ["11:00", "14:30"];
    
    availableSlots.forEach(slot => {
        const slotEl = document.createElement('div');
        slotEl.className = 'time-slot';
        slotEl.textContent = slot;
        slotEl.addEventListener('click', function() {
            document.querySelectorAll('.time-slot').forEach(el => el.classList.remove('selected'));
            this.classList.add('selected');
        });
        slotsContainer.appendChild(slotEl);
    });
    
    bookedSlots.forEach(slot => {
        const slotEl = document.createElement('div');
        slotEl.className = 'time-slot booked';
        slotEl.textContent = slot;
        slotsContainer.appendChild(slotEl);
    });
}