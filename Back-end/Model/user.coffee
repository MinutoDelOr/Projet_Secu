mongoose = require 'mongoose'

sites = new mongoose.Schema(
  URL: String,
  login: String,
  password: String,
  date: {
    type: Date,
    default:Date.now
  }
)

mongoose.model "sites", sites
