import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';

function getValues (direction, distance) {
  if (direction == 0) {
    return {
      i: 0,
      j: 0,
      iNext: 0,
      jNext: distance,
      iMax: 0,
      jMax: distance
    }
  }else if (direction == 45) {
    return {       
      i: distance,
      j: 0,
      iNext: - distance,
      jNext:  distance,
      iMax: 0,
      jMax: distance
    }
  }else if (direction == 90) {
    return {       
      i: distance,
      j: 0,
      iNext: - distance,
      jNext: 0,
      iMax: 0,
      jMax: 0,
    }
  }else if (direction == 135) {
    return {       
      i: distance,
      j: distance,
      iNext: - distance,
      jNext: - distance,
      iMax: 0,
      jMax: 0
    }
  }

}

const defaultMatrix = [];

for (let i = 0; i < 5; i++) {
  const row = [];
  for (let j = 0; j < 6; j++) {
    const randomNumber = Math.floor(Math.random() * 8 + 1);
    row.push(randomNumber);
  }
  defaultMatrix.push(row);
}

class MatrixInput extends React.Component {
  constructor (props) {
    super (props);
  }

  render () {
    return (
      <div className="inputDiv">
        <label>Rows:</label>
        <input type="number" min="5" max="10" value={this.props.rows} onChange={this.props.changeRows} />
        <label>Cols:</label>
        <input type="number" min="6" max="10" value={this.props.cols} onChange={this.props.changeCols} />
      </div>
    );
  }
}

class OffsetInput extends React.Component {
  constructor (props) {
    super (props);
  }

  render () {
    return (
      <div className="inputDiv">
        <label>distance:</label>
        <input type="number" min="1" value={this.props.distance} onChange={this.props.changeDistance} />
        <label>Direction:</label>
        <select onChange={this.props.changeDirection}>
          <option>0°</option>
          <option>45°</option>
          <option>90°</option>
          <option>135°</option>
        </select>
      </div>
    );
  }
}

class Matrix extends React.Component {
  constructor (props) {
    super (props);
  }

  render () {
    const table = [];
    const matrix = this.props.matrix;
    const colored = this.props.colored;

    if (this.props.type == "output") {
      const header = [];
      for (let i = 0; i <= matrix[0].length; i++) {
        i == 0 ? header.push(<th className="header null">{i}</th>) : header.push(<th className="header">{i}</th>)
      }
      table.push(<tr className="row">{header}</tr>)
    }

    for (let i = 1; i <= matrix.length; i++) {
      const row = [];
      for (let j = 1; j <= matrix[i - 1].length; j++) {

        let className = "item";
        const id = "" + i + j;

        if (colored.includes(id)) {
          className = className.concat(" colored")
        }

        const onClick = this.props.type == "output" ? () => this.props.onClick(id) : "" 
        row.push(<td onClick={onClick} className={className}>{matrix[i - 1][j - 1]}</td>);
      }
      this.props.type == "output" ? table.push(<tr className="row"><th className="header">{i}</th>{row}</tr>) : table.push(<tr className="row">{row}</tr>)
    }
    return (
      <table>{table}</table>
    );
  }
}

class App extends React.Component {
  constructor (props) {
    super (props);

    this.state = {
      matrix: defaultMatrix,
      distance: 1,
      direction: 0,
      rows: 5,
      cols: 6,
      clickedItem: undefined
    }

    this.changeRows = this.changeRows.bind(this);
    this.changeCols = this.changeCols.bind(this);
    this.changeDistance = this.changeDistance.bind(this);
    this.changeDirection = this.changeDirection.bind(this);
    this.createInput = this.createInput.bind(this);
    this.onClick = this.onClick.bind(this);
    this.getMatrix = this.getMatrix.bind(this);
    this.count = this.count.bind(this);
  }

  changeRows (event) {
    this.setState({
      rows: parseInt(event.target.value)
    });
  }

  changeCols (event) {
    this.setState({
      cols: parseInt(event.target.value)
    });
  }

  changeDistance (event) {
    this.setState({
      distance: parseInt(event.target.value)
    });
  }

  changeDirection (event) {
    this.setState({
      direction: parseInt(event.target.value)
    });
  }

  onClick (id) {
    this.setState({
      clickedItem: id
    });
  }

  createInput () {
    const matrix = [];

    for (let i = 0; i < this.state.rows; i++) {
      const row = [];
      for (let j = 0; j < this.state.cols; j++) {
        const randomNumber = Math.floor(Math.random() * 8 + 1);
        row.push(randomNumber);
      }
      matrix.push(row);
    }

    this.setState({
      matrix: matrix
    });
  }

  getMatrix () {
    let colored = [];
    let matrix = [];
    
		for (let i = 1; i < 9; i++) {
			let row = [];
			for (let j = 1; j < 9; j++) {
        const output = this.count(i, j);
        row.push(output.count);
        colored = colored.concat(output.colored);
			}
		
			matrix.push(row);
		}

		return {
      matrix: matrix,
      colored: colored
    };
  }

  count (num1, num2) {
    const direction = this.state.direction;
		const distance = this.state.distance;
    const colored = []
    let counter = 0;

    const values = getValues(direction, distance);
		let i = values.i;
		let j = values.j;
		const iNext = values.iNext;
		const jNext = values.jNext;
		const iMax = values.iMax;
    const jMax = values.jMax;

		for (i; i < this.state.matrix.length - iMax; i++) {
      let row = this.state.matrix[i];
			for (j; j < row.length - jMax; j++) {
				if (this.state.matrix[i][j] == num1 && this.state.matrix[i + iNext][j + jNext] == num2) {
          counter += 1;
          const id1 = i + 1;
          const id2 = j + 1;
          const id3 = id1 + iNext;
          const id4 = id2 + jNext;
          if (this.state.clickedItem == "" + num1 + num2) {
            colored.push("" + id1 + id2);
            colored.push("" + id3 + id4);
          }
				}

      }
      j = values.j;
    }

		return {
      count: counter,
      colored: colored
    };
  }

  render () {
    if (this.state.matrix.length != this.state.rows || this.state.matrix[0].length != this.state.cols) {
      this.createInput();
    }

    const output = this.getMatrix();
    const glcm = output.matrix;
    const colored = output.colored;
   
    return (
      <div>
        <div className="inputs">
          <MatrixInput rows={this.state.rows}  cols={this.state.cols} changeRows={this.changeRows} changeCols={this.changeCols} />
          <OffsetInput distance={this.state.distance} changeDirection={this.changeDirection} changeDistance={this.changeDistance} />
        </div>
        <div className="matrices">
          <Matrix matrix={this.state.matrix} colored={colored} type="input" />
          <Matrix matrix={glcm} colored={[this.state.clickedItem]} onClick={this.onClick} type="output" />
        </div>
      </div>
    );
  }
}

export default App;