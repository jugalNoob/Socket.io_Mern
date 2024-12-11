import 'leaflet/dist/leaflet.css'; // Import Leaflet styles
import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'; // Importing from react-leaflet
import io from 'socket.io-client';

const socket = io('http://localhost:9000'); // Connect to the Socket.IO server

function Leaflet() {
    const [currentPosition, setCurrentPosition] = useState(null); // Initial position is null
    const [loading, setLoading] = useState(true); // Track loading state

    // Send user location via Geolocation API
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    console.log("Location sent:", latitude, longitude);

                    // Emit the location to the server
                    socket.emit('send-location', { latitude, longitude });

                    // Update local position
                    setCurrentPosition({ lat: latitude, lng: longitude });

                    // Set loading to false once position is available
                    setLoading(false);
                },
                (error) => {
                    console.error("Error getting location:", error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0,
                }
            );
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }, []);

    // Listen for updates from the server
    useEffect(() => {
        socket.on('receive-location', (data) => {
            console.log("Received location:", data);
            const { latitude, longitude } = data;

            // Update position with received data
            setCurrentPosition({ lat: latitude, lng: longitude });
        });

        return () => {
            socket.off('receive-location'); // Clean up listener
        };
    }, []);

    // Return a loading message while waiting for the user's location
    if (loading || !currentPosition) {
        return <div>Loading map...</div>;
    }

    return (
        <MapContainer
            center={[currentPosition.lat, currentPosition.lng]} // Center on user's position
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: "100vh", width: "100%" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />

            {/* Marker for user's current location */}
            <Marker position={[currentPosition.lat, currentPosition.lng]}>
    <Popup>{`Latitude: ${currentPosition.lat}, Longitude: ${currentPosition.lng}`}</Popup>
</Marker>


         
          {/* Dynamic Markers for other users */}
        </MapContainer>
    );
}

export default Leaflet;
