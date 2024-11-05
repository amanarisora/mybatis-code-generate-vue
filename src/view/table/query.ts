export const BasicAutoCompletion = [
    // SQL Keywords
    { label: 'SELECT', type: 'keyword' },
    { label: 'FROM', type: 'keyword' },
    { label: 'WHERE', type: 'keyword' },
    { label: 'INSERT', type: 'keyword' },
    { label: 'UPDATE', type: 'keyword' },
    { label: 'DELETE', type: 'keyword' },
    { label: 'JOIN', type: 'keyword' },
    { label: 'INNER JOIN', type: 'keyword' },
    { label: 'LEFT JOIN', type: 'keyword' },
    { label: 'RIGHT JOIN', type: 'keyword' },
    { label: 'FULL JOIN', type: 'keyword' },
    { label: 'GROUP BY', type: 'keyword' },
    { label: 'ORDER BY', type: 'keyword' },
    { label: 'LIMIT', type: 'keyword' },
    { label: 'OFFSET', type: 'keyword' },
    { label: 'CREATE TABLE', type: 'keyword' },
    { label: 'ALTER TABLE', type: 'keyword' },
    { label: 'DROP TABLE', type: 'keyword' },
    { label: 'CREATE INDEX', type: 'keyword' },
    { label: 'DROP INDEX', type: 'keyword' },

    // SQL Functions
    { label: 'COUNT', type: 'function' },
    { label: 'SUM', type: 'function' },
    { label: 'AVG', type: 'function' },
    { label: 'MIN', type: 'function' },
    { label: 'MAX', type: 'function' },

    // SQL Data Types
    { label: 'INT', type: 'datatype' },
    { label: 'BIGINT', type: 'datatype' },
    { label: 'VARCHAR', type: 'datatype' },
    { label: 'TEXT', type: 'datatype' },
    { label: 'DATE', type: 'datatype' },
    { label: 'DATETIME', type: 'datatype' },
    { label: 'TIMESTAMP', type: 'datatype' },
    { label: 'BOOLEAN', type: 'datatype' },
    { label: 'FLOAT', type: 'datatype' },
    { label: 'DOUBLE', type: 'datatype' },
    { label: 'DECIMAL', type: 'datatype' },
    { label: 'CHAR', type: 'datatype' },
    { label: 'BLOB', type: 'datatype' },
    { label: 'ENUM', type: 'datatype' },

    // Existing Entries
    { label: "hello", type: "variable" },
    { label: "magic", type: "text", apply: "⠁⭒*.✩.*⭒⠁", detail: "macro" },

]