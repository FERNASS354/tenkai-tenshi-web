(() => {
  document.documentElement.classList.add('js');
  const button=document.querySelector('.menu-button');
  const nav=document.querySelector('.site-nav');
  const close=()=>{nav?.classList.remove('open');button?.setAttribute('aria-expanded','false');};
  button?.addEventListener('click',()=>{const open=nav.classList.toggle('open');button.setAttribute('aria-expanded',String(open));});
  nav?.addEventListener('click',e=>{if(e.target.closest('a'))close();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
  window.addEventListener('resize',()=>{if(innerWidth>1280)close();});
  const dialog=document.querySelector('.lightbox');
  let opener;
  document.querySelectorAll('[data-preview]').forEach(link=>link.addEventListener('click',e=>{
    if(!dialog||typeof dialog.showModal!=='function')return;
    e.preventDefault();opener=link;
    const img=dialog.querySelector('img');img.src=link.href;img.alt=link.dataset.caption||link.querySelector('img')?.alt||'Pantalla de la aplicación';
    dialog.querySelector('#preview-caption').textContent=img.alt;
    dialog.showModal();
  }));
  dialog?.addEventListener('close',()=>opener?.focus());
  dialog?.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
  document.querySelector('.print-button')?.addEventListener('click',()=>window.print());
  const filter=document.querySelector('#topic-filter');
  filter?.addEventListener('input',()=>{
    const normalize=v=>v.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
    const query=normalize(filter.value.trim());let count=0;
    document.querySelectorAll('.manual-sidebar nav a').forEach(link=>{link.hidden=!normalize(link.textContent).includes(query);if(!link.hidden)count++;});
    document.querySelector('#filter-result').textContent=query?`${count} temas encontrados`:'';
  });
  const estimator=document.querySelector('#time-estimator');
  if(estimator){
    const update=()=>{
      const inputs=[...estimator.querySelectorAll('input')];
      if(inputs.some(i=>!i.checkValidity()||i.value.trim()==='')){document.querySelector('#time-result').textContent='Introduce cantidades válidas para calcular.';return;}
      const [items,seconds,batch]=inputs.map(i=>Number(i.value));
      const manual=items*seconds/60;const difference=manual-batch;
      document.querySelector('#time-result').textContent=`Recaptura estimada: ${Math.round(manual)} min. Lista digital: ${Math.round(batch)} min. ${difference>0?`Diferencia estimada: ${Math.round(difference)} min.`:'Con estos tiempos no se estima ahorro.'}`;
    };
    estimator.addEventListener('submit',e=>e.preventDefault());estimator.addEventListener('input',update);update();
  }
  const languageButtons=[...document.querySelectorAll('.lang-btn')];
  if(languageButtons.length){
    const setLanguage=lang=>{
      document.body.classList.toggle('lang-es',lang==='es');
      document.documentElement.lang=lang==='es'?'es-MX':'en';
      languageButtons.forEach(b=>b.classList.toggle('active',b.dataset.langTarget===lang));
      try{localStorage.setItem('tenkai_lang',lang);}catch{}
    };
    let saved='es';try{saved=localStorage.getItem('tenkai_lang')||'es';}catch{}
    setLanguage(saved==='en'?'en':'es');
    languageButtons.forEach(btn=>btn.addEventListener('click',()=>setLanguage(btn.dataset.langTarget)));
  }
})();
