import styles from '../styles/components/Form.module.css'
import SubmitButton from './FormComponents/SubmitButton'
import TextField from './FormComponents/TextField'
import {useState, useRef, useEffect} from 'react';
import {validateGeneralEmail} from '../utility/utility'
import {adaFetch} from '../utility/fetch';

const AddCompanyForm = (props) => {
    const [company, setCompany] = useState("");
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [error, setError] = useState("");
    const subscribed = useRef(false);

    // prevent async update if unmounted
    useEffect(() => {return () => {subscribed.current = false}}, []);

    const sendRequest = async () => {
        subscribed.current = true;
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify({
                company_name: company,
                email: email,
                fname: fname,
                lname: lname,
                mailing_address: address
            })
        };
        adaFetch('/api/company/create', requestOptions)
            .then((data) => {
                if(!subscribed.current) return;
                if(data.error) {  // inform of duplicate company name
                    setError("Error - " + data.error.detail)
                } else {
                    location.reload();
                }
                subscribed.current = false;
            });
    }

    const validateContact = () => {
        // all empty - fine
        if(!fname && !lname && !email && !address) return true;
        // else - any contact info needs email at minimum
        return email && validateGeneralEmail(email);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if(!company) {
            setError("Error - company name is required");
        } else if(!validateContact()) {
            setError("Error - to create a contact, a valid email is required");
        } else {
            setError("");
            sendRequest();
        }
    } 

    return (
        <div className={styles.popup}>
            <div className={styles.popup_inner}>
                <form className={styles.form}>
                    <h2>Add Company Information</h2>
                    <div>
                        <TextField label="Company Name *" value={company} onChange={(event) => setCompany(event.target.value)}/>
                    </div>
                    <h2>Add Contact Information - optional</h2>
                    <div>
                        <TextField label="First Name" value={fname} onChange={(event) => setFname(event.target.value)}/>
                        <TextField label="Last Name" value={lname} onChange={(event) => setLname(event.target.value)}/>
                        <TextField label="Email *" value={email} onChange={(event) => setEmail(event.target.value)}/>
                        <TextField label="Mailing Address" value={address} onChange={(event) => setAddress(event.target.value)}/>
                    </div>
                    <div>
                        {error && <p className={styles.error}>{error}</p>}
                        <SubmitButton label="Apply" handleChange={handleSubmit} />
                        <SubmitButton label="Cancel" handleChange={props.closeForm} />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddCompanyForm
