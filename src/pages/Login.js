import React from "react";
import { Formik, Form, Field } from "formik";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../helpers/AuthContext";
function Login() {
  const navigate = useNavigate();
  const { setAuthState, authState } = useContext(AuthContext);
  const userData = {
    username: "",
    password: "",
  };
  const submit = (data) => {
    axios
      .post("http://localhost:3004/auth/login", data)
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
        } else {
          setAuthState({
            ...authState,
            status: true,
          });
          localStorage.setItem("accessToken", response.data);
          navigate("/");
        }
      });
  };
  return (
    <div>
      <Formik initialValues={userData} onSubmit={submit}>
        <Form className="form">
          <h2>Login:</h2>
          <span>Username:</span>
          <Field
            id="inputTitle"
            name="username"
            placeholder="(Eg. username...)"
            autoComplete="off"
          />
          <span>Password:</span>
          <Field
            type="password"
            id="inputUsername"
            name="password"
            placeholder="Your password..."
            autoComplete="off"
          />
          <button type="submit">Login</button>
        </Form>
      </Formik>
    </div>
  );
}
export default Login;
