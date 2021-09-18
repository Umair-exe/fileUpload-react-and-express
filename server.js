const express = require('express');
const fileUpload = require('express-fileupload');
const PORT = 5000;
const app = express();

app.use(fileUpload());

app.use('/uploads',express.static('uploads'))

app.post('/upload', (req,res)=> {

 
    if(req.files === null) {
        return res.status(400).json({
            msg: "no file uploaded",
        });
    }
    if(req.files.file.mimetype!=="image/jpeg" ) {
        return res.status(400).json({
            msg: "file should have an extension of jpeg",
        })
    }
    const file = req.files.file;

    file.mv(`${__dirname}/uploads/${file.name}`,err => {
        if(err) {
            return res.status(500).send("hey" + err);
        }
        res.json({
            filename: file.name,
            filepath: `./uploads/${file.name}`, 
        })
    })
});

app.listen(PORT , ()=> {
    console.log(`server is running on port ${PORT}`);
})