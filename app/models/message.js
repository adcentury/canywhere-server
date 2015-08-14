// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var MessageSchema = new Schema({
  text: { type: String, default: '' },
  device: { type: String, default: ''},
  user: {type: Schema.ObjectId, ref: 'User'},
  createAt: { type: Date, default: Date.now }
});

MessageSchema.path('text').required(true, '内容不能为空');

MessageSchema.statics = {
  findLatestByUser: function(user, cb) {
    this.findOne({user: user._id})
      .populate('user')
      .sort({createAt: -1}) // sort by date desc
      .exec(cb);
  }
}

mongoose.model('Message', MessageSchema);