const express = require("express");

const path = require("path");

const app = express();
app.use(express.static('public'))

const port = process.env.port || 3000;

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
})

app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
})