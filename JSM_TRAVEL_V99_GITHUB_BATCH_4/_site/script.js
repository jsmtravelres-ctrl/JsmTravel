let currentLang=document.documentElement.lang==="en"?"en":"ar";const phone="201155595342";
const lb=document.getElementById("langBtn");
if(lb) lb.addEventListener("click",()=>{window.location.href=currentLang==="ar"?"en.html":"index.html"});


(function(){
 const nav=document.querySelector('.nav');
 if(!nav) return;
 const btn=document.createElement('button'); btn.className='nav-toggle'; btn.type='button'; btn.setAttribute('aria-label','فتح القائمة'); btn.setAttribute('aria-expanded','false'); btn.textContent='☰';
 const brand=nav.querySelector('.brand'); if(brand) brand.insertAdjacentElement('afterend',btn);
 btn.addEventListener('click',()=>{const open=nav.classList.toggle('menu-open');btn.setAttribute('aria-expanded',String(open));btn.textContent=open?'✕':'☰';});
 nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('menu-open');btn.setAttribute('aria-expanded','false');btn.textContent='☰';}));
})();

(function(){const f=document.getElementById('serviceRequestForm');if(!f)return;const stored=sessionStorage.getItem('jsmHotelRequest');if(stored){const notes=document.getElementById('reqNotes');if(notes&&!notes.value)notes.value=(document.documentElement.lang==='en'?'Hotel selected: ':'الفندق المطلوب: ')+stored;sessionStorage.removeItem('jsmHotelRequest')}f.addEventListener('submit',function(e){e.preventDefault();const v=id=>document.getElementById(id)?.value.trim()||'';const lines=[document.documentElement.lang==='en'?'Hello JSM TRAVEL 👋':'مرحباً JSM TRAVEL 👋',document.documentElement.lang==='en'?'Travel service request':'طلب خدمة سفر',`${document.documentElement.lang==='en'?'Service':'الخدمة'}: ${v('reqService')}`,`${document.documentElement.lang==='en'?'Destination':'الوجهة'}: ${v('reqDestination')}`,`${document.documentElement.lang==='en'?'Travel date':'تاريخ السفر'}: ${v('reqDate')}`,`${document.documentElement.lang==='en'?'Travelers':'المسافرون'}: ${v('reqPeople')}`,`${document.documentElement.lang==='en'?'Mobile / WhatsApp':'الموبايل / واتساب'}: ${v('reqPhone')}`,`${document.documentElement.lang==='en'?'Additional details':'تفاصيل إضافية'}: ${v('reqNotes')}`];window.open('https://wa.me/'+phone+'?text='+encodeURIComponent(lines.join('\n')),'_blank','noopener,noreferrer')})})();
