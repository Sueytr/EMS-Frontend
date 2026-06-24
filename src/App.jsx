import { useEffect, useState } from "react";

function App() {
  const [employees, setEmployees] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    department: "",
    salary: "",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [editId, setEditId] = useState(null);

  const API_URL = "https://ems-backend-eyl4.onrender.com";

  // FETCH EMPLOYEES
  const getEmployees = async () => {
    const response = await fetch(API_URL);
    const data = await response.json();
    setEmployees(data);
  };

  useEffect(() => {
    getEmployees();
  }, []);

  // HANDLE INPUT
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ADD EMPLOYEE
  const addEmployee = async (e) => {
    e.preventDefault();

    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    setFormData({
      name: "",
      department: "",
      salary: "",
    });

    getEmployees();
  };

  // DELETE EMPLOYEE
  const deleteEmployee = async (id) => {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    getEmployees();
  };

  // EDIT EMPLOYEE
  const editEmployee = (employee) => {
    setEditId(employee.id);

    setFormData({
      name: employee.name,
      department: employee.department,
      salary: employee.salary,
    });
  };

  // UPDATE EMPLOYEE
  const updateEmployee = async (e) => {
    e.preventDefault();

    await fetch(`${API_URL}/${editId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    setEditId(null);

    setFormData({
      name: "",
      department: "",
      salary: "",
    });

    getEmployees();
  };

  // SEARCH + FILTER
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch = employee.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesDepartment =
      departmentFilter === "" ||
      employee.department === departmentFilter;

    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="container">
      <h1>Employee Management System</h1>

      <h2>Total Employees: {filteredEmployees.length}</h2>

      {/* Search */}
      <input
        type="text"
        placeholder="Search Employee"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Department Filter */}
      <select
        value={departmentFilter}
        onChange={(e) => setDepartmentFilter(e.target.value)}
      >
        <option value="">All Departments</option>
        <option value="HR">HR</option>
        <option value="IT">IT</option>
        <option value="Finance">Finance</option>
        <option value="Marketing">Marketing</option>
      </select>

      {/* Form */}
      <form
        onSubmit={editId ? updateEmployee : addEmployee}
        className="form"
      >
        <input
          type="text"
          name="name"
          placeholder="Employee Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="department"
          placeholder="Department"
          value={formData.department}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="salary"
          placeholder="Salary"
          value={formData.salary}
          onChange={handleChange}
          required
        />

        <button type="submit">
          {editId ? "Update Employee" : "Add Employee"}
        </button>
      </form>

      {/* Employee Cards */}
      <div className="employee-grid">
        {filteredEmployees.map((employee) => (
          <div key={employee.id} className="card">
            <h3>{employee.name}</h3>

            <p>
              <strong>Department:</strong> {employee.department}
            </p>

            <p>
              <strong>Salary:</strong> ₹{employee.salary}
            </p>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => editEmployee(employee)}
              >
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={() => deleteEmployee(employee.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
