import Head from 'next/head'
import styles from '../styles/Database.module.css'
import {useState} from 'react'
import CompanyForm from '../components/CompanyForm'
import SubmitButton from '../components/FormComponents/SubmitButton'

const CompanyContacts = () => {
    const [showForm, setShowForm] = useState(false)

    const openForm = () => {
        setShowForm(true)
    }

    const closeForm = () => {
        setShowForm(false)
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Company Contacts Database</title>
            </Head>
            <h1 className={styles.header}>Company Contacts Database</h1>
            <main className={styles.main}>
                <SubmitButton label="Options" handleChange={openForm}/>
                {showForm && <CompanyForm handleCancel={closeForm} />}
            </main>
        </div>
    )
}

export default CompanyContacts