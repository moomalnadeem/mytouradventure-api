// js/services/DataService.js
import EmployeeAPI from "../api/EmployeeAPI.js";
import Employee from "../models/Employee.js";
import EmployeeCollection from "../models/EmployeeCollection.js";

export default class DataService {
    constructor() {
        this.collection = new EmployeeCollection();
    }

    // load and store employees
    async loadEmployees() {
        const data = await EmployeeAPI.getAll();
        // guard if API returns something unexpected
        const employees = Array.isArray(data) ? data.map(e => new Employee(e)) : [];
        this.collection.setEmployees(employees);
        return employees;
    }

    async addEmployee(empData) {
        const created = await EmployeeAPI.create(empData);
        const employee = new Employee(created);
        this.collection.add(employee);
        return employee;
    }

    async updateEmployee(id, empData) {
        const updated = await EmployeeAPI.update(id, empData);
        const employee = new Employee(updated);
        this.collection.update(employee);
        return employee;
    }

    async deleteEmployee(id) {
        await EmployeeAPI.delete(id);
        this.collection.delete(id);
    }

    search(query) {
        if (!query) return this.collection.employees;
        return this.collection.search(query);
    }
}
