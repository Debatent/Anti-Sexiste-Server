import React from 'react'
import DataPost from '../data/DataPost'

function Post(props: DataPost) {
    return(
        <article>
            <header>
                <h1>{props.title}</h1>
            </header>
            <p>
                {props.message}
            </p>
            <footer>
                <p>{props.created}</p>
                <p>Ça m'est arrivé aussi: {props.reaction}</p>
            </footer>
        </article>
    ) 
}

export default Post