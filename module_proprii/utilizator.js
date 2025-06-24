const AccesBD=require('./accesbd.js');
const parole=require('./parole.js');

const {RolFactory}=require('./roluri.js');
const crypto=require("crypto");
const nodemailer=require("nodemailer");


class Utilizator{

    static tipConexiune="local";
    static tabel="utilizatori"
    static parolaCriptare="tehniciweb";
    static emailServer="test.tweb.node@gmail.com";
    static lungimeCod=64;
    static numeDomeniu="localhost:8080";
    #eroare;

    /**
     * Constructor pentru clasa Utilizator
     * @param {Object} param0 - Obiect cu proprietatile utilizatorului
     * @param {number} param0.id - ID-ul utilizatorului
     * @param {string} param0.username - Numele de utilizator
     * @param {string} param0.nume - Numele utilizatorului
     * @param {string} param0.prenume - Prenumele utilizatorului
     * @param {string} param0.email - Adresa de email a utilizatorului
     * @param {string} param0.parola - Parola utilizatorului
     * @param {Object} param0.rol - Rolul utilizatorului (poate fi un cod sau un obiect rol)
     * @param {string} [param0.culoare_chat="black"] - Culoarea chat-ului utilizatorului
     * @param {string} [param0.poza] - URL-ul pozei de profil a utilizatorului
     * @throws {Error} - Daca username-ul nu este valid
     * */

    constructor({id, username, nume, prenume, email, parola, rol, culoare_chat="black", poza}={}) {
        this.id=id;

        //optional sa facem asta in constructor
        try{
            if(this.checkUsername(username))
                this.username = username;
            else throw new Error("Username incorect");

        }
        catch(e){ this.#eroare=e.message}

        for(let prop in arguments[0]){
            this[prop]=arguments[0][prop]
        }
        if(this.rol)
            this.rol=this.rol.cod? RolFactory.creeazaRol(this.rol.cod):  RolFactory.creeazaRol(this.rol);
        console.log(this.rol);

        this.#eroare="";
    }

    /**
     * Verifica daca numele utilizatorului contine caractere valide
     *
     * @param {string} nume - numele utilizatorului
     * @return {boolean} - true daca numele este valid, false altfel
     * 
     */

    checkName(nume){
        return nume!="" && nume.match(new RegExp("^[A-Z][a-z]+$")) ;
    }

    set setareNume(nume){
        if (this.checkName(nume)) this.nume=nume
        else{
            throw new Error("Nume gresit")
        }
    }

    /*
    * folosit doar la inregistrare si modificare profil
    */
    set setareUsername(username){
        if (this.checkUsername(username)) this.username=username
        else{
            throw new Error("Username gresit")
        }
    }

    checkUsername(username){
        return username!="" && username.match(new RegExp("^[A-Za-z0-9#_./]+$")) ;
    }

    static criptareParola(parola){
        return crypto.scryptSync(parola,Utilizator.parolaCriptare,Utilizator.lungimeCod).toString("hex");
    }

    /**
     * Salveaza utilizatorul in baza de date
     * @returns {void}
     * @throws {Error} - Daca parola nu este criptata sau daca apar erori la inserarea in baza de date
     * */

    salvareUtilizator(){
        let parolaCriptata=Utilizator.criptareParola(this.parola);
        let utiliz=this;
        let token=parole.genereazaToken(100);
        AccesBD.getInstanta(Utilizator.tipConexiune).insert({tabel:Utilizator.tabel,
            campuri:{
                username:this.username,
                nume: this.nume,
                prenume:this.prenume,
                parola:parolaCriptata,
                email:this.email,
                culoare_chat:this.culoare_chat,
                cod:token,
                poza:this.poza}
            }, function(err, rez){
            if(err)
                console.log(err);
            else
                utiliz.trimiteMail("Te-ai inregistrat cu succes","Username-ul tau este "+utiliz.username,
            `<h1>Salut!</h1><p style='color:blue'>Username-ul tau este ${utiliz.username}.</p> <p><a href='http://${Utilizator.numeDomeniu}/cod/${utiliz.username}/${token}'>Click aici pentru confirmare</a></p>`,
            )
        });
    }
//xjxwhotvuuturmqm

    /**
     * Trimite un email utilizatorului
     * @param {string} subiect - Subiectul emailului
     * @param {string} mesajText - Mesajul in format text
     * @param {string} mesajHtml - Mesajul in format HTML
     * @param {Array} atasamente - Lista de atasamente (optional)
     * @returns {Promise<void>} - Promisiune care se rezolva cand emailul este trimis
     * @throws {Error} - Daca apar erori la trimiterea emailului
     * */

    async trimiteMail(subiect, mesajText, mesajHtml, atasamente=[]){
        var transp= nodemailer.createTransport({
            service: "gmail",
            secure: false,
            auth:{//date login 
                user:Utilizator.emailServer,
                pass:"rwgmgkldxnarxrgu"
            },
            tls:{
                rejectUnauthorized:false
            }
        });
        //genereaza html
        await transp.sendMail({
            from:Utilizator.emailServer,
            to:this.email, //TO DO
            subject:subiect,//"Te-ai inregistrat cu succes",
            text:mesajText, //"Username-ul tau este "+username
            html: mesajHtml,// `<h1>Salut!</h1><p style='color:blue'>Username-ul tau este ${username}.</p> <p><a href='http://${numeDomeniu}/cod/${username}/${token}'>Click aici pentru confirmare</a></p>`,
            attachments: atasamente
        })
        console.log("trimis mail");
    }

    /**
     * Obtine un utilizator dupa username
     * @param {Utilizator} Utilizator - Numele de utilizator
     * @return {Promise<Utilizator|null>} - Promisiune care se rezolva cu utilizatorul gasit sau null daca nu exista
     * @throws {Error} - Daca apar erori la interogarea bazei de date
     * */
   
    static async getUtilizDupaUsernameAsync(username){
        if (!username) return null;
        try{
            let rezSelect= await AccesBD.getInstanta(Utilizator.tipConexiune).selectAsync(
                {tabel:"utilizatori",
                campuri:['*'],
                conditiiAnd:[`username='${username}'`]
            });
            if(rezSelect.rowCount!=0){
                return new Utilizator(rezSelect.rows[0])
            }
            else {
                console.log("getUtilizDupaUsernameAsync: Nu am gasit utilizatorul");
                return null;
            }
        }
        catch (e){
            console.log(e);
            return null;
        }
        
    }

    /**
     * Obtine un utilizator dupa username si apeleaza o functie de procesare
     * @param {string} username - Numele de utilizator
     * @param {Object} obparam - Obiect cu parametrii suplimentari pentru procesare
     * @param {function} proceseazaUtiliz - Functie care proceseaza utilizatorul gasit
     * @return {void}
     * @throws {Error} - Daca apar erori la interogarea bazei de date
     * */
    
    static getUtilizDupaUsername (username,obparam, proceseazaUtiliz){
        if (!username) return null;
        let eroare=null;
        AccesBD.getInstanta(Utilizator.tipConexiune).select(
                {tabel:"utilizatori",
                campuri:['*'],
                conditiiAnd:[`username='${username}'`]}
        , function (err, rezSelect){
            if(err){
                console.error("Utilizator:", err);
                //throw new Error()
                eroare=-2;
            }
            else if(rezSelect.rowCount==0){
                eroare=-1;
            }
            //constructor({id, username, nume, prenume, email, rol, culoare_chat="black", poza}={})
            let u= new Utilizator(rezSelect.rows[0])
            proceseazaUtiliz(u, obparam, eroare);
        });
    }

    areDreptul(drept){
        return this.rol.areDreptul(drept);
    }
}

/**
 * @name module.exports.Utilizator
 * @type Utilizator
 */

module.exports={Utilizator:Utilizator}