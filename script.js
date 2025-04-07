document.addEventListener('DOMContentLoaded', function() {
    const executeBtn = document.getElementById('execute-btn');
    const sqlQueryInput = document.getElementById('sql-query');
    const resultsDiv = document.getElementById('results');
    const errorMessageDiv = document.getElementById('error-message');

    executeBtn.addEventListener('click', function() {
        const sqlQuery = sqlQueryInput.value;
        resultsDiv.innerHTML = ''; // Clear previous results
        errorMessageDiv.textContent = ''; // Clear previous errors

        const formData = new FormData();
        formData.append('sql_query', sqlQuery);

        fetch('execute_sql.php', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                if (data.results && data.results.length > 0) {
                    let table = '<table><thead><tr>';
                    if (data.columns) {
                        data.columns.forEach(column => {
                            table += `<th>${column}</th>`;
                        });
                        table += '</tr></thead><tbody>';
                        data.results.forEach(row => {
                            table += '<tr>';
                            data.columns.forEach(column => {
                                table += `<td>${row[column]}</td>`;
                            });
                            table += '</tr>';
                        });
                        table += '</tbody></table>';
                    } else {
                        // For queries without columns (e.g., INSERT, UPDATE)
                        table = '<p>Query executed successfully.</p>';
                    }
                    resultsDiv.innerHTML = table;
                } else {
                    resultsDiv.textContent = 'Query executed successfully, no results returned.';
                }
            } else if (data.status === 'error') {
                errorMessageDiv.textContent = `Error: ${data.message}`;
            }
        })
        .catch(error => {
            errorMessageDiv.textContent = `Network error: ${error}`;
        });
    });
});