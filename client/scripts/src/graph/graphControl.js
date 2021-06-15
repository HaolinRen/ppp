"use strict"
function graphPaneControl() {}

graphPaneControl.fn = graphPaneControl.prototype;


graphPaneControl.fn.init = function (vue) {
	this.vue = vue;
    this.myGraphModel = new GraphModel(this.vue.width, this.vue.height);
    this.myGraphModel.__MAX_EDGE_SIZE = 3;
    this.myGraphModel.init(this.vue.getVisualPane(), 'webgl');
    this.bindGraphMethod();
    this.initLoadGraph();
    this.initOptionPane();
    this.initExplorePane();
    this.initSelector();
    this.init_layout_option();
    this.propChart = {
        'nodePropChart': {},
        'linkPropChart': {},
        'linkEventChart': {}
    }
}

graphPaneControl.fn.bindGraphMethod = function () {
    let that = this;
    this.myGraphModel.bindFilterDoubleClickedNode();
}

graphPaneControl.fn.initSelector = function() {
    let self = this;
    this.vue.selector.init();

    this.vue.selector.callback = function(points) {
        let selectedNodes = self.myGraphModel.testSelect(points);

    }
}

graphPaneControl.fn.initOptionPane = function() {

}

graphPaneControl.fn.notifier = function(channel, data) {
    for (let oneMethod in this.channels[channel]) {
        
    }
}

graphPaneControl.fn.subscribe = function(channel, id, method) {
    
}

graphPaneControl.fn.initExplorePane = function() {
    let that = this;
    this.vue.exploreCallback = function(isExploring) {
    	if (isExploring) {
    		that.vue.selector.clearSelector();
    	}
    }
}

graphPaneControl.fn.initLoadGraph = function () {
    var that = this;
    this.vue.loadGraphPane.submitSelect.on('click', function () {
        let graphSelected = that.vue.loadGraphPane.fileSelector.getSelect();
        that.vue.showDimmer('Loading...');
        that.isUpdateGraphInfo = false;
        that.loadGraphFromServer(graphSelected);
    });
};

graphPaneControl.fn.loadGraphFromServer = function (graphName) {
    let that = this;
    if (graphName !== '') {
        let req = { graphName: graphName };

        lpt_util.postData(true, '/loadgraph', JSON.stringify(req), function (data) {
            if (data.success) {
                that.updateGraph(data.data, true);
            } else {
                alert('faild to load the graph');
            }
            that.vue.hideDimmer();
        })
    } else {
        that.vue.hideDimmer();
    }
}

graphPaneControl.fn.init_layout_option = function() {
    let self = this;
    this.vue.layoutChangeCallback = function(l) {
        let originGraph = self.myGraphModel.getGraph();
        self.requestGraphLayout(l, originGraph, d=>{
            self.myGraphModel.showGraph(d);
        });
    }
}

graphPaneControl.fn.requestGraphLayout = function(layout, graph, callbackMethod) {
    let req = {};
    let that = this;
    req.layout = layout;
    req.data = {
        'nodes': [],
        'links': []
    };
    if (!graph.nodes) {
        return
    }
    req.data.nodes = graph.nodes.map(function (n) {
        return {
            'id': n.id,
            'weight': n.weight,
            'size': n.size
        }
    });
    req.data.links = graph.links.map(function (n) {
        return {
            'source': n.source,
            'target': n.target,
            'weight': n.weight
        }
    })
    this.vue.showDimmer('Requesting graph layout...');

    lpt_util.postData(true, '/glayout', JSON.stringify(req), function (data) {
        
        data.nodes.forEach(function (n, i) {
            graph.nodes[i].x = n.x;
            graph.nodes[i].y = n.y;
        })
        callbackMethod(graph);
        that.vue.hideDimmer();
    });
}

graphPaneControl.fn.updateGraph = function(data) {

    let graphInfo = this.myGraphModel.showGraph(data);
    this.clearBottomChart();
    this.updateGraphInfo(graphInfo)
    this.graphInfo = graphInfo;
    console.log(graphInfo);
    // this.vue.setGraphInfo(this.myGraphModel.getNodeSum(), this.myGraphModel.getEdgeSum());
}

graphPaneControl.fn.getTopVingt = function(dict) {
    let arr = []
    for (let key in dict) {
        arr.push({
            key: key,
            val: dict[key]
        })
    }
    arr.sort((a,b)=>{
        return b.val - a.val
    })
    let res = {
        'other': 0
    };
    let k = 0;
    for (let one of arr) {
        
        if (k >= 19) {
            res['other'] += one.val
        } else {
            res[one.key] = one.val
        }
        k += 1
    }
    return res
}

graphPaneControl.fn.clearBottomChart = function() {
    for (let chart in this.propChart.nodePropChart) {
        this.propChart.nodePropChart[chart].removeChart();
    }

    for (let chart in this.propChart.linkPropChart) {
        this.propChart.linkPropChart[chart].removeChart();
    }

    for (let chart in this.propChart.linkEventChart) {
        this.propChart.linkEventChart[chart].removeChart();
    }

    this.propChart.nodePropChart = {}
    this.propChart.linkPropChart = {}
    this.propChart.linkEventChart = {}
}

graphPaneControl.fn.updateGraphInfo = function(graphInfo) {
    this.updateGraphOptionInfo(graphInfo.props);
    this.updateBottomInfo(graphInfo)
}

graphPaneControl.fn.updateBottomInfo = function(graphInfo) {
    console.log(graphInfo)
    this.vue.updateBottomInfo('Node Properities', graphInfo.props.nodeProp, (d, e)=>{
        let width = parseInt(this.vue.width/2)
        if (this.propChart.nodePropChart[d] === undefined) {
            let tempChart = new gCharts(width, 400, 'orange', '#FFB6C1')
            tempChart.initPane(e[0], d);
            tempChart.updateBar(this.getTopVingt(this.graphInfo.props.nodeProp[d]))
            this.propChart.nodePropChart[d] = tempChart;
        } else {
            this.propChart.nodePropChart[d].removeChart()
            delete this.propChart.nodePropChart[d]
        }
    })
    this.vue.updateBottomInfo('Link Properities', graphInfo.props.linkProp, (d, e)=>{
        let width = parseInt(this.vue.width/2)
        if (this.propChart.linkPropChart[d] === undefined) {
            let tempChart = new gCharts(width, 400, '#32CD32', '#6495ED')
            tempChart.initPane(e[0], d);
            tempChart.updateBar(this.getTopVingt(this.graphInfo.props.linkProp[d]))
            this.propChart.linkPropChart[d] = tempChart;
        } else {
            this.propChart.linkPropChart[d].removeChart();
            delete this.propChart.linkPropChart[d]
        }
    })
    this.vue.updateBottomInfo('Link Event Properities', graphInfo.events, (d, e)=>{
        let width = parseInt(this.vue.width/2)
        if (this.propChart.linkEventChart[d] === undefined) {
            let tempChart = new gCharts(width, 400, '#6495ED', '#6495ED')
            tempChart.initPane(e[0], d)
            tempChart.updateBar(this.getTopVingt(this.graphInfo.events[d]))
            this.propChart.linkEventChart[d] = tempChart;
        } else {
            this.propChart.linkEventChart[d].removeChart(0);
            delete this.propChart.linkEventChart[d]
        }
    })
}

graphPaneControl.fn.updateGraphOptionInfo = function(props) {
    this.vue.addNodeColorLabels(Object.keys(props.nodeProp), (d, e)=>{
        let tempDict = props.nodeProp[d];
        let colorDict = this.myGraphModel.colorNode(d, this.getTopVingt(tempDict));

        this.vue.generateColorList(colorDict, e);
    })

    this.vue.addLinkColorLabels(Object.keys(props.linkProp), (d, e)=>{
        let tempDict = props.nodeProp[d];
        let colorDict = this.myGraphModel.colorLink(d, this.getTopVingt(tempDict));
        this.vue.generateColorList(colorDict, e);
    })
}



