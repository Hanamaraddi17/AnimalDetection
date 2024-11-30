import React, { useEffect, useState } from 'react'; 
import Navbar from '../components/Navbar';
import { AiOutlineSearch } from 'react-icons/ai';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { fetchAnimalImages, deleteAnimalImage } from '../services/api'; // Import the API function
import axios from 'axios';
import { MdDelete } from "react-icons/md";


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

            const detailedAddress = [
                address.house_number || '',
                address.road || '',
                address.neighbourhood || '',
                address.suburb || '',
                address.city || '',
                address.city_district || '',
                address.state || '',
                address.postcode || '',
                address.country || ''
            ]
                .filter(Boolean)
                .join(', ');

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
                const response = await fetchAnimalImages(token); // Use the new API function
                setImages(response.data);
                setFilteredImages(response.data);

                const locationPromises = response.data.map(async (img) => {
                    if (img.location?.latitude && img.location?.longitude) {
                        const locationName = await getLocationName(img.location.latitude, img.location.longitude);
                        return { imageId: img._id, locationName };
                    }
                    return null;
                });

                const locations = await Promise.all(locationPromises);

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

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No authentication token found.');
            return;
        }

        try {
            // Call the API function to delete the image
            const response = await deleteAnimalImage(id);

            // If the deletion is successful, update the state to remove the image
            if (response.status === 200) {
                setImages((prev) => prev.filter((img) => img._id !== id));
                setFilteredImages((prev) => prev.filter((img) => img._id !== id));
            }
        } catch (err) {
            console.error('Error deleting image:', err);
            setError('Failed to delete the image.');
        }
    };

    function MapView({ locations }) {
        const map = useMap();

        useEffect(() => {
            if (locations.length > 0) {
                const validLocations = locations.filter(loc => loc.latitude && loc.longitude);
                if (validLocations.length > 0) {
                    const bounds = L.latLngBounds(validLocations.map(loc => [loc.latitude, loc.longitude]));
                    map.fitBounds(bounds);
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

                    <MapContainer
                        center={[20, 0]}
                        zoom={13}
                        style={{ height: '400px', width: '100%', marginBottom: '2rem' }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
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
                                            <button
                                                onClick={() => handleDelete(img._id)}
                                                className="text-red-500 mt-3 mx-auto block hover:text-red-700 transition duration-300"
                                            >
                                                <MdDelete color='red' size={24} />
                                            </button>
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
