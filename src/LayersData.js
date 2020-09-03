const LayersData = [
    {
        id: 0,
        symbol:"a",
        name: "Mapa Geograficzna",
    },
    {
        id: 1,
        symbol:"a",
        name: "Warstwa z punktami",
        featuresColor: "purple",
        features:[
            {
                typeOfFeature: 'Point',
                coordinates: [2160000, 7200000]
            },
            {
                typeOfFeature: 'Point',
                coordinates: [2160000, 7190000]
            },
            {
                typeOfFeature: 'Point',
                coordinates: [2170000, 7190000]
            },
        ]
    },
    {
        id: 2,
        symbol:"b",
        name: "Warstwa z liniami",
        featuresColor: "red",
        features:[
            {
                typeOfFeature: 'LineString',
                coordinates: [
                    [2160000, 7200000],
                    [2170000, 7200000],
                    [2170000, 7210000],
                    [2160000, 7210000],
                    [2150000, 7200000],
                ]
            },

        ]
    },
    {
        id: 3,
        symbol:"c",
        name: "Warstwa z powierzchnią",
        featuresColor: "blue",
        features:[
            {
                typeOfFeature: 'Polygon',
                coordinates: [
                    [
                        [2160000, 7200000],
                        [2170000, 7200000],
                        [2170000, 7210000],
                        [2160000, 7210000],
                        [2160000, 7200000],
                    ],
                ]
            },
        ],
    },
    {
        id: 4,
        symbol:"2",
        name: "warstwa5",
    },
    {
        id: 5,
        symbol:"h",
        name: "warstwa6",
    },
    {
        id: 6,
        symbol:"z",
        name: "warstwa7",
    },
    {
        id: 7,
        symbol:"Z",
        name: "warstwa8",
    }
];
export default LayersData