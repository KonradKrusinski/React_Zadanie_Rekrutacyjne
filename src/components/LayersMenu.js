import React from "react"
import "./LayersMenu.css"

function LayersMenu(props){
    return(
        <div
            className="LayersMenu"
            style={{display:(props.isMenuVisible)?"initial":"none"}}
        >
            <input type="button" value="Dodaj warstwę" onClick={() => props.ShowAdder()}/>
            <input type="button" value="Filtruj listę" onClick={() => props.ShowFilter()}/>
        </div>
    )
}

export default LayersMenu