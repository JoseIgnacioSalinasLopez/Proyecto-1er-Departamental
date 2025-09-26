 // ===== Helper: simple email regex (suficiente para demo) =====
    const emailRE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Elements
    const form = document.getElementById('contactForm');
    const nameEl = document.getElementById('name');
    const emailEl = document.getElementById('email');
    const msgEl = document.getElementById('message');
    const errName = document.getElementById('err-name');
    const errEmail = document.getElementById('err-email');
    const errMsg = document.getElementById('err-message');
    const modal = document.getElementById('modal');
    const closeModal = document.getElementById('closeModal');

    // Real-time validation
    function validateName(){
      const v = nameEl.value.trim();
      if(!v){ errName.classList.add('show'); return false }
      errName.classList.remove('show'); return true
    }
    function validateEmail(){
      const v = emailEl.value.trim();
      if(!emailRE.test(v)){ errEmail.classList.add('show'); return false }
      errEmail.classList.remove('show'); return true
    }
    function validateMsg(){
      const v = msgEl.value.trim();
      if(!v){ errMsg.classList.add('show'); return false }
      errMsg.classList.remove('show'); return true
    }

    nameEl.addEventListener('input', validateName);
    emailEl.addEventListener('input', validateEmail);
    msgEl.addEventListener('input', validateMsg);

    form.addEventListener('submit', function(e){
      e.preventDefault();
      const ok = validateName() & validateEmail() & validateMsg();
      if(ok){
        // Simular envío exitoso
        showModal();
        launchConfetti(14);
        form.reset();
      } else {
        // focus first invalid
        if(!validateName()){ nameEl.focus(); }
        else if(!validateEmail()){ emailEl.focus(); }
        else if(!validateMsg()){ msgEl.focus(); }
      }
    });

    closeModal.addEventListener('click', ()=>{ hideModal() });

    function showModal(){ modal.classList.add('show') }
    function hideModal(){ modal.classList.remove('show') }

    // Close modal on Esc or click outside
    window.addEventListener('keydown', (e)=>{ if(e.key==='Escape') hideModal(); });
    modal.addEventListener('click', (e)=>{ if(e.target === modal) hideModal(); });

    // ===== Subscribe buttons + small animation =====
    const subs = document.querySelectorAll('#suscribeTop, #suscribeRight, #suscribeBottom');
    subs.forEach(el=> el.addEventListener('click', (ev)=>{
      // pulsación agradable
      el.animate([{transform:'scale(1)'},{transform:'scale(.96)'},{transform:'scale(1)'}],{duration:260,easing:'ease-out'});
      launchConfetti(10);
    }));

    // ===== Confetti implementation (10-15 pieces) =====
    function launchConfetti(count=12){
      const colors = ['#ff7675','#74b9ff','#55efc4','#fdcb6e','#a29bfe','#00cec9'];
      const body = document.body;
      const pieces = [];
      for(let i=0;i<count;i++){
        const el = document.createElement('div');
        el.className = 'confetti-piece';
        const w = Math.floor(Math.random()*10)+6; // width
        const h = Math.floor(Math.random()*14)+8; // height
        el.style.width = w+'px'; el.style.height = h+'px';
        el.style.left = Math.random()*100 + '%';
        el.style.background = colors[Math.floor(Math.random()*colors.length)];
        el.style.opacity = 0.95;
        // random rotation origin
        el.style.transform = `translateY(-20vh) rotate(${Math.random()*360}deg)`;

        const duration = 1600 + Math.random()*1800; // 1.6s - 3.4s
        const delay = Math.random()*120; // small delay
        el.style.animation = `fall ${duration}ms cubic-bezier(.2,.7,.3,1) ${delay}ms both`;
        el.style.left = (Math.random()*90 + 5)+'%';
        // slight horizontal sway using CSS variable with animation via translateX keyframes (applied inline via animation)
        // Add some tilt via transform-origin variation
        el.style.transformOrigin = `${Math.random()*100}% ${Math.random()*100}%`;

        body.appendChild(el);
        pieces.push(el);
      }
      // remove pieces later
      setTimeout(()=>{
        pieces.forEach(p=> p.remove());
      }, 4800);
    }

    // Accessibility: focus visible when tabbing
    document.addEventListener('keydown', function(e){ if(e.key==='Tab') document.documentElement.style.scrollBehavior='smooth' });

    // Demo: try button scrolls to contact
    document.getElementById('try').addEventListener('click', ()=>{ document.getElementById('contact').scrollIntoView({behavior:'smooth'}) });
