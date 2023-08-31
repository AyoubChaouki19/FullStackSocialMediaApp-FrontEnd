import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useContext } from "react";
import { AuthContext } from "../helpers/AuthContext";
function Post() {
  let { id } = useParams();
  const { authState } = useContext(AuthContext);
  const [listComment, setComments] = useState([]);
  const [postObject, setPostObject] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const postResponse = await axios.get(
          `http://localhost:3004/posts/byId/${id}`,
          { params: { includeLikes: true } }
        );
        setPostObject(postResponse.data);
        const commentsResponse = await axios.get(
          `http://localhost:3004/comments/${id}`
        );
        setComments(commentsResponse.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, [id]);
  const deleteComment = (commentId) => {
    axios
      .delete(
        `http://localhost:3004/comments/deleteComment/${commentId}`,
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      )
      .then((response) => {
        setComments(
          listComment.filter((val) => {
            return val.id !== commentId;
          })
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // by including [id] in the dependency array you achieve the preveting from unnecessary requests.
  const userComment = {
    commentBody: "",
    PostId: id,
    username: "",
    id: 0,
  };
  const validationSchema = Yup.object().shape({
    commentBody: Yup.string().required(),
  });
  const addCommentSubmit = async (data, { resetForm }) => {
    await axios
      .post("http://localhost:3004/comments", data, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        resetForm();
        if (response.data.error) {
          alert(response.data.error);
        } else {
          const commentToAdd = {
            commentBody: response.data.commentBody,
            username: response.data.username,
            id: response.data.id,
          };
          setComments([...listComment, commentToAdd]);
          window.location.reload();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    //basic html code
    <div className="pagePost">
      <div className="postContainer">
        <div className="postOnPostPage">
          <div className="upperPost">
            <div>
              <span className="image"></span>
            </div>
            <div className="postData">
              <div className="title">{postObject.title}</div>
              <div className="username">{postObject.username}</div>
            </div>
          </div>
          <div className="postText" key={postObject}>
            {postObject.postText}
          </div>
          <div className="underTextPost">
            <div className="leftSection">
              <span className="createdAt">
                {postObject &&
                  postObject.createdAt &&
                  postObject.createdAt.slice(0, 10)}
              </span>
            </div>
          </div>
        </div>
        <div className="commentSection">
          <div className="comments">
            <p>Comments</p>
            {listComment.map((value, key) => {
              return (
                <div className="comment" key={key}>
                  <div className="username">{value.username}</div>
                  <div>{value.commentBody}</div>
                  {authState.username === value.username && (
                    <button
                      onClick={() => {
                        deleteComment(value.id);
                      }}
                      className="deleteButton"
                    >
                      Delete
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          <div className="addComment">
            <Formik
              initialValues={userComment}
              onSubmit={addCommentSubmit}
              validationSchema={validationSchema}
            >
              <Form>
                <div className="commentForm">
                  <Field
                    id="inputComment"
                    name="commentBody"
                    placeholder="Comment on post..."
                    autoComplete="off"
                  />
                  <button type="submit">Publish</button>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Post;
