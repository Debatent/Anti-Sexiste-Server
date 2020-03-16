import React from "react"
import Post from "./Post"

export interface ListPostProps { 
    items: Post[];
}
export interface ListPostState{
    items: Post[]
}

class ListPost extends React.Component<ListPostProps,ListPostState>{

    constructor(props:ListPostProps){
        super(props);
        this.state = {items: props.items}
        this.addPost = this.addPost.bind(this);
    }
    addPost(element:Post){
        this.setState(prevState => ({
            items: prevState.items.concat(element)
        }))
    }
    
    render(){
        return null
    }
}
export default ListPost;