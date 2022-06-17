import React from 'react'

const Title = (props) => {
    return (
        <div className="title-container">
            <h1 className="title">{props.name}</h1>
        </div>
    )
}

export default Title