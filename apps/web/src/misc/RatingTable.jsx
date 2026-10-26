import React from 'react'
import StarRating from '../misc/StarRating.jsx'
import DisplayTable from './DisplayTable.jsx'

export default function RatingTable({
                                        ratingDimensions,
                                        ratings,
                                        onRatingChange = () => {
                                        },
                                        size,
                                        allowFraction = false,
                                        readonly = false,
                                        fontSize = '1.0rem',
                                        paddingData = 5,
                                        backgroundColor,
                                        fillColor,
                                        emptyColor = '#777',
                                        fontWeight = 500
                                    }) {


    const columns = [
        {id: 'ratingArea', name: 'Area', align: 'right'},
        {id: 'rating', name: 'Your Rating', align: 'left', descending: true}
    ]
    const rows = Object.keys(ratingDimensions).map(key => {
        return {
            ratingArea: ratingDimensions[key] || key,
            rating: <StarRating ratings={ratings} onChange={onRatingChange} dimension={key}
                                readonly={readonly} size={size} fontSize={fontSize} allowFraction={allowFraction}
                                fillColor={fillColor} emptyColor={emptyColor} style={{marginLeft: 5, marginTop: 4}}
            />
        }
    })
    const defaultSort = 'ratingArea'
    const tableData = {columns, rows, defaultSort, sortable: false}

    const useTable = false
    return (
        <React.Fragment>
            {useTable
                ? <DisplayTable tableData={tableData} showHeader={false} alternateRows={false}
                                colorData={'#ddd'} fontSize={fontSize} fontWeightData={fontWeight}
                                paddingData={paddingData} backgroundColor={backgroundColor}/>
                : <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    {rows.map((row, index) => (
                        <div key={index} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: `${paddingData}px`,
                            backgroundColor: index % 2 === 0 ? backgroundColor : 'transparent',
                            marginRight: index < rows.length-1 ? 15 : 0
                        }}>
                            <div style={{
                                fontSize: fontSize,
                                fontWeight: fontWeight,
                                color: '#ddd'
                            }}>{row.ratingArea}</div>
                            <div>{row.rating}</div>
                        </div>
                    ))
                    }
                </div>
            }
        </React.Fragment>
    )
}