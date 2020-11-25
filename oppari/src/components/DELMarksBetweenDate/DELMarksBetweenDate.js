import React, { Component } from "react";
import axios from "axios";
import { API_BASE_URL, ACCESS_TOKEN_NAME } from "../../constants/apiContants";
import DayPicker, { DateUtils } from "react-day-picker";
import "react-day-picker/lib/style.css";
import DataTable from "./data-table";

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
      enteredTo: null,
      usersCollection: [], // Keep track of the last day for mouseEnter.
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

      var pvm1 = this.state.from.toLocaleDateString("en-US");
      //console.log(pvm1);
      var pvm2 = this.state.enteredTo.toLocaleDateString("en-US");
      //console.log(pvm2);

      axios
        .get(API_BASE_URL + "/mark/betweendate", {
          params: {
            pvm1: pvm1,
            pvm2: pvm2,
            userid: this.state.userid,
          },
        })
        .then((res) => {
          this.setState({
            usersCollection: res.data,
          });
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

  fetchData = () => {
    var pvm1 = this.state.from.toLocaleDateString("en-US");
    //console.log(pvm1);
    var pvm2 = this.state.enteredTo.toLocaleDateString("en-US");
    //console.log(pvm2);
    axios
      .get(API_BASE_URL + "/mark/download", {
        params: {
          pvm1: pvm1,
          pvm2: pvm2,
          userid: this.state.userid,
        },
      })
      .then((res) => {
        //console.log(res.data);
        //console.log(this.state.userid + " data 2");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  dataTable() {
    if (this.state.usersCollection.length > 1) {
      //console.log(this.state.usersCollection);
      return this.state.usersCollection.map((data, i) => {
        return <DataTable obj={data} key={i} />;
      });
    }
  }

  render() {
    const { from, to, enteredTo } = this.state;
    const modifiers = { start: from, end: enteredTo };
    const disabledDays = { before: this.state.from };
    const selectedDays = [from, { from, to: enteredTo }];
    return (
      <div className="card delmarks col-11 col-lg-6 ">
        <h3 className="valiotsikko">
          Poista tunteja (miltä tahansa aikaväliltä)
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
        <table className="table table-striped table-bordered">
          <thead className="thead-dark">
            <tr>
              <td>Tunnit</td>
              <td>Minuutit</td>
              <td>PVM(US)</td>
              <td>Lisätiedot</td>
              <td>Poista</td>
            </tr>
          </thead>

          <tbody>{this.dataTable()}</tbody>
        </table>
      </div>
    );
  }
}
