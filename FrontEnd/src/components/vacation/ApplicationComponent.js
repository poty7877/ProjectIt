import {
    Card,
    Row,
    Col,
    CardTitle,
    CardBody,
    FormGroup,
    Label,
    Input, Button,
} from "reactstrap";
import {useState} from "react";


const ApplicationComponent = () => {
    const initState = {
        kind : '',

    };
    const[vacation, setVacation] = useState(initState);
    
    return(
        <div>
            <div>
                <div> 휴가 종류 </div>
                <div>
                    <Input type="radio" checked={vacation.kind=="병가"} value="병가"/>
                    <Label> 병가 </Label>
                    <Input type="radio" checked={vacation.kind=="휴가"} value="휴가"/>
                    <Label> 휴가 </Label>

                </div>
            </div>

            <div>

            </div>
        </div>
    )
}

export default ApplicationComponent;