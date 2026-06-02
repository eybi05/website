(async () => {
  const { data: { user } } = await db.auth.getUser();
  const loginBtn   = document.getElementById('navLoginBtn');
  const registerBtn = document.getElementById('navRegisterBtn');
  const logoutBtn  = document.getElementById('navLogoutBtn');
  const userLabel  = document.getElementById('navUserLabel');

  if (user) {
    if (loginBtn)    loginBtn.style.display    = 'none';
    if (registerBtn) registerBtn.style.display = 'none';
    if (logoutBtn)   logoutBtn.style.display   = '';
    if (userLabel) {
      userLabel.style.display = '';
      userLabel.textContent   = user.email.split('@')[0];
    }
  }
})();

document.getElementById('navLogoutBtn')?.addEventListener('click', async () => {
  await db.auth.signOut();
  window.location.href = 'index.html';
});
