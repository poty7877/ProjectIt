import ProjectIssueRegisterComponent from "../../components/project/ProjectIssueRegisterComponent";
import {useParams} from "react-router-dom";

const ProjectIssueRegister = () => {
    const {pno} = useParams()
    return (
        <div>
            <ProjectIssueRegisterComponent pno={pno}/>
        </div>
    )
}

export default ProjectIssueRegister