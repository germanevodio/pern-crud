import { useState } from "react";
import UserService from "../../services/user.service";
import GoogleMapsAddressPicker from "../../components/googleMapsAddressPicker";

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
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setProfilePictureFile(file);

      const reader = new FileReader();

      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };

      reader.readAsDataURL(file);
    } else {
      setProfilePictureFile(null);
      setProfilePicture("");
    }
  };

  const handleAddressSelect = (addressDetails) => {
    setCurrentUser(prevUser => ({
      ...prevUser,
      street: addressDetails.street || "",
      number: addressDetails.number || "",
      city: addressDetails.city || "",
      postalCode: addressDetails.postalCode || "",
    }));
  };

  const saveUser = () => {
    const formData = new FormData();

    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('email', email);
    formData.append('phoneNumber', phoneNumber);
    formData.append('role', role);
    formData.append('status', status);
    formData.append('street', street);
    formData.append('number', number);
    formData.append('city', city);
    formData.append('postalCode', postalCode);
    formData.append('password', password);

    if (profilePictureFile) {
      formData.append('profilePicture', profilePictureFile);
    } else {
      formData.append('profilePicture', "");
    }

    UserService.create(formData)
      .then((response) => {
        setSubmitted(true);
      })
      .catch((e) => {
        console.error('UserService.create', e);
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
    setProfilePictureFile(null);
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
            <select
              className="border border-gray-300 rounded w-full px-2 py-1"
              id="role"
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">Choose one</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="mb-2">
            <label className="block mb-1 font-medium">Status</label>
            <select
              className="border border-gray-300 rounded w-full px-2 py-1"
              id="status"
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="active">Choose one</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Address in map</label>
            <GoogleMapsAddressPicker
              onAddressSelect={handleAddressSelect}
              initialAddress={{
                street: currentUser.street,
                number: currentUser.number,
                city: currentUser.city,
                postalCode: currentUser.postalCode
              }}
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
              type="file"
              accept="image/*"
              className="hidden"
              id="profile-picture-upload"
              onChange={handleProfilePictureChange}
              name="profilePicture"
            />
            <label
              htmlFor="profile-picture-upload"
              className="bg-blue-500 text-white px-3 py-2 rounded cursor-pointer inline-block hover:bg-blue-600"
            >
              Upload Image
            </label>
            {profilePicture && (
              <div className="mt-2">
                <img
                  src={profilePicture}
                  alt="Profile Preview"
                  className="w-24 h-24 object-cover rounded-full border border-gray-300"
                />
              </div>
            )}
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