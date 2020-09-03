import React from "react"
import Header from "./components/Header"
import LayersManager from "./components/LayersManager"
import LayersData from "./LayersData"
import MapView from "./components/MapView"
import PopUp from "./components/PopUp"

class MyApp extends React.Component {
    constructor() {
        super();

        //zczytuje dane z pliku i odpowiednio fomratuje, dodaje pola które są niezbędne
        const Layers=LayersData.map((layer)=>{
            layer.hovered=false
            if(layer.id<=3){
                layer.visible=true
            }else{
                layer.visible=false
            }
            if(layer.features==undefined){
                layer.features=[]
            }else{
                for(let i=0;i<layer.features.length;i++){
                    layer.features[i].isHovered=false
                    layer.features[i].isClicked=false
                }
            }
            if(layer.featuresColor==undefined){
                layer.featuresColor="black"
            }
            layer.visibleAtList=true;
            return layer
        })
        //pierwsze sortowanie warstw do wyświetlenia
        Layers.sort((a, b) => {
            if (a.id > b.id) {
                return 1
            } else {
                return -1
            }
        })

        //pola niezbędne do sterowania
        this.state={
            //która warstwa jest aktywna, do rysowania i do obramowania w menedżerze
            activeLayer:1,
            //wg któego argumentu są posortowane (kolejność:od lewej w nagłówku tabeli)
            layersSortedBy:1,
            isLayersSortedAscending:true,
            //Przechowanie warstw
            layers: Layers,
            //czy widczone jest okienko z szczegółami obiektu na mapie
            PopUpVisible:false,
            PopUpPosition:[],
            PopUpContent:null,
            //przechowuje co rysujemy kliknięciem
            CurrentDrawing:"Point",
            //czy zaczynać nowy rysunek czy dodawać do starego (tylko dla Powierzchni i linii
            ShouldStartNewDrawing:true,
        }
        this.LayerHoverOn = this.LayerHoverOn.bind(this)
        this.LayerHoverOff = this.LayerHoverOff.bind(this)
        this.LayerVisibleChange = this.LayerVisibleChange.bind(this)
        this.LayersSort = this.LayersSort.bind(this)
        this.LayerAdd = this.LayerAdd.bind(this)
        this.FilterLayers=this.FilterLayers.bind(this)
        this.ChangeActiveLayer=this.ChangeActiveLayer.bind(this)
        this.AddGeometry=this.AddGeometry.bind(this)
        this.GeometryHoverChange=this.GeometryHoverChange.bind(this)
        this.GeometryClicked=this.GeometryClicked.bind(this)
        this.PopUpChange=this.PopUpChange.bind(this)
        this.CurrentDrawingChange=this.CurrentDrawingChange.bind(this)
        this.StartNewDrawing=this.StartNewDrawing.bind(this)
    }
    //metoda przekazana w dół by wykonać zmianę atrybutu czy warstwa została najechana myszką
    LayerHoverOn(id){
        let indeks=this.state.layers.findIndex(layer => layer.id===id)
        this.setState(prevState => {
            let newState=prevState;
            newState.layers[indeks].hovered=true
            return newState
        })
    }

    //jw tylko sprawdzajaca czy warstwa nie jest juz najechana
    LayerHoverOff(id){
        let indeks=this.state.layers.findIndex(layer => layer.id===id)
        this.setState(prevState => {
            let newState=prevState;
            newState.layers[indeks].hovered=false
            return newState
        })
    }

    //metoda do zmiany widocznosci warstwy
    LayerVisibleChange(id){
        let indeks=this.state.layers.findIndex(layer => layer.id===id)
        this.setState((prevState) =>{
            prevState.layers[indeks].visible=!prevState.layers[indeks].visible
            return prevState
        })
    }

    //metoda do sortowania warstw
    LayersSort(dataIndex){
        this.setState((prevState)=>{
            //Po naciśnięciu w kolumnę wg której już jest posortowane zmieniamy kierunek sortowania
            if(dataIndex===prevState.layersSortedBy){
                prevState.isLayersSortedAscending=!prevState.isLayersSortedAscending
            }else{
                prevState.isLayersSortedAscending=true
            }

            switch (dataIndex){
                case 0: //sortowanie po widoczności
                    prevState.layers.sort((a,b)=>{
                        let toReturn=-1
                        if(a.visible>b.visible){
                            toReturn=1;
                        }
                        if(!prevState.isLayersSortedAscending){
                            toReturn=-toReturn
                        }
                        return toReturn
                    })
                    prevState.layersSortedBy=0
                    break;
                case 1: //sortowanie po ID
                    prevState.layers.sort((a,b)=>{
                        let toReturn=-1
                        if(a.id>b.id){
                            toReturn=1;
                        }
                        if(!prevState.isLayersSortedAscending){
                            toReturn=-toReturn
                        }
                        return toReturn
                    })
                    prevState.layersSortedBy=1
                    break;
                case 2: //Sortowanie po symbolu
                    prevState.layers.sort((a,b)=>{
                        let toReturn=-1
                        if(a.symbol>b.symbol){
                            toReturn=1;
                        }
                        if(!prevState.isLayersSortedAscending){
                            toReturn=-toReturn
                        }
                        return toReturn
                    })
                    prevState.layersSortedBy=2
                    break;
                case 3: //sortowanie po nazwie
                    prevState.layers.sort((a,b)=>{
                        let toReturn=-1
                        if(a.name>b.name){
                            toReturn=1;
                        }
                        if(!prevState.isLayersSortedAscending){
                            toReturn=-toReturn
                        }
                        return toReturn
                    })
                    prevState.layersSortedBy=3
                    break;
                default:
                    console.log("Błędny indeks danych do sortowania listy warstw")
            }
            return prevState
        })
    }

    //dodawanie warstw
    LayerAdd(nLSymbol,nLName){
        this.setState((prevState) => {
            let nLId=0
            for(let i =0;i<prevState.layers.length;i++){
                if(nLId===prevState.layers[i].id){
                    nLId++
                }
            }
            let newLayer={
                id:nLId,
                symbol:nLSymbol,
                name:nLName,
                visible:false,
                hovered:false,
                visibleAtList:true,
                featuresColor:"green",
                features:[],
            }
            prevState.layers.push(newLayer)
            return prevState
        })
    }

    //fitlrowanie warstw
    FilterLayers(searchFor){
        this.setState((prevState)=>{
            prevState = prevState.layers.map((layer) =>{
                if(layer.name.includes(searchFor)){
                    layer.visibleAtList=true
                }else{
                    layer.visibleAtList=false
                }
                return layer
            })
            return prevState
        })
    }

    ChangeActiveLayer(id){
        //nie chcemy by aktywowac warstwe z mapa któa ma zawsze id=0
        if(id) {
            this.StartNewDrawing()
            this.setState((prevState) => {
                prevState.activeLayer = id
                return prevState
            })
        }
    }

    //dodawanie nowych geometrii
    AddGeometry(Coordinates){
        this.setState(prevState => {
            //szukanie w tablicy warstw aktywnej warstwy
            let currentIndeks = prevState.layers.findIndex(layer => {
                return layer.id === this.state.activeLayer
            })

            if (prevState.layers[currentIndeks].visible){
                if(!this.state.ShouldStartNewDrawing){
                    switch(this.state.CurrentDrawing){
                        case 'Polygon':
                            //tutaj powinno iść dodawanie kolejnego punktu do rysunku powierazchni
                            break
                        case 'LineString':
                            let lastFeatureIndex=prevState.layers[currentIndeks].features.length-1
                            prevState.layers[currentIndeks].features[lastFeatureIndex].coordinates.push(Coordinates)
                            break
                        default:
                            console.log("błąd")
                            break
                    }
                }else{
                    switch (this.state.CurrentDrawing){
                        case 'Point':
                            prevState.layers[currentIndeks].features.push({
                                typeOfFeature: 'Point',
                                coordinates: Coordinates
                            })
                            //Przy punkcie nie dodaje się żadnych współrzędnych
                            prevState.ShouldStartNewDrawing=true;
                            break
                        case 'Polygon':

                            break
                        case 'LineString':
                            prevState.layers[currentIndeks].features.push({
                                typeOfFeature: 'LineString',
                                coordinates: [Coordinates]
                            })
                            prevState.ShouldStartNewDrawing=false;
                            break
                        default:
                            console.log("błąd")
                            break
                    }
                }
             }
            return prevState
        })
    }

    GeometryHoverChange(LayerId,GeometryNumber){
        this.setState((prevState) =>{
            let index = prevState.layers.findIndex((layer) =>{
                return layer.id===LayerId
            })
            prevState.layers[index].features[GeometryNumber].isHovered=!prevState.layers[index].features[GeometryNumber].isHovered
            return prevState
        })
    }

    GeometryClicked (LayerId,GeometryNumber){
        this.setState(prevState =>{
            let index=-1
            for(let i=0;i<prevState.layers.length;i++){
                //przy okazji wyszukujey indeks której nadajemy wartość prawda
                if(prevState.layers[i].id===LayerId){
                    index=i
                }
                for(let j=0;j<prevState.layers[i].features.length;j++){
                    //to umożliwia by tylko jedna naraz była podświetlona jako aktywna
                    prevState.layers[i].features[j].isClicked=false;
                }
            }
            prevState.layers[index].features[GeometryNumber].isClicked=true;
            //zapisujemy do którego elementu mamy przybliżyć
            prevState.ZoomToFeature=[LayerId,GeometryNumber]
            return prevState
        })
    }

    //wyswietlanie i przesuwanie okna z danymi geometrii
    PopUpChange(newPosition,newVisibility,newContent){
        this.setState((prevState)=>{
            prevState.PopUpPosition=newPosition
            prevState.PopUpVisible=newVisibility
            prevState.PopUpContent=newContent
            return prevState
        })
    }

    CurrentDrawingChange(newDrawing){
        this.StartNewDrawing()
        this.setState((prevState)=>{
            prevState.CurrentDrawing = newDrawing
            return prevState
        })
    }

    StartNewDrawing(){
        this.setState(prevState=>{
            prevState.ShouldStartNewDrawing=true
            return prevState
        })
    }

    render() {
        return (
            <div>
                <Header/>
                <LayersManager
                    layers={this.state.layers}
                    layersSortedBy={this.state.layersSortedBy}
                    isLayersSortedAscending={this.state.isLayersSortedAscending}
                    ActiveLayer={this.state.activeLayer}
                    LayerHoverOn={this.LayerHoverOn}
                    LayerHoverOff={this.LayerHoverOff}
                    LayerVisibilityChanger={this.LayerVisibleChange}
                    LayersSort={this.LayersSort}
                    LayerAdd={this.LayerAdd}
                    FilterLayers={this.FilterLayers}
                    ChangeActiveLayer={this.ChangeActiveLayer}
                    GeometryHoverChange={this.GeometryHoverChange}
                    GeometryClicked={this.GeometryClicked}
                />
                <MapView
                    ActiveLayer={this.state.activeLayer}
                    Layers={this.state.layers}
                    AddGeometry={this.AddGeometry}
                    ZoomToFeature={this.state.ZoomToFeature}
                    PopUpChange={this.PopUpChange}
                    CurrentDrawingChange={this.CurrentDrawingChange}
                    StartNewDrawing={this.StartNewDrawing}
                />
                <PopUp
                    Visible={this.state.PopUpVisible}
                    Position={this.state.PopUpPosition}
                    Content={this.state.PopUpContent}
                />
            </div>
        )
    }
}
export default MyApp