import 'leaflet/dist/leaflet.css'; // Import Leaflet styles
import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet'; // Import Leaflet for custom icons
import one from './image.png'; // Import your image
import io from 'socket.io-client';

const socket = io('http://localhost:9000'); // Connect to the Socket.IO server

// Define the custom icon
const customIcon = new L.Icon({
    iconUrl: one, // Path to your image
    iconSize: [32, 32], // Size of the icon
    iconAnchor: [16, 32], // Anchor point for the icon (center bottom)
    popupAnchor: [0, -32], // Point where the popup opens relative to the icon
});

function LiveTracker() {
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        // Listen for location updates from the server
        socket.on('locationUpdate', (data) => {
            console.log('Received location:', data);
            setLocations((prev) => [...prev, data]); // Append new location to the state
        });

        // Clean up listener on component unmount
        return () => {
            socket.off('locationUpdate');
        };
    }, []);

    return (
        <MapContainer
            center={[32.7816291, 74.8215626]} // Initial center
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: "100vh", width: "100%" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />

            {/* Render dynamic markers */}
            {locations.map((loc, index) => (
                <Marker key={index} position={[loc.lat, loc.lng]} icon={customIcon}>
                    <Popup>
                        <div>
                            <img src={one} alt="Location Icon" style={{ width: '50px', height: '50px' }} />
                            <p>Lat: {loc.lat}, Lng: {loc.lng}</p>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}

export default LiveTracker;