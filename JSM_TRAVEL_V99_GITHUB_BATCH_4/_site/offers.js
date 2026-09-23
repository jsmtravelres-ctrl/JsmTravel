async function loadOffers(){
let data;
try{const r=await fetch("offers-data.json",{cache:"no-store"});data=await r.json()}catch(e){data=[]}
const grid=document.getElementById("offersGrid");
if(!data.length){grid.innerHTML="<p>لا توجد عروض منشورة حاليًا.</p>";return}
data.forEach(o=>{const el=document.createElement("article");el.className="offer";el.innerHTML=`<span>${o.tag||"JSM OFFER"}</span><h3>${o.city||""}</h3><h4>${o.hotel||""}</h4><p>${o.details||""}</p><strong>${o.price||"استفسر"}</strong><a href="index.html#contact">اطلب العرض</a>`;grid.appendChild(el)})}
loadOffers();