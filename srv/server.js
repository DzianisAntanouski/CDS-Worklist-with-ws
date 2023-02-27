const cds = require("@sap/cds");
const proxy = require("@sap/cds-odata-v2-adapter-proxy");
const fs = require("fs");
const path = require("path");

const bodyParser = require("body-parser");
const multer = require("multer");
const upload = multer();

cds.on("bootstrap", async (app) => {
    app.use(bodyParser.urlencoded({ extended: true }));
    // app.use(bodyParser.json());

    app.use(proxy());
    var expressWs = require("express-ws")(app);

    app.ws("/", (ws, res) => {        
        var data = {}
        ws.on('message', (msg) => {
            data.id = msg;
            data.url = `http://leverx.com`
        })
        setTimeout(() => {
            ws.send(JSON.stringify(data))
        }, 10000)
    });

    app.all("/cap/upload", upload.single("myFile"), (req, res) => {
        if (req.body["myFile-data"]) {
            // TODO -----
            saveFile();            
        }

        var data = "";
        req.on("data", (chunk) => {
            data += chunk;
        });

        req.on("end", () => {
            data = JSON.parse(data);
            switch (data.Type) {
                case "text":
                    // TODO -----
                    console.log(data.Type, data.Value);
                    res.status(200).send("text");
                    break;
                case "url":
                    // TODO -----
                    console.log(data.Type, data.Value);
                    res.status(200).send("url");
                    break;
                default:
                    break;
            }
            // res.send('File received');
        });

        function saveFile() {
            if (!req.file) {
                return res.status(400).send("No file uploaded");
            }

            const file = req.file;
            const fileName = file.originalname;

            const directoryPath = path.join(__dirname, "files");
            // Создаем директорию, если ее нет
            if (!fs.existsSync(directoryPath)) {
                fs.mkdirSync(directoryPath);
            }
            // записываем файл в папку files
            fs.writeFile(`./srv/files/${fileName}`, file.buffer, (err) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send("Error while saving file");
                }
                res.status(200).send("File uploaded successfully");
            });
        }
    });
});

module.exports = cds.server;
