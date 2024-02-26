const connectToMongo=require('./connectToDatabase')
const express = require('express')
connectToMongo();
const app = express()
var cors = require('cors')
app.use(cors());
app.use(express.json())
const port = 5000

app.use('/api/auth',require('./routes/auth'))
app.listen(port, () => {
  console.log(`Logistic app listening on port ${port}`)
})
