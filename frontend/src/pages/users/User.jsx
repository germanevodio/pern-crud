import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserService from "../../services/user.service";
import Swal from 'sweetalert2';
import GoogleMapsAddressPicker from "../../components/googleMapsAddressPicker";

function User() {
  const { id } = useParams();
  const navigate = useNavigate();
  const backendBaseUrl = "http://localhost:5000";

  const plainUser = (user) => {
    const { address, ...userAux } = user;
    return { ...userAux, ...address, password: "" };
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

  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState("");

  const [message, setMessage] = useState("");

  const handleAddressSelect = (addressDetails) => {
    setCurrentUser(prevUser => ({
      ...prevUser,
      street: addressDetails.street || "",
      number: addressDetails.number || "",
      city: addressDetails.city || "",
      postalCode: addressDetails.postalCode || "",
    }));
  };

  const getUser = (id) => {
    UserService.get(id)
      .then((response) => {
        const data = plainUser(response.data);

        setCurrentUser(data);

        if (data.profilePicture) {
          setProfilePicturePreview(fullProfilePictureUrl(data.profilePicture));
        } else {
          setProfilePicturePreview("");
        }
      })
      .catch((e) => {
      });
  };

  useEffect(() => {
    if (id) getUser(id);
  }, [id]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCurrentUser({ ...currentUser, [name]: value });
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setProfilePictureFile(file);

      const reader = new FileReader();

      reader.onloadend = () => {
        setProfilePicturePreview(reader.result);
      };

      reader.readAsDataURL(file);
    } else {
      setProfilePictureFile(null);

      setProfilePicturePreview(
        currentUser.profilePicture
          ? fullProfilePictureUrl(currentUser.profilePicture)
          : "");
    }
  };

  const fullProfilePictureUrl = (imgPath) => {
    if (imgPath && imgPath.startsWith("/uploads")) {
      return `${backendBaseUrl}${imgPath}`;
    }

    return imgPath;
  }

  const updateStatus = (isActive) => {
    const newStatus = isActive ? 'active' : 'inactive';

    const dataToSend = {
      ...currentUser,
      status: newStatus,
    };

    UserService.update(currentUser.id, dataToSend)
      .then((response) => {
        setCurrentUser(dataToSend);

        const swalMessage = "The user status updated successfully";

        setMessage(swalMessage);

        Swal.fire(
          'Updated',
          swalMessage,
          'success'
        );
      })
      .catch((e) => {
      });
  };

  const updateUser = () => {
    const formData = new FormData();

    formData.append('firstName', currentUser.firstName);
    formData.append('lastName', currentUser.lastName);
    formData.append('email', currentUser.email);
    formData.append('phoneNumber', currentUser.phoneNumber);
    formData.append('role', currentUser.role);
    formData.append('status', currentUser.status);
    formData.append('street', currentUser.street);
    formData.append('number', currentUser.number);
    formData.append('city', currentUser.city);
    formData.append('postalCode', currentUser.postalCode);
    formData.append('password', currentUser.password);

    if (profilePictureFile) {
      formData.append('profilePicture', profilePictureFile);
    } else {
      formData.append('profilePicture', currentUser.profilePicture);
    }

    for (const pair of formData.entries()) {
    }

    UserService.update(currentUser.id, formData)
      .then((response) => {
        const swalMessage = "The user updated successfully";

        setMessage(swalMessage);

        Swal.fire(
          'Updated',
          swalMessage,
          'success'
        );
      })
      .catch((e) => {
      });
  };

  const deleteUser = () => {
    setMessage("");

    Swal.fire({
      title: 'Are you sure?',
      text: "this action is not reversible",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        UserService.remove(currentUser.id)
          .then((response) => {
            Swal.fire(
              'Deleted',
              'User has destroy',
              'success'
            );
            navigate("/users");
          })
          .catch((e) => {
            Swal.fire(
              'Error',
              'Unhandled error in destroy user',
              'error'
            );
          });
      }
      else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Canceled',
          'The delete action is canceled',
          'info'
        );
      }
    });

  };

  return (
    <div>
      {currentUser.id ? (
        <div className="max-w-lg mx-auto p-4 bg-slate-100 dark:bg-slate-700 rounded shadow">
          <h4 className="font-bold text-xl mb-2">Edit user</h4>
          <div className="mb-4 text-center">
            {profilePicturePreview ? (
              <img
                src={profilePicturePreview}
                alt={`${currentUser.firstName}'s profile`}
                className="w-32 h-32 object-cover rounded-full mx-auto border-2 border-gray-300 shadow-md"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}
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
              className="mt-3 inline-block bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition duration-200"
            >
              Change Profile Picture
            </label>
          </div>
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
            <select
              className="border border-gray-300 rounded w-full px-2 py-1"
              id="role"
              name="role"
              value={currentUser.role}
              onChange={handleInputChange}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
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
              placeholder="Blank to keep current password"
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