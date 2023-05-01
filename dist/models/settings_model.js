"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    category_channel_id: { type: String, default: null },
    text_channel_id: { type: String, default: null }
});
const SettingsModel = (0, mongoose_1.model)('Settings', schema);
exports.default = SettingsModel;
