import React, { useState, useEffect} from "react";
import axios from "axios";
import { API_BASE_URL, ACCESS_TOKEN_NAME } from "../../constants/apiContants";
import { withRouter } from "react-router-dom";
import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";
import HoursToday from '../HoursToday/HoursToday';
import {
  formatDate,
  parseDate,
} from "react-day-picker/moment";


function Home(props) {


  useEffect(() => {
    //console.log(localStorage.getItem(ACCESS_TOKEN_NAME));
    axios
      .get(API_BASE_URL + "/user/me", {
        headers: { token: localStorage.getItem(ACCESS_TOKEN_NAME) },
      })
      .then(function (response) {
        if (state.userid === undefined) {
          const userid = response.data.response;
          const useremail = response.data.email;
          //console.log(response);
          //console.log(response.data.email);
          
          setState({ 
            userid, 
            useremail,
            selectedDay: state.selectedDay
           });
        }
        if (response.status !== 200) {
          redirectToLogin();
        }
      })
      .catch(function (error) {
        window.alert("Sessio aikakatkaistu. Palautetaan sisäänkirjautumiseen.");

        redirectToLogin();
      });
  });
 

  function redirectToLogin() {
    props.history.push("/login");
  }
  const [state, setState] = useState({
    hours: "",
    minutes: "",
    textarea: "",
    selectedDay: undefined,
    date: "",
    pvm: "",
    marksCollection: []
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const sendDetailsToServer = () => {
    if (state.hours && state.minutes) {
      //props.showError(null);
      if (selectedDay === undefined) {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, "0");
        var mm = String(today.getMonth() + 1).padStart(2, "0"); 
        var yyyy = today.getFullYear();
        today = dd + "/" + mm + "/" + yyyy;
        var todayUS = new Date();
        todayUS = mm + "/" + dd + "/" + yyyy;
        state.pvm = todayUS;

      } else if (selectedDay !== undefined) {
        state.pvm = selectedDay.toLocaleDateString();
      }
      const payload = {
        hours: state.hours,
        minutes: state.minutes,
        textarea: state.textarea,
        date: state.pvm,
        userid: state.userid,
        useremail: state.useremail
      };
      axios
        .post(API_BASE_URL + "/mark/mark", payload)
        .then(function (response) {
          if (response.status === 201) {
            setState((prevState) => ({
              ...prevState,
              successMessage:
                "Registration successful. Redirecting to home page..",
            }));
            //localStorage.setItem(ACCESS_TOKEN_NAME, response.data.token);
            //redirectToHome();
            //props.showError(null);
          } else {
            //props.showError("Some error ocurred");
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      alert("Täytithän tunnit ja minuutit?");
    }
    window.location.reload();
  };

/*  const redirectToHome = () => {
    props.updateTitle("Home");
    props.history.push("/home");
  };
  */
  const handleSubmitClick = (e) => {
    e.preventDefault();
    if (state.hours) {
      sendDetailsToServer();
      //window.location.reload();
    } else {
      alert("Täytithän tunnit ja minuutit?");
      window.location.reload();
    }
  };

  const handleDayChange = (day) => {
    setState({ selectedDay: day });
  };
  const { selectedDay } = state;
  const format = "DD/MM/YYYY";

  return (
    <div className="card col-12 col-lg-5 col-xl-3 login-card mt-2 hv-center">
      
      <form className="homeform">
        {selectedDay && <h4 className="hidden"> Piilotettu</h4>}
        {!selectedDay && <h3 className="cardh4">Merkkaa työtunnit</h3>}
        <DayPickerInput
          formatDate={formatDate}
          parseDate={parseDate}
          format={format}
          id="date"
          value={state.date}
          placeholder={`${formatDate(new Date(), format)}`}
          onDayChange={handleDayChange}
        />

        <div className="form-group text-left">
          <label htmlFor="examplehour">Tunnit</label>
          <select
            className="form-control"
            id="hours"
            aria-describedby="hoursHelp"
            placeholder="Enter hours"
            value={state.hours}
            onChange={handleChange}
          >
            <option value="" disabled hidden>
              Tunnit
            </option>
            <option value="0">0 tuntia</option>
            <option value="1">1 tuntia</option>
            <option value="2">2 tuntia</option>
            <option value="3">3 tuntia</option>
            <option value="4">4 tuntia</option>
            <option value="5">5 tuntia</option>
            <option value="6">6 tuntia</option>
            <option value="7">7 tuntia</option>
            <option value="8">8 tuntia</option>
            <option value="9">9 tuntia</option>
            <option value="10">10 tuntia</option>
          </select>
        </div>
        <div className="form-group text-left">
          <label htmlFor="examplehour">Minuutit</label>
          <select
            className="form-control"
            id="minutes"
            aria-describedby="minutesHelp"
            placeholder="Enter minutes"
            value={state.minutes}
            onChange={handleChange}
          >
            <option value="" disabled hidden>
              Minuutit
            </option>
            <option value="0">0 minuuttia</option>
            <option value="5">5 minuuttia</option>
            <option value="10">10 minuuttia</option>
            <option value="15">15 minuuttia</option>
            <option value="20">20 minuuttia</option>
            <option value="25">25 minuuttia</option>
            <option value="30">30 minuuttia</option>
            <option value="35">35 minuuttia</option>
            <option value="40">40 minuuttia</option>
            <option value="45">45 minuuttia</option>
            <option value="50">50 minuuttia</option>
            <option value="55">55 minuuttia</option>
          </select>
        </div>
        <div className="form-group text-left">
          <label htmlFor="exampleInputTextarea">Lisätietoja</label>
          <br></br>
          <textarea
            type="textarea"
            className="form-control"
            id="textarea"
            placeholder="Lisätietoja"
            value={state.textarea}
            onChange={handleChange}
          ></textarea>
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          onClick={handleSubmitClick}
        >
          Merkkaa tunnit
        </button>
      </form>
      <div
        className="alert alert-success mt-2"
        style={{ display: state.successMessage ? "block" : "none" }}
        role="alert"
      >
        {state.successMessage}
      </div>
      
      <div id="hourstoday">
        <HoursToday />
      </div>
    </div>
  );
}
export default withRouter(Home);
