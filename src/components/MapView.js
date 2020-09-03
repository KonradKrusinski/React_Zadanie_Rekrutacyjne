import React from "react"
import "./MapView.css"
import {
    Map,
    View,
    Feature
} from 'ol'
import {
    Tile as TileLayer,
    Vector as VectorLayer
} from 'ol/layer'
import {
    Point,
    LineString,
    Polygon,
}from 'ol/geom'
import {
    Vector as VectorSource,
    OSM as OSMSource,
} from 'ol/source'
import {
    MousePosition,
} from 'ol/control'
import {
    Style,
    Fill as FillStyle,
    Circle as CircleStyle,
    Stroke as StrokeStyle
} from 'ol/style'

class MapView extends React.Component {
    constructor(props) {
        super(props)
        this.state={
            height:window.innerHeight-20
        }
        this.updateDimensions = this.updateDimensions.bind(this)
        window.addEventListener('resize', this.updateDimensions)

    }
    updateDimensions(){
        const h = window.innerWidth >= 992 ? window.innerHeight-20 : 400
        this.setState({height: h})
    }
    componentDidMount(){
        var myControls = [
            new MousePosition({
                target: 'Controls',
             }),
        ]
        let indexOfMap=this.props.Layers.findIndex( (layer) =>{
            return layer.id===0
        })


        //tworzenie tablicy warstw
       var DrawingLayers=[new TileLayer({
           name:'MainMap',
           source:new OSMSource(),
           visible:this.props.Layers[indexOfMap].visible,
       })]

        for(let i=0;i<this.props.Layers.length;i++) {
            //nie chcemy rysowac na warstwie z mapa
            if (this.props.Layers[i].id !== 0) {

                var Features = []

                for (let j = 0; j < this.props.Layers[i].features.length; j++) {

                    switch (this.props.Layers[i].features[j].typeOfFeature) {

                        case 'Point':
                            Features.push(new Feature({
                                'geometry': new Point(this.props.Layers[i].features[j].coordinates),
                                name:"Punkt"
                            }))
                            break

                        case 'Polygon':
                            Features.push(new Feature({
                                geometry: new Polygon(this.props.Layers[i].features[j].coordinates),
                                name:"Powierzchnia"
                            }))
                            break

                        case 'LineString':
                            let coords=[]
                            for(let k=0;k<this.props.Layers[i].features[j].coordinates.length;k++){
                                coords.push(this.props.Layers[i].features[j].coordinates[k])
                            }
                            Features.push(new Feature({
                                geometry: new LineString(coords),
                                name:"Linia"
                            }))
                            break

                        default:
                            console.log("Błąd! Nieznany typ obiektu typu Geometry w danych!")
                    }
                }

                DrawingLayers.push(new VectorLayer({

                        name: "WarstwaGeometrii" + this.props.Layers[i].id,

                        propsImportedId: this.props.Layers[i].id,

                        source: new VectorSource({
                            features: Features
                        }),

                        style: new Style({
                            fill: new FillStyle({
                                color: 'rgba(255,255,255,0.2)',
                            }),
                            stroke: new StrokeStyle({
                                color: '#fcba03',
                                width: 2,
                            }),
                            image: new CircleStyle({
                                radius: 7,
                                fill: new FillStyle({
                                    color: this.props.Layers[i].featuresColor,
                                })
                            }),
                        }),

                        visible: true,
                    })
                )
            }
        }

        const map = new Map({
            target: 'map',
            layers: DrawingLayers,
            controls: myControls,
            view: new View({
                center: [2150000, 7200000],
                zoom: 11
            })
        })

        map.on('click',(event) =>{
            this.props.AddGeometry(event.coordinate)
            return null
        })


        //przy każdym przesunięciu myszy sprawdza czy jest nad jakimś obviektem i jeśli jest to doaję do okienka dane obiektów
        map.on('pointermove', (event)=>{

            let pixel = map.getEventPixel(event.originalEvent)
            let features=map.getFeaturesAtPixel(pixel)

            features=features.map((feature)=>{

                switch( feature.values_.name) {

                    case 'Punkt':
                        return (<div>
                            {feature.values_.name}
                            <br/>
                            X:{feature.values_.geometry.flatCoordinates[0]} Y:{feature.values_.geometry.flatCoordinates[1]}
                            <br/>
                            </div>
                        )

                    case 'Powierzchnia':
                        return (<div>
                            {feature.values_.name}
                            <br/>
                            Powierzchnia: {feature.values_.geometry.getArea()}
                            <br/>
                            </div>
                        )

                    case 'Linia':
                        return (<div>
                            {feature.values_.name}
                            <br/>
                            Długość: {feature.values_.geometry.getLength()}
                            <br/>
                            </div>
                        )
                }
            })

            //wywolanie metody zmiany danych, pozycji i widocznosci okienka z szczegolami obiektu
            this.props.PopUpChange(
                pixel,
                map.hasFeatureAtPixel(pixel),
                <div>{features}</div>
            )

        })

        this.setState((prevState)=>{
            //juz przyblizylismy wiec zapisujemy zeby ciagle nie przyblizalo na obiekt
            prevState.ZoomToFeature=this.props.ZoomToFeature
            prevState.map=map
            return prevState
        })
    }
    componentWillUnmount(){
        window.removeEventListener('resize', this.updateDimensions)
    }

    //cała komunikacja między bilbioteką React a biblioteką OpenLayers przechodzi prze tą metodę
    componentDidUpdate() {
        //przełączanie widoczności mapy głównej
        let indexOfMap=this.props.Layers.findIndex( (layer) =>{
            return layer.id==0
        })
        let CurrentLayers= this.state.map.getLayers()
        CurrentLayers=CurrentLayers.array_
        CurrentLayers[0].set('visible',this.props.Layers[indexOfMap].visible)


        //Sprawdzanie czy przybyło warstw i dodanie jeśli trzeba
        if(CurrentLayers.length-1!=this.props.Layers.length){

            let indexOfNewLayer=this.props.Layers.length-1

            this.state.map.addLayer(new VectorLayer({

                name:"WarstwaGemetrii"+this.props.Layers[indexOfNewLayer].id,

                propsImportedId:this.props.Layers[indexOfNewLayer].id,

                style: new Style({
                    fill: new FillStyle({
                        color: 'rgba(255,255,255,0.2)',
                    }),
                    stroke: new StrokeStyle({
                        color: this.props.Layers[indexOfNewLayer].featuresColor,
                        width: 2,
                    }),
                    image: new CircleStyle({
                        radius: 7,
                        fill: new FillStyle({
                            color: this.props.Layers[indexOfNewLayer].featuresColor,
                        })
                    }),
                }),

                visible:true,
            }))
        }


        //aktualizacja warstw na mapie
        for(let i=1;i<CurrentLayers.length;i++){

            //znalezienie warstwy z obecnej iteracji w argumentach otrzymanych od komponentu nadrzednego
            let currentIndex=this.props.Layers.findIndex((layer) => {
                return layer.id ==CurrentLayers[i].values_.propsImportedId
            })

            //aktualizacja widoczności wartswy
            CurrentLayers[i].setVisible(this.props.Layers[currentIndex].visible)

            //tworzenie tablicy obiektow geometrycznych
            let Features = []
            for (let j = 0; j < this.props.Layers[currentIndex].features.length; j++) {

                switch (this.props.Layers[currentIndex].features[j].typeOfFeature) {

                    case 'Point':

                        //dodanie punktu do tablicy
                        Features.push(new Feature({
                            geometry: new Point(this.props.Layers[currentIndex].features[j].coordinates),
                            name:"Punkt"
                        }))

                        //aktualizacja stylu dla obiektów najechanych kursorem lub klikniętych
                        Features[Features.length-1].setStyle(new Style({
                                image: new CircleStyle({
                                        //powiększenie punktu jeśli najechany lub kliknięty
                                        radius: (this.props.Layers[currentIndex].features[j].isHovered||this.props.Layers[currentIndex].features[j].isClicked) ? 12 : 7,
                                        fill: new FillStyle({
                                            color: this.props.Layers[currentIndex].featuresColor,
                                        })
                                    }),
                                })
                        )
                        break

                    case 'Polygon':

                        Features.push(new Feature({
                            geometry: new Polygon(this.props.Layers[i].features[j].coordinates),
                            name:"Powierzchnia"
                        }))

                        Features[Features.length-1].setStyle(new Style({
                                fill: new FillStyle({
                                    color: 'rgba(255,255,255,0.4)',
                                    opacity: 0.2,
                                }),
                                stroke: new StrokeStyle({
                                    color: this.props.Layers[currentIndex].featuresColor,
                                    width: (this.props.Layers[currentIndex].features[j].isHovered||this.props.Layers[currentIndex].features[j].isClicked) ? 4 : 2,
                                }),
                            })
                        )
                        break


                    case 'LineString':

                        Features.push(new Feature({
                            geometry: new LineString(this.props.Layers[i].features[j].coordinates),
                            name:"Linia"
                        }))

                        Features[Features.length-1].setStyle(new Style({
                                stroke: new StrokeStyle({
                                    color: this.props.Layers[currentIndex].featuresColor,
                                    width: (this.props.Layers[currentIndex].features[j].isHovered||this.props.Layers[currentIndex].features[j].isClicked) ? 4 : 2,
                                }),
                            })
                        )
                        break

                    default:
                        console.log("Błąd! Nieznany typ obiektu typu Geometry w danych!")
                }
            }

            CurrentLayers[i].setSource( new VectorSource({
                features: Features
            }))
        }

        //Przybliżenie jeśli klinkięto na nowy Feature
        if(this.state.ZoomToFeature!==this.props.ZoomToFeature){

            let indexOfLayer=this.props.Layers.findIndex((layer =>{
                return layer.id===this.props.ZoomToFeature[0]
            }))


            let ZoomTo=[]
            let ZoomLevel

            switch (this.props.Layers[indexOfLayer].features[this.props.ZoomToFeature[1]].typeOfFeature){

                case 'Point':
                    ZoomTo=[
                        this.props.Layers[indexOfLayer].features[this.props.ZoomToFeature[1]].coordinates[0]-6000,
                        this.props.Layers[indexOfLayer].features[this.props.ZoomToFeature[1]].coordinates[1]
                    ]
                    ZoomLevel=12
                    break

                case 'Polygon':
                    ZoomTo=[
                        this.props.Layers[indexOfLayer].features[this.props.ZoomToFeature[1]].coordinates[0][0][0]-6000,
                        this.props.Layers[indexOfLayer].features[this.props.ZoomToFeature[1]].coordinates[0][0][1]
                    ]
                    ZoomLevel=12
                    break

                case 'LineString':
                    ZoomTo=[
                        this.props.Layers[indexOfLayer].features[this.props.ZoomToFeature[1]].coordinates[0][0]-6000,
                        this.props.Layers[indexOfLayer].features[this.props.ZoomToFeature[1]].coordinates[0][1]
                    ]
                    ZoomLevel=12
                    break

                default:
                    console.log("błąd")
                    break
            }

            this.state.map.setView( new View({
                center: ZoomTo,
                zoom: ZoomLevel

            }))

            this.setState((prevState)=>{
                prevState.ZoomToFeature=this.props.ZoomToFeature
                return prevState
            })
        }
    }

    render(){

        const style = {
            width: '100%',
            height:this.state.height,
            backgroundColor: '#cccccc',
            zIndex:0,
        }
        
        return (
            <div id='map' style={style}>
                <div id="Controls" className="Controls">
                    Rysowanie:
                    <label><input type="radio" name="Drawing" onClick={()=>{
                        this.props.CurrentDrawingChange("Point")
                        this.props.StartNewDrawing()
                    }}/>Punkt</label>
                    <label><input type="radio" name="Drawing" onClick={()=>{
                        this.props.CurrentDrawingChange("Polygon")
                        this.props.StartNewDrawing()
                    }}/>Powierzchnia</label>
                    <label><input type="radio" name="Drawing" onClick={()=>{
                        this.props.CurrentDrawingChange("LineString")
                        this.props.StartNewDrawing()
                    }}/>Linia</label>
                    <input type="button" value="Nowy kształt" onClick={()=>this.props.StartNewDrawing()}/>
                </div>
            </div>
        )
    }
}

export default MapView