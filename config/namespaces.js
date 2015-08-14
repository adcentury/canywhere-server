module.exports = function(io, passport, config) {
    var ioControllerPath = config.root + '/app/io-controllers/';

    var message = require(ioControllerPath + 'messages');
    message(io.of('/messages'));

}