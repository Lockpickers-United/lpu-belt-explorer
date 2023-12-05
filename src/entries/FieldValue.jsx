import React from 'react'

function FieldValue({name, value, last, style, headerStyle = {}, textStyle = {}}) {
    const marginStyle = last
        ? {marginLeft: 5, ...style}
        : {marginLeft: 5, marginBottom: 8, ...style}
    const fullHeaderStyle = {
        color: '#666',
        fontSize: '0.85rem',
        ...headerStyle
    }
    const fullTextStyle = {
        marginLeft: 5,
        ...textStyle
    }		

    return (
        <div style={marginStyle}>
            <div style={fullHeaderStyle}>
                {name}
            </div>
            <div style={fullTextStyle}>
                {value}
            </div>
        </div>
    )
}

export default React.memo(FieldValue)
