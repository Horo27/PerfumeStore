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
}


//console.log(btn.id)