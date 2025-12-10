// components/PaginationComponent.js
export default class PaginationComponent {
    constructor(containerId, onPageChange) {
        this.container = document.getElementById(containerId);
        this.onPageChange = onPageChange;
    }

    render(totalItems, pageSize, currentPage) {
        const totalPages = Math.ceil(totalItems / pageSize);
        this.container.innerHTML = `
            <button class="btn btn-primary me-2" id="prevPage" ${currentPage === 1 ? "disabled" : ""}>Previous</button>
            <span class="mt-2">Page ${currentPage} of ${totalPages}</span>
            <button class="btn btn-primary ms-2" id="nextPage" ${currentPage === totalPages ? "disabled" : ""}>Next</button>
        `;

        this.container.querySelector("#prevPage").addEventListener("click", () => {
            if (currentPage > 1) this.onPageChange(currentPage - 1);
        });

        this.container.querySelector("#nextPage").addEventListener("click", () => {
            if (currentPage < totalPages) this.onPageChange(currentPage + 1);
        });
    }
}
