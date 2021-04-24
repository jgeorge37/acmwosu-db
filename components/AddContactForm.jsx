import styles from '../styles/components/Form.module.css'
import SubmitButton from './FormComponents/SubmitButton'
import TextField from './FormComponents/TextField'
import CompanySearchInput from './FormComponents/CompanySearchInput'
import React, {useState, useEffect, useRef} from 'react'
import {validateGeneralEmail} from '../utility/utility'

const AddContactForm = (props) => {
    const [company, setCompany] = useState(null);
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [email, setEmail] = useState("");
    const [mailing, setMailing] = useState("");  
    const [error, setError] = useState("");
    const subscribed = useRef(false);

    // prevent async update if unmounted
    useEffect(() => {return () => {subscribed.current = false}}, []);

    const sendRequest = async () => {
        subscribed.current = true;
        const requestBody = {};
        requestBody.email = email;
        if(fname.trim()) requestBody.fname = fname.trim();
        if(lname.trim()) requestBody.lname = lname.trim();
        if(mailing.trim()) requestBody.mailing_address = mailing.trim();
        if(company && company.value) requestBody.company_id = company.value;

        const requestOptions = {
            method: 'POST',
            body: JSON.stringify(requestBody)
        }

        const res = await fetch('/api/company/create-contact', requestOptions);
        res.json()
        .then((data) => {
            if(!subscribed.current) return;
            if(data.error) {
                setError("Error - " + data.error.detail)
            } else {
                location.reload();
            }
            subscribed.current = false;
        })
    }

    const handleChange = (event) => {
        event.preventDefault();
        if(email && validateGeneralEmail(email)) {
            setError("");
            sendRequest();
        } else {
            setError("Valid email address required.");
        }
    }

    return (
        <div className={styles.popup}>
            <div className={styles.popup_inner}>
                <form className={styles.form}>
                    <h2>Add Contact Information</h2>
                    <CompanySearchInput onChange={setCompany}/>
                    <div>
                        <TextField label="First Name" value={fname} onChange={(event) => setFname(event.target.value)}/>
                        <TextField label="Last Name" value={lname} onChange={(event) => setLname(event.target.value)}/>
                        <TextField label="Email" value={email} onChange={(event) => setEmail(event.target.value)}/>
                        <TextField label="Mailing Address" value={mailing} onChange={(event) => setMailing(event.target.value)}/>
                    </div>
                    <div>
                        {error && <p className={styles.error}>{error}</p>}
                        <SubmitButton label="Apply" handleChange={handleChange} />
                        <SubmitButton label="Cancel" handleChange={props.closeForm} />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddContactForm
