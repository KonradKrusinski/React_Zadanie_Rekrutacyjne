import React from "react"
import "./PopUp.css"
function PopUp (props){
    return(<div
        className="PopUp"
        id="PopUp"
        style={{
            top:props.Position[1]+20,
            left:props.Position[0]+20,
            display: (props.Visible) ? "initial" : "none"
        }}
    >
        {props.Content}
    </div>)

}
export default PopUp