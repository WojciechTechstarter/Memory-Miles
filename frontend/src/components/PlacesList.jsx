import { useEffect, useState } from "react"
import "./PlacesList.css"
import PlaceCard from "./PlaceCard"



function PlacesList() {

    const [places, setPlaces] = useState([])
    const [selectedCountry, setSelectedCountry] = useState("")
    const [placeName, setPlaceName] = useState("")
    const [description, setDescription] = useState("")
    const [imageUrl, setImageUrl] = useState("")
    const [countryId, setCountryId] = useState("")

    // fetching a places by id
    const fetchPlacesByCountry = async (id) => {
        const response = await fetch(`http://localhost:5005/place?country_id=${id}`)
        const data = await response.json()
        console.log("Fetched places:", data)
        setPlaces(data)
    }


    const handleSubmit = async (e) => {
        e.preventDefault(); // prevent full page reload

        const newPlace = {
            name: placeName,
            description,
            image_url: imageUrl,
            country_id: Number(countryId), // convert to number for backend
        }

        try {
            const response = await fetch("http://localhost:5005/place", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newPlace)
            });

            if (!response.ok) {
                throw new Error("Failed to add place")
            }

            const savedPlace = await response.json()
            console.log("New Place added:", savedPlace)

            // refreshing the list
            setPlaces((oldPlaces) => [...oldPlaces, savedPlace])

            // Clear form fields
            setPlaceName("");
            setDescription("");
            setImageUrl("");
            setCountryId("");
        } catch (error) {
            console.log("Error adding place:", error)
        }
    }


    useEffect(() => {
        fetch("http://localhost:5005/places")
            .then((res) => res.json())
            .then((data) => {
                setPlaces(data);
            })
            .catch((err) => {
                console.error("Failed to fetch places", err);
            });
    }, []);

    return (
        <div >
            <select
                value={selectedCountry}
                onChange={(x) => {
                    const newId = x.target.value
                    setSelectedCountry(newId)
                    console.log("Selected country ID:", newId);
                    fetchPlacesByCountry(newId)

                }}
            >
                <option value="4">Hongkong</option>
                <option value="2">Thailand</option>
            </select>
            <form className="place-form" onSubmit={handleSubmit}>
                <label htmlFor="placeName">Name of the new place</label>
                <input type="text" id="placeName" name="placeName" value={placeName}
                    onChange={(e) => setPlaceName(e.target.value)} />

                <label htmlFor="description">Description</label>
                <input type="text" id="description" name="description" value={description}
                    onChange={(e) => setDescription(e.target.value)} />

                <label htmlFor="image_ulr">Image URL</label>
                <input type="text" id="image_url" name="image_url" value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)} />

                <label htmlFor="selectCountry">Select a country</label>
                <select id="selectCountry" name="selectCountry" value={countryId}
                    onChange={(e) => setCountryId(e.target.value)}>
                    <option value="">-- Choose a country --</option>
                    <option value="1">Japan</option>
                    <option value="2">Thailand</option>
                    <option value="4">Hongkong</option>
                </select>
                <button type="submit">Add Place</button>
            </form>
            <h2>Visited Places</h2>
            <div className="card-wrapper">

                {places.map((place) => (
                    <PlaceCard
                        key={place.id}
                        name={place.name}
                        description={place.description}
                        image_url={place.image_url}
                    />
                ))}
            </div>
        </div >
    );
}

export default PlacesList




// functions:



