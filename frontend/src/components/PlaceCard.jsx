/* <PlaceCard
    name={Place.name}
    description={place.description}
    image_url={place.image_url}
/> */
import "../css/PlaceCard.css"

function PlaceCard({ name, description, image_url, rating_scenery,
    rating_fun, rating_culture, rating_safety
}) {
    return (
        <div className="place-card">
            <img src={image_url} alt={name} />
            <h3>{name}</h3>
            <div className="description"><p>{description}</p></div>
            <div className="ratings">
                <p>🌍Culture: {rating_culture}/10</p>
                <p>🏞️Scenery: {rating_scenery}/10</p>
                <p>🌃Safety: {rating_safety}/10</p>
                <p>🎉Fun: {rating_fun}/10</p>
            </div>
        </div>
    );
}

export default PlaceCard;