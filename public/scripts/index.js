document.addEventListener('DOMContentLoaded', async () => {
    const locations = await collectLocations(200);
    const map = mountMap('map');
    const infoWindow = new google.maps.InfoWindow();

    createMarkers(map, infoWindow, locations);
});

async function collectLocations(limit) {
    const db = firebase.firestore();
    const snapshot = await db.collection('properties').orderBy('country_id').limit(limit).get();

    return snapshot.docs.map(doc => {
        const {latitude, longitude, name, pic_image_url, prefecture, tags, property_room_types} = doc.data();

        return {
            id: doc.id,
            position: {
                lat: Number(latitude),
                lng: Number(longitude)
            },
            title: name,
            pic_image_url,
            prefecture,
            tags,
            property_room_types
        }
    });
}

function mountMap(elementId) {
    return new google.maps.Map(document.getElementById(elementId), {
        center: { lat: 35.652832, lng: 139.839478 },
        zoom: 8
    });
}

function createMarkers(map, infoWindow, locations) {
    return locations.map(l => {
        const marker = new google.maps.Marker({ map, ...l });

        marker.addListener('click', () => {
            infoWindow.close();
            infoWindow.setContent(`<img src='${l.pic_image_url}' /><br>
                <a href="https://www.hafh.com/properties/${l.id}"><h3>${l.title}</h3></a>
                ${l.prefecture}<br>
                ${l.tags.map(t => t.name).join(' ')}
                <ul>${l.property_room_types.map(room => `<li>${room.name} - ${room.coin_range[0]}コイン</li>`).join('')}</ul>`);
            infoWindow.open({ anchor: marker, map });
        });
        return marker;
    });
}
            // const li = document.createElement('li');

            // li.appendChild(document.createTextNode(doc.data().name));
            // document.querySelector('#list').appendChild(li);    