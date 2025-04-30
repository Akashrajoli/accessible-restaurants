// Restaurant data
const restaurants = [
  {
    id: 1,
    name: "The Accessible Bistro",
    rating: 4.5,
    type: "French",
    features: ["Wheelchair access", "Braille menu", "Sign language staff"],
    image: "assets/restaurant1.jpg"
  },
  {
    id: 2,
    name: "Inclusive Eats",
    rating: 4.2,
    type: "International",
    features: ["Audio menus", "Wide aisles"],
    image: "assets/restaurant2.jpg"
  }
];

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
    renderRestaurants();
  }
});

function renderRestaurants() {
  const container = document.getElementById('restaurants-container');
  if (!container) return;
  
  container.innerHTML = '';
  
  restaurants.forEach(restaurant => {
    const card = createRestaurantCard(restaurant);
    container.appendChild(card);
  });
}

function navigateToRestaurant(id) {
  const restaurant = restaurants.find(r => r.id === id);
  localStorage.setItem('currentRestaurant', JSON.stringify(restaurant));
  window.location.href = 'restaurant.html';
}

// Helper function to format rating
function formatRating(rating) {
  return Math.round(rating * 10) / 10;
}