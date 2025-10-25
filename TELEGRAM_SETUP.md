# Telegram Bot Setup Guide

This guide explains how to set up Telegram notifications for your car rental application.

## Prerequisites

- Telegram account
- Admin access to your application

## Step 1: Create a Telegram Bot

1. Open Telegram and search for `@BotFather`
2. Start a chat with BotFather
3. Send `/newbot` command
4. Follow the prompts to create your bot:
   - Choose a name for your bot (e.g., "Rent-A-Car Notifications")
   - Choose a username for your bot (e.g., "rentacar_notifications_bot")
5. BotFather will provide you with a **Bot Token** - save this securely

## Step 2: Get Your Chat ID

### Method 1: Using @userinfobot
1. Search for `@userinfobot` on Telegram
2. Start a chat with the bot
3. Send any message
4. The bot will reply with your Chat ID

### Method 2: Using Telegram Web
1. Open [Telegram Web](https://web.telegram.org)
2. Open the developer console (F12)
3. Go to Network tab
4. Send a message to your bot
5. Look for a request to `getUpdates` or similar
6. Find the `chat.id` in the response

## Step 3: Configure Environment Variables

Add these environment variables to your `.env.local` file:

```env
# Telegram Configuration
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
```

## Step 4: Configure in Admin Panel

1. Log in to your admin panel
2. Go to **Notification Settings** (from Quick Actions)
3. Enable Telegram notifications
4. Enter your Bot Token and Chat ID
5. Test the configuration using the "Test" button

## Step 5: Test Notifications

1. Create a test booking through your application
2. Check if you receive the notification in Telegram
3. Use the "Validate" button in admin settings to verify configuration

## Notification Features

### Booking Confirmations
- New booking notifications with passenger details
- Vehicle information and trip details
- Total amount and contact information

### Booking Updates
- Status changes (confirmed, completed, cancelled)
- Modified booking details

### Test Messages
- Send test notifications to verify configuration
- Validate bot token and chat ID

## Troubleshooting

### Common Issues

1. **"Invalid token" error**
   - Verify your bot token is correct
   - Ensure the token starts with a number and colon

2. **"Chat not found" error**
   - Verify your chat ID is correct
   - Make sure you've sent at least one message to the bot

3. **No notifications received**
   - Check if Telegram notifications are enabled in admin settings
   - Verify the bot is not blocked
   - Test with the "Test" button first

### Bot Commands

Your bot will automatically respond to these commands:
- `/start` - Welcome message
- `/help` - List available commands

## Security Notes

- Keep your bot token secure and never share it publicly
- Use environment variables for configuration
- Regularly rotate your bot token if compromised
- Monitor bot usage for any suspicious activity

## Advanced Configuration

### Custom Messages
You can customize notification messages by modifying the `TelegramNotificationService.ts` file.

### Multiple Chat IDs
To send notifications to multiple Telegram chats, you can modify the service to support multiple chat IDs.

### Bot Permissions
Your bot only needs to send messages. No special permissions are required.

## Support

If you encounter issues:
1. Check the application logs for error messages
2. Verify your bot token and chat ID
3. Test with the built-in validation tools
4. Contact your system administrator
