const JSON_HEADERS={"content-type":"application/json; charset=utf-8","cache-control":"no-store"};
function json(data,status=200,extra={}){return new Response(JSON.stringify(data),{status,headers:{...JSON_HEADERS,...extra}})}
function clean(v,max=500){return String(v??'').trim().slice(0,max)}
function corsHeaders(){return {'access-control-allow-origin':'*','access-control-allow-headers':'content-type','access-control-allow-methods':'GET,POST,OPTIONS'}}
function normalizeHotel(row){
  const get=(...keys)=>{for(const k of keys){if(row?.[k]!==undefined&&row?.[k]!==null&&row?.[k]!=='')return row[k]}return null};
  return {id:get('id','hotelId','hotel_id','ID'),name:get('name','hotel_name','Hotel','hotel','arabic_name','local_name'),destination:get('destination','city','area','location','Destination'),stars:get('stars','star_rating','rating','Stars'),image:get('image','image_url','photo','photo_url','thumbnail'),description:get('description','desc','notes'),source:get('source_url','official_url','source'),available:get('available','isAvailable'),room:get('room','roomName','room_name'),meal:get('meal','mealPlan','meal_plan'),cancellation:get('cancellation','cancellationPolicy','cancellation_policy')};
}
async function readHotels(env,url){
  const q=clean(url.searchParams.get('q'),120).toLowerCase(),destination=clean(url.searchParams.get('destination'),120).toLowerCase();
  const limit=Math.min(Math.max(Number(url.searchParams.get('limit')||100),1),500);
  if(!env.DB){try{const r=await env.ASSETS.fetch(new URL('/hotels-data.json',url));const d=await r.json();const rows=[];for(const [dest,list] of Object.entries(d||{})){for(const x of(list||[]))rows.push({id:null,name:x[0],destination:dest,stars:x[1],image:x[2],description:x[3],source:null})}let hotels=rows;if(destination)hotels=hotels.filter(x=>`${x.destination||''}`.toLowerCase().includes(destination));if(q)hotels=hotels.filter(x=>`${x.name||''} ${x.destination||''} ${x.description||''}`.toLowerCase().includes(q));return {source:'static',count:hotels.length,hotels:hotels.slice(0,limit)}}catch(e){return {source:'static',hotels:[],error:'Static hotel data is not readable'}}}
  try{const r=await env.DB.prepare('SELECT * FROM hotels LIMIT ?').bind(limit).all();let hotels=(r.results||[]).map(normalizeHotel).filter(x=>x.name);if(destination)hotels=hotels.filter(x=>`${x.destination||''}`.toLowerCase().includes(destination));if(q)hotels=hotels.filter(x=>`${x.name||''} ${x.destination||''} ${x.description||''}`.toLowerCase().includes(q));return {source:'d1',count:hotels.length,hotels}}catch(e){return {source:'fallback',count:0,hotels:[],error:'D1 hotels table is not readable yet'}}
}
async function createLead(env,data){
  if(!env.DB)return {mode:'setup',message:'D1 is not bound to this Worker yet.'};
  try{await env.DB.prepare(`CREATE TABLE IF NOT EXISTS leads (id INTEGER PRIMARY KEY AUTOINCREMENT, source TEXT, service_type TEXT, destination TEXT, travel_date TEXT, travellers INTEGER, phone TEXT, notes TEXT, stage TEXT DEFAULT 'new', created_at TEXT DEFAULT CURRENT_TIMESTAMP)`).run();const r=await env.DB.prepare(`INSERT INTO leads(source,service_type,destination,travel_date,travellers,phone,notes) VALUES(?,?,?,?,?,?,?)`).bind('website',clean(data.service_type||'trip_request',80),clean(data.destination,150),clean(data.travelDate,30),Number(data.travellers||0)||0,clean(data.phone,60),clean(data.notes,1500)).run();return {mode:'saved',reference:`JSM-${String(r.meta?.last_row_id||Date.now()).padStart(6,'0')}`}}catch(e){return {mode:'error',message:'Could not save the request to D1.'}}
}
function fxBase(env){return clean(env.FXPORT_API_BASE||'https://api.fx-port.com',200).replace(/\/$/,'')}
function fxHeaders(env){return {Authorization:`Bearer ${env.FXPORT_API_KEY}`, 'content-type':'application/json','accept':'application/json'}}
async function fxFetch(env,path,options={}){const r=await fetch(`${fxBase(env)}${path}`,{...options,headers:{...fxHeaders(env),...(options.headers||{})}});const text=await r.text();let body;try{body=JSON.parse(text)}catch{body={raw:text}}return {status:r.status,body}}
function hasFxKey(env){return !!clean(env.FXPORT_API_KEY,300)}
function mapFxHotels(body){
  const raw=Array.isArray(body?.hotels)?body.hotels:Array.isArray(body?.data)?body.data:Array.isArray(body?.results)?body.results:[];
  return raw.map(normalizeHotel).filter(x=>x.name||x.id);
}
async function fxHotelSearch(env,data){
  if(!hasFxKey(env))return {mode:'setup',message:'FX-Port Sandbox key is not configured in the Worker Secret FXPORT_API_KEY.'};
  const location=clean(data.location||data.city||data.cityCode||data.destination,160);const checkIn=clean(data.checkIn||data.check_in,30),checkOut=clean(data.checkOut||data.check_out,30);
  const adults=Math.max(Number(data.adults||2),1),children=Math.max(Number(data.children||0),0);
  if(!location||!checkIn||!checkOut)return {mode:'error',message:'Location, check-in and check-out are required.'};
  const payload={location,dates:{in:checkIn,out:checkOut},guests:{adults,children}};
  // FX-Port's public hotel marketing page documents /v1/hotels/search, while the API docs state /api/v1 prefixes. Try the documented API path first, then the published hotel path if the first is not found.
  const paths=['/api/v1/hotels/search','/v1/hotels/search'];
  let last={status:0,body:null};
  for(const path of paths){last=await fxFetch(env,path,{method:'POST',body:JSON.stringify(payload)});if(last.status!==404)break;}
  if(last.status<200||last.status>=300)return {mode:'error',status:last.status,message:'FX-Port hotel search returned an error.',details:last.body};
  return {mode:'live',provider:'FX-Port',count:mapFxHotels(last.body).length,results:mapFxHotels(last.body),rawMeta:{success:last.body?.success,requestId:last.body?.requestId}};
}
async function fxHotelRooms(env,data){
  if(!hasFxKey(env))return {mode:'setup',message:'FX-Port API key is not configured.'};
  const id=clean(data.hotelId||data.id,200);if(!id)return {mode:'error',message:'hotelId is required.'};
  const qs=new URLSearchParams();if(data.checkIn)qs.set('in',clean(data.checkIn,30));if(data.checkOut)qs.set('out',clean(data.checkOut,30));if(data.adults)qs.set('adults',String(Math.max(Number(data.adults),1)));if(data.children)qs.set('children',String(Math.max(Number(data.children),0)));
  const paths=[`/api/v1/hotels/${encodeURIComponent(id)}/rooms${qs.toString()?`?${qs}`:''}`,`/v1/hotels/${encodeURIComponent(id)}/rooms${qs.toString()?`?${qs}`:''}`];let last={status:0,body:null};for(const path of paths){last=await fxFetch(env,path);if(last.status!==404)break}if(last.status<200||last.status>=300)return {mode:'error',status:last.status,message:'FX-Port hotel rooms returned an error.',details:last.body};return {mode:'live',provider:'FX-Port',hotelId:id,data:last.body};
}
export default {async fetch(request,env){
  const url=new URL(request.url),path=url.pathname;if(request.method==='OPTIONS')return new Response(null,{status:204,headers:corsHeaders()});
  if(path==='/api/health')return json({ok:true,service:'JSM TRAVEL Worker',d1:!!env.DB,fxport:hasFxKey(env),travelport:!!(env.TRAVELPORT_CLIENT_ID&&env.TRAVELPORT_CLIENT_SECRET&&env.TRAVELPORT_USERNAME&&env.TRAVELPORT_PASSWORD&&env.TRAVELPORT_PCC),travelportEnvironment:'pre-production',fxportEnvironment:hasFxKey(env)?(String(env.FXPORT_API_KEY).startsWith('fxp_live_')?'live':'sandbox'):'not-configured',time:new Date().toISOString()},200,corsHeaders());
  if(path==='/api/hotels'&&request.method==='GET')return json(await readHotels(env,url),200,corsHeaders());
  if(path==='/api/destinations'&&request.method==='GET'){const r=await readHotels(env,new URL('https://x/api/hotels?limit=500'));return json({source:r.source,destinations:[...new Set(r.hotels.map(x=>x.destination).filter(Boolean))]},200,corsHeaders())}
  if(path==='/api/trip-request'&&request.method==='POST'){let data={};try{data=await request.json()}catch{return json({mode:'error',message:'Invalid JSON'},400,corsHeaders())}if(!data.destination||!data.phone)return json({mode:'error',message:'Destination and phone are required.'},400,corsHeaders());return json(await createLead(env,data),200,corsHeaders())}
  if(path==='/api/hotel-search'&&request.method==='POST'){let data={};try{data=await request.json()}catch{return json({mode:'error',message:'Invalid JSON'},400,corsHeaders())}return json(await fxHotelSearch(env,data),200,corsHeaders())}
  if(path==='/api/hotel-rooms'&&request.method==='POST'){let data={};try{data=await request.json()}catch{return json({mode:'error',message:'Invalid JSON'},400,corsHeaders())}return json(await fxHotelRooms(env,data),200,corsHeaders())}
  async function travelportToken(env){
  if(!env.TRAVELPORT_CLIENT_ID||!env.TRAVELPORT_CLIENT_SECRET||!env.TRAVELPORT_USERNAME||!env.TRAVELPORT_PASSWORD)return {ok:false,message:'Travelport credentials are not configured in Worker Secrets.'};
  const body=new URLSearchParams({grant_type:'password',username:String(env.TRAVELPORT_USERNAME),password:String(env.TRAVELPORT_PASSWORD),client_id:String(env.TRAVELPORT_CLIENT_ID),client_secret:String(env.TRAVELPORT_CLIENT_SECRET)});
  const r=await fetch('https://auth.pp.travelport.net/oauth/token',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body});
  const j=await r.json().catch(()=>({}));
  if(!r.ok||!j.access_token)return {ok:false,status:r.status,message:'Travelport OAuth failed.',details:j};
  return {ok:true,token:j.access_token,expiresIn:Number(j.expires_in||86400)};
}
async function tpSearch(env,data){
  const t=await travelportToken(env); if(!t.ok)return {mode:'setup',message:t.message,details:t.details};
  const origin=clean(data.origin,10).toUpperCase(), destination=clean(data.destination,10).toUpperCase(), dep=clean(data.departureDate,20), ret=clean(data.returnDate,20);
  if(!origin||!destination||!dep)return {mode:'error',message:'Origin, destination and departure date are required.'};
  const adults=Math.max(Number(data.adults||1),1), children=Math.max(Number(data.children||0),0), infants=Math.max(Number(data.infants||0),0);
  const pax=[{'@type':'PassengerCriteria',number:adults,passengerTypeCode:'ADT'}];
  if(children)pax.push({'@type':'PassengerCriteria',number:children,passengerTypeCode:'CNN'});
  if(infants)pax.push({'@type':'PassengerCriteria',number:infants,passengerTypeCode:'INF'});
  const seg=[{'@type':'SearchCriteriaFlight',departureDate:dep,From:{value:origin},To:{value:destination}}];
  if(ret&&data.tripType!=='oneWay')seg.push({'@type':'SearchCriteriaFlight',departureDate:ret,From:{value:destination},To:{value:origin}});
  const payload={'@type':'CatalogProductOfferingsQueryRequest',CatalogProductOfferingsRequest:{'@type':'CatalogProductOfferingsRequestAir',maxNumberOfUpsellsToReturn:4,contentSourceList:['GDS','NDC'],PassengerCriteria:pax,SearchCriteriaFlight:seg,SearchModifiersAir:{'@type':'SearchModifiersAir'}}};
  const r=await fetch('https://api.pp.travelport.net/11/air/catalog/search/catalogproductofferings',{method:'POST',headers:{Authorization:`Bearer ${t.token}`,'Content-Type':'application/json','Accept-Encoding':'gzip, deflate','TVP-PCC-Core':String(env.TRAVELPORT_PCC||''),'TraceId':`JSM-${crypto.randomUUID()}`},body:JSON.stringify(payload)});
  const j=await r.json().catch(()=>({})); if(!r.ok)return {mode:'error',status:r.status,message:'Travelport flight search returned an error.',details:j};
  return {mode:'live',provider:'Travelport',results:j,expiresIn:t.expiresIn||86400};
}
if(path==='/api/flight-search'&&request.method==='POST')return json(await tpSearch(env,await request.json().catch(()=>({}))),200,corsHeaders());
  if(path.startsWith('/api/'))return json({error:'Not found'},404,corsHeaders());
  return env.ASSETS.fetch(request);
}};
