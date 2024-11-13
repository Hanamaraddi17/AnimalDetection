import React, { useEffect, useState } from 'react';    
import Navbar from '../components/Navbar';
import axios from 'axios';
import { AiOutlineSearch } from 'react-icons/ai';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Utility function to fetch location name based on latitude and longitude
const getLocationName = async (latitude, longitude) => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`;

    try {
        const response = await axios.get(url);
        const data = response.data;

        if (data && data.address) {
            const address = data.address;

            // Capture more detailed address components
            const detailedAddress = [
                address.house_number || '', // Street number
                address.road || '',         // Street name
                address.neighbourhood || '', // Area/Neighborhood
                address.suburb || '',       // Suburb
                address.city || '',         // City
                address.city_district || '', // District or City district
                address.state || '',        // State/Province
                address.postcode || '',     // Postal code
                address.country || ''       // Country
            ]
            .filter(Boolean)  // Filter out empty values
            .join(', ');      // Join components into a full address string

            return detailedAddress || 'Unknown Location';
        }
        return 'Unknown Location';
    } catch (error) {
        console.error('Error fetching location name:', error);
        return 'Error retrieving location';
    }
};

function Dashboard() {
    const [images, setImages] = useState([]);
    const [filteredImages, setFilteredImages] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [locationNames, setLocationNames] = useState({});

    useEffect(() => {
        const fetchImages = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No authentication token found.');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get('http://localhost:5000/data/', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setImages(response.data);
                setFilteredImages(response.data);

                // Fetch location names for each image
                const locationPromises = response.data.map(async (img) => {
                    if (img.location?.latitude && img.location?.longitude) {
                        const locationName = await getLocationName(img.location.latitude, img.location.longitude);
                        return { imageId: img._id, locationName };
                    }
                    return null;
                });

                // Resolve all location name requests
                const locations = await Promise.all(locationPromises);

                // Update the location names state
                const locationMap = locations.reduce((acc, { imageId, locationName }) => {
                    if (imageId) acc[imageId] = locationName;
                    return acc;
                }, {});

                setLocationNames(locationMap);
            } catch (err) {
                setError('Failed to fetch images.');
                console.error('Error fetching images:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, []);

    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);

        if (term === '') {
            setFilteredImages(images);
        } else {
            const filtered = images.filter((image) =>
                image.animalName.toLowerCase().includes(term.toLowerCase())
            );
            setFilteredImages(filtered);
        }
    };

    // Map for adjusting the view to the markers' bounds
    function MapView({ locations }) {
        const map = useMap();

        useEffect(() => {
            if (locations.length > 0) {
                // Filter out locations that don't have valid latitude and longitude
                const validLocations = locations.filter(loc => loc.latitude && loc.longitude);
                if (validLocations.length > 0) {
                    const bounds = L.latLngBounds(validLocations.map(loc => [loc.latitude, loc.longitude]));
                    map.fitBounds(bounds); // Fit the map to show the markers only
                }
            }
        }, [locations, map]);

        return null;
    }

    return (
        <>
            <Navbar />
            <div className="p-8 bg-gray-900 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-white mb-6">Animal Detection Dashboard</h2>

                    {error && <div className="text-red-500 mb-4 text-lg">{error}</div>}

                    {/* Map with Dynamic Locations */}
                    <MapContainer
                        center={[20, 0]} // Default center
                        zoom={13} // Default zoom level; will adjust once bounds are set
                        style={{ height: '400px', width: '100%', marginBottom: '2rem' }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />

                        {/* Update the map with dynamic locations */}
                        <MapView
                            locations={filteredImages
                                .filter(img => img.location?.latitude && img.location?.longitude)
                                .map(img => img.location)} 
                        />

                        {filteredImages.map((img) => (
                            img.location && img.location.latitude && img.location.longitude && (
                                <Marker
                                    key={img._id}
                                    position={[img.location.latitude, img.location.longitude]}
                                >
                                    <Popup>
                                        <strong>{img.animalName}</strong>
                                        <br />
                                        Time: {new Date(img.time).toLocaleString()}
                                        <br />
                                        Location: {locationNames[img._id] || 'Loading...'}
                                    </Popup>
                                </Marker>
                            )
                        ))}
                    </MapContainer>

                    {/* Search Input */}
                    <div className="mb-6 max-w-xl mx-auto flex items-center bg-gray-800 rounded-lg p-2">
                        <AiOutlineSearch className="text-white mr-3" size={24} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Search by Animal Name"
                            className="bg-gray-800 text-white placeholder-gray-500 border-none focus:outline-none w-full"
                        />
                    </div>

                    {loading ? (
                        <div className="text-center text-lg text-gray-400">Loading...</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredImages.length > 0 ? (
                                filteredImages.map((img) => (
                                    <div key={img._id} className="border rounded-lg shadow-lg overflow-hidden bg-white">
                                        <img src={img.image} alt={img.animalName} className="w-full h-40 object-cover" />
                                        <div className="p-4">
                                            <p className="text-center text-xl font-semibold text-gray-800">{img.animalName}</p>
                                            <p className="text-center text-sm text-gray-500">
                                                Time: {new Date(img.time).toLocaleString()}
                                            </p>
                                            <p className="text-center text-sm text-gray-500">
                                                Location: {locationNames[img._id] || 'Loading...'}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-lg text-red-500">No animals found.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default Dashboard;