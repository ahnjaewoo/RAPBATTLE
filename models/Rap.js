var mongoose = require('mongoose');

var rapSchema = mongoose.Schema({
  title : {type: String, require: true},
  topic : {type: String, require: true},
  bitid : {type: Number, require: true, default: 0},
  uid : {type: String, require:true},
  lyricid : {type: Number, require: true, default: 0},
  like : {type: Array},
  lyric :{type:String}
});

var Rap = mongoose.model('rap',rapSchema);

module.exports = Rap;
