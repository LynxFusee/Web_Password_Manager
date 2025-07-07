var express = require("express");
const db = require('./firebase');
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.get('/main', function (req, res){
    res.render('src/index')
});

app.get('/login', function (req, res){
    res.render('src/login')
});

app.post("/login_form", async (req, res) => {
    const { Username, Password } = req.body;
    try {
        const snapshot = await db.ref("Accounts").once("value");
        const users = snapshot.val();
        let userId = null;
        for (const [id, user] of Object.entries(users)){
            if (user.Account === Username && user.Password === Password){
                userId = id;
                break;
            }
        }
        if (userId !== null){
            const sessionId = Math.floor(Math.random() * 1000000000);
            await db.ref("Sessions/" + sessionId).set({
                userId: userId,
                createdAt : Date.now()
            });
            res.setHeader("Set-Cookie", `sessionId=${sessionId}; HttpOnly; Path=/`);
            res.redirect('/main');
        }   else {
            res.redirect('/login?error=true');
        }
    }  catch (err) {
        res.redirect('/login');
    }
});

app.listen(8081);
console.log("8081 pour le port bg");é"&