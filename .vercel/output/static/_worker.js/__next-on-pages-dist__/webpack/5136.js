var v={},P=(k,c,T)=>(v.__chunk_5136=(D,m,b)=>{"use strict";function p(){let l=c.DB;return l?(console.log("Using Cloudflare D1 database"),l):(console.log("Using local development database"),c.__localDb?console.log("Using existing local database instance"):(c.__localDb=new h,console.log("Created new local database instance")),c.__localDb)}b.d(m,{IE:()=>y,IQ:()=>O,vehicleD1Service:()=>S,x8:()=>p});class h{prepare(e){return new f(e,this.data)}exec(e){return console.log("Local DB exec:",e),{success:!0,meta:{changes:0,last_row_id:0,duration:0}}}async batch(e){return e.map(()=>({success:!0,meta:{changes:0,last_row_id:0,duration:0}}))}constructor(){this.data={vehicles:[{id:"vehicle-1",name:"Toyota Corolla",type:"sedan",capacity:4,pricePerDay:2500,description:"Comfortable sedan perfect for city travel and short trips.",features:'["AC", "Music System", "Comfortable Seats", "Professional Driver"]',isAvailable:1,adminId:"admin-1",createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()},{id:"vehicle-2",name:"Toyota Noah",type:"noah",capacity:7,pricePerDay:3500,description:"Spacious 7-seater perfect for family trips and group travel.",features:'["AC", "Music System", "Spacious Interior", "Professional Driver", "Child Safety Features"]',isAvailable:1,adminId:"admin-1",createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()},{id:"vehicle-3",name:"Toyota Hiace",type:"hiace",capacity:12,pricePerDay:4500,description:"Large capacity vehicle ideal for corporate events and large groups.",features:'["AC", "Music System", "Large Capacity", "Professional Driver", "Luggage Space"]',isAvailable:1,adminId:"admin-1",createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()}],vehicle_photos:[{id:"photo-1",vehicleId:"vehicle-1",url:"/images/vehicles/cmfarayr6000wm8dymksthkv2_0_1757313868155.jpg",alt:"Toyota Corolla - Photo 1",isPrimary:1,order:0},{id:"photo-2",vehicleId:"vehicle-2",url:"/images/vehicles/cmfedls7v0002v0m5k94jex8n_0_1757532722981.jpg",alt:"Toyota Noah - Photo 1",isPrimary:1,order:0},{id:"photo-3",vehicleId:"vehicle-3",url:"/images/vehicles/cmfarayr6000wm8dymksthkv2_0_1757313868155.jpg",alt:"Toyota Hiace - Photo 1",isPrimary:1,order:0}],bookings:[],passengers:[],admins:[{id:"admin-1",username:"admin",password:"240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9",email:"admin@rentacar.com",phone:"+8801234567890",role:"admin"}]}}}class f{constructor(e,t){this.boundValues=[],this.query=e,this.data=t}bind(...e){return this.boundValues=e,this}async first(){return this.executeQuery()[0]||null}async run(){return this.executeQuery(),{success:!0,meta:{changes:1,last_row_id:0,duration:0}}}async all(){return{success:!0,meta:{changes:0,last_row_id:0,duration:0},results:this.executeQuery()}}executeQuery(){let e=this.query.toLowerCase();if(e.includes("insert into passengers")){let[t,s,a,i,o,r,d]=this.boundValues,n={id:t,phone:s,name:a,email:i,isVerified:o===1,createdAt:r||new Date().toISOString(),updatedAt:d||new Date().toISOString()};return this.data.passengers.push(n),console.log("Inserted passenger:",n),[]}if(e.includes("insert into bookings")){let[t,s,a,i,o,r,d,n,u,A,N]=this.boundValues,g={id:t,passengerId:s,vehicleId:a,bookingDate:i,pickupTime:o,tripType:r,pickupLocation:d,dropoffLocation:n,status:u,createdAt:A||new Date().toISOString(),updatedAt:N||new Date().toISOString()};return this.data.bookings.push(g),console.log("Inserted booking:",g),[]}if(e.includes("insert into notifications")){let[t,s,a,i,o,r,d,n]=this.boundValues,u={id:t,bookingId:s,type:a,status:i,message:o,sentAt:r||new Date().toISOString(),createdAt:d||new Date().toISOString(),updatedAt:n||new Date().toISOString()};return this.data.notifications||(this.data.notifications=[]),this.data.notifications.push(u),console.log("Inserted notification:",u),[]}if(e.includes("update passengers")){let[t,s,a]=this.boundValues,i=this.data.passengers.find(o=>o.id===a);return i&&(t&&(i.name=t),s&&(i.email=s),i.updatedAt=new Date().toISOString()),[]}if(e.includes("update bookings")){let t=[...this.boundValues],s=t.pop(),a=this.data.bookings.find(i=>i.id===s);if(a){if(e.includes("status = ?")){let i=t[0];i&&(a.status=i)}if(e.includes("notes = ?")){let i=t[1]||t[0];i&&(a.notes=i)}a.updatedAt=new Date().toISOString()}return[]}if(e.includes("select count(*)")&&e.includes("vehicles"))return[{count:this.data.vehicles.length}];if(e.includes("select count(*)")&&e.includes("bookings"))return[{count:this.data.bookings.length}];if(e.includes("select count(*)")&&e.includes("passengers"))return[{count:this.data.passengers.length}];if(e.includes("select count(*)")&&e.includes("bookings")&&e.includes("status")){let t=this.boundValues[0];return[{count:this.data.bookings.filter(s=>s.status===t).length}]}if(e.includes("select * from admins"))return this.data.admins;if(e.includes("select * from passengers")&&e.includes("where phone = ?")){let t=this.boundValues[0];return this.data.passengers.filter(s=>s.phone===t)}if(e.includes("select")&&e.includes("vehicles")){let t=[...this.data.vehicles];if(e.includes("where")){if(e.includes("isavailable = 1")&&(t=t.filter(s=>s.isAvailable===1)),e.includes("type = ?")){let s=this.boundValues[0];t=t.filter(a=>a.type===s)}if(e.includes("id = ?")){let s=this.boundValues[0];t=t.filter(a=>a.id===s)}}return t.map(s=>{let a=this.data.vehicle_photos.filter(o=>o.vehicleId===s.id),i=null;return a.length>0&&(i=a.map(o=>JSON.stringify({id:o.id,url:o.url,alt:o.alt,isPrimary:o.isPrimary,order:o.order})).join(",")),{...s,photos_json:i}})}if(e.includes("select")&&e.includes("bookings")&&e.includes("join")){let t=this.boundValues[0],s=this.data.bookings.find(r=>r.id===t);if(!s)return[];let a=this.data.passengers.find(r=>r.id===s.passengerId),i=this.data.vehicles.find(r=>r.id===s.vehicleId),o=this.data.vehicle_photos.filter(r=>r.vehicleId===s.vehicleId);return a&&i?[{...s,passengerName:a.name,passengerPhone:a.phone,passengerEmail:a.email,vehicleName:i.name,vehicleType:i.type,vehicleCapacity:i.capacity,vehicleFeatures:i.features,vehiclePhotos:o.length>0?JSON.stringify(o.map(r=>({id:r.id,url:r.url,alt:r.alt,isPrimary:r.isPrimary,order:r.order}))):null}]:[]}if(e.includes("select")&&e.includes("bookings")&&e.includes("join")&&e.includes("order by")){let t=[...this.data.bookings];if(e.includes("where b.status = ?")){let i=this.boundValues[0];t=t.filter(o=>o.status===i)}let s=this.boundValues[this.boundValues.length-2]||10,a=this.boundValues[this.boundValues.length-1]||0;return t.slice(a,a+s).map(i=>{let o=this.data.passengers.find(n=>n.id===i.passengerId),r=this.data.vehicles.find(n=>n.id===i.vehicleId),d=this.data.vehicle_photos.filter(n=>n.vehicleId===i.vehicleId);return o&&r?{...i,passengerName:o.name,passengerPhone:o.phone,passengerEmail:o.email,vehicleName:r.name,vehicleType:r.type,vehicleCapacity:r.capacity,vehicleFeatures:r.features,vehiclePhotos:d.length>0?JSON.stringify(d.map(n=>({id:n.id,url:n.url,alt:n.alt,isPrimary:n.isPrimary,order:n.order}))):null}:null}).filter(Boolean)}if(e.includes("select")&&e.includes("bookings")&&!e.includes("join")){let t=[...this.data.bookings];if(e.includes("where status = ?")){let i=this.boundValues[0];t=t.filter(o=>o.status===i)}let s=this.boundValues[this.boundValues.length-2]||10,a=this.boundValues[this.boundValues.length-1]||0;return t.slice(a,a+s)}return[]}}function y(){let l=p();l instanceof h?(console.log("=== LOCAL DATABASE DATA ==="),console.log("Vehicles:",l.data.vehicles.length),console.log("Passengers:",l.data.passengers.length),console.log("Bookings:",l.data.bookings.length),console.log("Vehicle Photos:",l.data.vehicle_photos.length),console.log("Admins:",l.data.admins.length),l.data.bookings.length>0&&(console.log(`
=== RECENT BOOKINGS ===`),l.data.bookings.slice(-3).forEach((e,t)=>{console.log(`${t+1}. ${e.id} - ${e.status} - ${e.pickupLocation}`)})),l.data.passengers.length>0&&(console.log(`
=== RECENT PASSENGERS ===`),l.data.passengers.slice(-3).forEach((e,t)=>{console.log(`${t+1}. ${e.id} - ${e.name} - ${e.phone}`)})),console.log("========================")):console.log("Using Cloudflare D1 database")}class E{constructor(){this.db=p()}async getAvailableVehicles(e){let t=`
      SELECT v.*, 
             GROUP_CONCAT(
               CASE WHEN vp.id IS NOT NULL 
               THEN json_object('id', vp.id, 'url', vp.url, 'alt', vp.alt, 'isPrimary', vp.isPrimary, 'order', vp."order")
               END
             ) as photos_json
      FROM vehicles v
      LEFT JOIN vehicle_photos vp ON v.id = vp.vehicleId
      WHERE v.isAvailable = 1
    `,s=[];e&&(t+=" AND v.type = ?",s.push(e)),t+=`
      GROUP BY v.id
      ORDER BY v.createdAt DESC
    `;let a=await this.db.prepare(t).bind(...s).all();return this.processVehiclesResult(a.results||[])}async getAllVehicles(){let e=`
      SELECT v.*, 
             GROUP_CONCAT(
               CASE WHEN vp.id IS NOT NULL 
               THEN json_object('id', vp.id, 'url', vp.url, 'alt', vp.alt, 'isPrimary', vp.isPrimary, 'order', vp."order")
               END
             ) as photos_json
      FROM vehicles v
      LEFT JOIN vehicle_photos vp ON v.id = vp.vehicleId
      GROUP BY v.id
      ORDER BY v.createdAt DESC
    `,t=await this.db.prepare(e).all();return this.processVehiclesResult(t.results||[])}async getVehicleById(e){let t=`
      SELECT v.*, 
             GROUP_CONCAT(
               CASE WHEN vp.id IS NOT NULL 
               THEN json_object('id', vp.id, 'url', vp.url, 'alt', vp.alt, 'isPrimary', vp.isPrimary, 'order', vp."order")
               END
             ) as photos_json
      FROM vehicles v
      LEFT JOIN vehicle_photos vp ON v.id = vp.vehicleId
      WHERE v.id = ?
      GROUP BY v.id
    `,s=await this.db.prepare(t).bind(e).first();return s?this.processVehicleResult(s):null}async getVehicleCount(){return(await this.db.prepare("SELECT COUNT(*) as count FROM vehicles").first())?.count||0}processVehiclesResult(e){return e.map(t=>this.processVehicleResult(t))}processVehicleResult(e){let t={id:e.id,name:e.name,type:e.type,capacity:e.capacity,pricePerDay:e.pricePerDay,description:e.description,features:e.features?JSON.parse(e.features):[],isAvailable:!!e.isAvailable,adminId:e.adminId,createdAt:e.createdAt,updatedAt:e.updatedAt,photos:[]};if(e.photos_json)try{let s=[];if(e.photos_json.includes("},{")){let a=e.photos_json.split("},{").map((i,o)=>o===0?i+"}":o===a.length-1?"{"+i:"{"+i+"}");s=a.map(i=>{try{return JSON.parse(i)}catch{return console.error("Error parsing individual photo:",i),null}}).filter(Boolean)}else try{s=[JSON.parse(e.photos_json)]}catch{console.error("Error parsing single photo:",e.photos_json)}t.photos=s.sort((a,i)=>(a.order||0)-(i.order||0))}catch(s){console.error("Error parsing photos:",s),t.photos=[]}return t}}class I{constructor(){this.db=p()}async createBooking(e){let t=`booking-${Date.now()}-${Math.random().toString(36).substr(2,9)}`;return await this.db.prepare(`
      INSERT INTO bookings (id, passengerId, vehicleId, bookingDate, pickupTime, tripType, pickupLocation, dropoffLocation, status, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).bind(t,e.passengerId,e.vehicleId,e.bookingDate,e.pickupTime,e.tripType,e.pickupLocation,e.dropoffLocation||null,e.status).run(),{id:t}}async findPassengerByPhone(e){return await this.db.prepare("SELECT * FROM passengers WHERE phone = ?").bind(e).first()}async createPassenger(e){let t=`passenger-${Date.now()}-${Math.random().toString(36).substr(2,9)}`;return await this.db.prepare(`
      INSERT INTO passengers (id, phone, name, email, isVerified, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).bind(t,e.phone,e.name,e.email||null,+!!e.isVerified).run(),{id:t}}async updatePassenger(e,t){return await this.db.prepare(`
      UPDATE passengers 
      SET name = COALESCE(?, name), email = COALESCE(?, email), updatedAt = datetime('now')
      WHERE id = ?
    `).bind(t.name,t.email,e).run()}async getBookingWithDetails(e){let t=await this.db.prepare(`
      SELECT 
        b.*,
        p.name as passengerName,
        p.phone as passengerPhone,
        p.email as passengerEmail,
        v.name as vehicleName,
        v.type as vehicleType,
        v.capacity as vehicleCapacity,
        v.features as vehicleFeatures,
        v.photos_json as vehiclePhotos
      FROM bookings b
      JOIN passengers p ON b.passengerId = p.id
      JOIN vehicles v ON b.vehicleId = v.id
      WHERE b.id = ?
    `).bind(e).first();return t?{id:t.id,passengerId:t.passengerId,vehicleId:t.vehicleId,bookingDate:t.bookingDate,pickupTime:t.pickupTime,tripType:t.tripType,pickupLocation:t.pickupLocation,dropoffLocation:t.dropoffLocation,status:t.status,createdAt:t.createdAt,updatedAt:t.updatedAt,passenger:{id:t.passengerId,name:t.passengerName,phone:t.passengerPhone,email:t.passengerEmail},vehicle:{id:t.vehicleId,name:t.vehicleName,type:t.vehicleType,capacity:t.vehicleCapacity,features:t.vehicleFeatures?JSON.parse(t.vehicleFeatures):[],photos:t.vehiclePhotos?JSON.parse(t.vehiclePhotos):[]}}:null}async getBookings(e={}){let{status:t,page:s=1,limit:a=10}=e,i="",o=[];t&&(i="WHERE b.status = ?",o.push(t));let r=await this.db.prepare(`
      SELECT 
        b.*,
        p.name as passengerName,
        p.phone as passengerPhone,
        p.email as passengerEmail,
        v.name as vehicleName,
        v.type as vehicleType,
        v.capacity as vehicleCapacity,
        v.features as vehicleFeatures,
        v.photos_json as vehiclePhotos
      FROM bookings b
      JOIN passengers p ON b.passengerId = p.id
      JOIN vehicles v ON b.vehicleId = v.id
      ${i}
      ORDER BY b.createdAt DESC
      LIMIT ? OFFSET ?
    `).bind(...o,a,(s-1)*a).all(),d=await this.db.prepare(`
      SELECT COUNT(*) as count FROM bookings b ${i}
    `).bind(...o).first();return{bookings:r.results?.map(n=>({id:n.id,passengerId:n.passengerId,vehicleId:n.vehicleId,bookingDate:n.bookingDate,pickupTime:n.pickupTime,tripType:n.tripType,pickupLocation:n.pickupLocation,dropoffLocation:n.dropoffLocation,status:n.status,createdAt:n.createdAt,updatedAt:n.updatedAt,passenger:{id:n.passengerId,name:n.passengerName,phone:n.passengerPhone,email:n.passengerEmail},vehicle:{id:n.vehicleId,name:n.vehicleName,type:n.vehicleType,capacity:n.vehicleCapacity,features:n.vehicleFeatures?JSON.parse(n.vehicleFeatures):[],photos:n.vehiclePhotos?JSON.parse(n.vehiclePhotos):[]}}))||[],total:d?.count||0}}async updateBooking(e,t){let s=[],a=[];if(t.status&&(s.push("status = ?"),a.push(t.status)),t.notes&&(s.push("notes = ?"),a.push(t.notes)),s.length===0)throw Error("No fields to update");return s.push('updatedAt = datetime("now")'),a.push(e),await this.db.prepare(`
      UPDATE bookings 
      SET ${s.join(", ")}
      WHERE id = ?
    `).bind(...a).run()}}let S=new E,O=new I},v);export{P as __getNamedExports};
