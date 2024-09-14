require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./models');
const app = express();
app.use(bodyParser.json());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/user'));
const PORT = process.env.PORT || 5000;
db.sequelize.sync().then(() => {
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
});
