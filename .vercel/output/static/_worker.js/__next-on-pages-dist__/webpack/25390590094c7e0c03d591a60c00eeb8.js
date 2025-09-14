var V={},H=(N,C,L)=>(V.__chunk_833=(B,P,E)=>{"use strict";E.d(P,{E:()=>O});class g{constructor(e){this.vehicleRepository=e}async getAvailableVehicles(e){if(e&&!this.isValidVehicleType(e))throw Error(`Invalid vehicle type: ${e}`);let i=await this.vehicleRepository.getAvailableVehicles(e);return this.sortVehiclesByPriority(i)}async getVehicleById(e){if(!e||e.trim()==="")throw Error("Vehicle ID is required");return this.vehicleRepository.getVehicleById(e)}async getVehicleCount(){return this.vehicleRepository.getVehicleCount()}async getVehiclesForAdmin(e){return this.vehicleRepository.getVehiclesByAdmin(e)}async createVehicle(e){this.validateVehicleData(e);let i=await this.vehicleRepository.createVehicle(e),t=await this.vehicleRepository.getVehicleById(i);if(!t)throw Error("Failed to create vehicle");return t}async updateVehicleAvailability(e,i){if(!e||e.trim()==="")throw Error("Vehicle ID is required");await this.vehicleRepository.updateVehicleAvailability(e,i);let t=await this.vehicleRepository.getVehicleById(e);return!!t&&t.isAvailable===i}isValidVehicleType(e){return["sedan","noah","hiace"].includes(e.toLowerCase())}validateVehicleData(e){if(!e.name||e.name.trim()==="")throw Error("Vehicle name is required");if(!e.type||!this.isValidVehicleType(e.type))throw Error("Valid vehicle type is required (sedan, noah, hiace)");if(!e.capacity||e.capacity<1)throw Error("Vehicle capacity must be at least 1");if(!e.pricePerDay||e.pricePerDay<0)throw Error("Price per day must be a positive number")}sortVehiclesByPriority(e){return e.sort((i,t)=>{let r=i.photos.some(a=>a.isPrimary),s=t.photos.some(a=>a.isPrimary);return r&&!s?-1:!r&&s?1:new Date(t.createdAt).getTime()-new Date(i.createdAt).getTime()})}async getAllVehicles(){return this.vehicleRepository.getAllVehicles()}async addVehiclePhoto(e,i){return this.vehicleRepository.addVehiclePhoto(e,i)}async setPrimaryPhoto(e,i){return this.vehicleRepository.setPrimaryPhoto(e,i)}async deleteVehiclePhoto(e){return this.vehicleRepository.deleteVehiclePhoto(e)}async updateVehicle(e,i){this.validateVehicleData(i),await this.vehicleRepository.updateVehicle(e,i);let t=await this.vehicleRepository.getVehicleById(e);if(!t)throw Error("Failed to fetch updated vehicle");return t}async deleteVehicle(e){if(!await this.vehicleRepository.getVehicleById(e))throw Error("Vehicle not found");return await this.vehicleRepository.deleteVehicle(e),!await this.vehicleRepository.getVehicleById(e)}}var o=E(3154);class w{constructor(e,i,t){this.bookingRepository=e,this.passengerRepository=i,this.vehicleRepository=t}async createBooking(e){this.validateBookingData(e);let i=await this.vehicleRepository.getVehicleById(e.vehicleId);if(!i)throw Error("Vehicle not found");if(!i.isAvailable)throw Error("Vehicle is not available for booking");let t=(0,o.n4)(e.passengerPhone),r=await this.passengerRepository.findByPhone(t);return r?await this.passengerRepository.updatePassenger(r.id,{name:e.passengerName,email:e.passengerEmail||r.email}):r=await this.passengerRepository.create({phone:t,name:e.passengerName,email:e.passengerEmail,isVerified:!1}),await this.bookingRepository.create({passengerId:r.id,vehicleId:e.vehicleId,bookingDate:e.bookingDate,pickupTime:e.pickupTime,tripType:e.tripType,pickupLocation:e.pickupLocation,dropoffLocation:e.dropoffLocation,status:"pending"})}async getBookingById(e){return this.bookingRepository.findById(e)}async getBookings(e={}){return this.bookingRepository.findAll(e)}async getBookingsByPassengerPhone(e){let i=(0,o.n4)(e),t=await this.passengerRepository.findByPhone(i);return t?this.bookingRepository.findByPassengerId(t.id):[]}async updateBookingStatus(e,i){if(!await this.bookingRepository.findById(e))throw Error("Booking not found");return this.bookingRepository.updateStatus(e,i)}async updateBooking(e,i){if(!await this.bookingRepository.findById(e))throw Error("Booking not found");return await this.bookingRepository.updateBooking(e,i),this.bookingRepository.findById(e)}async cancelBooking(e,i){let t=await this.bookingRepository.findById(e);if(!t)throw Error("Booking not found");if(t.status==="cancelled")throw Error("Booking is already cancelled");if(t.status==="completed")throw Error("Cannot cancel completed booking");return this.bookingRepository.updateBooking(e,{status:"cancelled",notes:i?`Cancelled: ${i}`:"Cancelled by user"})}async getBookingStats(){let{bookings:e}=await this.bookingRepository.findAll({limit:1e3}),i={total:e.length,pending:0,confirmed:0,completed:0,cancelled:0};return e.forEach(t=>{switch(t.status){case"pending":i.pending++;break;case"confirmed":i.confirmed++;break;case"completed":i.completed++;break;case"cancelled":i.cancelled++}}),i}validateBookingData(e){if(!e.bookingDate)throw Error("Booking date is required");if(!e.pickupTime)throw Error("Pickup time is required");if(!e.tripType)throw Error("Trip type is required");if(!e.pickupLocation)throw Error("Pickup location is required");if(e.tripType==="round"&&!e.dropoffLocation)throw Error("Drop-off location is required for round trip");if(!e.passengerName)throw Error("Passenger name is required");if(!e.passengerPhone)throw Error("Passenger phone is required");if(!(0,o.Q7)(e.passengerPhone))throw Error("Invalid phone number format");if(e.passengerEmail&&!/\S+@\S+\.\S+/.test(e.passengerEmail))throw Error("Invalid email format");if(!e.vehicleId)throw Error("Vehicle selection is required");let i=new Date(e.bookingDate),t=new Date;if(t.setHours(0,0,0,0),i<t)throw Error("Booking date cannot be in the past")}async checkAvailability(e,i){let t=await this.vehicleRepository.getVehicleById(e);return!!t&&!!t.isAvailable}async getBookingsByVehicleId(e){return this.bookingRepository.findByVehicleId(e)}}class T{constructor(e){this.passengerRepository=e}async createPassenger(e){if(!(0,o.Q7)(e.phone))throw Error("Invalid phone number format");let i=(0,o.n4)(e.phone);if(await this.passengerRepository.findByPhone(i))throw Error("Passenger with this phone number already exists");if(e.email&&!/\S+@\S+\.\S+/.test(e.email))throw Error("Invalid email format");return this.passengerRepository.create({phone:i,name:e.name,email:e.email,isVerified:!1})}async getPassengerById(e){return this.passengerRepository.findById(e)}async getPassengerByPhone(e){let i=(0,o.n4)(e);return this.passengerRepository.findByPhone(i)}async getPassengers(e={}){return this.passengerRepository.findAll(e)}async updatePassenger(e,i){if(!await this.passengerRepository.findById(e))throw Error("Passenger not found");if(i.email&&!/\S+@\S+\.\S+/.test(i.email))throw Error("Invalid email format");return this.passengerRepository.updatePassenger(e,i)}async verifyPassenger(e){let i=(0,o.n4)(e);if(!await this.passengerRepository.findByPhone(i))throw Error("Passenger not found");return this.passengerRepository.updateVerificationStatus(i,!0)}async unverifyPassenger(e){let i=(0,o.n4)(e);if(!await this.passengerRepository.findByPhone(i))throw Error("Passenger not found");return this.passengerRepository.updateVerificationStatus(i,!1)}async deletePassenger(e){if(!await this.passengerRepository.findById(e))throw Error("Passenger not found");return this.passengerRepository.deletePassenger(e)}async passengerExists(e){let i=(0,o.n4)(e);return this.passengerRepository.existsByPhone(i)}async getPassengerStats(){return this.passengerRepository.getStats()}async findOrCreatePassenger(e){let i=(0,o.n4)(e.phone),t=await this.passengerRepository.findByPhone(i);return t?((e.name||e.email)&&(await this.passengerRepository.updatePassenger(t.id,{name:e.name||t.name,email:e.email||t.email}),t=await this.passengerRepository.findById(t.id)),t):this.createPassenger(e)}async searchPassengers(e,i={}){let{passengers:t,total:r}=await this.getPassengers({page:1,limit:1e3}),s=t.filter(l=>l.name?.toLowerCase().includes(e.toLowerCase())||l.phone.includes(e)||l.email?.toLowerCase().includes(e.toLowerCase())),{page:a=1,limit:n=10}=i,d=(a-1)*n;return{passengers:s.slice(d,d+n),total:s.length}}}var S=E(535);class _{constructor(e){this.adminRepository=e}async authenticate(e,i){let t=await this.adminRepository.findByUsername(e);if(!t)return null;let r=await this.getAdminWithPassword(e);if(!r||!await(0,S.b9)(i,r.password))return null;await this.adminRepository.updateLastLogin(t.id);let s=await(0,S.FA)({adminId:t.id,username:t.username,role:t.role},process.env.JWT_SECRET||"fallback-secret");return{admin:t,token:s}}async getAdminWithPassword(e){return this.adminRepository.findByUsernameWithPassword(e)}async getAdminById(e){return this.adminRepository.findById(e)}}var v=E(3993);class A{async getDashboardStats(){let[e,i,t,r]=await Promise.all([this.database.query("SELECT COUNT(*) as count FROM bookings",[]),this.database.query("SELECT COUNT(*) as count FROM bookings WHERE status = $1",["pending"]),this.database.query("SELECT COUNT(*) as count FROM vehicles",[]),this.database.query("SELECT COUNT(*) as count FROM passengers",[])]);if(!e.success||!i.success||!t.success||!r.success)throw Error("Failed to fetch dashboard statistics");return{totalBookings:e.data?.[0]?.count||0,pendingBookings:i.data?.[0]?.count||0,totalVehicles:t.data?.[0]?.count||0,totalPassengers:r.data?.[0]?.count||0}}constructor(){this.database=v._.getDefaultProvider()}}class m{constructor(e){this.db=e}async executeQuery(e,i=[]){return this.db.query(e,i)}async select(e,i=[]){let t=await this.executeQuery(e,i);if(!t.success)throw Error(t.error||"Query failed");return t.data||[]}async insert(e,i=[]){let t=await this.executeQuery(e,i);if(!t.success)throw Error(t.error||"Insert failed");return t.meta?.last_row_id||0}async update(e,i=[]){let t=await this.executeQuery(e,i);if(!t.success)throw Error(t.error||"Update failed");return t.meta?.changes||0}async delete(e,i=[]){let t=await this.executeQuery(e,i);if(!t.success)throw Error(t.error||"Delete failed");return t.meta?.changes||0}}class f extends m{async getAvailableVehicles(e){let i=`
      SELECT v.*, 
             GROUP_CONCAT(
               CASE WHEN vp.id IS NOT NULL 
               THEN json_object('id', vp.id, 'url', vp.url, 'alt', vp.alt, 'isPrimary', vp.isPrimary, 'order', vp."order")
               END
             ) as photos_json
      FROM vehicles v
      LEFT JOIN vehicle_photos vp ON v.id = vp.vehicleId
      WHERE v.isAvailable = 1
    `,t=[];e&&(i+=" AND v.type = $1",t.push(e)),i+=`
      GROUP BY v.id
      ORDER BY v.createdAt DESC
    `;let r=await this.select(i,t);return this.mapRowsToVehicles(r)}async getVehicleById(e){let i=`
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
    `,t=await this.select(i,[e]);return t.length>0?this.mapRowToVehicle(t[0]):null}async getVehicleCount(){return(await this.select("SELECT COUNT(*) as count FROM vehicles"))[0]?.count||0}async getVehiclesByAdmin(e){let i=`
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
    `,t=await this.select(i,[e]);return this.mapRowsToVehicles(t)}async createVehicle(e){let i=`vehicle-${Date.now()}-${Math.random().toString(36).substr(2,9)}`,t=`
      INSERT INTO vehicles (id, name, type, capacity, pricePerDay, description, features, adminId, createdAt, updatedAt)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, datetime('now'), datetime('now'))
    `,r=e.features?JSON.stringify(e.features):null;return await this.insert(t,[i,e.name,e.type,e.capacity,e.pricePerDay,e.description||null,r,e.adminId||null]),i}async updateVehicleAvailability(e,i){return await this.update('UPDATE vehicles SET isAvailable = $1, updatedAt = datetime("now") WHERE id = $2',[+!!i,e])>0}mapRowsToVehicles(e){return e.map(i=>this.mapRowToVehicle(i))}mapRowToVehicle(e){let i={id:e.id,name:e.name,type:e.type,capacity:e.capacity,pricePerDay:e.pricePerDay,description:e.description,features:e.features?JSON.parse(e.features):[],isAvailable:!!e.isAvailable,adminId:e.adminId,createdAt:new Date(e.createdAt),updatedAt:new Date(e.updatedAt),photos:[]};return e.photos_json&&(i.photos=this.parsePhotos(e.photos_json)),i}parsePhotos(e){try{let i=[];if(e.includes("},{"))i=e.split("},{").map((t,r,s)=>r===0?t+"}":r===s.length-1?"{"+t:"{"+t+"}").map(t=>{try{return JSON.parse(t)}catch{return null}}).filter(Boolean);else try{i=[JSON.parse(e)]}catch{}return i.sort((t,r)=>(t.order||0)-(r.order||0)).map(t=>({id:t.id,vehicleId:t.vehicleId||"",url:t.url,alt:t.alt,isPrimary:!!t.isPrimary,order:t.order||0,createdAt:new Date}))}catch(i){return console.error("Error parsing photos:",i),[]}}async getAllVehicles(){let e=`
      SELECT v.*,
             GROUP_CONCAT(
               CASE WHEN vp.id IS NOT NULL 
               THEN json_object('id', vp.id, 'url', vp.url, 'alt', vp.alt, 'isPrimary', vp.isPrimary, 'order', vp."order", 'createdAt', vp.createdAt)
               END
             ) as photos_json
      FROM vehicles v
      LEFT JOIN vehicle_photos vp ON v.id = vp.vehicleId
      GROUP BY v.id
      ORDER BY v.createdAt DESC
    `,i=await this.select(e,[]);return this.mapRowsToVehicles(i)}async addVehiclePhoto(e,i){let t=`
      INSERT INTO vehicle_photos (id, vehicleId, url, alt, isPrimary, "order", createdAt)
      VALUES ($1, $2, $3, $4, $5, $6, datetime("now"))
    `,r=`photo_${Date.now()}_${Math.random().toString(36).substr(2,9)}`;return await this.insert(t,[r,e,i.url,i.alt,+!!i.isPrimary,i.order]),{id:r,vehicleId:e,url:i.url,alt:i.alt,isPrimary:i.isPrimary,order:i.order,createdAt:new Date}}async setPrimaryPhoto(e,i){return await this.update("UPDATE vehicle_photos SET isPrimary = 0 WHERE vehicleId = $1",[e]),await this.update("UPDATE vehicle_photos SET isPrimary = 1 WHERE id = $1 AND vehicleId = $2",[i,e])>0}async deleteVehiclePhoto(e){return await this.delete("DELETE FROM vehicle_photos WHERE id = $1",[e])>0}async updateVehicle(e,i){let t=`
      UPDATE vehicles 
      SET name = $1, type = $2, capacity = $3, pricePerDay = $4, 
          description = $5, features = $6, isAvailable = $7, 
          updatedAt = datetime("now")
      WHERE id = $8
    `,r=JSON.stringify(i.features);return await this.update(t,[i.name,i.type,i.capacity,i.pricePerDay,i.description,r,+!!i.isAvailable,e])>0}async deleteVehicle(e){return await this.delete("DELETE FROM vehicles WHERE id = $1",[e])>0}}class k extends m{async create(e){let i=`
      INSERT INTO bookings (
        id, passengerId, vehicleId, bookingDate, pickupTime, tripType, 
        pickupLocation, dropoffLocation, status, notes, createdAt, updatedAt
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    `,t=crypto.randomUUID(),r=new Date;return await this.insert(i,[t,e.passengerId,e.vehicleId,e.bookingDate.toISOString(),e.pickupTime,e.tripType,e.pickupLocation,e.dropoffLocation||null,e.status,e.notes||null,r.toISOString(),r.toISOString()]),this.findById(t)}async findById(e){let i=`
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
    `,t=await this.select(i,[e]);return t.length===0?null:this.mapBookingResult(t[0])}async findAll(e={}){let{status:i,page:t=1,limit:r=10}=e,s="",a=[];i&&(s="WHERE b.status = $1",a.push(i));let n=`
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
      ${s}
      ORDER BY b.createdAt DESC
      LIMIT ? OFFSET ?
    `,d=`
      SELECT COUNT(*) as total
      FROM bookings b
      ${s}
    `,[l,u]=await Promise.all([this.select(n,[...a,r,(t-1)*r]),this.select(d,a)]),y=u[0]?.total||0;return{bookings:l.map(h=>this.mapBookingResult(h)),total:y}}async findByPassengerId(e){let i=`
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
    `;return(await this.select(i,[e])).map(t=>this.mapBookingResult(t))}async updateStatus(e,i){let t=`
      UPDATE bookings 
      SET status = $1, updatedAt = $2
      WHERE id = $3
    `;return await this.update(t,[i,new Date().toISOString(),e])>0}async updateBooking(e,i){let t=[],r=[],s=1;if(i.bookingDate&&(t.push(`bookingDate = $${s}`),r.push(i.bookingDate.toISOString()),s++),i.pickupTime&&(t.push(`pickupTime = $${s}`),r.push(i.pickupTime),s++),i.tripType&&(t.push(`tripType = $${s}`),r.push(i.tripType),s++),i.pickupLocation&&(t.push(`pickupLocation = $${s}`),r.push(i.pickupLocation),s++),i.dropoffLocation!==void 0&&(t.push(`dropoffLocation = $${s}`),r.push(i.dropoffLocation),s++),i.status&&(t.push(`status = $${s}`),r.push(i.status),s++),i.notes!==void 0&&(t.push(`notes = $${s}`),r.push(i.notes),s++),t.length===0)return!1;t.push(`updatedAt = $${s}`),r.push(new Date().toISOString()),s++,r.push(e);let a=`UPDATE bookings SET ${t.join(", ")} WHERE id = $${s}`;return await this.update(a,r)>0}async deleteBooking(e){return await this.delete("DELETE FROM bookings WHERE id = $1",[e])>0}mapBookingResult(e){return{id:e.id,passengerId:e.passengerId,vehicleId:e.vehicleId,bookingDate:new Date(e.bookingDate),pickupTime:e.pickupTime,tripType:e.tripType,pickupLocation:e.pickupLocation,dropoffLocation:e.dropoffLocation,status:e.status,notes:e.notes,createdAt:new Date(e.createdAt),updatedAt:new Date(e.updatedAt),passenger:{id:e.passenger_id,phone:e.passenger_phone,name:e.passenger_name,email:e.passenger_email,isVerified:!!e.passenger_isVerified,createdAt:new Date(e.passenger_createdAt),updatedAt:new Date(e.passenger_updatedAt)},vehicle:{id:e.vehicle_id,name:e.vehicle_name,type:e.vehicle_type,capacity:e.vehicle_capacity,pricePerDay:e.vehicle_pricePerDay,description:e.vehicle_description,features:e.vehicle_features?JSON.parse(e.vehicle_features):[],isAvailable:!!e.vehicle_isAvailable,adminId:e.vehicle_adminId,createdAt:new Date(e.vehicle_createdAt),updatedAt:new Date(e.vehicle_updatedAt),photos:[]}}}async findByVehicleId(e){let i=`
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
    `,t=await this.select(i,[e]);return this.mapRowsToBookings(t)}mapRowsToBookings(e){return e.map(i=>this.mapBookingResult(i))}}class R extends m{async create(e){let i=`
      INSERT INTO passengers (id, phone, name, email, isVerified, createdAt, updatedAt)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `,t=crypto.randomUUID(),r=new Date;return await this.insert(i,[t,e.phone,e.name||null,e.email||null,e.isVerified||!1,r.toISOString(),r.toISOString()]),this.findById(t)}async findById(e){let i=await this.select("SELECT * FROM passengers WHERE id = $1",[e]);return i.length===0?null:this.mapPassengerResult(i[0])}async findByPhone(e){let i=await this.select("SELECT * FROM passengers WHERE phone = $1",[e]);return i.length===0?null:this.mapPassengerResult(i[0])}async findAll(e={}){let{page:i=1,limit:t=10,isVerified:r}=e,s="",a=[];r!==void 0&&(s="WHERE isVerified = $1",a.push(r));let n=`
      SELECT * FROM passengers
      ${s}
      ORDER BY createdAt DESC
      LIMIT ? OFFSET ?
    `,d=`
      SELECT COUNT(*) as total
      FROM passengers
      ${s}
    `,[l,u]=await Promise.all([this.select(n,[...a,t,(i-1)*t]),this.select(d,a)]),y=u[0]?.total||0;return{passengers:l.map(h=>this.mapPassengerResult(h)),total:y}}async updatePassenger(e,i){let t=[],r=[];if(i.name!==void 0&&(t.push("name = ?"),r.push(i.name)),i.email!==void 0&&(t.push("email = ?"),r.push(i.email)),i.isVerified!==void 0&&(t.push("isVerified = ?"),r.push(i.isVerified)),t.length===0)return!1;t.push("updatedAt = ?"),r.push(new Date().toISOString()),r.push(e);let s=`UPDATE passengers SET ${t.join(", ")} WHERE id = ?`;return await this.update(s,r)>0}async updateVerificationStatus(e,i){let t=`
      UPDATE passengers 
      SET isVerified = $1, updatedAt = $2
      WHERE phone = $3
    `;return await this.update(t,[i,new Date().toISOString(),e])>0}async deletePassenger(e){return await this.delete("DELETE FROM passengers WHERE id = $1",[e])>0}async existsByPhone(e){return(await this.select("SELECT 1 FROM passengers WHERE phone = $1 LIMIT 1",[e])).length>0}async getStats(){let e=`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN isVerified = 1 THEN 1 ELSE 0 END) as verified,
        SUM(CASE WHEN isVerified = 0 THEN 1 ELSE 0 END) as unverified
      FROM passengers
    `,i=(await this.select(e))[0];return{total:i.total||0,verified:i.verified||0,unverified:i.unverified||0}}mapPassengerResult(e){return{id:e.id,phone:e.phone,name:e.name,email:e.email,isVerified:!!e.isVerified,createdAt:new Date(e.createdAt),updatedAt:new Date(e.updatedAt)}}}class D extends m{async findByUsername(e){let i=`
      SELECT id, username, email, password, phone, role, createdAt, updatedAt
      FROM admins 
      WHERE username = $1
    `,t=await this.select(i,[e]);return t.length===0?null:this.mapAdminResult(t[0])}async findById(e){let i=`
      SELECT id, username, email, password, phone, role, createdAt, updatedAt
      FROM admins 
      WHERE id = $1
    `,t=await this.select(i,[e]);return t.length===0?null:this.mapAdminResult(t[0])}async findByUsernameWithPassword(e){let i=`
      SELECT id, username, password, role
      FROM admins 
      WHERE username = $1
    `,t=await this.select(i,[e]);return t.length===0?null:t[0]}async updateLastLogin(e){let i=`
      UPDATE admins 
      SET updatedAt = $1
      WHERE id = $2
    `;return await this.update(i,[new Date().toISOString(),e])>0}mapAdminResult(e){return{id:e.id,username:e.username,email:e.email,phone:e.phone,role:e.role,createdAt:new Date(e.createdAt),updatedAt:new Date(e.updatedAt)}}}class O{static{this.vehicleService=null}static{this.bookingService=null}static{this.passengerService=null}static{this.adminService=null}static{this.adminStatsService=null}static getVehicleService(){if(!this.vehicleService){let e=new f(v._.getDefaultProvider());this.vehicleService=new g(e)}return this.vehicleService}static getBookingService(){if(!this.bookingService){let e=v._.getDefaultProvider(),i=new k(e),t=new R(e),r=new f(e);this.bookingService=new w(i,t,r)}return this.bookingService}static getPassengerService(){if(!this.passengerService){let e=new R(v._.getDefaultProvider());this.passengerService=new T(e)}return this.passengerService}static getAdminService(){if(!this.adminService){let e=new D(v._.getDefaultProvider());this.adminService=new _(e)}return this.adminService}static getAdminStatsService(){return this.adminStatsService||(this.adminStatsService=new A),this.adminStatsService}static reset(){this.vehicleService=null,this.bookingService=null,this.passengerService=null,this.adminService=null,this.adminStatsService=null}}},V.__chunk_535=(B,P,E)=>{"use strict";function g(t){let r=new Uint8Array(t.length);for(let s=0;s<t.length;s++)r[s]=t.charCodeAt(s);return r}E.d(P,{b9:()=>e,FA:()=>D,_H:()=>i});function o(t){return btoa(String.fromCharCode(...new TextEncoder().encode(t))).replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_")}function w(t){return g(atob(t.replace(/-+(BEGIN|END).*/g,"").replace(/\s/g,"")))}async function T(t,r,s){return await crypto.subtle.importKey("raw",g(t),r,!0,s)}async function S(t,r,s){return await crypto.subtle.importKey("jwk",t,r,!0,s)}async function _(t,r,s){return await crypto.subtle.importKey("spki",w(t),r,!0,s)}async function v(t,r,s){return await crypto.subtle.importKey("pkcs8",w(t),r,!0,s)}async function A(t,r,s){if(typeof t=="object")return S(t,r,s);if(typeof t!="string")throw Error("Unsupported key type!");return t.includes("PUBLIC")?_(t,r,s):t.includes("PRIVATE")?v(t,r,s):T(t,r,s)}function m(t){let r=Array.from(atob(t),s=>s.charCodeAt(0));return JSON.parse(new TextDecoder("utf-8").decode(new Uint8Array(r)))}if(typeof crypto>"u"||!crypto.subtle)throw Error("SubtleCrypto not supported!");var f={none:{name:"none"},ES256:{name:"ECDSA",namedCurve:"P-256",hash:{name:"SHA-256"}},ES384:{name:"ECDSA",namedCurve:"P-384",hash:{name:"SHA-384"}},ES512:{name:"ECDSA",namedCurve:"P-521",hash:{name:"SHA-512"}},HS256:{name:"HMAC",hash:{name:"SHA-256"}},HS384:{name:"HMAC",hash:{name:"SHA-384"}},HS512:{name:"HMAC",hash:{name:"SHA-512"}},RS256:{name:"RSASSA-PKCS1-v1_5",hash:{name:"SHA-256"}},RS384:{name:"RSASSA-PKCS1-v1_5",hash:{name:"SHA-384"}},RS512:{name:"RSASSA-PKCS1-v1_5",hash:{name:"SHA-512"}}};async function k(t,r,s="HS256"){if(typeof s=="string"&&(s={algorithm:s}),s={algorithm:"HS256",header:{typ:"JWT",...s.header??{}},...s},!t||typeof t!="object")throw Error("payload must be an object");if(s.algorithm!=="none"&&(!r||typeof r!="string"&&typeof r!="object"))throw Error("secret must be a string, a JWK object or a CryptoKey object");if(typeof s.algorithm!="string")throw Error("options.algorithm must be a string");let a=f[s.algorithm];if(!a)throw Error("algorithm not found");t.iat||(t.iat=Math.floor(Date.now()/1e3));let n=`${o(JSON.stringify({...s.header,alg:s.algorithm}))}.${o(JSON.stringify(t))}`;if(s.algorithm==="none")return n;let d=r instanceof CryptoKey?r:await A(r,a,["sign"]),l=await crypto.subtle.sign(a,d,g(n));return`${n}.${btoa(function(u){let y="";for(let h=0;h<u.byteLength;h++)y+=String.fromCharCode(u[h]);return y}(new Uint8Array(l))).replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_")}`}async function R(t,r,s="HS256"){var a,n,d;if(typeof s=="string"&&(s={algorithm:s}),s={algorithm:"HS256",clockTolerance:0,throwError:!1,...s},typeof t!="string")throw Error("token must be a string");if(s.algorithm!=="none"&&typeof r!="string"&&typeof r!="object")throw Error("secret must be a string, a JWK object or a CryptoKey object");if(typeof s.algorithm!="string")throw Error("options.algorithm must be a string");let l=t.split(".",3);if(l.length<2)throw Error("token must consist of 2 or more parts");let[u,y,h]=l,I=f[s.algorithm];if(!I)throw Error("algorithm not found");let p={header:m((a=t).split(".")[0].replace(/-/g,"+").replace(/_/g,"/")),payload:m(a.split(".")[1].replace(/-/g,"+").replace(/_/g,"/"))};try{if(p.header?.alg!==s.algorithm)throw Error("INVALID_SIGNATURE");if(p.payload){let b=Math.floor(Date.now()/1e3);if(p.payload.nbf&&p.payload.nbf>b&&p.payload.nbf-b>(s.clockTolerance??0))throw Error("NOT_YET_VALID");if(p.payload.exp&&p.payload.exp<=b&&b-p.payload.exp>(s.clockTolerance??0))throw Error("EXPIRED")}if(I.name==="none")return p;let $=r instanceof CryptoKey?r:await A(r,I,["verify"]);if(!await crypto.subtle.verify(I,$,(d=h,g(atob(d.replace(/-/g,"+").replace(/_/g,"/").replace(/\s/g,"")))),(n=`${u}.${y}`,g(n))))throw Error("INVALID_SIGNATURE");return p}catch($){if(s.throwError)throw $;return}}async function D(t,r){return await k(t,r)}async function O(t,r){try{return await R(t,r)}catch{throw Error("Invalid token")}}async function c(t){let r=new TextEncoder().encode(t);return Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",r))).map(s=>s.toString(16).padStart(2,"0")).join("")}async function e(t,r){return await c(t)===r}async function i(t){let r=t.headers.get("authorization");if(!r||!r.startsWith("Bearer "))throw Error("No token provided");let s=r.replace("Bearer ",""),a=await O(s,process.env.JWT_SECRET||"fallback-secret"),n=a.payload||a;if(!n.adminId||!n.username||!n.role)throw Error("Invalid token payload");return n}},V);export{H as __getNamedExports};
