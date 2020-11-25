import React, {useState} from 'react';
import axios from 'axios';
import {API_BASE_URL} from '../../constants/apiContants';
import { withRouter } from "react-router-dom";
function RegistrationForm(props) {
    const [state , setState] = useState({
        email : "",
        successMessage: null
    })
    const handleChange = (e) => {
        const {id , value} = e.target   
        setState(prevState => ({
            ...prevState,
            [id] : value
        }))
    }
    const sendDetailsToServer = () => {
        if(state.email.length) {
            //props.showError(null);
            const payload={
                "email":state.email
            }
            axios.post(API_BASE_URL+'/user/register', payload)
                .then(function (response) {
                    if(response.status === 200){
                        setState(prevState => ({
                            ...prevState,
                            'successMessage' : 'Käyttäjän lisääminen onnistui. Ohjataan kotisivulle..'
                        }))
                        window.alert("Käyttäjän lisääminen onnistui. Sähköposti ja salasana lähetetty sähköpostiin.")
                        redirectToHome();
                        //props.showError(null)
                    } else if (response.status === 400){
                        //props.showError("Some error ocurred");
                        console.log("Errori haussa");
                    window.alert("Sähköposti on jo käytössä");
                    }
                })
                .catch(function (error) {
                    console.log(error);
                    window.alert("Sähköposti kirjoitettu väärässä muodossa");
                });    
        } else {
            //console.log("Errori 2");
        }
        
    }
    const redirectToHome = () => {
        props.history.push('/home');
    }
  
    const handleSubmitClick = (e) => {
        e.preventDefault();
        if(state.email.length > 0) {
            sendDetailsToServer()    
        } else {
            console.log("Ei oo sähköpostii");
            window.alert("Ei ole oikea sähköposti");
        }
    }
    return(
        <div className="card col-11 col-lg-3 col-xl-4 register-card mt-2 hv-center">
            <form>
                <div className="form-group text-left">
                    <h2 className="registerHeader">Luo uusi käyttäjä</h2>
                <label htmlFor="exampleInputEmail1">Sähköposti</label>
                <input type="email" 
                       className="form-control" 
                       id="email" 
                       aria-describedby="emailHelp" 
                       placeholder="esimerkki@gmail.com" 
                       value={state.email}
                       onChange={handleChange}
                />
                </div>
                <button 
                    type="submit" 
                    className="btn btn-primary"
                    onClick={handleSubmitClick}
                >
                    Rekisteröi
                </button>
            </form>
            <div className="alert alert-success mt-2" style={{display: state.successMessage ? 'block' : 'none' }} role="alert">
                {state.successMessage}
            </div>
            
        </div>
    )
}

export default withRouter(RegistrationForm);