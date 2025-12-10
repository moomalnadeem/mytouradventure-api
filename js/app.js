// init();
import DataService from "./services/DataService.js";
import TableComponent from "./components/TableComponent.js";
import SearchComponent from "./components/SearchComponent.js";
import { exportCSV, exportJSON } from "./utils/helpers.js";
import PaginationComponent from "./components/PaginationComponent.js";
document.addEventListener("DOMContentLoaded", async () => {
    const dataService = new DataService();
    const tableComponent = new TableComponent("tableComponent", onEdit, onDelete);
    const searchComponent = new SearchComponent("searchComponent", onSearch);
    const paginationComponent = new PaginationComponent("paginationComponent");
    const modal = new bootstrap.Modal(document.getElementById("employeeModal"));
    const form = document.getElementById("employeeForm");
    const errorBox = document.getElementById("formErrors");
    // Buttons
    document.getElementById("addEmployeeBtn").addEventListener("click", openModal);
    document.getElementById("exportCSV").addEventListener("click", () => exportCSV(dataService.collection.employees));
    document.getElementById("exportJSON").addEventListener("click", () => exportJSON(dataService.collection.employees));
    // pagination code
    const pageSize = 10;           // Number of employees per page
    let currentPage = 1;

    // Callback function for pagination
    function renderPage(page) {
        currentPage = page;
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        const pagedEmployees = dataService.collection.employees.slice(start, end);

        tableComponent.render(pagedEmployees);
        paginationComponent.render(dataService.collection.employees.length, pageSize, currentPage);
    }
    paginationComponent.onPageChange = renderPage;
    // ------------
    // Load employees
    const employees = await dataService.loadEmployees();
    tableComponent.render(employees);
    searchComponent.render();
    paginationComponent.render(employees.length, 10, 1);
    populateDepartmentFilter(employees);

    // --- Functions ---

    // Multi-select filter
    function populateDepartmentFilter(employees) {
        const container = document.getElementById("departmentFilter");
        const departments = [...new Set(employees.map(emp => emp.department))];
        container.innerHTML = "";

        departments.forEach(dep => {
            const li = document.createElement("li");
            li.classList.add("dropdown-item");

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.value = dep;
            checkbox.id = `dep_${dep}`;
            checkbox.className = "me-2";

            const label = document.createElement("label");
            label.htmlFor = `dep_${dep}`;
            label.textContent = dep;
            label.style.cursor = "pointer";

            li.appendChild(checkbox);
            li.appendChild(label);
            container.appendChild(li);
        });

        // Add change event
        container.querySelectorAll("input[type=checkbox]").forEach(cb => {
            cb.addEventListener("change", () => {
                const selectedDeps = Array.from(container.querySelectorAll("input:checked"))
                    .map(i => i.value);

                let filtered = dataService.collection.employees;
                if (selectedDeps.length > 0) {
                    filtered = filtered.filter(emp => selectedDeps.includes(emp.department));
                }

                tableComponent.render(filtered);
                paginationComponent.render(dataService.collection.employees.length, 10, 1);
            });
        });
    }

    function onSearch(query) {
        const filtered = dataService.search(query);
        tableComponent.render(filtered);
    }

    function onEdit(id) {
        const emp = dataService.collection.employees.find(e => e.id == id);
        if (!emp) return;
        document.getElementById("employeeId").value = emp.id;
        document.getElementById("name").value = emp.name;
        document.getElementById("role").value = emp.role;
        document.getElementById("department").value = emp.department;
        document.getElementById("pno").value = emp.pno;
        document.getElementById("age").value = emp.age;
        document.getElementById("salary").value = emp.salary;
        modal.show();
    }

    async function onDelete(id) {
        if (confirm("Are you sure you want to delete this employee?")) {
            await dataService.deleteEmployee(id);
            tableComponent.render(dataService.collection.employees);
            paginationComponent.render(dataService.collection.employees.length, 10, 1);
            populateDepartmentFilter(dataService.collection.employees);
        }
    }

    function openModal() {
        form.reset();
        document.getElementById("employeeId").value = "";
        modal.show();
    }
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const empData = {
            id: document.getElementById("employeeId").value,
            name: document.getElementById("name").value.trim(),
            role: document.getElementById("role").value,
            department: document.getElementById("department").value,
            pno: document.getElementById("pno").value,
            age: +document.getElementById("age").value,
            salary: +document.getElementById("salary").value
        };
        let errors = [];
        if (!empData.name) errors.push("Name is required");
        if (!empData.salary || empData.salary <= 0) {
            errors.push("Salary must be greater than 0");
        }
        if (errors.length > 0) {
            // errorBox.style.whiteSpace = "pre-line";
            errorBox.innerHTML = errors.join("\n");
            return;
        }


        if (empData.id) await dataService.updateEmployee(empData.id, empData);
        else await dataService.addEmployee(empData);
        modal.hide();
        tableComponent.render(dataService.collection.employees);
        paginationComponent.render(dataService.collection.employees.length, 10, 1);
        populateDepartmentFilter(dataService.collection.employees);
    });
});
