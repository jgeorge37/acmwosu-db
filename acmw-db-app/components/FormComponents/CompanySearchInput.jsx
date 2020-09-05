import SelectInput from './SelectInput'

const CompanySearchInput = () => {

    // Eventually this will connect to the database of companies and provide a full list
    const sampleCompanies = ["Nimbis Services", "Target", "Capital One", "Facebook"]

    return (
        <SelectInput options={sampleCompanies} label={"Select Company"}/>
    )
}

export default CompanySearchInput