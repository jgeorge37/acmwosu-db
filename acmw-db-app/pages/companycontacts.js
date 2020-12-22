import Head from 'next/head'
import styles from '../styles/Database.module.css'
import {useState} from 'react'
import CompanyForm from '../components/CompanyForm'
import AddCompanyForm from '../components/AddCompanyForm'
import SubmitButton from '../components/FormComponents/SubmitButton'
import AddContactForm from '../components/AddContactForm'
import SponsorshipForm from '../components/SponsorshipForm'

const CompanyContacts = () => {
    const [showOptionsForm, setOptionsForm] = useState(false)
    const [showAddCompanyForm, setAddCompanyForm] = useState(false)
    const [showAddContactForm, setAddContactForm] = useState(false)
    const [showSponsorshipForm, setSponsorshipForm] = useState(false)

    return (
        <div className={styles.container}>
            <Head>
                <title>Company Contacts Database</title>
            </Head>
            <h1 className={styles.header}>Company Contacts Database</h1>
            <main className={styles.main}>
                <div className={styles.suboptions}>
                    <SubmitButton label="Options" handleChange={() => {setOptionsForm(true)}}/>
                    <SubmitButton label="Add Company" handleChange={() => {setAddCompanyForm(true)}}/>
                    <SubmitButton label="Add Contact" handleChange={() => {setAddContactForm(true)}}/>
                    <SubmitButton label="Sponsorship Options" handleChange={() => {setSponsorshipForm(true)}}/>
                </div>
                {showOptionsForm && <CompanyForm handleCancel={() => {setOptionsForm(false)}}/>}
                {showAddCompanyForm && <AddCompanyForm handleCancel={() => {setAddCompanyForm(false)}}/>}
                {showAddContactForm && <AddContactForm handleCancel={() => {setAddContactForm(false)}}/>}
                {showSponsorshipForm && <SponsorshipForm handleCancel={() => {setSponsorshipForm(false)}}/>}
            </main>
        </div>
    )
}

export default CompanyContacts
