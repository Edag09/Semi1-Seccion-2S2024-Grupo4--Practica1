const express = require('express');
const cors = require('cors')
const app = express();

app.set('port', process.env.PORT || 8000);

app.use(cors())

app.use(express.json());

app.use(require('./routes/consultas'));

app.listen(app.get('port'), () =>{
    console.log('servidor en puerto:', app.get('port'));
});