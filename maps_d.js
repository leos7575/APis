let map;
let marker;
let autocomplete;
let directionsService;
let directionsRenderer;

async function initMap() {
  // Imagen que se usará para el marcador
  const image = "./img/ciervo.png";

  // Cargar las bibliotecas necesarias de Google Maps
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  const { places } = await google.maps.importLibrary("places");

  // Obtener la ubicación del usuario, si falla se usa una ubicación por defecto 
  const position = await getUserLocation().catch(() => ({
    lat: 21.8141671,  // Ubicación por defecto
    lng: -102.7697579,
  }));

  // Inicializar el mapa centrado en la posición del usuario
  map = new Map(document.getElementById("map"), {
    zoom: 15,
    center: position,
    mapId: "1",
  });

  // Crear el elemento del marcador
  const markerElement = document.createElement("div");
  markerElement.innerHTML = `<img src="${image}" style="width: 40px; height: 40px;" alt="Marker" class="bounce">`;

  // Crear el marcador en el mapa
  marker = new AdvancedMarkerElement({
    map: map,
    position: position,
    content: markerElement,
    title: "Yo", 
  });

  // Inicializar el autocompletado para el campo de búsqueda
  const input = document.getElementById("search-input");
  autocomplete = new google.maps.places.Autocomplete(input);

  // Inicializar el servicio y renderizador de direcciones
  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map); // Establecer el mapa para el renderizador

  // Configurar el autocompletado para que escuche cambios
  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();

    if (place.geometry && place.geometry.location) {
      // Centrar el mapa y mover el marcador a la nueva ubicación
      map.setCenter(place.geometry.location);
      map.setZoom(15);
      marker.position = place.geometry.location;

      // Trazar la ruta desde la ubicación del usuario al lugar seleccionado
      traceRoute(position, place.geometry.location);
    } else {
      alert("Por favor, selecciona un lugar válido."); // Mensaje de alerta si no se selecciona un lugar válido
    }
  });
}

// Función para obtener la ubicación del usuario utilizando la API de geolocalización
function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      // Intentar obtener la ubicación del usuario
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          resolve(userPosition); // Resolver la promesa(el objeto) con la posición del usuario
        },
        () => {
          reject(); // Rechazar la promesa si hay un error
        }
      );
    } else {
      reject(); // Rechazar si la geolocalización no está soportada
    }
  });
}

// Función para trazar una ruta entre dos puntos (origen y destino)
function traceRoute(origin, destination) {
  // Crear un objeto de solicitud para la ruta
  const request = {
    origin: new google.maps.LatLng(origin.lat, origin.lng), // Establecer el origen
    destination: new google.maps.LatLng(destination.lat(), destination.lng()), // Establecer el destino
    travelMode: google.maps.TravelMode.DRIVING, // Modo de viaje en la doch
  };

  // Solicitar la ruta a la API de direcciones, que el profe no dijo que la activaramos y por eso no jalaba - _ -
  directionsService.route(request).then((result) => {
    directionsRenderer.setDirections(result); // Dibujar la ruta en el mapa
  }).catch((e) => {
    console.error("Error al trazar la ruta: ", e); // Mostrar error en la consola
  });
}

// Inicializar el mapa al cargar el script
initMap();
