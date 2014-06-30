/**
 * Created by Sam on 14-6-30.
 */

var mongoose = require('mongoose');
//指定Mongo的数据库名为nodeDemo
mongoose.connect("mongodb://localhost/nodeDemo");
exports.mongoose = mongoose;
