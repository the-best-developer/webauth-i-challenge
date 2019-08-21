const express = require('express');
const server = express();
const UserRouter = require('./userRouter/users');

server.use(express.json());
server.use('/api/', UserRouter);

server.listen(5000, _ => {
  console.log(`Listening on port 5000!`);
});
