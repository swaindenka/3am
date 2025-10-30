# 🎂 Discord Birthday Bot

A feature-rich Discord bot that automatically celebrates users' birthdays at midnight in their local timezone!

![Node.js](https://img.shields.io/badge/node.js-v20+-green)
![Discord.js](https://img.shields.io/badge/discord.js-v14-blue)
![License](https://img.shields.io/badge/license-MIT-orange)

## ✨ Features

- 🌍 **Timezone Support** - Celebrates birthdays at midnight in each user's local timezone
- 📅 **Automatic Tracking** - Checks birthdays every hour automatically
- 💾 **Persistent Storage** - Uses SQLite database to store birthday data
- 🎉 **Custom Celebrations** - Sends personalized birthday messages with mentions
- 🔄 **Dynamic Status** - Rotating status messages for a lively bot presence
- 🛠️ **Easy Management** - Simple slash commands for adding, viewing, and removing birthdays
- 📊 **Server Overview** - View all registered birthdays in your server

## 📋 Commands

| Command | Description |
|---------|-------------|
| `/birthday-add` | Register your birthday with date and timezone |
| `/birthday-show` | View your registered birthday |
| `/birthday-remove` | Delete your registered birthday |
| `/birthdays` | List all birthdays in the server |
| `/birthday-test` | Test the birthday celebration message |
| `/birthday-help` | Display help information |

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) v20 or higher
- A Discord Bot Token ([Get one here](https://discord.com/developers/applications))
- Basic command line knowledge

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/discord-birthday-bot.git
   cd discord-birthday-bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure the bot**
   
   Create a `.env` file in the root directory:
   ```env
   DISCORD_TOKEN=your_bot_token_here
   ```
   
   Create a `config.json` file:
   ```json
   {
     "clientId": "your_application_id_here"
   }
   ```

4. **Deploy commands to Discord**
   ```bash
   node deploy-commands.js
   ```

5. **Start the bot**
   ```bash
   node bot.js
   ```

## 🔧 Configuration

### Getting Your Bot Token

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application or select an existing one
3. Navigate to the "Bot" section
4. Click "Reset Token" and copy your token
5. Paste it in your `.env` file

### Getting Your Application ID

1. In the Discord Developer Portal, go to "General Information"
2. Copy the "Application ID"
3. Paste it in your `config.json` file

### Bot Permissions

When inviting the bot to your server, make sure it has these permissions:
- Send Messages
- Read Messages/View Channels
- Use Slash Commands
- Mention @everyone, @here, and All Roles

### Invite Link

Generate an invite link in the Discord Developer Portal:
1. Go to "OAuth2" → "URL Generator"
2. Select scopes: `bot` and `applications.commands`
3. Select permissions: `Send Messages`, `View Channels`
4. Copy the generated URL and use it to invite the bot

## 📚 Usage Example

1. Register your birthday:
   ```
   /birthday-add date:15/03/1995 timezone:Europe/Istanbul
   ```

2. View your birthday:
   ```
   /birthday-show
   ```

3. Test the celebration:
   ```
   /birthday-test
   ```

## 🌍 Supported Timezones

The bot supports all IANA timezone identifiers. Common examples:

- 🇹🇷 Turkey: `Europe/Istanbul`
- 🇺🇸 New York: `America/New_York`
- 🇬🇧 London: `Europe/London`
- 🇯🇵 Tokyo: `Asia/Tokyo`
- 🇦🇺 Sydney: `Australia/Sydney`
- 🇩🇪 Berlin: `Europe/Berlin`
- 🇫🇷 Paris: `Europe/Paris`

[View full timezone list](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)

## 🗄️ Database

The bot uses SQLite to store birthday data in a file called `birthdays.db`. This file is automatically created on first run and persists across restarts.

### Database Schema

```sql
CREATE TABLE birthdays (
  user_id TEXT PRIMARY KEY,
  birth_date TEXT NOT NULL,
  timezone TEXT NOT NULL,
  guild_id TEXT NOT NULL
)
```

## 🖥️ Running on Windows Server

### Option 1: Using PM2 (Recommended)

```bash
npm install -g pm2
pm2 start bot.js --name birthday-bot
pm2 startup
pm2 save
```

### Option 2: Using Task Scheduler

1. Create a `start-bot.bat` file:
   ```batch
   @echo off
   cd /d C:\path\to\your\bot
   node bot.js
   pause
   ```

2. Open Task Scheduler and create a new task
3. Set trigger to "At startup"
4. Set action to run your `start-bot.bat` file

### Option 3: Windows Startup Folder

1. Press `Win + R` and type `shell:startup`
2. Create a shortcut to your `start-bot.bat` file
3. Place it in the startup folder

## 📦 Project Structure

```
discord-birthday-bot/
├── bot.js              # Main bot file
├── commands.js         # Command definitions and database functions
├── database.js         # Database initialization
├── deploy-commands.js  # Command deployment script
├── config.json         # Bot configuration
├── .env               # Environment variables (token)
├── package.json       # Dependencies
├── birthdays.db       # SQLite database (auto-generated)
└── README.md          # This file
```

## 🛠️ Dependencies

- **discord.js** - Discord API wrapper
- **node-cron** - Task scheduler for hourly birthday checks
- **better-sqlite3** - SQLite database driver
- **dotenv** - Environment variable management

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 To-Do / Future Features

- [ ] Add custom birthday messages per user
- [ ] Support for multiple servers with different celebration channels
- [ ] Birthday reminder system (1 day before)
- [ ] Birthday role assignment
- [ ] Admin commands for managing birthdays
- [ ] Birthday statistics and leaderboards
- [ ] Support for different date formats
- [ ] Web dashboard for managing birthdays

## 🐛 Troubleshooting

### Bot doesn't respond to commands

1. Make sure you've run `node deploy-commands.js`
2. Restart Discord completely
3. Check bot permissions in your server

### Database errors

```bash
npm rebuild better-sqlite3
```

### Connection issues

- Verify your bot token is correct
- Check your internet connection
- Ensure the bot has proper intents enabled in Discord Developer Portal

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Swain Denka**
- GitHub: 
- Discord: laxmean

## 🙏 Acknowledgments

- [Discord.js Guide](https://discordjs.guide/)
- [Discord Developer Portal](https://discord.com/developers/docs)
- All contributors and users of this bot

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Join our Discord server: [[Invite Link](https://discord.gg/N3AHNsCz4c)]
- Email: swaindenka@proton.me

---

⭐ If you found this project helpful, please give it a star on GitHub!

Made with ❤️ and ☕
