#!/usr/bin/env node

/**
 * WhatsApp Integration Test Script
 * Tests the WhatsApp Business API integration
 */

const BASE_URL = process.env.TEST_BASE_URL || 'https://my-next-app-462.pages.dev'

async function testWhatsAppConfig() {
  console.log('🔍 Testing WhatsApp configuration...')
  
  try {
    // Get admin token first
    const loginResponse = await fetch(`${BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: process.env.ADMIN_USERNAME || 'admin',
        password: process.env.ADMIN_PASSWORD || 'admin123'
      })
    })
    
    const loginData = await loginResponse.json()
    if (!loginData.token) {
      console.error('❌ Failed to get admin token')
      return false
    }
    
    console.log('✅ Admin token obtained')
    
    // Check WhatsApp configuration
    const configResponse = await fetch(`${BASE_URL}/api/admin/whatsapp-config`, {
      headers: {
        'Authorization': `Bearer ${loginData.token}`
      }
    })
    
    const configData = await configResponse.json()
    console.log('📊 WhatsApp Configuration:')
    console.log(JSON.stringify(configData, null, 2))
    
    return configData.success
  } catch (error) {
    console.error('❌ Configuration test failed:', error.message)
    return false
  }
}

async function testWhatsAppMessage() {
  console.log('\n📱 Testing WhatsApp message sending...')
  
  try {
    // Get admin token
    const loginResponse = await fetch(`${BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: process.env.ADMIN_USERNAME || 'admin',
        password: process.env.ADMIN_PASSWORD || 'admin123'
      })
    })
    
    const loginData = await loginResponse.json()
    if (!loginData.token) {
      console.error('❌ Failed to get admin token')
      return false
    }
    
    // Send test WhatsApp message
    const testResponse = await fetch(`${BASE_URL}/api/admin/test-whatsapp`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${loginData.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        testPhone: '+8801234567890', // Replace with your test number
        testMessage: 'Test message from Rent-A-Car system'
      })
    })
    
    const testData = await testResponse.json()
    console.log('📋 Test Result:')
    console.log(JSON.stringify(testData, null, 2))
    
    if (testData.success) {
      console.log('✅ WhatsApp test message sent successfully!')
    } else {
      console.log('❌ WhatsApp test failed')
    }
    
    return testData.success
  } catch (error) {
    console.error('❌ WhatsApp test failed:', error.message)
    return false
  }
}

async function testBookingNotification() {
  console.log('\n🚗 Testing booking notification...')
  
  try {
    // Create a test booking
    const bookingResponse = await fetch(`${BASE_URL}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookingDate: new Date().toISOString().split('T')[0],
        pickupTime: '10:00',
        tripType: 'single',
        pickupLocation: 'Test Location',
        passengerName: 'Test User',
        passengerPhone: '+8801234567890',
        vehicleId: 'test-vehicle-id'
      })
    })
    
    const bookingData = await bookingResponse.json()
    console.log('📋 Booking Result:')
    console.log(JSON.stringify(bookingData, null, 2))
    
    if (bookingData.success) {
      console.log('✅ Test booking created successfully!')
      console.log('📱 WhatsApp notification should have been sent automatically')
    } else {
      console.log('❌ Test booking failed')
    }
    
    return bookingData.success
  } catch (error) {
    console.error('❌ Booking test failed:', error.message)
    return false
  }
}

async function runTests() {
  console.log('🚀 Starting WhatsApp Integration Tests\n')
  
  // Test 1: Configuration check
  const configOk = await testWhatsAppConfig()
  
  if (!configOk) {
    console.log('\n❌ Configuration test failed. Please check your setup.')
    process.exit(1)
  }
  
  // Test 2: WhatsApp message test
  const messageOk = await testWhatsAppMessage()
  
  // Test 3: Booking notification test
  const bookingOk = await testBookingNotification()
  
  console.log('\n🏁 Tests completed!')
  console.log('\n📝 Results:')
  console.log(`Configuration: ${configOk ? '✅' : '❌'}`)
  console.log(`Message Test: ${messageOk ? '✅' : '❌'}`)
  console.log(`Booking Test: ${bookingOk ? '✅' : '❌'}`)
  
  if (configOk && messageOk && bookingOk) {
    console.log('\n🎉 All tests passed! WhatsApp integration is working correctly.')
  } else {
    console.log('\n⚠️ Some tests failed. Check the logs above for details.')
  }
}

// Run the tests
runTests().catch(console.error)
