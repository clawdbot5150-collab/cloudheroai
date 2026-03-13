// Cloud Hero AI — Newsletter Subscribe Handler
// Wires all newsletter forms to POST /api/newsletter/subscribe

async function handleSubscribe(e) {
  e.preventDefault();

  const btn = document.getElementById('subscribe-btn');
  const emailInput = document.getElementById('email-input');
  const nameInput = document.getElementById('name-input');
  const roleInput = document.getElementById('role-input');

  const email = emailInput ? emailInput.value.trim() : '';
  const firstName = nameInput ? nameInput.value.trim() : '';
  const role = roleInput ? roleInput.value : '';

  // Validate email
  if (!email || !email.includes('@') || !email.includes('.')) {
    if (emailInput) {
      emailInput.style.borderColor = '#FF5F57';
      emailInput.style.animation = 'shake 0.4s ease';
      setTimeout(() => {
        emailInput.style.animation = '';
        emailInput.style.borderColor = '';
      }, 600);
    }
    return;
  }

  // Loading state
  const originalText = btn.innerHTML;
  btn.innerHTML = '<span style="display:inline-flex;align-items:center;gap:8px"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>Subscribing...</span>';
  btn.disabled = true;
  btn.style.opacity = '0.8';

  try {
    const res = await fetch('/api/newsletter/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        first_name: firstName,
        role,
        source: document.title.includes('Weekly') ? 'weekly-page' : 'homepage'
      })
    });

    const data = await res.json();

    if (res.ok && data.success) {
      // Success state
      btn.innerHTML = '✓ ' + data.message;
      btn.style.background = 'var(--green)';
      btn.style.color = 'var(--navy)';
      btn.style.opacity = '1';
      if (emailInput) emailInput.style.borderColor = 'var(--green)';
    } else {
      // API error
      btn.innerHTML = originalText;
      btn.disabled = false;
      btn.style.opacity = '1';
      showFormError(data.error || 'Something went wrong. Please try again.');
    }
  } catch (err) {
    // Network error
    btn.innerHTML = originalText;
    btn.disabled = false;
    btn.style.opacity = '1';
    showFormError('Connection error. Please try again.');
  }
}

function showFormError(msg) {
  let errEl = document.getElementById('newsletter-error');
  if (!errEl) {
    errEl = document.createElement('p');
    errEl.id = 'newsletter-error';
    errEl.style.cssText = 'color:#FF5F57;font-size:13px;margin-top:8px;text-align:center;';
    const btn = document.getElementById('subscribe-btn');
    if (btn && btn.parentNode) btn.parentNode.insertBefore(errEl, btn.nextSibling);
  }
  errEl.textContent = msg;
  setTimeout(() => { if (errEl) errEl.textContent = ''; }, 4000);
}

// Add shake keyframe if not present
if (!document.getElementById('newsletter-shake-style')) {
  const style = document.createElement('style');
  style.id = 'newsletter-shake-style';
  style.textContent = '@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}';
  document.head.appendChild(style);
}
