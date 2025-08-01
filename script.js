/**
 * EDUCE Website JavaScript
 * Handles all interactive functionality including navigation, forms, and animations
 */

// ========================================
// Global Variables
// ========================================
let profileMenuOpen = false;

// ========================================
// Storage Keys
// ========================================
const STORAGE_KEYS = {
    CUSTOMER: 'educe_customer',
    CHILDREN: 'educe_children',
    PSYCHOLOGISTS: 'educe_psychologists',
    REQUESTS: 'educe_requests',
    GAME_RESULTS: 'educe_game_results',
    API_KEY: 'educe_gemini_api_key'
};

/**
 * Initialize all website functionality
 */
function initializeWebsite() {
    initMobileNavigation();
    initSmoothScrolling();
    initContactForm();
    initButtonAnimations();
    initScrollEffects();
    initNavbarScroll();
    checkCustomerLogin();
}

// ========================================
// Mobile Navigation
// ========================================

/**
 * Initialize mobile navigation toggle functionality
 */
function initMobileNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!navToggle || !navMenu) return;

    // Toggle mobile menu
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        // Change hamburger icon to X and vice versa
        const icon = navToggle.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
        
        // Close profile menu when mobile menu opens/closes
        if (window.closeProfileMenu) {
            closeProfileMenu();
        }
    });

    // Close mobile menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            const icon = navToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navMenu.contains(event.target) || navToggle.contains(event.target);
        
        if (!isClickInsideNav && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            const icon = navToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

// ========================================
// Smooth Scrolling
// ========================================

/**
 * Initialize smooth scrolling for navigation links
 */
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// Contact Form Handling
// ========================================

/**
 * Initialize contact form submission and validation
 */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name').trim();
        const email = formData.get('email').trim();
        const message = formData.get('message').trim();
        
        // Validate form
        if (!validateContactForm(name, email, message)) {
            return;
        }
        
        // Simulate form submission
        handleFormSubmission(contactForm, { name, email, message });
    });
}

/**
 * Validate contact form fields
 * @param {string} name - User's name
 * @param {string} email - User's email
 * @param {string} message - User's message
 * @returns {boolean} - True if form is valid
 */
function validateContactForm(name, email, message) {
    // Remove previous error messages
    clearFormErrors();
    
    let isValid = true;
    
    // Validate name
    if (name.length < 2) {
        showFieldError('name', 'Name must be at least 2 characters long.');
        isValid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showFieldError('email', 'Please enter a valid email address.');
        isValid = false;
    }
    
    // Validate message
    if (message.length < 10) {
        showFieldError('message', 'Message must be at least 10 characters long.');
        isValid = false;
    }
    
    return isValid;
}

/**
 * Show error message for a specific form field
 * @param {string} fieldName - Name of the field
 * @param {string} message - Error message to display
 */
function showFieldError(fieldName, message) {
    const field = document.getElementById(fieldName);
    const formGroup = field.closest('.form-group');
    
    // Create error element if it doesn't exist
    let errorElement = formGroup.querySelector('.field-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.style.cssText = `
            color: #EF4444;
            font-size: 0.875rem;
            margin-top: 0.25rem;
            display: block;
        `;
        formGroup.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    field.style.borderColor = '#EF4444';
}

/**
 * Clear all form error messages
 */
function clearFormErrors() {
    const errorElements = document.querySelectorAll('.field-error');
    const formFields = document.querySelectorAll('#contactForm input, #contactForm textarea');
    
    errorElements.forEach(element => element.remove());
    formFields.forEach(field => field.style.borderColor = '');
}

/**
 * Handle form submission (simulate sending)
 * @param {HTMLFormElement} form - The form element
 * @param {Object} data - Form data object
 */
function handleFormSubmission(form, data) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Show loading state
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Show success message
        showSuccessMessage('Thank you! Your message has been sent successfully. We\'ll get back to you soon.');
        
        // Reset form
        form.reset();
        
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
        // Log form data (in real app, this would be sent to server)
        console.log('Form submitted:', data);
        
    }, 2000);
}

/**
 * Show success message to user
 * @param {string} message - Success message to display
 */
function showSuccessMessage(message) {
    // Create success notification
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #10B981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 1001;
        transform: translateX(100%);
        transition: transform 0.3s ease-in-out;
        max-width: 300px;
    `;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// ========================================
// Button Animations and Interactions
// ========================================

/**
 * Initialize button animations and click handlers
 */
function initButtonAnimations() {
    // Handle CTA button clicks
    const ctaButtons = document.querySelectorAll('.btn');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            createRippleEffect(this, e);
            
            // Handle specific button actions
            handleButtonClick(this);
        });
    });
}

/**
 * Create ripple effect on button click
 * @param {HTMLElement} button - Button element
 * @param {Event} event - Click event
 */
function createRippleEffect(button, event) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
    `;
    
    // Add ripple animation CSS if not already added
    if (!document.querySelector('#ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
            .btn {
                position: relative;
                overflow: hidden;
            }
        `;
        document.head.appendChild(style);
    }
    
    button.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

/**
 * Handle specific button click actions
 * @param {HTMLElement} button - Clicked button
 */
function handleButtonClick(button) {
    const buttonText = button.textContent.trim();
    
    switch (buttonText) {
        case 'Start Now':
        case 'Get Started':
        case 'Contact Us':
            scrollToContact();
            break;
        case 'Watch Demo':
            showDemoModal();
            break;
        case 'Join as Psychologist':
            showPsychologistForm();
            break;
        default:
            // Default action for other buttons
            break;
    }
}

/**
 * Scroll to contact section
 */
function scrollToContact() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = contactSection.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

/**
 * Show demo modal (placeholder)
 */
function showDemoModal() {
    alert('Demo video coming soon! Please contact us for more information.');
}

/**
 * Show psychologist application form (placeholder)
 */
function showPsychologistForm() {
    window.open('psychologist.html', '_blank');
}

// ========================================
// Scroll Effects
// ========================================

/**
 * Initialize scroll-based animations and effects
 */
function initScrollEffects() {
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.step, .feature, .contact-item');
    animatedElements.forEach((element, index) => {
        // Set initial state
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`;
        
        observer.observe(element);
    });
}

/**
 * Initialize navbar scroll effects
 */
function initNavbarScroll() {
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add shadow when scrolled
        if (scrollTop > 10) {
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = 'none';
        }
        
        // Hide/show navbar on scroll
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// ========================================
// Utility Functions
// ========================================

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
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

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} - True if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ========================================
// Error Handling
// ========================================

/**
 * Global error handler
 */
window.addEventListener('error', function(event) {
    console.error('JavaScript Error:', event.error);
    // In production, you might want to send this to an error tracking service
});

/**
 * Handle unhandled promise rejections
 */
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled Promise Rejection:', event.reason);
    // Prevent the default behavior
    event.preventDefault();
}); 

// ========================================
// Customer Profile Dropdown Functions
// ========================================

/**
 * Check customer login status and update navbar accordingly
 */
function checkCustomerLogin() {
    const customer = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMER) || '{}');
    const profileDropdown = document.getElementById('profileDropdown');
    const guestButtons = document.getElementById('guestButtons');
    
    if (customer.role === 'customer') {
        // Show profile dropdown
        if (profileDropdown) profileDropdown.style.display = 'inline-block';
        if (guestButtons) guestButtons.style.display = 'none';
        
        // Update profile info
        updateNavbarProfile(customer);
    } else {
        // Show guest buttons
        if (profileDropdown) profileDropdown.style.display = 'none';
        if (guestButtons) guestButtons.style.display = 'flex';
    }
}

/**
 * Update navbar profile information
 * @param {Object} customer - Customer data
 */
function updateNavbarProfile(customer) {
    // Update user info
    const initials = customer.name.split(' ').map(n => n[0]).join('').toUpperCase();
    
    const navUserAvatar = document.getElementById('navUserAvatar');
    const navUserName = document.getElementById('navUserName');
    const menuUserAvatar = document.getElementById('menuUserAvatar');
    const menuUserName = document.getElementById('menuUserName');
    const menuUserEmail = document.getElementById('menuUserEmail');
    
    if (navUserAvatar) navUserAvatar.textContent = initials;
    if (navUserName) navUserName.textContent = customer.name;
    if (menuUserAvatar) menuUserAvatar.textContent = initials;
    if (menuUserName) menuUserName.textContent = customer.name;
    if (menuUserEmail) menuUserEmail.textContent = customer.email;
    
    // Update statistics
    updateNavbarStats(customer);
    
    // Update children list
    updateNavbarChildrenList(customer);
}

/**
 * Update statistics in navbar dropdown
 * @param {Object} customer - Customer data
 */
function updateNavbarStats(customer) {
    const children = customer.children || [];
    const assessments = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHILDREN) || '[]');
    
    // Filter assessments for this customer's children
    const customerAssessments = assessments.filter(assessment => 
        children.some(child => child.name === assessment.name)
    );
    
    const completedAssessments = customerAssessments.filter(a => a.reportGenerated);
    const pendingAssessments = customerAssessments.filter(a => !a.reportGenerated);
    
    const navTotalChildren = document.getElementById('navTotalChildren');
    const navCompletedAssessments = document.getElementById('navCompletedAssessments');
    const navPendingAssessments = document.getElementById('navPendingAssessments');
    
    if (navTotalChildren) navTotalChildren.textContent = children.length;
    if (navCompletedAssessments) navCompletedAssessments.textContent = completedAssessments.length;
    if (navPendingAssessments) navPendingAssessments.textContent = pendingAssessments.length;
}

/**
 * Update children list in navbar dropdown
 * @param {Object} customer - Customer data
 */
function updateNavbarChildrenList(customer) {
    const navChildrenList = document.getElementById('navChildrenList');
    if (!navChildrenList) return;
    
    const children = customer.children || [];
    const assessments = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHILDREN) || '[]');
    
    let childrenHTML = '<h5>My Children</h5>';
    
    if (children.length === 0) {
        childrenHTML += '<div class="no-children">No children added yet</div>';
    } else {
        children.forEach(child => {
            const childAssessment = assessments.find(a => a.name === child.name);
            const hasAssessment = !!childAssessment;
            const hasReport = childAssessment && childAssessment.reportGenerated;
            
            let status = 'Available';
            let statusClass = 'status-available-mini';
            
            if (hasAssessment && !hasReport) {
                status = 'Pending';
                statusClass = 'status-pending-mini';
            } else if (hasReport) {
                status = 'Completed';
                statusClass = 'status-completed-mini';
            }
            
            const initials = child.name.split(' ').map(n => n[0]).join('').toUpperCase();
            
            childrenHTML += `
                <div class="child-item-mini" onclick="viewChildReport('${child.id}')">
                    <div class="child-info-mini">
                        <div class="child-avatar-mini">${initials}</div>
                        <div class="child-details-mini">
                            <h6>${child.name}</h6>
                            <p>${child.age} years old</p>
                        </div>
                    </div>
                    <span class="status-badge-mini ${statusClass}">${status}</span>
                </div>
            `;
        });
    }
    
    navChildrenList.innerHTML = childrenHTML;
}

/**
 * Toggle profile dropdown menu
 */
function toggleProfile() {
    const profileMenu = document.getElementById('profileMenu');
    if (!profileMenu) return;
    
    if (profileMenuOpen) {
        closeProfileMenu();
    } else {
        openProfileMenu();
    }
}

/**
 * Open profile dropdown menu
 */
function openProfileMenu() {
    const profileMenu = document.getElementById('profileMenu');
    if (profileMenu) {
        profileMenu.classList.add('active');
        profileMenuOpen = true;
        
        // Refresh data when opening
        const customer = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMER) || '{}');
        if (customer.role === 'customer') {
            updateNavbarProfile(customer);
        }
    }
}

/**
 * Close profile dropdown menu
 */
function closeProfileMenu() {
    const profileMenu = document.getElementById('profileMenu');
    if (profileMenu) {
        profileMenu.classList.remove('active');
        profileMenuOpen = false;
    }
}

/**
 * View specific child's report
 * @param {string} childId - Child ID
 */
function viewChildReport(childId) {
    closeProfileMenu();
    
    const customer = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMER) || '{}');
    const child = customer.children?.find(c => c.id == childId);
    
    if (!child) return;
    
    const assessments = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHILDREN) || '[]');
    const assessment = assessments.find(a => a.name === child.name);
    
    if (assessment && assessment.report) {
        // Create a new window to display the report
        const reportWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes');
        reportWindow.document.write(`
            <html>
                <head>
                    <title>Assessment Report - ${child.name}</title>
                    <style>
                        body { 
                            font-family: 'Inter', Arial, sans-serif; 
                            padding: 2rem; 
                            line-height: 1.6; 
                            color: #1F2937;
                            max-width: 800px;
                            margin: 0 auto;
                        }
                        h3 { color: #4F46E5; margin-top: 2rem; }
                        h4 { color: #1F2937; margin-top: 2rem; }
                        .career-recommendation { 
                            background: #F0F9FF; 
                            padding: 1rem; 
                            margin: 1rem 0; 
                            border-radius: 0.5rem;
                            border-left: 4px solid #4F46E5;
                        }
                        .strength-item { 
                            background: #F0FDF4; 
                            padding: 0.5rem; 
                            margin: 0.5rem 0; 
                            border-radius: 0.25rem;
                            border-left: 3px solid #10B981;
                        }
                        .header-actions {
                            display: flex;
                            gap: 1rem;
                            margin-bottom: 2rem;
                            padding-bottom: 1rem;
                            border-bottom: 2px solid #E5E7EB;
                        }
                        .btn {
                            padding: 0.5rem 1rem;
                            border: none;
                            border-radius: 0.375rem;
                            cursor: pointer;
                            font-weight: 500;
                        }
                        .btn-primary { background: #4F46E5; color: white; }
                        .btn-secondary { background: #6B7280; color: white; }
                    </style>
                </head>
                <body>
                    <div class="header-actions">
                        <button class="btn btn-primary" onclick="window.print()">
                            <i class="fas fa-print"></i> Print Report
                        </button>
                        <button class="btn btn-secondary" onclick="window.close()">
                            <i class="fas fa-times"></i> Close
                        </button>
                    </div>
                    ${assessment.report}
                </body>
            </html>
        `);
    } else {
        alert(`No assessment report available for ${child.name} yet. Please complete the psychological assessment first.`);
    }
}

// ========================================
// Profile Action Functions
// ========================================

/**
 * Add new child - opens modal form
 */
function addNewChild() {
    closeProfileMenu();
    openAddChildModal();
}

/**
 * Open Add Child Modal
 */
function openAddChildModal() {
    const modal = document.getElementById('addChildModal');
    if (modal) {
        // Reset form
        document.getElementById('addChildForm').reset();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Close Add Child Modal
 */
function closeAddChildModal() {
    const modal = document.getElementById('addChildModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

/**
 * Handle Add Child Form Submission
 */
function handleAddChildForm(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const childData = {
        id: Date.now(), // Simple ID generation
        name: formData.get('childName').trim(),
        age: parseInt(formData.get('childAge')),
        gender: formData.get('childGender'),
        grade: formData.get('childGrade').trim(),
        interests: formData.get('childInterests').trim(),
        notes: formData.get('childNotes').trim(),
        addedDate: new Date().toISOString()
    };
    
    // Validate required fields
    if (!childData.name || !childData.age || !childData.gender) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Add child to customer's children array
    const customer = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMER) || '{}');
    if (!customer.children) {
        customer.children = [];
    }
    
    // Check if child with same name already exists
    if (customer.children.some(child => child.name.toLowerCase() === childData.name.toLowerCase())) {
        alert('A child with this name already exists. Please use a different name.');
        return;
    }
    
    customer.children.push(childData);
    localStorage.setItem(STORAGE_KEYS.CUSTOMER, JSON.stringify(customer));
    
    // Close modal and refresh profile
    closeAddChildModal();
    updateNavbarProfile(customer);
    
    // Show success message
    showSuccessMessage(`${childData.name} has been added successfully!`);
}

/**
 * View all reports for customer's children
 */
function viewAllReports() {
    closeProfileMenu();
    openViewReportsModal();
}

/**
 * Open View Reports Modal
 */
function openViewReportsModal() {
    const modal = document.getElementById('viewReportsModal');
    if (modal) {
        populateReportsModal();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Close View Reports Modal
 */
function closeViewReportsModal() {
    const modal = document.getElementById('viewReportsModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

/**
 * Populate Reports Modal with data
 */
function populateReportsModal() {
    const container = document.getElementById('reportsContainer');
    if (!container) return;
    
    const customer = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMER) || '{}');
    const children = customer.children || [];
    const assessments = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHILDREN) || '[]');
    
    if (children.length === 0) {
        container.innerHTML = `
            <div class="no-reports">
                <i class="fas fa-child"></i>
                <h4>No Children Added</h4>
                <p>Add children to your profile to view their assessment reports.</p>
                <button class="btn btn-primary" onclick="closeViewReportsModal(); addNewChild();">
                    <i class="fas fa-plus"></i> Add Child
                </button>
            </div>
        `;
        return;
    }
    
    let reportsHTML = '<div class="reports-grid">';
    
    children.forEach(child => {
        const childAssessment = assessments.find(a => a.name === child.name);
        const hasAssessment = !!childAssessment;
        const hasReport = childAssessment && childAssessment.reportGenerated;
        
        let status = 'Available for Testing';
        let statusClass = 'status-available';
        let actionButtons = `
            <button class="btn btn-primary btn-small" onclick="startAssessment('${child.id}')">
                <i class="fas fa-play"></i> Start Assessment
            </button>
        `;
        
        if (hasAssessment && !hasReport) {
            status = 'Assessment Pending';
            statusClass = 'status-pending';
            actionButtons = `
                <button class="btn btn-secondary btn-small" disabled>
                    <i class="fas fa-clock"></i> Processing...
                </button>
            `;
        } else if (hasReport) {
            status = 'Report Ready';
            statusClass = 'status-completed';
            const assessmentDate = new Date(childAssessment.assessmentDate).toLocaleDateString();
            actionButtons = `
                <button class="btn btn-primary btn-small" onclick="viewChildReport('${child.id}')">
                    <i class="fas fa-eye"></i> View Report
                </button>
                <button class="btn btn-secondary btn-small" onclick="downloadReport('${child.id}')">
                    <i class="fas fa-download"></i> Download
                </button>
            `;
        }
        
        const initials = child.name.split(' ').map(n => n[0]).join('').toUpperCase();
        
        reportsHTML += `
            <div class="report-card">
                <div class="report-header">
                    <div class="child-info-card">
                        <div class="child-avatar-card">${initials}</div>
                        <div class="child-details-card">
                            <h4>${child.name}</h4>
                            <p>${child.age} years old • ${child.gender}</p>
                        </div>
                    </div>
                    <div class="report-status ${statusClass}">${status}</div>
                </div>
                
                ${child.interests ? `<p><strong>Interests:</strong> ${child.interests}</p>` : ''}
                ${hasReport ? `<p><strong>Assessment Date:</strong> ${assessmentDate}</p>` : ''}
                
                <div class="report-actions">
                    ${actionButtons}
                    <button class="btn btn-outline btn-small" onclick="editChild('${child.id}')">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                </div>
            </div>
        `;
    });
    
    reportsHTML += '</div>';
    container.innerHTML = reportsHTML;
}

/**
 * Edit customer profile
 */
function editProfile() {
    closeProfileMenu();
    openEditProfileModal();
}

/**
 * Open Edit Profile Modal
 */
function openEditProfileModal() {
    const modal = document.getElementById('editProfileModal');
    if (modal) {
        // Pre-fill form with current data
        const customer = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMER) || '{}');
        
        document.getElementById('editName').value = customer.name || '';
        document.getElementById('editEmail').value = customer.email || '';
        document.getElementById('editPhone').value = customer.phone || '';
        document.getElementById('editRelation').value = customer.relation || 'Parent';
        document.getElementById('editAddress').value = customer.address || '';
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Close Edit Profile Modal
 */
function closeEditProfileModal() {
    const modal = document.getElementById('editProfileModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

/**
 * Handle Edit Profile Form Submission
 */
function handleEditProfileForm(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const customer = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMER) || '{}');
    
    // Update customer data
    customer.name = formData.get('editName').trim();
    customer.email = formData.get('editEmail').trim();
    customer.phone = formData.get('editPhone').trim();
    customer.relation = formData.get('editRelation');
    customer.address = formData.get('editAddress').trim();
    
    // Validate required fields
    if (!customer.name || !customer.email) {
        alert('Name and email are required fields.');
        return;
    }
    
    // Save updated customer data
    localStorage.setItem(STORAGE_KEYS.CUSTOMER, JSON.stringify(customer));
    
    // Close modal and refresh profile
    closeEditProfileModal();
    updateNavbarProfile(customer);
    
    // Show success message
    showSuccessMessage('Profile updated successfully!');
}

/**
 * Download report for a child
 */
function downloadReport(childId) {
    const customer = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMER) || '{}');
    const child = customer.children?.find(c => c.id == childId);
    
    if (!child) return;
    
    const assessments = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHILDREN) || '[]');
    const assessment = assessments.find(a => a.name === child.name);
    
    if (assessment && assessment.report) {
        // Create downloadable HTML file
        const reportContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Assessment Report - ${child.name}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        h1 { color: #4F46E5; border-bottom: 2px solid #4F46E5; padding-bottom: 10px; }
        h3 { color: #4F46E5; margin-top: 30px; }
        .header { text-align: center; margin-bottom: 30px; }
        .career-recommendation { background: #F0F9FF; padding: 15px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #4F46E5; }
        .strength-item { background: #F0FDF4; padding: 8px; margin: 8px 0; border-radius: 4px; border-left: 3px solid #10B981; }
        @media print { body { margin: 20px; } }
    </style>
</head>
<body>
    <div class="header">
        <h1>EDUCE Assessment Report</h1>
        <p><strong>Child:</strong> ${child.name} | <strong>Age:</strong> ${child.age} | <strong>Date:</strong> ${new Date(assessment.assessmentDate).toLocaleDateString()}</p>
    </div>
    ${assessment.report}
    <footer style="margin-top: 40px; text-align: center; color: #666; border-top: 1px solid #eee; padding-top: 20px;">
        Generated by EDUCE - Professional Psychological Testing & Career Guidance
    </footer>
</body>
</html>
        `;
        
        // Create and download file
        const blob = new Blob([reportContent], { type: 'text/html' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `EDUCE_Report_${child.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        showSuccessMessage('Report downloaded successfully!');
    } else {
        alert('No report available for download.');
    }
}

/**
 * Start assessment for a child (placeholder)
 */
function startAssessment(childId) {
    const customer = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMER) || '{}');
    const child = customer.children?.find(c => c.id == childId);
    
    if (child) {
        alert(`Starting assessment for ${child.name}. This would redirect to the assessment platform. For now, this is a placeholder - the actual assessment would be conducted by psychologists.`);
    }
}

/**
 * Edit child information (placeholder)
 */
function editChild(childId) {
    const customer = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMER) || '{}');
    const child = customer.children?.find(c => c.id == childId);
    
    if (child) {
        alert(`Edit functionality for ${child.name} would open a form to update child information. This feature can be implemented similarly to the Add Child modal.`);
    }
}

/**
 * Logout customer
 */
function logoutCustomer() {
    closeProfileMenu();
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem(STORAGE_KEYS.CUSTOMER);
        localStorage.removeItem(STORAGE_KEYS.API_KEY);
        checkCustomerLogin(); // Refresh the navbar
        
        // Show success message
        showSuccessMessage('You have been logged out successfully.');
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// ========================================
// Enhanced Initialization
// ========================================

// Add customer login check to main initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the website
    initializeWebsite();
    
    // Check customer login status
    checkCustomerLogin();
    
    // Check URL parameters for special actions
    checkURLParameters();
    
    // Add Child Form
    const addChildForm = document.getElementById('addChildForm');
    if (addChildForm) {
        addChildForm.addEventListener('submit', handleAddChildForm);
    }
    
    // Edit Profile Form
    const editProfileForm = document.getElementById('editProfileForm');
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', handleEditProfileForm);
    }
    
    // Close modals when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-overlay')) {
            if (e.target.id === 'addChildModal') closeAddChildModal();
            if (e.target.id === 'editProfileModal') closeEditProfileModal();
            if (e.target.id === 'viewReportsModal') closeViewReportsModal();
            if (e.target.id === 'selectPsychologistModal') closeSelectPsychologistModal();
            if (e.target.id === 'interactiveGamesModal') closeGamesModal();
            // Close dynamic modals
            if (window.closeWelcomeModal && e.target.innerHTML.includes('Welcome to EDUCE')) {
                closeWelcomeModal();
            }
            if (window.closeQuickStartModal && e.target.innerHTML.includes('Start Assessment')) {
                closeQuickStartModal();
            }
        }
        
        // Close profile menu when clicking outside
        const profileDropdown = document.getElementById('profileDropdown');
        if (profileDropdown && !profileDropdown.contains(e.target)) {
            closeProfileMenu();
        }
    });
    
    // Close modals with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAddChildModal();
            closeEditProfileModal();
            closeViewReportsModal();
            closeSelectPsychologistModal();
            closeGamesModal();
            // Close dynamic modals
            if (window.closeWelcomeModal) closeWelcomeModal();
            if (window.closeQuickStartModal) closeQuickStartModal();
        }
    });
    
    // Update profile data every 30 seconds (in case data changes)
    setInterval(function() {
        const customer = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMER) || '{}');
        if (customer.role === 'customer') {
            updateNavbarProfile(customer);
        }
    }, 30000);
});

// ========================================
// Psychologist Selection System
// ========================================

/**
 * Select psychologist for a child
 */
function selectPsychologist(childId) {
    const customer = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMER) || '{}');
    const child = customer.children?.find(c => c.id == childId);
    
    if (!child) return;
    
    // Set selected child name in modal
    document.getElementById('selectedChildName').textContent = child.name;
    
    // Load psychologists list
    loadPsychologistsList(childId);
    
    // Show modal
    const modal = document.getElementById('selectPsychologistModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Close psychologist selection modal
 */
function closeSelectPsychologistModal() {
    const modal = document.getElementById('selectPsychologistModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

/**
 * Load list of available psychologists
 */
async function loadPsychologistsList(childId) {
    const psychologistsList = document.getElementById('psychologistsList');
    if (!psychologistsList) return;
    
    // Show loading state
    psychologistsList.innerHTML = `
        <div style="text-align: center; padding: 3rem; color: #6B7280;">
            <i class="fas fa-spinner fa-spin" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
            <p>Loading psychologists...</p>
        </div>
    `;
    
    try {
        // Get psychologists from API or storage
        const psychologists = await getPsychologists();
        
        if (psychologists.length === 0) {
            psychologistsList.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: #6B7280;">
                    <i class="fas fa-user-md" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
                    <p>No psychologists available at the moment. Please try again later.</p>
                </div>
            `;
            return;
        }
        
        psychologistsList.innerHTML = psychologists.map(psychologist => 
            createPsychologistCard(psychologist, childId)
        ).join('');
        
    } catch (error) {
        console.error('Error loading psychologists:', error);
        psychologistsList.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: #EF4444;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
                <p>Error loading psychologists. Please try again later.</p>
            </div>
        `;
    }
}

/**
 * Get list of psychologists (API-based with localStorage fallback)
 */
async function getPsychologists() {
    try {
        // Try API first
        if (typeof AdaptiveDataService !== 'undefined') {
            return await AdaptiveDataService.getPsychologists();
        }
        
        // Fallback to direct API call
        if (typeof educeAPI !== 'undefined') {
            return await educeAPI.getPsychologists();
        }
    } catch (error) {
        console.warn('API call failed, using localStorage fallback:', error);
    }
    
    // Final fallback to localStorage
    const allPsychologists = JSON.parse(localStorage.getItem(STORAGE_KEYS.PSYCHOLOGISTS) || '[]');
    
    // If no psychologists in storage, initialize with default approved ones
    if (allPsychologists.length === 0) {
        const defaultPsychologists = [
            {
                id: 'psy001',
                psychologist_id: 'psy001',
                name: 'Dr. Sarah Johnson',
                title: 'Child Psychologist',
                specializations: ['Child Development', 'Learning Disabilities', 'ADHD'],
                experience: '8 years',
                rating: 4.9,
                completed_assessments: 245,
                description: 'Specializes in child development and learning assessment with a focus on personalized approaches.',
                available: true,
                approved: true,
                approved_by: 'Super Admin',
                approved_date: new Date().toISOString(),
                registration_date: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 'psy002',
                psychologist_id: 'psy002',
                name: 'Dr. Michael Chen',
                title: 'Educational Psychologist',
                specializations: ['Educational Assessment', 'Career Guidance', 'Gifted Children'],
                experience: '12 years',
                rating: 4.8,
                completed_assessments: 389,
                description: 'Expert in educational psychology and career guidance for children and adolescents.',
                available: true,
                approved: true,
                approved_by: 'Super Admin',
                approved_date: new Date().toISOString(),
                registration_date: new Date(Date.now() - 730 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                id: 'psy003',
                psychologist_id: 'psy003',
                name: 'Dr. Emily Rodriguez',
                title: 'Clinical Child Psychologist',
                specializations: ['Autism Spectrum', 'Behavioral Assessment', 'Social Skills'],
                experience: '6 years',
                rating: 4.7,
                completed_assessments: 156,
                description: 'Focuses on autism spectrum disorders and behavioral assessments with evidence-based methods.',
                available: true,
                approved: true,
                approved_by: 'Super Admin',
                approved_date: new Date().toISOString(),
                registration_date: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString()
            }
        ];
        
        localStorage.setItem(STORAGE_KEYS.PSYCHOLOGISTS, JSON.stringify(defaultPsychologists));
        return defaultPsychologists.filter(p => p.approved === true);
    }
    
    // Return only approved psychologists for customer selection
    return allPsychologists.filter(p => p.approved === true);
}

/**
 * Get all psychologists (for admin panel)
 */
function getAllPsychologists() {
    const allPsychologists = JSON.parse(localStorage.getItem(STORAGE_KEYS.PSYCHOLOGISTS) || '[]');
    
    // Initialize if empty
    if (allPsychologists.length === 0) {
        getPsychologists(); // This will initialize the data
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.PSYCHOLOGISTS) || '[]');
    }
    
    return allPsychologists;
}

/**
 * Create psychologist card HTML
 */
function createPsychologistCard(psychologist, childId) {
    const initials = psychologist.name.split(' ').map(n => n[0]).join('');
    
    return `
        <div class="psychologist-card" data-psychologist-id="${psychologist.id}" data-child-id="${childId}">
            <div class="psychologist-header">
                <div class="psychologist-avatar">${initials}</div>
                <div class="psychologist-info">
                    <h4>${psychologist.name}</h4>
                    <p>${psychologist.title}</p>
                </div>
            </div>
            
            <div class="psychologist-details">
                <p>${psychologist.description}</p>
            </div>
            
            <div class="psychologist-specializations">
                ${psychologist.specializations.map(spec => 
                    `<span class="specialization-tag">${spec}</span>`
                ).join('')}
            </div>
            
            <div class="psychologist-stats">
                <div class="stat-item-small">
                    <span class="stat-number-small">${psychologist.experience}</span>
                    <span class="stat-label-small">Experience</span>
                </div>
                <div class="stat-item-small">
                    <span class="stat-number-small">${psychologist.rating}</span>
                    <span class="stat-label-small">Rating</span>
                </div>
                <div class="stat-item-small">
                    <span class="stat-number-small">${psychologist.completedAssessments}</span>
                    <span class="stat-label-small">Assessments</span>
                </div>
            </div>
            
            <button class="request-psychologist-btn" onclick="requestPsychologist('${psychologist.id}', '${childId}')">
                Request Assessment
            </button>
        </div>
    `;
}

/**
 * Request psychologist for a child
 */
function requestPsychologist(psychologistId, childId) {
    const customer = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMER) || '{}');
    const child = customer.children?.find(c => c.id == childId);
    const psychologists = getPsychologists();
    const psychologist = psychologists.find(p => p.id === psychologistId);
    
    if (!child || !psychologist) return;
    
    // Create request
    const request = {
        id: 'req_' + Date.now(),
        childId: childId,
        childName: child.name,
        childAge: child.age,
        psychologistId: psychologistId,
        psychologistName: psychologist.name,
        customerId: customer.id || customer.email,
        customerName: customer.name,
        customerEmail: customer.email,
        status: 'pending',
        requestDate: new Date().toISOString(),
        childInterests: child.interests || '',
        childNotes: child.notes || ''
    };
    
    // Save request to storage
    const requests = JSON.parse(localStorage.getItem(STORAGE_KEYS.REQUESTS) || '[]');
    requests.push(request);
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
    
    // Update child status
    child.status = 'pending';
    child.psychologistId = psychologistId;
    child.requestId = request.id;
    localStorage.setItem(STORAGE_KEYS.CUSTOMER, JSON.stringify(customer));
    
    // Close modal and show success
    closeSelectPsychologistModal();
    showSuccessMessage(`Request sent to ${psychologist.name} for ${child.name}'s assessment!`);
    
    // Refresh reports modal if open
    const reportsModal = document.getElementById('viewReportsModal');
    if (reportsModal && reportsModal.classList.contains('active')) {
        populateReportsModal();
    }
}

// ========================================
// Interactive Games System
// ========================================

let currentGame = 0;
let gameAnswers = [];
let gameData = [];

/**
 * Start interactive games for a child
 */
function startInteractiveGames(childId) {
    const customer = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMER) || '{}');
    const child = customer.children?.find(c => c.id == childId);
    
    if (!child || child.status !== 'accepted') {
        alert('Assessment must be approved by psychologist first.');
        return;
    }
    
    // Initialize games
    initializeGames();
    
    // Show games modal
    const modal = document.getElementById('interactiveGamesModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    // Store current child ID
    window.currentChildId = childId;
}

/**
 * Close games modal
 */
function closeGamesModal() {
    const modal = document.getElementById('interactiveGamesModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    // Reset game state
    currentGame = 0;
    gameAnswers = [];
    window.currentChildId = null;
}

/**
 * Initialize games data
 */
function initializeGames() {
    gameData = [
        {
            title: "Color Preferences",
            description: "Which colors do you like the most?",
            type: "multiple",
            questions: [
                {
                    text: "Which color makes you feel happiest?",
                    options: ["Red", "Blue", "Green", "Yellow", "Purple"],
                    category: "emotional"
                }
            ]
        },
        {
            title: "Activity Choices", 
            description: "What activities do you enjoy?",
            type: "multiple",
            questions: [
                {
                    text: "What would you prefer to do in your free time?",
                    options: ["Read books", "Play sports", "Draw/Paint", "Build things", "Play music"],
                    category: "interests"
                }
            ]
        },
        {
            title: "Problem Solving",
            description: "Let's see how you think!",
            type: "logic",
            questions: [
                {
                    text: "If you have 5 apples and give away 2, how many do you have left?",
                    options: ["2", "3", "4", "5"],
                    correct: "3",
                    category: "logical"
                }
            ]
        },
        {
            title: "Social Situations",
            description: "How do you interact with others?",
            type: "social",
            questions: [
                {
                    text: "When meeting new people, you prefer to:",
                    options: ["Talk to them right away", "Wait for them to talk first", "Observe them quietly", "Ask a friend to introduce you"],
                    category: "social"
                }
            ]
        },
        {
            title: "Learning Styles",
            description: "How do you like to learn new things?",
            type: "learning",
            questions: [
                {
                    text: "When learning something new, what helps you most?",
                    options: ["Seeing pictures or videos", "Listening to explanations", "Doing hands-on activities", "Reading about it"],
                    category: "learning"
                }
            ]
        }
    ];
}

/**
 * Start the games
 */
function startGames() {
    currentGame = 0;
    gameAnswers = [];
    
    document.getElementById('gamesIntro').style.display = 'none';
    document.getElementById('gamesContainer').style.display = 'block';
    
    displayCurrentGame();
}

/**
 * Display current game
 */
function displayCurrentGame() {
    const container = document.getElementById('gamesContainer');
    const game = gameData[currentGame];
    const question = game.questions[0]; // For simplicity, using first question
    
    const progress = ((currentGame + 1) / gameData.length) * 100;
    
    container.innerHTML = `
        <div class="game-container">
            <div class="game-header">
                <h3 class="game-title">${game.title}</h3>
                <p class="game-description">${game.description}</p>
                <div class="game-progress">
                    <div class="game-progress-fill" style="width: ${progress}%"></div>
                </div>
                <p style="text-align: center; color: #6B7280; font-size: 0.875rem;">
                    Question ${currentGame + 1} of ${gameData.length}
                </p>
            </div>
            
            <div class="game-question">
                <p class="question-text">${question.text}</p>
                <div class="answer-options">
                    ${question.options.map((option, index) => `
                        <div class="answer-option" onclick="selectAnswer(${index}, '${option}')">
                            ${option}
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="game-controls">
                <div class="game-navigation">
                    ${currentGame > 0 ? `<button class="btn btn-secondary" onclick="previousGame()">Previous</button>` : ''}
                    <button class="btn btn-primary" id="nextBtn" onclick="nextGame()" style="display: none;">
                        ${currentGame === gameData.length - 1 ? 'Finish' : 'Next'}
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Select an answer
 */
function selectAnswer(index, answer) {
    // Remove previous selection
    document.querySelectorAll('.answer-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Add selection to clicked option
    event.target.classList.add('selected');
    
    // Store answer
    const game = gameData[currentGame];
    gameAnswers[currentGame] = {
        gameTitle: game.title,
        question: game.questions[0].text,
        answer: answer,
        category: game.questions[0].category,
        timestamp: new Date().toISOString()
    };
    
    // Show next button
    document.getElementById('nextBtn').style.display = 'block';
}

/**
 * Go to next game
 */
function nextGame() {
    if (!gameAnswers[currentGame]) {
        alert('Please select an answer first.');
        return;
    }
    
    currentGame++;
    
    if (currentGame >= gameData.length) {
        finishGames();
    } else {
        displayCurrentGame();
    }
}

/**
 * Go to previous game
 */
function previousGame() {
    if (currentGame > 0) {
        currentGame--;
        displayCurrentGame();
    }
}

/**
 * Finish games and save results
 */
function finishGames() {
    const customer = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMER) || '{}');
    const child = customer.children?.find(c => c.id == window.currentChildId);
    
    if (!child) return;
    
    // Create game results
    const gameResults = {
        childId: window.currentChildId,
        childName: child.name,
        answers: gameAnswers,
        completedDate: new Date().toISOString(),
        psychologistId: child.psychologistId
    };
    
    // Save results
    const allResults = JSON.parse(localStorage.getItem(STORAGE_KEYS.GAME_RESULTS) || '[]');
    allResults.push(gameResults);
    localStorage.setItem(STORAGE_KEYS.GAME_RESULTS, JSON.stringify(allResults));
    
    // Update child status
    child.status = 'games_completed';
    localStorage.setItem(STORAGE_KEYS.CUSTOMER, JSON.stringify(customer));
    
    // Show completion message
    document.getElementById('gamesContainer').innerHTML = `
        <div style="text-align: center; padding: 3rem;">
            <i class="fas fa-check-circle" style="font-size: 4rem; color: #10B981; margin-bottom: 1rem;"></i>
            <h3 style="color: #1F2937; margin-bottom: 1rem;">Assessment Complete!</h3>
            <p style="color: #6B7280; margin-bottom: 2rem;">
                Great job ${child.name}! Your psychologist will review your responses and create a personalized report.
            </p>
            <button class="btn btn-primary" onclick="closeGamesModal()">Close</button>
        </div>
    `;
    
    showSuccessMessage('Interactive assessment completed successfully!');
}

// ========================================
// Updated Report Functions
// ========================================

/**
 * Enhanced populateReportsModal with psychologist selection
 */
function populateReportsModal() {
    const reportsContainer = document.getElementById('reportsContainer');
    const customer = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMER) || '{}');
    
    if (!customer.children || customer.children.length === 0) {
        reportsContainer.innerHTML = `
            <div class="no-reports">
                <i class="fas fa-user-plus"></i>
                <h4>No Children Added</h4>
                <p>Add your first child to get started with assessments.</p>
                <button class="btn btn-primary" onclick="closeViewReportsModal(); addNewChild();">Add Child</button>
            </div>
        `;
        return;
    }
    
    const reportsHTML = customer.children.map(child => {
        const assessments = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHILDREN) || '[]');
        const assessment = assessments.find(a => a.name === child.name);
        let statusHTML = '';
        let actionsHTML = '';
        
        // Determine status and actions based on child's current state
        switch (child.status) {
            case 'pending':
                statusHTML = '<span class="report-status status-pending">Psychologist Review Pending</span>';
                actionsHTML = '<button class="btn btn-secondary btn-small" disabled>Waiting for Approval</button>';
                break;
            case 'accepted':
                statusHTML = '<span class="report-status status-available">Ready for Assessment</span>';
                actionsHTML = `<button class="btn btn-primary btn-small" onclick="startInteractiveGames('${child.id}')">Start Games</button>`;
                break;
            case 'games_completed':
                statusHTML = '<span class="report-status status-pending">Analysis in Progress</span>';
                actionsHTML = '<button class="btn btn-secondary btn-small" disabled>Awaiting Report</button>';
                break;
            case 'completed':
                statusHTML = '<span class="report-status status-completed">Assessment Complete</span>';
                actionsHTML = `
                    <button class="btn btn-primary btn-small" onclick="viewChildReport('${child.id}')">View Report</button>
                    <button class="btn btn-secondary btn-small" onclick="downloadReport('${child.id}')">Download</button>
                `;
                break;
            default:
                statusHTML = '<span class="report-status status-available">Ready to Select Psychologist</span>';
                actionsHTML = `<button class="btn btn-primary btn-small" onclick="selectPsychologist('${child.id}')">Select Psychologist</button>`;
        }
        
        return `
            <div class="report-card">
                <div class="report-header">
                    <div class="child-info-card">
                        <div class="child-avatar-card">${child.name.split(' ').map(n => n[0]).join('')}</div>
                        <div class="child-details-card">
                            <h4>${child.name}</h4>
                            <p>${child.age} years old • ${child.gender}</p>
                        </div>
                    </div>
                    ${statusHTML}
                </div>
                <div class="report-actions">
                    ${actionsHTML}
                </div>
            </div>
        `;
    }).join('');
    
    reportsContainer.innerHTML = `<div class="reports-grid">${reportsHTML}</div>`;
}

// ========================================
// Enhanced Start Now Function
// ========================================

/**
 * Handle Start Now button click
 */
function handleStartNow() {
    const customer = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMER) || '{}');
    
    // Check if customer is logged in
    if (!customer.role || customer.role !== 'customer') {
        // Not logged in, redirect to login with start_now parameter
        window.location.href = 'customer-login.html?start_now=true';
        return;
    }
    
    // Customer is logged in, check if they have children
    const children = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHILDREN) || '[]');
    const customerChildren = children.filter(child => child.parentId === customer.id || child.parentEmail === customer.email);
    
    if (customerChildren.length === 0) {
        // No children, show add child modal first
        showStartWithAddChild();
        return;
    }
    
    // Has children, show psychologist selection modal
    console.log('🎯 Customer has children, showing psychologist selection...');
    showPsychologistSelectionModal();
}

/**
 * Check URL parameters and handle start_now
 */
function checkURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const startNow = urlParams.get('start_now');
    
    if (startNow === 'true') {
        // Clear the URL parameter
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Wait a bit for the page to load, then trigger start now
        setTimeout(() => {
            handleStartNow();
        }, 500);
    }
}

/**
 * Show add child modal for new users
 */
function showStartWithAddChild() {
    // Show a welcome message first
    const welcomeModal = document.createElement('div');
    welcomeModal.className = 'modal-overlay active';
    welcomeModal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-rocket"></i> Welcome to EDUCE!</h3>
            </div>
            <div class="modal-body" style="text-align: center; padding: 2rem;">
                <i class="fas fa-child" style="font-size: 3rem; color: #2563EB; margin-bottom: 1rem;"></i>
                <h4>Let's get started!</h4>
                <p style="color: #6B7280; margin-bottom: 2rem;">
                    To begin your child's psychological assessment journey, 
                    first add your child's information.
                </p>
                <div style="display: flex; gap: 1rem; justify-content: center;">
                    <button class="btn btn-secondary" onclick="closeWelcomeModal()">
                        Not Now
                    </button>
                    <button class="btn btn-primary" onclick="closeWelcomeModal(); openAddChildModal();">
                        <i class="fas fa-plus"></i> Add My Child
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(welcomeModal);
    document.body.style.overflow = 'hidden';
    
    // Auto close function
    window.closeWelcomeModal = function() {
        document.body.removeChild(welcomeModal);
        document.body.style.overflow = 'auto';
    };
}

/**
 * Show quick start modal for existing users
 */
function showQuickStartModal() {
    const customer = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMER) || '{}');
    
    const quickStartModal = document.createElement('div');
    quickStartModal.className = 'modal-overlay active';
    quickStartModal.innerHTML = `
        <div class="modal-content large-modal">
            <div class="modal-header">
                <h3><i class="fas fa-rocket"></i> Start Assessment</h3>
                <button class="modal-close" onclick="closeQuickStartModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <p style="color: #6B7280; margin-bottom: 1.5rem; text-align: center;">
                    Choose a child to start their psychological assessment with a qualified psychologist.
                </p>
                <div id="quickStartChildrenList">
                    ${customer.children.map(child => createQuickStartChildCard(child)).join('')}
                </div>
                <div style="text-align: center; margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #E5E7EB;">
                    <button class="btn btn-secondary" onclick="openAddChildModal(); closeQuickStartModal();">
                        <i class="fas fa-plus"></i> Add Another Child
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(quickStartModal);
    document.body.style.overflow = 'hidden';
    
    // Auto close function
    window.closeQuickStartModal = function() {
        document.body.removeChild(quickStartModal);
        document.body.style.overflow = 'auto';
    };
}

/**
 * Create quick start child card
 */
function createQuickStartChildCard(child) {
    let statusText = '';
    let actionButton = '';
    let statusClass = 'status-available';
    
    switch (child.status) {
        case 'pending':
            statusText = 'Psychologist Review Pending';
            statusClass = 'status-pending';
            actionButton = '<button class="btn btn-secondary btn-small" disabled>Waiting for Approval</button>';
            break;
        case 'accepted':
            statusText = 'Ready for Assessment';
            statusClass = 'status-available';
            actionButton = `<button class="btn btn-primary btn-small" onclick="startInteractiveGames('${child.id}'); closeQuickStartModal();">Start Games</button>`;
            break;
        case 'games_completed':
            statusText = 'Analysis in Progress';
            statusClass = 'status-pending';
            actionButton = '<button class="btn btn-secondary btn-small" disabled>Awaiting Report</button>';
            break;
        case 'completed':
            statusText = 'Assessment Complete';
            statusClass = 'status-completed';
            actionButton = `<button class="btn btn-primary btn-small" onclick="viewChildReport('${child.id}'); closeQuickStartModal();">View Report</button>`;
            break;
        default:
            statusText = 'Ready to Select Psychologist';
            statusClass = 'status-available';
            actionButton = `<button class="btn btn-primary btn-small" onclick="selectPsychologist('${child.id}'); closeQuickStartModal();">Select Psychologist</button>`;
    }
    
    return `
        <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 0.75rem; padding: 1.5rem; margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #2563EB 0%, #3B82F6 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 1.1rem;">
                        ${child.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                        <h4 style="margin: 0; font-weight: 600; color: #1F2937;">${child.name}</h4>
                        <p style="margin: 0.25rem 0 0 0; color: #6B7280; font-size: 0.875rem;">${child.age} years old • ${child.gender}</p>
                    </div>
                </div>
                <span class="report-status ${statusClass}" style="padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 500;">
                    ${statusText}
                </span>
            </div>
            
            <div style="display: flex; gap: 0.75rem; justify-content: flex-end;">
                ${actionButton}
            </div>
        </div>
    `;
}

// ========================================
// Customer Profile Navbar Functions
// ========================================

/**
 * Check if customer is logged in and update navbar
 */
function checkCustomerLogin() {
    const customer = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMER) || '{}');
    const customerEDUCE = JSON.parse(localStorage.getItem('EDUCE_customer') || '{}');
    
    // Check both storage formats
    const currentCustomer = customer.role === 'customer' ? customer : 
                          customerEDUCE.role === 'customer' ? customerEDUCE : null;
    
    if (currentCustomer) {
        console.log('✅ Customer logged in:', currentCustomer.email);
        updateNavbarProfile(currentCustomer);
        hideGuestButtons();
    } else {
        console.log('👤 No customer logged in, showing guest buttons');
        hideProfileDropdown();
        showGuestButtons();
    }
}

/**
 * Update navbar with customer profile information
 */
function updateNavbarProfile(customer) {
    const profileDropdown = document.getElementById('profileDropdown');
    const navUserAvatar = document.getElementById('navUserAvatar');
    const navUserName = document.getElementById('navUserName');
    
    if (!profileDropdown || !navUserAvatar || !navUserName) {
        console.log('⚠️ Profile dropdown elements not found');
        return;
    }
    
    // Show profile dropdown
    profileDropdown.style.display = 'block';
    
    // Update user info
    const fullName = customer.firstName && customer.lastName ? 
                    `${customer.firstName} ${customer.lastName}` : 
                    customer.name || customer.email.split('@')[0];
    
    navUserAvatar.textContent = fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    navUserName.textContent = fullName;
    
    // Load customer children and stats
    loadCustomerProfileData(customer);
}

/**
 * Load customer profile data (children, stats, etc.)
 */
function loadCustomerProfileData(customer) {
    const children = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHILDREN) || '[]');
    const customerChildren = children.filter(child => child.parentId === customer.id || child.parentEmail === customer.email);
    
    // Update profile menu content
    const profileMenu = document.getElementById('profileMenu');
    if (!profileMenu) return;
    
    const completedAssessments = customerChildren.filter(child => child.status === 'completed').length;
    const pendingAssessments = customerChildren.filter(child => child.status === 'pending').length;
    
    profileMenu.innerHTML = `
        <div class="profile-info">
            <div class="profile-header">
                <div class="profile-avatar-large">${customer.firstName ? customer.firstName[0] + customer.lastName[0] : customer.email[0].toUpperCase()}</div>
                <div class="profile-details">
                    <h3>${customer.firstName ? customer.firstName + ' ' + customer.lastName : customer.email}</h3>
                    <p>${customer.email}</p>
                </div>
            </div>
            
            <div class="profile-stats">
                <div class="stat-item">
                    <span class="stat-number">${customerChildren.length}</span>
                    <span class="stat-label">Children</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">${completedAssessments}</span>
                    <span class="stat-label">Completed</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">${pendingAssessments}</span>
                    <span class="stat-label">Pending</span>
                </div>
            </div>
            
            <div class="profile-actions">
                <button class="btn btn-primary btn-full" onclick="showAddChildModal()">
                    <i class="fas fa-plus"></i> Add New Child
                </button>
                <button class="btn btn-outline btn-full" onclick="viewAllReports()">
                    <i class="fas fa-chart-line"></i> View All Reports
                </button>
                <button class="btn btn-outline btn-full" onclick="editCustomerProfile()">
                    <i class="fas fa-edit"></i> Edit Profile
                </button>
                <button class="btn btn-outline btn-full" onclick="logoutCustomer()">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </button>
            </div>
        </div>
        
        <div class="children-list">
            <h4>Your Children</h4>
            ${customerChildren.length > 0 ? 
                customerChildren.map(child => `
                    <div class="child-item">
                        <div class="child-info">
                            <div class="child-avatar">${child.name[0]}</div>
                            <div class="child-details">
                                <h5>${child.name}</h5>
                                <p>${child.age} years old • ${child.grade}</p>
                                <span class="status-badge status-${child.status}">${child.status}</span>
                            </div>
                        </div>
                        <div class="child-actions">
                            <button class="btn btn-small" onclick="viewChildReport('${child.id}')">
                                <i class="fas fa-eye"></i> View
                            </button>
                        </div>
                    </div>
                `).join('') : 
                '<p class="no-children">No children added yet. Click "Add New Child" to get started.</p>'
            }
        </div>
    `;
}

/**
 * Toggle profile dropdown menu
 */
function toggleProfile() {
    const profileMenu = document.getElementById('profileMenu');
    if (!profileMenu) return;
    
    profileMenuOpen = !profileMenuOpen;
    profileMenu.style.display = profileMenuOpen ? 'block' : 'none';
}

/**
 * Hide profile dropdown
 */
function hideProfileDropdown() {
    const profileDropdown = document.getElementById('profileDropdown');
    if (profileDropdown) {
        profileDropdown.style.display = 'none';
    }
}

/**
 * Show guest buttons
 */
function showGuestButtons() {
    const guestButtons = document.getElementById('guestButtons');
    if (guestButtons) {
        guestButtons.style.display = 'block';
    }
}

/**
 * Hide guest buttons
 */
function hideGuestButtons() {
    const guestButtons = document.getElementById('guestButtons');
    if (guestButtons) {
        guestButtons.style.display = 'none';
    }
}

/**
 * Logout customer
 */
function logoutCustomer() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem(STORAGE_KEYS.CUSTOMER);
        localStorage.removeItem('EDUCE_customer');
        window.location.reload();
    }
}

/**
 * Edit customer profile
 */
function editCustomerProfile() {
    alert('Profile editing functionality will be implemented soon.');
}

/**
 * View all reports
 */
function viewAllReports() {
    const customer = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMER) || '{}');
    const children = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHILDREN) || '[]');
    const customerChildren = children.filter(child => child.parentId === customer.id || child.parentEmail === customer.email);
    
    if (customerChildren.length === 0) {
        alert('No children found. Please add a child first.');
        return;
    }
    
    showAllReportsModal(customerChildren);
}

/**
 * Show all reports modal
 */
function showAllReportsModal(children) {
    const gameResults = JSON.parse(localStorage.getItem(STORAGE_KEYS.GAME_RESULTS) || '[]');
    const analyses = JSON.parse(localStorage.getItem('educe_analyses') || '[]');
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 1000px; max-height: 90vh; overflow-y: auto;">
            <div class="modal-header">
                <h3><i class="fas fa-chart-bar"></i> All Children Reports</h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            
            <div style="padding: 2rem;">
                <div style="display: grid; gap: 2rem;">
                    ${children.map(child => {
                        const childGameResults = gameResults.filter(r => r.childId === child.id);
                        const childAnalyses = analyses.filter(a => a.childId === child.id);
                        const avgScore = childGameResults.length > 0 ? 
                            Math.round(childGameResults.reduce((sum, r) => sum + (r.results?.totalScore || 0), 0) / childGameResults.length) : 0;
                        
                        return `
                            <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 1rem; padding: 2rem;">
                                <!-- Child Header -->
                                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem;">
                                    <div style="display: flex; align-items: center; gap: 1rem;">
                                        <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #2563EB 0%, #3B82F6 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 1.2rem;">
                                            ${child.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <h4 style="margin: 0; color: #1F2937; font-size: 1.25rem;">${child.name}</h4>
                                            <p style="margin: 0.25rem 0 0 0; color: #6B7280;">${child.age} years old • ${child.grade}</p>
                                        </div>
                                    </div>
                                    <div style="text-align: right;">
                                        <div style="background: ${avgScore >= 80 ? '#10B981' : avgScore >= 60 ? '#F59E0B' : '#EF4444'}; color: white; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 600;">
                                            ${avgScore}% Average
                                        </div>
                                        <span class="status-badge status-${child.status}" style="margin-top: 0.5rem;">
                                            ${child.status === 'completed' ? 'Completed' : child.status === 'pending' ? 'Pending' : 'Ready'}
                                        </span>
                                    </div>
                                </div>
                                
                                <!-- Quick Stats -->
                                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                                    <div style="background: white; padding: 1rem; border-radius: 0.5rem; text-align: center;">
                                        <div style="font-size: 1.5rem; font-weight: 600; color: #2563EB;">${childGameResults.length}</div>
                                        <div style="font-size: 0.875rem; color: #6B7280;">Tests Taken</div>
                                    </div>
                                    <div style="background: white; padding: 1rem; border-radius: 0.5rem; text-align: center;">
                                        <div style="font-size: 1.5rem; font-weight: 600; color: #10B981;">${childAnalyses.length}</div>
                                        <div style="font-size: 0.875rem; color: #6B7280;">Analyses</div>
                                    </div>
                                    <div style="background: white; padding: 1rem; border-radius: 0.5rem; text-align: center;">
                                        <div style="font-size: 1.5rem; font-weight: 600; color: #F59E0B;">${avgScore}%</div>
                                        <div style="font-size: 0.875rem; color: #6B7280;">Avg Score</div>
                                    </div>
                                </div>
                                
                                <!-- Recent Activity -->
                                <div style="margin-bottom: 1.5rem;">
                                    <h5 style="color: #1F2937; margin-bottom: 1rem;">Recent Activity</h5>
                                    ${[...childGameResults.slice(-2), ...childAnalyses.slice(-1)].sort((a, b) => 
                                        new Date(b.completedAt || b.createdAt) - new Date(a.completedAt || a.createdAt)
                                    ).slice(0, 3).map(item => `
                                        <div style="background: white; border-left: 4px solid ${item.gameType ? '#2563EB' : '#10B981'}; padding: 1rem; margin-bottom: 0.5rem; border-radius: 0 0.25rem 0.25rem 0;">
                                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                                <div>
                                                    <strong>${item.gameType || 'Professional Analysis'}</strong>
                                                    ${item.results?.totalScore ? `<span style="color: #059669; margin-left: 1rem;">${item.results.totalScore}%</span>` : ''}
                                                </div>
                                                <span style="color: #6B7280; font-size: 0.875rem;">
                                                    ${new Date(item.completedAt || item.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    `).join('') || '<p style="color: #9CA3AF; text-align: center; padding: 1rem;">No recent activity</p>'}
                                </div>
                                
                                <!-- Actions -->
                                <div style="display: flex; gap: 1rem; justify-content: center;">
                                    <button class="btn btn-primary btn-small" onclick="viewChildReport('${child.id}'); this.closest('.modal').remove();">
                                        <i class="fas fa-eye"></i> View Full Report
                                    </button>
                                    <button class="btn btn-outline btn-small" onclick="selectPsychologistForChild('${child.id}'); this.closest('.modal').remove();">
                                        <i class="fas fa-user-md"></i> Select Psychologist
                                    </button>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

/**
 * View child report
 */
function viewChildReport(childId) {
    const children = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHILDREN) || '[]');
    const child = children.find(c => c.id === childId);
    
    if (!child) {
        alert('Child not found!');
        return;
    }

    // Get child's test results and analyses
    const gameResults = JSON.parse(localStorage.getItem(STORAGE_KEYS.GAME_RESULTS) || '[]');
    const analyses = JSON.parse(localStorage.getItem('educe_analyses') || '[]');
    
    const childGameResults = gameResults.filter(r => r.childId === childId);
    const childAnalyses = analyses.filter(a => a.childId === childId);
    
    showChildReportModal(child, childGameResults, childAnalyses);
}

/**
 * Show child report modal
 */
function showChildReportModal(child, gameResults, analyses) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 800px; max-height: 90vh; overflow-y: auto;">
            <div class="modal-header">
                <h3><i class="fas fa-chart-line"></i> ${child.name}'s Report</h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            
            <div style="padding: 2rem;">
                <!-- Child Info -->
                <div style="background: #F9FAFB; padding: 1.5rem; border-radius: 0.75rem; margin-bottom: 2rem;">
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                        <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #2563EB 0%, #3B82F6 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 1.2rem;">
                            ${child.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                            <h4 style="margin: 0; color: #1F2937;">${child.name}</h4>
                            <p style="margin: 0.25rem 0 0 0; color: #6B7280;">${child.age} years old • ${child.grade}</p>
                            <span class="status-badge status-${child.status}" style="margin-top: 0.5rem;">
                                ${child.status === 'completed' ? 'Assessment Completed' : child.status === 'pending' ? 'Assessment Pending' : 'Ready for Assessment'}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Game Results -->
                <div style="margin-bottom: 2rem;">
                    <h4 style="color: #1F2937; margin-bottom: 1rem;"><i class="fas fa-gamepad"></i> Interactive Test Results</h4>
                    ${gameResults.length > 0 ? gameResults.map(result => `
                        <div style="background: white; border: 1px solid #E5E7EB; border-radius: 0.5rem; padding: 1.5rem; margin-bottom: 1rem;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                                <h5 style="margin: 0; color: #1F2937;">${result.gameType}</h5>
                                <span style="color: #059669; font-weight: 600;">${result.results?.totalScore || 0}%</span>
                            </div>
                            <div style="display: flex; gap: 2rem; color: #6B7280; font-size: 0.875rem;">
                                <div>⏱️ Duration: ${Math.round((result.results?.totalTime || 0) / 1000)}s</div>
                                <div>📅 Date: ${new Date(result.completedAt).toLocaleDateString()}</div>
                            </div>
                        </div>
                    `).join('') : '<p style="color: #9CA3AF; text-align: center; padding: 2rem;">No test results available yet.</p>'}
                </div>

                <!-- AI Analysis Results -->
                <div style="margin-bottom: 2rem;">
                    <h4 style="color: #1F2937; margin-bottom: 1rem;"><i class="fas fa-brain"></i> Professional Analysis</h4>
                    ${analyses.length > 0 ? analyses.map(analysis => `
                        <div style="background: white; border: 1px solid #E5E7EB; border-radius: 0.5rem; padding: 1.5rem; margin-bottom: 1rem;">
                            <div style="margin-bottom: 1rem;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                                    <h5 style="margin: 0; color: #1F2937;">Psychologist Analysis</h5>
                                    <span style="color: #6B7280; font-size: 0.875rem;">${new Date(analysis.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div style="background: #F0F9FF; border-left: 4px solid #0EA5E9; padding: 1rem; border-radius: 0.25rem;">
                                <p style="margin: 0; color: #0C4A6E; line-height: 1.6;">${analysis.recommendation}</p>
                            </div>
                        </div>
                    `).join('') : '<p style="color: #9CA3AF; text-align: center; padding: 2rem;">No professional analysis available yet.</p>'}
                </div>

                <!-- Actions -->
                <div style="display: flex; gap: 1rem; justify-content: center;">
                    <button class="btn btn-primary" onclick="selectPsychologistForChild('${child.id}'); this.closest('.modal').remove();">
                        <i class="fas fa-user-md"></i> Select/Change Psychologist
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

/**
 * Select psychologist for specific child
 */
function selectPsychologistForChild(childId) {
    const children = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHILDREN) || '[]');
    const child = children.find(c => c.id === childId);
    
    if (!child) {
        alert('Child not found!');
        return;
    }
    
    showPsychologistSelectionModal(child);
}

/**
 * Show psychologist selection modal
 */
function showPsychologistSelectionModal(selectedChild = null) {
    // Get approved psychologists
    const psychologists = JSON.parse(localStorage.getItem('EDUCE_psychologists') || '[]');
    const approvedPsychologists = psychologists.filter(p => p.approved === true);
    
    if (approvedPsychologists.length === 0) {
        alert('No approved psychologists available at the moment. Please try again later.');
        return;
    }

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 900px; max-height: 90vh; overflow-y: auto;">
            <div class="modal-header">
                <h3><i class="fas fa-user-md"></i> Choose a Psychologist${selectedChild ? ` for ${selectedChild.name}` : ''}</h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            
            <div style="padding: 2rem;">
                ${selectedChild ? `
                    <div style="background: #F0F9FF; border: 1px solid #0EA5E9; border-radius: 0.75rem; padding: 1.5rem; margin-bottom: 2rem;">
                        <div style="display: flex; align-items: center; gap: 1rem;">
                            <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #2563EB 0%, #3B82F6 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600;">
                                ${selectedChild.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                                <h4 style="margin: 0; color: #1F2937;">${selectedChild.name}</h4>
                                <p style="margin: 0.25rem 0 0 0; color: #6B7280;">${selectedChild.age} years old • ${selectedChild.grade}</p>
                            </div>
                        </div>
                    </div>
                ` : ''}
                
                <p style="color: #6B7280; margin-bottom: 2rem;">Choose from our qualified and approved psychologists:</p>
                
                <div class="psychologists-grid" style="display: grid; gap: 1.5rem;">
                    ${approvedPsychologists.map(psychologist => `
                        <div class="psychologist-card" style="background: white; border: 2px solid #E5E7EB; border-radius: 1rem; padding: 2rem; cursor: pointer; transition: all 0.3s ease;" 
                             onclick="selectPsychologist('${psychologist.id}', '${selectedChild?.id || ''}'); this.closest('.modal').remove();"
                             onmouseover="this.style.borderColor='#2563EB'; this.style.boxShadow='0 4px 6px -1px rgba(0, 0, 0, 0.1)'"
                             onmouseout="this.style.borderColor='#E5E7EB'; this.style.boxShadow='none'">
                            
                            <div style="display: flex; align-items: center; gap: 1.5rem; margin-bottom: 1.5rem;">
                                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #10B981 0%, #059669 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 1.5rem;">
                                    ${psychologist.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div style="flex: 1;">
                                    <h4 style="margin: 0 0 0.5rem 0; color: #1F2937; font-size: 1.25rem;">${psychologist.name}</h4>
                                    <p style="margin: 0 0 0.5rem 0; color: #2563EB; font-weight: 500;">${psychologist.specialization || 'Child Psychology'}</p>
                                    <p style="margin: 0; color: #6B7280; font-size: 0.875rem;">📧 ${psychologist.email}</p>
                                </div>
                                <div style="text-align: right;">
                                    <div style="background: #10B981; color: white; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 500; margin-bottom: 0.5rem;">
                                        ✓ Approved
                                    </div>
                                    <p style="margin: 0; color: #6B7280; font-size: 0.875rem;">${psychologist.experience || '5+ years'}</p>
                                </div>
                            </div>
                            
                            <div style="border-top: 1px solid #F3F4F6; padding-top: 1rem;">
                                <div style="display: flex; gap: 2rem; color: #6B7280; font-size: 0.875rem;">
                                    <div>👥 Experience: ${psychologist.experience || '5+ years'}</div>
                                    <div>⭐ Rating: ${psychologist.rating || '4.8'}/5</div>
                                    <div>📋 Assessments: ${psychologist.completed_assessments || '50+'}</div>
                                </div>
                            </div>
                            
                            <div style="margin-top: 1rem; text-align: center;">
                                <button style="background: #2563EB; color: white; border: none; padding: 0.75rem 2rem; border-radius: 0.5rem; font-weight: 500; cursor: pointer;">
                                    Select This Psychologist
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

/**
 * Select psychologist and create assessment request
 */
function selectPsychologist(psychologistId, childId = null) {
    const customer = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMER) || '{}');
    const psychologists = JSON.parse(localStorage.getItem('EDUCE_psychologists') || '[]');
    const psychologist = psychologists.find(p => p.id === psychologistId);
    
    if (!psychologist) {
        alert('Psychologist not found!');
        return;
    }
    
    // If specific child is selected
    if (childId) {
        createAssessmentRequest(childId, psychologistId);
        return;
    }
    
    // If no specific child, show child selection
    const children = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHILDREN) || '[]');
    const customerChildren = children.filter(child => child.parentId === customer.id || child.parentEmail === customer.email);
    
    if (customerChildren.length === 0) {
        alert('Please add a child first before selecting a psychologist.');
        showAddChildModal();
        return;
    }
    
    if (customerChildren.length === 1) {
        createAssessmentRequest(customerChildren[0].id, psychologistId);
        return;
    }
    
    // Show child selection modal
    showChildSelectionModal(psychologistId, psychologist);
}

/**
 * Show child selection modal
 */
function showChildSelectionModal(psychologistId, psychologist) {
    const customer = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMER) || '{}');
    const children = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHILDREN) || '[]');
    const customerChildren = children.filter(child => child.parentId === customer.id || child.parentEmail === customer.email);
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <div class="modal-header">
                <h3><i class="fas fa-child"></i> Select Child for ${psychologist.name}</h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            
            <div style="padding: 2rem;">
                <p style="color: #6B7280; margin-bottom: 2rem;">Which child would you like to assign to Dr. ${psychologist.name}?</p>
                
                <div style="display: grid; gap: 1rem;">
                    ${customerChildren.map(child => `
                        <div style="background: #F9FAFB; border: 2px solid #E5E7EB; border-radius: 0.75rem; padding: 1.5rem; cursor: pointer; transition: all 0.3s ease;"
                             onclick="createAssessmentRequest('${child.id}', '${psychologistId}'); this.closest('.modal').remove();"
                             onmouseover="this.style.borderColor='#2563EB'"
                             onmouseout="this.style.borderColor='#E5E7EB'">
                            <div style="display: flex; align-items: center; gap: 1rem;">
                                <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #2563EB 0%, #3B82F6 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600;">
                                    ${child.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div style="flex: 1;">
                                    <h4 style="margin: 0 0 0.25rem 0; color: #1F2937;">${child.name}</h4>
                                    <p style="margin: 0; color: #6B7280; font-size: 0.875rem;">${child.age} years old • ${child.grade}</p>
                                </div>
                                <div style="color: #2563EB;">
                                    <i class="fas fa-arrow-right"></i>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

/**
 * Create assessment request
 */
function createAssessmentRequest(childId, psychologistId) {
    const customer = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMER) || '{}');
    const requests = JSON.parse(localStorage.getItem(STORAGE_KEYS.REQUESTS) || '[]');
    const children = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHILDREN) || '[]');
    const psychologists = JSON.parse(localStorage.getItem('EDUCE_psychologists') || '[]');
    
    const child = children.find(c => c.id === childId);
    const psychologist = psychologists.find(p => p.id === psychologistId);
    
    if (!child || !psychologist) {
        alert('Error: Child or psychologist not found!');
        return;
    }
    
    // Create new request
    const newRequest = {
        id: 'req_' + Date.now(),
        childId: childId,
        parentId: customer.id,
        parentEmail: customer.email,
        psychologistId: psychologistId,
        status: 'pending',
        createdAt: new Date().toISOString(),
        message: `Assessment request for ${child.name} (${child.age} years old)`
    };
    
    requests.push(newRequest);
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
    
    // Update child status
    const childIndex = children.findIndex(c => c.id === childId);
    if (childIndex !== -1) {
        children[childIndex].psychologistId = psychologistId;
        children[childIndex].status = 'pending';
        localStorage.setItem(STORAGE_KEYS.CHILDREN, JSON.stringify(children));
    }
    
    alert(`✅ Assessment request sent to Dr. ${psychologist.name} for ${child.name}. 
    
You will be notified when the psychologist accepts the request and schedules the assessment.`);
    
    // Refresh profile data
    checkCustomerLogin();
}

// Initialize website when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeWebsite);

// Close profile menu when clicking outside
document.addEventListener('click', function(event) {
    const profileDropdown = document.getElementById('profileDropdown');
    const profileMenu = document.getElementById('profileMenu');
    
    if (profileDropdown && profileMenu && profileMenuOpen) {
        if (!profileDropdown.contains(event.target)) {
            profileMenuOpen = false;
            profileMenu.style.display = 'none';
        }
    }
});