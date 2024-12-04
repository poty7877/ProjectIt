import ProjectMyListComponent from "../../components/project/ProjectMyListComponent";
import {useParams} from "react-router-dom";

// 내 프로젝트 리스트
const ProjectMyList = () => {
    const {mno} = useParams()
    return (
        <div>
            <ProjectMyListComponent mno={mno}/>
        </div>
    );
};

export default ProjectMyList;