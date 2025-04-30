import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { app } from './firebase.js';

// Initialize Firebase Authentication
const auth = getAuth(app);

// Authentication functions
export const authFunctions = {
  // Sign up new users
  async signUp(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Sign in existing users
  async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Sign out current user
  async signOutUser() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Check current auth state
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  },

  // Get current user
  getCurrentUser() {
    return auth.currentUser;
  }
};

// Auth UI management
export function setupAuthUI() {
  const authContainer = document.getElementById('auth-container');
  const userEmailSpan = document.getElementById('user-email');
  const signInForm = document.getElementById('signin-form');
  const signUpForm = document.getElementById('signup-form');
  const signOutBtn = document.getElementById('signout-btn');

  if (!authContainer) return;

  // Show user email when logged in
  authFunctions.onAuthStateChanged((user) => {
    if (user) {
      authContainer.innerHTML = `
        <div class="d-flex align-items-center gap-2">
          <span>Signed in as <strong id="user-email">${user.email}</strong></span>
          <button id="signout-btn" class="btn btn-outline-danger btn-sm">Sign Out</button>
        </div>
      `;
      document.getElementById('signout-btn').addEventListener('click', async () => {
        await authFunctions.signOutUser();
      });
    } else {
      authContainer.innerHTML = `
        <div class="auth-forms">
          <form id="signin-form" class="mb-3">
            <h3>Sign In</h3>
            <div class="mb-2">
              <input type="email" class="form-control" placeholder="Email" required>
            </div>
            <div class="mb-2">
              <input type="password" class="form-control" placeholder="Password" required>
            </div>
            <button type="submit" class="btn btn-primary">Sign In</button>
          </form>
          
          <form id="signup-form">
            <h3>Sign Up</h3>
            <div class="mb-2">
              <input type="email" class="form-control" placeholder="Email" required>
            </div>
            <div class="mb-2">
              <input type="password" class="form-control" placeholder="Password (min 6 chars)" required>
            </div>
            <button type="submit" class="btn btn-secondary">Create Account</button>
          </form>
        </div>
      `;

      // Add form event listeners
      document.getElementById('signin-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;
        const result = await authFunctions.signIn(email, password);
        if (!result.success) alert(result.error);
      });

      document.getElementById('signup-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = e.target[0].value;
        const password = e.target[1].value;
        const result = await authFunctions.signUp(email, password);
        if (!result.success) alert(result.error);
      });
    }
  });
}