// api url -----------------------------------------------
// const BASE_URL = 'https://6926b10d26e7e41498fb2e0e.mockapi.io/api/employee';
import { BASE_URL } from '../../env.js';

// api for all employes -------------------

export default class EmployeeAPI {
    // static async getAll() {
    //     const res = await fetch(BASE_URL);
    //     return res.json();
    // }

    static async getAll() {
        try {
            const res = await fetch(BASE_URL);

            if (!res.ok) {
                throw new Error(`API Error: ${res.status} - ${res.statusText}`);
            }
            return res.json();
        } catch (err) {
            console.log('error', err)
            return { error: true, message: err.message };
        }

    }


    // api for all emloye by id  -------------------
    static async getById(id) {
        const res = await fetch(`${BASE_URL}/${id}`);
        return res.json();
    }

    // api call for create employee -------------------
    static async create(employee) {
        const res = await fetch(BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(employee)
        });
        return res.json();
    }

    // api for call update employee -------------------

    static async update(id, employee) {
        const res = await fetch(`${BASE_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(employee)
        });
        return res.json();
    }

    static async delete(id) {
        const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
        return res.json();
    }
}
