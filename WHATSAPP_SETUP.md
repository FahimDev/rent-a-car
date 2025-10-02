# WhatsApp Integration Setup Guide

## Overview
The WhatsApp notification system automatically sends booking notifications to the company's WhatsApp number. It supports multiple integration methods with fallback options.

## Features
- ✅ Automatic booking notifications
- ✅ Multiple API endpoint support
- ✅ Fallback to WhatsApp web links
- ✅ Notification logging and history
- ✅ Admin management interface
- ✅ Test functionality

## Setup Options

### Option 1: WhatsApp Business API (Meta) - ✅ CONFIGURED
1. **WhatsApp Business API is already set up** with your phone number ID: `818800901316270`
2. **Set environment variables:**
   ```env
   WHATSAPP_API_KEY=EAAVRDgVc94EBPoMiUoPZAeaeyuaKrljdOZCZA2xSSu8ZBwyXN8vJiVi4rI3LrgC6DKVoCOXWqxgACvctmqMZCHzxaQQhJCRbaxnmiIRntsiLCmoZCpZCwnZBMgA4P3siIKrFsd7a1YVB8TE1fkPpZA073RJMZAw23iZA8LuCtxaKiMVWtMz2g1TuKP0n6QZAbROibwXjsEvrd3NGHkGaiujnof3qw6OJz7JSb0vsQ8xA44ioV5sCVQZDZD
   WHATSAPP_PHONE_NUMBER=your_whatsapp_business_phone_number
   ```

### Option 2: Third-party WhatsApp Services
1. **Choose a provider** (Twilio, 360Dialog, etc.)
2. **Set environment variables:**
   ```env
   WHATSAPP_API_KEY=your_provider_api_key
   WHATSAPP_PHONE_NUMBER=your_whatsapp_number
   WHATSAPP_API_URL=your_provider_endpoint
   ```

### Option 3: Webhook Integration
1. **Set up a webhook service** (Zapier, Make.com, etc.)
2. **Set environment variables:**
   ```env
   WHATSAPP_WEBHOOK_URL=your_webhook_endpoint
   ```

### Option 4: Manual Links (Fallback)
- If no API is configured, the system generates WhatsApp web links
- Links are logged in the database for manual sending
- Access via admin notification history

## Configuration Steps

### 1. Set Company WhatsApp Number
```bash
PUT /api/admin/company
{
  "whatsapp": "+8801234567890"
}
```

### 2. Check Configuration Status
```bash
GET /api/admin/whatsapp-config
```

### 3. Test WhatsApp Integration
```bash
POST /api/admin/test-whatsapp
```

### 4. View Notification History
```bash
GET /api/admin/notifications
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `WHATSAPP_API_KEY` | Your WhatsApp API key/token | For API integration |
| `WHATSAPP_PHONE_NUMBER` | Your WhatsApp Business phone number | For API integration |
| `WHATSAPP_API_URL` | Custom API endpoint URL | Optional |
| `WHATSAPP_WEBHOOK_URL` | Webhook endpoint for fallback | Optional |
| `NEXT_PUBLIC_COMPANY_NAME` | Company name for messages | Recommended |

## Message Format
```
🚗 *New Booking Received - Rent-A-Car*

📋 *Booking Details:*
• ID: abc123
• Date: 12/25/2024
• Time: 10:00 AM
• Trip: Single Trip

👤 *Passenger:*
• Name: John Doe
• Phone: +8801234567890

🚙 *Vehicle:*
• Toyota Camry
• Type: sedan
• Capacity: 4 seats

📍 *Locations:*
• Pickup: Dhaka Airport
• Drop-off: Gulshan

🔗 View details: https://yourapp.com/admin/bookings/abc123

_Time: 12/25/2024, 2:30:45 PM_
```

## Troubleshooting

### Common Issues

1. **400 Error from WhatsApp API**
   - Check API credentials
   - Verify phone number format
   - Ensure API endpoint is correct

2. **No notifications sent**
   - Check company WhatsApp number in database
   - Verify environment variables
   - Check notification logs

3. **API not working**
   - System automatically falls back to web links
   - Check notification history for generated links
   - Links can be manually sent via WhatsApp

### Debug Steps

1. **Check configuration:**
   ```bash
   GET /api/admin/whatsapp-config
   ```

2. **Test with sample message:**
   ```bash
   POST /api/admin/test-whatsapp
   ```

3. **View notification logs:**
   ```bash
   GET /api/admin/notifications?type=whatsapp
   ```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/whatsapp-config` | GET | Check configuration status |
| `/api/admin/whatsapp-config` | POST | Test WhatsApp integration |
| `/api/admin/company` | GET | Get company info |
| `/api/admin/company` | PUT | Update company WhatsApp |
| `/api/admin/notifications` | GET | View notification history |
| `/api/admin/notifications` | POST | Send manual notification |

## Support

If you need help setting up WhatsApp integration:

1. Check the configuration status endpoint
2. Review the notification logs
3. Test with the test endpoint
4. Use the fallback web link method if needed

The system is designed to work even without a WhatsApp API - it will generate web links that can be manually sent.
