import Head from 'next/head'
import styles from '../styles/Database.module.css'
import {useState} from 'react'
import CompanyForm from '../components/CompanyForm'
import AddCompanyForm from '../components/AddCompanyForm'
import SubmitButton from '../components/FormComponents/SubmitButton'
import AddContactForm from '../components/AddContactForm'
import NavBar from '../components/NavBar'

const CompanyContacts = () => {
    const [showOptionsForm, setOptionsForm] = useState(false)
    const [showAddCompanyForm, setAddCompanyForm] = useState(false)
    const [showAddContactForm, setAddContactForm] = useState(false)

    return (
        <div className={styles.container}>
            <Head>
                <title>Company Contacts Database</title>
            </Head>
            <NavBar current="companycontacts"/>
            <h1 className={styles.header}>Company Contacts Database</h1>
            <main className={styles.main}>
                <SubmitButton label="Options" handleChange={() => {setOptionsForm(true)}}/>
                {showOptionsForm && <CompanyForm handleCancel={() => {setOptionsForm(false)}}/>}
                <SubmitButton label="Add Company" handleChange={() => {setAddCompanyForm(true)}}/>
                {showAddCompanyForm && <AddCompanyForm handleCancel={() => {setAddCompanyForm(false)}}/>}
                <SubmitButton label="Add Contact" handleChange={() => {setAddContactForm(true)}}/>
                {showAddContactForm && <AddContactForm handleCancel={() => PsetAddContactForm(false)}/>}
            </main>
        </div>
    )
}

export default CompanyContacts
