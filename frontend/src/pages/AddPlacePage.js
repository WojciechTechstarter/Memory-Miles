import React from 'react'
import PlacesList from './PlacesList'

function AddPlacePage() {
    return (
        <div className="add-page">
            <h2>Add a New Place</h2>
            <PlacesList showOnlyForm={true} />
        </div>
    )
}

export default AddPlacePage
