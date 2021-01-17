import Head from 'next/head'
import styles from '../styles/Database.module.css'
import {useState} from 'react'
import CompanyForm from '../components/CompanyForm'
import AddCompanyForm from '../components/AddCompanyForm'
import SubmitButton from '../components/FormComponents/SubmitButton'
import AddContactForm from '../components/AddContactForm'
import SponsorshipForm from '../components/SponsorshipForm'
import React from 'react'

const CompanyContacts = () => {
    const [formName, setFormName] = useState(null);
    const forms = {
        options: <CompanyForm handleCancel={() => setFormName(null)}/>,
        addCompany: <AddCompanyForm handleCancel={() => setFormName(null)}/>,
        addContact: <AddContactForm handleCancel={() => {setFormName(null)}}/>,
        sponsorship: <SponsorshipForm handleCancel={() => {setSponsorshipForm(null)}}/>
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Company Contacts Database</title>
            </Head>
            <h1 className={styles.header}>Company Contacts Database</h1>
            <main className={styles.main}>
                <div className={styles.suboptions}>
                    <SubmitButton label="Options" handleChange={() => setFormName("options")}/>
                    <SubmitButton label="Add Company" handleChange={() => setFormName("addCompany")}/>
                    <SubmitButton label="Add Contact" handleChange={() => setFormName("addContact")}/>
                    <SubmitButton label="Sponsorship Options" handleChange={() => setFormName("sponsorship")}/>
                </div>
                {formName && forms[formName]}
            </main>
        </div>
    )
}

export default CompanyContacts
