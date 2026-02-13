// ================= ELEMENTOS =================
const loginBox = document.getElementById("loginBox");
const appBox = document.getElementById("appBox");

const user = document.getElementById("user");
const pass = document.getElementById("pass");
const accesosLista = document.getElementById("accesosLista");

const nombre = document.getElementById("nombre");
const precio = document.getElementById("precio");
const stock = document.getElementById("stock");

const lista = document.getElementById("lista");

const modalEditar = document.getElementById("modalEditar");
const editNombre = document.getElementById("editNombre");
const editPrecio = document.getElementById("editPrecio");
const editStock = document.getElementById("editStock");

let token = "";
let productoEditando = null;

// ================= ULTIMOS ACCESOS =================
async function cargarAccesos() {
  if (!accesosLista) return;

  try {
    const res = await fetch("/api/auth/access-logs");
    if (!res.ok) throw new Error("No se pudo cargar");

    const accesos = await res.json();
    accesosLista.innerHTML = "";

    if (!accesos.length) {
      accesosLista.innerHTML = `<li class="access-empty">Sin accesos recientes</li>`;
      return;
    }

    accesos.forEach((acceso) => {
      const fecha = acceso.loginAt ? new Date(acceso.loginAt).toLocaleString() : "N/A";
      accesosLista.innerHTML += `
        <li>
          <span class="access-user">${acceso.username}</span>
          <span class="access-date">${fecha}</span>
        </li>
      `;
    });
  } catch (error) {
    accesosLista.innerHTML = `<li class="access-empty">No disponible por ahora</li>`;
  }
}

// ================= LOGIN =================
window.login = async function () {

  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: user.value,
      password: pass.value
    })
  });

  const data = await res.json();

  if (!res.ok || !data.token) {
    alert(data.mensaje || "No se pudo iniciar sesión");
    return;
  }

  token = data.token;

  loginBox.style.display = "none";
  appBox.style.display = "block";

  cargar();
};

// ================= REGISTRO =================
window.registrar = async function () {

  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: user.value,
      password: pass.value
    })
  });

  const data = await res.json();
  alert(data.mensaje || "No se pudo registrar");
  cargarAccesos();
};

// ================= LOGOUT =================
window.logout = function () {
  token = "";
  location.reload();
};

// ================= OBTENER PRODUCTOS =================
async function cargar() {

  const res = await fetch("/api/products", {
    headers: { authorization: token }
  });

  const productos = await res.json();
  lista.innerHTML = "";

  productos.forEach(p => {

    const fecha = p.createdAt || p.fechaCreacion;
    const actualizado = p.updatedAt;

    lista.innerHTML += `
      <li>
        <h3>${p.nombre}</h3>

        <div class="product-info">
          <span>Creado por: ${p.creadoPor?.username || "N/A"}</span>
          <span>Fecha: ${fecha ? new Date(fecha).toLocaleString() : "N/A"}</span>
          <span>Actualizado: ${actualizado ? new Date(actualizado).toLocaleString() : "N/A"}</span>
        </div>

        <p>Precio: $${p.precio}</p>
        <p>Stock: ${p.stock ?? 0}</p>

        <div class="card-buttons">
          <button class="edit-btn"
            onclick="editar('${p._id}', '${p.nombre}', ${p.precio}, ${p.stock ?? 0})">
            Editar
          </button>

          <button class="delete-btn"
            onclick="eliminar('${p._id}')">
            X
          </button>
        </div>
      </li>
    `;
  });
}

// ================= CREAR =================
window.crear = async function () {
  const stockValue = stock.value === "" ? 0 : Number(stock.value);

  await fetch("/api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: token
    },
    body: JSON.stringify({
      nombre: nombre.value,
      precio: precio.value,
      stock: stockValue
    })
  });

  nombre.value = "";
  precio.value = "";
  stock.value = "";

  cargar();
};

// ================= EDITAR =================
window.editar = function (id, nombreProducto, precioProducto, stockProducto) {

  productoEditando = id;

  editNombre.value = nombreProducto;
  editPrecio.value = precioProducto;
  editStock.value = stockProducto;

  modalEditar.style.display = "flex";
};

// ================= GUARDAR EDICIÓN =================
window.guardarEdicion = async function () {
  const stockValue = editStock.value === "" ? 0 : Number(editStock.value);

  await fetch(`/api/products/${productoEditando}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      authorization: token
    },
    body: JSON.stringify({
      nombre: editNombre.value,
      precio: editPrecio.value,
      stock: stockValue
    })
  });

  cerrarModal();
  cargar();
};

// ================= CERRAR MODAL =================
window.cerrarModal = function () {
  modalEditar.style.display = "none";
  productoEditando = null;
};

// ================= ELIMINAR =================
window.eliminar = async function (id) {

  if (!confirm("¿Eliminar producto?")) return;

  await fetch(`/api/products/${id}`, {
    method: "DELETE",
    headers: { authorization: token }
  });

  cargar();
};

cargarAccesos();
