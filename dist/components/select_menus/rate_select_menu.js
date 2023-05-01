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
exports.execute = exports.getSelectMenu = exports.getCustomId = void 0;
const discord_js_1 = require("discord.js");
const ticket_model_1 = __importDefault(require("../../models/ticket_model"));
const getCustomId = () => {
    return 'rate_select_menu';
};
exports.getCustomId = getCustomId;
const getSelectMenu = () => {
    return new discord_js_1.SelectMenuBuilder()
        .setCustomId((0, exports.getCustomId)())
        .setPlaceholder('Click here to rate our support')
        .addOptions({
        label: '🥰 Love it',
        value: '5',
    }, {
        label: '😀 Great',
        value: '4',
    }, {
        label: '🙂 Good',
        value: '3',
    }, {
        label: '☹️ Bad',
        value: '2',
    }, {
        label: '😡 Super Bad',
        value: '1',
    });
};
exports.getSelectMenu = getSelectMenu;
const execute = (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    /* Initial response */
    yield interaction.deferReply({
        ephemeral: true
    });
    /* Find ticket */
    const ticket = yield ticket_model_1.default.findOne({
        channel_id: (_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.id
    });
    /* Ticket exist */
    if (ticket != null) {
        /* Update rating */
        yield ticket_model_1.default.findByIdAndUpdate(ticket._id, { rating: interaction.values[0] }, { new: true });
    }
    /* Delete channel */
    (_b = interaction.channel) === null || _b === void 0 ? void 0 : _b.delete();
});
exports.execute = execute;
