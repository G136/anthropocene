import "./external/plotly/plotly.js";
import "./external/d3/d3.js"; // (for d3.dsv only😬)


const dataUrl = 'assets/data.csv'

const plotlyDivId = 'plotly'

const plotlyDiv = document.getElementById(plotlyDivId)
const dataColumnSelector = document.getElementById('data-column-select')


const dataRows = await d3.dsv(',', dataUrl)


function getColumn(rows, column) {
    return rows.map((row) => row[column])
}

const baseData = {
    type: 'choropleth',
    locations: getColumn(dataRows, 'Country'),
    
    locationmode: 'country names',

    // geojson: 'assets/world.geojson',
    // locationmode: 'geojson-id',
    // featureidkey: 'properties.NAME_LONG',
    
    colorbar: {
	orientation: 'h',
	yanchor: 'bottom',
	y: 0,
    },
}

// double array shit
// https://plotly.com/javascript/plotlyjs-function-reference/#plotlyrestyle
const columnUpdateData = {
    'money': {
	z: [getColumn(dataRows, 'money')],
	// zmid: 0,
	// colorscale: [[[0, 'crimson'], [0.5, 'gray'], [1, 'darkseagreen']]],
	'colorbar.title.text': "Billions<br>USD",
    },
    'modeled': {
	z: [getColumn(dataRows, 'CO2_modeled')],
	// zmid: null,
	// colorscale: [[[0, 'darkseagreen'], [0.1, 'orange'], [1, 'crimson']]],
	'colorbar.title.text': "modeled<br>emissions",
    },
    'actual': {
	z: [getColumn(dataRows, 'CO2_actual')],
	// zmid: null,
	// colorscale: [[[0, 'darkseagreen'], [0.1, 'gray'], [1, 'crimson']]],
	'colorbar.title.text': "actual<br>emissions",
    },
    'error': {
	z: [getColumn(dataRows, 'error')],
	// zmid: 0,
	// colorscale: [[[0, 'crimson'], [0.5, 'gray'], [1, 'darkseagreen']]],
	'colorbar.title.text': "emissions<br>error",
    },
}

const layout = {
    paper_bgcolor: 'rgba(0, 0, 0, 0)',
    
    geo: {
	bgcolor: 'rgba(0, 0, 0, 0)',
	
	showframe: false,
	// showocean: true,
	// oceancolor: 'rgba(64 128 255 0.5)',
	showland: true,
	landcolor: 'rgba(255, 255, 255, 1)',
	// landcolor: 'magenta',
	// showcoastlines: false,
	projection: {
	    type: 'cylindrical',
	},
    },
    margin: {
	t: 0,
	b: 0,
	l: 0,
	r: 0,
    },
    // autosize: true,
}

const config = {
    responsive: true,
    displayModeBar: true,
    
    modeBarButtonsToAdd: [{
	name: 'Fullscreen',

	icon: Plotly.Icons.selectbox,

	click: function(gd) {
	    
	    // uhh none of this will work on safari (?)

	    if (document.fullscreenElement) {
		document.exitFullscreen()
	    }
	    else {
		plotlyDiv.requestFullscreen()
	    }
	}
    }],

    modeBarButtonsToRemove: ['select2d', 'lasso2d'],
}


Plotly.newPlot(plotlyDivId, [baseData], layout, config)
Plotly.restyle(plotlyDivId, columnUpdateData['money']) //TODO do the remembered <select> thingy ?

dataColumnSelector.addEventListener('change', (event) => {
    switch (event.target.value) {

	// case 'money':
	//     break;

	// case 'modeled':
	//     break;

	// case 'actual':
	//     break;

    case 'error':
	const z = getColumn(dataRows, 'error').filter((cell) => !isNaN(cell))
	
	// zmid: 0,
	// colorscale: [[[0, 'crimson'], [0.5, 'gray'], [1, 'darkseagreen']]],
	// 'colorbar.title.text': "emissions<br>error",

	const min = Math.min(...z)
	const max = Math.max(...z)
	
	const mid = 0
	
	const pmin = 0
	const pmid = mid - min
	const pmax = max - min

	const nmin = pmin / pmax // 0
	const nmid = pmid / pmax
	const nmax = pmax / pmax // 1
	
	console.log(nmid)
	debugger
	
	Plotly.restyle(plotlyDivId, {
	    z: [z],
	    colorscale: [ [[nmin, 'crimson'], [nmid * 1/2, 'orange'], [nmid * 3/4, 'yellow'], [nmid * 15/16, 'brown'],
			   // [nmid, 'gray'],
			   [(nmid * 3 + nmax) / 4, 'lightblue'],
			   [nmax, 'darkseagreen']] ],
	    'colorbar.title.text': "emissions<br>error",
	})
	
	break;
	
    default:
	Plotly.restyle(plotlyDivId, columnUpdateData[event.target.value])
	// alert("selection brokey");
	break;
    }
})
