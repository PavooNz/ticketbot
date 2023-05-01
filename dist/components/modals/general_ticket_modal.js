"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.getModal = exports.getCustomId = void 0;
const discord_js_1 = require("discord.js");
const settings_model_1 = __importDefault(require("../../models/settings_model"));
const ticket_model_1 = __importDefault(require("../../models/ticket_model"));
const getCustomId = () => {
    return 'general_ticket_modal';
};
exports.getCustomId = getCustomId;
const getModal = () => {
    return new discord_js_1.ModalBuilder()
        .setCustomId((0, exports.getCustomId)())
        .setTitle('🎫 General Ticket')
        .addComponents(new discord_js_1.ActionRowBuilder()
        .addComponents(new discord_js_1.TextInputBuilder()
        .setCustomId('input-details')
        .setLabel('Short details')
        .setStyle(discord_js_1.TextInputStyle.Short)));
};
exports.getModal = getModal;
const execute = (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
    /* Initial response */
    yield interaction.deferReply({
        ephemeral: true
    });
    /* Get first doc */
    const settings = yield settings_model_1.default.findOne();
    /* Settings not exist */
    if (settings == null) {
        yield interaction.editReply({
            embeds: [
                new discord_js_1.EmbedBuilder()
                    .setColor('#E74C3C')
                    .setTitle('❌ Oops')
                    .setDescription('Unable to create ticket. Settings not found.' +
                    '\nPlease contact staff.')
            ]
        });
        return;
    }
    /* Get category channel */
    const ticketCategoryChannel = client.channels.cache.get(settings.category_channel_id);
    /* Category channel not found */
    if (ticketCategoryChannel == null) {
        yield interaction.editReply({
            embeds: [
                new discord_js_1.EmbedBuilder()
                    .setColor('#E74C3C')
                    .setTitle('❌ Oops')
                    .setDescription('Unable to create ticket. Category channel not found.' +
                    '\nPlease contact staff.')
            ]
        });
        return;
    }
    /* Category channel not category */
    if (ticketCategoryChannel.type != discord_js_1.ChannelType.GuildCategory) {
        yield interaction.editReply({
            embeds: [
                new discord_js_1.EmbedBuilder()
                    .setColor('#E74C3C')
                    .setTitle('❌ Oops')
                    .setDescription('Unable to create ticket. Category channel is not a category channel.' +
                    '\nPlease contact staff.')
            ]
        });
        return;
    }
    /* Get text channel */
    const ticketTextChannel = client.channels.cache.get(settings.text_channel_id);
    /* Text channel not found */
    if (ticketTextChannel == null) {
        yield interaction.editReply({
            embeds: [
                new discord_js_1.EmbedBuilder()
                    .setColor('#E74C3C')
                    .setTitle('❌ Oops')
                    .setDescription('Unable to create ticket. Ticket text channel not found.' +
                    '\nPlease contact staff.')
            ]
        });
        return;
    }
    /* Text channel not text */
    if (ticketTextChannel.type != discord_js_1.ChannelType.GuildText) {
        yield interaction.editReply({
            embeds: [
                new discord_js_1.EmbedBuilder()
                    .setColor('#E74C3C')
                    .setTitle('❌ Oops')
                    .setDescription('Unable to create ticket. Ticket text channel is not a text channel.' +
                    '\nPlease contact staff.')
            ]
        });
        return;
    }
    /* Find open ticket by guild & user */
    const openTicket = yield ticket_model_1.default.findOne({
        guild_id: interaction.guild.id,
        user_id: interaction.user.id,
        closed: false
    });
    /* Open ticket exist */
    if (openTicket != null) {
        /* Find channel */
        const openTicketChannel = client.channels.cache.get(openTicket.channel_id);
        /* Ticket channel exist */
        if (openTicketChannel != null) {
            yield interaction.editReply({
                embeds: [
                    new discord_js_1.EmbedBuilder()
                        .setColor('#E74C3C')
                        .setTitle('❌ Oops')
                        .setDescription('Sorry but you already have an opened ticket.' +
                        `\nYou can view it here ${openTicketChannel.toString()}.`)
                ]
            });
            return;
        }
        /* Mark ticket as closed if ticket channel no longer exist */
        yield ticket_model_1.default.findByIdAndUpdate(openTicket._id, { closed: true }, { new: true });
    }
    /* Get inputs */
    const inputDetails = interaction.fields.getTextInputValue('input-details');
    /* Create new channel */
    const newTicketChannel = yield interaction.guild.channels.create({
        name: 'ticket-' + interaction.user.username,
        parent: settings.category_channel_id,
        permissionOverwrites: [
            {
                id: interaction.guild.roles.everyone,
                deny: [
                    discord_js_1.PermissionFlagsBits.ViewChannel
                ]
            },
            {
                id: interaction.user,
                allow: [
                    discord_js_1.PermissionFlagsBits.ViewChannel,
                    discord_js_1.PermissionFlagsBits.SendMessages,
                    discord_js_1.PermissionFlagsBits.ReadMessageHistory
                ]
            }
        ]
    });
    /* Send message in newTicketChannel */
    const newTicketMessage = yield newTicketChannel.send({
        embeds: [
            new discord_js_1.EmbedBuilder()
                .setColor('#57F287')
                .setTitle('Ticket Created')
                .setDescription(`Thank you for contacting support ${interaction.user.toString()}.` +
                '\nPlease describe your issue while waiting for staff.')
                .addFields({
                name: 'Category',
                value: '🎫 General Ticket'
            }, {
                name: 'Details',
                value: inputDetails
            })
        ],
        components: [
            new discord_js_1.ActionRowBuilder()
                .addComponents(client.buttons.get('close_ticket_button').getButton())
        ]
    });
    /* Post in text channel */
    const newMessage = yield ticketTextChannel.send({
        embeds: [
            new discord_js_1.EmbedBuilder()
                .setColor('#57F287')
                .setTitle('New Ticket')
                .setDescription(`New ticket from ${interaction.user.toString()}.`)
                .addFields({
                name: 'Category',
                value: '🎫 General Ticket'
            }, {
                name: 'Details',
                value: inputDetails
            })
        ],
        components: [
            new discord_js_1.ActionRowBuilder()
                .addComponents(client.buttons.get('claim_ticket_button').getButton())
        ]
    });
    /* Save in database */
    const newTicket = new ticket_model_1.default({
        category: 'general_ticket',
        guild_id: interaction.guild.id,
        channel_id: newTicketChannel.id,
        message_id: newTicketMessage.id,
        ticket_message_id: newMessage.id,
        user_id: interaction.user.id
    });
    yield newTicket.save();
    /* Success */
    yield interaction.editReply({
        embeds: [
            new discord_js_1.EmbedBuilder()
                .setColor('#57F287')
                .setTitle('Ticket Created')
                .setDescription(`Hello ${interaction.user.toString()}, your ticket has been created.` +
                `\nYou can view it here ${newTicketChannel.toString()}.`)
        ]
    });
});
exports.execute = execute;
