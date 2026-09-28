const offers=[
 {tag:'HOTEL COLLECTION',city:'Hurghada',hotel:'Selected stays',details:'Hotels and resorts according to travel dates, party size and current availability.',price:'Request current price'},
 {tag:'SEA ESCAPE',city:'Sharm El Sheikh',hotel:'Stays & marine experiences',details:'Accommodation, sea activities and programs according to season, dates and availability.',price:'Request details'},
 {tag:'DISCOVER EGYPT',city:'Dahab / Marsa Alam',hotel:'Distinct coastal experiences',details:'Stays and experiences matched to the trip style, duration and budget.',price:'Request details'}
];
const grid=document.getElementById('homeOffers');if(grid)offers.forEach(o=>{const el=document.createElement('article');el.className='offer';el.innerHTML=`<span>${o.tag}</span><h3>${o.city}</h3><h4>${o.hotel}</h4><p>${o.details}</p><strong>${o.price}</strong><a href="en.html#contact">Request details</a>`;grid.appendChild(el)});