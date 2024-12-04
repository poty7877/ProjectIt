import ReadComponent from "../../components/project/ReadComponent";
import {useParams} from "react-router-dom";

// 프로젝트 조회 페이지
const ProjectRead = () => {
    const {pno} = useParams()
    return(
        <div>
            <ReadComponent pno={pno}/>
        </div>
    );
}

export default ProjectRead;