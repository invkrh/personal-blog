function plotFunction(param) {

	// Load the Visualization API and the piechart package.
	google.load('visualization', '1.0', {
		'packages': ['corechart']
	});

	// Set a callback to run when the Google Visualization API is loaded.
	google.setOnLoadCallback(drawChart);

	// Callback that creates and populates a data table,
	// instantiates the pie chart, passes in the data and
	// draws it.
	function drawChart() {

		var dataPoint = [];
		for (i = param.min; i <= param.max; i = i + param.step) {
			var logVal = param.func(i)
			dataPoint.push([i, logVal, "(" + i.toFixed(2) + ", " + logVal.toFixed(5) + ")"])
		}

		// Create the data table.
		var data = new google.visualization.DataTable();
		data.addColumn('number', 'X');
		data.addColumn('number', 'Y');
		data.addColumn({
			type: 'string',
			role: 'tooltip'
		});
		data.addRows(dataPoint);

		// Set chart options
		var options = {
			title: param.title,
			titleTextStyle: {
				color: '#49B1F7'
			},
			lineWidth: 3,
			backgroundColor: "#222A30",
			chartArea: {
				backgroundColor: "#222A30"
			},
			crosshair: {
				//trigger: 'focus',
				color: '#848282',
				opacity: '1'
			},
			tooltip: {
				trigger: 'focus',
				textStyle: {
					bold: true,
					color: "black"
				}
			},
			vAxis: {
				title: param.ylab,
				titleTextStyle: {
					color: '#49B1F7',
					bold: true
				},
				textStyle: {
					color: '#49B1F7',
					bold: true
				},
				gridlines: {
					color: '#EC4E3B'
				},
				baselineColor: '#EC4E3B'
			},
			hAxis: {
				title: param.xlab,
				titleTextStyle: {
					color: '#49B1F7',
					bold: true
				},
				textStyle: {
					color: '#49B1F7',
					bold: true
				},
				gridlines: {
					color: '#EC4E3B'
				},
				baselineColor: '#EC4E3B'
			},
			legend: 'none',
			colors: ['#49B1F7'], // line color for serie 1
			// width: 500, // By default, it is set to 100% of its container
			height: param.height
		};

		// Instantiate and draw our chart, passing in some options.
		var chart = new google.visualization.LineChart(document.getElementById(param.div));
		chart.draw(data, options);
	}
}
