/* alert(1)

a=10
alert(a)
alert(window.a) */
window.onload= function(){

    const nrPePagina = 4;
    let paginaCurenta = 1;
    let produse = Array.from(document.getElementsByClassName("produs"));
    let nrTotalPagini = Math.ceil(produse.length / nrPePagina);

    function afiseazaPagina(nrPagina) {
        produse = Array.from(document.getElementsByClassName("produs"));
        let produseVizibile = produse.filter(p => !p.classList.contains("ascuns"));
        nrTotalPagini = Math.ceil(produseVizibile.length / nrPePagina);
        produse.forEach(p => p.style.display = "none");
        let start = (nrPagina - 1) * nrPePagina;
        let end = Math.min(start + nrPePagina, produseVizibile.length);
        for (let i = start; i < end; i++) {
            produseVizibile[i].style.display = "block";
        }
        document.getElementById("info-pagina").innerText = `${nrPagina}/${nrTotalPagini || 1}`;
        document.getElementById("pagina-prec").disabled = nrPagina === 1;
        document.getElementById("pagina-urm").disabled = nrPagina === nrTotalPagini || nrTotalPagini === 0;
    }

    document.getElementById("pagina-prec").onclick = function() {
        if(paginaCurenta > 1) {
            paginaCurenta--;
            afiseazaPagina(paginaCurenta);
        }
    }
    document.getElementById("pagina-urm").onclick = function() {
        if(paginaCurenta < nrTotalPagini) {
            paginaCurenta++;
            afiseazaPagina(paginaCurenta);
        }
    }

    afiseazaPagina(paginaCurenta);

    //pentru bonus 7, trecem de la diacritice
    //la litere mici, pentru a nu fi sensibili la diacritice
    function normalizeDiacritics(str) {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }

    btn=document.getElementById("filtrare");
    btn.onclick=function(){
        let inpNume= document.getElementById("inp-nume").value.trim().toLowerCase()
        
        let vectRadio=document.getElementsByName("gr_rad")

        let inpgramaj=null
        let mingramaj=null
        let maxgramaj=null
        for (let rad of vectRadio){
            if (rad.checked){
                inpgramaj=rad.value
                if (inpgramaj!="toate"){
                    [mingramaj,maxgramaj]=inpgramaj.split(":") 
                    mingramaj=parseInt(mingramaj) 
                    maxgramaj=parseInt(maxgramaj)
                }
                break
            }
        }

        let inpPret= document.getElementById("inp-pret").value

        let inpCategorie= document.getElementById("inp-categorie").value.trim().toLowerCase()

        let produse= document.getElementsByClassName("produs")
        for (let prod of produse){
            prod.style.display="none";
            let nume=prod.getElementsByClassName("val-nume")[0].innerHTML.trim().toLowerCase()
            let cond1 = normalizeDiacritics(nume).includes(normalizeDiacritics(inpNume));


            let gramaj=parseInt(prod.getElementsByClassName("val-gramaj")[0].innerHTML.trim())

            let cond2= (inpgramaj=="toate" || (mingramaj<gramaj && gramaj<=maxgramaj) )

            let pret=parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML.trim())
            let cond3 = (inpPret <= pret)

            let categorie=prod.getElementsByClassName("val-categorie")[0].innerHTML.trim().toLowerCase()
            let cond4 =  (inpCategorie=="toate" || inpCategorie==categorie)

            if (cond1 && cond2 && cond3 && cond4) {
                prod.classList.remove("ascuns");
            } else {
                prod.classList.add("ascuns");
            }
        }
        paginaCurenta = 1; // resetăm pagina curentă la 1 după filtrare
        afiseazaPagina(paginaCurenta);

        if (document.getElementById("salveaza-filtrare").checked) {
            salveazaFiltrare();
        }
    }

    incarcaFiltrare();
    
    if (document.getElementById("salveaza-filtrare").checked) {
        btn.onclick(); // sau apelează funcția de filtrare direct dacă ai una
    }

    document.getElementById("inp-pret").onchange=function(){
        document.getElementById("infoRange").innerHTML=`(${this.value})`
    }

    document.getElementById("resetare").onclick=function(){
        document.getElementById("inp-nume").value=""

        let produse= document.getElementsByClassName("produs")

        document.getElementById("i_rad4").checked=true;

        for (let prod of produse){
            prod.classList.remove("ascuns");
        }

        document.getElementById("salveaza-filtrare").checked = false;
        localStorage.removeItem("filtruProduse");

        paginaCurenta = 1;
        afiseazaPagina(paginaCurenta);
    }
    
    document.getElementById("sortare-avansata").onclick = function () {
        let criteriuPrimar = document.getElementById("sort-primar").value;
        let criteriuSecundar = document.getElementById("sort-secundar").value;
        let semn = parseInt(document.getElementById("sort-tip").value);

        let produse = Array.from(document.getElementsByClassName("produs"));

        produse.sort(function (a, b) {
            let valA, valB, valSecA, valSecB;

            switch (criteriuPrimar) {
                case "pret":
                    valA = parseFloat(a.getElementsByClassName("val-pret")[0].innerHTML.trim());
                    valB = parseFloat(b.getElementsByClassName("val-pret")[0].innerHTML.trim());
                    break;
                case "nume":
                    valA = a.getElementsByClassName("val-nume")[0].innerHTML.trim().toLowerCase();
                    valB = b.getElementsByClassName("val-nume")[0].innerHTML.trim().toLowerCase();
                    break;
                case "gramaj":
                    valA = parseInt(a.getElementsByClassName("val-gramaj")[0].innerHTML.trim());
                    valB = parseInt(b.getElementsByClassName("val-gramaj")[0].innerHTML.trim());
                    break;
                case "categorie":
                    valA = a.getElementsByClassName("val-categorie")[0].innerHTML.trim().toLowerCase();
                    valB = b.getElementsByClassName("val-categorie")[0].innerHTML.trim().toLowerCase();
                    break;
            }

            //daca dorim o sortare crescatoare trb sa returnam -1 daca valA < valB
            if (valA < valB) return -1 * semn;
            if (valA > valB) return 1 * semn;

            switch (criteriuSecundar) {
                case "pret":
                    valSecA = parseFloat(a.getElementsByClassName("val-pret")[0].innerHTML.trim());
                    valSecB = parseFloat(b.getElementsByClassName("val-pret")[0].innerHTML.trim());
                    break;
                case "nume":
                    valSecA = a.getElementsByClassName("val-nume")[0].innerHTML.trim().toLowerCase();
                    valSecB = b.getElementsByClassName("val-nume")[0].innerHTML.trim().toLowerCase();
                    break;
                case "gramaj":
                    valSecA = parseInt(a.getElementsByClassName("val-gramaj")[0].innerHTML.trim());
                    valSecB = parseInt(b.getElementsByClassName("val-gramaj")[0].innerHTML.trim());
                    break;
                case "categorie":
                    valSecA = a.getElementsByClassName("val-categorie")[0].innerHTML.trim().toLowerCase();
                    valSecB = b.getElementsByClassName("val-categorie")[0].innerHTML.trim().toLowerCase();
                    break;
            }

            if (valSecA < valSecB) return -1 * semn;
            if (valSecA > valSecB) return 1 * semn;
            return 0;
        });

        let container = produse[0].parentNode;
        produse.forEach(prod => container.appendChild(prod));
        paginaCurenta = 1;
        afiseazaPagina(paginaCurenta);
    };
}

document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll(".produs").forEach(function(articol) {
        articol.addEventListener("click", function(e) {
            

            const popup = document.getElementById("popup-produs");
            const content = document.getElementById("popup-content");

            // Datele produsului
            const id = articol.getAttribute("data-id");
            const nume = articol.getAttribute("data-nume");
            const descriere = articol.getAttribute("data-descriere");
            const pret = articol.getAttribute("data-pret");
            const greutate = articol.getAttribute("data-greutate");
            const tip_produs = articol.getAttribute("data-tip_produs");
            const categorie = articol.getAttribute("data-categorie");
            const ingrediente = articol.getAttribute("data-ingrediente");
            const non_alcool = articol.getAttribute("data-non_alcool") === "true" ? "Da" : "Nu";
            const imagine = articol.getAttribute("data-imagine");
            const data_adaugare = articol.getAttribute("data-data_adaugare");

            content.innerHTML = `
                <button id="close-popup" style="position:absolute; top:10px; right:10px;">&times;</button>
                <h2>${nume}</h2>
                <img src="/resurse/imagini/produse/${imagine}" style="width:100%;max-width:300px;display:block;margin:auto;" alt="imagine produs"/>
                <ul style="list-style:none;padding:0;">
                    <li><b>ID:</b> ${id}</li>
                    <li><b>Descriere:</b> ${descriere}</li>
                    <li><b>Preț:</b> ${pret} lei</li>
                    <li><b>Greutate:</b> ${greutate} ml</li>
                    <li><b>Tip produs:</b> ${tip_produs}</li>
                    <li><b>Categorie:</b> ${categorie}</li>
                    <li><b>Ingrediente:</b> ${ingrediente}</li>
                    <li><b>Fără alcool:</b> ${non_alcool}</li>
                    <li><b>Data adăugare:</b> ${data_adaugare}</li>
                </ul>
            `;
            popup.style.display = "flex";

            document.getElementById("close-popup").onclick = function(ev) {
                popup.style.display = "none";
                ev.stopPropagation();
            };
        });
    });

    // Închide popup dacă dai click pe fundal
    document.getElementById("popup-produs").addEventListener("click", function(e){
        if(e.target === this) this.style.display = "none";
    });
});


// filtre persistente

function salveazaFiltrare() {
    const filtre = {
        nume: document.getElementById("inp-nume").value,
        gramaj: document.querySelector("input[name='gr_rad']:checked")?.value,
        pret: document.getElementById("inp-pret").value,
        categorie: document.getElementById("inp-categorie").value
    };
    localStorage.setItem("filtruProduse", JSON.stringify(filtre));
}

function incarcaFiltrare() {
    const filtre = JSON.parse(localStorage.getItem("filtruProduse"));
    if (filtre) {
        document.getElementById("inp-nume").value = filtre.nume || "";
        if (filtre.gramaj) {
            let radio = document.querySelector(`input[name='gr_rad'][value='${filtre.gramaj}']`);
            if (radio) radio.checked = true;
        }
        document.getElementById("inp-pret").value = filtre.pret || 0;
        document.getElementById("inp-categorie").value = filtre.categorie || "toate";
        document.getElementById("salveaza-filtrare").checked = true;
    }
}    