import React from "react"
import "./LayersAdder.css"

class LayersAdder extends React.Component {
    constructor() {
        super();
        this.state={
            name:"Nazwa nowej warstwy",
            symbol:"Symbol"
        }
        this.handleChange=this.handleChange.bind(this)
        this.handleSubmit=this.handleSubmit.bind(this)
    }

    handleChange(){
        this.setState((prevState) =>{
            prevState.name=document.getElementById('nLName').value
            prevState.symbol=document.getElementById('nLSymbol').value
            return prevState
            })
    }

    //po nacisnięciu przycisku dodaje warstwę i ukrywa menu dodawania warstwy
    handleSubmit() {
        this.props.LayerAdd(this.state.symbol, this.state.name)
        this.props.HideAdder()
    }


    render() {
        return (
            <div
                className="LayersAdder"
                style={{
                    display:(this.props.isAdderVisible)?"initial":"none"
                }}
                >
                <form>
                    <label>By dodać nową warstwę wypełnij pola poniżej</label>
                    <br/>
                    <input
                        type="text"
                        placeholder="Symbol"
                        value={this.state.symbol}
                        id="nLSymbol"
                        onChange={this.handleChange}
                        style={{
                            width: "15%",
                        }}
                    />
                    <input
                        type="text"
                        placeholder="Nazwa nowej warstwy"
                        id="nLName"
                        onChange={this.handleChange}
                        style={{
                            width: "40%",
                        }}
                    />
                    <input
                        type="button"
                        value="Dodaj!"
                        onClick={this.handleSubmit}
                    />
                </form>
            </div>
        )
    }
}

export default LayersAdder