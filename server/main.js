// Setup Express.js
const express = require('express');
const app = express();

// Configure DotENV
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

// Middleware to prase body to JSON for all JSON requests
app.use(express.json());

// Setup Discord.js
require('./discordhandling/discordmain');

const port = 8000;
app.listen(port, () => {
  console.log(`Server is running on PORT: ${port}`)
});

app.use('/api/servers', require('./routes/api/servers'));
app.use('/api/messaging', require('./routes/api/messaging'));
app.use('/api/verifyIdentity', require('./routes/api/verifyIdentity'));
app.use('/api/user', require('./routes/api/user'));