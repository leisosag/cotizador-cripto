const criptomonedasSelect = document.getElementById('criptomonedas');
const monedaSelect = document.getElementById('moneda');
const formulario = document.getElementById('formulario');
const resultado = document.getElementById('resultado');

const objBusqueda = {
    moneda: '',
    criptomoneda: ''
}

const obtenerCriptomonedas = criptomonedas => new Promise(resolve => {
    resolve(criptomonedas);
})


document.addEventListener('DOMContentLoaded', () => {
    consultarCriptomonedas();

    formulario.addEventListener('submit', submitForm);

    criptomonedasSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);
});

function consultarCriptomonedas() {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => obtenerCriptomonedas(resultado.Data))
        .then(criptomonedas => selectCriptomonedas(criptomonedas))
}

function selectCriptomonedas(criptomonedas) {
    criptomonedas.forEach(cripto => {
        const {FullName, Name} = cripto.CoinInfo;

        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        criptomonedasSelect.appendChild(option);

    })
}

function leerValor(e) {
    objBusqueda[e.target.name] = e.target.value;
}

function submitForm(e) {
    e.preventDefault();

    const {moneda, criptomoneda} = objBusqueda;

    if(moneda === '' || criptomoneda === '') {
        mostrarMensaje('Ambos campos son obligatorios');
        return;
    }

    consultarAPI();

}

function mostrarMensaje(mensaje) {
    const existeError = document.querySelector('.error');

    if(!existeError) {
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('error');
        divMensaje.textContent = mensaje;
        formulario.appendChild(divMensaje);

        setTimeout(() => {
        divMensaje.remove();
        }, 3000);
    }
    
}

async function consultarAPI() {
    const {moneda, criptomoneda} = objBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();

    /*fetch(url)
        .then(respuesta => respuesta.json())
        .then(cotizacion => {
            mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
        });*/

        try {
            const respuesta = await fetch(url);
            const cotizacion = await respuesta.json();
            mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
        } catch (error) {
            console.log(error);
        }
}

function mostrarCotizacionHTML(cotizacion){
    limpiarHTML();

    const {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = cotizacion;

    const precio = document.createElement('h3');
    const precioAlto = document.createElement('p');
    const precioBajo = document.createElement('p');
    const ultimasHoras = document.createElement('p');
    const ultimaActualizacion = document.createElement('p');

    precio.innerHTML = `Precio: <span>${PRICE}</span>`;
    precioAlto.innerHTML = `Precio más alto del dia: <span>${HIGHDAY}</span>`;
    precioBajo.innerHTML = `Precio más bajo del dia: <span>${LOWDAY}</span>`;
    ultimasHoras.innerHTML = `Variación en las últimas 24hs: <span>${CHANGEPCT24HOUR}%</span>`;    
    ultimaActualizacion.innerHTML = `Última actualización: <span>${LASTUPDATE}</span>`;

    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimasHoras);
    resultado.appendChild(ultimaActualizacion);
}

function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function mostrarSpinner() {
    limpiarHTML();

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');
    spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;

    resultado.appendChild(spinner);
}