import { useNavigate } from "react-router-dom"

const useCustomLink = () => {
    const navigate = useNavigate();

    const moveToMain = () => {
        navigate('/project', {replace:true});
    };
    return {
        moveToMain
    };

};

export default useCustomLink;