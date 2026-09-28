/*
JSM TRAVEL — Analytics & Optimization
يعمل مع Google Analytics 4 إذا كان gtag متاحاً.
ضع Measurement ID الحقيقي في كود الموقع الرئيسي.
*/

window.JSMAnalytics = {
  event(name, params={}){
    if(typeof window.gtag === 'function'){
      window.gtag('event', name, params);
    }
    // Optional first-party endpoint:
    // fetch('/api/events',{method:'POST',headers:{'Content-Type':'application/json'},
    // body:JSON.stringify({name,params,url:location.href,ts:new Date().toISOString()})});
  },

  pageView(){
    this.event('page_view',{
      page_location:location.href,
      page_title:document.title
    });
  },

  hotelView(hotel){
    this.event('view_hotel',{
      hotel_id:hotel.id || hotel.slug,
      hotel_name:hotel.name_ar || hotel.name,
      destination:hotel.destination,
      stars:hotel.stars
    });
  },

  cta(type, details={}){
    this.event('cta_click',Object.assign({cta_type:type},details));
  },

  leadStart(details={}){
    this.event('lead_form_start',details);
  },

  leadSubmit(details={}){
    this.event('generate_lead',details);
  }
};

document.addEventListener('click',e=>{
  const a=e.target.closest('[data-analytics-cta]');
  if(!a) return;
  JSMAnalytics.cta(a.dataset.analyticsCta,{
    href:a.href||'',
    text:(a.textContent||'').trim()
  });
});

JSMAnalytics.pageView();
