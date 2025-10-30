require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const cron = require('node-cron');
const { saveBirthday, deleteBirthday, getBirthday, getAllBirthdays } = require('./commands');
const db = require('./database');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ]
});

client.once('clientReady', () => {
  console.log(`✅ Bot is ready! Logged in as ${client.user.tag}`);
  
  // Status mesajları listesi
  const statuses = [
    '🎂 Celebrating birthdays!',
    '🎉 Planning surprise parties',
    '🎈 Counting down to celebrations',
    '🕯️ Making wishes come true',
    '🎁 Wrapping digital presents',
    '🍰 Baking virtual cakes',
    '🎊 Spreading birthday joy',
    '📅 Tracking special days',
    '✨ Creating magical moments',
    '🥳 Party mode activated!',
    '🎵 Singing Happy Birthday',
    '🌟 Making birthdays special',
    '💝 Sharing love and wishes',
    '🎭 Preparing celebrations',
    '🪅 Hanging decorations'
  ];
  
  let currentIndex = 0;
  
  // İlk status'u ayarla
  client.user.setPresence({
    activities: [{
      name: statuses[0],
      type: 4 // 4 = Custom status (Discord'da "Custom Status" görünür)
    }],
    status: 'online' // online, idle, dnd, invisible
  });
  
  // Her 30 saniyede bir status değiştir
  setInterval(() => {
    currentIndex = (currentIndex + 1) % statuses.length;
    client.user.setPresence({
      activities: [{
        name: statuses[currentIndex],
        type: 4
      }],
      status: 'online'
    });
  }, 30000); // 30000 ms = 30 saniye
  
  // Check birthdays every hour
  cron.schedule('0 * * * *', () => {
    console.log('🔍 Checking birthdays...');
    checkBirthdays();
  });
  
  // Check on startup
  checkBirthdays();
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'birthday-add') {
    const date = interaction.options.getString('date');
    const timezone = interaction.options.getString('timezone');
    
    // Validate date format
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(date)) {
      return interaction.reply({ 
        content: '❌ Invalid format! Please use DD/MM/YYYY format (e.g. 15/03/1995)', 
        ephemeral: true 
      });
    }

    // Validate timezone
    try {
      new Date().toLocaleString('en-US', { timeZone: timezone });
    } catch (error) {
      return interaction.reply({
        content: '❌ Invalid timezone! Example valid timezones:\n' +
                 '• Europe/Istanbul\n• America/New_York\n• Asia/Tokyo\n• Europe/London\n\n' +
                 'Full list: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones',
        ephemeral: true
      });
    }

    saveBirthday(interaction.user.id, date, timezone, interaction.guildId);
    await interaction.reply({ 
      content: `✅ Your birthday has been registered: ${date} (${timezone})`, 
      ephemeral: true 
    });
  }

  if (commandName === 'birthday-remove') {
    const birthday = getBirthday(interaction.user.id);
    if (!birthday) {
      return interaction.reply({ 
        content: '❌ No registered birthday found.', 
        ephemeral: true 
      });
    }
    
    deleteBirthday(interaction.user.id);
    await interaction.reply({ 
      content: '✅ Your birthday has been removed.', 
      ephemeral: true 
    });
  }
  if (commandName === 'birthday-test') {
    const channel = interaction.channel;
    
    await interaction.reply({ 
      content: '🧪 Sending test message...', 
      ephemeral: true 
    });
    
    await channel.send(`🎉🎂 <@${interaction.user.id}> Happy Birthday! 🎂🎉`);
  }
  if (commandName === 'birthday-show') {
    const birthday = getBirthday(interaction.user.id);
    if (!birthday) {
      return interaction.reply({ 
        content: '❌ No registered birthday found.', 
        ephemeral: true 
      });
    }
    
    await interaction.reply({ 
      content: `🎂 Your birthday: ${birthday.birth_date} (${birthday.timezone})`, 
      ephemeral: true 
    });
  }
    if (commandName === 'birthday-help') {
    const helpMessage = `
        🎂 **Birthday Bot Help**

        **Commands:**
        - \`/birthday-add\` - Register your birthday
        - **date**: Your birth date (DD/MM/YYYY format, e.g. 15/03/1995)
        - **timezone**: Your timezone (e.g. Europe/Istanbul, America/New_York)

        - \`/birthday-show\` - View your registered birthday

        - \`/birthday-remove\` - Delete your registered birthday

        - \`/birthdays\` - See all birthdays registered in this server

        - \`/birthday-test\` - Test the birthday celebration message

        - \`/birthday-help\` - Show this help message

        **How it works:**
        The bot will automatically send a birthday celebration message in the server's default channel when it's midnight (00:00) in your timezone!

        **Common Timezones:**
        🇹🇷 Turkey: \`Europe/Istanbul\`
        🇺🇸 New York: \`America/New_York\`
        🇬🇧 London: \`Europe/London\`
        🇯🇵 Tokyo: \`Asia/Tokyo\`
        🇦🇺 Sydney: \`Australia/Sydney\`

        **Full timezone list:** https://en.wikipedia.org/wiki/List_of_tz_database_time_zones

        **Example:**
        \`/birthday-add date:15/03/1995 timezone:Europe/Istanbul\`
                            `
    ;

    await interaction.reply({ 
      content: helpMessage, 
      ephemeral: true 
    });
  }

  if (commandName === 'birthdays') {
    const birthdays = getAllBirthdays(interaction.guildId);
    if (birthdays.length === 0) {
      return interaction.reply({ 
        content: '❌ No birthdays registered in this server.', 
        ephemeral: true 
      });
    }

    let message = '🎉 **Server Birthdays:**\n\n';
    for (const bd of birthdays) {
      try {
        const user = await client.users.fetch(bd.user_id);
        message += `• ${user.username}: ${bd.birth_date}\n`;
      } catch (error) {
        message += `• Unknown user: ${bd.birth_date}\n`;
      }
    }

    await interaction.reply({ content: message, ephemeral: true });
  }
});

function checkBirthdays() {
  const stmt = db.prepare('SELECT * FROM birthdays');
  const birthdays = stmt.all();

  birthdays.forEach(async (birthday) => {
    try {
      // Get current time in user's timezone
      const userNow = new Date().toLocaleString('en-US', { 
        timeZone: birthday.timezone,
        hour12: false 
      });
      
      const userDate = new Date(userNow);
      const userHour = userDate.getHours();
      
      // Celebrate if it's between 00:00 and 00:59 in user's timezone
      if (userHour === 0) {
        const [day, month] = birthday.birth_date.split('/');
        const userDay = userDate.getDate();
        const userMonth = userDate.getMonth() + 1;
        
        // Is it their birthday today?
        if (parseInt(day) === userDay && parseInt(month) === userMonth) {
          const guild = await client.guilds.fetch(birthday.guild_id);
          const channel = guild.systemChannel || guild.channels.cache.find(ch => ch.isTextBased());
          
          if (channel) {
            await channel.send(`🎉🎂 <@${birthday.user_id}> Happy Birthday! 🎂🎉`);
            console.log(`✅ Birthday message sent for ${birthday.user_id} (${birthday.timezone})`);
          }
        }
      }
    } catch (error) {
      console.error(`❌ Birthday check failed for ${birthday.user_id}:`, error);
    }
  });
}

// Error handling
client.on('error', (error) => {
  console.error('❌ Bot error:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled error:', error);
});

client.login(process.env.DISCORD_TOKEN);