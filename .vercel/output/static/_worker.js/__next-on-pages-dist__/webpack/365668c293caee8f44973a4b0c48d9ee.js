var B={},H=(N,C,L)=>(B.__chunk_535=(V,T,E)=>{"use strict";function m(e){let t=new Uint8Array(e.length);for(let i=0;i<e.length;i++)t[i]=e.charCodeAt(i);return t}E.d(T,{b9:()=>O,FA:()=>P,_H:()=>n});function d(e){return btoa(String.fromCharCode(...new TextEncoder().encode(e))).replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_")}function w(e){return m(atob(e.replace(/-+(BEGIN|END).*/g,"").replace(/\s/g,"")))}async function o(e,t,i){return await crypto.subtle.importKey("raw",m(e),t,!0,i)}async function k(e,t,i){return await crypto.subtle.importKey("jwk",e,t,!0,i)}async function _(e,t,i){return await crypto.subtle.importKey("spki",w(e),t,!0,i)}async function A(e,t,i){return await crypto.subtle.importKey("pkcs8",w(e),t,!0,i)}async function R(e,t,i){if(typeof e=="object")return k(e,t,i);if(typeof e!="string")throw Error("Unsupported key type!");return e.includes("PUBLIC")?_(e,t,i):e.includes("PRIVATE")?A(e,t,i):o(e,t,i)}function g(e){let t=Array.from(atob(e),i=>i.charCodeAt(0));return JSON.parse(new TextDecoder("utf-8").decode(new Uint8Array(t)))}if(typeof crypto>"u"||!crypto.subtle)throw Error("SubtleCrypto not supported!");var b={none:{name:"none"},ES256:{name:"ECDSA",namedCurve:"P-256",hash:{name:"SHA-256"}},ES384:{name:"ECDSA",namedCurve:"P-384",hash:{name:"SHA-384"}},ES512:{name:"ECDSA",namedCurve:"P-521",hash:{name:"SHA-512"}},HS256:{name:"HMAC",hash:{name:"SHA-256"}},HS384:{name:"HMAC",hash:{name:"SHA-384"}},HS512:{name:"HMAC",hash:{name:"SHA-512"}},RS256:{name:"RSASSA-PKCS1-v1_5",hash:{name:"SHA-256"}},RS384:{name:"RSASSA-PKCS1-v1_5",hash:{name:"SHA-384"}},RS512:{name:"RSASSA-PKCS1-v1_5",hash:{name:"SHA-512"}}};async function v(e,t,i="HS256"){if(typeof i=="string"&&(i={algorithm:i}),i={algorithm:"HS256",header:{typ:"JWT",...i.header??{}},...i},!e||typeof e!="object")throw Error("payload must be an object");if(i.algorithm!=="none"&&(!t||typeof t!="string"&&typeof t!="object"))throw Error("secret must be a string, a JWK object or a CryptoKey object");if(typeof i.algorithm!="string")throw Error("options.algorithm must be a string");let r=b[i.algorithm];if(!r)throw Error("algorithm not found");e.iat||(e.iat=Math.floor(Date.now()/1e3));let s=`${d(JSON.stringify({...i.header,alg:i.algorithm}))}.${d(JSON.stringify(e))}`;if(i.algorithm==="none")return s;let a=t instanceof CryptoKey?t:await R(t,r,["sign"]),l=await crypto.subtle.sign(r,a,m(s));return`${s}.${btoa(function(p){let h="";for(let u=0;u<p.byteLength;u++)h+=String.fromCharCode(p[u]);return h}(new Uint8Array(l))).replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_")}`}async function I(e,t,i="HS256"){var r,s,a;if(typeof i=="string"&&(i={algorithm:i}),i={algorithm:"HS256",clockTolerance:0,throwError:!1,...i},typeof e!="string")throw Error("token must be a string");if(i.algorithm!=="none"&&typeof t!="string"&&typeof t!="object")throw Error("secret must be a string, a JWK object or a CryptoKey object");if(typeof i.algorithm!="string")throw Error("options.algorithm must be a string");let l=e.split(".",3);if(l.length<2)throw Error("token must consist of 2 or more parts");let[p,h,u]=l,y=b[i.algorithm];if(!y)throw Error("algorithm not found");let c={header:g((r=e).split(".")[0].replace(/-/g,"+").replace(/_/g,"/")),payload:g(r.split(".")[1].replace(/-/g,"+").replace(/_/g,"/"))};try{if(c.header?.alg!==i.algorithm)throw Error("INVALID_SIGNATURE");if(c.payload){let f=Math.floor(Date.now()/1e3);if(c.payload.nbf&&c.payload.nbf>f&&c.payload.nbf-f>(i.clockTolerance??0))throw Error("NOT_YET_VALID");if(c.payload.exp&&c.payload.exp<=f&&f-c.payload.exp>(i.clockTolerance??0))throw Error("EXPIRED")}if(y.name==="none")return c;let S=t instanceof CryptoKey?t:await R(t,y,["verify"]);if(!await crypto.subtle.verify(y,S,(a=u,m(atob(a.replace(/-/g,"+").replace(/_/g,"/").replace(/\s/g,"")))),(s=`${p}.${h}`,m(s))))throw Error("INVALID_SIGNATURE");return c}catch(S){if(i.throwError)throw S;return}}async function P(e,t){return await v(e,t)}async function $(e,t){try{return await I(e,t)}catch{throw Error("Invalid token")}}async function D(e){let t=new TextEncoder().encode(e);return Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",t))).map(i=>i.toString(16).padStart(2,"0")).join("")}async function O(e,t){return await D(e)===t}async function n(e){let t=e.headers.get("authorization");if(!t||!t.startsWith("Bearer "))throw Error("No token provided");let i=t.replace("Bearer ",""),r=await $(i,process.env.JWT_SECRET||"fallback-secret"),s=r.payload||r;if(!s.adminId||!s.username||!s.role)throw Error("Invalid token payload");return s}},B.__chunk_126=(V,T,E)=>{"use strict";E.d(T,{E:()=>O});class m{constructor(e){this.vehicleRepository=e}async getAvailableVehicles(e){if(e&&!this.isValidVehicleType(e))throw Error(`Invalid vehicle type: ${e}`);let t=await this.vehicleRepository.getAvailableVehicles(e);return this.sortVehiclesByPriority(t)}async getVehicleById(e){if(!e||e.trim()==="")throw Error("Vehicle ID is required");return this.vehicleRepository.getVehicleById(e)}async getVehicleCount(){return this.vehicleRepository.getVehicleCount()}async getVehiclesForAdmin(e){return this.vehicleRepository.getVehiclesByAdmin(e)}async createVehicle(e){this.validateVehicleData(e);let t=await this.vehicleRepository.createVehicle(e),i=await this.vehicleRepository.getVehicleById(t);if(!i)throw Error("Failed to create vehicle");return i}async updateVehicleAvailability(e,t){if(!e||e.trim()==="")throw Error("Vehicle ID is required");await this.vehicleRepository.updateVehicleAvailability(e,t);let i=await this.vehicleRepository.getVehicleById(e);return!!i&&i.isAvailable===t}isValidVehicleType(e){return["sedan","noah","hiace"].includes(e.toLowerCase())}validateVehicleData(e){if(!e.name||e.name.trim()==="")throw Error("Vehicle name is required");if(!e.type||!this.isValidVehicleType(e.type))throw Error("Valid vehicle type is required (sedan, noah, hiace)");if(!e.capacity||e.capacity<1)throw Error("Vehicle capacity must be at least 1");if(!e.pricePerDay||e.pricePerDay<0)throw Error("Price per day must be a positive number")}sortVehiclesByPriority(e){return e.sort((t,i)=>{let r=t.photos.some(a=>a.isPrimary),s=i.photos.some(a=>a.isPrimary);return r&&!s?-1:!r&&s?1:new Date(i.createdAt).getTime()-new Date(t.createdAt).getTime()})}async getAllVehicles(){return this.vehicleRepository.getAllVehicles()}async addVehiclePhoto(e,t){return this.vehicleRepository.addVehiclePhoto(e,t)}async setPrimaryPhoto(e,t){return this.vehicleRepository.setPrimaryPhoto(e,t)}async deleteVehiclePhoto(e){return this.vehicleRepository.deleteVehiclePhoto(e)}async updateVehicle(e,t){this.validateVehicleData(t),await this.vehicleRepository.updateVehicle(e,t);let i=await this.vehicleRepository.getVehicleById(e);if(!i)throw Error("Failed to fetch updated vehicle");return i}async deleteVehicle(e){if(!await this.vehicleRepository.getVehicleById(e))throw Error("Vehicle not found");return await this.vehicleRepository.deleteVehicle(e),!await this.vehicleRepository.getVehicleById(e)}}function d(n){let e=n.replace(/\D/g,"");return e.length===10&&!e.startsWith("880")||e.length===11&&e.startsWith("01")?`+880${e}`:n.startsWith("+")?n:`+${e}`}function w(n){let e=n.replace(/\D/g,"");if(e.startsWith("880")){let t=e.substring(3);return t.length===10&&t.startsWith("1")}return e.length>=7&&e.length<=15}function o(n){var e;return{name:(e=n.name||"")?e.trim().split(/\s+/).map(t=>{if(t.length<=2)return t;{if(t.length===3)return`${t[0]}*${t[2]}`;if(t.length===4)return`${t[0]}${t[1]}**${t[3]}`;let i=t.substring(0,2),r=t.substring(t.length-1),s=t.length-3;return`${i}${"*".repeat(s)}${r}`}}).join(" "):"",phone:function(t){if(!t)return"";let i=t.replace(/[^\d+]/g,"");if(i.startsWith("+880")&&i.length>=13){let r=i.substring(4,8),s=i.substring(i.length-2),a=i.length-6;return`+880${r}${"*".repeat(a)}${s}`}if(i.length>=8){let r=i.substring(0,4),s=i.substring(i.length-2),a=i.length-6;return`${r}${"*".repeat(a)}${s}`}if(i.length>=4){let r=i.substring(0,1),s=i.substring(i.length-1),a=i.length-2;return`${r}${"*".repeat(a)}${s}`}return t}(n.phone||""),email:function(t){if(!t)return"";let[i,r]=t.split("@");if(!i||!r)return t;if(i.length<=2)return`${i}@${r}`;let s=i.substring(0,2),a="*".repeat(i.length-2);return`${s}${a}@${r}`}(n.email||"")}}class k{constructor(e,t,i){this.bookingRepository=e,this.passengerRepository=t,this.vehicleRepository=i}async createBooking(e){this.validateBookingData(e);let t=null;if(e.vehicleId&&e.vehicleId!=="pending-assignment"){if(!(t=await this.vehicleRepository.getVehicleById(e.vehicleId)))throw Error("Vehicle not found");if(!t.isAvailable)throw Error("Vehicle is not available for booking")}let i=d(e.passengerPhone),r=await this.passengerRepository.findByPhone(i);return r?await this.passengerRepository.updatePassenger(r.id,{name:e.passengerName,email:e.passengerEmail||r.email}):r=await this.passengerRepository.create({phone:i,name:e.passengerName,email:e.passengerEmail,isVerified:!1}),await this.bookingRepository.create({passengerId:r.id,vehicleId:e.vehicleId||"pending-assignment",bookingDate:e.bookingDate,pickupTime:e.pickupTime,tripType:e.tripType,pickupLocation:e.pickupLocation,dropoffLocation:e.dropoffLocation,status:"pending"})}async getBookingById(e){return this.bookingRepository.findById(e)}async getBookings(e={}){return this.bookingRepository.findAll(e)}async getBookingsByPassengerPhone(e){let t=d(e),i=await this.passengerRepository.findByPhone(t);return i?this.bookingRepository.findByPassengerId(i.id):[]}async updateBookingStatus(e,t){if(!await this.bookingRepository.findById(e))throw Error("Booking not found");return this.bookingRepository.updateStatus(e,t)}async updateBooking(e,t){let i=await this.bookingRepository.findById(e);if(!i)throw Error("Booking not found");if(await this.bookingRepository.updateBooking(e,t),t.status==="confirmed"&&i.passenger)try{await this.passengerRepository.updateVerificationStatusById(i.passenger.id,!0),console.log(`\u2705 [BOOKING SERVICE] Auto-verified passenger ${i.passenger.id} phone number for confirmed booking ${e}`)}catch(r){console.error(`\u274C [BOOKING SERVICE] Failed to auto-verify passenger phone number for booking ${e}:`,r)}if(t.status==="fake"&&i.passenger)try{await this.passengerRepository.updateVerificationStatusById(i.passenger.id,!1),console.log(`\u{1F6AB} [BOOKING SERVICE] Auto-unverified passenger ${i.passenger.id} phone number for fake booking ${e}`)}catch(r){console.error(`\u274C [BOOKING SERVICE] Failed to auto-unverify passenger phone number for booking ${e}:`,r)}return this.bookingRepository.findById(e)}async cancelBooking(e,t){let i=await this.bookingRepository.findById(e);if(!i)throw Error("Booking not found");if(i.status==="cancelled")throw Error("Booking is already cancelled");if(i.status==="completed")throw Error("Cannot cancel completed booking");return this.bookingRepository.updateBooking(e,{status:"cancelled",notes:t?`Cancelled: ${t}`:"Cancelled by user"})}async getBookingStats(){let{bookings:e}=await this.bookingRepository.findAll({limit:1e3}),t={total:e.length,pending:0,confirmed:0,completed:0,cancelled:0};return e.forEach(i=>{switch(i.status){case"pending":t.pending++;break;case"confirmed":t.confirmed++;break;case"completed":t.completed++;break;case"cancelled":t.cancelled++}}),t}validateBookingData(e){if(!e.bookingDate)throw Error("Booking date is required");if(!e.pickupTime)throw Error("Pickup time is required");if(!e.tripType)throw Error("Trip type is required");if(!e.pickupLocation)throw Error("Pickup location is required");if(e.tripType==="round"&&!e.dropoffLocation)throw Error("Drop-off location is required for round trip");if(!e.passengerName)throw Error("Passenger name is required");if(!e.passengerPhone)throw Error("Passenger phone is required");if(!w(e.passengerPhone))throw Error("Invalid phone number format");if(e.passengerEmail&&!/\S+@\S+\.\S+/.test(e.passengerEmail))throw Error("Invalid email format");if(!e.vehicleId)throw Error("Vehicle selection is required");let t=new Date(e.bookingDate),i=new Date;if(i.setHours(0,0,0,0),t<i)throw Error("Booking date cannot be in the past")}async checkAvailability(e,t){let i=await this.vehicleRepository.getVehicleById(e);return!!i&&!!i.isAvailable}async getBookingsByVehicleId(e){return this.bookingRepository.findByVehicleId(e)}async getBookingByIdMasked(e){let t=await this.bookingRepository.findById(e);return t?(t.passenger&&(t.passenger={...t.passenger,name:o(t.passenger).name,phone:o(t.passenger).phone,email:o(t.passenger).email}),t):null}async getBookingsByPassengerIdMasked(e){return(await this.bookingRepository.findByPassengerId(e)).map(t=>(t.passenger&&(t.passenger={...t.passenger,name:o(t.passenger).name,phone:o(t.passenger).phone,email:o(t.passenger).email}),t))}async getAllBookingsMasked(e={}){let{bookings:t,total:i}=await this.bookingRepository.findAll(e);return{bookings:t.map(r=>(r.passenger&&(r.passenger={...r.passenger,name:o(r.passenger).name,phone:o(r.passenger).phone,email:o(r.passenger).email}),r)),total:i}}}class _{constructor(e,t){this.passengerRepository=e,this.bookingRepository=t}async createPassenger(e){if(!w(e.phone))throw Error("Invalid phone number format");let t=d(e.phone);if(await this.passengerRepository.findByPhone(t))throw Error("Passenger with this phone number already exists");if(e.email&&!/\S+@\S+\.\S+/.test(e.email))throw Error("Invalid email format");return this.passengerRepository.create({phone:t,name:e.name,email:e.email,isVerified:!1})}async getPassengerById(e){return this.passengerRepository.findById(e)}async getPassengerByPhone(e){let t=d(e);return this.passengerRepository.findByPhone(t)}async getPassengers(e={}){return this.passengerRepository.findAll(e)}async getPassengersWithBookings(e={}){let{passengers:t,total:i}=await this.passengerRepository.findAll(e);return{passengers:await Promise.all(t.map(async r=>{let s=await this.bookingRepository.findByPassengerId(r.id);return{...r,bookings:s.map(a=>({id:a.id,bookingDate:a.bookingDate,status:a.status,notes:a.notes,vehicle:{name:a.vehicle.name,type:a.vehicle.type}}))}})),total:i}}async updatePassenger(e,t){if(!await this.passengerRepository.findById(e))throw Error("Passenger not found");if(t.email&&!/\S+@\S+\.\S+/.test(t.email))throw Error("Invalid email format");if(!await this.passengerRepository.updatePassenger(e,t))throw Error("Failed to update passenger");return this.passengerRepository.findById(e)}async verifyPassenger(e){let t=d(e);if(!await this.passengerRepository.findByPhone(t))throw Error("Passenger not found");return this.passengerRepository.updateVerificationStatus(t,!0)}async unverifyPassenger(e){let t=d(e);if(!await this.passengerRepository.findByPhone(t))throw Error("Passenger not found");return this.passengerRepository.updateVerificationStatus(t,!1)}async deletePassenger(e){if(!await this.passengerRepository.findById(e))throw Error("Passenger not found");return this.passengerRepository.deletePassenger(e)}async passengerExists(e){let t=d(e);return this.passengerRepository.existsByPhone(t)}async getPassengerStats(){return this.passengerRepository.getStats()}async findOrCreatePassenger(e){let t=d(e.phone),i=await this.passengerRepository.findByPhone(t);return i?((e.name||e.email)&&(await this.passengerRepository.updatePassenger(i.id,{name:e.name||i.name,email:e.email||i.email}),i=await this.passengerRepository.findById(i.id)),i):this.createPassenger(e)}async searchPassengers(e,t={}){let{passengers:i,total:r}=await this.getPassengers({page:1,limit:1e3}),s=i.filter(h=>h.name?.toLowerCase().includes(e.toLowerCase())||h.phone.includes(e)||h.email?.toLowerCase().includes(e.toLowerCase())),{page:a=1,limit:l=10}=t,p=(a-1)*l;return{passengers:s.slice(p,p+l),total:s.length}}async getPassengerByIdMasked(e){let t=await this.passengerRepository.findById(e);return t?{...t,name:o(t).name,phone:o(t).phone,email:o(t).email}:null}async getPassengerByPhoneMasked(e){let t=d(e),i=await this.passengerRepository.findByPhone(t);return i?{...i,name:o(i).name,phone:o(i).phone,email:o(i).email}:null}async getPassengersMasked(e={}){let{passengers:t,total:i}=await this.passengerRepository.findAll(e);return{passengers:t.map(r=>({...r,name:o(r).name,phone:o(r).phone,email:o(r).email})),total:i}}}var A=E(535);class R{constructor(e){this.adminRepository=e}async authenticate(e,t){let i=await this.adminRepository.findByUsername(e);if(!i)return null;let r=await this.getAdminWithPassword(e);if(!r||!await(0,A.b9)(t,r.password))return null;await this.adminRepository.updateLastLogin(i.id);let s=await(0,A.FA)({adminId:i.id,username:i.username,role:i.role},process.env.JWT_SECRET||"fallback-secret");return{admin:i,token:s}}async getAdminWithPassword(e){return this.adminRepository.findByUsernameWithPassword(e)}async getAdminById(e){return this.adminRepository.findById(e)}}var g=E(3993);class b{async getDashboardStats(){let[e,t,i,r]=await Promise.all([this.database.query("SELECT COUNT(*) as count FROM bookings",[]),this.database.query("SELECT COUNT(*) as count FROM bookings WHERE status = $1",["pending"]),this.database.query("SELECT COUNT(*) as count FROM vehicles",[]),this.database.query("SELECT COUNT(*) as count FROM passengers",[])]);if(!e.success||!t.success||!i.success||!r.success)throw Error("Failed to fetch dashboard statistics");return{totalBookings:e.data?.[0]?.count||0,pendingBookings:t.data?.[0]?.count||0,totalVehicles:i.data?.[0]?.count||0,totalPassengers:r.data?.[0]?.count||0}}constructor(){this.database=g._.getDefaultProvider()}}class v{constructor(e){this.db=e}async executeQuery(e,t=[]){return this.db.query(e,t)}async select(e,t=[]){let i=await this.executeQuery(e,t);if(!i.success)throw Error(i.error||"Query failed");return i.data||[]}async insert(e,t=[]){let i=await this.executeQuery(e,t);if(!i.success)throw Error(i.error||"Insert failed");return i.meta?.last_row_id||0}async update(e,t=[]){let i=await this.executeQuery(e,t);if(!i.success)throw Error(i.error||"Update failed");return i.meta?.changes||0}async delete(e,t=[]){let i=await this.executeQuery(e,t);if(!i.success)throw Error(i.error||"Delete failed");return i.meta?.changes||0}}class I extends v{async getAvailableVehicles(e){let t=`
      SELECT v.*, 
             GROUP_CONCAT(
               CASE WHEN vp.id IS NOT NULL 
               THEN json_object('id', vp.id, 'url', vp.url, 'alt', vp.alt, 'isPrimary', vp.isPrimary, 'order', vp."order")
               END
             ) as photos_json
      FROM vehicles v
      LEFT JOIN vehicle_photos vp ON v.id = vp.vehicleId
      WHERE v.isAvailable = 1
    `,i=[];e&&(t+=" AND v.type = $1",i.push(e)),t+=`
      GROUP BY v.id
      ORDER BY v.createdAt DESC
    `;let r=await this.select(t,i);return this.mapRowsToVehicles(r)}async getVehicleById(e){let t=`
      SELECT v.*, 
             GROUP_CONCAT(
               CASE WHEN vp.id IS NOT NULL 
               THEN json_object('id', vp.id, 'url', vp.url, 'alt', vp.alt, 'isPrimary', vp.isPrimary, 'order', vp."order")
               END
             ) as photos_json
      FROM vehicles v
      LEFT JOIN vehicle_photos vp ON v.id = vp.vehicleId
      WHERE v.id = $1
      GROUP BY v.id
    `,i=await this.select(t,[e]);return i.length>0?this.mapRowToVehicle(i[0]):null}async getVehicleCount(){return(await this.select("SELECT COUNT(*) as count FROM vehicles"))[0]?.count||0}async getVehiclesByAdmin(e){let t=`
      SELECT v.*, 
             GROUP_CONCAT(
               CASE WHEN vp.id IS NOT NULL 
               THEN json_object('id', vp.id, 'url', vp.url, 'alt', vp.alt, 'isPrimary', vp.isPrimary, 'order', vp."order")
               END
             ) as photos_json
      FROM vehicles v
      LEFT JOIN vehicle_photos vp ON v.id = vp.vehicleId
      WHERE v.adminId = $1
      GROUP BY v.id
      ORDER BY v.createdAt DESC
    `,i=await this.select(t,[e]);return this.mapRowsToVehicles(i)}async createVehicle(e){let t=`vehicle-${Date.now()}-${Math.random().toString(36).substr(2,9)}`,i=`
      INSERT INTO vehicles (id, name, type, capacity, pricePerDay, description, features, adminId, createdAt, updatedAt)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, datetime('now'), datetime('now'))
    `,r=e.features?JSON.stringify(e.features):null;return await this.insert(i,[t,e.name,e.type,e.capacity,e.pricePerDay,e.description||null,r,e.adminId||null]),t}async updateVehicleAvailability(e,t){return await this.update('UPDATE vehicles SET isAvailable = $1, updatedAt = datetime("now") WHERE id = $2',[+!!t,e])>0}mapRowsToVehicles(e){return e.map(t=>this.mapRowToVehicle(t))}mapRowToVehicle(e){let t={id:e.id,name:e.name,type:e.type,capacity:e.capacity,pricePerDay:e.pricePerDay,description:e.description,features:e.features?JSON.parse(e.features):[],isAvailable:!!e.isAvailable,adminId:e.adminId,createdAt:new Date(e.createdAt),updatedAt:new Date(e.updatedAt),photos:[]};return e.photos_json&&(t.photos=this.parsePhotos(e.photos_json)),t}parsePhotos(e){try{let t=[];if(e.includes("},{"))t=e.split("},{").map((i,r,s)=>r===0?i+"}":r===s.length-1?"{"+i:"{"+i+"}").map(i=>{try{return JSON.parse(i)}catch{return null}}).filter(Boolean);else try{t=[JSON.parse(e)]}catch{}return t.map(i=>({id:i.id,vehicleId:i.vehicleId,url:i.url,alt:i.alt||"",isPrimary:!!i.isPrimary,order:i.order||0,createdAt:new Date(i.createdAt||Date.now())})).sort((i,r)=>(i.order||0)-(r.order||0)).map(i=>({id:i.id,vehicleId:i.vehicleId||"",url:i.url,alt:i.alt,isPrimary:!!i.isPrimary,order:i.order||0,createdAt:new Date}))}catch(t){return console.error("Error parsing photos:",t),[]}}async getAllVehicles(){let e=`
      SELECT v.*,
             GROUP_CONCAT(
               CASE WHEN vp.id IS NOT NULL 
               THEN json_object('id', vp.id, 'url', vp.url, 'alt', vp.alt, 'isPrimary', vp.isPrimary, 'order', vp."order", 'createdAt', vp.createdAt)
               END
             ) as photos_json
      FROM vehicles v
      LEFT JOIN vehicle_photos vp ON v.id = vp.vehicleId
      WHERE v.id != 'pending-assignment'
      GROUP BY v.id
      ORDER BY v.createdAt DESC
    `,t=await this.select(e,[]);return this.mapRowsToVehicles(t)}async addVehiclePhoto(e,t){let i=`
      INSERT INTO vehicle_photos (id, vehicleId, url, alt, isPrimary, "order", createdAt)
      VALUES ($1, $2, $3, $4, $5, $6, datetime("now"))
    `,r=`photo_${Date.now()}_${Math.random().toString(36).substr(2,9)}`;return await this.insert(i,[r,e,t.url,t.alt,+!!t.isPrimary,t.order]),{id:r,vehicleId:e,url:t.url,alt:t.alt,isPrimary:t.isPrimary,order:t.order,createdAt:new Date}}async setPrimaryPhoto(e,t){return await this.update("UPDATE vehicle_photos SET isPrimary = 0 WHERE vehicleId = $1",[e]),await this.update("UPDATE vehicle_photos SET isPrimary = 1 WHERE id = $1 AND vehicleId = $2",[t,e])>0}async deleteVehiclePhoto(e){return await this.delete("DELETE FROM vehicle_photos WHERE id = $1",[e])>0}async updateVehicle(e,t){let i=`
      UPDATE vehicles 
      SET name = $1, type = $2, capacity = $3, pricePerDay = $4, 
          description = $5, features = $6, isAvailable = $7, 
          updatedAt = datetime("now")
      WHERE id = $8
    `,r=JSON.stringify(t.features);return await this.update(i,[t.name,t.type,t.capacity,t.pricePerDay,t.description,r,+!!t.isAvailable,e])>0}async deleteVehicle(e){return await this.delete("DELETE FROM vehicle_photos WHERE vehicleId = $1",[e]),await this.delete("DELETE FROM vehicles WHERE id = $1",[e])>0}}class P extends v{async create(e){let t=`
      INSERT INTO bookings (
        id, passengerId, vehicleId, bookingDate, pickupTime, tripType, 
        pickupLocation, dropoffLocation, status, notes, createdAt, updatedAt
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    `,i=crypto.randomUUID(),r=new Date;return await this.insert(t,[i,e.passengerId,e.vehicleId,e.bookingDate.toISOString(),e.pickupTime,e.tripType,e.pickupLocation,e.dropoffLocation||null,e.status,e.notes||null,r.toISOString(),r.toISOString()]),this.findById(i)}async findById(e){let t=`
      SELECT 
        b.*,
        p.id as passenger_id, p.phone as passenger_phone, p.name as passenger_name, 
        p.email as passenger_email, p.isVerified as passenger_isVerified,
        p.createdAt as passenger_createdAt, p.updatedAt as passenger_updatedAt,
        v.id as vehicle_id, v.name as vehicle_name, v.type as vehicle_type,
        v.capacity as vehicle_capacity, v.pricePerDay as vehicle_pricePerDay,
        v.description as vehicle_description, v.features as vehicle_features,
        v.isAvailable as vehicle_isAvailable, v.adminId as vehicle_adminId,
        v.createdAt as vehicle_createdAt, v.updatedAt as vehicle_updatedAt
      FROM bookings b
      LEFT JOIN passengers p ON b.passengerId = p.id
      LEFT JOIN vehicles v ON b.vehicleId = v.id
      WHERE b.id = $1
    `,i=await this.select(t,[e]);return i.length===0?null:this.mapBookingResult(i[0])}async findAll(e={}){let{status:t,passengerId:i,page:r=1,limit:s=10}=e,a="",l=[],p=0;t&&(a="WHERE b.status = $1",l.push(t),p++),i&&(a?a+=" AND b.passengerId = $"+(p+1):a="WHERE b.passengerId = $1",l.push(i),p++);let h=`
      SELECT 
        b.*,
        p.id as passenger_id, p.phone as passenger_phone, p.name as passenger_name, 
        p.email as passenger_email, p.isVerified as passenger_isVerified,
        p.createdAt as passenger_createdAt, p.updatedAt as passenger_updatedAt,
        v.id as vehicle_id, v.name as vehicle_name, v.type as vehicle_type,
        v.capacity as vehicle_capacity, v.pricePerDay as vehicle_pricePerDay,
        v.description as vehicle_description, v.features as vehicle_features,
        v.isAvailable as vehicle_isAvailable, v.adminId as vehicle_adminId,
        v.createdAt as vehicle_createdAt, v.updatedAt as vehicle_updatedAt
      FROM bookings b
      LEFT JOIN passengers p ON b.passengerId = p.id
      LEFT JOIN vehicles v ON b.vehicleId = v.id
      ${a}
      ORDER BY b.createdAt DESC
      LIMIT ? OFFSET ?
    `,u=`
      SELECT COUNT(*) as total
      FROM bookings b
      ${a}
    `,[y,c]=await Promise.all([this.select(h,[...l,s,(r-1)*s]),this.select(u,l)]),S=c[0]?.total||0;return{bookings:y.map(f=>this.mapBookingResult(f)),total:S}}async findByPassengerId(e){let t=`
      SELECT 
        b.*,
        p.id as passenger_id, p.phone as passenger_phone, p.name as passenger_name, 
        p.email as passenger_email, p.isVerified as passenger_isVerified,
        p.createdAt as passenger_createdAt, p.updatedAt as passenger_updatedAt,
        v.id as vehicle_id, v.name as vehicle_name, v.type as vehicle_type,
        v.capacity as vehicle_capacity, v.pricePerDay as vehicle_pricePerDay,
        v.description as vehicle_description, v.features as vehicle_features,
        v.isAvailable as vehicle_isAvailable, v.adminId as vehicle_adminId,
        v.createdAt as vehicle_createdAt, v.updatedAt as vehicle_updatedAt
      FROM bookings b
      LEFT JOIN passengers p ON b.passengerId = p.id
      LEFT JOIN vehicles v ON b.vehicleId = v.id
      WHERE b.passengerId = $1
      ORDER BY b.createdAt DESC
    `;return(await this.select(t,[e])).map(i=>this.mapBookingResult(i))}async updateStatus(e,t){let i=`
      UPDATE bookings 
      SET status = $1, updatedAt = $2
      WHERE id = $3
    `;return await this.update(i,[t,new Date().toISOString(),e])>0}async updateBooking(e,t){let i=[],r=[],s=1;if(t.bookingDate&&(i.push(`bookingDate = $${s}`),r.push(t.bookingDate.toISOString()),s++),t.pickupTime&&(i.push(`pickupTime = $${s}`),r.push(t.pickupTime),s++),t.tripType&&(i.push(`tripType = $${s}`),r.push(t.tripType),s++),t.pickupLocation&&(i.push(`pickupLocation = $${s}`),r.push(t.pickupLocation),s++),t.dropoffLocation!==void 0&&(i.push(`dropoffLocation = $${s}`),r.push(t.dropoffLocation),s++),t.status&&(i.push(`status = $${s}`),r.push(t.status),s++),t.notes!==void 0&&(i.push(`notes = $${s}`),r.push(t.notes),s++),i.length===0)return!1;i.push(`updatedAt = $${s}`),r.push(new Date().toISOString()),s++,r.push(e);let a=`UPDATE bookings SET ${i.join(", ")} WHERE id = $${s}`;return await this.update(a,r)>0}async deleteBooking(e){return await this.delete("DELETE FROM bookings WHERE id = $1",[e])>0}mapBookingResult(e){return{id:e.id,passengerId:e.passengerId,vehicleId:e.vehicleId,bookingDate:new Date(e.bookingDate),pickupTime:e.pickupTime,tripType:e.tripType,pickupLocation:e.pickupLocation,dropoffLocation:e.dropoffLocation,status:e.status,notes:e.notes,createdAt:new Date(e.createdAt),updatedAt:new Date(e.updatedAt),passenger:{id:e.passenger_id,phone:e.passenger_phone,name:e.passenger_name,email:e.passenger_email,isVerified:!!e.passenger_isVerified,createdAt:new Date(e.passenger_createdAt),updatedAt:new Date(e.passenger_updatedAt)},vehicle:{id:e.vehicle_id,name:e.vehicle_name,type:e.vehicle_type,capacity:e.vehicle_capacity,pricePerDay:e.vehicle_pricePerDay,description:e.vehicle_description,features:e.vehicle_features?JSON.parse(e.vehicle_features):[],isAvailable:!!e.vehicle_isAvailable,adminId:e.vehicle_adminId,createdAt:new Date(e.vehicle_createdAt),updatedAt:new Date(e.vehicle_updatedAt),photos:[]}}}async findByVehicleId(e){let t=`
      SELECT b.*, 
             p.name as passengerName, p.phone as passengerPhone, p.email as passengerEmail, p.isVerified as passengerIsVerified,
             v.name as vehicleName, v.type as vehicleType, v.capacity as vehicleCapacity, v.pricePerDay as vehiclePricePerDay,
             v.description as vehicleDescription, v.features as vehicleFeatures, v.isAvailable as vehicleIsAvailable,
             v.adminId as vehicleAdminId, v.createdAt as vehicleCreatedAt, v.updatedAt as vehicleUpdatedAt,
             GROUP_CONCAT(
               json_object(
                 'id', vp.id,
                 'vehicleId', vp.vehicleId,
                 'url', vp.url,
                 'alt', vp.alt,
                 'isPrimary', vp.isPrimary,
                 'order', vp."order"
               )
             ) as vehiclePhotos_json
      FROM bookings b
      LEFT JOIN passengers p ON b.passengerId = p.id
      LEFT JOIN vehicles v ON b.vehicleId = v.id
      LEFT JOIN vehicle_photos vp ON v.id = vp.vehicleId
      WHERE b.vehicleId = $1
      GROUP BY b.id
      ORDER BY b.createdAt DESC
    `,i=await this.select(t,[e]);return this.mapRowsToBookings(i)}mapRowsToBookings(e){return e.map(t=>this.mapBookingResult(t))}}class $ extends v{async create(e){let t=`
      INSERT INTO passengers (id, phone, name, email, isVerified, createdAt, updatedAt)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `,i=crypto.randomUUID(),r=new Date;return await this.insert(t,[i,e.phone,e.name||null,e.email||null,+(e.isVerified===!0),r.toISOString(),r.toISOString()]),this.findById(i)}async findById(e){let t=await this.select("SELECT * FROM passengers WHERE id = $1",[e]);return t.length===0?null:this.mapPassengerResult(t[0])}async findByPhone(e){let t=await this.select("SELECT * FROM passengers WHERE phone = $1",[e]);return t.length===0?null:this.mapPassengerResult(t[0])}async findAll(e={}){let{page:t=1,limit:i=10,isVerified:r}=e,s="",a=[];r!==void 0&&(s="WHERE isVerified = $1",a.push(r));let l=`
      SELECT * FROM passengers
      ${s}
      ORDER BY createdAt DESC
      LIMIT $${a.length+1} OFFSET $${a.length+2}
    `,p=`
      SELECT COUNT(*) as total
      FROM passengers
      ${s}
    `,[h,u]=await Promise.all([this.select(l,[...a,i,(t-1)*i]),this.select(p,a)]),y=u[0]?.total||0;return{passengers:h.map(c=>this.mapPassengerResult(c)),total:y}}async updatePassenger(e,t){let i=[],r=[],s=1;if(t.name!==void 0&&(i.push(`name = $${s}`),r.push(t.name),s++),t.email!==void 0&&(i.push(`email = $${s}`),r.push(t.email),s++),t.isVerified!==void 0&&(i.push(`isVerified = $${s}`),r.push(+(t.isVerified===!0)),s++),i.length===0)return!1;i.push(`updatedAt = $${s}`),r.push(new Date().toISOString()),s++,r.push(e);let a=`UPDATE passengers SET ${i.join(", ")} WHERE id = $${s}`;return await this.update(a,r)>0}async updateVerificationStatus(e,t){let i=`
      UPDATE passengers 
      SET isVerified = $1, updatedAt = $2
      WHERE phone = $3
    `;return await this.update(i,[+!!t,new Date().toISOString(),e])>0}async updateVerificationStatusById(e,t){let i=`
      UPDATE passengers 
      SET isVerified = $1, updatedAt = $2
      WHERE id = $3
    `;return await this.update(i,[+!!t,new Date().toISOString(),e])>0}async deletePassenger(e){return await this.delete("DELETE FROM passengers WHERE id = $1",[e])>0}async existsByPhone(e){return(await this.select("SELECT 1 FROM passengers WHERE phone = $1 LIMIT 1",[e])).length>0}async getStats(){let e=`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN isVerified = 1 THEN 1 ELSE 0 END) as verified,
        SUM(CASE WHEN isVerified = 0 THEN 1 ELSE 0 END) as unverified
      FROM passengers
    `,t=(await this.select(e))[0];return{total:t.total||0,verified:t.verified||0,unverified:t.unverified||0}}mapPassengerResult(e){return{id:e.id,phone:e.phone,name:e.name,email:e.email,isVerified:e.isVerified===1||e.isVerified===!0||e.isVerified==="true"||e.isVerified==="1",createdAt:new Date(e.createdAt),updatedAt:new Date(e.updatedAt)}}}class D extends v{async findByUsername(e){let t=`
      SELECT id, username, email, password, phone, role, createdAt, updatedAt
      FROM admins 
      WHERE username = $1
    `,i=await this.select(t,[e]);return i.length===0?null:this.mapAdminResult(i[0])}async findById(e){let t=`
      SELECT id, username, email, password, phone, role, createdAt, updatedAt
      FROM admins 
      WHERE id = $1
    `,i=await this.select(t,[e]);return i.length===0?null:this.mapAdminResult(i[0])}async findByUsernameWithPassword(e){let t=`
      SELECT id, username, password, role
      FROM admins 
      WHERE username = $1
    `,i=await this.select(t,[e]);return i.length===0?null:i[0]}async updateLastLogin(e){let t=`
      UPDATE admins 
      SET updatedAt = $1
      WHERE id = $2
    `;return await this.update(t,[new Date().toISOString(),e])>0}mapAdminResult(e){return{id:e.id,username:e.username,email:e.email,phone:e.phone,role:e.role,createdAt:new Date(e.createdAt),updatedAt:new Date(e.updatedAt)}}}class O{static{this.vehicleService=null}static{this.bookingService=null}static{this.passengerService=null}static{this.adminService=null}static{this.adminStatsService=null}static getVehicleService(){if(!this.vehicleService){let e=new I(g._.getDefaultProvider());this.vehicleService=new m(e)}return this.vehicleService}static getBookingService(){if(!this.bookingService){let e=g._.getDefaultProvider(),t=new P(e),i=new $(e),r=new I(e);this.bookingService=new k(t,i,r)}return this.bookingService}static getPassengerService(){if(!this.passengerService){let e=g._.getDefaultProvider(),t=new $(e),i=new P(e);this.passengerService=new _(t,i)}return this.passengerService}static getAdminService(){if(!this.adminService){let e=new D(g._.getDefaultProvider());this.adminService=new R(e)}return this.adminService}static getAdminStatsService(){return this.adminStatsService||(this.adminStatsService=new b),this.adminStatsService}static reset(){this.vehicleService=null,this.bookingService=null,this.passengerService=null,this.adminService=null,this.adminStatsService=null}}},B);export{H as __getNamedExports};
