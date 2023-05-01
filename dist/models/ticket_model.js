"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    category: { type: String, required: true },
    guild_id: { type: String, required: true },
    channel_id: { type: String, required: true },
    message_id: { type: String, required: true },
    ticket_message_id: { type: String, required: true },
    user_id: { type: String, required: true },
    staff_id: { type: String, default: null },
    closed: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    created_at: { type: Date, default: new Date() }
});
const TicketModel = (0, mongoose_1.model)('Ticket', schema);
exports.default = TicketModel;
