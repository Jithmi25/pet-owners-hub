// Profile page JavaScript
document.addEventListener('DOMContentLoaded', async function() {
    const authToken = localStorage.getItem('petcareAuthToken');
    if (!authToken) {
        window.location.href = '../register.html';
        return;
    }

    // Load user data from localStorage (from login/register)
    const userData = JSON.parse(localStorage.getItem('userData')) || {};
    
    // Update profile name and join date in sidebar
    document.querySelectorAll('#profileName').forEach(el => {
        if (userData.name) {
            el.textContent = userData.name;
        }
    });
    
    document.querySelectorAll('#joinDate').forEach(el => {
        if (userData.joinDate) {
            el.textContent = userData.joinDate;
        }
    });

    // Populate profile form if it exists
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        document.getElementById('profileFirstName').value = userData.firstName || userData.name?.split(' ')[0] || '';
        document.getElementById('profileLastName').value = userData.lastName || userData.name?.split(' ').slice(1).join(' ') || '';
        document.getElementById('profileEmail').value = userData.email || '';
        document.getElementById('profilePhone').value = userData.phone || '';
        document.getElementById('profileAddress').value = userData.address || '';
    }

    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('petcareAuthToken');
            localStorage.removeItem('userData');
            window.location.href = '../../index.html';
        });
    }
});