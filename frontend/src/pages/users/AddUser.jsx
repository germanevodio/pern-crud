import React, { useState } from "react";
import UserService from "../../services/user.service";

function AddUser() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const saveUser = () => {
    const data = {
      firstName,
      lastName,
      email,
      phoneNumber,
      role,
      status,
      street,
      number,
      city,
      postalCode,
      profilePicture,
      password,
    };

    UserService.create(data)
      .then((response) => {
        console.log(response.data);
        setSubmitted(true);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const newUser = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhoneNumber("");
    setRole("");
    setStatus("");
    setStreet("");
    setNumber("");
    setCity("");
    setPostalCode("");
    setProfilePicture("");
    setPassword("");
    setSubmitted(false);
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-slate-100 dark:bg-slate-700 rounded shadow">
      {submitted ? (
        <div>
          <h4 className="font-bold text-green-600 mb-4">
            User submitted successfully
          </h4>
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded"
            onClick={newUser}
          >
            Add Another
          </button>
        </div>
      ) : (
        <div>
          <h4 className="font-bold text-xl mb-2">Add user</h4>

          <div className="mb-2">
            <label className="block mb-1 font-medium">First name</label>
            <input
              type="text"
              className="border border-gray-300 rounded w-full px-2 py-1"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className="mb-2">
            <label className="block mb-1 font-medium">Last name</label>
            <input
              type="text"
              className="border border-gray-300 rounded w-full px-2 py-1"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="mb-2">
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="text"
              className="border border-gray-300 rounded w-full px-2 py-1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-2">
            <label className="block mb-1 font-medium">Phone number</label>
            <input
              type="text"
              className="border border-gray-300 rounded w-full px-2 py-1"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <div className="mb-2">
            <label className="block mb-1 font-medium">Role</label>
            <input
              type="text"
              className="border border-gray-300 rounded w-full px-2 py-1"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>

          <div className="mb-2">
            <label className="block mb-1 font-medium">Status</label>
            <input
              type="text"
              className="border border-gray-300 rounded w-full px-2 py-1"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            />
          </div>

          <div className="mb-2">
            <label className="block mb-1 font-medium">Street</label>
            <input
              type="text"
              className="border border-gray-300 rounded w-full px-2 py-1"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />
          </div>

          <div className="mb-2">
            <label className="block mb-1 font-medium">Exterior number</label>
            <input
              type="text"
              className="border border-gray-300 rounded w-full px-2 py-1"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
            />
          </div>

          <div className="mb-2">
            <label className="block mb-1 font-medium">City</label>
            <input
              type="text"
              className="border border-gray-300 rounded w-full px-2 py-1"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div className="mb-2">
            <label className="block mb-1 font-medium">Postal code</label>
            <input
              type="text"
              className="border border-gray-300 rounded w-full px-2 py-1"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </div>

          <div className="mb-2">
            <label className="block mb-1 font-medium">Profile picture</label>
            <input
              type="text"
              className="border border-gray-300 rounded w-full px-2 py-1"
              value={profilePicture}
              onChange={(e) => setProfilePicture(e.target.value)}
            />
          </div>

          <div className="mb-2">
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              className="border border-gray-300 rounded w-full px-2 py-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            className="bg-green-500 text-white px-3 py-1 rounded mt-2"
            onClick={saveUser}
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
}

export default AddUser;