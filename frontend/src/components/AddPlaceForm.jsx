function AddPlaceForm({
    placeName,
    setPlaceName,
    description,
    setDescription,
    imageUrl,
    setImageUrl,
    countryId,
    setCountryId,
    handleSubmit,
    countries,
    setRatingCulture,
    ratingCulture,
    setRatingScenery,
    ratingScenery,
    setRatingFun,
    ratingFun,
    setRatingSafety,
    ratingsafety
}) {
    return (
        <form className="place-form" onSubmit={handleSubmit}>
            <label htmlFor="placeName">Name of the new place</label>
            <input
                type="text"
                id="placeName"
                name="placeName"
                value={placeName}
                onChange={(e) => setPlaceName(e.target.value)}
            />

            <label htmlFor="description">Description</label>
            <textarea
                id="description"
                name="description"
                rows="6"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            <label htmlFor="image_url">Image URL</label>
            <input
                type="text"
                id="image_url"
                name="image_url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
            />

            <label htmlFor="selectCountry">Select a country</label>
            <select
                id="selectCountry"
                name="selectCountry"
                value={countryId}
                onChange={(e) => setCountryId(e.target.value)}
            >
                <option value="">-- Choose a country --</option>
                {countries.map((country) => {
                    return (
                        <option key={country.id} value={country.id}>
                            {country.name}
                        </option>
                    )
                })}
            </select>

            <label htmlFor="rating_culture">Culture Rating (1-10)</label>
            <input
                type="number"
                id="rating_culture"
                min="1"
                max="10"
                value={ratingCulture}
                onChange={(e) => setRatingCulture(e.target.value)}
            />
            <label htmlFor="rating_scenery">Scenery Rating (1-10)</label>
            <input
                type="number"
                id="rating_scenery"
                min="1"
                max="10"
                value={ratingScenery}
                onChange={(e) => setRatingScenery(e.target.value)}
            />
            <label htmlFor="rating_frun">Fun Rating (1-10)</label>
            <input
                type="number"
                id="rating_fun"
                min="1"
                max="10"
                value={ratingFun}
                onChange={(e) => setRatingFun(e.target.value)}
            />
            <label htmlFor="rating_safety">Safety Rating (1-10)</label>
            <input
                type="number"
                id="rating_safety"
                min="1"
                max="10"
                value={ratingsafety}
                onChange={(e) => setRatingSafety(e.target.value)}
            />

            <button type="submit">Add Place</button>
        </form>
    );
}

export default AddPlaceForm;
