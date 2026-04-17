const {
  Client,
  GatewayIntentBits,
  Events,
  PermissionsBitField,
  PermissionFlagsBits,
  ChannelType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
} = require('discord.js');

const STAFF_ROLE = 'Staff';
const TICKET_CHANNEL = 'ticket';
const TICKET_CATEGORY = 'TICKETS';

const warns = new Map();

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once(Events.ClientReady, async () => {
  console.log(`Bot online`);

  const guild = client.guilds.cache.first();
  const channel = guild.channels.cache.find(c => c.name === TICKET_CHANNEL);

  const button = new ButtonBuilder()
    .setCustomId('ticket')
    .setLabel('🎫 Creeaza tichet')
    .setStyle(ButtonStyle.Primary);

  await channel.send({
    content: 'Apasa pentru a crea un tichet',
    components: [new ActionRowBuilder().addComponents(button)],
  });
});

function getStaff(guild) {
  return guild.roles.cache.find(r => r.name === STAFF_ROLE);
}

async function getCategory(guild) {
  let cat = guild.channels.cache.find(c => c.name === TICKET_CATEGORY);
  if (!cat) {
    cat = await guild.channels.create({
      name: TICKET_CATEGORY,
      type: ChannelType.GuildCategory,
    });
  }
  return cat;
}

client.on(Events.InteractionCreate, async interaction => {
  try {
    if (interaction.isChatInputCommand()) {
      const cmd = interaction.commandName;

      if (cmd === 'ping')
        return interaction.reply('pong 🏓');

      if (cmd === 'ban') {
        if (!interaction.memberPermissions.has(PermissionsBitField.Flags.BanMembers))
          return interaction.reply({ content: 'Nu ai permisiune', ephemeral: true });

        const user = interaction.options.getUser('user');
        const m = await interaction.guild.members.fetch(user.id);
        await m.ban();
        return interaction.reply(`🔨 ${user.tag} a fost banat`);
      }

      if (cmd === 'kick') {
        const user = interaction.options.getUser('user');
        const m = await interaction.guild.members.fetch(user.id);
        await m.kick();
        return interaction.reply(`👢 ${user.tag} a primit kick`);
      }

      if (cmd === 'mute') {
        const user = interaction.options.getUser('user');
        const min = interaction.options.getInteger('minute');
        const m = await interaction.guild.members.fetch(user.id);

        await m.timeout(min * 60000);
        return interaction.reply(`🔇 ${user.tag} a primit mute`);
      }

      if (cmd === 'unmute') {
        const user = interaction.options.getUser('user');
        const m = await interaction.guild.members.fetch(user.id);

        await m.timeout(null);
        return interaction.reply(`🔊 ${user.tag} nu mai are mute`);
      }

      if (cmd === 'sterge') {
        const n = interaction.options.getInteger('numar');
        await interaction.channel.bulkDelete(n);
        return interaction.reply({ content: '🧹 Mesaje sterse', ephemeral: true });
      }

      if (cmd === 'avertisment') {
        const user = interaction.options.getUser('user');
        const nr = warns.get(user.id) || 0;
        warns.set(user.id, nr + 1);

        return interaction.reply(`⚠️ ${user.tag} are ${nr + 1} avertismente`);
      }
    }

    if (interaction.isButton()) {
      if (interaction.customId === 'ticket') {
        const menu = new StringSelectMenuBuilder()
          .setCustomId('tip')
          .addOptions([
            { label: 'Support', value: 'support' },
            { label: 'Market', value: 'market' },
            { label: 'Shop', value: 'shop' },
            { label: 'Bug', value: 'bug' },
            { label: 'Report', value: 'report' },
          ]);

        return interaction.reply({
          content: 'Alege tipul tichetului:',
          components: [new ActionRowBuilder().addComponents(menu)],
          ephemeral: true,
        });
      }

      if (interaction.customId === 'inchide') {
        await interaction.reply('Se inchide...');
        setTimeout(() => interaction.channel.delete(), 2000);
      }
    }

    if (interaction.isStringSelectMenu()) {
      const type = interaction.values[0];
      const guild = interaction.guild;
      const user = interaction.user;
      const staff = getStaff(guild);
      const cat = await getCategory(guild);

      const ch = await guild.channels.create({
        name: `${type}-${user.username}`,
        type: ChannelType.GuildText,
        parent: cat.id,
        permissionOverwrites: [
          { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] },
          { id: user.id, allow: [PermissionFlagsBits.ViewChannel] },
          { id: interaction.client.user.id, allow: [PermissionFlagsBits.ViewChannel] },
          staff && { id: staff.id, allow: [PermissionFlagsBits.ViewChannel] },
        ].filter(Boolean),
      });

      const btn = new ButtonBuilder()
        .setCustomId('inchide')
        .setLabel('❌ Inchide')
        .setStyle(ButtonStyle.Danger);

      await ch.send({
        content: `Ticket ${type} ${user}`,
        components: [new ActionRowBuilder().addComponents(btn)],
      });

      return interaction.update({
        content: `✅ Tichet creat: ${ch}`,
        components: [],
      });
    }
  } catch (e) {
    console.log(e);
  }
});

client.login(process.env.TOKEN);
