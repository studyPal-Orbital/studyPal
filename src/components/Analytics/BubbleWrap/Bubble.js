import React from "react";
import { useState } from 'react';
import prepop from '../../img/prepop.svg'
import pop from '../../img/popped.svg'

import './BubbleWrap.css'

const Bubble = (props) => {
    const[bubbleState, setBubbleState] = useState(prepop)

    /* Play bubble popping sound when user clicks on a bubble */
    const popBubble = () => {
        if (bubbleState === prepop) {
            let audio = new Audio("https://d2plt0bjayjk67.cloudfront.net/bubble-pop.mp3")
            audio.play()
            setBubbleState(() => pop)
        }
    }

    return (
        <img 
            className="bubble" 
            id={props.index}
            onClick={popBubble}
            src={bubbleState}
            alt="bubble"
            data-cy="bubble"
        />
    )
}

export default Bubble
