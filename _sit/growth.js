(function(){
  const KEY='jsm_growth_session';
  let sid=localStorage.getItem(KEY);
  if(!sid){sid=(crypto.randomUUID?crypto.randomUUID():String(Date.now())+'-'+Math.random().toString(36).slice(2));localStorage.setItem(KEY,sid);}
  const send=(event_type,target='',metadata={})=>{
    const payload={event_type,page_path:location.pathname,target,referrer:document.referrer,session_id:sid,metadata};
    const body=JSON.stringify(payload);
    if(navigator.sendBeacon){try{navigator.sendBeacon('/api/analytics/event',new Blob([body],{type:'application/json'}));return;}catch(e){}}
    fetch('/api/analytics/event',{method:'POST',headers:{'content-type':'application/json'},body}).catch(()=>{});
  };
  send('pageview');
  document.addEventListener('click',function(e){
    const el=e.target.closest('a,button');
    if(!el)return;
    const href=el.getAttribute('href')||'';
    const label=(el.textContent||el.getAttribute('aria-label')||'').trim().slice(0,120);
    const relevant=el.hasAttribute('data-cta') || /booking|book|hotel|flight|visa|trip|honeymoon|nile|whatsapp|contact|request|عرض|حجز|تأشيرة|رحلة/i.test(href+' '+label);
    if(relevant)send('cta_click',href||label,{label});
  });
  window.JSMGrowth={track:function(type,target,metadata){send(type,target,metadata||{});}};
})();