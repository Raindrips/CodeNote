/**
 * 表格组件JavaScript
 * 处理表格的排序、筛选、分页等功能
 */

/**
 * 初始化表格
 */
function initTable() {
    console.log('初始化表格组件...');
    
    // 初始化所有可排序表格
    document.querySelectorAll('.table-sortable').forEach(table => {
        new SortableTable(table);
    });
    
    // 初始化所有可筛选表格
    document.querySelectorAll('.table-filterable').forEach(table => {
        new FilterableTable(table);
    });
    
    // 初始化所有分页表格
    document.querySelectorAll('.table-paginated').forEach(table => {
        new PaginatedTable(table);
    });
}

/**
 * 可排序表格类
 */
class SortableTable {
    constructor(table) {
        this.table = table;
        this.headers = this.table.querySelectorAll('th[data-sortable]');
        this.tbody = this.table.querySelector('tbody');
        this.rows = Array.from(this.tbody.querySelectorAll('tr'));
        this.currentSort = { column: null, direction: 'asc' };
        
        this.init();
    }
    
    init() {
        this.headers.forEach((header, index) => {
            header.style.cursor = 'pointer';
            header.setAttribute('role', 'columnheader');
            header.setAttribute('tabindex', '0');
            
            // 添加排序图标
            const sortIcon = document.createElement('span');
            sortIcon.className = 'sort-icon';
            sortIcon.innerHTML = '<i class="fas fa-sort"></i>';
            header.appendChild(sortIcon);
            
            // 绑定点击事件
            header.addEventListener('click', () => this.sort(index));
            header.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.sort(index);
                }
            });
        });
    }
    
    sort(columnIndex) {
        const header = this.headers[columnIndex];
        const sortType = header.getAttribute('data-sort-type') || 'string';
        
        // 确定排序方向
        if (this.currentSort.column === columnIndex) {
            this.currentSort.direction = this.currentSort.direction === 'asc' ? 'desc' : 'asc';
        } else {
            this.currentSort.direction = 'asc';
        }
        
        this.currentSort.column = columnIndex;
        
        // 更新排序图标
        this.updateSortIcons();
        
        // 排序数据
        this.rows.sort((a, b) => {
            const aValue = this.getCellValue(a, columnIndex);
            const bValue = this.getCellValue(b, columnIndex);
            
            let comparison = 0;
            
            switch (sortType) {
                case 'number':
                    comparison = parseFloat(aValue) - parseFloat(bValue);
                    break;
                case 'date':
                    comparison = new Date(aValue) - new Date(bValue);
                    break;
                default:
                    comparison = aValue.localeCompare(bValue);
            }
            
            return this.currentSort.direction === 'asc' ? comparison : -comparison;
        });
        
        // 重新排列行
        this.rows.forEach(row => this.tbody.appendChild(row));
        
        // 触发排序事件
        this.table.dispatchEvent(new CustomEvent('tableSorted', {
            detail: {
                column: columnIndex,
                direction: this.currentSort.direction,
                sortType
            }
        }));
    }
    
    getCellValue(row, columnIndex) {
        const cell = row.cells[columnIndex];
        const sortValue = cell.getAttribute('data-sort-value');
        return sortValue || cell.textContent.trim();
    }
    
    updateSortIcons() {
        this.headers.forEach((header, index) => {
            const icon = header.querySelector('.sort-icon i');
            if (index === this.currentSort.column) {
                icon.className = this.currentSort.direction === 'asc' 
                    ? 'fas fa-sort-up' 
                    : 'fas fa-sort-down';
                header.setAttribute('aria-sort', this.currentSort.direction === 'asc' ? 'ascending' : 'descending');
            } else {
                icon.className = 'fas fa-sort';
                header.setAttribute('aria-sort', 'none');
            }
        });
    }
}

/**
 * 可筛选表格类
 */
class FilterableTable {
    constructor(table) {
        this.table = table;
        this.tbody = this.table.querySelector('tbody');
        this.rows = Array.from(this.tbody.querySelectorAll('tr'));
        this.filters = {};
        
        this.init();
    }
    
    init() {
        this.createFilterInputs();
        this.bindFilterEvents();
    }
    
    createFilterInputs() {
        const thead = this.table.querySelector('thead');
        const headerRow = thead.querySelector('tr');
        const filterRow = document.createElement('tr');
        filterRow.className = 'filter-row';
        
        Array.from(headerRow.cells).forEach((header, index) => {
            const filterCell = document.createElement('th');
            
            if (header.hasAttribute('data-filterable')) {
                const filterType = header.getAttribute('data-filter-type') || 'text';
                const input = this.createFilterInput(filterType, index);
                filterCell.appendChild(input);
            }
            
            filterRow.appendChild(filterCell);
        });
        
        thead.appendChild(filterRow);
    }
    
    createFilterInput(type, columnIndex) {
        let input;
        
        switch (type) {
            case 'select':
                input = document.createElement('select');
                input.className = 'form-select form-select-sm';
                
                // 获取唯一值
                const uniqueValues = [...new Set(
                    this.rows.map(row => row.cells[columnIndex].textContent.trim())
                )].sort();
                
                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = '全部';
                input.appendChild(defaultOption);
                
                uniqueValues.forEach(value => {
                    const option = document.createElement('option');
                    option.value = value;
                    option.textContent = value;
                    input.appendChild(option);
                });
                break;
                
            case 'date':
                input = document.createElement('input');
                input.type = 'date';
                input.className = 'form-input form-input-sm';
                break;
                
            case 'number':
                input = document.createElement('input');
                input.type = 'number';
                input.className = 'form-input form-input-sm';
                input.placeholder = '筛选...';
                break;
                
            default:
                input = document.createElement('input');
                input.type = 'text';
                input.className = 'form-input form-input-sm';
                input.placeholder = '筛选...';
        }
        
        input.setAttribute('data-column', columnIndex);
        return input;
    }
    
    bindFilterEvents() {
        const filterInputs = this.table.querySelectorAll('.filter-row input, .filter-row select');
        
        filterInputs.forEach(input => {
            input.addEventListener('input', () => this.applyFilters());
            input.addEventListener('change', () => this.applyFilters());
        });
    }
    
    applyFilters() {
        const filterInputs = this.table.querySelectorAll('.filter-row input, .filter-row select');
        
        // 收集筛选条件
        this.filters = {};
        filterInputs.forEach(input => {
            const column = input.getAttribute('data-column');
            const value = input.value.toLowerCase().trim();
            if (value) {
                this.filters[column] = value;
            }
        });
        
        // 应用筛选
        this.rows.forEach(row => {
            let visible = true;
            
            Object.entries(this.filters).forEach(([column, filterValue]) => {
                const cellValue = row.cells[column].textContent.toLowerCase().trim();
                
                if (input.type === 'select') {
                    visible = visible && cellValue === filterValue;
                } else {
                    visible = visible && cellValue.includes(filterValue);
                }
            });
            
            row.style.display = visible ? '' : 'none';
        });
        
        // 触发筛选事件
        this.table.dispatchEvent(new CustomEvent('tableFiltered', {
            detail: { filters: this.filters }
        }));
    }
    
    clearFilters() {
        const filterInputs = this.table.querySelectorAll('.filter-row input, .filter-row select');
        filterInputs.forEach(input => {
            input.value = '';
        });
        
        this.filters = {};
        this.rows.forEach(row => {
            row.style.display = '';
        });
    }
}

/**
 * 分页表格类
 */
class PaginatedTable {
    constructor(table) {
        this.table = table;
        this.tbody = this.table.querySelector('tbody');
        this.rows = Array.from(this.tbody.querySelectorAll('tr'));
        this.pageSize = parseInt(this.table.getAttribute('data-page-size')) || 10;
        this.currentPage = 1;
        this.totalPages = Math.ceil(this.rows.length / this.pageSize);
        
        this.init();
    }
    
    init() {
        this.createPagination();
        this.showPage(1);
    }
    
    createPagination() {
        const paginationContainer = document.createElement('div');
        paginationContainer.className = 'table-pagination';
        
        const pagination = document.createElement('nav');
        pagination.className = 'pagination';
        
        // 上一页按钮
        const prevBtn = document.createElement('button');
        prevBtn.className = 'page-btn page-prev';
        prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevBtn.addEventListener('click', () => this.prevPage());
        pagination.appendChild(prevBtn);
        
        // 页码按钮容器
        this.pageButtonsContainer = document.createElement('div');
        this.pageButtonsContainer.className = 'page-buttons';
        pagination.appendChild(this.pageButtonsContainer);
        
        // 下一页按钮
        const nextBtn = document.createElement('button');
        nextBtn.className = 'page-btn page-next';
        nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextBtn.addEventListener('click', () => this.nextPage());
        pagination.appendChild(nextBtn);
        
        paginationContainer.appendChild(pagination);
        
        // 页面信息
        const pageInfo = document.createElement('div');
        pageInfo.className = 'page-info';
        this.pageInfoElement = pageInfo;
        paginationContainer.appendChild(pageInfo);
        
        // 页面大小选择器
        const pageSizeContainer = document.createElement('div');
        pageSizeContainer.className = 'page-size-selector';
        
        const label = document.createElement('label');
        label.textContent = '每页显示：';
        
        const select = document.createElement('select');
        select.className = 'form-select form-select-sm';
        [5, 10, 20, 50, 100].forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = size;
            option.selected = size === this.pageSize;
            select.appendChild(option);
        });
        
        select.addEventListener('change', (e) => {
            this.pageSize = parseInt(e.target.value);
            this.totalPages = Math.ceil(this.rows.length / this.pageSize);
            this.currentPage = 1;
            this.updatePagination();
            this.showPage(1);
        });
        
        pageSizeContainer.appendChild(label);
        pageSizeContainer.appendChild(select);
        paginationContainer.appendChild(pageSizeContainer);
        
        // 插入到表格后面
        this.table.parentNode.insertBefore(paginationContainer, this.table.nextSibling);
        
        this.paginationElement = pagination;
        this.updatePagination();
    }
    
    updatePagination() {
        // 更新页码按钮
        this.pageButtonsContainer.innerHTML = '';
        
        const maxVisiblePages = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        // 第一页
        if (startPage > 1) {
            this.createPageButton(1);
            if (startPage > 2) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'page-ellipsis';
                ellipsis.textContent = '...';
                this.pageButtonsContainer.appendChild(ellipsis);
            }
        }
        
        // 页码按钮
        for (let i = startPage; i <= endPage; i++) {
            this.createPageButton(i);
        }
        
        // 最后一页
        if (endPage < this.totalPages) {
            if (endPage < this.totalPages - 1) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'page-ellipsis';
                ellipsis.textContent = '...';
                this.pageButtonsContainer.appendChild(ellipsis);
            }
            this.createPageButton(this.totalPages);
        }
        
        // 更新导航按钮状态
        const prevBtn = this.paginationElement.querySelector('.page-prev');
        const nextBtn = this.paginationElement.querySelector('.page-next');
        
        prevBtn.disabled = this.currentPage === 1;
        nextBtn.disabled = this.currentPage === this.totalPages;
        
        // 更新页面信息
        const start = (this.currentPage - 1) * this.pageSize + 1;
        const end = Math.min(this.currentPage * this.pageSize, this.rows.length);
        this.pageInfoElement.textContent = `显示 ${start}-${end} 条，共 ${this.rows.length} 条`;
    }
    
    createPageButton(pageNumber) {
        const button = document.createElement('button');
        button.className = `page-btn ${pageNumber === this.currentPage ? 'active' : ''}`;
        button.textContent = pageNumber;
        button.addEventListener('click', () => this.showPage(pageNumber));
        this.pageButtonsContainer.appendChild(button);
    }
    
    showPage(pageNumber) {
        if (pageNumber < 1 || pageNumber > this.totalPages) return;
        
        this.currentPage = pageNumber;
        
        const start = (pageNumber - 1) * this.pageSize;
        const end = start + this.pageSize;
        
        this.rows.forEach((row, index) => {
            row.style.display = (index >= start && index < end) ? '' : 'none';
        });
        
        this.updatePagination();
        
        // 触发分页事件
        this.table.dispatchEvent(new CustomEvent('tablePageChanged', {
            detail: {
                currentPage: this.currentPage,
                pageSize: this.pageSize,
                totalPages: this.totalPages
            }
        }));
    }
    
    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.showPage(this.currentPage + 1);
        }
    }
    
    prevPage() {
        if (this.currentPage > 1) {
            this.showPage(this.currentPage - 1);
        }
    }
}

/**
 * 表格工具类
 */
class TableUtils {
    /**
     * 创建表格
     * @param {Object} options - 表格配置
     * @returns {HTMLElement} 表格元素
     */
    static create(options = {}) {
        const {
            id = 'table-' + Date.now(),
            className = '',
            columns = [],
            data = [],
            sortable = false,
            filterable = false,
            paginated = false,
            pageSize = 10,
            striped = true,
            bordered = true,
            hover = true
        } = options;
        
        if (columns.length === 0) {
            console.warn('表格列配置为空');
            return null;
        }
        
        // 创建表格
        const table = document.createElement('table');
        table.className = `table ${className}`.trim();
        table.id = id;
        
        if (striped) table.classList.add('table-striped');
        if (bordered) table.classList.add('table-bordered');
        if (hover) table.classList.add('table-hover');
        if (sortable) table.classList.add('table-sortable');
        if (filterable) table.classList.add('table-filterable');
        if (paginated) {
            table.classList.add('table-paginated');
            table.setAttribute('data-page-size', pageSize);
        }
        
        // 创建表头
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        columns.forEach(column => {
            const th = document.createElement('th');
            th.textContent = column.title || column.key;
            
            if (column.sortable && sortable) {
                th.setAttribute('data-sortable', '');
                th.setAttribute('data-sort-type', column.sortType || 'string');
            }
            
            if (column.filterable && filterable) {
                th.setAttribute('data-filterable', '');
                th.setAttribute('data-filter-type', column.filterType || 'text');
            }
            
            if (column.width) {
                th.style.width = column.width;
            }
            
            headerRow.appendChild(th);
        });
        
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        // 创建表体
        const tbody = document.createElement('tbody');
        
        data.forEach(rowData => {
            const row = document.createElement('tr');
            
            columns.forEach(column => {
                const td = document.createElement('td');
                const value = rowData[column.key];
                
                if (column.render && typeof column.render === 'function') {
                    const rendered = column.render(value, rowData);
                    if (typeof rendered === 'string') {
                        td.innerHTML = rendered;
                    } else if (rendered instanceof HTMLElement) {
                        td.appendChild(rendered);
                    } else {
                        td.textContent = rendered;
                    }
                } else {
                    td.textContent = value;
                }
                
                if (column.sortValue) {
                    td.setAttribute('data-sort-value', column.sortValue(value, rowData));
                }
                
                row.appendChild(td);
            });
            
            tbody.appendChild(row);
        });
        
        table.appendChild(tbody);
        
        return table;
    }
    
    /**
     * 导出表格数据为CSV
     * @param {HTMLElement|string} table - 表格元素或ID
     * @param {string} filename - 文件名
     */
    static exportToCSV(table, filename = 'table-data.csv') {
        const tableElement = typeof table === 'string' ? document.getElementById(table) : table;
        if (!tableElement) return;
        
        const rows = tableElement.querySelectorAll('tr:not(.filter-row)');
        const csvContent = Array.from(rows).map(row => {
            const cells = row.querySelectorAll('th, td');
            return Array.from(cells).map(cell => {
                const text = cell.textContent.trim();
                return `"${text.replace(/"/g, '""')}"`;
            }).join(',');
        }).join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    }
    
    /**
     * 添加行
     * @param {HTMLElement|string} table - 表格元素或ID
     * @param {Object} rowData - 行数据
     * @param {number} index - 插入位置，默认为末尾
     */
    static addRow(table, rowData, index = -1) {
        const tableElement = typeof table === 'string' ? document.getElementById(table) : table;
        if (!tableElement) return;
        
        const tbody = tableElement.querySelector('tbody');
        const headers = tableElement.querySelectorAll('thead th');
        const row = document.createElement('tr');
        
        headers.forEach((header, i) => {
            const td = document.createElement('td');
            const key = header.getAttribute('data-key') || i;
            td.textContent = rowData[key] || '';
            row.appendChild(td);
        });
        
        if (index >= 0 && index < tbody.children.length) {
            tbody.insertBefore(row, tbody.children[index]);
        } else {
            tbody.appendChild(row);
        }
        
        return row;
    }
    
    /**
     * 删除行
     * @param {HTMLElement|string} table - 表格元素或ID
     * @param {number} index - 行索引
     */
    static removeRow(table, index) {
        const tableElement = typeof table === 'string' ? document.getElementById(table) : table;
        if (!tableElement) return;
        
        const tbody = tableElement.querySelector('tbody');
        const row = tbody.children[index];
        if (row) {
            row.remove();
        }
    }
}

// 导出到全局
window.SortableTable = SortableTable;
window.FilterableTable = FilterableTable;
window.PaginatedTable = PaginatedTable;
window.TableUtils = TableUtils;
window.initTable = initTable;

// 添加表格样式（如果不存在）
if (!document.querySelector('#table-styles')) {
    const style = document.createElement('style');
    style.id = 'table-styles';
    style.textContent = `
        .table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 1rem;
        }
        
        .table th,
        .table td {
            padding: 0.75rem;
            text-align: left;
            border-bottom: 1px solid #dee2e6;
        }
        
        .table th {
            font-weight: 600;
            background-color: #f8f9fa;
        }
        
        .table-striped tbody tr:nth-child(odd) {
            background-color: rgba(0, 0, 0, 0.05);
        }
        
        .table-bordered {
            border: 1px solid #dee2e6;
        }
        
        .table-bordered th,
        .table-bordered td {
            border: 1px solid #dee2e6;
        }
        
        .table-hover tbody tr:hover {
            background-color: rgba(0, 0, 0, 0.075);
        }
        
        .sort-icon {
            margin-left: 0.5rem;
            opacity: 0.5;
        }
        
        .table th[aria-sort="ascending"] .sort-icon,
        .table th[aria-sort="descending"] .sort-icon {
            opacity: 1;
        }
        
        .filter-row th {
            padding: 0.5rem;
            background-color: #e9ecef;
        }
        
        .filter-row input,
        .filter-row select {
            width: 100%;
            margin: 0;
        }
        
        .table-pagination {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 1rem;
            flex-wrap: wrap;
            gap: 1rem;
        }
        
        .page-buttons {
            display: flex;
            gap: 0.25rem;
        }
        
        .page-info {
            font-size: 0.875rem;
            color: #6c757d;
        }
        
        .page-size-selector {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.875rem;
        }
        
        .page-size-selector select {
            width: auto;
            min-width: 80px;
        }
        
        @media (max-width: 768px) {
            .table-pagination {
                flex-direction: column;
                align-items: stretch;
            }
            
            .pagination {
                justify-content: center;
            }
            
            .table {
                font-size: 0.875rem;
            }
            
            .table th,
            .table td {
                padding: 0.5rem;
            }
        }
    `;
    document.head.appendChild(style);
}

