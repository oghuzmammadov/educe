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
    createDemoDataIfNeeded();
    checkCustomerLogin();
    checkURLParameters();
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

// Removed duplicate checkCustomerLogin function - using the better comprehensive one later in the file

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

// Removed duplicate toggleProfile function - using the better one later in the file

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
async function handleAddChildForm(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const childData = {
        name: formData.get('childName').trim(),
        age: parseInt(formData.get('childAge')),
        gender: formData.get('childGender'),
        grade: formData.get('childGrade').trim(),
        interests: formData.get('childInterests') ? formData.get('childInterests').trim().split(',').map(i => i.trim()) : [],
        notes: formData.get('childNotes').trim(),
        parentId: JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMER) || '{}').id,
        parentEmail: JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMER) || '{}').email,
        status: 'pending',
        addedDate: new Date().toISOString()
    };
    
    // Validate required fields
    if (!childData.name || !childData.age || !childData.gender) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Adding...';
    }
    
    try {
        // Try to submit to server first
        const response = await fetch('/api/children', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('EDUCE_token') || ''}`
            },
            body: JSON.stringify(childData)
        });

        if (response.ok) {
            const result = await response.json();
            childData.id = result.child.id;
            console.log('✅ Child added via API:', result);
        } else {
            throw new Error('API submission failed');
        }
    } catch (error) {
        console.log('📱 API unavailable, using localStorage fallback');
        childData.id = Date.now(); // Fallback ID generation
    }

    // Always save to localStorage (for UI consistency and offline support)
    const customer = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMER) || '{}');
    if (!customer.children) {
        customer.children = [];
    }
    
    // Check if child with same name already exists
    if (customer.children.some(child => child.name.toLowerCase() === childData.name.toLowerCase())) {
        alert('A child with this name already exists. Please use a different name.');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Add Child';
        }
        return;
    }
    
    customer.children.push(childData);
    localStorage.setItem(STORAGE_KEYS.CUSTOMER, JSON.stringify(customer));
    
    // Also save to global children list for admin panel
    const allChildren = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHILDREN) || '[]');
    allChildren.push(childData);
    localStorage.setItem(STORAGE_KEYS.CHILDREN, JSON.stringify(allChildren));
    
    // Close modal and refresh profile
    closeAddChildModal();
    updateNavbarProfile(customer);
    
    // Show enhanced success message
    showEnhancedNotification('success', 'Child Added!', `${childData.name} has been added to your profile successfully.`);
    
    // Reset button state
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Add Child';
    }
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
    console.log('🔥 HANDLE START NOW CLICKED!');
    
    try {
        const customer = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMER) || '{}');
        console.log('👤 Current customer:', customer);
        console.log('🔍 Customer keys:', Object.keys(customer));
        console.log('🔍 Customer has ID?', !!customer.id);
        console.log('🔍 Customer has email?', !!customer.email);
        console.log('🔍 Customer role:', customer.role);
        
        // Check if customer is logged in
        if (!customer.role || customer.role !== 'customer') {
            console.log('❌ Customer not logged in, redirecting to login...');
            // Not logged in, redirect to login with start_now parameter
            window.location.href = 'customer-login.html?start_now=true';
            return;
        }
        
        console.log('✅ Customer is logged in!');
    } catch (error) {
        console.error('❌ Error in handleStartNow:', error);
        alert('Error occurred. Please check console.');
        return;
    }
    
    // Customer is logged in, show child selection first
    console.log('🎯 Customer is logged in, showing child selection...');
    showChildSelectionForStartNow();
}

/**
 * Show child selection modal for Start Now flow
 */
function showChildSelectionForStartNow() {
    const customer = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMER) || '{}');
    const children = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHILDREN) || '[]');
    
    console.log('🔍 DEBUG - Customer data:', customer);
    console.log('🔍 DEBUG - All children:', children);
    console.log('🔍 DEBUG - Customer ID:', customer.id);
    console.log('🔍 DEBUG - Customer Email:', customer.email);
    
    const customerChildren = children.filter(child => {
        console.log(`🔍 Checking child ${child.name}: parentId=${child.parentId}, parentEmail=${child.parentEmail}`);
        const matchById = customer.id && child.parentId === customer.id;
        const matchByEmail = customer.email && child.parentEmail === customer.email;
        const matchByIdAsEmail = customer.email && child.parentId === customer.email; // Fallback case
        
        console.log(`  - Match by ID: ${matchById}`);
        console.log(`  - Match by Email: ${matchByEmail}`);
        console.log(`  - Match by ID as Email: ${matchByIdAsEmail}`);
        
        return matchById || matchByEmail || matchByIdAsEmail;
    });
    
    console.log('👶 Found children:', customerChildren.length);
    console.log('👶 Customer children:', customerChildren);
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    modal.style.zIndex = '9999';
    modal.style.backdropFilter = 'blur(3px)';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 700px; margin: 2rem auto; max-height: 90vh; overflow-y: auto; background: white; border-radius: 1rem; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); animation: modalSlideIn 0.3s ease-out;">
            <div class="modal-header" style="background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%); color: white; padding: 2rem; border-radius: 1rem 1rem 0 0;">
                <h3 style="margin: 0; font-size: 1.5rem; display: flex; align-items: center; gap: 0.75rem;">
                    <i class="fas fa-child"></i> Select Child for Assessment
                </h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()" style="position: absolute; top: 1rem; right: 1rem; background: rgba(255, 255, 255, 0.2); border: none; color: white; font-size: 1.5rem; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;"
                       onmouseover="this.style.backgroundColor='rgba(255, 255, 255, 0.3)'"
                       onmouseout="this.style.backgroundColor='rgba(255, 255, 255, 0.2)'">&times;</button>
            </div>
            
            <div style="padding: 2rem;">
                <p style="color: #6B7280; margin-bottom: 2rem; text-align: center;">
                    Choose which child you'd like to get psychological assessment for, or add a new child.
                </p>
                
                <!-- Existing Children -->
                ${customerChildren.length > 0 ? `
                    <div style="margin-bottom: 2rem;">
                        <h4 style="color: #1F2937; margin-bottom: 1rem;">Your Children:</h4>
                        <div style="display: grid; gap: 1rem;">
                            ${customerChildren.map(child => `
                                <div class="child-selection-card" style="background: #F9FAFB; border: 2px solid #E5E7EB; border-radius: 0.75rem; padding: 1.5rem; cursor: pointer; transition: all 0.3s ease;"
                                     onclick="selectChildForAssessment('${child.id}'); this.closest('.modal').remove();"
                                     onmouseover="this.style.borderColor='#2563EB'; this.style.backgroundColor='#EFF6FF'"
                                     onmouseout="this.style.borderColor='#E5E7EB'; this.style.backgroundColor='#F9FAFB'">
                                    
                                    <div style="display: flex; align-items: center; gap: 1.5rem;">
                                        <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #2563EB 0%, #3B82F6 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 1.2rem;">
                                            ${child.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        
                                        <div style="flex: 1;">
                                            <h5 style="margin: 0 0 0.5rem 0; color: #1F2937; font-size: 1.1rem;">${child.name}</h5>
                                            <p style="margin: 0 0 0.5rem 0; color: #6B7280;">${child.age} years old • ${child.grade}</p>
                                            
                                            ${child.psychologistId ? `
                                                <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem;">
                                                    <span class="status-badge status-${child.status || 'pending'}" style="font-size: 0.75rem;">
                                                        ${child.status === 'accepted' ? '✅ Assessment Approved' : 
                                                          child.status === 'pending' ? '⏳ Pending Approval' : 
                                                          child.status === 'completed' ? '🎯 Assessment Complete' : 
                                                          '📋 Ready for Assessment'}
                                                    </span>
                                                </div>
                                            ` : '<p style="margin: 0; color: #10B981; font-size: 0.875rem; font-weight: 500;">🆕 Ready for new assessment</p>'}
                                        </div>
                                        
                                        <div style="color: #2563EB; font-size: 1.5rem;">
                                            <i class="fas fa-arrow-right"></i>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <!-- Add New Child Option -->
                <div style="border-top: ${customerChildren.length > 0 ? '1px solid #E5E7EB; padding-top: 2rem;' : ''}">
                    <div class="add-child-card" style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); border-radius: 0.75rem; padding: 2rem; cursor: pointer; transition: all 0.3s ease; color: white;"
                         onclick="showAddChildForAssessment(); this.closest('.modal').remove();"
                         onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 16px rgba(16, 185, 129, 0.3)'"
                         onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                        
                        <div style="display: flex; align-items: center; gap: 1.5rem;">
                            <div style="width: 60px; height: 60px; background: rgba(255, 255, 255, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
                                <i class="fas fa-plus"></i>
                            </div>
                            
                            <div style="flex: 1;">
                                <h5 style="margin: 0 0 0.5rem 0; font-size: 1.1rem;">Add New Child</h5>
                                <p style="margin: 0; opacity: 0.9; font-size: 0.875rem;">Register a new child for psychological assessment</p>
                            </div>
                            
                            <div style="font-size: 1.5rem; opacity: 0.8;">
                                <i class="fas fa-arrow-right"></i>
                            </div>
                        </div>
                    </div>
                </div>
                
                ${customerChildren.length === 0 ? `
                    <div style="text-align: center; margin-top: 2rem; color: #6B7280;">
                        <i class="fas fa-info-circle" style="font-size: 1.2rem; margin-bottom: 0.5rem;"></i>
                        <p style="margin: 0;">You haven't added any children yet. Click "Add New Child" to get started!</p>
                        <div style="margin-top: 1rem; font-size: 0.875rem; color: #9CA3AF;">
                            <p>Debug info: Found ${children.length} total children in system</p>
                            <p>Customer ID: ${customer.id || 'N/A'}</p>
                            <p>Customer Email: ${customer.email || 'N/A'}</p>
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

/**
 * Select child for assessment and proceed to psychologist selection
 */
function selectChildForAssessment(childId) {
    console.log('🎯 Child selected for assessment:', childId);
    
    // Debug: Check if child exists
    const children = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHILDREN) || '[]');
    const selectedChild = children.find(c => c.id === childId);
    console.log('🔍 Selected child data:', selectedChild);
    
    if (!selectedChild) {
        console.error('❌ Child not found with ID:', childId);
        alert('Child not found! Please refresh and try again.');
        return;
    }
    
    // Store selected child for the assessment flow
    sessionStorage.setItem('selectedChildForAssessment', childId);
    
    console.log('🚀 Proceeding to psychologist selection...');
    
    // Show psychologist selection modal
    showPsychologistSelectionModal(childId);
}

/**
 * Show add child modal for assessment flow
 */
function showAddChildForAssessment() {
    console.log('➕ Adding new child for assessment...');
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    modal.style.zIndex = '9999';
    modal.style.backdropFilter = 'blur(3px)';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px; margin: 2rem auto; max-height: 90vh; overflow-y: auto; background: white; border-radius: 1rem; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); animation: modalSlideIn 0.3s ease-out;">
            <div class="modal-header" style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 2rem; border-radius: 1rem 1rem 0 0;">
                <h3 style="margin: 0; font-size: 1.5rem; display: flex; align-items: center; gap: 0.75rem;">
                    <i class="fas fa-child"></i> Add New Child
                </h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()" style="position: absolute; top: 1rem; right: 1rem; background: rgba(255, 255, 255, 0.2); border: none; color: white; font-size: 1.5rem; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;"
                       onmouseover="this.style.backgroundColor='rgba(255, 255, 255, 0.3)'"
                       onmouseout="this.style.backgroundColor='rgba(255, 255, 255, 0.2)'">&times;</button>
            </div>
            
            <div style="padding: 2rem;">
                <form id="assessmentAddChildForm" onsubmit="handleAssessmentAddChildForm(event)">
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; color: #374151; font-weight: 500;">
                            Child's Name <span style="color: #EF4444;">*</span>
                        </label>
                        <input type="text" name="childName" required 
                               style="width: 100%; padding: 0.75rem; border: 1px solid #D1D5DB; border-radius: 0.5rem; font-size: 1rem;"
                               placeholder="Enter child's full name">
                    </div>
                    
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; color: #374151; font-weight: 500;">
                            Age <span style="color: #EF4444;">*</span>
                        </label>
                        <input type="number" name="childAge" required min="3" max="18"
                               style="width: 100%; padding: 0.75rem; border: 1px solid #D1D5DB; border-radius: 0.5rem; font-size: 1rem;"
                               placeholder="Enter child's age">
                    </div>
                    
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; color: #374151; font-weight: 500;">
                            Grade/Class <span style="color: #EF4444;">*</span>
                        </label>
                        <input type="text" name="childGrade" required
                               style="width: 100%; padding: 0.75rem; border: 1px solid #D1D5DB; border-radius: 0.5rem; font-size: 1rem;"
                               placeholder="e.g., 1st Grade, Kindergarten">
                    </div>
                    
                    <div style="margin-bottom: 2rem;">
                        <label style="display: block; margin-bottom: 0.5rem; color: #374151; font-weight: 500;">
                            Special Notes (Optional)
                        </label>
                        <textarea name="childNotes" rows="3"
                                  style="width: 100%; padding: 0.75rem; border: 1px solid #D1D5DB; border-radius: 0.5rem; font-size: 1rem; resize: vertical;"
                                  placeholder="Any special considerations, interests, or concerns..."></textarea>
                    </div>
                    
                    <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                        <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">
                            Cancel
                        </button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-plus"></i> Add Child & Continue
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

/**
 * Handle add child form for assessment flow
 */
function handleAssessmentAddChildForm(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const customer = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMER) || '{}');
    
    console.log('🔍 Adding child - Customer data:', customer);
    console.log('🔍 Customer ID for child:', customer.id);
    console.log('🔍 Customer email for child:', customer.email);
    
    // Create new child object
    const newChild = {
        id: 'child_' + Date.now(),
        name: formData.get('childName').trim(),
        age: parseInt(formData.get('childAge')),
        grade: formData.get('childGrade').trim(),
        notes: formData.get('childNotes')?.trim() || '',
        parentId: customer.id || customer.email, // Fallback to email if no ID
        parentEmail: customer.email,
        status: 'available',
        createdAt: new Date().toISOString()
    };
    
    console.log('🔍 New child object:', newChild);
    
    // Add to storage
    const children = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHILDREN) || '[]');
    children.push(newChild);
    localStorage.setItem(STORAGE_KEYS.CHILDREN, JSON.stringify(children));
    
    console.log('✅ New child added for assessment:', newChild.name);
    
    // Close modal
    event.target.closest('.modal').remove();
    
    // Show success message and proceed to psychologist selection
    setTimeout(() => {
        showEnhancedNotification(
            'success',
            'Child Added Successfully!',
            `${newChild.name} has been added to your children list. Now please select a psychologist for their assessment.`,
            4000
        );
        
        console.log('🎯 New child added, proceeding to psychologist selection for ID:', newChild.id);
        
        // Proceed to psychologist selection for this child
        setTimeout(() => {
            console.log('🔄 Refreshing child selection after new child added...');
            // First, refresh the child selection modal to show the new child
            showChildSelectionForStartNow();
        }, 1000); // Show child selection again with the new child
    }, 300);
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
        
        // Ensure customer is saved in the standard format for editProfile
        if (!customer.role || customer.role !== 'customer') {
            localStorage.setItem(STORAGE_KEYS.CUSTOMER, JSON.stringify(currentCustomer));
            console.log('🔄 Synced customer to standard storage format');
        }
        
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
    showProfileDropdown();
    
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
    if (!profileMenu) {
        console.log('⚠️ Profile menu element not found');
        return;
    }
    
    profileMenuOpen = !profileMenuOpen;
    
    if (profileMenuOpen) {
        profileMenu.classList.add('active');
        console.log('✅ Profile menu opened');
    } else {
        profileMenu.classList.remove('active');
        console.log('✅ Profile menu closed');
    }
}

/**
 * Hide profile dropdown
 */
function hideProfileDropdown() {
    const profileDropdown = document.getElementById('profileDropdown');
    const profileMenu = document.getElementById('profileMenu');
    
    if (profileDropdown) {
        profileDropdown.style.display = 'none';
    }
    if (profileMenu) {
        profileMenu.classList.remove('active');
        profileMenuOpen = false;
    }
}

/**
 * Show profile dropdown
 */
function showProfileDropdown() {
    const profileDropdown = document.getElementById('profileDropdown');
    if (profileDropdown) {
        profileDropdown.style.display = 'block';
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
        // Clear customer data
        localStorage.removeItem(STORAGE_KEYS.CUSTOMER);
        localStorage.removeItem('EDUCE_customer');
        sessionStorage.clear();
        
        // Show logout notification
        showEnhancedNotification(
            'success',
            'Logged Out Successfully',
            'You have been safely logged out. Thank you for using EDUCE!',
            3000
        );
        
        // Reload page after short delay
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
}

/**
 * Edit customer profile - show comprehensive profile modal
 */
function editProfile() {
    const customer = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMER) || '{}');
    
    if (!customer.role || customer.role !== 'customer') {
        alert('Please login first to view your profile.');
        return;
    }
    
    showCustomerProfileModal(customer);
}

/**
 * Show comprehensive customer profile modal
 */
function showCustomerProfileModal(customer) {
    const children = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHILDREN) || '[]');
    const customerChildren = children.filter(child => {
        return (customer.id && child.parentId === customer.id) || 
               (customer.email && child.parentEmail === customer.email) ||
               (customer.email && child.parentId === customer.email);
    });
    
    const requests = JSON.parse(localStorage.getItem(STORAGE_KEYS.REQUESTS) || '[]');
    const customerRequests = requests.filter(req => req.parentEmail === customer.email || req.customerId === customer.id);
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    modal.style.zIndex = '9999';
    modal.style.backdropFilter = 'blur(3px)';
    
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 1000px; margin: 2rem auto; max-height: 90vh; overflow-y: auto; background: white; border-radius: 1rem; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); animation: modalSlideIn 0.3s ease-out;">
            <div class="modal-header" style="background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%); color: white; padding: 2rem; border-radius: 1rem 1rem 0 0;">
                <h3 style="margin: 0; font-size: 1.5rem; display: flex; align-items: center; gap: 0.75rem;">
                    <i class="fas fa-user-circle"></i> My Profile
                </h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()" style="position: absolute; top: 1rem; right: 1rem; background: rgba(255, 255, 255, 0.2); border: none; color: white; font-size: 1.5rem; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;"
                       onmouseover="this.style.backgroundColor='rgba(255, 255, 255, 0.3)'"
                       onmouseout="this.style.backgroundColor='rgba(255, 255, 255, 0.2)'">&times;</button>
            </div>
            
            <div style="padding: 2rem;">
                ${generateProfileContent(customer, customerChildren, customerRequests)}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

/**
 * Generate profile content HTML
 */
function generateProfileContent(customer, customerChildren, customerRequests) {
    const gameResults = JSON.parse(localStorage.getItem(STORAGE_KEYS.GAME_RESULTS) || '[]');
    const analyses = JSON.parse(localStorage.getItem('educe_analyses') || '[]');
    
    return `
        <!-- Profile Info Section -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
            <!-- Personal Info -->
            <div>
                <h4 style="color: #1F2937; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fas fa-user"></i> Personal Information
                </h4>
                <div style="background: #F9FAFB; border-radius: 0.75rem; padding: 1.5rem;">
                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; font-weight: 500; color: #374151; margin-bottom: 0.25rem;">Full Name</label>
                        <p style="margin: 0; padding: 0.75rem; background: white; border: 1px solid #E5E7EB; border-radius: 0.5rem;">${customer.name || 'Not specified'}</p>
                    </div>
                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; font-weight: 500; color: #374151; margin-bottom: 0.25rem;">Email Address</label>
                        <p style="margin: 0; padding: 0.75rem; background: white; border: 1px solid #E5E7EB; border-radius: 0.5rem;">${customer.email || 'Not specified'}</p>
                    </div>
                    <div style="margin-bottom: 1rem;">
                        <label style="display: block; font-weight: 500; color: #374151; margin-bottom: 0.25rem;">Phone Number</label>
                        <p style="margin: 0; padding: 0.75rem; background: white; border: 1px solid #E5E7EB; border-radius: 0.5rem;">${customer.phone || 'Not specified'}</p>
                    </div>
                    <div>
                        <label style="display: block; font-weight: 500; color: #374151; margin-bottom: 0.25rem;">Member Since</label>
                        <p style="margin: 0; padding: 0.75rem; background: white; border: 1px solid #E5E7EB; border-radius: 0.5rem;">${customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'Unknown'}</p>
                    </div>
                </div>
            </div>
            
            <!-- Statistics -->
            <div>
                <h4 style="color: #1F2937; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fas fa-chart-bar"></i> Statistics
                </h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div style="background: linear-gradient(135deg, #3B82F6, #2563EB); color: white; padding: 1.5rem; border-radius: 0.75rem; text-align: center;">
                        <div style="font-size: 2rem; font-weight: 600; margin-bottom: 0.5rem;">${customerChildren.length}</div>
                        <div style="font-size: 0.875rem; opacity: 0.9;">Children</div>
                    </div>
                    <div style="background: linear-gradient(135deg, #10B981, #059669); color: white; padding: 1.5rem; border-radius: 0.75rem; text-align: center;">
                        <div style="font-size: 2rem; font-weight: 600; margin-bottom: 0.5rem;">${customerRequests.filter(r => r.status === 'completed').length}</div>
                        <div style="font-size: 0.875rem; opacity: 0.9;">Completed</div>
                    </div>
                    <div style="background: linear-gradient(135deg, #F59E0B, #D97706); color: white; padding: 1.5rem; border-radius: 0.75rem; text-align: center;">
                        <div style="font-size: 2rem; font-weight: 600; margin-bottom: 0.5rem;">${customerRequests.filter(r => r.status === 'pending').length}</div>
                        <div style="font-size: 0.875rem; opacity: 0.9;">Pending</div>
                    </div>
                    <div style="background: linear-gradient(135deg, #8B5CF6, #7C3AED); color: white; padding: 1.5rem; border-radius: 0.75rem; text-align: center;">
                        <div style="font-size: 2rem; font-weight: 600; margin-bottom: 0.5rem;">${analyses.filter(a => customerChildren.some(c => c.id === a.childId)).length}</div>
                        <div style="font-size: 0.875rem; opacity: 0.9;">Analyses</div>
                    </div>
                </div>
            </div>
        </div>
        
        ${generateChildrenSection(customerChildren, customerRequests, gameResults, analyses)}
        
        <!-- Action Buttons -->
        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-top: 2rem;">
            <button class="btn btn-primary" onclick="showEditProfileForm('${customer.id || customer.email}'); this.closest('.modal').remove();">
                <i class="fas fa-user-edit"></i> Edit Profile
            </button>
            <button class="btn btn-outline" onclick="viewAllReports(); this.closest('.modal').remove();">
                <i class="fas fa-chart-bar"></i> View All Reports
            </button>
            <button class="btn btn-outline" onclick="handleStartNow(); this.closest('.modal').remove();">
                <i class="fas fa-rocket"></i> Start Assessment
            </button>
            <button class="btn btn-secondary" onclick="if(confirm('Are you sure you want to logout?')) { logoutCustomer(); this.closest('.modal').remove(); }">
                <i class="fas fa-sign-out-alt"></i> Logout
            </button>
        </div>
    `;
}

/**
 * Generate children section HTML
 */
function generateChildrenSection(customerChildren, customerRequests, gameResults, analyses) {
    return `
        <!-- Children Section -->
        <div style="margin-bottom: 2rem;">
            <h4 style="color: #1F2937; margin-bottom: 1rem; display: flex; align-items: center; justify-content: space-between;">
                <span style="display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fas fa-children"></i> My Children (${customerChildren.length})
                </span>
                <button class="btn btn-primary btn-small" onclick="showAddChildForAssessment(); this.closest('.modal').remove();">
                    <i class="fas fa-plus"></i> Add Child
                </button>
            </h4>
            
            ${customerChildren.length > 0 ? `
                <div style="display: grid; gap: 1rem;">
                    ${customerChildren.map(child => {
                        const childRequests = customerRequests.filter(r => r.childId === child.id);
                        const childGameResults = gameResults.filter(r => r.childId === child.id);
                        const childAnalyses = analyses.filter(a => a.childId === child.id);
                        
                        return `
                            <div style="background: #F9FAFB; border-radius: 0.75rem; padding: 1.5rem; border: 1px solid #E5E7EB;">
                                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
                                    <div style="display: flex; align-items: center; gap: 1rem;">
                                        <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #2563EB 0%, #3B82F6 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 600;">
                                            ${child.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <h5 style="margin: 0 0 0.25rem 0; color: #1F2937;">${child.name}</h5>
                                            <p style="margin: 0; color: #6B7280; font-size: 0.875rem;">${child.age} years old • ${child.grade}</p>
                                        </div>
                                    </div>
                                    <div style="display: flex; gap: 0.5rem;">
                                        <button class="btn btn-outline btn-small" onclick="viewChildReport('${child.id}'); this.closest('.modal').remove();">
                                            <i class="fas fa-eye"></i> View Report
                                        </button>
                                        <button class="btn btn-primary btn-small" onclick="selectPsychologistForChild('${child.id}'); this.closest('.modal').remove();">
                                            <i class="fas fa-user-md"></i> Select Psychologist
                                        </button>
                                    </div>
                                </div>
                                
                                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 1rem; margin-top: 1rem;">
                                    <div style="text-align: center; padding: 0.75rem; background: white; border-radius: 0.5rem;">
                                        <div style="font-weight: 600; color: #3B82F6;">${childGameResults.length}</div>
                                        <div style="font-size: 0.75rem; color: #6B7280;">Tests</div>
                                    </div>
                                    <div style="text-align: center; padding: 0.75rem; background: white; border-radius: 0.5rem;">
                                        <div style="font-weight: 600; color: #10B981;">${childAnalyses.length}</div>
                                        <div style="font-size: 0.75rem; color: #6B7280;">Analyses</div>
                                    </div>
                                    <div style="text-align: center; padding: 0.75rem; background: white; border-radius: 0.5rem;">
                                        <div style="font-weight: 600; color: ${child.status === 'completed' ? '#10B981' : child.status === 'pending' ? '#F59E0B' : '#6B7280'};">
                                            ${child.status === 'completed' ? 'Done' : 
                                              child.status === 'pending' ? 'Pending' : 
                                              child.status === 'accepted' ? 'Approved' : 'Ready'}
                                        </div>
                                        <div style="font-size: 0.75rem; color: #6B7280;">Status</div>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            ` : `
                <div style="text-align: center; padding: 3rem; background: #F9FAFB; border-radius: 0.75rem; border: 2px dashed #D1D5DB;">
                    <i class="fas fa-child" style="font-size: 3rem; color: #9CA3AF; margin-bottom: 1rem;"></i>
                    <h4 style="color: #6B7280; margin: 0 0 0.5rem 0;">No Children Added Yet</h4>
                    <p style="color: #9CA3AF; margin: 0 0 1.5rem 0;">Add your first child to start psychological assessments</p>
                    <button class="btn btn-primary" onclick="showAddChildForAssessment(); this.closest('.modal').remove();">
                        <i class="fas fa-plus"></i> Add Your First Child
                    </button>
                </div>
            `}
        </div>
    `;
}

/**
 * Show edit profile form
 */
function showEditProfileForm(customerId) {
    const customer = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMER) || '{}');
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    modal.style.zIndex = '9999';
    modal.style.backdropFilter = 'blur(3px)';
    
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px; margin: 2rem auto; max-height: 90vh; overflow-y: auto; background: white; border-radius: 1rem; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); animation: modalSlideIn 0.3s ease-out;">
            <div class="modal-header" style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 2rem; border-radius: 1rem 1rem 0 0;">
                <h3 style="margin: 0; font-size: 1.5rem; display: flex; align-items: center; gap: 0.75rem;">
                    <i class="fas fa-user-edit"></i> Edit Profile
                </h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()" style="position: absolute; top: 1rem; right: 1rem; background: rgba(255, 255, 255, 0.2); border: none; color: white; font-size: 1.5rem; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;"
                       onmouseover="this.style.backgroundColor='rgba(255, 255, 255, 0.3)'"
                       onmouseout="this.style.backgroundColor='rgba(255, 255, 255, 0.2)'">&times;</button>
            </div>
            
            <div style="padding: 2rem;">
                <form id="editProfileForm" onsubmit="handleEditProfileForm(event, '${customerId}')">
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; color: #374151; font-weight: 500;">
                            Full Name <span style="color: #EF4444;">*</span>
                        </label>
                        <input type="text" name="name" required value="${customer.name || ''}"
                               style="width: 100%; padding: 0.75rem; border: 1px solid #D1D5DB; border-radius: 0.5rem; font-size: 1rem;"
                               placeholder="Enter your full name">
                    </div>
                    
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; color: #374151; font-weight: 500;">
                            Email Address <span style="color: #EF4444;">*</span>
                        </label>
                        <input type="email" name="email" required value="${customer.email || ''}"
                               style="width: 100%; padding: 0.75rem; border: 1px solid #D1D5DB; border-radius: 0.5rem; font-size: 1rem;"
                               placeholder="Enter your email address">
                    </div>
                    
                    <div style="margin-bottom: 1.5rem;">
                        <label style="display: block; margin-bottom: 0.5rem; color: #374151; font-weight: 500;">
                            Phone Number
                        </label>
                        <input type="tel" name="phone" value="${customer.phone || ''}"
                               style="width: 100%; padding: 0.75rem; border: 1px solid #D1D5DB; border-radius: 0.5rem; font-size: 1rem;"
                               placeholder="Enter your phone number">
                    </div>
                    
                    <div style="background: #F0F9FF; border: 1px solid #0EA5E9; border-radius: 0.5rem; padding: 1rem; margin-bottom: 2rem;">
                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                            <i class="fas fa-info-circle" style="color: #0EA5E9;"></i>
                            <strong style="color: #0C4A6E;">Account Information</strong>
                        </div>
                        <p style="margin: 0; color: #0C4A6E; font-size: 0.875rem;">
                            Member since: ${customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'Unknown'}
                        </p>
                    </div>
                    
                    <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                        <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">
                            Cancel
                        </button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

/**
 * Handle edit profile form submission
 */
function handleEditProfileForm(event, customerId) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const customer = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOMER) || '{}');
    
    // Update customer data
    const updatedCustomer = {
        ...customer,
        name: formData.get('name').trim(),
        email: formData.get('email').trim(),
        phone: formData.get('phone').trim(),
        updatedAt: new Date().toISOString()
    };
    
    // Save updated customer
    localStorage.setItem(STORAGE_KEYS.CUSTOMER, JSON.stringify(updatedCustomer));
    
    // Update customer in customers list if exists
    const customers = JSON.parse(localStorage.getItem('EDUCE_customers') || '[]');
    const customerIndex = customers.findIndex(c => c.id === customer.id || c.email === customer.email);
    if (customerIndex !== -1) {
        customers[customerIndex] = updatedCustomer;
        localStorage.setItem('EDUCE_customers', JSON.stringify(customers));
    }
    
    // Close modal
    event.target.closest('.modal').remove();
    
    // Show success notification
    showEnhancedNotification(
        'success',
        'Profile Updated',
        'Your profile information has been successfully updated.',
        4000
    );
    
    // Refresh navbar
    checkCustomerLogin();
    
    // Show updated profile modal after delay
    setTimeout(() => {
        showCustomerProfileModal(updatedCustomer);
    }, 1000);
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
    // Handle both child object and child ID
    let child = selectedChild;
    if (typeof selectedChild === 'string') {
        // It's a child ID, find the child object
        const children = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHILDREN) || '[]');
        child = children.find(c => c.id === selectedChild);
        
        if (!child) {
            console.error('❌ Child not found with ID:', selectedChild);
            alert('Child not found. Please try again.');
            return;
        }
        
        console.log('✅ Found child:', child.name);
    }
    
    // Get approved psychologists
    const psychologists = JSON.parse(localStorage.getItem('EDUCE_psychologists') || '[]');
    const approvedPsychologists = psychologists.filter(p => p.approved === true);
    
    console.log('👨‍⚕️ Found approved psychologists:', approvedPsychologists.length);
    
    if (approvedPsychologists.length === 0) {
        alert('No approved psychologists available at the moment. Please try again later.');
        return;
    }

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    modal.style.zIndex = '9999';
    modal.style.backdropFilter = 'blur(3px)';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 900px; margin: 2rem auto; max-height: 90vh; overflow-y: auto; background: white; border-radius: 1rem; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); animation: modalSlideIn 0.3s ease-out;">
            <div class="modal-header" style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 2rem; border-radius: 1rem 1rem 0 0;">
                <h3 style="margin: 0; font-size: 1.5rem; display: flex; align-items: center; gap: 0.75rem;">
                    <i class="fas fa-user-md"></i> Choose a Psychologist${child ? ` for ${child.name}` : ''}
                </h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()" style="position: absolute; top: 1rem; right: 1rem; background: rgba(255, 255, 255, 0.2); border: none; color: white; font-size: 1.5rem; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;"
                       onmouseover="this.style.backgroundColor='rgba(255, 255, 255, 0.3)'"
                       onmouseout="this.style.backgroundColor='rgba(255, 255, 255, 0.2)'">&times;</button>
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
        childName: child.name,
        childAge: child.age,
        parentId: customer.id,
        parentEmail: customer.email,
        customerId: customer.id,
        customerName: customer.name,
        customerEmail: customer.email,
        psychologistId: psychologistId,
        psychologistName: psychologist.name,
        status: 'pending',
        createdAt: new Date().toISOString(),
        requestDate: new Date().toISOString(),
        message: `Assessment request for ${child.name} (${child.age} years old)`,
        childInterests: child.interests || child.notes || '',
        childNotes: child.notes || ''
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
    
    // Refresh profile data
    checkCustomerLogin();
    
    // Show enhanced success notification
    showEnhancedNotification(
        'success',
        'Assessment Request Sent!',
        `Your request has been sent to Dr. ${psychologist.name} for ${child.name}'s psychological assessment. You will be notified when the psychologist responds.`,
        8000
    );
}

/**
 * Show enhanced notification
 */
function showEnhancedNotification(type, title, message, duration = 5000) {
    // Remove existing notifications
    document.querySelectorAll('.enhanced-notification').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `enhanced-notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        max-width: 400px;
        padding: 1.5rem;
        background: ${type === 'success' ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : 
                     type === 'error' ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)' :
                     'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'};
        color: white;
        border-radius: 0.75rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInFromRight 0.4s ease-out;
        backdrop-filter: blur(10px);
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: flex-start; gap: 1rem;">
            <div style="flex-shrink: 0; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 
                                type === 'error' ? 'fa-exclamation-circle' : 
                                'fa-info-circle'}" style="font-size: 1.2rem;"></i>
            </div>
            <div style="flex: 1;">
                <h4 style="margin: 0 0 0.5rem 0; font-size: 1rem; font-weight: 600;">${title}</h4>
                <p style="margin: 0; font-size: 0.875rem; opacity: 0.95; line-height: 1.4;">${message}</p>
            </div>
            <button onclick="this.closest('.enhanced-notification').remove()" 
                    style="background: rgba(255, 255, 255, 0.2); border: none; color: white; width: 24px; height: 24px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 0.875rem; flex-shrink: 0;"
                    onmouseover="this.style.backgroundColor='rgba(255, 255, 255, 0.3)'"
                    onmouseout="this.style.backgroundColor='rgba(255, 255, 255, 0.2)'">×</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after duration
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutToRight 0.3s ease-out forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, duration);
}

/**
 * Create demo data if needed for offline functionality
 */
function createDemoDataIfNeeded() {
    // Create demo psychologists if none exist
    const psychologists = JSON.parse(localStorage.getItem('EDUCE_psychologists') || '[]');
    
    if (psychologists.length === 0) {
        const demoPsychologists = [
            {
                id: 'psych_1',
                name: 'Dr. Sarah Johnson',
                email: 'sarah.johnson@educe.com',
                specialization: 'Child Psychology',
                experience: '8+ years',
                rating: '4.9',
                completed_assessments: '150+',
                approved: true,
                phone: '+1-555-0101',
                created_at: new Date().toISOString()
            },
            {
                id: 'psych_2',
                name: 'Dr. Michael Chen',
                email: 'michael.chen@educe.com',
                specialization: 'Developmental Psychology',
                experience: '6+ years',
                rating: '4.8',
                completed_assessments: '120+',
                approved: true,
                phone: '+1-555-0102',
                created_at: new Date().toISOString()
            },
            {
                id: 'psych_3',
                name: 'Dr. Emily Rodriguez',
                email: 'emily.rodriguez@educe.com',
                specialization: 'Educational Psychology',
                experience: '10+ years',
                rating: '4.9',
                completed_assessments: '200+',
                approved: true,
                phone: '+1-555-0103',
                created_at: new Date().toISOString()
            },
            {
                id: 'psych_4',
                name: 'Dr. James Wilson',
                email: 'james.wilson@educe.com',
                specialization: 'Behavioral Psychology',
                experience: '5+ years',
                rating: '4.7',
                completed_assessments: '80+',
                approved: false, // Not approved yet
                phone: '+1-555-0104',
                created_at: new Date().toISOString()
            }
        ];
        
        localStorage.setItem('EDUCE_psychologists', JSON.stringify(demoPsychologists));
        console.log('✅ Demo psychologists created for offline functionality');
    }
    
    // Ensure all other storage keys exist
    if (!localStorage.getItem(STORAGE_KEYS.CHILDREN)) {
        localStorage.setItem(STORAGE_KEYS.CHILDREN, '[]');
    }
    
    if (!localStorage.getItem(STORAGE_KEYS.REQUESTS)) {
        localStorage.setItem(STORAGE_KEYS.REQUESTS, '[]');
    }
    
    if (!localStorage.getItem(STORAGE_KEYS.GAME_RESULTS)) {
        localStorage.setItem(STORAGE_KEYS.GAME_RESULTS, '[]');
    }
    
    if (!localStorage.getItem('educe_analyses')) {
        localStorage.setItem('educe_analyses', '[]');
    }
    
    if (!localStorage.getItem('EDUCE_customers')) {
        localStorage.setItem('EDUCE_customers', '[]');
    }
    
    // Create demo customer if none exists (for testing)
    // Demo customer creation disabled for production
    // Users should register normally instead of using demo data
    console.log('✅ Demo data creation skipped - users should register normally');
}

// Test function to check if script is loaded
window.testScript = function() {
    console.log('✅ Script is loaded and working!');
    alert('Script is working!');
};

// Debug localStorage function
window.debugStorage = function() {
    console.log('🔍 DEBUG: LocalStorage Contents:');
    console.log('- Customer (STORAGE_KEYS):', localStorage.getItem(STORAGE_KEYS.CUSTOMER));
    console.log('- Customer (EDUCE):', localStorage.getItem('EDUCE_customer'));
    console.log('- Children:', localStorage.getItem(STORAGE_KEYS.CHILDREN));
    console.log('- Psychologists:', localStorage.getItem('EDUCE_psychologists'));
    console.log('- Requests:', localStorage.getItem(STORAGE_KEYS.REQUESTS));
    
    const customer1 = localStorage.getItem(STORAGE_KEYS.CUSTOMER);
    const customer2 = localStorage.getItem('EDUCE_customer');
    
    let message = 'Debug info logged to console!\n\n';
    if (customer1) message += '✅ Customer (educe_customer) exists\n';
    if (customer2) message += '✅ Customer (EDUCE_customer) exists\n';
    if (!customer1 && !customer2) message += '❌ No customer found in any format\n';
    
    alert(message);
};

// Clear all data function
window.clearAllData = function() {
    if (confirm('Are you sure you want to clear all data? This will log you out.')) {
        localStorage.clear();
        sessionStorage.clear();
        alert('All data cleared! Please refresh the page.');
        location.reload();
    }
};

// About Modal Function
function showAboutModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content info-modal-content">
            <div class="modal-header">
                <h2><i class="fas fa-info-circle"></i> EDUCE Haqqında</h2>
                <button class="modal-close" onclick="this.closest('.modal').remove()">×</button>
            </div>
            <div class="modal-body">
                <div class="info-section">
                    <h3>🎯 Layihənin Məqsədi</h3>
                    <p><strong>EDUCE</strong> (Educational Development and Understanding through Comprehensive Evaluation) platforması uşaqların psixoloji inkişafını dəstəkləmək və ailələrə peşəkar psixoloji xidmətlərə çıxış imkanı yaratmaq məqsədilə hazırlanmışdır.</p>
                </div>
                
                <div class="info-section">
                    <h3>⚡ Əsas Xüsusiyyətlər</h3>
                    <ul>
                        <li><strong>Erkən Müdaxilə:</strong> Uşaqlarda psixoloji problemlərin erkən aşkarlanması</li>
                        <li><strong>Peşəkar Dəstək:</strong> Kvalifisiyalı psixoloqlarla əlaqə qurulması</li>
                        <li><strong>Məlumat İdarəetməsi:</strong> Qiymətləndirmə nəticələrinin sistematik saxlanması</li>
                        <li><strong>Ailə Dəstəyi:</strong> Valideyinlərə uşaqlarının inkişafı haqqında məlumat verilməsi</li>
                    </ul>
                </div>
                
                <div class="info-section">
                    <h3>🛠️ Texniki Spesifikasiyalar</h3>
                    <ul>
                        <li><strong>Backend:</strong> Node.js, Express.js, SQLite, JWT Authentication</li>
                        <li><strong>Frontend:</strong> HTML5, CSS3, JavaScript ES6+, Responsive Design</li>
                        <li><strong>Təhlükəsizlik:</strong> bcrypt şifrə hashlənməsi, Role-based access control</li>
                        <li><strong>Məlumat Bazası:</strong> SQLite ilə 15+ cədvəl</li>
                    </ul>
                </div>
                
                <div class="info-section">
                    <h3>👥 İstifadəçi Növləri</h3>
                    <ul>
                        <li><strong>🏠 Valideyinlər:</strong> Uşaqlarını qeydiyyatdan keçirir və psixoloq seçir</li>
                        <li><strong>👨‍⚕️ Psixoloqlar:</strong> Qiymətləndirmə sorğularını idarə edir</li>
                        <li><strong>👨‍💼 Administratorlar:</strong> Sistemi idarə edir və istifadəçiləri təsdiqləyir</li>
                    </ul>
                </div>
            </div>
            <div class="modal-actions">
                <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">
                    <i class="fas fa-times"></i> Bağla
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Team Modal Function
function showTeamModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content info-modal-content">
            <div class="modal-header">
                <h2><i class="fas fa-users"></i> Layihə Komandası</h2>
                <button class="modal-close" onclick="this.closest('.modal').remove()">×</button>
            </div>
            <div class="modal-body">
                <div class="info-section">
                    <h3>👨‍💼 Layihə Rəhbəri</h3>
                    <div class="team-member">
                        <h4>Oğuz Məmmədov</h4>
                        <p><strong>Vəzifə:</strong> Baş Developer və Layihə Meneceri</p>
                        <p><strong>Məsuliyyətlər:</strong></p>
                        <ul>
                            <li>Layihə Menecmenti və Planlaşdırma</li>
                            <li>Full-Stack Development (Frontend + Backend)</li>
                            <li>Məlumat Bazası Dizaynı və Optimallaşdırılması</li>
                            <li>Sistem Arxitekturası və Təhlükəsizlik</li>
                            <li>DevOps və Deploy Prosesləri</li>
                            <li>Kod Keyfiyyəti və Test Strategiyası</li>
                        </ul>
                        <p><strong>Texniki Bacarıqlar:</strong></p>
                        <ul>
                            <li>Node.js, Express.js, SQLite, PostgreSQL</li>
                            <li>HTML5, CSS3, JavaScript ES6+</li>
                            <li>JWT Authentication, bcrypt Security</li>
                            <li>Responsive Web Design</li>
                            <li>Git, npm, REST API Design</li>
                        </ul>
                    </div>
                </div>
                
                <div class="info-section">
                    <h3>📊 Layihə Statistikaları</h3>
                    <ul>
                        <li><strong>Backend:</strong> ~1200 sətir JavaScript/Node.js kodu</li>
                        <li><strong>Frontend:</strong> ~2000 sətir HTML/CSS/JavaScript kodu</li>
                        <li><strong>Məlumat Bazası:</strong> 15+ cədvəl</li>
                        <li><strong>API Endpoints:</strong> 20+ endpoint</li>
                        <li><strong>Səhifələr:</strong> 8 əsas səhifə</li>
                        <li><strong>İnkişaf Müddəti:</strong> 12 həftə</li>
                    </ul>
                </div>
                
                <div class="info-section">
                    <h3>🏆 Layihə Nailiyyətləri</h3>
                    <ul>
                        <li>✅ Tam funksional backend API sistemi</li>
                        <li>✅ İntuitive və responsive frontend interfeysi</li>
                        <li>✅ PostgreSQL-dən SQLite-a uğurlu migrasiya</li>
                        <li>✅ Role-based authentication sistemi</li>
                        <li>✅ Real-time data synchronization</li>
                        <li>✅ Comprehensive admin panel</li>
                        <li>✅ Psychologist-parent interaction system</li>
                    </ul>
                </div>
            </div>
            <div class="modal-actions">
                <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">
                    <i class="fas fa-times"></i> Bağla
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Contact Modal Function
function showContactModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content info-modal-content">
            <div class="modal-header">
                <h2><i class="fas fa-envelope"></i> Əlaqə Məlumatları</h2>
                <button class="modal-close" onclick="this.closest('.modal').remove()">×</button>
            </div>
            <div class="modal-body">
                <div class="info-section">
                    <h3>👨‍💼 Layihə Rəhbəri</h3>
                    <div class="team-member">
                        <h4>Oğuz Məmmədov</h4>
                        <p><strong>Vəzifə:</strong> Baş Developer və Layihə Meneceri</p>
                        <p><strong>📧 Email:</strong> <a href="mailto:nsuenactus@gmail.com">nsuenactus@gmail.com</a></p>
                        <p><strong>🏢 Təşkilat:</strong> ADA University</p>
                        <p><strong>📍 Yer:</strong> Bakı, Azərbaycan</p>
                    </div>
                </div>
                
                <div class="info-section">
                    <h3>🏫 Təhsil Müəssisəsi</h3>
                    <p><strong>ADA University</strong></p>
                    <p>Bu layihə ADA University çərçivəsində təhsil məqsədilə hazırlanmışdır və gələcəkdə real istifadə üçün genişləndirilə bilər.</p>
                </div>
                
                <div class="info-section">
                    <h3>📞 Əlaqə Üçün</h3>
                    <ul>
                        <li><strong>Texniki Dəstək:</strong> Layihə haqqında suallar üçün</li>
                        <li><strong>Əməkdaşlıq:</strong> Layihənin inkişafında iştirak üçün</li>
                        <li><strong>Feedback:</strong> Təkliflər və şərhlər üçün</li>
                        <li><strong>Bug Reports:</strong> Texniki problemlər haqqında məlumat üçün</li>
                    </ul>
                </div>
                
                <div class="info-section">
                    <h3>⚡ Cavab Müddəti</h3>
                    <p>Bütün sorğular 24-48 saat ərzində cavablandırılacaq.</p>
                </div>
            </div>
            <div class="modal-actions">
                <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">
                    <i class="fas fa-times"></i> Bağla
                </button>
                <button class="btn btn-primary" onclick="window.open('mailto:nsuenactus@gmail.com?subject=EDUCE Layihəsi haqqında&body=Salam Oğuz,%0D%0A%0D%0AEDUCE layihəsi haqqında sualım var...', '_blank')">
                    <i class="fas fa-envelope"></i> Email Göndər
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Make essential functions globally available
window.handleStartNow = handleStartNow;
window.editProfile = editProfile;
window.showCustomerProfileModal = showCustomerProfileModal;
window.logoutCustomer = logoutCustomer;
window.checkCustomerLogin = checkCustomerLogin;
window.toggleProfile = toggleProfile;
// Demo Video Modal Functions
function showDemoModal() {
    console.log('📹 Opening demo video modal');
    const modal = document.getElementById('demoModal');
    if (modal) {
        modal.style.display = 'flex';
        // Add animation class
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        
        // Disable body scroll
        document.body.style.overflow = 'hidden';
    }
}

function closeDemoModal() {
    console.log('📹 Closing demo video modal');
    const modal = document.getElementById('demoModal');
    const video = document.getElementById('demoVideo');
    
    if (modal) {
        modal.classList.remove('show');
        
        // Stop video by reloading iframe src
        if (video) {
            const src = video.src;
            video.src = '';
            video.src = src.replace('autoplay=1', 'autoplay=0');
        }
        
        setTimeout(() => {
            modal.style.display = 'none';
            // Re-enable body scroll
            document.body.style.overflow = '';
        }, 300);
    }
}

// Close demo modal when clicking outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('demoModal');
    if (e.target === modal) {
        closeDemoModal();
    }
});

// Close demo modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modal = document.getElementById('demoModal');
        if (modal && modal.style.display === 'flex') {
            closeDemoModal();
        }
    }
});

window.showDemoModal = showDemoModal;
window.closeDemoModal = closeDemoModal;
window.showAboutModal = showAboutModal;
window.showTeamModal = showTeamModal;
window.showContactModal = showContactModal;

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