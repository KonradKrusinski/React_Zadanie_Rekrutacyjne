import React from "react"
import "./ListOfGeometries.css"

function ListOfGeometries (props){
    return(
        <tr className="GeometriesListPosition">
            <td></td>
            <td
                colSpan="3" className="GeometryData"
                onMouseEnter={() => props.GeometryHoverChange(props.LayerId,props.NumberOfFeature)}
                onMouseLeave={() => props.GeometryHoverChange(props.LayerId,props.NumberOfFeature)}
                onClick={() => props.GeometryClicked(props.LayerId,props.NumberOfFeature)}
                style={{
                    fontSize:(props.feature.isHovered||props.feature.isClicked) ? "1em" : "0.8em",
                    color: props.featuresColor
                }}
            >
                {props.feature.typeOfFeature}
            </td>
        </tr>
    )
}

export default ListOfGeometries