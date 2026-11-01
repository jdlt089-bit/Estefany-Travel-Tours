// CONFIGURACIÓN DE FIREBASE GLOBAL
const firebaseConfig = {
    apiKey: "AIzaSyAk1O5CEgzsgvncdNwVN8W7l_mMWhjRc_Y",
    authDomain: "estefany-travel.firebaseapp.com",
    projectId: "estefany-travel",
    storageBucket: "estefany-travel.firebasestorage.app",
    messagingSenderId: "871790718558",
    appId: "1:871790718558:web:13c3de7c4064065a9f0ecf"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// CONTADOR Y DATOS DEL CARRITO CON PERSISTENCIA
let carrito = JSON.parse(localStorage.getItem("carritoEstefany")) || [];
let cantidades = {};

function cambiarCantidad(idPlan, tipo, cambio) {
    const clave = `${idPlan}-${tipo}`;
    if (!cantidades[clave]) { cantidades[clave] = tipo === "adulto" ? 1 : 0; }
    cantidades[clave] += cambio;
    if (cantidades[clave] < 0) { cantidades[clave] = 0; }
    if (tipo === "adulto" && cantidades[clave] < 1) { cantidades[clave] = 1; }
    document.getElementById(clave).innerText = cantidades[clave];
}

let planSeleccionado = null;
let adultosReserva = 1;
let ninosReserva = 0;

function calcularTotalReserva() {
    if (!planSeleccionado) return;
    let precioAdulto = parseInt(planSeleccionado.precioAdulto.replace(/\./g, ""));
    let total = adultosReserva * precioAdulto;
    let precioNinoNum = 0;
    
    if (planSeleccionado.precioNiño !== "N/A" && planSeleccionado.precioNiño) {
        precioNinoNum = parseInt(planSeleccionado.precioNiño.replace(/\./g, ""));
        total += ninosReserva * precioNinoNum;
    }
    document.getElementById("total-reserva").innerText = "Total: $" + total.toLocaleString("es-CO");
}

function abrirModalReservaPorId(idPlan) {
    let planesGuardados = window.planesDeViajeGlobal || [];
    planSeleccionado = planesGuardados.find(p => p.idFirebase === idPlan || p.id === idPlan);
    if (!planSeleccionado) return;

    adultosReserva = 1;
    ninosReserva = 0;
    if(document.getElementById("cantidad-adulto")) document.getElementById("cantidad-adulto").innerText = 1;
    if(document.getElementById("cantidad-nino")) document.getElementById("cantidad-nino").innerText = 0;
    if(document.getElementById("reserva-titulo")) document.getElementById("reserva-titulo").innerText = planSeleccionado.titulo;
    if(document.getElementById("fecha-reserva")) document.getElementById("fecha-reserva").value = "";

    if (planSeleccionado.precioNiño === "N/A" || !planSeleccionado.precioNiño) {
        if(document.getElementById("bloque-ninos")) document.getElementById("bloque-ninos").style.display = "none";
    } else {
        if(document.getElementById("bloque-ninos")) document.getElementById("bloque-ninos").style.display = "flex";
    }
    calcularTotalReserva();
    if(document.getElementById("modalReserva")) document.getElementById("modalReserva").style.display = "flex";
}

function cambiarReserva(tipo, cambio) {
    if (tipo === "adulto") {
        adultosReserva += cambio;
        if (adultosReserva < 1) adultosReserva = 1;
        document.getElementById("cantidad-adulto").innerText = adultosReserva;
    }
    if (tipo === "nino") {
        ninosReserva += cambio;
        if (ninosReserva < 0) ninosReserva = 0;
        document.getElementById("cantidad-nino").innerText = ninosReserva;
    }
    calcularTotalReserva();
}

// 🌴 LISTA MAESTRA DE ESTEFANY TRAVEL
const planesDeViaje = [
    {
        id: "oceanario", categoria: "rosario", titulo: "Oceanario (San Martín de Pajarales)", imagen: "images/oceanario.jpg", 
        precioAdulto: "160.000", precioNiño: "130.000", badge: "Familiar", badgeClass: "familiar", 
        descripcion: "Una aventura marina inolvidable! Perfecta para maravillarse con el show de delfines, tiburones y especies locales.", 
        salida: "07:30 AM desde el Muelle de la Bodeguita.", regreso: "03:30 PM aproximado al muelle.",
        incluye: ["Entrada al acuario", "Show de delfines y tiburones", "Transporte en lancha rápida", "Guía permanente"], galeria: []
    },
    {
        id: "borabora", categoria: "rosario", titulo: "Bora Bora Beach Club", imagen: "images/borabora.jpg", 
        precioAdulto: "450.000", precioNiño: "N/A", badge: "Relax", badgeClass: "vip", 
        descripcion: "¡Vive una experiencia exclusiva en el paraíso caribeño de las Islas del Rosario! Disfruta de un club de playa de lujo con música de DJ en vivo todos los días, camas de sol frente a aguas cristalinas y un ambiente vibrante solo para mayores de 18 años.", 
        salida: "07:30 am en Muelle La Bodeguita, Puerta #3 (Garantizada hasta las 8:20 am).", 
        regreso: "04:00 PM saliendo de la isla.",
        incluye: [
            "Transporte en lancha rápida, ida y vuelta",
            "Cóctel de bienvenida especial",
            "Cama de playa o asoleadora",
            "5 opciones de almuerzo a elección",
            "DJ todos los días",
            "⚠️ Solo mayores de 18 años (+18). No incluye tasa portuaria ni seguro."
        ], 
        galeria: []
    },
    {
        id: "baru-lancha", categoria: "baru", titulo: "Playa Tranquila Premium", imagen: "images/playa-tranquila.jpg",
        precioAdulto: "330.000", precioNiño: "285.000", badge: "Relax", badgeClass: "relax", 
        descripcion: "Llega navegando velozmente a una zona exclusiva y más tranquila en Barú. Disfruta de aguas calmadas y confort.", 
        salida: "08:00 AM desde el muelle.", regreso: "03:45 PM volviendo en lancha.",
        incluye: ["Cóctel de bienvenida", "Transporte marítimo en lancha rápida", "Carpa o cama de sol", "Almuerzo caribeño"], galeria: []
    },
    {
        id: "punta-arena", categoria: "cercanas", titulo: "Punta Arena", imagen: "images/punta-arena.jpg",
        precioAdulto: "125.000", precioNiño: "110.000", badge: "Cerca", badgeClass: "relax", 
        descripcion: "A solo 10 minutos de Cartagena. Disfruta de una playa espectacular con vista a los rascacielos de Bocagrande.", 
        salida: "09:00 AM desde Castillogrande.", regreso: "04:00 PM retorno de la isla.",
        incluye: ["Cóctel de bienvenida", "Transporte en lancha ida y vuelta", "Uso de carpas y sillas", "Almuerzo típico"], galeria: []
    },
    {
        id: "chiva-tour", categoria: "tours", titulo: "City Tour en Chiva", imagen: "images/chiva-tour.jpg",
        precioAdulto: "85.000", precioNiño: "65.000", badge: "Familiar", badgeClass: "familiar", 
        descripcion: "Un recorrido cultural y panorámico por los lugares más emblemáticos e históricos de Cartagena de Indias.", 
        salida: "02:00 PM recogida en hoteles.", regreso: "06:00 PM fin del recorrido.",
        incluye: ["Tour en chiva típica", "Guía profesional animador", "Entrada a sitios de interés"], galeria: []
    },
    {
        id: "hotel-ejemplo", categoria: "hoteles", titulo: "Hotel Las Américas Resort", imagen: "images/isla-grande.jpg",
        precioAdulto: "450.000", precioNiño: "300.000", badge: "Hotel", badgeClass: "vip", 
        descripcion: "Alojamiento de lujo frente al mar con piscinas, restaurantes exclusivos y confort total para tu descanso.", 
        salida: "Check-in: 03:00 PM", regreso: "Check-out: 01:00 PM",
        incluye: ["Desayuno buffet", "Acceso a piscinas y playa", "Wi-Fi de alta velocidad"], galeria: []
    }
];

window.planesDeViajeGlobal = [];

function renderizarTarjetasPlanes(listaFinal) {
    window.planesDeViajeGlobal = listaFinal;
    const categorias = ["rosario", "baru", "cercanas", "tours", "hoteles", "paquetes"];

    categorias.forEach(cat => {
        const planesCat = listaFinal.filter(p => p.categoria === cat);
        const cont1 = document.getElementById(`contenedor-${cat}-1`);
        const cont2 = document.getElementById(`contenedor-${cat}-2`);

        let html1 = "";
        let html2 = "";

        planesCat.forEach((plan, index) => {
            let identificador = plan.idFirebase || plan.id;
            const tarjeta = `
            <div class="card-wrapper">
                <div class="card" style="background-image:url('${plan.imagen}');">
                    <div class="card-overlay">
                        <span class="badge ${plan.badgeClass || 'vip'}">${plan.badge || 'VIP'}</span>
                        <h4 onclick="mostrarDetalles('${identificador}')" style="cursor: pointer;" title="Ver detalles">${plan.titulo}</h4>
                        <div class="precios">
                            <div class="precio-item"><span>Adulto</span><strong>$${plan.precioAdulto}</strong></div>
                            <div class="precio-item"><span>Niño</span><strong>$${plan.precioNiño}</strong></div>
                        </div>
                    </div>
                </div>
                <div class="acciones-card-externas">
                    <button class="icon-btn whatsapp-btn" onclick="window.open('https://wa.me/573215062703?text=Hola,%20solicito%20info%20del%20plan%20${encodeURIComponent(plan.titulo)}')" title="Consultar por WhatsApp"><img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp"></button>
                    <button class="icon-btn btn-info" onclick="mostrarDetalles('${identificador}')" title="Ver detalles"><i class="fas fa-circle-info"></i></button>
                </div>
            </div>`;

            if (index % 2 === 0) {
                html1 += tarjeta;
            } else {
                html2 += tarjeta;
            }
        });

        if (cont1) cont1.innerHTML = html1;
        if (cont2) cont2.innerHTML = html2;
    });
}

// INYECTAR BANNERS Y PLANES AL CARGAR
document.addEventListener("DOMContentLoaded", async () => {
    const contenedorBanners = document.getElementById("contenedor-hero-banners");
    if (contenedorBanners) {
        let bannersGuardados = JSON.parse(localStorage.getItem("bannersPromos")) || [];
        
        let htmlBanners = `
        <div class="hero-banner-item">
            <div class="hero">
                <div class="hero-content">
                    <h2 class="hero-title">
                        🌊 Descubre Tu
                        <span>Próxima Aventura</span>
                    </h2>
                    <div class="hero-divider"></div>
                    <p>Explora islas paradisíacas, disfruta alojamientos pensados para ti...</p>
                </div>
            </div>
        </div>`;

        bannersGuardados.forEach(fotoFlyer => {
            htmlBanners += `
            <div class="hero-banner-item">
                <div class="hero flyer-promocional" onclick="abrirLightboxBanner('${fotoFlyer}')" style="cursor: pointer;" title="Toca para ampliar flyer">
                    <img src="${fotoFlyer}" alt="Flyer Promocional">
                </div>
            </div>`;
        });

        contenedorBanners.innerHTML = htmlBanners;
    }

    // 1. PRIMERO CARGAR DEL LOCALSTORAGE PARA QUE NUNCA QUEDE EN BLANCO
    let planesGuardados = [];
    try {
        planesGuardados = JSON.parse(localStorage.getItem("planesExtra")) || [];
    } catch (e) {}

    let listaLocal = [];
    planesDeViaje.forEach(planBase => {
        let planEditado = planesGuardados.find(p => p.id === planBase.id);
        listaLocal.push(planEditado || planBase);
    });
    planesGuardados.forEach(planG => {
        if (!planesDeViaje.find(p => p.id === planG.id)) listaLocal.push(planG);
    });

    renderizarTarjetasPlanes(listaLocal);

    // 2. DESPUÉS CONSULTAR LA NUBE DE FIRESTORE EN SEGUNDO PLANO
    try {
        const querySnapshot = await db.collection("planes").get();
        if (!querySnapshot.empty) {
            let listaNube = [];
            querySnapshot.forEach((doc) => {
                listaNube.push({ idFirebase: doc.id, ...doc.data() });
            });
            // Si hay planes en la nube, actualizamos la vista con los de la nube
            renderizarTarjetasPlanes(listaNube);
        }
    } catch (e) {
        console.log("Usando datos locales por error de conexión con la nube:", e);
    }

    actualizarCarrito();
});

// NAVEGACIÓN Y CARRITO CON PERSISTENCIA
function mostrarDetalles(idPlan) { window.location.href = `detalle.html?id=${idPlan}`; }
function cerrarModal() { document.getElementById('infoModal').style.display = 'none'; }
function cerrarReserva() { document.getElementById("modalReserva").style.display = "none"; }

function confirmarReserva() {
    const fecha = document.getElementById("fecha-reserva").value;
    if (!fecha) { alert("Por favor selecciona una fecha para tu reserva."); return; }
    if (!planSeleccionado) return;

    let precioAdulto = parseInt(planSeleccionado.precioAdulto.replace(/\./g, ""));
    let subtotalAdultos = adultosReserva * precioAdulto;
    let subtotalNinos = 0;
    let precioNinoNum = 0;

    if (planSeleccionado.precioNiño !== "N/A" && planSeleccionado.precioNiño) {
        precioNinoNum = parseInt(planSeleccionado.precioNiño.replace(/\./g, ""));
        subtotalNinos = ninosReserva * precioNinoNum;
    }

    let total = subtotalAdultos + subtotalNinos;
    let existente = carrito.find(item => item.titulo === planSeleccionado.titulo && item.fecha === fecha);

    if (existente) {
        existente.adultos += adultosReserva;
        existente.ninos += ninosReserva;
        existente.total = (existente.adultos * precioAdulto) + (existente.ninos * precioNinoNum);
    } else {
        carrito.push({ titulo: planSeleccionado.titulo, adultos: adultosReserva, ninos: ninosReserva, fecha: fecha, precioAdulto: precioAdulto, precioNino: precioNinoNum, total: total });
    }

    localStorage.setItem("carritoEstefany", JSON.stringify(carrito));
    cerrarReserva(); 
    actualizarCarrito();
    document.getElementById("panel-carrito").style.display = "block";
}

function comprarPorWhatsApp() {
    const fecha = document.getElementById("fecha-reserva").value;
    if (!fecha) { alert("Por favor selecciona una fecha para tu reserva."); return; }
    if (!planSeleccionado) return;

    let precioAdulto = parseInt(planSeleccionado.precioAdulto.replace(/\./g, ""));
    let subtotalAdultos = adultosReserva * precioAdulto;
    let subtotalNinos = 0;
    if (planSeleccionado.precioNiño !== "N/A" && planSeleccionado.precioNiño) {
        subtotalNinos = ninosReserva * parseInt(planSeleccionado.precioNiño.replace(/\./g, ""));
    }
    let total = subtotalAdultos + subtotalNinos;

    const detalle = `Hola Estefany Travel & Tours, quiero reservar:\n\n🌴 *${planSeleccionado.titulo}*\n👤 Adultos: ${adultosReserva}\n👦 Niños: ${ninosReserva}\n📅 Fecha: ${fecha}\n💰 Total: $${total.toLocaleString("es-CO")}\n\n¿Me confirman disponibilidad por favor?`;
    window.open(`https://wa.me/573215062703?text=${encodeURIComponent(detalle)}`, "_blank");
    cerrarReserva();
}

function comprarCarritoPorWhatsApp() {
    if (carrito.length === 0) { alert("Tu carrito está vacío."); return; }
    let mensaje = "Hola Estefany Travel & Tours, quiero confirmar la siguiente compra:\n\n";
    let totalGeneral = 0;

    carrito.forEach((item) => {
        totalGeneral += item.total;
        mensaje += `🔹 *${item.titulo}*\n`;
        if (item.adultos > 0) mensaje += `   - Adultos: ${item.adultos}\n`;
        if (item.ninos > 0) mensaje += `   - Niños: ${item.ninos}\n`;
        if (item.fecha) mensaje += `   - Fecha: ${item.fecha}\n`;
        mensaje += `   - Subtotal: $${item.total.toLocaleString("es-CO")}\n\n`;
    });

    mensaje += `💰 *TOTAL A PAGAR: $${totalGeneral.toLocaleString("es-CO")}*\n\nQuedo atento para coordinar el pago y la reserva. ¡Gracias!`;
    window.open(`https://wa.me/573215062703?text=${encodeURIComponent(mensaje)}`, "_blank");
}

function modificarCantidadCarrito(index, tipo, cambio) {
    let item = carrito[index];
    if (tipo === "adulto") { item.adultos += cambio; if (item.adultos < 1) item.adultos = 1; }
    if (tipo === "nino") { item.ninos += cambio; if (item.ninos < 0) item.ninos = 0; }
    item.total = (item.adultos * item.precioAdulto) + (item.ninos * item.precioNino);
    localStorage.setItem("carritoEstefany", JSON.stringify(carrito));
    actualizarCarrito();
}

function toggleCarrito() {
    const panel = document.getElementById("panel-carrito");
    if(panel) {
        panel.style.display = (panel.style.display === "block") ? "none" : "block";
    }
}

function cerrarCarrito() { 
    const panel = document.getElementById("panel-carrito");
    if(panel) panel.style.display = "none"; 
}

function actualizarCarrito() {
    const lista = document.getElementById("lista-carrito");
    const total = document.getElementById("total-carrito");
    if (!lista || !total) return;

    if (carrito.length === 0) {
        lista.innerHTML = "<p>Tu carrito está vacío.</p>";
        total.innerText = "$0";
        if(document.getElementById('carrito-contador')) document.getElementById('carrito-contador').innerText = "0";
        return;
    }
    lista.innerHTML = ""; let totalGeneral = 0;
    carrito.forEach((item, index) => {
        totalGeneral += item.total;
        lista.innerHTML += `
        <div style="background:white; border-radius:12px; padding:12px; margin-bottom:10px; box-shadow:0 2px 10px rgba(0,0,0,.08);">
            <strong>${item.titulo}</strong>
            <p style="font-size: 12px; color: #666; margin: 4px 0;">📅 Fecha: ${item.fecha}</p>
            <div class="fila-carrito"><span>👤 Adultos</span><div class="control-carrito"><button onclick="modificarCantidadCarrito(${index}, 'adulto', -1)">−</button><strong>${item.adultos}</strong><button onclick="modificarCantidadCarrito(${index}, 'adulto', 1)">+</button></div></div>
            <div class="fila-carrito"><span>👦 Niños</span><div class="control-carrito"><button onclick="modificarCantidadCarrito(${index}, 'nino', -1)">−</button><strong>${item.ninos}</strong><button onclick="modificarCantidadCarrito(${index}, 'nino', 1)">+</button></div></div>
            <p style="margin-top: 6px; font-size: 13px;">💰 Total: <strong>$${item.total.toLocaleString("es-CO")}</strong></p>
            <button onclick="eliminarDelCarrito(${index})" style="background:#e53935; color:white; border:none; padding:6px 10px; border-radius:8px; cursor:pointer; margin-top: 8px; font-size: 11px;">Eliminar</button>
        </div>`;
    });
    total.innerText = "$" + totalGeneral.toLocaleString("es-CO");
    if(document.getElementById('carrito-contador')) document.getElementById('carrito-contador').innerText = carrito.length;
}

window.onload = function() {
    const panel = document.getElementById("panel-carrito");
    if (panel) panel.style.display = "none";
    actualizarCarrito();
};

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    localStorage.setItem("carritoEstefany", JSON.stringify(carrito));
    if(document.getElementById('carrito-contador')) document.getElementById('carrito-contador').innerText = carrito.length;
    actualizarCarrito();
}

function abrirMenu() {
    const menu = document.getElementById("menu-lateral");
    const overlay = document.getElementById("overlay");
    if (menu) menu.style.left = "0";
    if (overlay) overlay.style.display = "block";
}

function cerrarMenu() {
    const menu = document.getElementById("menu-lateral");
    const overlay = document.getElementById("overlay");
    if (menu) menu.style.left = "-250px";
    if (overlay) overlay.style.display = "none";
}
