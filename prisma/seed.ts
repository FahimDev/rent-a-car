import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/lib/auth'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await hashPassword('admin123')
  
  const admin = await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      email: 'admin@rentacar.com',
      phone: '+8801234567890',
      role: 'admin'
    }
  })

  // Create company info
  const companyInfo = await prisma.companyInfo.upsert({
    where: { id: 'company-1' },
    update: {},
    create: {
      id: 'company-1',
      name: 'Rent-A-Car Bangladesh',
      tagline: 'আপনার যাত্রার জন্য নির্ভরযোগ্য পরিবহন | Reliable Transportation for Your Journey',
      description: 'We provide premium car rental services across Bangladesh with professional drivers and well-maintained vehicles.',
      address: 'Dhaka, Bangladesh',
      phone: '+8801234567890',
      email: 'info@rentacar.com',
      whatsapp: '+8801234567890',
      latitude: 23.8103,
      longitude: 90.4125,
      services: JSON.stringify([
        'Airport Transfer',
        'City Tour',
        'Long Distance Travel',
        'Corporate Transportation',
        'Wedding & Event Services'
      ])
    }
  })

  // Create sample vehicles
  const vehicles = [
    {
      name: 'Toyota Corolla',
      type: 'sedan',
      capacity: 4,
      pricePerDay: 2500,
      description: 'Comfortable sedan perfect for city travel and short trips.',
      features: JSON.stringify(['AC', 'Music System', 'Comfortable Seats', 'Professional Driver']),
      isAvailable: true,
      adminId: admin.id
    },
    {
      name: 'Toyota Noah',
      type: 'noah',
      capacity: 7,
      pricePerDay: 3500,
      description: 'Spacious 7-seater perfect for family trips and group travel.',
      features: JSON.stringify(['AC', 'Music System', 'Spacious Interior', 'Professional Driver', 'Child Safety Features']),
      isAvailable: true,
      adminId: admin.id
    },
    {
      name: 'Toyota Hiace',
      type: 'hiace',
      capacity: 12,
      pricePerDay: 4500,
      description: 'Large capacity vehicle ideal for corporate events and large groups.',
      features: JSON.stringify(['AC', 'Music System', 'Large Capacity', 'Professional Driver', 'Luggage Space']),
      isAvailable: true,
      adminId: admin.id
    }
  ]

  for (const vehicleData of vehicles) {
    const vehicle = await prisma.vehicle.create({
      data: vehicleData
    })

    // Add sample photos for each vehicle
    const photoUrls = [
      `/images/vehicles/${vehicleData.type}-1.jpg`,
      `/images/vehicles/${vehicleData.type}-2.jpg`,
      `/images/vehicles/${vehicleData.type}-3.jpg`
    ]

    for (let i = 0; i < photoUrls.length; i++) {
      await prisma.vehiclePhoto.create({
        data: {
          vehicleId: vehicle.id,
          url: photoUrls[i],
          alt: `${vehicleData.name} - Photo ${i + 1}`,
          isPrimary: i === 0,
          order: i
        }
      })
    }
  }

  console.log('Database seeded successfully!')
  console.log('Admin user created:', admin.username)
  console.log('Company info created:', companyInfo.name)
  console.log('Vehicles created:', vehicles.length)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
