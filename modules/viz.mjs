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
	showcoastlines: false,
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
// Plotly.restyle(plotlyDivId, columnUpdateData['Offset']) //TODO do the remembered <select> thingy ?

function inverseLerp(num, min, max) {
    return (num - min) / (max - min);
}

dataColumnSelector.addEventListener('change', (event) => {
    switch (event.target.value) {

    case 'O':
	const offsets = getColumn(dataRows, 'Offset');

	Plotly.restyle(plotlyDivId, {
	    'colorbar.title.text': "% of<br>Resources",
	    z: [ offsets ],

	    colorscale: [ [[0, 'darkseagreen'],
			   [inverseLerp(0, Math.min(...offsets), Math.max(...offsets)), 'gray'],
			   [1, 'crimson']] ],
	});
	break;

    case 'R':
	const responsibilities = getColumn(dataRows, 'R_Index');
	
	Plotly.restyle(plotlyDivId, {
	    'colorbar.title.text': "Responsibility<br>Index",
	    z: [ responsibilities ],
	    
	    colorscale: [ [[0, 'crimson'],
			   [inverseLerp(0,
					Math.min(...responsibilities),
					Math.max(...responsibilities)),
			    'gray'],
			   [1, 'darkseagreen']] ],
	});
	break;

    case 'I':
	Plotly.restyle(plotlyDivId, {
	    'colorbar.title.text': "Vulnerability<br>Index",
	    z: [ getColumn(dataRows, 'V_Index') ],
	    
	    colorscale: [ [[0, 'darkseagreen'], [0.7, 'gray'], [1, 'crimson']] ],
	});
	break;
	
    case 'CO2_Actual':
	Plotly.restyle(plotlyDivId, {
	    'colorbar.title.text': "Actual<br>Emissions",
	    z: [ getColumn(dataRows, 'CO2_Actual') ],
	    
	    colorscale: [ [[0, 'darkseagreen'], [0.1, 'gray'], [1, 'crimson']] ],
	});
	break;
	
    case 'CO2_Modeled':
	Plotly.restyle(plotlyDivId, {
	    'colorbar.title.text': "Modeled<br>Emissions",
	    z: [ getColumn(dataRows, 'CO2_Modeled') ],
	    
	    colorscale: [ [[0, 'darkseagreen'], [0.1, 'gray'], [1, 'crimson']] ],
	});
	break;

    case 'Change':
	const changes = getColumn(dataRows, 'Change');
	const changes_nmid = inverseLerp(0, Math.min(...changes), Math.max(...changes));

	Plotly.restyle(plotlyDivId, {
	    'colorbar.title.text': "modeled vs<br>actual, times",
	    z: [ changes ],

	    colorscale: [ [[0, 'skyblue'],
			   [changes_nmid, 'gray'],
			   [(changes_nmid * 4 + 1) / 5, 'crimson'],
			   [1, 'violet']] ],
	});
	break;

    case 'GDP_Factor':
	Plotly.restyle(plotlyDivId, {
	    'colorbar.title.text': "Factor:<br>GDP",
	    z: [ getColumn(dataRows, 'GDP_Factor') ],

	    colorscale: [ [[0, 'darkseagreen'], [0.1, 'gray'], [1, 'crimson']] ],
	});
	break;

	
    case 'Pop_Factor':
	Plotly.restyle(plotlyDivId, {
	    'colorbar.title.text': "Factor:<br>Population",
	    z: [ getColumn(dataRows, 'Pop_Factor') ],
	    
	    colorscale: [ [[0, 'darkseagreen'], [0.1, 'gray'], [1, 'crimson']] ],
	});
	break;
	
    case 'Energy_Factor':
	Plotly.restyle(plotlyDivId, {
	    'colorbar.title.text': "Factor:<br>Energy",
	    z: [ getColumn(dataRows, 'Energy_Factor') ],
	    
	    colorscale: [ [[0, 'darkseagreen'], [0.1, 'gray'], [1, 'crimson']] ],
	});
	break;
	
    default:
	alert("selection brokey");
	break;
    }
})


dataColumnSelector.dispatchEvent(new Event('change'))

