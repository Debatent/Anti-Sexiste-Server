import React from 'react'
export interface PostProps { title: string; body: string; }

class Post extends React.Component<PostProps, {}>{
    render(){
        return(
            <article>
                <header>
                    <h1>{this.props.title}</h1>
                </header>
                <p>{this.props.body}</p>
                <footer>
                </footer>
            </article>
        ) 
    }
}

export default Post