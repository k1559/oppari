import React, { Component } from "react";
import axios from "axios";
import { API_BASE_URL, ACCESS_TOKEN_NAME } from "../../constants/apiContants";
import DayPicker, { DateUtils } from "react-day-picker";
import "react-day-picker/lib/style.css";
import DataTable from "./data-table";
import fileDownload from "js-file-download";

export default class GetUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userArray: [],
      userEmail: "kyrbish@gmail.com",
      usersCollection: []
    };
    this.handleDayClick = this.handleDayClick.bind(this);
    this.handleDayMouseEnter = this.handleDayMouseEnter.bind(this);
    this.handleResetClick = this.handleResetClick.bind(this);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      from: null,
      to: null,
      enteredTo: null,
      userArray: [],
      userEmail: "kyrbish@gmail.com",
      usersCollection: [] // Keep track of the last day for mouseEnter.
    };
  }

  componentDidMount() {
    axios
      .get(API_BASE_URL + "/user/getall", {
        headers: { token: localStorage.getItem(ACCESS_TOKEN_NAME) },
      })
      .then((res) => {
        this.setState({ 
            userArray: res.data, 
            selectedOption: res.data[0].email,
            userid: res.data[0]._id
        });
        axios.get(API_BASE_URL + "/mark/getAll", {
            params: {
                useremail: this.state.selectedOption
            }
        })
        .then((res) => {
            this.setState({usersCollection: res.data });
        })
      })
      //console.log(this.state.userid + " data 2");
      .catch(function (error) {
        console.log(error);
      });
  }

  handleChange = ({ target }) => {
    this.setState({
      selectedOption: target.value,
      userEmail: target.value
    });
    let useremail = target.value;
    axios.get(API_BASE_URL + "/mark/getAll", {
        params: {
            useremail: useremail
        }
    })
    .then((res) => {
        this.setState({usersCollection: res.data });
        
          let val = this.state.selectedOption;
          for (var i=0; i<this.state.userArray.length; i++) {
              if (this.state.userArray[i].email === val) {
                //console.log(i + "löytyy tämä");
                //console.log(this.state.userArray[i]._id )
                this.setState({
                  userid: this.state.userArray[i]._id
                });
              }                  
                  
        }
    })
    .catch(function (error) {
        console.log(error);
    });
  };
 
  dataTable() {
    return this.state.usersCollection.map((data, i) => {
        return <DataTable obj={data} key={i} />;
      });
  }

  isSelectingFirstDay(from, to, day) {
    const isBeforeFirstDay = from && DateUtils.isDayBefore(day, from);
    const isRangeSelected = from && to;
    return !from || isBeforeFirstDay || isRangeSelected;
  }

  handleDayClick(day) {
    const { from, to } = this.state;
    if (from && to && day >= from && day <= to) {
      this.handleResetClick();
      return;
    }
    if (this.isSelectingFirstDay(from, to, day)) {
      this.setState({
        from: day,
        to: null,
        enteredTo: null,
      });
    } else {
      this.setState({
        to: day,
        enteredTo: day,
      });

      if(this.state.from & this.state.enteredTo){

      var pvm1 = this.state.from.toLocaleDateString("en-US");
      //console.log(pvm1);
      var pvm2 = this.state.enteredTo.toLocaleDateString("en-US");
      //console.log(pvm2);
        
      axios
        .get(API_BASE_URL + "/mark/adminbetweendate", {
          params: {
            pvm1: pvm1,
            pvm2: pvm2,
            useremail: this.state.userEmail
          },
        })
        .then((res) => {
          //console.log(res);
          this.setState({
            response: res.data,
            tuntiarray: [],
            minuuttiarray: [],
          });
          //console.log(this.state.response);
          var arraylength = this.state.response.length;
          let tuntisumma = 0;
          let minuuttisumma = 0;
          for (var i = 0; i < arraylength; i++) {
            this.state.tuntiarray.push(this.state.response[i].hours);
            this.state.minuuttiarray.push(this.state.response[i].minutes);
            //console.log(this.state.tuntiarray);
            //console.log(this.state.minuuttiarray);
            tuntisumma += this.state.response[i].hours;
            minuuttisumma += this.state.response[i].minutes;
          }
          function time_convert(num) {
            var hours = Math.floor(num / 60);
            var minutes = num % 60;
            return {
              hours: hours,
              minutes: minutes,
            };
          }

          if (minuuttisumma >= 60) {
            //console.log(time_convert(minuuttisumma));
            var minuutit = time_convert(minuuttisumma);
            var ekstratunnit = minuutit.hours;
            var ekstraminuutit = minuutit.minutes;
            if (ekstratunnit > 0) {
              tuntisumma = tuntisumma + ekstratunnit;
              this.setState({
                minuutit: ekstraminuutit,
                tunnit: tuntisumma,
              });
              //console.log(tuntisumma);
              //console.log(ekstraminuutit);
              //console.log("Töitä on tehty tänä aikana yhteensä " + tuntisumma + " tuntia ja " + ekstraminuutit + " minuuttia.");
            }
          } else {
            this.setState({
              minuutit: minuuttisumma,
              tunnit: tuntisumma,
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    } else {
      window.alert("Valitse päivämääräväli.");
    }
  } 
  }

  handleDayMouseEnter(day) {
    const { from, to } = this.state;
    if (!this.isSelectingFirstDay(from, to, day)) {
      this.setState({
        enteredTo: day,
      });
    }
  }

  handleResetClick() {
    //this.setState(this.getInitialState());
    window.location.reload();
  }

  createFile = () => {
    if(this.state.from != null & this.state.enteredTo != null){
    var pvm1 = this.state.from.toLocaleDateString("en-US");
    //console.log(pvm1);
    var pvm2 = this.state.enteredTo.toLocaleDateString("en-US");
    //console.log(pvm2);
    axios
      .get(API_BASE_URL + "/mark/admindownload", {
        params: {
          pvm1: pvm1,
          pvm2: pvm2,
          useremail: this.state.userEmail,
        },
      })
      .then((res) => {
        //console.log(res.data);
        //console.log(this.state.userid + " data 2");
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  };

  handleDownload = (url, filename) => {
    axios
      .get(url, {
        responseType: "blob",
      })
      .then((res) => {
        fileDownload(res.data, filename);
      });
  };

  render() {
    const { from, to, enteredTo } = this.state;
    const modifiers = { start: from, end: enteredTo };
    const disabledDays = { before: this.state.from };
    const selectedDays = [from, { from, to: enteredTo }];
    return (
      <div className="col-11 admin col-lg-9 col-xl-8">
        <div className="row justify-content-around">
         <div className="card admin col-lg-7 col-xl-5">
        <select className="adminselect" value={this.state.selectedOption} onChange={this.handleChange}>
          {this.state.userArray.map(({ email, label }, index) => (
            <option value={email} key={email}>
              {email}
            </option>
          ))}
        </select>
          <table className="table table-striped table-bordered">
          <thead className="thead-dark">
              <tr>
                <td className="td-head">Tunnit</td>
                <td className="td-head">Minuutit</td>
                <td className="td-head">PVM(US)</td>
                <td className="td-head">Lisätietoa</td>
                <td className="td-head">Poista</td>
              </tr>
            </thead>
            <tbody>{this.dataTable()}</tbody>
          </table>
        </div>
        <div className="card admin col-12 col-lg-5 col-xl-5">
        <DayPicker
          className="Range"
          numberOfMonths={2}
          fromMonth={from}
          selectedDays={selectedDays}
          disabledDays={disabledDays}
          modifiers={modifiers}
          onDayClick={this.handleDayClick}
          onDayMouseEnter={this.handleDayMouseEnter}
        />
        <br></br>
          {!from && !to && "Valitse ensimmäinen päivä."}
          {from && !to && "Valitse toinen päivä."}
          {from &&
            to &&
            `Valittu ${from.toLocaleDateString('en-GB')} ja
                ${to.toLocaleDateString('en-GB')}`}{" "}
          {from && to && (
            <button className="link" onClick={this.handleResetClick}>
              Reset
            </button>
          )}

{this.state.tunnit !== undefined && (
          <h4>
            Valittuna aikana on tehty töitä {this.state.tunnit} tuntia ja{" "}
            {this.state.minuutit} minuuttia.
          </h4>
        )}
          <button className="btn download"
            onClick={() => {
              this.createFile(
                "/files/" + this.state.userid + ".csv",
                this.state.userid + ".csv"
              );
              window.alert("Tiedosto luotu. Muista valita käyttäjä kenen tiedoston lataat.");
            }}
          >
            Luo CSV-tiedosto valitulta ajalta
          </button>
          <button className="btn download"
            onClick={() => {
              this.handleDownload(
                "/files/" + this.state.userid + ".csv",
                this.state.userid + ".csv"
              );
            }}
          >
            Lataa uusin (käyttäjän) CSV
          </button>
          </div>
       
        </div>
        </div>
    
    );
  }
}
