import React, {useCallback} from 'react'
import {Rating} from 'react-simple-star-rating'

export default function StarRating({ratings, dimension, onChange, size = 24, emptyColor = '#ccc', readonly= false, fillColor, style, allowFraction=true}) {

    const handleRating = useCallback((rate) => {
        onChange({rating: rate, dimension: dimension})
    },[dimension, onChange])

    return (
        <div style={{display: 'flex', placeItems: 'center', marginTop:4, ...style}}>
            <Rating
                onClick={handleRating}
                size={size}
                initialValue={ratings && ratings[dimension]}
                ratingValue={ratings && ratings[dimension]}
                emptyColor={emptyColor}
                readonly={readonly}
                fillColor={fillColor}
                allowFraction={allowFraction}
            />
        </div>
    )
}