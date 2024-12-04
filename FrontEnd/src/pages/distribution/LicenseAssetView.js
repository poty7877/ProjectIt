import { useParams } from "react-router-dom";
import LicenseAssetViewComponent from "../../components/distrbution/LicenseAssetViewComponent";

const LicenseAssetView = () => {
    const {ano} = useParams();
    return(
       <div>
            <div>
            <LicenseAssetViewComponent ano={ano}/>
            </div>
        </div>
    );
}
export default LicenseAssetView;