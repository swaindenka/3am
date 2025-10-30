const { SlashCommandBuilder } = require('discord.js');
const db = require('./database');

const commands = [
  new SlashCommandBuilder()
    .setName('birthday-add')
    .setDescription('Register your birthday')
    .addStringOption(option =>
      option.setName('date')
        .setDescription('Your birth date (DD/MM/YYYY format, e.g. 15/03/1995)')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('timezone')
        .setDescription('Your timezone (e.g. Europe/Istanbul, America/New_York)')
        .setRequired(true)),
  
  new SlashCommandBuilder()
    .setName('birthday-remove')
    .setDescription('Delete your registered birthday'),
  
  new SlashCommandBuilder()
    .setName('birthday-show')
    .setDescription('Show your registered birthday'),
  
  new SlashCommandBuilder()
    .setName('birthdays')
    .setDescription('List all birthdays in the server'),
  
  new SlashCommandBuilder()
    .setName('birthday-test')
    .setDescription('Test the birthday celebration message'),
  
  new SlashCommandBuilder()
    .setName('birthday-help')
    .setDescription('Show help information about birthday commands')
];

function saveBirthday(userId, birthDate, timezone, guildId) {
  const stmt = db.prepare('INSERT OR REPLACE INTO birthdays (user_id, birth_date, timezone, guild_id) VALUES (?, ?, ?, ?)');
  stmt.run(userId, birthDate, timezone, guildId);
}

function deleteBirthday(userId) {
  const stmt = db.prepare('DELETE FROM birthdays WHERE user_id = ?');
  stmt.run(userId);
}

function getBirthday(userId) {
  const stmt = db.prepare('SELECT * FROM birthdays WHERE user_id = ?');
  return stmt.get(userId);
}

function getAllBirthdays(guildId) {
  const stmt = db.prepare('SELECT * FROM birthdays WHERE guild_id = ?');
  return stmt.all(guildId);
}

module.exports = { commands, saveBirthday, deleteBirthday, getBirthday, getAllBirthdays };