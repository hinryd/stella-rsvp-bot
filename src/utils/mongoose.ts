import { Schema, model } from 'mongoose'

const eventSchema = new Schema({
  author_id: Number,
  group_id: Number,
  title: String,
  date: Date,
  location: String,
  users: [
    {
      user_id: Number,
      nickname: String,
      status: { type: String, enum: ['attend', 'decline', 'maybe'] },
    },
  ],
  created: Date,
  updated: Date,
})

module.exports = model('Event', eventSchema)
