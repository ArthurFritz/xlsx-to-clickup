import { Xlsx } from "./xlsx";
import * as click from './clickup'

const COLUMN_FATHER         = 1;
const COLUMN_TITLE          = 2;
const COLUMN_DESCRIPTION    = 3;
const COLUMN_STATUS         = 4;
const START_CONTENT         = 2;

const callClick = async (data) => {
    try{
        let result =  await click.addTask(data);
        return result.data.url;
    } catch (error) {
        console.log(error);
        if(error.response.status == 419){
            console.log("Rate-limit in the minute, wait 60 seconts to retry")
            await new Promise(resolve => setTimeout(resolve, 60000));
            return await callClick(data);
        } else {
            return `${error.response.status} - ${JSON.stringify(error.response.data)}`;
        }
    }
}

const start = async () => {
    const xlsx = await new Xlsx()
    console.log(`-------> Started processing XLSX`);
    let totalLines = xlsx.getLastRow();   
    let lastLine  = START_CONTENT;
    let lastTitle = null;
    let lastDescription = null;
    let lastFather = null;
    let callApi = 0;
    for(let line = START_CONTENT;line <= totalLines+1; line++){
        let row = xlsx.getRow(line);
        let status = row.getCell(COLUMN_STATUS).value
        if(!status) {
            let title = row.getCell(COLUMN_TITLE).value;
            if(lastTitle != title){
                if(lastTitle){
                    callApi++;
                    console.log(`===> Call api ${lastTitle} - request ${callApi}`);
                    const result = await callClick({ title: lastTitle,
                                                     description: lastDescription,
                                                     father: lastFather
                                                    });
                    console.log(`-> ${result}`);
                    xlsx.setResult(lastLine, line-1, result)
                }
                lastTitle = title;
                lastDescription = row.getCell(COLUMN_DESCRIPTION).value;
                lastFather = row.getCell(COLUMN_FATHER).value;
                lastLine = line;
            } else {
                lastDescription+= `\n${row.getCell(COLUMN_DESCRIPTION).value}`
            }
        } else {
            console.warn(`* Line ${line} has processed *`)
        } 
    }
    xlsx.saveEndFile()
    console.log(`-------> Fim`);
}

start();