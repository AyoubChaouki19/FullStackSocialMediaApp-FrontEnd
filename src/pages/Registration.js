import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function Registration() {
  const navigate = useNavigate();
  const userData = {
    username: "",
    password: "",
  };
  const validationSchema = Yup.object().shape({
    username: Yup.string().min(4).max(15).required(),
    password: Yup.string().min(4).max(20).required(),
  });
  const submit = (data) => {
    axios.post("http://localhost:3004/auth", data).then((response) => {
      navigate("/login");
    });
  };
  return (
    <div>
      <Formik
        initialValues={userData}
        onSubmit={submit}
        validationSchema={validationSchema}
      >
        <Form className="form">
          <h2>Register:</h2>
          <label>Username:</label>
          <ErrorMessage name="username" component="span" />
          <Field
            id="inputTitle"
            name="username"
            placeholder="(Eg. username...)"
            autoComplete="off"
          />
          <label>Password:</label>
          <ErrorMessage name="password" component="span" />
          <Field
            type="password"
            id="inputUsername"
            name="password"
            placeholder="Your password..."
            autoComplete="off"
          />
          <button type="submit">Register</button>
        </Form>
      </Formik>
    </div>
  );
}

export default Registration;
