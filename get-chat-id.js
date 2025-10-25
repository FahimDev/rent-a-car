// Script to help get the correct Telegram Chat ID
const https = require('https')

const BOT_TOKEN = '7578517515:AAEqvCl0jH8pVxL1mdlg--QBUzl0vFiVTt8'

console.log('🔍 Getting Telegram Bot Updates...')
console.log('📱 Make sure you have:')
console.log('   1. Started a chat with your bot')
console.log('   2. Sent at least one message to the bot')
console.log('   3. Wait a moment and then run this script\n')

function getUpdates() {
  const options = {
    hostname: 'api.telegram.org',
    port: 443,
    path: `/bot${BOT_TOKEN}/getUpdates`,
    method: 'GET'
  }

  const req = https.request(options, (res) => {
    let data = ''
    res.on('data', (chunk) => {
      data += chunk
    })
    
    res.on('end', () => {
      try {
        const result = JSON.parse(data)
        if (result.ok && result.result.length > 0) {
          console.log('✅ Found chat messages!')
          console.log('\n📋 Available Chat IDs:')
          
          const chatIds = new Set()
          result.result.forEach((update, index) => {
            if (update.message && update.message.chat) {
              const chat = update.message.chat
              chatIds.add(chat.id)
              console.log(`   ${index + 1}. Chat ID: ${chat.id}`)
              console.log(`      Type: ${chat.type}`)
              console.log(`      From: ${chat.first_name || 'Unknown'}`)
              console.log(`      Username: @${chat.username || 'N/A'}`)
              console.log('')
            }
          })
          
          if (chatIds.size > 0) {
            console.log('🎯 Use one of these Chat IDs in your .env.local file:')
            chatIds.forEach(id => {
              console.log(`   TELEGRAM_CHAT_ID=${id}`)
            })
          }
        } else {
          console.log('❌ No messages found')
          console.log('📱 Please:')
          console.log('   1. Open Telegram')
          console.log('   2. Search for your bot')
          console.log('   3. Start a chat and send any message')
          console.log('   4. Run this script again')
        }
      } catch (error) {
        console.log('❌ Error parsing response:', error.message)
        console.log('Raw response:', data)
      }
    })
  })

  req.on('error', (error) => {
    console.log('❌ Request Error:', error.message)
  })

  req.end()
}

getUpdates()
