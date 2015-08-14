var mongoose = require('mongoose');
var Message = mongoose.model('Message');

module.exports = function(namespace) {
  namespace.on('connection', function(socket) {
    var user = socket.request.user;
    var room = user.uuid;

    console.log('user come: ' + user.username);

    socket.join(room);

    Message.findLatestByUser(user, function(err, message) {
      if (err) {
        console.log(err);
      } else if (!message) {
        console.log('no message yet');
      } else {
        console.log('latest message: ' + message.text);
        socket.emit('message', {
          message: message
        });
      }
    });

    socket.on('new', function(data) {
      console.log('get new message: ' + data.message.text);
      var message = new Message(data.message);
      message.user = user._id;
      message.save(function(err, message) {
        if (err) {
          socket.emit('error', {
            errors: err.errors
          });
          return;
        }
        namespace.to(room).emit('message', {
          message: message
        });
      });
    });
  });

};