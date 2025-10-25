// Test Telegram API using Node.js https module
const https = require('https')

const BOT_TOKEN = '7578517515:AAEqvCl0jH8pVxL1mdlg--QBUzl0vFiVTt8'
const CHAT_ID = '5260937956'

function testTelegramHttps() {
  console.log('🧪 Testing Telegram API with Node.js https module...')
  
  const postData = JSON.stringify({
    chat_id: CHAT_ID,
    text: '🧪 HTTPS Module Test\n\nThis is a test message using Node.js https module.',
    parse_mode: 'Markdown'
  })

  const options = {
    hostname: 'api.telegram.org',
    port: 443,
    path: `/bot${BOT_TOKEN}/sendMessage`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  }

  const req = https.request(options, (res) => {
    console.log(`Response Status: ${res.statusCode}`)
    
    let data = ''
    res.on('data', (chunk) => {
      data += chunk
    })
    
    res.on('end', () => {
      try {
        const result = JSON.parse(data)
        if (result.ok) {
          console.log('✅ Success! Message sent to Telegram')
          console.log('📱 Check your Telegram chat for the test message')
        } else {
          console.log('❌ Telegram API Error:', result.description)
        }
      } catch (error) {
        console.log('❌ Parse Error:', error.message)
        console.log('Raw Response:', data)
      }
    })
  })

  req.on('error', (error) => {
    console.log('❌ Request Error:', error.message)
  })

  req.write(postData)
  req.end()
}

testTelegramHttps()
