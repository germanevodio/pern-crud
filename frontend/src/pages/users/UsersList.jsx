import { useState, useEffect } from "react";
import UserService from "../../services/user.service";
import { Link } from "react-router-dom";

function UsersList() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const [searchUser, setSearchUser] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    retrieveUsers(currentPage, itemsPerPage, selectedRole, selectedStatus);
  }, [currentPage, itemsPerPage, selectedRole, selectedStatus]);

  const onChangeSearchTitle = (e) => {
    setSearchUser(e.target.value);
  };

  const onChangeRole = (e) => {
    setSelectedRole(e.target.value);
    setCurrentPage(1);
    setCurrentUser(null);
    setCurrentIndex(-1);
  };

  const onChangeStatus = (e) => {
    setSelectedStatus(e.target.value);
    setCurrentPage(1);
    setCurrentUser(null);
    setCurrentIndex(-1);
  };

  const retrieveUsers = (page, limit, role, status, name = "") => {
    UserService.getAll(page, limit, role, status, name)
      .then((response) => {
        setUsers(response.data.data);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
        setItemsPerPage(response.data.itemsPerPage);
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const setActiveUser = (user, index) => {
    setCurrentUser(user);
    setCurrentIndex(index);
  };

  const findByName = () => {
    setCurrentPage(1);
    retrieveUsers(1, itemsPerPage, selectedRole, selectedStatus, searchUser);
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      setCurrentUser(null);
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

  return (
    <div className="flex flex-col lg:flex-row gap-8 bg-slate-100 dark:bg-slate-700 p-8 rounded">
      {/* filters and list */}
      <div className="flex-1">
        {/* filters */}
        <div className="mb-4">
          <div className="flex mb-4">
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

          <div className="flex flex-col sm:flex-row gap-4">
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
        </div>

        {/* Users list */}
        <div className="p-4 bg-white dark:bg-slate-600 rounded shadow">
          <h4 className="font-bold text-lg mb-2 text-center">Users list</h4>
          <ul className="divide-y divide-gray-200 border border-gray-200 rounded">
            {users && users.length > 0 ? (
              users.map((user, index) => (
                <li
                  className={
                    "px-4 py-2 cursor-pointer " +
                    (index === currentIndex ? "bg-blue-100 dark:bg-slate-900" : "")
                  }
                  onClick={() => setActiveUser(user, index)}
                  key={user.id || index}
                >
                  {user.firstName} {user.lastName}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-center text-gray-500">
                No users found.
              </li>
            )}
          </ul>

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

      {/* User detail */}
      <div className="flex-1">
        {currentUser ? (
          <div className="p-4 bg-white dark:bg-slate-600 rounded shadow">
            <h4 className="font-bold text-xl mb-2 text-center">User</h4>
            <div className="mb-2">
              <strong>First Name: </strong>
              {currentUser.firstName}
            </div>
            <div className="mb-2">
              <strong>Last name: </strong>
              {currentUser.lastName}
            </div>
            <div className="mb-2">
              <strong>Email: </strong>
              {currentUser.email}
            </div>
            <div className="mb-2">
              <strong>Role: </strong>
              {currentUser.role}
            </div>
            <div className="mb-2">
              <strong>Status: </strong>
              {currentUser.status === "active" ? "Active" : "Inactive"}
            </div>

            <Link
              to={`/users/${currentUser.id}`}
              className="inline-block bg-yellow-400 text-black px-3 py-1 rounded"
            >
              Edit
            </Link>
          </div>
        ) : (
          <div>
            <p>Click on user to see details...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default UsersList;