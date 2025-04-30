import { 
    db, 
    collection, 
    addDoc, 
    getDocs, 
    query, 
    where, 
    storage, 
    ref, 
    uploadBytes, 
    getDownloadURL, 
    restaurants 
  } from './firebase.js';
  import { authFunctions } from './auth.js';
  
  // DOM Elements
  const restaurantsContainer = document.getElementById('restaurants-container');
  const restaurantName = document.getElementById('restaurant-name');
  const restaurantImage = document.getElementById('restaurant-image');
  const restaurantDetails = document.getElementById('restaurant-details');
  const reviewsContainer = document.getElementById('reviews-container');
  const reviewForm = document.getElementById('review-form');
  const addReviewBtn = document.getElementById('add-review-btn');
  let ratingInput;
  
  // Initialize the app based on current page
  document.addEventListener('DOMContentLoaded', () => {
    // Setup authentication UI if on index page
    if (document.getElementById('auth-container')) {
      authFunctions.onAuthStateChanged((user) => {
        if (user) {
          console.log('User is signed in:', user.email);
        } else {
          console.log('No user signed in');
        }
      });
    }
  
    if (restaurantsContainer) {
      displayRestaurants();
    }
  
    if (restaurantName) {
      loadRestaurantDetails();
    }
  
    if (reviewForm) {
      ratingInput = document.querySelector('.rating-input');
      initRatingInput();
      setupReviewForm();
    }
  
    if (addReviewBtn) {
      addReviewBtn.addEventListener('click', () => {
        const id = new URLSearchParams(window.location.search).get('id');
        authFunctions.onAuthStateChanged((user) => {
          if (user) {
            window.location.href = `review.html?id=${id}`;
          } else {
            alert('Please sign in to submit a review');
            window.location.href = 'index.html';
          }
        });
      });
    }
  });
  
  // Display all restaurants on the home page
  function displayRestaurants() {
    restaurantsContainer.innerHTML = '';
    
    restaurants.forEach(restaurant => {
      const card = document.createElement('div');
      card.className = 'col-md-6 mb-4';
      card.innerHTML = `
        <div class="card h-100">
          <img src="${restaurant.image}" class="card-img-top" alt="${restaurant.name}">
          <div class="card-body">
            <h3 class="card-title">${restaurant.name}</h3>
            <p class="card-text">${restaurant.description}</p>
            <a href="restaurant.html?id=${restaurant.id}" class="btn btn-primary" aria-label="View details for ${restaurant.name}">
              View Details
            </a>
          </div>
        </div>
      `;
      restaurantsContainer.appendChild(card);
    });
  }
  
  // Load restaurant details on the restaurant page
  async function loadRestaurantDetails() {
    const id = new URLSearchParams(window.location.search).get('id');
    const restaurant = restaurants.find(r => r.id === id);
    
    if (restaurant) {
      restaurantName.textContent = restaurant.name;
      restaurantImage.src = restaurant.image;
      restaurantImage.alt = restaurant.name;
      
      // Display features
      let featuresHTML = '<h3>Accessibility Features</h3><ul class="list-group mb-4">';
      restaurant.features.forEach(feature => {
        featuresHTML += `<li class="list-group-item">${feature}</li>`;
      });
      featuresHTML += '</ul>';
      restaurantDetails.innerHTML = featuresHTML;
      
      // Load reviews from Firestore
      const q = query(collection(db, 'reviews'), where('restaurantId', '==', id));
      const querySnapshot = await getDocs(q);
      
      reviewsContainer.innerHTML = '';
      
      if (querySnapshot.empty) {
        reviewsContainer.innerHTML = '<p>No reviews yet. Be the first to review!</p>';
        return;
      }
      
      querySnapshot.forEach(doc => {
        const review = doc.data();
        const reviewDate = new Date(review.date).toLocaleDateString();
        
        const reviewElement = document.createElement('div');
        reviewElement.className = 'review-card mb-4 p-3 bg-light rounded';
        reviewElement.innerHTML = `
          <div class="d-flex justify-content-between align-items-center mb-2">
            <h4 class="mb-0">${review.reviewerName}</h4>
            <div class="rating" aria-label="Rated ${review.rating} out of 5 stars">
              ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
            </div>
          </div>
          <p class="mb-2">${review.text}</p>
          ${review.imageUrl ? `<img src="${review.imageUrl}" class="review-image img-thumbnail" alt="Review image">` : ''}
          <small class="text-muted">Reviewed on ${reviewDate}</small>
        `;
        reviewsContainer.appendChild(reviewElement);
      });
    }
  }
  
  // Initialize the star rating input
  function initRatingInput() {
    ratingInput.innerHTML = '';
    
    for (let i = 1; i <= 5; i++) {
      const starBtn = document.createElement('button');
      starBtn.type = 'button';
      starBtn.className = 'rating-star';
      starBtn.innerHTML = '★';
      starBtn.dataset.value = i;
      starBtn.setAttribute('aria-label', `Rate ${i} star${i > 1 ? 's' : ''}`);
      starBtn.setAttribute('aria-checked', 'false');
      starBtn.setAttribute('role', 'radio');
      starBtn.tabIndex = 0;
      
      starBtn.addEventListener('click', () => {
        updateRatingSelection(i);
      });
      
      // Keyboard navigation
      starBtn.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          const stars = Array.from(document.querySelectorAll('.rating-input button'));
          const currentIndex = stars.indexOf(e.target);
          const direction = e.key === 'ArrowRight' ? 1 : -1;
          const newIndex = (currentIndex + direction + stars.length) % stars.length;
          stars[newIndex].focus();
        } else if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          updateRatingSelection(i);
        }
      });
      
      ratingInput.appendChild(starBtn);
    }
  }
  
  function updateRatingSelection(selectedRating) {
    // Update visual selection
    document.querySelectorAll('.rating-input button').forEach(btn => {
      const value = parseInt(btn.dataset.value);
      const isSelected = value <= selectedRating;
      btn.setAttribute('aria-checked', isSelected);
      btn.classList.toggle('selected', isSelected);
    });
  }
  
  // Set up the review form submission
  function setupReviewForm() {
    authFunctions.onAuthStateChanged((user) => {
      if (!user) {
        reviewForm.innerHTML = `
          <div class="alert alert-info">
            Please <a href="index.html">sign in</a> to submit a review.
          </div>
        `;
        return;
      }
  
      // Restore original form if user is logged in
      reviewForm.innerHTML = `
        <h2 id="review-heading" class="mb-4">Share Your Experience</h2>
        <div class="mb-3">
          <label for="reviewer-name" class="form-label">Your Name</label>
          <input type="text" id="reviewer-name" class="form-control" required aria-required="true" value="${user.email.split('@')[0]}">
        </div>
        <div class="mb-3">
          <label class="form-label">Rating</label>
          <div class="rating-input" role="radiogroup" aria-labelledby="rating-label">
            <span id="rating-label" class="visually-hidden">Select a rating from 1 to 5 stars</span>
          </div>
        </div>
        <div class="mb-3">
          <label for="review-text" class="form-label">Review</label>
          <textarea id="review-text" class="form-control" rows="5" required aria-required="true"></textarea>
        </div>
        <div class="mb-3">
          <label for="review-image" class="form-label">Upload Image (Optional)</label>
          <input type="file" id="review-image" class="form-control" accept="image/*" aria-describedby="image-help">
          <div id="image-help" class="form-text">Maximum file size: 2MB</div>
        </div>
        <button type="submit" class="btn btn-primary">Submit Review</button>
      `;
  
      // Reinitialize rating input
      ratingInput = document.querySelector('.rating-input');
      initRatingInput();
  
      // Set up form submission
      reviewForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(reviewForm);
        const name = document.getElementById('reviewer-name').value;
        const text = document.getElementById('review-text').value;
        const rating = document.querySelector('.rating-input button[aria-checked="true"]')?.dataset.value;
        const imageFile = document.getElementById('review-image').files[0];
        const restaurantId = new URLSearchParams(window.location.search).get('id');
        
        if (!rating) {
          alert('Please select a rating');
          return;
        }
        
        let imageUrl = '';
        if (imageFile) {
          try {
            // Check file size (max 2MB)
            if (imageFile.size > 2 * 1024 * 1024) {
              alert('Image size must be less than 2MB');
              return;
            }
            
            // Upload image to Firebase Storage
            const storageRef = ref(storage, `reviews/${user.uid}/${Date.now()}_${imageFile.name}`);
            await uploadBytes(storageRef, imageFile);
            imageUrl = await getDownloadURL(storageRef);
          } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image. Please try again.');
            return;
          }
        }
        
        // Create review object
        const review = {
          restaurantId,
          reviewerName: name,
          reviewerId: user.uid,
          rating: parseInt(rating),
          text,
          imageUrl,
          date: new Date().toISOString()
        };
        
        try {
          // Add review to Firestore
          await addDoc(collection(db, 'reviews'), review);
          alert('Thank you for your review!');
          window.location.href = `restaurant.html?id=${restaurantId}`;
        } catch (error) {
          console.error('Error adding review:', error);
          alert('There was an error submitting your review. Please try again.');
        }
      });
    });
  }