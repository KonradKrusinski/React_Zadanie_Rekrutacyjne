import React from "react"
import "./SortShowingFigure.css"
function SortShowingFigure(props){
    return(
        <div
            className={(props.isAscending)?"ascending":"descending"}
            style={{visibility:(props.isVisible)?"initial":"hidden"}}
        />
    )
}

export default SortShowingFigure