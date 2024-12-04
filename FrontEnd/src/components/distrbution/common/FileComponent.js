import { useEffect, useState } from "react";
import { Alert, Button,FormGroup, Label } from "reactstrap";
import { fileDownload } from "../../../api/DistApi";



const FileComponent = ({ fileData }) => {
    const [savedfile, setSavedfile] = useState([]); //받은 파일 셋팅

    useEffect(()=>{
        if(fileData){ //배열처리
            setSavedfile(Array.isArray(fileData)? fileData : [fileData]);
        }
        console.log(fileData);
    }, [fileData])

    
    //다운로드 클릭시 
    const handlefileDownload = (file) => {
        console.log(JSON.stringify(file));
        let path = file.category + "_" + file.assetNum;
        let filename = file.saveFileName;

        fileDownload(path, filename).then((data) => {
            const url = window.URL.createObjectURL(new Blob([data]));
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout((_) => {
                window.URL.revokeObjectURL(url);
            }, 1000);
            a.remove();
            //  setIsDownloading(false);
        }).catch((error) => {
            console.error("파일다운로드 오류:" + error);
        });


    }

    return (
        <FormGroup>
            <Label for="savedfile">첨부파일</Label>
            <Alert color="info">
                <ul>
                    {savedfile.map((file, index) => (
                        <li key={index}>
                        <span><i className="bi bi-file-earmark-arrow-down-fill">&nbsp;&nbsp;</i></span>
                        {file.originFileName}&nbsp;&nbsp;
                        <Button className="badge" color="secondary" size="sm"
                            onClick={() => handlefileDownload(file)}
                        >Download</Button>
                </li>
                    ))}
                </ul>
            </Alert>
        </FormGroup>

    );
}

export default FileComponent;