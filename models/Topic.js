var mongoose = require('mongoose');

var topicSchema = mongoose.Schema({
    topic :{type:String, require:true}
});

var Topic = mongoose.model('topic',topicSchema);

module.exports = Topic;
