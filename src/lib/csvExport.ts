/**
 * Secure, dependency-free CSV exporter for administrative reports.
 * Automatically adds UTF-8 BOM (\uFEFF) so Microsoft Excel displays
 * multilingual characters, accents, and Arabic text seamlessly.
 */

export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string = 'export.csv'
) {
  if (!data || data.length === 0) {
    alert('No data available to export.');
    return;
  }

  const headers = Object.keys(data[0]);

  const escapeCSVValue = (val: any): string => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""'); // Escape double quotes
    return `"${str}"`;
  };

  const headerRow = headers.map(escapeCSVValue).join(',');
  const dataRows = data.map((row) =>
    headers.map((field) => escapeCSVValue(row[field])).join(',')
  );

  // Prepend UTF-8 BOM to guarantee proper Excel rendering
  const csvContent = '\uFEFF' + [headerRow, ...dataRows].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
