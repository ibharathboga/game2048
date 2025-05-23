import { useState, useEffect } from 'react';
import axios from 'axios';

import '../styles/profile.css';
import LoadingPage from './loading';

import { useAuth } from '../providers/AuthProvider'
import { useNavigate } from 'react-router-dom';
import { Bounce, toast } from 'react-toastify';

function ProfilePage() {
  const { user, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate()

  const handleSave = async (e) => {
    console.log("handleSave:invoked");
    e.preventDefault();

    const username = e.target.username?.value ?? profile.username;
    const email = e.target.email?.value ?? profile.email;

    if (username === profile.username && email === profile.email) return;

    try {
      const response = await axios.put(
        'http://localhost:8000/profile/',
        { username, email },
        { withCredentials: true }
      );

      const updatedProfile = response.data;
      console.log(updatedProfile);

      setProfile(updatedProfile);
      setIsEditing(false);

      if (user.email !== updatedProfile.email || user.username !== updatedProfile.username) {
        setUser((prev) => ({
          ...prev,
          email: updatedProfile.email,
          username: updatedProfile.username,
        }));
      }

    } catch (error) {
      const errorMessage = error.response?.data?.message ?? error.message;
      console.log(errorMessage);
      toast(errorMessage, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        type: 'error',
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();

    const oldPassword = e.target.oldPassword.value;
    const newPassword = e.target.newPassword.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (oldPassword === newPassword || newPassword !== confirmPassword) {
      toast('Passwords do not match', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        type: 'error',
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      return;
    };

    try {
      const response = await axios.put(
        'http://localhost:8000/profile/password',
        { oldPassword, newPassword },
        { withCredentials: true }
      );
      e.target.reset();
      setIsEditing(false)
      // window.location.reload();
    } catch (error) {
      console.log(error);
      toast(error.response?.data?.message ?? error.message, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        type: 'error',
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.delete(
        'http://localhost:8000/profile/',
        { withCredentials: true }
      );
      console.log(response.data);
      window.location.reload()
    } catch (error) {
      console.log(error);

    }
  };

  const profilePageEffect = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        'http://localhost:8000/profile/',
        { withCredentials: true }
      );
      setProfile(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    profilePageEffect();
  }, []);

  if (isLoading) return <LoadingPage />;

  return (
    <div className='profile-page'>
      <h1>Profile</h1>

      <div className='profile-details'>
        <p><strong>Username:</strong> {profile.username}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Created At:</strong> {profile.createdAt}</p>
        <p><strong>Updated At:</strong> {profile.updatedAt}</p>
      </div>

      <div className='buttons'>
        <button className="edit-button" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Cancel Edit' : 'Edit Profile'}
        </button>
        <button className="delete-button" onClick={handleDeleteAccount}>
          Delete Account
        </button>
      </div>

      <form
        className={`profile-form ${isEditing ? 'active' : ''}`}
        onSubmit={handleSave}
      >
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          autoComplete="off"
          defaultValue={profile.username || ''}
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          autoComplete="email"
          defaultValue={profile.email || ''}
        />

        <button type="submit">Save</button>
      </form>

      {isEditing ? <form
        className={`profile-form ${isEditing ? 'active' : ''}`}
        onSubmit={handleSavePassword}
      >
        <label htmlFor="oldpassword">Old Password</label>
        <input
          type="password"
          id="oldpassword"
          name="oldPassword"
          minLength={8}
          required
          autoComplete="current-password"
        />

        <label htmlFor="newpassword">New Password</label>
        <input
          type="password"
          id="newpassword"
          name="newPassword"
          minLength={8}
          required
          autoComplete="new-password"
        />

        <label htmlFor="confirmpassword">Confirm Password</label>
        <input
          type="password"
          id="confirmpassword"
          name="confirmPassword"
          minLength={8}
          required
          autoComplete="new-password"
        />

        <button type="submit">Save Password</button>
      </form>
        : null}

    </div>
  );
}

export default ProfilePage;
