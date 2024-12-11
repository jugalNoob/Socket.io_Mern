import 'leaflet/dist/leaflet.css'; // Import Leaflet styles
import React, { useEffect, useState } from 'react';
import { CircleMarker, MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'; // Importing from react-leaflet
import io from 'socket.io-client';

const socket = io('http://localhost:9000'); // Connect to the Socket.IO server

function Leaflet() {
    const [currentPosition, setCurrentPosition] = useState({ lat: 0, lng: 0 }); // Initial position
    const [markers, setMarkers] = useState({}); // Dynamic markers for users

    // Send user location via Geolocation API
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    console.log("Location sent:", latitude, longitude);

                    // Emit the location to the server
                    socket.emit('send-location', { id: 'user-id', latitude, longitude });

                    // Update local position
                    setCurrentPosition({ lat: latitude, lng: longitude });
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
            const { id, latitude, longitude } = data;

            // Dynamically update markers based on user ID
            setMarkers((prevMarkers) => ({
                ...prevMarkers,
                [id]: { lat: latitude, lng: longitude },
            }));
        });

        return () => {
            socket.off('receive-location'); // Clean up listener
        };
    }, []);

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
                <Popup>Your current location</Popup>
            </Marker>

            {/* Dynamic Markers for Other Users */}
            {Object.entries(markers).map(([id, { lat, lng }]) => (
                <Marker key={id} position={[lat, lng]}>
                    <Popup>User ID: {id}</Popup>
                </Marker>
            ))}

            {/* CircleMarker for user's area */}
            <CircleMarker
                center={[currentPosition.lat, currentPosition.lng]}
                pathOptions={{ color: 'blue' }}
                radius={10}
            >
                <Popup>Your area</Popup>
            </CircleMarker>
        </MapContainer>
    );
}

export default Leaflet;


/// without market 

import 'leaflet/dist/leaflet.css'; // Import Leaflet styles
import React, { useEffect, useState } from 'react';
import { CircleMarker, MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'; // Importing from react-leaflet
import io from 'socket.io-client';

const socket = io('http://localhost:9000'); // Connect to the Socket.IO server

function Leaflet() {
    const [currentPosition, setCurrentPosition] = useState({ lat: 0, lng: 0 }); // Initial position

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
                <Popup>Your current location</Popup>
            </Marker>

            {/* CircleMarker for user's area */}
            <CircleMarker
                center={[currentPosition.lat, currentPosition.lng]}
                pathOptions={{ color: 'blue' }}
                radius={10}
            >
                <Popup>Your area</Popup>
            </CircleMarker>
        </MapContainer>
    );
}

export default Leaflet;
