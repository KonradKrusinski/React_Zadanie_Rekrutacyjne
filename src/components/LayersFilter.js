import React from "react"
import "./LayersFilter.css"

class LayersFilter extends React.Component{
    constructor(){
        super()
        this.state={
            searchFor:""
        }
        this.handleChange=this.handleChange.bind(this)
        this.handleSubmit=this.handleSubmit.bind(this)
        this.clearFilter=this.clearFilter.bind(this)
    }

    handleChange(){
        this.setState((prevState) => {
            prevState.searchFor=document.getElementById('searchFor').value
            return prevState
        })
    }

    handleSubmit(){
        this.props.FilterLayers(this.state.searchFor)
    }

    clearFilter(){
        this.props.FilterLayers("")
        this.props.HideFilter()
    }

    render(){
        return(
            <div className="LayersFilter"
                 style={{
                     display:(this.props.isFilterVisible)?"initial":"none"
                 }}
            >
                <form>
                    <label>Filtrowanie warstw po nazwie</label>
                    <input
                        type="text"
                        id="searchFor"
                        onChange={this.handleChange}
                        value={this.state.searchFor}
                        placeholder="Szukana fraza"
                    />
                    <input
                        type="button"
                        value="Filtruj!"
                        onClick={this.handleSubmit}
                    />
                    <input
                        type="button"
                        value="Wyczyść"
                        onClick={this.clearFilter}
                    />

                </form>
            </div>
        )
    }
}

export default LayersFilter