import { useState } from "react";
import { Bounce, toast } from "react-toastify";

import "../styles/auth.css";
import { useAuth } from "../providers/AuthProvider";
import axios from "axios";

function AuthPage() {
  const auth = useAuth();
  const [isActive, setIsActive] = useState(true);

  const toggleForm = (e) => {
    e.preventDefault();
    setIsActive(!isActive);
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    const itoast = toast.loading("Signing up..", { position: "bottom-right" });

    const form = e.target;
    const username = form.username.value;
    const email = form.email.value;
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    if (password !== confirmPassword) {
      toast.update(itoast, {
        render: "Passwords do not match",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/signup`,
        { username, email, password },
        { withCredentials: true },
      );

      toast.update(itoast, {
        render: response.data.message,
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      form.reset();
      setIsActive(!isActive);
    } catch (error) {
      // console.log('handleSignUpSubmit:error caught')
      // console.error(error);

      let errorMessage = error.response?.data.message;
      errorMessage = errorMessage ? errorMessage : error.message;
      toast.update(itoast, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    const itoast = toast.loading("Signing in...", { position: "bottom-right" });

    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/auth/signin`,
        { email, password },
        { withCredentials: true },
      );

      auth.setUser(response.data.payload);
      auth.setIsAuthenticated(true);

      toast.update(itoast, {
        render: "You've been signed in",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      form.reset();
    } catch (error) {
      // console.log('handleSignInSubmit:error caught')
      // console.error(error);
      let errorMessage = error.response?.data.message;
      errorMessage = errorMessage ? errorMessage : error.message;
      toast.update(itoast, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="auth-page">
      <form
        action="post"
        className="auth-form"
        style={{ display: isActive ? "none" : "block" }}
        onSubmit={handleSignUpSubmit}
      >
        <h1>Sign up</h1>
        <div>
          <label htmlFor="username">User Name</label>
          <input
            type="text"
            id="username"
            name="username"
            minLength={1}
            maxLength={20}
            required
            autoComplete="username"
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            name="email"
            type="email"
            id="signup_email"
            minLength={5}
            required
            autoComplete="username"
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            minLength={8}
            required
            autoComplete="new-password"
          />
        </div>
        <div>
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            name="confirmPassword"
            minLength={8}
            required
            autoComplete="new-password"
          />
        </div>
        <button type="submit">Sign up</button>
        <p>
          Already have an account? <button onClick={toggleForm}>Sign in</button>
        </p>
      </form>

      <form
        action="post"
        className="auth-form"
        style={{ display: isActive ? "block" : "none" }}
        onSubmit={handleSignInSubmit}
      >
        <h1>Sign in</h1>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="signin_email"
            name="email"
            minLength={5}
            required
            autoComplete="username"
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            // id="signin_password"
            name="password"
            minLength={8}
            required
            autoComplete="new-password"
          />
        </div>
        <button type="submit">Sign in</button>
        <p>
          Don&apos;t have an account?{" "}
          <button onClick={toggleForm}>Sign up</button>
        </p>
      </form>
    </div>
  );
}

export default AuthPage;
