// Direct test of Telegram API
const BOT_TOKEN = '7578517515:AAEqvCl0jH8pVxL1mdlg--QBUzl0vFiVTt8'
const CHAT_ID = '5260937956'

async function testTelegram() {
  console.log('🧪 Testing Telegram API directly...')
  console.log(`Bot Token: ${BOT_TOKEN.substring(0, 10)}...`)
  console.log(`Chat ID: ${CHAT_ID}`)
  
  try {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: '🧪 Direct API Test\n\nThis is a test message sent directly to verify Telegram integration.',
        parse_mode: 'Markdown'
      })
    })

    console.log(`Response Status: ${response.status}`)
    
    if (response.ok) {
      const result = await response.json()
      console.log('✅ Success!', result)
    } else {
      const error = await response.text()
      console.log('❌ Error:', error)
    }
  } catch (error) {
    console.log('❌ Network Error:', error.message)
  }
}

testTelegram()
