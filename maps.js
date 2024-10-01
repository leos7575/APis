let map;
let marker;
let autocomplete;

async function initMap() {
  // Ubicación inicial (Uluru)
  const position = { lat: 21.8141671, lng: -102.7697579 };

  // Cargar bibliotecas necesarias.
  //@ts-ignore
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  const { places } = await google.maps.importLibrary("places");

  // Inicializar el mapa, centrado en la posición de Uluru
  map = new Map(document.getElementById("map"), {
    zoom: 15,
    center: position,
    mapId: "1",
  });

  // Crear un marcador en la posición inicial
  marker = new AdvancedMarkerElement({
    map: map,
    position: position,
    title: "Uluru",
  });

  // Inicializar el autocompletado
  const input = document.getElementById("search-input");
  autocomplete = new google.maps.places.Autocomplete(input);
  
  // Configurar el autocompletado para escuchar los cambios
  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();

    // Si el lugar tiene una ubicación válida, mover el mapa y el marcador
    if (place.geometry && place.geometry.location) {
      map.setCenter(place.geometry.location);
      map.setZoom(15);

      // Actualizar la posición del marcador
      marker.position = place.geometry.location;
    }
  });
}

initMap();
