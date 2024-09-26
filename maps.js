let map;

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("map"), {
    center: { lat: 21.8141671, lng: -102.7697579 },
    zoom: 15,
  });
}

initMap();