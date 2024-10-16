// First, import the required modules
import { Injectable } from "@angular/core";
import * as XLSX from "xlsx";

@Injectable({
  providedIn: "root",
})
export class ExcelService {
  constructor() {}

  exportJsonToExcel(jsonData: any[], fileName: string): void {
    // Step 1: Convert JSON data to worksheet
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData, {
      cellDates: false, // Disable automatic date conversion
    });

    // Step 2: Specify that all columns should be treated as text
    const range = XLSX.utils.decode_range(worksheet["!ref"]!);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      for (let R = range.s.r; R <= range.e.r; ++R) {
        const cell_address = XLSX.utils.encode_cell({ r: R, c: C });
        if (worksheet[cell_address]) {
          worksheet[cell_address].z = "@"; // Forces the cell format to text
        }
      }
    }

    // Step 3: Create a workbook and add the worksheet
    const workbook: XLSX.WorkBook = {
      Sheets: { Sheet1: worksheet },
      SheetNames: ["Sheet1"],
    };

    // Step 4: Export the workbook to an Excel file
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  }
}
