/**
 * Created by Sam on 14-6-30.
 */

var mongodb = require('./mongodb');
var Schema = mongodb.mongoose.Schema;
var MovieSchema = new Schema({
    name:String,
    alias:[String],
    publish:Date,
    create_date:{ type: Date, default: Date.now },
    images:{
        converSmall:String,
        converBig:String
    },
    source:[{
        source:String,
        link:String,
        swfLink:String,
        quality:String,
        version:String,
        lang:String,
        subtitle:String,
        create_date : { type: Date, default: Date.now }
    }]
});

var Movie = mongodb.mongoose.model('Movie',MovieSchema);
var MovieDAO = function(){};

MovieDAO.prototype.save = function(obj,callback){
    var instance = new Movie(obj);
    instance.save(function(err){
        callback(err);
    });
};

MovieDAO.prototype.update = function(obj,callback){
    Movie.findOne({name:obj.name}, function(err, doc){
        if(err)
            callback(err);
        else{
            doc.update(obj,function(err){
                callback(err);
            });
        }
    });

};

MovieDAO.prototype.findByName = function(name, callback) {
    Movie.findOne({name:name}, function(err, obj){
        callback(err, obj);
    });
};

module.exports = new MovieDAO();
