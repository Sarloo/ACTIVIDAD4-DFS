let token = "";
let productoEditando = null;

// ================= LOGIN =================
async function login() {

  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: user.value,
      password: pass.value
    })
  });

  const data = await res.json();

  if (!data.token) {
    alert("Credenciales incorrectas");
    return;
  }

  token = data.token;

  loginBox.style.display = "none";
  appBox.style.display = "block";

  cargar();
}

// ================= REGISTRO =================
async function registrar() {

  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: user.value,
      password: pass.value
    })
  });

  const data = await res.json();
  alert(data.mensaje);
}

// ================= LOGOUT =================
function logout() {
  token = "";
  location.reload();
}

// ================= OBTENER PRODUCTOS =================
async function cargar() {

  const res = await fetch("/api/products", {
    headers: { authorization: token }
  });

  const productos = await res.json();
  lista.innerHTML = "";

  productos.forEach(p => {
    lista.innerHTML += `
      <li>
        <strong>${p.nombre}</strong><br>
        Precio: $${p.precio}<br>
        Creado por: ${p.creadoPor?.username}<br>
        Fecha: ${new Date(p.fechaCreacion).toLocaleDateString()}<br><br>

        <button onclick="editar('${p._id}', '${p.nombre}', ${p.precio})">
          Editar
        </button>

        <button onclick="eliminar('${p._id}')">
          Eliminar
        </button>
      </li>
    `;
  });
}

// ================= CREAR / ACTUALIZAR =================
async function crear() {

  // EDITAR
  if (productoEditando) {
    await fetch(`/api/products/${productoEditando}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: token
      },
      body: JSON.stringify({
        nombre: nombre.value,
        precio: precio.value
      })
    });

    productoEditando = null;

  } else {
    // CREAR
    await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: token
      },
      body: JSON.stringify({
        nombre: nombre.value,
        precio: precio.value
      })
    });
  }

  nombre.value = "";
  precio.value = "";
  cargar();
}

// ================= EDITAR =================
function editar(id, nombreProducto, precioProducto) {

  // Guarda el ID del producto que se está editando
  productoEditando = id;

  // Coloca valores actuales en el modal
  editNombre.value = nombreProducto;
  editPrecio.value = precioProducto;

  // Muestra el modal
  modalEditar.style.display = "flex";
}

async function guardarEdicion() {

  await fetch(`/api/products/${productoEditando}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      authorization: token
    },
    body: JSON.stringify({
      nombre: editNombre.value,
      precio: editPrecio.value
    })
  });

  cerrarModal();
  cargar();
}

function cerrarModal() {
  modalEditar.style.display = "none";
  productoEditando = null;
}



// ================= ELIMINAR =================
async function eliminar(id) {

  if (!confirm("¿Eliminar producto?")) return;

  await fetch(`/api/products/${id}`, {
    method: "DELETE",
    headers: { authorization: token }
  });

  cargar();
}
