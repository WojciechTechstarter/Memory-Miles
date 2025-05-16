/* <PlaceCard
    name={Place.name}
    description={place.description}
    image_url={place.image_url}
/> */

function PlaceCard({ name, description, image_url }) {
    return (
        <div className="place-card">
            <img src={image_url} alt={name} />
            <h3>{name}</h3>
            <p>{description}</p>
        </div>
    );
}

export default PlaceCard;