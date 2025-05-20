import { useEffect, useState } from "react"
import "./PlacesList.css"
import PlaceCard from "./PlaceCard"
import AddPlaceForm from "./AddPlaceForm"



function PlacesList({ showOnlyForm = false }) {

    const [places, setPlaces] = useState([])
    const [selectedCountry, setSelectedCountry] = useState("")
    const [placeName, setPlaceName] = useState("")
    const [description, setDescription] = useState("")
    const [imageUrl, setImageUrl] = useState("")
    const [countryId, setCountryId] = useState("")
    const [countries, setCountries] = useState([])
    const [ratingCulture, setRatingCulture] = useState("")
    const [ratingFun, setRatingFun] = useState("");
    const [ratingScenery, setRatingScenery] = useState("");
    const [ratingSafety, setRatingSafety] = useState("");

    // fetching countries
    useEffect(() => {
        fetch("http://localhost:5005/countries")
            .then((res) => res.json())
            .then((data) => {
                setCountries(data);
                console.log("Fetched countries:", data);

            })
            .catch((err) => {
                console.error("Failed to fetch countries", err);
            });
    }, []);


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
            rating_culture: Number(ratingCulture),
            rating_scenery: Number(ratingScenery),
            rating_fun: Number(ratingFun),
            rating_safety: Number(ratingSafety),
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
            setRatingCulture("");
            setRatingFun("");
            setRatingScenery("");
            setRatingSafety("");

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
        <div>
            {/* show filter dropdown only on /places */}
            {!showOnlyForm && (
                <>
                    <h2 className="title">Visited Places</h2>
                    <select className="select-country"
                        id="selectCountry"
                        name="selectCountry"
                        value={countryId}
                        onChange={(e) => setCountryId(e.target.value)}
                    >
                        <option value="">-- Choose a country --</option>
                        {countries.map((country) => {
                            <option
                                key={country.id} value={country.id}
                            >
                                {country.name}
                            </option>
                        })}
                    </select>
                </>
            )}


            {/* show the form only on add page*/}

            {showOnlyForm && (
                <AddPlaceForm
                    placeName={placeName}
                    setPlaceName={setPlaceName}
                    description={description}
                    setDescription={setDescription}
                    imageUrl={imageUrl}
                    setImageUrl={setImageUrl}
                    countryId={countryId}
                    setCountryId={setCountryId}
                    handleSubmit={handleSubmit}
                    countries={countries}
                    ratingCulture={ratingCulture}
                    setRatingCulture={setRatingCulture}
                    ratingFun={ratingFun}
                    setRatingFun={setRatingFun}
                    ratingScenery={ratingScenery}
                    setRatingScenery={setRatingScenery}
                    ratingSafety={ratingSafety}
                    setRatingSafety={setRatingSafety}
                />
            )}

            {/* show cards only on /places */}
            {!showOnlyForm && (
                <>

                    <div className="card-wrapper">

                        {places.map((place) => (
                            <PlaceCard
                                key={place.id}
                                name={place.name}
                                description={place.description}
                                image_url={place.image_url}
                                rating_culture={place.rating_culture}
                                rating_fun={place.rating_fun}
                                rating_scenery={place.rating_scenery}
                                rating_safety={place.rating_safety}
                            />
                        ))}
                    </div>
                </>
            )}

        </div >
    );
}

export default PlacesList




// functions:



