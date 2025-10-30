require('dotenv').config();
const { REST, Routes } = require('discord.js');
const { clientId } = require('./config.json');
const { commands } = require('./commands');

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('Komutlar kaydediliyor...');
    console.log(`Application ID: ${clientId}`);
    console.log(`Komut sayısı: ${commands.length}`);

    const data = await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands },
    );

    console.log(`✅ ${data.length} komut başarıyla kaydedildi!`);
  } catch (error) {
    console.error('❌ Hata detayı:', error);
    
    if (error.code === 'ECONNRESET') {
      console.log('\n💡 Çözüm önerileri:');
      console.log('1. İnternet bağlantınızı kontrol edin');
      console.log('2. VPN kullanıyorsanız kapatın');
      console.log('3. Birkaç saniye bekleyip tekrar deneyin');
      console.log('4. Application ID doğru mu kontrol edin');
    }
  }
})();