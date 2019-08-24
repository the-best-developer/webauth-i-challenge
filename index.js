const express = require('express');
const server = express();
const UserRouter = require('./userRouter/users');
const session = require('express-session');

server.use(express.json());

// configure express-session middleware
server.use(
    session({
      name: 'lambdasCool', // default is connect.sid
      secret: 'fire and ice',
      cookie: {
          //      msec        sec     min
          maxAge: 1000    *   60  *   30,
          secure: false, // only set cookies over https. Server will not send back a cookie over http.
      },
      httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
      resave: false,
      saveUninitialized: false,
    })
  );

server.use('/api/', UserRouter);

server.listen(5000, _ => {
  console.log(`Listening on port 5000!`);
});
