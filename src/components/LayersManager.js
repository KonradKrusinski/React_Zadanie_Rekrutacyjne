import React from "react"
import "./LayersManager.css"
import OneLayerAtList from "./OneLayerAtList"
import SortShowingFigure from "./SortShowingFigure"
import LayersAdder from "./LayersAdder"
import LayersMenu from "./LayersMenu"
import LayersFilter from "./LayersFilter"
import ListOfGeometries from "./ListOfGeometries"

class LayersManager extends React.Component {
    constructor(){
        super()
        this.state={
            isAdderVisible:false,
            isFilterVisible:false,
        }
        this.ChangeAdderVisibility=this.ChangeAdderVisibility.bind(this)
        this.ChangeFilterVisibility=this.ChangeFilterVisibility.bind(this)
    }

    ChangeAdderVisibility(){
        this.setState((prevState) => {
            prevState.isAdderVisible=!prevState.isAdderVisible
            return prevState
        })
    }

    ChangeFilterVisibility() {
        this.setState((prevState) => {
            prevState.isFilterVisible=!prevState.isFilterVisible
            return prevState
        })
    }

    render() {
       const layersArray=[]
       for(let i=0;i<this.props.layers.length;i++) {
           if (this.props.layers[i].visibleAtList) {
               //przy każdej iteracji pętli dodajemy do wyswietlenia jeden component zawierajacy dane warstwy
               //i tyle komponentów zawierających dane obiektów ile jest tych obiektów
               layersArray.push(<OneLayerAtList
                   ActiveLayer={this.props.ActiveLayer}
                   key={this.props.layers[i].id}
                   layer={this.props.layers[i]}
                   ChangeActiveLayer={this.props.ChangeActiveLayer}
                   LayerHoverOn={this.props.LayerHoverOn}
                   LayerHoverOff={this.props.LayerHoverOff}
                   LayerVisibilityChanger={this.props.LayerVisibilityChanger}
               />)
               for (let j = 0; j < this.props.layers[i].features.length; j++) {
                   layersArray.push(<ListOfGeometries
                       feature={this.props.layers[i].features[j]}
                       GeometryHoverChange={this.props.GeometryHoverChange}
                       GeometryClicked={this.props.GeometryClicked}
                       NumberOfFeature={j}
                       LayerId={this.props.layers[i].id}
                       featuresColor={this.props.layers[i].featuresColor}
                   />)
               }
           }
       }
       return (
           <div className="LayersManager">
               <table>
                   <thead>
                   <tr className="HeaderRow">
                       <th
                       onClick={()=>this.props.LayersSort(0)}
                       style={{
                           width:"5em"
                       }}>
                           Widoczny
                           <SortShowingFigure
                               isVisible={(this.props.layersSortedBy===0)?true:false}
                               isAscending={this.props.isLayersSortedAscending}
                           />
                       </th>
                       <th
                           onClick={()=>this.props.LayersSort(1)}
                           style={{
                               width:"2em"
                           }}
                       >
                           ID
                           <SortShowingFigure
                               isVisible={(this.props.layersSortedBy===1)?true:false}
                               isAscending={this.props.isLayersSortedAscending}
                           />
                       </th>
                       <th
                           onClick={()=>this.props.LayersSort(2)}
                           style={{
                               width:"4em"
                           }}
                       >
                           Symbol
                           <SortShowingFigure
                               isVisible={(this.props.layersSortedBy===2)?true:false}
                               isAscending={this.props.isLayersSortedAscending}
                           />
                       </th>
                       <th
                           onClick={()=>this.props.LayersSort(3)}>
                           Nazwa
                           <SortShowingFigure
                               isVisible={(this.props.layersSortedBy===3)?true:false}
                               isAscending={this.props.isLayersSortedAscending}
                           />
                       </th>
                   </tr>
                   </thead>
                   <tbody>
                   {layersArray}
                   </tbody>
               </table>
               <LayersMenu
                   isMenuVisible={(this.state.isAdderVisible||this.state.isFilterVisible)?false:true}
                   ShowAdder={this.ChangeAdderVisibility}
                   ShowFilter={this.ChangeFilterVisibility}
               />
               <LayersAdder
                   LayerAdd={this.props.LayerAdd}
                   isAdderVisible={this.state.isAdderVisible}
                   HideAdder={this.ChangeAdderVisibility}
               />
               <LayersFilter
                    FilterLayers={this.props.FilterLayers}
                    isFilterVisible={this.state.isFilterVisible}
                    HideFilter={this.ChangeFilterVisibility}
               />
           </div>
       )

    }
}

export default LayersManager