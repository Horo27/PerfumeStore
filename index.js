const { error } = require('console');
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const pg = require('pg');
const AccesBD = require('./module_proprii/accesbd.js');

AccesBD.getInstanta().select({tabel: "Parfumuri", campuri: ["*"], conditiiAnd: [['pret=210',"tip_produs='parfum'"],['greutate=200']]}, function (err, rez){
    if (err) {
        console.log("Eroare la select:", err);
    } else {
        console.log("Rezultatul select:", rez);
    }
});

const Client=pg.Client;

client=new Client({
    database:"DB_Parfumuri",
    user:"utilizator",
    password:"parola",
    host:"localhost",
    port:5432
})

client.connect();

// client.query("select * from parfumuri", function(err, rezultat ){
//     console.log(err)    
//     console.log(rezultat)
// })
// client.query("select * from unnest(enum_range(null::categ_parfum))", function(err, rezultat ){
//     console.log(err)    
//     console.log(rezultat)
// })

console.log("folderul proiectului: ", __dirname);
console.log("calea fisierului index.js: ", __filename);
console.log("folderul curent de lucru: ", process.cwd());

obGlobal={
    obErori:null
}


function initErori(){
    let continut = fs.readFileSync(path.join(__dirname,"resurse/json/erori.json")).toString("utf-8");
    obGlobal.obErori=JSON.parse(continut)
    
    obGlobal.obErori.eroare_default.imagine=path.join(obGlobal.obErori.cale_baza, obGlobal.obErori.eroare_default.imagine)
    for (let eroare of obGlobal.obErori.info_erori){
        eroare.imagine=path.join(obGlobal.obErori.cale_baza, eroare.imagine)
    }

}

initErori()

function afisareEroare(res, identificator, titlu, text, imagine){
    let eroare= obGlobal.obErori.info_erori.find(function(elem){ 
                        return elem.identificator==identificator
                    });
    if(eroare){
        if(eroare.status)
            res.status(identificator)
        var titluCustom=titlu || eroare.titlu;
        var textCustom=text || eroare.text;
        var imagineCustom=imagine || eroare.imagine;


    }
    else{
        var err=obGlobal.obErori.eroare_default
        var titluCustom=titlu || err.titlu;
        var textCustom=text || err.text;
        var imagineCustom=imagine || err.imagine;


    }
    res.render("pagini/eroare", { //transmit obiectul locals
        titlu: titluCustom,
        text: textCustom,
        imagine: imagineCustom
})

}

app.set('view engine', 'ejs');

app.use("/resurse", express.static(path.join(__dirname,"resurse")))

app.get(['/','/index','/home'], (req, res) => {
    res.render('pagini/index');
});

//pagina cu toate produsele
app.get("/produse", function(req, res){
    console.log(req.query)
    var conditieQuery=""; // TO DO where din parametri


    queryOptiuni="select * from unnest(enum_range(null::categ_parfum))"
    client.query(queryOptiuni, function(err, rezOptiuni){
        console.log(rezOptiuni)


        queryProduse="select * from parfumuri";
        client.query(queryProduse, function(err, rez){
            if (err){
                console.log(err);
                afisareEroare(res, 2);
            }
            else{
                res.render("pagini/produse", {produse: rez.rows, optiuni:rezOptiuni.rows})
            }
        })
    });
})

//pagina cu un produs
app.get("/produs/:id", function(req, res){
    console.log(req.params)
    client.query(`select * from parfumuri where id=${req.params.id}`, function(err, rez){
        if (err){
            console.log(err);
            afisareEroare(res, 2);
        }
        else{
            if (rez.rowCount==0){
                afisareEroare(res, 404);
            }
            else{
                res.render("pagini/produs", {prod: rez.rows[0]})
            }
        }
    })
})

//pagina cu seturi de produse
app.get("/seturi", function(req, res){
    console.log(req.query)
    var conditieQuery=""; // TO DO where din parametri

    queryOptiuni = "select * from unnest(enum_range(null::categ_parfum))";
    client.query(queryOptiuni, function(err, rezOptiuni){
        if (err) {
            console.log(err);
            afisareEroare(res, 2);
            return;
        }

        // Selectează toate seturile și produsele asociate
        const querySeturi = `
            SELECT s.id as set_id, s.nume_set, s.descriere_set, 
                   p.id as produs_id, p.nume, p.pret, p.imagine
            FROM seturi s
            JOIN asociere_set a ON s.id = a.id_set
            JOIN parfumuri p ON a.id_produs = p.id
            ORDER BY s.id, p.id
        `;
        client.query(querySeturi, function(err, rezSeturi){
            if (err){
                console.log(err);
                afisareEroare(res, 2);
            }
            else{
                // Grupăm produsele pe seturi
                let seturi = [];
                let mapSeturi = {};
                for (let row of rezSeturi.rows) {
                    if (!mapSeturi[row.set_id]) {
                        mapSeturi[row.set_id] = {
                            id: row.set_id,
                            nume_set: row.nume_set,
                            descriere_set: row.descriere_set,
                            produse: []
                        };
                        seturi.push(mapSeturi[row.set_id]);
                    }
                    mapSeturi[row.set_id].produse.push({
                        id: row.produs_id,
                        nume: row.nume,
                        pret: row.pret,
                        imagine: row.imagine
                    });
                }
                res.render("pagini/seturi", {seturi: seturi, optiuni: rezOptiuni.rows});
            }
        });
    });
});

// app.get("/*.ejs", function(req, res, next){
//     afisareEroare(res,400);
// })


// app.get("/*", function(req, res, next){
//     try{
//         res.render('pagini'+req.url , function (err, rezultatRandare){
//             if (err){
//                 if(err.message.startsWith("Failed to lookup view")){
//                     afisareEroare(res,404);
//                 }
//                 else{
//                     afisareEroare(res);
//                 }
//             }
//             else{
//                 console.log(rezultatRandare);
//                 res.send(rezultatRandare)
//             }
//         });
//     }
//     catch(errRandare){
//         if(errRandare.message.startsWith("Cannot find module")){
//             afisareEroare(res,404);
//         }
//         else{
//             afisareEroare(res);
//         }
//     }
// })


app.listen(process.env.PORT || 8080)
