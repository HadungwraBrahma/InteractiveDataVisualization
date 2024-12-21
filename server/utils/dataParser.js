export const parseGoogleSheetData = (csvData) => {
  const cleanedData = csvData.trim().replace(/\r\n/g, "\n");

  const lines = cleanedData.split("\n").filter((line) => line.trim() !== "");

  if (lines.length === 0) {
    throw new Error("No data found in CSV");
  }

  const headers = lines[0].split(",").map((header) => header.trim());

  return lines
    .slice(1)
    .map((line, index) => {
      try {
        const values = line.split(",").map((value) => value.trim());

        const row = headers.reduce((obj, header, colIndex) => {
          const value = values[colIndex] || null;

          switch (header) {
            case "date":
              obj[header] = value
                ? new Date(value).toISOString().split("T")[0]
                : null;
              break;
            case "A":
            case "B":
            case "C":
            case "D":
            case "E":
            case "F":
              obj[header] = value ? Number(value) : 0;
              break;
            case "ageGroup":
            case "gender":
              obj[header] = value ? String(value).trim() : null;
              break;
            default:
              obj[header] = value;
          }

          return obj;
        }, {});

        return row;
      } catch (error) {
        console.error(`Error parsing row ${index + 2}:`, error);
        return null;
      }
    })
    .filter((row) => row !== null);
};
