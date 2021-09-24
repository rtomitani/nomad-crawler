let map;
let locations;
let markers;
let infoWindow;

document.addEventListener('DOMContentLoaded', () => {
    const db = firebase.firestore();

    db.collection('properties').get().then(q => {
        locations = [];

        q.forEach(doc => {
            const li = document.createElement('li');

            li.appendChild(document.createTextNode(doc.data().name));
            document.querySelector('#list').appendChild(li);    

            locations.push({
                position: {
                    lat: Number(doc.data().latitude),
                    lng: Number(doc.data().longitude)
                },
                title: doc.data().name
            });
        });

        tryMarkers();
    });
});

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 35.652832, lng: 139.839478 },
        zoom: 8
    });

    tryMarkers();
}

function tryMarkers() {
    if(!markers && map && locations) {
        infoWindow = new google.maps.InfoWindow();
        markers = locations.map(l => {
            const marker = new google.maps.Marker({map, ...l});

            marker.addListener('click', () => {
                infoWindow.close();
                infoWindow.setContent(``);
                infoWindow.open({anchor: marker, map});
            });
            return marker;
        });
    }
}