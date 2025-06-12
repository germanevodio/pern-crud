import { useState, useEffect } from "react";
import UserService from "../../services/user.service";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';

function UsersList() {
  const [users, setUsers] = useState([]);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(-1);
  const [searchUser, setSearchUser] = useState("");
  const [currentSearchTerm, setCurrentSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    retrieveUsers(currentPage, itemsPerPage, selectedRole, selectedStatus, currentSearchTerm);
  }, [currentPage, itemsPerPage, selectedRole, selectedStatus, currentSearchTerm]);

  const onChangeSearchTitle = (e) => {
    setSearchUser(e.target.value);
  };

  const onChangeRole = (e) => {
    setSelectedRole(e.target.value);
    setCurrentPage(1);
    setCurrentIndex(-1);
  };

  const onChangeStatus = (e) => {
    setSelectedStatus(e.target.value);
    setCurrentPage(1);
    setCurrentIndex(-1);
  };

  const retrieveUsers = (page, limit, role, status, name = "") => {
    setLoading(true);

    UserService.getAll(page, limit, role, status, name)
      .then((response) => {
        setUsers(response.data.data);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
        setItemsPerPage(response.data.itemsPerPage);
        setTotalUsersCount(response.data.totalItems || 0);
        setLoading(false);
      })
      .catch((e) => {
        setError("Error on loading users");
        setLoading(false);
      });
  };

  const setActiveUser = (user, index) => {
    setCurrentIndex(index);
  };

  const findByName = () => {
    setCurrentPage(1);
    setCurrentSearchTerm(searchUser);
    retrieveUsers(1, itemsPerPage, selectedRole, selectedStatus, searchUser);
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setCurrentIndex(-1);
    }
  };

  const getPaginationNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handleDeleteUser = (userId, userName) => {
    Swal.fire({
      title: `Are you sure to delete ${userName}?`,
      text: "this action is not reversible",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        UserService.remove(userId)
          .then(response => {
            Swal.fire(
              'Deleted',
              `User: ${userName} has destroy`,
              'success'
            );

            retrieveUsers();
          })
          .catch(e => {
            Swal.fire(
              'Error',
              `Unhandled error in destroy user: ${userName}.`,
              'error'
            );
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Canceled',
          `The delete action is canceled to: ${userName}`,
          'info'
        );
      }
    });
  };

  if (loading) {
    return <div className="max-w-lg mx-auto p-4">Cargando usuarios...</div>;
  }

  if (error) {
    return <div className="max-w-lg mx-auto p-4 text-red-600">{error}</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex flex-1">
            <input
              type="text"
              className="border border-gray-300 rounded-l px-2 py-1 w-full"
              placeholder="Search by name or email"
              value={searchUser}
              onChange={onChangeSearchTitle}
            />
            <button
              className="bg-blue-500 text-white px-4 py-1 rounded"
              onClick={findByName}
            >
              Search
            </button>
          </div>

          <div className="flex-1">
            <select
              className="border border-gray-300 rounded px-2 py-1 w-full"
              value={selectedRole}
              onChange={onChangeRole}
            >
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex-1">
            <select
              className="border border-gray-300 rounded px-2 py-1 w-full"
              value={selectedStatus}
              onChange={onChangeStatus}
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="p-4 bg-slate-200 dark:bg-slate-700 rounded shadow">
          <h4 className="font-bold text-lg mb-2 text-center">
            Users list
            <span className="ml-4 px-3 py-1 bg-blue-400 text-blue-800 dark:bg-blue-700 dark:text-blue-100 rounded-full text-sm font-semibold">
              Total: {totalUsersCount}
            </span>
          </h4>
          <div className="overflow-x-auto"> {/* Para scroll horizontal en pantallas pequeñas */}
            <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded">
              <thead className="bg-gray-50  dark:bg-slate-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-100 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-100 uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-100 uppercase tracking-wider">Phone Number</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-100 uppercase tracking-wider">Role</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-100 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-100 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white  dark:bg-slate-800 divide-y divide-gray-200">
                {users && users.length > 0 ? (
                  users.map((user, index) => (
                    <tr
                      key={user.id || index}
                      className={index === currentIndex ? "bg-blue-50 dark:bg-slate-400" : ""}
                    >
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer hover:bg-gray-100 dark:hover:text-gray-900"
                        onClick={() => setActiveUser(user, index)}
                      >
                        {user.firstName} {user.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phoneNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {user.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          to={`/users/${user.id}`}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteUser(user.id, user.firstName)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>


          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="flex justify-center mt-4">
              <ul className="flex list-none">
                <li>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-l disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Prev
                  </button>
                </li>
                {getPaginationNumbers().map((pageNumber) => (
                  <li key={pageNumber}>
                    <button
                      onClick={() => handlePageChange(pageNumber)}
                      className={`bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 ${pageNumber === currentPage ? "bg-blue-500 text-white dark:bg-cyan-200" : ""}`}
                    >
                      {pageNumber}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-r disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}

export default UsersList;