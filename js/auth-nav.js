db.auth.onAuthStateChange((_event, session) => {
  const user        = session?.user ?? null;
  const loginBtn    = document.getElementById('navLoginBtn');
  const registerBtn = document.getElementById('navRegisterBtn');
  const logoutBtn   = document.getElementById('navLogoutBtn');
  const userLabel   = document.getElementById('navUserLabel');
  const registerLi  = document.querySelector('.nav__links a[href="register.html"]')?.parentElement;

  if (user) {
    if (loginBtn)    loginBtn.style.display    = 'none';
    if (registerBtn) registerBtn.style.display = 'none';
    if (registerLi)  registerLi.style.display  = 'none';
    if (logoutBtn)   logoutBtn.style.display   = '';
    if (userLabel) {
      userLabel.style.display = '';
      userLabel.textContent   = user.email.split('@')[0];
    }

    // Add Dashboard button if not already present
    if (!document.getElementById('navDashboardBtn') && logoutBtn) {
      const btn = document.createElement('a');
      btn.href = 'dashboard.html';
      btn.id   = 'navDashboardBtn';
      btn.className = 'btn btn--ghost btn--sm';
      btn.textContent = 'Dashboard';
      logoutBtn.parentElement.insertBefore(btn, logoutBtn);
    }
  } else {
    if (loginBtn)    loginBtn.style.display    = '';
    if (registerBtn) registerBtn.style.display = '';
    if (registerLi)  registerLi.style.display  = '';
    if (logoutBtn)   logoutBtn.style.display   = 'none';
    if (userLabel)   userLabel.style.display   = 'none';
    const dashBtn = document.getElementById('navDashboardBtn');
    if (dashBtn) dashBtn.remove();
  }
});

document.getElementById('navLogoutBtn')?.addEventListener('click', async () => {
  await db.auth.signOut();
  window.location.href = 'index.html';
});
