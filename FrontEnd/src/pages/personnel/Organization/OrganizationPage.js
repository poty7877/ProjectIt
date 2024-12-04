import OrgListComponent from "../../../components/personal/Organization/OrgListComponent";

const OrganizationPage = () => {
    return (
        <div className=" text-3xl">
            <div>
                인사페이지에 왔습니다.
            </div>
            <div>
                <OrgListComponent/>
            </div>
        </div>
    );
};

export default OrganizationPage;