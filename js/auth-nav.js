db.auth.onAuthStateChange((_event, session) => {
  const user        = session?.user ?? null;
  const loginBtn    = document.getElementById('navLoginBtn');
  const registerBtn = document.getElementById('navRegisterBtn');
  const logoutBtn   = document.getElementById('navLogoutBtn');
  const userLabel   = document.getElementById('navUserLabel');

  if (user) {
    if (loginBtn)    loginBtn.style.display    = 'none';
    if (registerBtn) registerBtn.style.display = 'none';
    if (logoutBtn)   logoutBtn.style.display   = '';
    if (userLabel) {
      userLabel.style.display = '';
      userLabel.textContent   = user.email.split('@')[0];
    }
  } else {
    if (loginBtn)    loginBtn.style.display    = '';
    if (registerBtn) registerBtn.style.display = '';
    if (logoutBtn)   logoutBtn.style.display   = 'none';
    if (userLabel)   userLabel.style.display   = 'none';
  }
});

document.getElementById('navLogoutBtn')?.addEventListener('click', async () => {
  await db.auth.signOut();
  window.location.href = 'index.html';
});
