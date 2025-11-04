import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import "../css/CountriesPage.css"
import countryCodes from "../CountryCodes";

function CountriesPage() {
    const [countries, setCountries] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        fetch("http://localhost:5005/countries-with-places")
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
            <h2>Visited Countries</h2>
            <div className="country-grid">
                {countries.map((country) => (
                    <div
                        key={country.id}
                        className="country-card"
                        onClick={(e) => handleCountryClick(country.id)}
                    >
                        <img
                            src={
                                countryCodes[country.name]
                                    ? `https://flagcdn.com/w80/${countryCodes[country.name]}.png`
                                    : "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"
                            }
                            alt={`Flag of ${country.name}`}
                            className="flag-icon"
                        />
                        <h2>{country.name}</h2>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CountriesPage


