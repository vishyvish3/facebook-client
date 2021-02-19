import React, { Component } from "react";
import { list } from "./apiPost";
import SinglePost from "./SinglePost";

class Posts extends Component {
    constructor() {
        super();
        this.state = {
            posts: [],
            page: 1,
            searchText:""
        };
    }

    loadPosts = page => {
        list(page).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ posts: data });
            }
        });
    };

    componentDidMount() {
        this.loadPosts(this.state.page);
    }

    loadMore = number => {
        this.setState({ page: this.state.page + number });
        this.loadPosts(this.state.page + number);
    };

    loadLess = number => {
        this.setState({ page: this.state.page - number });
        this.loadPosts(this.state.page - number);
    };

    handleInput = (e)=>{
        e.preventDefault();
        if(e.target.value === null || e.target.value === undefined || e.target.value === '') {
            return;
        }
        
        this.setState({ searchText: e.target.value});
    }

    handleSearch = (e)=>{
        e.preventDefault();
        const filteredPosts = this.state.posts.filter(post =>
            JSON.stringify(post).toLowerCase().includes(this.state.searchText.toLowerCase())
        )
        if(filteredPosts.length !== 0) {
            this.setState({ posts: filteredPosts});
            
        }
    }

    renderPosts = posts => {
        return (
            <div className="row">
                {posts.map((post, i) => {

                    return (
                        <SinglePost id={post._id} key={post._id}/>
                     );
                })}
            </div>
        );
    };

    render() {
        const { posts, page } = this.state;
        return (
            <div className="container">
            
                <form  onSubmit={this.handleSearch}>
                    <input type="text" name="search" id="search" placeholder="Search for a post"  onChange={this.handleInput} />
                    <input type="submit" className="btn btn-raised btn-primary"   />
                </form>    
            
                <h2 className="mt-5 mb-5">
                    {!posts.length ? "No more posts!" : "Recent Posts"}
                </h2>

                {this.renderPosts(posts)}

                {page > 1 ? (
                    <button
                        className="btn btn-raised btn-warning mr-5 mt-5 mb-5"
                        onClick={() => this.loadLess(1)}
                    >
                        Previous ({this.state.page - 1})
                    </button>
                ) : (
                    ""
                )}

                {posts.length ? (
                    <button
                        className="btn btn-raised btn-success mt-5 mb-5"
                        onClick={() => this.loadMore(1)}
                    >
                        Next ({page + 1})
                    </button>
                ) : (
                    ""
                )}
            </div>
        );
    }
}

export default Posts;
