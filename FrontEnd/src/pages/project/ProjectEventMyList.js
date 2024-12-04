import ProjectEventMyListComponent from "../../components/project/ProjectEventMyListComponent";
import {useParams} from "react-router-dom";

// 내 이벤트 조회 페이지
const ProjectEventMyList = () => {
    const {mno} = useParams();
    return (
        <div>
        <ProjectEventMyListComponent mno={mno}/>
        </div>
    )
}

export default ProjectEventMyList