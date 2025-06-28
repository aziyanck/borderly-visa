import supabase from './supabase-client.js';
import { displayMessage, redirectTo } from './ui.js';

async function handleLogin(event) {
  event.preventDefault();

  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const loginMessage = document.getElementById('login-message');
  const loginButton = event.submitter;

  if (!emailInput || !passwordInput || !loginMessage || !loginButton) {
    console.error('Login form elements not found. Cannot proceed with login.');
    return;
  }

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    displayMessage('login-message', 'Please enter both email and password.', true);
    return;
  }

  loginButton.disabled = true;
  loginButton.textContent = 'Logging In...';
  displayMessage('login-message', 'Attempting to log in...');

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.error('Supabase Login error:', error);
      displayMessage(
        'login-message',
        `Login failed: ${error.message}. Please check your credentials.`,
        true
      );
    } else if (data.user) {
      displayMessage('login-message', 'Login successful! Redirecting...', false);
      redirectTo('/admin/editor.html');
    } else {
      console.warn('Login returned no user or error:', data);
      displayMessage('login-message', 'Login failed: Unknown issue. Please try again.', true);
    }
  } catch (unexpectedError) {
    console.error('Unexpected error during login:', unexpectedError);
    displayMessage('login-message', 'An unexpected error occurred during login. Please try again.', true);
  } finally {
    loginButton.disabled = false;
    loginButton.textContent = 'Log In';
  }
}

async function handleLogout() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Supabase Logout error:', error.message);
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
      logoutButton.textContent = 'Logout failed';
      setTimeout(() => {
        logoutButton.textContent = 'Logout';
      }, 2000);
    }
  } else {
    redirectTo('/');
  }
}

export { handleLogin, handleLogout };
