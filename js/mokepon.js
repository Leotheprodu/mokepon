const botonMascotaJugador = document.getElementById('boton-mascota')
const botonReiniciar = document.getElementById('boton-reiniciar')
const sectionSeleccionarAtaque = document.getElementById('seleccionar-ataque')
const spanMascotaJugador = document.getElementById('mascota-jugador')
const spanMascotaEnemiga = document.getElementById('mascota-enemiga')
const sectionSeleccionarMascota = document.getElementById('seleccionar-mascota')
const seccionMensajes = document.getElementById ('resultado')
const ataquesDelJugador = document.getElementById('ataques-del-jugador')
const ataquesDelEnemigo = document.getElementById('ataques-del-enemigo')
const contenedorTarjetas = document.getElementById ('contenedor-tarjetas')
const contenedorAtaques = document.getElementById ('contenedor-ataques')
const spanVidasJugador = document.getElementById('vidas-jugador')
const spanVidasEnemigo = document.getElementById('vidas-enemigo')
const sectionVerMapa = document.getElementById ('ver-mapa')
const mapa = document.getElementById('mapa')

let jugadorId = null
let enemigoId = null
let mokepones = []
let mokeponesEnemigos = []
let ataqueJugador = []
let ataqueEnemigo = []
/* let opcionDeMokepones */
let inputhipodoge
let inputcapipepo
let inputratigueya
let mascotaJugador
let mokeponJugador
let mokeponEnemigo
let ataquesMokeponEnemigo
let botonAgua
let botonFuego
let botonTierra
let botones = []
let indexAtaqueJugador
let indexAtaqueEnemigo
let resultado
let vidaDelJugador
let vidaDelEnemigo
let lienzo = mapa.getContext("2d")
let intervalo
let mapaBackground = new Image()
mapaBackground.src = './assets/mokemap.png'
let alturaQueBuscamos
let anchoDelMapa = window.innerWidth - 20
const anchoMaximoDelMapa =600

if (anchoDelMapa > anchoMaximoDelMapa) {
    anchoDelMapa = anchoMaximoDelMapa - 20
}

alturaQueBuscamos = anchoDelMapa * 600 / 800

mapa.width = anchoDelMapa
mapa.height = alturaQueBuscamos

class Mokepon {
    constructor (nombre, foto, vida, fotoMapa, id =null) {
        this.id = id
        this.nombre = nombre
        this.foto = foto
        this.vida= vida
        this.ataques = []
        this.ancho = 50
        this.alto = 50
        this.x = aleatorio(0,mapa.width - this.ancho)
        this.y = aleatorio (0, mapa.height - this.alto)
        this.mapaFoto = new Image ()
        this.mapaFoto.src = fotoMapa
        this.velocidadX = 0
        this.velocidadY = 0

    }
    
    pintarMokepon() {
        lienzo.drawImage(
            this.mapaFoto,
            this.x,
            this.y,
            this.ancho,
            this.alto,
        )
    }
}

let hipodoge = new Mokepon ('Hipodoge', './assets/mokepons_mokepon_hipodoge_attack.png', 5, './assets/hipodoge.png')

let capipepo = new Mokepon ('Capipepo', './assets/mokepons_mokepon_capipepo_attack.png', 5, './assets/capipepo.png')

let ratigueya = new Mokepon ('Ratigueya', './assets/mokepons_mokepon_ratigueya_attack.png', 5, './assets/ratigueya.png')

const HIPODOGE_ATAQUES = [
    {nombre: '💧', id: 'boton-agua'},
    {nombre: '💧', id: 'boton-agua'},
    {nombre: '💧', id: 'boton-agua'},
    {nombre: '🔥', id: 'boton-fuego'},
    {nombre: '🌱', id: 'boton-tierra'},
]
const CAPIPEPO_ATAQUES = [
    {nombre: '🌱', id: 'boton-tierra'},
    {nombre: '🌱', id: 'boton-tierra'},
    {nombre: '🌱', id: 'boton-tierra'},
    {nombre: '🔥', id: 'boton-fuego'},
    {nombre: '💧', id: 'boton-agua'},
]
const RATIGUEYA_ATAQUES = [
    {nombre: '🔥', id: 'boton-fuego'},
    {nombre: '🔥', id: 'boton-fuego'},
    {nombre: '🔥', id: 'boton-fuego'},
    {nombre: '💧', id: 'boton-agua'},
    {nombre: '🌱', id: 'boton-tierra'},
]

hipodoge.ataques.push (...HIPODOGE_ATAQUES)
capipepo.ataques.push (...CAPIPEPO_ATAQUES)
ratigueya.ataques.push (...RATIGUEYA_ATAQUES)

//hipodogeEnemigo.ataques.push (...HIPODOGE_ATAQUES)
//capipepoEnemigo.ataques.push (...CAPIPEPO_ATAQUES)
//ratigueyaEnemigo.ataques.push (...RATIGUEYA_ATAQUES)


mokepones.push(hipodoge, capipepo, ratigueya)

function iniciarJuego (){
  
    sectionVerMapa.style.display = 'none'
    sectionSeleccionarAtaque.style.display = 'none'

    mokepones.forEach((mokepon) =>{
        let opcionDeMokepones = `
        <input type="radio" name="mascota" id=${mokepon.nombre}>
        <label class = "tarjeta-de-mokepon" for=${mokepon.nombre}>
            <p>${mokepon.nombre}</p>
            <img src=${mokepon.foto} alt=${mokepon.nombre}>
        </label>
        `
    contenedorTarjetas.innerHTML += opcionDeMokepones

    inputhipodoge = document.getElementById('Hipodoge')
    inputcapipepo = document.getElementById('Capipepo')
    inputratigueya = document.getElementById('Ratigueya')
    })
    botonMascotaJugador.addEventListener('click', seleccionarMascotaJugador)
    botonReiniciar.addEventListener('click', reiniciarJuego)
    unirseAlJuego()

    botonReiniciar.style.display = 'none'
}

function unirseAlJuego() {
    fetch("http://localhost:8080/unirse") 
        .then(function (res) {
            if (res.ok) {
                res.text()
                .then(function (respuesta) {
                    console.log(respuesta)  
                    jugadorId = respuesta
                })
            }

        })
}

function seleccionarMascotaJugador(){
    
    sectionSeleccionarMascota.style.display = 'none'
    sectionVerMapa.style.display = 'flex'
    iniciarMapa()

    if (inputhipodoge.checked) {
        spanMascotaJugador.innerHTML = inputhipodoge.id
        mokeponJugador = hipodoge
        mascotaJugador = inputhipodoge.id
        vidaDelJugador = hipodoge.vida
       agregarMascotaJugador((hipodoge).foto)

    }   
    else if (inputcapipepo.checked) {
        spanMascotaJugador.innerHTML = inputcapipepo.id
        mokeponJugador = capipepo
        mascotaJugador = inputcapipepo.id
        vidaDelJugador = capipepo.vida
        agregarMascotaJugador((capipepo).foto)
    }   
    else if (inputratigueya.checked) {
        spanMascotaJugador.innerHTML = inputratigueya.id
        mokeponJugador = ratigueya
        mascotaJugador = inputratigueya.id
        vidaDelJugador = ratigueya.vida
        agregarMascotaJugador((ratigueya).foto)

    }   
    else {
        alert ("debes seleccionar un mokepon")
        location.reload()
    }

    seleccionarMokepon(mascotaJugador)

    extraerAtaques(mascotaJugador)
    spanVidasJugador.innerHTML = vidaDelJugador
} 

function seleccionarMokepon(mascotaJugador) {
    fetch(`http://localhost:8080/mokepon/${jugadorId}` , {
        method: "post",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            mokepon: mascotaJugador

        })
    })
}

function extraerAtaques () {
    let ataques
    for (let i = 0; i < mokepones.length; i++) {
        if (mascotaJugador === mokepones[i].nombre) {
            ataques = mokepones[i].ataques
        }
        
    }
    mostrarAtaques(ataques)

}

function mostrarAtaques(ataques) {
    ataques.forEach((ataque) => {
        ataquesMokepon = `
        <button id=${ataque.id} class="boton-de-ataque BAtaque">${ataque.nombre}</button>
        `
        contenedorAtaques.innerHTML += ataquesMokepon 

    })
    botonFuego = document.getElementById('boton-fuego')
    botonAgua = document.getElementById('boton-agua')
    botonTierra = document.getElementById('boton-tierra')
    botones = document.querySelectorAll('.BAtaque')

}

function seleccionarMascotaEnemiga(enemigo){
    agregarMascotaEnemigo(enemigo.foto)
    spanMascotaEnemiga.innerHTML = enemigo.nombre
    ataquesMokeponEnemigo = enemigo.ataques
    vidaDelEnemigo = enemigo.vida
    spanVidasEnemigo.innerHTML = vidaDelEnemigo
    secuenciaAtaque()
    

}
function  secuenciaAtaque () {
    botones.forEach ((boton) => {
        boton.addEventListener('click', (e) => {

            if(e.target.textContent === '🔥') {
                ataqueJugador.push ('FUEGO')
                console.log(ataqueJugador)
                boton.disabled = true
                boton.style.background = '#112f58'

            } else if(e.target.textContent === '💧') {
                ataqueJugador.push ('AGUA')
                console.log(ataqueJugador)
                boton.disabled = true
                boton.style.background = '#112f58'

            }  else {
                ataqueJugador.push ('TIERRA')
                console.log(ataqueJugador)
                boton.disabled = true
                boton.style.background = '#112f58'
                
            } 
            if (ataqueJugador.length === 5) {
                enviarAtaques()
            } 
         
        })
    })
    
}

function enviarAtaques() {
    fetch(`http://localhost:8080/mokepon/${jugadorId}/ataques`, {
        method:"post",
         headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify({ 
            ataques:ataqueJugador
        })
    })    
      intervalo = setInterval(obtenerAtaques, 50)       
}
function obtenerAtaques () {
    fetch(`http://localhost:8080/mokepon/${enemigoId}/ataques`)
        .then(function (res){
            if (res.ok) {
                res.json()
                    .then(function ({ ataques }) {
                        if (ataques.length === 5) {
                            ataqueEnemigo = ataques
                            combate()
                        }
                    })
                
            }
        })
}


function ataqueAleatorioEnemigo() {
    let ataqueAleatorio = aleatorio(0,ataquesMokeponEnemigo.length -1)

    if(ataqueAleatorio == 0 || ataqueAleatorio == 1) {
        ataqueEnemigo.push ('FUEGO')
        console.log(ataqueEnemigo)  
    }else if(ataqueAleatorio == 3 || ataqueAleatorio == 4) {
        ataqueEnemigo.push ('AGUA')
        console.log(ataqueEnemigo)  
    }else {
        ataqueEnemigo.push ('TIERRA')
        console.log(ataqueEnemigo)   
    }
    iniciarPelea()
}


function iniciarPelea() {
    if( ataqueJugador.length === 5) {
        combate()
    }
}
function indexAmbosOponentes(jugador, enemigo) {
    indexAtaqueJugador =ataqueJugador[jugador]
    indexAtaqueEnemigo =ataqueEnemigo[enemigo]
}
function combate () {
clearInterval(intervalo)

    for (let index = 0; index < ataqueJugador.length; index++) {
        if(ataqueJugador[index] === ataqueEnemigo[index]) {
            indexAmbosOponentes(index, index)
            crearMensaje('EMPATE')
        }else if (ataqueJugador[index] === "FUEGO" && ataqueEnemigo[index] === "TIERRA") {
            indexAmbosOponentes(index, index)
            crearMensaje('GANADO')
            vidaDelEnemigo--
            spanVidasEnemigo.innerHTML =vidaDelEnemigo

        }else if (ataqueJugador[index] === "AGUA" && ataqueEnemigo[index] === "FUEGO") {
            indexAmbosOponentes(index, index)
            crearMensaje('GANADO')
            vidaDelEnemigo--
            spanVidasEnemigo.innerHTML =vidaDelEnemigo

        }else if (ataqueJugador[index] === "TIERRA" && ataqueEnemigo[index] === "AGUA") {
            indexAmbosOponentes(index, index)
            crearMensaje('GANADO')
            vidaDelEnemigo--
            spanVidasEnemigo.innerHTML =vidaDelEnemigo
        }else {
            indexAmbosOponentes(index, index)
            crearMensaje('PERDIDO')
            vidaDelJugador--
            spanVidasJugador.innerHTML =vidaDelJugador
        }

        revisarVidas()
    }
}

function revisarVidas() {

    if (vidaDelJugador > vidaDelEnemigo) {
    seccionMensajes.innerHTML = "Felicidades has ganado"
    botonReiniciar.style.display = 'flex'    
    } else if (vidaDelJugador == vidaDelEnemigo) {
        seccionMensajes.innerHTML = "  Ha habido un empate"
        botonReiniciar.style.display = 'flex'  
    }
    else{
        seccionMensajes.innerHTML = "Valiste verga, has perdido"
        botonReiniciar.style.display = 'flex'
    }
}

function crearMensaje (resultado) {


    let nuevoAtaqueDelJugador = document.createElement('p')
    let nuevoAtaqueDelEnemigo = document.createElement('p')

    seccionMensajes.innerHTML = resultado
    nuevoAtaqueDelJugador.innerHTML = indexAtaqueJugador
    nuevoAtaqueDelEnemigo.innerHTML = indexAtaqueEnemigo

    ataquesDelJugador.appendChild(nuevoAtaqueDelJugador)
    ataquesDelEnemigo.appendChild(nuevoAtaqueDelEnemigo)
}

function crearMensajeFinal (resultadoFinal) {
    
    seccionMensajes.innerHTML = resultadoFinal
    botonFuego.disabled = true
    botonAgua.disabled = true
    botonTierra.disabled = true
}

function reiniciarJuego() {
    location.reload()

}

function aleatorio(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min)
}
function agregarMascotaJugador(imagen){
    const contenedor = document.getElementById("img-mascota-jugador")
        contenedor.insertAdjacentHTML(
          "beforeend",
          `<img src=${imagen} alt=${imagen}>`) // Backticks para img variable

}

function agregarMascotaEnemigo(imagen){
    const contenedor = document.getElementById("img-mascota-enemigo")
        contenedor.insertAdjacentHTML(
          "beforeend",
          `<img src=${imagen} alt=${imagen}>`) // Backticks para img variable

}

function pintarCanvas () {
    mokeponJugador.x = mokeponJugador.x + mokeponJugador.velocidadX
    mokeponJugador.y = mokeponJugador.y + mokeponJugador.velocidadY
    lienzo.clearRect(0,0,mapa.width,mapa.height)
    lienzo.drawImage(
        mapaBackground,
        0,
        0,
        mapa.width,
        mapa.height, 

    )
    mokeponJugador.pintarMokepon()

    enviarPosicion (mokeponJugador.x , mokeponJugador.y)

    mokeponesEnemigos.forEach(function (mokepon){
        mokepon.pintarMokepon()
        revisarColision(mokepon)
    })
    
}

function enviarPosicion(x, y) {
    fetch(`http:/localhost:8080/mokepon/${jugadorId}/posicion`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            x,   
            y
        })
    })
    .then(function(res) {
        if(res.ok) {
           res.json()
               .then(function({ enemigos }){
                   console.log(enemigos)
                    mokeponesEnemigos = enemigos.map(function(enemigo){
                        let mokeponEnemigo = null
                        const mokeponNombre = enemigo.mokepon.nombre || ""
                        if (mokeponNombre === "Hipodoge") {
                            mokeponEnemigo = new Mokepon ('Hipodoge', './assets/mokepons_mokepon_hipodoge_attack.png', 5, './assets/hipodoge.png', enemigo.id)
                        } else if (mokeponNombre === "Capipepo") {
                            mokeponEnemigo = new Mokepon ('Capipepo', './assets/mokepons_mokepon_capipepo_attack.png', 5, './assets/capipepo.png', enemigo.id)
                        } else if (mokeponNombre === "Ratigueya") {
                            mokeponEnemigo = new Mokepon ('Ratigueya', './assets/mokepons_mokepon_ratigueya_attack.png', 5, './assets/ratigueya.png', enemigo.id)
                        }
                        
                        mokeponEnemigo.x = enemigo.x
                        mokeponEnemigo.y = enemigo.y
                        
                        return mokeponEnemigo
                    })

               })

        }
    })
}

function moverMascotaDerecha() {
   mokeponJugador.velocidadX =  10
   
}

function moverMascotaIzquierda() {
    mokeponJugador.velocidadX =  -10
}

 function moverMascotaArriba() {
    mokeponJugador.velocidadY =  -10
    
}

 function moverMascotaAbajo() {
    mokeponJugador.velocidadY =  10
    
}

 function detenerMovimiento () {
    mokeponJugador.velocidadX = 0
    mokeponJugador.velocidadY = 0
}

function sePresionoUnaTecla(event) {
    console.log(event.key);
   
    switch (event.key) {
        case 'ArrowUp':
                moverMascotaArriba()
            break
        case 'ArrowDown':
                moverMascotaAbajo()
            break
        case 'ArrowLeft':
                moverMascotaIzquierda()
            break
        case 'ArrowRight':
                moverMascotaDerecha()
            break

        default:
            break;
    }
}

function iniciarMapa() {
    intervalo = setInterval (pintarCanvas, 50)
    window.addEventListener('keydown', sePresionoUnaTecla)
    window.addEventListener('keyup', detenerMovimiento)
}

function revisarColision(enemigo) {
    const arribaEnemigo = enemigo.y
    const abajoEnemigo = enemigo.y + enemigo.alto
    const derechaEnemigo = enemigo.x + enemigo.ancho
    const izquierdaEnemigo = enemigo.x
    const arribaMascota = mokeponJugador.y
    const abajoMascota = mokeponJugador.y + mokeponJugador.alto
    const derechaMascota = mokeponJugador.x + mokeponJugador.ancho
    const izquierdaMascota = mokeponJugador.x
    mokeponEnemigo = enemigo

    if(
        abajoMascota < arribaEnemigo ||
        arribaMascota > abajoEnemigo ||
        derechaMascota < izquierdaEnemigo ||
        izquierdaMascota > derechaEnemigo
    ){
        return
    }
    detenerMovimiento()
    clearInterval(intervalo)
    enemigoId = enemigo.id
   // alert("Has elejido pelear contra " + enemigo.nombre + ", QUE INICIE EL DUELO")
 sectionSeleccionarAtaque.style.display = 'flex'
 sectionVerMapa.style.display ='none'
 seleccionarMascotaEnemiga (enemigo)
}
 
window.addEventListener('load', iniciarJuego)



