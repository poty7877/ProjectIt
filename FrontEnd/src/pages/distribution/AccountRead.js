import { useParams } from "react-router-dom";
import AccountReadComponent from "../../components/distrbution/AccountReadComponent";

const AccountRead = () => {
    const {siNum} = useParams();
    return (
        <div>
            <div>
                <AccountReadComponent siNum={siNum}/>
            </div>
        </div>
    );
};

export default AccountRead;