import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function CreatePost() {
  const userData = {
    title: "",
    postText: "",
  };
  const validationSchema = Yup.object().shape({
    title: Yup.string().required(),
    postText: Yup.string().required(),
  });
  const navigate = useNavigate();
  //made change
  const submit = (data) => {
    axios
      .post("http://localhost:3004/posts", data, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
        } else {
          navigate("/");
        }
      });
  };
  return (
    <div className="createPostPage">
      <Formik
        initialValues={userData}
        onSubmit={submit}
        validationSchema={validationSchema}
      >
        <Form className="form">
          <label>Title:</label>
          <ErrorMessage name="title" component="span" />
          <Field
            id="inputTitle"
            name="title"
            placeholder="(Eg. title...)"
            autoComplete="off"
          />
          <label>Post:</label>
          <ErrorMessage name="postText" component="span" />
          <Field
            id="inputPost"
            name="postText"
            placeholder="What's happening?"
            autoComplete="off"
          />
          {/* <label>Username:</label>
          <ErrorMessage name="username" component="span" />
          <Field
            id="inputUsername"
            name="username"
            placeholder="(Eg. username...)"
            autoComplete="off"
          /> */}
          <button type="submit">Create Post</button>
        </Form>
      </Formik>
    </div>
  );
}

export default CreatePost;
