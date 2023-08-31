import React from "react";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../helpers/AuthContext";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
function Home() {
  let navigate = useNavigate();
  const { authState } = useContext(AuthContext);
  //listOfPosts is var that holds the current value of the state,starts as an empty array'[]'
  //setListOfPosts is a function you can use to update the 'listOfPosts' value
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  useEffect(() => {
    //Running the logic we want to pass after refreshing
    //using axios to run a getRequest that you can see in insomnia
    axios
      .get("http://localhost:3004/posts", {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        setListOfPosts(response.data.listOfPosts);
        setLikedPosts(
          response.data.likedPosts.map((like) => {
            return like.PostId;
          })
        );
      });
  }, []);
  const deletePost = (postId) => {
    axios
      .delete(`http://localhost:3004/posts/${postId}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        setListOfPosts(
          listOfPosts.filter((val) => {
            return val.id !== postId;
          })
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const likeOrUnlikePost = (postId) => {
    axios
      .post(
        "http://localhost:3004/likes",
        { PostId: postId },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        setListOfPosts(
          listOfPosts.map((post) => {
            if (post.id === postId) {
              if (response.data.liked) {
                return { ...post, Likes: [...post.Likes, 0] };
              } else {
                const likesArray = post.Likes;
                likesArray.pop();
                return { ...post, Likes: likesArray };
              }
            } else {
              return post;
            }
          })
        );
        if (likedPosts.includes(postId)) {
          setLikedPosts(likedPosts.filter((id) => id !== postId));
        } else {
          setLikedPosts([...likedPosts, postId]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    //你看这是JSX code the return of divs in javascript code
    <div className="container">
      {[...listOfPosts].reverse().map((value, key) => {
        return (
          //basic html code
          <div className="post" key={key}>
            <div className="upperPost">
              <div>
                <span className="image"></span>
              </div>
              <div className="postData">
                <div className="title">{value.title}</div>
                <div className="username">{value.username}</div>
                <button
                  onClick={() => {
                    navigate(`/post/${value.id}`);
                  }}
                  className="seePostButton"
                >
                  See Post
                </button>
              </div>
            </div>
            <div className="postText">{value.postText}</div>
            <div className="underTextPost">
              <div className="leftSection">
                <span className="createdAt">
                  {value.createdAt.slice(0, 10)}
                </span>
              </div>
              <div className="rightSection">
                <div className="iconDiv">
                  <ThumbUpIcon
                    onClick={() => {
                      likeOrUnlikePost(value.id);
                    }}
                    className={
                      likedPosts.includes(value.id)
                        ? "likeButtonBlue"
                        : "likeButtonWhite"
                    }
                  />
                  <span>{value.Likes.length}</span>
                </div>
              </div>
            </div>
            {authState.username === value.username && (
              <div>
                <button
                  onClick={() => {
                    deletePost(value.id);
                  }}
                  className="deleteButton"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
export default Home;
