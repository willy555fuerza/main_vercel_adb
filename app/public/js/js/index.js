const baseURL = 'http://localhost:3009';

const obtenerTokenre = () => {
  // Hacer una solicitud HTTP al servidor para obtener el token
  const token = localStorage.getItem("token");
  if (!token) {
    // Si el token no está presente, redirigir al usuario a la página de inicio de sesión
    window.location.href = `${baseURL}/login`;
    return; // Detener la ejecución del código
  }
  return token;
};

// Función para obtener el token del servidor
const obtenerToken = async () => {
    try {
      // Hacer una solicitud HTTP al servidor para obtener el token
      const token = obtenerTokenre();
      const respuesta = await fetch(`${baseURL}/usuario_aut`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include' // Incluir cookies en la solicitud
      });
  
      // Verificar si la respuesta fue exitosa (código de estado 200)
      if (respuesta.ok) {
        const datosUsuario = await respuesta.json();
        console.log(datosUsuario)
        // Mostrar los datos en un formulario
        mostrarDatosEnFormulario(datosUsuario);
      } else {
        console.error('Error al obtener el token:', respuesta.statusText);
      }
    } catch (error) {
      console.error('Error al obtener el token:', error.message);
    }
  };
  
  // Función para mostrar los datos en un formulario HTML
  const mostrarDatosEnFormulario = (datosUsuario) => {
  
      const userNavTop = document.getElementById('usernavtop');
      const userNav = document.getElementById('usernav');
      const perfi = document.getElementById('perfi');
  
      // Obtener los datos del usuario
      let { nombres, apellidos, perfil } = datosUsuario;
  
      // Convertir la primera letra de cada palabra a mayúscula y el resto a minúscula
      nombres = nombres.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
      apellidos = apellidos.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
      perfill = perfil.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  
  
      // Obtener el primer nombre y el primer apellido
      const primerNombre = nombres.split(' ')[0];
      const primerApellido = apellidos.split(' ')[0];
  
  
      // Establecer el valor del span con el nombre del usuario
      userNavTop.textContent = `${primerNombre} ${primerApellido}`;
  
      // Establecer el valor del h6 con el nombre del usuario
      userNav.textContent = `${primerNombre} ${primerApellido}`;
  
      perfi.textContent = `${perfill}`;
  };
  // Llamar a la función para obtener el token
  obtenerToken();
  



  const fetchData = async () => {
    try {
      const token = obtenerTokenre();
        
        // Hacer solicitudes para obtener los datos
        const [usuariosRes, tipo_ingresosRes] = await Promise.all([
            fetch(`${baseURL}/usuarios/count`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }),
            fetch(`${baseURL}/tipo_ingresos/count`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }),
       /*      fetch(`${baseURL}/productos/count`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }), */
           /*  fetch(`${baseURL}/ventas/count`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }) */
        ]);

        // Verificar si todas las respuestas son exitosas
        if (usuariosRes.ok && tipo_ingresosRes.ok ) {
            const usuariosData = await usuariosRes.json();
            const tipo_ingresosData = await tipo_ingresosRes.json();
           /*  const productosData = await productosRes.json();
            const ventasData = await ventasRes.json(); */

            // Actualizar los elementos HTML con los datos recibidos
            document.getElementById('usuario').textContent = usuariosData.count;
            document.getElementById('tipo_ingreso').textContent = tipo_ingresosData.count;
         /*    document.getElementById('productos').textContent = productosData.count;
            document.getElementById('ventas').textContent = ventasData.count; */
        } else {
            throw new Error('Error al obtener los datos');
        }
    } catch (error) {
        console.error('Error al obtener los datos:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al obtener los datos'
        });
    }
};

// Llamar a la función fetchData cuando se cargue la página
window.onload = fetchData;













  //*************************************notificaciones**************************************/
  
  const getAllProducto = async () => {
    try {
        // Verificar si el token está presente en el localStorage
        const token = obtenerTokenre();
        const response = await fetch(`${baseURL}/productos_stock`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        if (!response.ok) {
            throw new Error("Error en la solicitud");
        }
        const result = await response.json();
        //console.log(result.data)
        if (result.error) {
            console.error("Error:", result.message);
            return [];
        } else {
            return result.data;
        }
    } catch (error) {
        console.error("Error:", error.message);
        return [];
    }
};
  
document.addEventListener('DOMContentLoaded', async (event) => {
  const notificationBadge = document.getElementById('notification-badge');
  const notificationLink = document.getElementById('notification-link');
  const notificationBell = document.getElementById('notification-bell');
  const notificationContent = document.getElementById('notification-content');

  function showNotificationBadge() {
    notificationBadge.style.display = 'block';
  }

  function hideNotificationBadge() {
    notificationBadge.style.display = 'none';
  }

  const productos = await getAllProducto();
  const productosBajoStock = productos.filter(producto => producto.stock < 5);

  if (productosBajoStock.length > 0) {
    showNotificationBadge();
    notificationBell.classList.add('shake');
    notificationContent.innerHTML = ''; // Limpiar el contenido de notificaciones

    const notificationTimes = JSON.parse(localStorage.getItem('notificationTimes')) || {};

    productosBajoStock.forEach(producto => {
      if (!notificationTimes[producto.id_producto]) {
        notificationTimes[producto.id_producto] = new Date().toISOString();
      }
    });

    localStorage.setItem('notificationTimes', JSON.stringify(notificationTimes));

    const calculateTimeElapsed = (startTime) => {
      const currentTime = new Date();
      const startTimeDate = new Date(startTime);
      const diffTime = Math.abs(currentTime - startTimeDate);
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 0) {
        return `Hace ${diffDays} dia${diffDays > 1 ? 's' : ''}`;
      } else if (diffHours > 0) {
        return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
      } else {
        return `Hace ${diffMinutes} minuto${diffMinutes > 1 ? 's' : ''}`;
      }
    };

    productosBajoStock.forEach(producto => {
      const notificationItem = document.createElement('a');
      notificationItem.href = "/productos";
      notificationItem.className = "dropdown-item";
      const timeElapsed = document.createElement('small');

      timeElapsed.textContent = calculateTimeElapsed(notificationTimes[producto.id_producto]);
      setInterval(() => {
        timeElapsed.textContent = calculateTimeElapsed(notificationTimes[producto.id_producto]);
      }, 60000); // Actualizar cada minuto

      notificationItem.innerHTML = `
        <h6 class="fw-normal mb-0">${producto.nombre_producto}: <br> ${producto.stock} en stock</h6>
      `;
      notificationItem.appendChild(timeElapsed);
      notificationContent.appendChild(notificationItem);

      const divider = document.createElement('hr');
      divider.className = "dropdown-divider";
      notificationContent.appendChild(divider);
    });

    /* const seeAllItem = document.createElement('a');
    seeAllItem.href = "#";
    seeAllItem.className = "dropdown-item text-center";
    seeAllItem.textContent = "See all notifications";
    notificationContent.appendChild(seeAllItem); */
  } else {
    localStorage.removeItem('notificationTime');
    hideNotificationBadge();
    notificationBell.classList.remove('shake');
  }

  notificationLink.addEventListener('click', () => {
    notificationBell.classList.remove('shake');
    hideNotificationBadge();
  });
});

  //*************************************notificaciones**************************************/
