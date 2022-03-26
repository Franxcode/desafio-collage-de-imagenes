const path = require('path');
const fs = require('fs');
const express = require('express');
const expressFileUpload = require('express-fileupload');
const bodyParser = require('body-parser');

class Server {
    constructor(){
        this.app = express();
        this.port = 3000;
        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.app.use(express.static('public'));
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(bodyParser.json());
        this.app.use(expressFileUpload({
            limits: {fileSize: 5000000},
            abortOnLimit: true,
            responseOnLimit: 'El peso del archivo que intentas subir supera el limite permitido.'
        }));
    };
    routes(){
        this.app.post('/imagen', (req, res) => {
            if (req.files === null) {
                res.send('Debes seleccionar una Imagen e ingresar una Posicion para poder cargar una imagen.');
            }
            const { target_file } = req.files;
            const { posicion } = req.body;
            target_file.mv(path.join(__dirname, "../public/imagenes", `imagen-${posicion}.jpg`), (err) => {
                if(err) {
                    res.sendFile(path.join(__dirname, "../public", "404.html"));
                }
                res.sendFile(path.join(__dirname, "../public", 'collage.html'));
            });
        });

        this.app.get('/deleteImg/:nombre', (req, res) => {
            const { nombre } = req.params;
            fs.unlink(path.join(__dirname, "../public/imagenes", `${nombre}`), (err) => {
                if(err) {
                res.sendFile(path.join(__dirname, "../public", "404.html"));
                }
                res.redirect('http://localhost:3000');
            });
        });

        this.app.get("*", (req, res) => {
            res.sendFile(path.join(__dirname, "../public", "404.html"));
        });
    };
    listen(){
        this.app.listen(this.port, () => console.log(`Server initialized at port ${this.port}.`));
    };
}

module.exports = Server;