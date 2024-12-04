

const useCustomChanger = () => {
    const unitText = (priceUnit) => {
        //console.log("CustomChanger:"+priceUnit)
        let unitStr = "";
        switch (priceUnit) {
            case "YEAR":
                unitStr = "년";
                break;
            case "MONTHLY":
                unitStr = "월";
                break;
            case "PERSON":
                unitStr = "인";
                break;
        }
        //console.log("CustomChanger:"+unitStr);
        return unitStr;
    
    }

    return (
        { unitText }
    );
}

export default useCustomChanger;