export const downloadCSV = (data, filename) => {
    if (!data || !data.length) {
        console.warn("No data to export");
        return;
    }

    // Determine headers from the first item
    const firstItem = data[0];
    const isObject = typeof firstItem === 'object' && firstItem !== null;

    let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; // Add BOM for Excel compatibility

    if (isObject) {
        const headers = Object.keys(firstItem);
        csvContent += headers.join(",") + "\n";

        data.forEach(item => {
            const row = headers.map(header => {
                const value = item[header] || '';
                // Escape quotes and wrap in quotes if necessary
                const stringValue = String(value).replace(/"/g, '""');
                return `"${stringValue}"`;
            }).join(",");
            csvContent += row + "\n";
        });
    } else {
        // Simple array of strings
        csvContent += "Valeur\n"; // Default header
        data.forEach(item => {
            const stringValue = String(item).replace(/"/g, '""');
            csvContent += `"${stringValue}"\n`;
        });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
