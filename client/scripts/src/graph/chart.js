
"use strict"

function gCharts(width, height, color1, color2) {
	this.originWidth = width;
	this.originHeight = height;
	this.ticksNum = 20;
	this.color1 = color1;
	this.color2 = color2;
	let margin = {top: 40, right: 60, bottom: 70, left: 60};
	this.margin = margin;
	this.width = width - margin.left - margin.right;
	this.height = this.originHeight - margin.top - margin.bottom;
	this.dist = 2;
	this.isLinear = false;
	this.barWidth = this.width / 20 - this.dist;
	this.NORMAL_OPACITY = 1;
	this.TRANSITION_DURATION = 600;

	this.clickedChartLabelList = [];
};

gCharts.prototype.initPane = function(ele, title) {

	this.x = d3.scale.linear()
				.range([0, this.width])
				.domain([0, this.ticksNum]);

	this.y = d3.scale.linear()
					.range([this.height, 0]);

	this.yAxis = d3.svg.axis()
					.scale(this.y)
					.orient('left');					

	this.xAxis = d3.svg.axis()
					.scale(this.x)
					.ticks(this.ticksNum)
					.orient('bottom')
					.tickFormat(function(d) { return ''; });

	this.paneBoard = d3.select(ele).append("svg")
				.attr("width",this.originWidth)
				.attr("height", this.originHeight)
				
	this.svg = this.paneBoard.append("g")
				.attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

	this.chartPane = this.svg.append('g');

	this.title = this.svg.append('text')
					.attr("dy", "1em")
					.style("text-anchor", "middle")
					.style('border', '2px solid')
					.attr('x', this.width/2)
					.attr('y', -40)
					.attr("font-family", "sans-serif")
					.attr("font-size", "14px")
					.text(title);

	this.info = this.svg.append('text')
					.attr("dy", "1em")
					.style("text-anchor", "middle")
					.attr('x', this.width/2)
					.attr('y', -20);

	this.xRange = this.svg.append("g")
		.attr("class", "x axis")
		.call(this.xAxis)
		.attr("transform", "translate(0," + this.height + ")");

	this.xLabels = this.xRange.selectAll("text")
							.attr('class', 'xlabel')
							.attr("y", 0)
							.attr("x", 10)
							.attr("dy", ".35em")
							.attr("transform", "rotate(45)")
							.style("text-anchor", "start");

	this.yRange = this.svg.append("g")
		.attr("class", "y axis")
		.call(this.yAxis);

	this.yRangeText = this.yRange.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", -50)
		.attr("dy", ".71em")
		.style("text-anchor", "end");
};

gCharts.prototype.getMaxVal = function(data) {
	let maxYVal = data[0][1];
	let lg = data.length;
	for (let i = 1; i < lg; i += 1) {
		if (data[i][1] > maxYVal) {
			maxYVal = data[i][1];
		}
		if (data[i][2] > maxYVal) {
			maxYVal = data[i][2];
		}
	}
	return maxYVal;
}

gCharts.prototype.updateYRange = function(maxYVal) {
	this.y.domain([0, maxYVal]);
	this.yRange.transition().duration(this.TRANSITION_DURATION).call(this.yAxis);
}

gCharts.prototype.updateXRange = function(maxXVal) {
	this.x.domain([0, maxXVal]);
	this.xRange.call(this.xAxis);
}

gCharts.prototype.initData = function(data) {
	let temp;
	let showData = [];

	let arr = []
    for (let key in data) {
        arr.push({
            key: key,
            val: data[key]
        })
    }
    arr.sort((a,b)=>{
        return a.key - b.key
    })

    for (let one of arr) {
         showData.push([one.key, one.val, 0])
    }
	return showData;
}

gCharts.prototype.clearChart = function() {
	this.svg.selectAll('.backBar').remove();
	this.svg.selectAll('.frontBar').remove();
	this.xLabels.text('');
}

gCharts.prototype.removeChart = function() {
	this.paneBoard.remove();
}

gCharts.prototype.getSelectedChart = function() {
	return this.clickedChartLabelList;
}

gCharts.prototype.getDataList = function() {
	return this.data
}

gCharts.prototype.updateBar = function(data) {
	this.data = data;
	this.info.text('');
	
	if (data.length < 1) {
		this.clearChart();
		return;
	};
	 
	let showData = this.initData(data);

	this.xLabels.text('');
	
	this.xLabels.data(showData)
							.text(function(d) {
								return d[0]
							})
							.attr('fill', 'black');
	let maxYVal = this.getMaxVal(showData);
	this.updateYRange(maxYVal);
	this.clickedChartLabelList = [];
	this.updateBackBar(showData);
	// this.updateFrontBar(showData);
};

gCharts.prototype.checkLabel = function(label) {
	let p = this.clickedChartLabelList.indexOf(label);
	if (p === -1) {
		this.clickedChartLabelList.push(label);
	} else {
		this.clickedChartLabelList.splice(p, 1);
	}
	let that = this;

	this.xLabels.attr('fill','black').attr('font-size', '14px')
		.filter(function(n) {
			if(typeof n === 'object' && that.clickedChartLabelList.indexOf(n[0]) !== -1) {
				return true;
			} else {
				return false;
			}	
		})
		.attr('font-size', '20px')
		.attr('fill', 'red');

	if (this.chartClickCallback) {
		this.chartClickCallback(this.clickedChartLabelList);
	}
}

gCharts.prototype.updateBackBar = function(data) {
	let that = this;

	this.backBar = this.chartPane.selectAll(".backBar")
		.data(data);

	this.backBar.enter()
		.append("rect")
		.attr("class", "backBar")
		.attr('fill', this.color1)
		.attr("x", function(d, i) { return i * (that.barWidth+that.dist) + 1; })
		.attr("width", this.barWidth)
		.attr("y", this.height)
		.attr("height", 0)

	this.backBar.on('mouseover', function(d) {
		that.updateInfo(d);
	}).on('click', (d)=> {
		that.checkLabel(d[0]);
	});

	this.backBar.exit().remove();

	this.backBar.transition().duration(this.TRANSITION_DURATION).attr("y", function(d) { return that.y(d[1]); })
		.attr("height", function(d) { return that.height - that.y(d[1]); });
};

gCharts.prototype.updateFrontBar = function(data) {
	let that = this;
	this.frontBar = this.chartPane.selectAll(".frontBar")
		.data(data);

	this.frontBar.enter()
		.append("rect")
		.attr("class", "frontBar")
		.attr('fill', this.color2)
		.attr("x", function(d, i) { return i * (that.barWidth+that.dist) + 1; })
		.attr("width", this.barWidth)
		.attr("y", this.height)
		.attr("height", 0);

	this.frontBar.on('mouseover', function(d) {
		that.updateInfo(d);
	}).on('click', (d)=> {
		that.checkLabel(d[0]);
	});

	this.frontBar.exit().remove();

	this.frontBar.transition().duration(this.TRANSITION_DURATION).attr("y", function(d) { return that.y(d[2]); })
		.attr("height", function(d) { return that.height - that.y(d[2]); });
};

gCharts.prototype.updateInfo = function(d) {
	let t = d[0] + ': ' + d[1];
	this.info.text(t);
};
