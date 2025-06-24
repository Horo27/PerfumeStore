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

        let vectAlcool = document.getElementsByName("gr_alcool");
        let inpAlcool = null;
        for (let rad of vectAlcool) {
            if (rad.checked) {
                inpAlcool = rad.value;
                break;
            }
        }


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

            let nonAlcool = prod.getAttribute("data-non_alcool") === "true";
            let cond5 = (inpAlcool == "toate" ||
                (inpAlcool == "da" && nonAlcool) ||
                (inpAlcool == "nu" && !nonAlcool));

            if (cond1 && cond2 && cond3 && cond4 && cond5) {
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

    const butonMinim = document.getElementById("btn-minim");

    butonMinim.addEventListener("click", function () {
        
        let produseVizibile = Array.from(document.getElementsByClassName("produs"))
            .filter(p => !p.classList.contains("ascuns"));

        if (produseVizibile.length === 0) {
            alert("Nu există produse vizibile.");
            return;
        }

        let produsMinim = produseVizibile[0];
        let pretMinim = parseFloat(produsMinim.getElementsByClassName("val-pret")[0].innerHTML.trim());

        for (let prod of produseVizibile) {
            let pret = parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML.trim());
            if (pret < pretMinim) {
                pretMinim = pret;
                produsMinim = prod;
            }
        }

        for (let prod of produseVizibile) {
            if (prod !== produsMinim) {
                prod.classList.add("ascuns");
            }
        }

        paginaCurenta = 1;
        afiseazaPagina(paginaCurenta);
    });

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

// Funcționalitate pentru compararea produselor
document.addEventListener("DOMContentLoaded", function() {
    // Inițializare container comparare
    const containerComparare = document.getElementById("container-comparare");
    const produseComparate = document.getElementById("produse-comparate");
    
    // Numărul maxim de produse pentru comparație
    const MAX_PRODUSE_COMPARATE = 4;
    
    // Funcția pentru încărcarea produselor comparate din localStorage
    function incarcaProduseComparate() {
        let produseComparateStocate = localStorage.getItem("produseComparate");
        
        if (produseComparateStocate) {
            try {
                // Verifică dacă produsele comparate nu au expirat
                const dataStocarii = localStorage.getItem("produseComparateTimestamp");
                const acum = new Date().getTime();
                
                // Verifică dacă au trecut mai mult de 1 zi (3600000 ms x 24)
                if (dataStocarii && acum - parseInt(dataStocarii) > 24*3600000) {
                    localStorage.removeItem("produseComparate");
                    localStorage.removeItem("produseComparateTimestamp");
                    return [];
                }
                
                return JSON.parse(produseComparateStocate) || [];
            } catch(e) {
                console.error("Eroare la încărcarea produselor comparate", e);
                return [];
            }
        }
        return [];
    }
    
    // Funcția pentru salvarea produselor comparate în localStorage
    function salveazaProduseComparate(produse) {
        localStorage.setItem("produseComparate", JSON.stringify(produse));
        localStorage.setItem("produseComparateTimestamp", new Date().getTime().toString());
    }
    
    function actualizeazaProduseComparate() {
        const produse = incarcaProduseComparate();
        produseComparate.innerHTML = '';

        const mainElement = document.querySelector("main");

        if (produse.length > 0) {
            containerComparare.classList.add("activ");
            mainElement.classList.add("container-spacing"); // Add spacing when container is active

            produse.forEach(produs => {
                const divProdus = document.createElement("div");
                divProdus.className = "produs-comparat";
                divProdus.innerHTML = `
                <img src="/resurse/imagini/produse/${produs.imagine}" alt="${produs.nume}">
                <h4>${produs.nume}</h4>
                <button class="sterge" data-id="${produs.id}">&times;</button>
            `;
                produseComparate.appendChild(divProdus);
            });

            // Activează butonul de afișare dacă sunt cel puțin 2 produse
            document.querySelector(".btn-afiseaza-comparatie").disabled = produse.length < 2;
        } else {
            containerComparare.classList.remove("activ");
            mainElement.classList.remove("container-spacing"); // Remove spacing when container is hidden
        }

        // Actualizează starea butoanelor de comparare
        actualizeazaButoaneleProduse();
    }
    
    // Funcția pentru actualizarea stării butoanelor de comparare
    function actualizeazaButoaneleProduse() {
        const produse = incarcaProduseComparate();
        const iduri = produse.map(p => p.id);
        
        document.querySelectorAll(".compara-btn").forEach(buton => {
            const idProdus = buton.getAttribute("data-id");
            if (iduri.includes(idProdus)) {
                buton.disabled = true;
                buton.classList.add("tooltip");
                
                // Verifică dacă tooltip-ul există deja
                if (!buton.querySelector(".tooltiptext")) {
                    const tooltip = document.createElement("span");
                    tooltip.className = "tooltiptext";
                    tooltip.textContent = "ștergeți un produs din lista de comparare";
                    buton.appendChild(tooltip);
                }
            } else {
                buton.disabled = produse.length >= MAX_PRODUSE_COMPARATE;
                buton.classList.remove("tooltip");
                
                // Șterge tooltip-ul dacă există
                const tooltip = buton.querySelector(".tooltiptext");
                if (tooltip) {
                    buton.removeChild(tooltip);
                }
                
                // Adaugă tooltip pentru butonul dezactivat din cauza limitei
                if (buton.disabled) {
                    buton.classList.add("tooltip");
                    const tooltip = document.createElement("span");
                    tooltip.className = "tooltiptext";
                    tooltip.textContent = "Număr maxim de produse atins";
                    buton.appendChild(tooltip);
                }
            }
        });
    }
    
    // Adăugarea unui produs la comparație
    document.addEventListener("click", function(e) {
        if (e.target && e.target.classList.contains("compara-btn")) {
            const idProdus = e.target.getAttribute("data-id");
            const produse = incarcaProduseComparate();
            
            // Verifică dacă produsul există deja sau s-a atins limita
            if (produse.some(p => p.id === idProdus) || produse.length >= MAX_PRODUSE_COMPARATE) {
                return;
            }
            
            // Colectează datele produsului
            let numeProdus, imagineProdus;
            
            // Verifică dacă suntem în pagina produsului sau în lista
            if (e.target.hasAttribute("data-nume") && e.target.hasAttribute("data-imagine")) {
                numeProdus = e.target.getAttribute("data-nume");
                imagineProdus = e.target.getAttribute("data-imagine");
            } else {
                const articolProdus = e.target.closest(".produs");
                if (articolProdus) {
                    numeProdus = articolProdus.querySelector(".val-nume").textContent;
                    imagineProdus = articolProdus.querySelector("img").src.split("/").pop();
                } else {
                    console.error("Nu s-au putut găsi detaliile produsului");
                    return;
                }
            }
            
            // Adaugă produsul la lista de comparație
            produse.push({
                id: idProdus,
                nume: numeProdus,
                imagine: imagineProdus
            });
            
            // Salvează și actualizează interfața
            salveazaProduseComparate(produse);
            actualizeazaProduseComparate();
        }
    });
    
    // Ștergerea unui produs din comparație
    document.addEventListener("click", function(e) {
        if (e.target && e.target.classList.contains("sterge")) {
            const idProdus = e.target.getAttribute("data-id");
            const produse = incarcaProduseComparate();
            
            const produseFiltrate = produse.filter(p => p.id !== idProdus);
            
            salveazaProduseComparate(produseFiltrate);
            actualizeazaProduseComparate();
        }
    });
    
    // Acțiunea butonului "Șterge toate"
    document.querySelector(".btn-sterge-comparatii").addEventListener("click", function() {
        localStorage.removeItem("produseComparate");
        localStorage.removeItem("produseComparateTimestamp");
        actualizeazaProduseComparate();
    });
    
    // Acțiunea butonului "Afișează comparație"
    document.querySelector(".btn-afiseaza-comparatie").addEventListener("click", function() {
        const produse = incarcaProduseComparate();
        
        if (produse.length < 2) {
            alert("Adaugă cel puțin 2 produse pentru comparație");
            return;
        }
        
        // Arată fereastra de comparare
        const fereastraComparare = document.getElementById("fereastra-comparare");
        fereastraComparare.style.display = "block";
        
        // Încarcă datele detaliate pentru produse folosind fetch
        const promisiuni = produse.map(produs => 
            fetch(`/produs/${produs.id}`)
            .then(resp => {
                if (resp.ok) {
                    return resp.text();
                }
                throw new Error("Nu s-au putut încărca detaliile produsului");
            })
        );
        
        Promise.all(promisiuni)
        .then(htmls => {
            const parser = new DOMParser();
            
            // Parsează fiecare HTML și extrage informațiile produsului
            const detaliiProduse = htmls.map((html, index) => {
                const doc = parser.parseFromString(html, "text/html");
                const articol = doc.querySelector("#art-produs");
                
                return {
                    id: produse[index].id,
                    nume: articol.querySelector(".nume").textContent.trim(),
                    pret: articol.querySelector(".pret").textContent.trim(),
                    descriere: articol.querySelector(".descriere").textContent.trim(),
                    ingrediente: articol.querySelector(".ingrediente").textContent.trim(),
                    greutate: articol.querySelector(".greutate").textContent.trim(),
                    categorie: articol.querySelector(".categorie").textContent.trim(),
                    non_alcool: articol.querySelector(".non_alcool").textContent.trim(),
                    imagine: produse[index].imagine
                };
            });
            
            // Creează tabelul de comparare
            const tabelContainer = document.getElementById("tabel-container");
            
            let tabelHTML = `
            <table class="tabel-comparare">
                <tr>
                    <th>Caracteristică</th>
                    ${detaliiProduse.map(p => `<th>${p.nume}</th>`).join('')}
                </tr>
                <tr>
                    <td>Imagine</td>
                    ${detaliiProduse.map(p => `<td><img src="/resurse/imagini/produse/${p.imagine}" alt="${p.nume}"></td>`).join('')}
                </tr>
                <tr>
                    <td>Preț</td>
                    ${detaliiProduse.map(p => `<td>${p.pret}</td>`).join('')}
                </tr>
                <tr>
                    <td>Descriere</td>
                    ${detaliiProduse.map(p => `<td>${p.descriere}</td>`).join('')}
                </tr>
                <tr>
                    <td>Ingrediente</td>
                    ${detaliiProduse.map(p => `<td>${p.ingrediente}</td>`).join('')}
                </tr>
                <tr>
                    <td>Greutate</td>
                    ${detaliiProduse.map(p => `<td>${p.greutate}</td>`).join('')}
                </tr>
                <tr>
                    <td>Categorie</td>
                    ${detaliiProduse.map(p => `<td>${p.categorie}</td>`).join('')}
                </tr>
                <tr>
                    <td>Fără alcool</td>
                    ${detaliiProduse.map(p => `<td>${p.non_alcool}</td>`).join('')}
                </tr>
            </table>
            `;
            
            tabelContainer.innerHTML = tabelHTML;
        })
        .catch(error => {
            console.error("Eroare la încărcarea detaliilor produselor", error);
            tabelContainer.innerHTML = `<p class="eroare">A apărut o eroare la încărcarea detaliilor produselor.</p>`;
        });
    });
    
    // Închiderea ferestrei de comparare
    document.getElementById("inchide-comparare").addEventListener("click", function() {
        document.getElementById("fereastra-comparare").style.display = "none";
    });
    
    // Închiderea ferestrei de comparare dacă se apasă în afara conținutului
    document.getElementById("fereastra-comparare").addEventListener("click", function(e) {
        if (e.target === this) {
            this.style.display = "none";
        }
    });
    
    // Încarcă produsele comparate la încărcarea paginii
    actualizeazaProduseComparate();

    const produse = incarcaProduseComparate();
    if (produse.length > 0) {
        document.querySelector("main").classList.add("container-spacing");
    }
});