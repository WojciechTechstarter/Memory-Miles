import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
//import "./CountriesPage.css"

function CountriesPage() {
    const [countries, setCountries] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        fetch("http://localhost:5005/countries")
            .then((res) => res.json())
            .then((data) => {
                setCountries(data)
                console.log("Fetched ocuntries:", data)
            })
            .catch((err) => {
                console.error("Failed to detch countries:", err)
            });
    }, []);


    // After clicking on a country run this function:
    const handleCountryClick = (id) => {
        navigate("/places", { state: { selectedCountryId: id } })
    }

    return (
        <div className="countries-page">
            <h2>Select a Country</h2>
            <div className="country-grid">
                {countries.map((country) => (
                    <div
                        key={country.id}
                        className="country-card"
                        onClick={(e) => handleCountryClick(country.id)}
                    >
                        {country.name}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CountriesPage