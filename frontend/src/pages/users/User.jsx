import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserService from "../../services/user.service";

function User() {
  const { id } = useParams();
  const navigate = useNavigate();

  const plainUser = (user) => {
    const { address, ...userAux } = user;
    return { ...userAux, ...address };
  }

  const [currentUser, setCurrentUser] = useState({
    id: null,
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    role: "",
    status: "",
    street: "",
    number: "",
    city: "",
    postalCode: "",
    profilePicture: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const getUser = (id) => {
    UserService.get(id)
      .then((response) => {
        console.log('getUser', response);
        const data = plainUser(response.data);
        setCurrentUser(data);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  useEffect(() => {
    if (id) getUser(id);
  }, [id]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCurrentUser({ ...currentUser, [name]: value });
  };

  const updateStatus = (status) => {
    status = status ? 'active' : 'inactive';

    const data = {
      ...currentUser,
      status,
    };

    UserService.update(currentUser.id, data)
      .then((response) => {
        console.log('updateStatus', response.data);
        setCurrentUser(data);
        setMessage("The user updated successfully");
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const updateUser = () => {
    UserService.update(currentUser.id, currentUser)
      .then((response) => {
        console.log(response.data);
        setMessage("The user updated successfully");
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const deleteUser = () => {
    UserService.remove(currentUser.id)
      .then((response) => {
        console.log(response.data);
        navigate("/users");
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <div>
      {currentUser ? (
        <div className="max-w-lg mx-auto p-4 bg-slate-100 dark:bg-slate-700 rounded shadow">
          <h4 className="font-bold text-xl mb-2">Edit user</h4>
          <div className="mb-2">
            <label className="block font-medium" htmlFor="firstName">
              First name
            </label>
            <input
              type="text"
              className="border border-gray-300 rounded w-full px-2 py-1"
              id="firstName"
              name="firstName"
              value={currentUser.firstName}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-2">
            <label className="block font-medium" htmlFor="lastName">
              Last name
            </label>
            <input
              type="text"
              className="border border-gray-300 rounded w-full px-2 py-1"
              id="lastName"
              name="lastName"
              value={currentUser.lastName}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-2">
            <label className="block font-medium" htmlFor="email">
              Email
            </label>
            <input
              type="text"
              className="border border-gray-300 rounded w-full px-2 py-1"
              id="email"
              name="email"
              value={currentUser.email}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-2">
            <label className="block font-medium" htmlFor="phoneNumber">
              Phone number
            </label>
            <input
              type="text"
              className="border border-gray-300 rounded w-full px-2 py-1"
              id="phoneNumber"
              name="phoneNumber"
              value={currentUser.phoneNumber}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-2">
            <label className="block font-medium" htmlFor="role">
              Role
            </label>
            <input
              type="text"
              className="border border-gray-300 rounded w-full px-2 py-1"
              id="role"
              name="role"
              value={currentUser.role}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-2">
            <label className="block font-medium" htmlFor="street">
              Street
            </label>
            <input
              type="text"
              className="border border-gray-300 rounded w-full px-2 py-1"
              id="street"
              name="street"
              value={currentUser.street}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-2">
            <label className="block font-medium" htmlFor="number">
              Exterior number
            </label>
            <input
              type="text"
              className="border border-gray-300 rounded w-full px-2 py-1"
              id="number"
              name="number"
              value={currentUser.number}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-2">
            <label className="block font-medium" htmlFor="city">
              City
            </label>
            <input
              type="text"
              className="border border-gray-300 rounded w-full px-2 py-1"
              id="city"
              name="city"
              value={currentUser.city}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-2">
            <label className="block font-medium" htmlFor="postalCode">
              Postal code
            </label>
            <input
              type="text"
              className="border border-gray-300 rounded w-full px-2 py-1"
              id="postalCode"
              name="postalCode"
              value={currentUser.postalCode}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-2">
            <label className="block font-medium" htmlFor="profilePicture">
              Profile picture
            </label>
            <input
              type="text"
              className="border border-gray-300 rounded w-full px-2 py-1"
              id="profilePicture"
              name="profilePicture"
              value={currentUser.profilePicture}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-2">
            <label className="block font-medium" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              className="border border-gray-300 rounded w-full px-2 py-1"
              id="password"
              name="password"
              value={currentUser.password}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-2">
            <strong>Status:</strong>{" "}
            {currentUser.status == 'active' ? "Active" : "Inactive"}
          </div>

          <div className="space-x-2 mt-2">
            {currentUser.status == 'active' ? (
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded"
                onClick={() => updateStatus(false)}
              >
                Inactive
              </button>
            ) : (
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded"
                onClick={() => updateStatus(true)}
              >
                Active
              </button>
            )}

            <button
              className="bg-red-500 text-white px-3 py-1 rounded"
              onClick={deleteUser}
            >
              Delete
            </button>

            <button
              className="bg-green-500 text-white px-3 py-1 rounded"
              onClick={updateUser}
            >
              Update
            </button>
          </div>

          {message && <p className="text-green-600 mt-2"><strong>{message}</strong></p>}
        </div>
      ) : (
        <div>
          <p>Loading user...</p>
        </div>
      )}
    </div>
  );
}

export default User;