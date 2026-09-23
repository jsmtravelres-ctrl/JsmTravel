(async function(){
  const out=document.getElementById("homeHotelResults"); if(!out)return;
  const q=document.getElementById("homeHotelSearch"), city=document.getElementById("homeHotelCity"), stars=document.getElementById("homeHotelStars"), reset=document.getElementById("homeHotelReset");
  try{
    const data=await (await fetch("hotels-data.json",{cache:"no-store"})).json();
    const media=await (await fetch("hotels-media.json",{cache:"no-store"})).json().catch(()=>({}));
    const fallbacks={
      "شرم الشيخ":"https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=82",
      "الغردقة":"https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=82",
      "دهب":"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=82",
      "مرسى علم":"https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&q=82",
      "العين السخنة":"https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=82",
      "طابا":"https://images.unsplash.com/photo-1470214304380-aadaedcfff1b?auto=format&fit=crop&w=1200&q=82",
      "الساحل الشمالي":"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=82",
      "سيوة":"https://images.unsplash.com/photo-1470214304380-aadaedcfff1b?auto=format&fit=crop&w=1200&q=82"
    };
    const rows=[]; Object.entries(data).forEach(([destination,list])=>list.forEach(x=>{const m=media[x[0]]||{}; rows.push({destination,name:x[0],stars:x[1],img:x[2]||m.image||fallbacks[destination]||fallbacks["الغردقة"],desc:x[3]||m.description||"",ar:x[4]||m.arabicName||""});}));
    function esc(v){return String(v).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m]));}
    function render(){
      const term=(q.value||"").trim().toLowerCase(), c=city.value, st=stars.value;
      const hit=rows.filter(x=>(!term||[x.name,x.ar,x.destination,x.desc].join(" ").toLowerCase().includes(term))&&(!c||x.destination===c)&&(!st||String(x.stars)===st));
      const shown=hit.slice(0,12);
      out.innerHTML=shown.length?shown.map(x=>`<article class="hotel-result"><div class="hotel-result-media">${x.img?`<img src="${esc(x.img)}" alt="${esc(x.ar||x.name)}" loading="lazy" onerror="this.onerror=null;this.src='${esc(fallbacks[x.destination]||fallbacks["الغردقة"])}'">`:`<div class="hotel-no-photo">JSM</div>`}</div><div class="hotel-result-body"><span class="eyebrow">${esc(x.destination)}</span><h4>${esc(x.ar||x.name)}</h4><div class="hotel-en">${esc(x.name)}</div><div class="hotel-rating">${x.stars?`${x.stars}★`:'التصنيف غير محدد'}</div><p>${esc(x.desc)}</p><a class="btn primary" href="destinations.html#${({"شرم الشيخ":"sharm-el-sheikh","الغردقة":"hurghada","دهب":"dahab","مرسى علم":"marsa-alam","العين السخنة":"ain-sokhna","طابا":"taba","الساحل الشمالي":"north-coast","سيوة":"siwa-oasis"}[x.destination]||"")}">عرض الوجهة</a></div></article>`).join(""):`<p class="empty-state">لا توجد نتائج مطابقة. جرّب اسمًا آخر أو اختر وجهة مختلفة.</p>`;
      if(hit.length>12) out.insertAdjacentHTML("beforeend",`<div class="hotel-more-note">يعرض الموقع أول 12 نتيجة من أصل ${hit.length}. استخدم صفحة الوجهات لاستعراض القائمة كاملة.</div>`);
    }
    [q,city,stars].forEach(el=>el.addEventListener("input",render)); reset.addEventListener("click",()=>{q.value="";city.value="";stars.value="";render()}); render();
  }catch(e){out.innerHTML="<p class=\"empty-state\">تعذر تحميل مجموعة الفنادق حاليًا.</p>"}
})();
