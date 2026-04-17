
const {
  REST,
  Routes,
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require('discord.js');

const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Testeaza daca botul raspunde'),

  new SlashCommandBuilder()
    .setName('help')
    .setDescription('Afiseaza lista comenzilor'),

  new SlashCommandBuilder()
    .setName('server')
    .setDescription('Afiseaza informatii despre server'),

  new SlashCommandBuilder()
    .setName('verify')
    .setDescription('Trimite panoul de verificare cu buton'),

  new SlashCommandBuilder()
    .setName('ticketpanel')
    .setDescription('Trimite panoul de tickete cu categorii')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  new SlashCommandBuilder()
    .setName('say')
    .setDescription('Botul trimite un mesaj')
    .addStringOption(option =>
      option
        .setName('mesaj')
        .setDescription('Mesajul pe care il va trimite botul')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Baneaza un membru')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('Membrul')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('motiv')
        .setDescription('Motivul banului')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Da kick unui membru')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('Membrul')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('motiv')
        .setDescription('Motivul kickului')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Da timeout unui membru')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('Membrul')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName('minute')
        .setDescription('Cate minute')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(10080)
    )
    .addStringOption(option =>
      option
        .setName('motiv')
        .setDescription('Motivul timeout-ului')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  new SlashCommandBuilder()
    .setName('untimeout')
    .setDescription('Scoate timeout-ul unui membru')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('Membrul')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Sterge mesaje')
    .addIntegerOption(option =>
      option
        .setName('numar')
        .setDescription('Numarul de mesaje de sters (1-100)')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Da warn unui membru')
    .addUserOption(option =>
      option
        .setName('user')
        .setDescription('Membrul')
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName('motiv')
        .setDescription('Motivul warn-ului')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Inregistrez comenzile...');

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log('Comenzile au fost inregistrate.');
  } catch (error) {
    console.error(error);
  }
})();
