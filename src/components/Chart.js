import { Component } from "react";
import axios from "axios";
import Chart from "chart.js/auto";

class ChartComponent extends Component {
  state = {
    stockPrices: [],
    dateStart: "",
    dateEnd: "",
  };

  componentDidMount = () => {
    axios
      .get(`http://api.coindesk.com/v1/bpi/historical/close.json`)
      .then((response) => {
        // console.log(response);

        const prices = response.data.bpi;

        this.setState({ stockPrices: { ...prices } });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (
      prevState.dataStart !== this.state.dataStart &&
      prevState.dataEnd !== this.state.dataEnd
    ) {
      this.chartGraphic.destroy();
    }
    this.chartGraphic();
  };

  chartGraphic = () => {
    const chart = new Chart(document.getElementById("myChart"), {
      type: "line",
      data: {
        labels: Object.keys(this.state.stockPrices),
        datasets: [
          {
            label: "Bitcoin Price Index",
            backgroundColor: "rgba(255, 217, 50, 0.3)",
            borderColor: "rgb(255, 130, 21)",
            data: Object.values(this.state.stockPrices),
            fill: true,
          },
        ],
      },
    });
  };

  getNewDates = async (event) => {
    try {
      const response = await axios.get(
        `https://api.coindesk.com/v1/bpi/historical/close.json?start=${this.state.dateStart}&end=${this.state.dateEnd}`
      );

      console.log(response);

      this.setState({
        dataStart: [...response.data],
        dataEnd: [...response.data],
      });
    } catch (err) {
      console.log(err);
    }
  };

  handleChange = (event) => {
    this.setState({
      dateStart: event.target.value,
      dateEnd: event.target.value,
    });
  };

  render() {
    return (
      <div className="container mt-5">
        <div>
          <strong>From:</strong>{" "}
          <input
            valeu={this.state.dateStart}
            name="dateStart"
            type="date"
            onChange={this.handleChange}
          />
          <strong>To:</strong>{" "}
          <input
            valeu={this.state.dateEnd}
            name="dateEnd"
            type="date"
            onChange={this.handleChange}
          />
        </div>
        <div>
          <canvas id="myChart"></canvas>
        </div>
      </div>
    );
  }
}

export default ChartComponent;
