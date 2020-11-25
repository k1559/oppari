import React, { Component } from "react";
import axios from "axios";
import { API_BASE_URL, ACCESS_TOKEN_NAME } from "../../constants/apiContants";
import DayPicker, { DateUtils } from "react-day-picker";
import "react-day-picker/lib/style.css";
import fileDownload from "js-file-download";

export default class MarksBetweenDate extends Component {
  constructor(props) {
    super(props);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.handleDayMouseEnter = this.handleDayMouseEnter.bind(this);
    this.handleResetClick = this.handleResetClick.bind(this);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      from: null,
      to: null,
      enteredTo: null, // Keep track of the last day for mouseEnter.
    };
  }
  componentDidMount() {
    axios
      .get(API_BASE_URL + "/user/me", {
        headers: { token: localStorage.getItem(ACCESS_TOKEN_NAME) },
      })
      .then((res) => {
        this.setState({
          userid: res.data.response,
          useremail: res.data.email,
        });
      })
      //console.log(this.state.userid + " data 2");
      .catch(function (error) {
        console.log(error);
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
      }else  {
        pvm1 = this.state.from.toLocaleDateString("en-US");
      //console.log(pvm1);
        pvm2 = pvm1;
      }
      axios
        .get(API_BASE_URL + "/mark/betweendate", {
          params: {
            pvm1: pvm1,
            pvm2: pvm2,
            userid: this.state.userid,
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
           // console.log(this.state.tuntiarray);
           // console.log(this.state.minuuttiarray);
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
           // console.log(time_convert(minuuttisumma));
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
    this.setState(this.getInitialState());
  }

  createFile = () => {
    
    var pvm1 = this.state.from.toLocaleDateString("en-US");
   // console.log(pvm1);
    var pvm2 = this.state.enteredTo.toLocaleDateString("en-US");
   // console.log(pvm2);
    axios
      .get(API_BASE_URL + "/mark/download", {
        params: {
          pvm1: pvm1,
          pvm2: pvm2,
          userid: this.state.userid,
        },
      })
      .then((res) => {
       // console.log(res.data);
        //console.log(this.state.userid + " data 2");
      })
      .catch(function (error) {
        console.log(error);
      });
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
      <div className="card card-left col-11 col-lg-5">
        <h3 className="valiotsikko">
          Tuntimäärä ja tuntien lataaminen aikaväliltä
        </h3>
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
        {!from && !to && "Valitse ensimmäinen päivä."}
        {from && !to && "Valitse viimeinen päivä."}
        {from &&
          to &&
          `Valittu ${from.toLocaleDateString("en-GB")} ja
                ${to.toLocaleDateString("en-GB")}`}{" "}
        {from && to && (
          <button className="link" onClick={this.handleResetClick}>
            Reset
          </button>
        )}
        {this.state.tunnit !== undefined && (
          <h4>
            Valittuna aikana olet tehnyt töitä {this.state.tunnit} tuntia ja{" "}
            {this.state.minuutit} minuuttia.
          </h4>
        )}
        <button
          className="btn download"
          onClick={() => {
            this.createFile(
              "/files/" + this.state.userid + ".csv",
              this.state.userid + ".csv"
            );
          }}
        >
          Luo CSV-tiedosto valitulta ajalta
        </button>
        <button
          className="btn download"
          onClick={() => {
            this.handleDownload(
              "/files/" + this.state.userid + ".csv",
              this.state.userid + ".csv"
            );
          }}
        >
          Lataa uusin CSV
        </button>
      </div>
    );
  }
}
