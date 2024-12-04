import UpdateComponent from "../../components/project/UpdateComponent";
import {useParams} from "react-router-dom";

// 프로젝트 수정 페이지
const ProjectModify = () => {
    const {pno} = useParams();
    return (
        <div>
            <UpdateComponent pno={pno}/>
        </div>
    );
}
export default ProjectModify;