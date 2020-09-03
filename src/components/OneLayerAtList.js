import React from "react"
import "./OneLayerAtList.css"

function OneLayerAtList(props){
    let styleLeftCell={
        borderStyle:"solid",
        borderWidth:"2px",
        borderColor:"transparent",
        borderRightStyle:"none",

    }
    let styleMiddleCell={
        borderStyle:"solid",
        borderWidth:"2px",
        borderColor:"transparent",
        borderRightStyle:"none",
        borderLeftStyle:"none",

    }
    let styleRightCell={
        borderStyle:"solid",
        borderWidth:"2px",
        borderColor:"transparent",
        borderLeftStyle:"none",
    }
    if(props.layer.hovered||(props.ActiveLayer===props.layer.id)){
        styleRightCell.borderColor="#5ca8ff"
        styleMiddleCell.borderColor="#5ca8ff"
        styleLeftCell.borderColor="#5ca8ff"
    }else{
        styleRightCell.borderColor="transparent"
        styleMiddleCell.borderColor="transparent"
        styleLeftCell.borderColor="transparent"
    }
    return (
        <tr className={"DataRow"+props.layer.id%2}
            onMouseEnter={() => props.LayerHoverOn(props.layer.id)}
            onMouseLeave={() => props.LayerHoverOff(props.layer.id)}
            onClick={() => props.ChangeActiveLayer(props.layer.id)}
            style={styleMiddleCell}
            >
            <td style={styleLeftCell}>
                <input type="checkbox"
                       onChange={() =>props.LayerVisibilityChanger(props.layer.id)}
                       checked={props.layer.visible}
                />
            </td>
            <td style={styleMiddleCell}>{props.layer.id}</td>
            <td style={styleMiddleCell}>{props.layer.symbol}</td>
            <td style={styleRightCell}>{props.layer.name}</td>
        </tr>
    )
}
export default OneLayerAtList