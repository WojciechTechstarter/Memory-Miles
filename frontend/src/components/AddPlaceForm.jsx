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
    countries
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
            <input
                type="text"
                id="description"
                name="description"
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
                <option value="1">Japan</option>
                <option value="2">Thailand</option>
                <option value="4">Hongkong</option>
            </select>

            <button type="submit">Add Place</button>
        </form>
    );
}

export default AddPlaceForm;
