(async function(){
  const finder=document.getElementById('hotelFinder'); if(!finder)return;
  try{
    const data=await (await fetch('hotels-data.json',{cache:'no-store'})).json();
    const media=await (await fetch('hotels-media.json',{cache:'no-store'})).json().catch(()=>({}));
    const fallback='https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=82';
    const cityFallback={
      'شرم الشيخ':'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=82',
      'الغردقة':'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=82',
      'دهب':'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=82',
      'مرسى علم':'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&q=82',
      'العين السخنة':'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=82',
      'طابا':'https://images.unsplash.com/photo-1470214304380-aadaedcfff1b?auto=format&fit=crop&w=1200&q=82',
      'الساحل الشمالي':'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=82',
      'سيوة':'https://images.unsplash.com/photo-1470214304380-aadaedcfff1b?auto=format&fit=crop&w=1200&q=82'
    };
    const rows=[]; Object.entries(data).forEach(([city,list])=>list.forEach(x=>{const m=media[x[0]]||{}; rows.push({city,name:x[0],stars:x[1],img:x[2]||m.image||fallback,desc:x[3]||m.description||'',ar:x[4]||m.arabicName||''})}));
    const q=document.getElementById('hotelSearch'), city=document.getElementById('hotelCity'), stars=document.getElementById('hotelStars'), out=document.getElementById('hotelResults');
    function render(){
      const term=(q.value||'').trim().toLowerCase(); const c=city.value; const st=stars.value;
      const hit=rows.filter(x=>(!term || [x.name,x.ar,x.city,x.desc].join(' ').toLowerCase().includes(term)) && (!c||x.city===c) && (!st||String(x.stars)===st)).slice(0,60);
      out.innerHTML=hit.length?hit.map(x=>`<article class="hotel-result"><div class="hotel-result-media">${x.img?`<img src="${x.img}" alt="${x.ar||x.name}" loading="lazy">`:'<div class="hotel-no-photo">JSM</div>'}</div><div class="hotel-result-body"><span class="eyebrow">${x.city}</span><h4>${x.ar||x.name}</h4><div class="hotel-en">${x.name}</div><div class="hotel-rating">${x.stars?`${x.stars}★`:'تصنيف غير محدد'}</div>${x.desc?`<p>${x.desc}</p>`:''}<a class="btn primary" href="index.html#contact" onclick="sessionStorage.setItem('jsmHotelRequest',${JSON.stringify((x.ar||x.name)+' - '+x.city).replace(/</g,'\u003c')})">اطلب عرض الفندق</a></div></article>`).join(''):'<p class="empty-state">لا توجد نتائج مطابقة. جرّب اسمًا آخر أو غيّر الوجهة.</p>';
    }
    [q,city,stars].forEach(el=>el.addEventListener('input',render));
    document.getElementById('hotelSearchBtn')?.addEventListener('click',render); render();
  }catch(e){document.getElementById('hotelResults').innerHTML='<p class="empty-state">تعذر تحميل البحث حاليًا.</p>'}
})();

(async function(){
  const box=document.getElementById('hotelGuide'); if(!box)return;
  try{
    const data=await (await fetch('hotels-data.json',{cache:'no-store'})).json();
    const media=await (await fetch('hotels-media.json',{cache:'no-store'})).json().catch(()=>({}));
    const fallback='https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=82';
    const cityFallback={
      'شرم الشيخ':'https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=82',
      'الغردقة':'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=82',
      'دهب':'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=82',
      'مرسى علم':'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&q=82',
      'العين السخنة':'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=82',
      'طابا':'https://images.unsplash.com/photo-1470214304380-aadaedcfff1b?auto=format&fit=crop&w=1200&q=82',
      'الساحل الشمالي':'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=82',
      'سيوة':'https://images.unsplash.com/photo-1470214304380-aadaedcfff1b?auto=format&fit=crop&w=1200&q=82'
    };
    const order=['شرم الشيخ','الغردقة','دهب','مرسى علم','العين السخنة','الساحل الشمالي','طابا','سيوة'];
    let serial=0;
    box.innerHTML=order.map(city=>{
      const rows=data[city]||[];
      const stars=[5,4,3].map(n=>`<span class="hotel-star-filter"><b>${n}★</b> ${rows.filter(x=>x[1]===n).length}</span>`).join('');
      const items=rows.map(x=>{serial++; const m=media[x[0]]||{}; const imgUrl=x[2]||m.image||cityFallback[x[0]]||fallback; const img=`<img class="hotel-photo" src="${imgUrl}" alt="${x[4]||m.arabicName||x[0]}" loading="lazy" onerror="this.onerror=null;this.src='${cityFallback[x[0]]||fallback}'">`; const desc=x[3]?`<p class="hotel-desc">${x[3]}</p>`:''; const ar=x[4]?`<span class="hotel-ar">${x[4]}</span>`:''; return `<div class="hotel-row hotel-row-rich"><span>${serial}</span><div class="hotel-content">${img}<div><strong>${x[4]||x[0]}</strong><small class="hotel-en">${x[0]}</small>${ar?'' : ''}<em>${x[1]?x[1]+'★':'تصنيف غير محدد'}</em>${desc}</div></div></div>`}).join('');
      return `<article class="detail-card hotel-card"><p class="eyebrow">${city}</p><h3>${city}</h3><div class="hotel-summary">${stars}<span class="hotel-total">${rows.length} إقامة</span></div><div class="hotel-list">${items}</div><a class="btn primary" href="index.html#contact">اطلب عرض فندق</a></article>`;
    }).join('');
  }catch(e){box.innerHTML='<p>تعذر تحميل دليل الفنادق حاليًا.</p>'}
})();
