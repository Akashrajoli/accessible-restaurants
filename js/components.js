// Create accessible restaurant card
function createRestaurantCard(restaurant) {
    const col = document.createElement('div');
    col.className = 'col-md-6 mb-4';
    
    const card = document.createElement('div');
    card.className = 'card h-100';
    card.setAttribute('role', 'article');
    card.setAttribute('aria-label', `${restaurant.name}, ${restaurant.type}`);
    
    const img = document.createElement('img');
    img.src = restaurant.image;
    img.alt = restaurant.name;
    img.className = 'card-img-top';
    img.loading = 'lazy';
    card.appendChild(img);
    
    const cardBody = document.createElement('div');
    cardBody.className = 'card-body';
    
    const title = document.createElement('h3');
    title.className = 'card-title h5';
    title.textContent = restaurant.name;
    cardBody.appendChild(title);
    
    const type = document.createElement('p');
    type.className = 'card-text text-muted';
    type.textContent = restaurant.type;
    cardBody.appendChild(type);
    
    const rating = createRatingDisplay(restaurant.rating);
    cardBody.appendChild(rating);
    
    const features = document.createElement('div');
    features.className = 'mt-3';
    restaurant.features.forEach(feature => {
      const featureItem = document.createElement('p');
      featureItem.className = 'mb-1';
      featureItem.innerHTML = `<i class="bi bi-check-circle-fill text-success me-2" aria-hidden="true"></i>${feature}`;
      features.appendChild(featureItem);
    });
    cardBody.appendChild(features);
    
    card.appendChild(cardBody);
    
    const cardFooter = document.createElement('div');
    cardFooter.className = 'card-footer bg-white border-0 pb-3';
    
    const button = document.createElement('button');
    button.className = 'btn btn-primary';
    button.textContent = 'View Details';
    button.addEventListener('click', () => navigateToRestaurant(restaurant.id));
    button.setAttribute('aria-label', `View details for ${restaurant.name}`);
    cardFooter.appendChild(button);
    
    card.appendChild(cardFooter);
    col.appendChild(card);
    
    return col;
  }
  
  // Create rating display
  function createRatingDisplay(rating) {
    const container = document.createElement('div');
    container.className = 'rating-container mb-2';
    container.setAttribute('aria-label', `Rating: ${formatRating(rating)} out of 5 stars`);
    
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      const star = document.createElement('i');
      star.className = 'bi bi-star-fill text-warning me-1';
      
      if (i > fullStars) {
        star.className = 'bi bi-star text-warning me-1';
      }
      if (i === fullStars + 1 && hasHalfStar) {
        star.className = 'bi bi-star-half text-warning me-1';
      }
      
      container.appendChild(star);
    }
    
    // Add numeric rating for screen readers
    const srOnly = document.createElement('span');
    srOnly.className = 'visually-hidden';
    srOnly.textContent = `(${formatRating(rating)} out of 5)`;
    container.appendChild(srOnly);
    
    return container;
  }