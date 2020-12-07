require('dotenv-defaults').config();
const ExcelJS = require('exceljs')
const workbook =  new ExcelJS.Workbook();
const workbookRead = async ()  => {
    return await workbook.xlsx.readFile(process.env.FILE)
} 

class Xlsx {
    constructor(){
        return (async () =>{
            this.file = await workbookRead();
            return this;
        })();
    }
    getLastRow(){
        this.file.getWorksheet(1).getCell("D1").value = "Result import";
        return this.file.getWorksheet(1).lastRow.number
    }
    getRow(line){
        return this.file.getWorksheet(1).getRow(line);
    }
    setResult(startLine, endLine, result){
        for(; startLine <= endLine; startLine++){
            this.file.getWorksheet(1).getCell(`D${startLine}`).value = result;
        }
    }
    saveEndFile(){
        workbook.xlsx.writeFile(process.env.FILE);
    }
}

export { Xlsx }