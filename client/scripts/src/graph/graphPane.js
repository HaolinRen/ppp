"use strict"

function graphPane() {}

graphPane.fn = graphPane.prototype;

graphPane.fn.init = function(ele) {
	this.settings = {
		exploring: true,
		layout: 'FM^3 (OGDF)'
	}
	let jEle = $(this.addPaneText())
	this.paneEle = jEle;
	ele.append(jEle)
	this.initViusalBoard();
	this.selector = new selector(this.shandowBoard.get(0), this.width, this.height);
	this.initEle()
}

graphPane.fn.initEle = function() {
	this.initSidebar();
	this.addRightInfoPane()
	this.initOption();
	this.initPropBoard();
}

graphPane.fn.initSidebar = function() {
	let sidebar = this.paneEle.find('.sidebar');
	let pb = this.paneEle.find('.pushable')
	sidebar.sidebar({
		'context': pb,
		'dimPage': false,
	}).sidebar('setting', 'transition', 'overlay');
	let opts = this.paneEle.find('.opt');
	opts.on('click', d=>{
		sidebar.sidebar('toggle');
	})
	sidebar.sidebar('toggle');

	this.sidebarAddElements(sidebar);
	this.hideSidebar = function() {
		sidebar.sidebar('hide')
	}
}

graphPane.fn.initOption = function() {
	let opts = this.paneEle.find('.shuffle');
	opts.on('click', d=>{
		let textClick = d.target.innerHTML;
		if (textClick == 'Explore') {
			if (!this.settings.exploring) {
				opts.eq(1).removeClass('active');
				opts.eq(2).addClass('active')
				this.settings.exploring = true;
				this.shandowBoard.css('z-index', '-1');
				if (this.exploreCallback) {
					this.exploreCallback(true);
				}
			}
		} else if (textClick == 'Select') {
			if (this.settings.exploring) {
				opts.eq(2).removeClass('active');
				opts.eq(1).addClass('active')
				this.settings.exploring = false;
				this.shandowBoard.css('z-index', '10');
				if (this.exploreCallback) {
					this.exploreCallback(false);
				}
			}
		} else {
			this.paneEle.remove()
		}
	})
}

graphPane.fn.initViusalBoard = function() {
	this.visualBoard = this.paneEle.find('.visualBoard');
	this.width = $(window).width()
	this.height = this.width* 0.5;
	this.visualBoard.width(this.width).height(this.height);
	this.shandowBoard = this.paneEle.find('.shandowBoard')
	this.shandowBoard.width(this.width).height(this.height);
	this.dimmerPane = this.paneEle.find('.dimmer');
	this.dimmerPane.dimmer({
		'closable': false
	})
}

graphPane.fn.showDimmer = function() {
	this.dimmerPane.dimmer('show')
}

graphPane.fn.hideDimmer = function() {
	this.dimmerPane.dimmer('hide')
}

graphPane.fn.getVisualPane = function() {
	return this.visualBoard.get(0);
}

graphPane.fn.initPropBoard = function() {
	let propToggle = this.paneEle.find('.propToggle');
	let propBoard = this.paneEle.find('.propPane');
	propBoard.hide();
	propToggle.each((d, e)=>{
		propToggle.eq(d).on('click', f=>{
			propToggle.eq(d).toggleClass('active')
			propBoard.eq(d).toggle()
		})
	})

	this.updateBottomInfo = function(bottomType, labelList, callback) {
		let keyVal = 1;
		let color = 'orange';
		if (bottomType == 'Link Properities') {
			keyVal = 2;
			color = 'green'
		} else if (bottomType == 'Link Event Properities') {
			keyVal = 3;
			color = 'blue'
		}
		let presentBoard = propBoard.eq(keyVal)
		let bottomLabelListPane = presentBoard.find('.bottomLabelList');
		let chartpane = presentBoard.find('.chartpane');
		bottomLabelListPane.html('');
		for (let label in labelList) {
			let tempEle = $('<a class="ui label colorlabel">' + label + '</a>')
			tempEle.on('click', d=>{
				tempEle.toggleClass(color);
				if (callback) {
					callback(label, chartpane)
				}
			})
			bottomLabelListPane.append(tempEle)
		}
	}
}

graphPane.fn.addPaneText = function() {
	return '<div class="ui segments">\
				<div class="ui mini top attached menu">\
					<a class="ui item shuffle icon"><i class="remove red icon"></i></a>\
					<a class="ui item shuffle icon">Select</a>\
					<a class="ui item shuffle active icon">Explore</a>\
					<div class="right menu">\
						<a class="ui item opt icon"><i class="options icon"></i></a>\
					</div>\
				</div>\
				<div class="ui pushable segment">\
					<div class="ui wide right segment ableScroll sidebar"></div>\
					<div class="pusher graphBoard">\
						<div class="visualBoard"></div>\
						<div class="shandowBoard"></div>\
						<div class="ui inverted dimmer">\
							<div class="ui text loader">Loading...</div>\
						</div>\
						<div class="right_info"></div>\
					</div>\
				</div>\
				<div class="ui mini attached menu">\
					<a class="ui propToggle item">Time Line</a>\
					<a class="ui propToggle orange item">Node Properties</a>\
					<a class="ui propToggle green item">Link Properties</a>\
					<a class="ui propToggle blue item">Link Event Properties</a>\
				</div>\
				<div class="ui propPane segment"></div>\
				<div class="ui propPane segment">\
					<div class="ui grid">\
						<div class="three wide column"><div class="ui pointing below basic orange label">Node Properties</div><div class="ui ableScroll segment bottomLabelList"></div></div>\
						<div class="thirteen wide column">\
							<div class="ui segment chartpane"></div>\
						</div>\
					</div>\
				</div>\
				<div class="ui propPane segment">\
					<div class="ui grid">\
						<div class="three wide column"><div class="ui pointing below basic green label">Link Properties</div><div class="ui ableScroll segment bottomLabelList"></div></div>\
						<div class="thirteen wide column">\
							<div class="ui segment chartpane"></div>\
						</div>\
					</div>\
				</div>\
				<div class="ui propPane segment">\
					<div class="ui grid">\
						<div class="three wide column"><div class="ui pointing below basic blue label">Link Event Properties</div><div class="ui ableScroll segment bottomLabelList"></div></div>\
						<div class="thirteen wide column">\
							<div class="ui segment chartpane"></div>\
						</div>\
					</div>\
				</div>\
			</div>';
}

graphPane.fn.sidebarAddElements = function (sidebar) {
    let myOption = '<div class=" ui fluid buttons">';
    myOption += '<button class="ui button"><i class="setting icon"></i>Options</button>';
    myOption += '<button class="ui positive button"><i class="file icon"></i>Load</button></div>'

    let settingPane = $('<div></div>');
    let loadGraphPane = $('<div></div>');

    let that = this;
    myOption = $(myOption);
    let myButtons = myOption.find('.button');
    myButtons.on('click', function () {
        $(this).siblings().removeClass('positive');
        $(this).addClass('positive');
        let choice = $(this).text();

        if (choice === 'Options') {
            loadGraphPane.hide();
            settingPane.show();
        } else if (choice === 'Load') {
            loadGraphPane.show();
            settingPane.hide();
        }
    });
    settingPane.hide()
    sidebar.append(myOption).append('<div class="ui divider"></div>')
    		.append(settingPane).append(loadGraphPane);

   	this.optionPaneInit(settingPane)
   	this.loadGraphPaneInit(loadGraphPane)
};

graphPane.fn.optionPaneInit = function (motherBorad) {
    let myAccordion = new accordionPane();

    let layoutLeaf = myAccordion.addOneLeaf('Layout');
    this.settingPaneAddLayoutOption(layoutLeaf);

    let colorLeaf = myAccordion.addOneLeaf('Color');
    this.settingPaneAddColorOption(colorLeaf);

    let sizeLeaf = myAccordion.addOneLeaf('Size');
    this.settingPaneAddSizeOption(sizeLeaf);

    let mutliOpt = myAccordion.addOneLeaf('Multiplex');
    this.settingPaneAddMultiplexOption(mutliOpt);

    let clusterOpt = myAccordion.addOneLeaf('Clustering');
    // this.settingPaneAddClusteringOption(clusterOpt);

    myAccordion.init();
    motherBorad.append(myAccordion.getPane());
};

graphPane.fn.generateColorList = function(colorDict, ele) {
	ele.html('')
	for (let itm in colorDict) {
		let tempEle = $('<div class="ui basic label colorlabel">' + itm + '</div>');
		tempEle.css('color', colorDict[itm]);
		ele.append(tempEle)
	}
}

graphPane.fn.settingPaneAddColorOption = function(motherBorad) {

	let tempText = '<div class="ui ableScroll colorBoard"><div class="ui pointing below basic label">Node color</div><div class="ui segments">\
					<div class="ui ableScroll colorpane segment"></div><div class="ui ableScroll colorList segment"></div></div>\
					<div class="ui pointing below basic label">Link color</div><div class="ui segments"><div class="ui ableScroll segment colorpane"></div>\
					<div class="ui ableScroll colorList segment"></div></div></div>'

	let template = $(tempText);
	let colorpane = template.find('.colorpane');
	let colorListPane = template.find('.colorList')

	this.addNodeColorLabels = function(labelList, callback) {
		let tempNodeColorPane = colorpane.eq(0);
		tempNodeColorPane.html('');
		for (let label of labelList) {
			let tempEle = $('<a class="ui label colorlabel">' + label + '</a>')
			tempEle.on('click', d=>{
				tempEle.addClass('red').siblings().removeClass('red');
				if (callback) {
					callback(label, colorListPane.eq(0))
				}
			})
			tempNodeColorPane.append(tempEle)
		}
	}

	this.addLinkColorLabels = function(labelList, callback) {
		let tempLinkcolorPane = colorpane.eq(1);
		tempLinkcolorPane.html('')
		for (let label of labelList) {
			let tempEle = $('<a class="ui label colorlabel">' + label + '</a>')
			tempEle.on('click', d=>{
				tempEle.addClass('green').siblings().removeClass('green');

				if (callback) {
					callback(label, colorListPane.eq(1))
				}
			})
			tempLinkcolorPane.append(tempEle)
		}
	}

	motherBorad.append(template);
}

graphPane.fn.settingPaneAddSizeOption = function(motherBorad) {
	let tempText = '<div class="ui ableScroll colorBoard"><div class="ui pointing below basic label">Node size</div>'
	tempText += '<div class="ui sizepane"></div><div class="ui pointing below basic label">Link size</div><div class="ui sizepane"></div></div>'

	let template = $(tempText);
	let sizepane = template.find('.sizepane');

	this.addNodesizeLabels = function(labelList, callback) {
		let tempNodesizePane = sizepane.eq(0);
		tempNodesizePane.html('');
		for (let label of labelList) {
			let tempEle = $('<a class="ui label sizelabel">' + label + '</a>')
			tempEle.on('click', d=>{
				tempEle.addClass('red').siblings().removeClass('red');
				if (callback) {
					callback(label)
				}
			})
			tempNodesizePane.append(tempEle)
		}
	}

	this.addLinksizeLabels = function(labelList, callback) {
		let tempLinksizePane = sizepane.eq(1);
		tempLinksizePane.html('')
		for (let label of labelList) {
			let tempEle = $('<a class="ui label sizelabel">' + label + '</a>')
			tempEle.on('click', d=>{
				tempEle.addClass('green').siblings().removeClass('green');

				if (callback) {
					callback(label)
				}
			})
			tempLinksizePane.append(tempEle)
		}
	}

	motherBorad.append(template);
}

graphPane.fn.settingPaneAddLayoutOption = function (motherBorad) {
    var tempData_layoutList = [
    	'FM^3 (OGDF)',
        'Balloon (OGDF)',
        'Bubble Tree',
        'Circular',
        'Circular (OGDF)',
        'Cone Tree',
        'Connected Component Packing',
        'Connected Component Packing (Polyomino)',
        'Dendrogram',
        'Fast Multipole Embedder (OGDF)',
        'Fast Multipole Multilevel Embedder (OGDF)',
        'Frutcherman Reingold (OGDF)',
        'GRIP',
        'Hierarchical Tree (R-T Extended)',
        'MMM Example Fast Layout (OGDF)',
        'MMM Example Nice Layout (OGDF)',
        'MMM Example No Twist Layout (OGDF)',
        'Pivot MDS (OGDF)',
        'Planarization Grid (OGDF)',
        'Planarization Layout (OGDF)',
        'Random layout',
        'Stress Majorization (OGDF)',
        'Sugiyama (OGDF)',
        'Tile To Rows Packing (OGDF)',
        'Tree Leaf',
        'Tree Radial',
        'Visibility (OGDF)'
    ]
    let that = this;
    let layoutOpt = new dropdownPane(this.settings.layout);
    layoutOpt.initLocalSort(tempData_layoutList, function (choice) {
        that.settings.layout = choice;
    });
    layoutOpt.addCommitButton('orange', d=>{
    	if (this.layoutChangeCallback) {
    		this.layoutChangeCallback(d)
    	}
    })
    motherBorad.append(layoutOpt.getPane());

}

graphPane.fn.settingPaneAddMultiplexOption = function (motherBorad) {
    let that = this;
    let graphChoiceFilter = new oneCheck('Get the present graph', true);

    graphChoiceFilter.init(function (isChecked) {
        that.settings.getPresentGraphToMulti = isChecked;
    })

    graphChoiceFilter.check();


    let btText = '<div class="ui fluid buttons"><button class="ui orange button">Subgraph</button><div class="or">';
    btText += '</div><button class="ui red button">Nouvelle</button><div class="or"></div><button class="ui positive button">Rebuild</button></div>';

    let buildButton = $(btText)
    let bts = buildButton.find('.button');

    let subgraphButton = bts.eq(0);
    let troisDButton = bts.eq(2);
    let rebuildButton = bts.eq(4);

    motherBorad.append(graphChoiceFilter.getPane())
        .append('<div class="ui divider"></div>')
        .append(btText);

    this.multiplexEle = {
    }
};

graphPane.fn.addRightInfoPane = function () {
    let that = this;
    this.rightInfoEle = {};

    let motherBorad = this.paneEle.find('.right_info');
    let widthVal = this.width * 0.45 > 500 ? 500 : this.width * 0.45;
    let heigthVal = this.height * 0.6;
    let PANE_WIDTH = parseInt(widthVal)+100 + 'px';
    let PANE_HEIGHT = parseInt(heigthVal) + 'px';

    motherBorad.width(PANE_WIDTH).height('auto')
        .css('z-index', '100').css('right', '-' + PANE_WIDTH);

    let selectedInfo = $('<div class="selectedInfo "></div>');

    let stbToggle = $('<div class="taTg"></div>');
    let rightBt = $('<button class="ui icon button"><i class="angle double right icon"></i></button>');
    let leftBt = $('<button class="ui icon button"><i class="angle double left icon"></i></button>');
    rightBt.hide();

    stbToggle.append(rightBt).append(leftBt);

    rightBt.on('click', function () {
        leftBt.show();
        rightBt.hide();
        motherBorad.animate({
            right: '-' + PANE_WIDTH
        }, 800)
        that.settings.isShowSelectedInfoIndex = false;
    })

    leftBt.on('click', function () {
        leftBt.hide();
        rightBt.show();
        motherBorad.animate({
            right: '0'
        }, 800);
        that.settings.isShowSelectedInfoIndex = true;
    })

    let accordionBoard = new accordionPane();

    const accordHeight = parseInt(this.height / 2);

    this.rightInfoEle.selectedProps = accordionBoard.addOneLeaf('Selected Links', '', false);
    this.rightInfoEle.selectedNode = accordionBoard.addOneLeaf('Selected Nodes', '', false);

    this.rightInfoEle.selectedNode.addClass('ableScroll').height(accordHeight);
    this.rightInfoEle.selectedProps.addClass('ableScroll').height(accordHeight);

    accordionBoard.init();

    selectedInfo.append(accordionBoard.getPane());

    motherBorad.append(stbToggle).append(selectedInfo);

    // this.generateSelectedTable();
};

graphPane.fn.loadGraphPaneInit = function (motherBorad) {
    let that = this;
    let graphFromServer = new dropdownPane('Select a graph from server');

    graphFromServer.initOnlineSort('/gflist', false);

    let submitGraphSelectButton = $('<button class="ui fluid orange button">Confirm</button>');

    motherBorad.append(graphFromServer.getPane())
        .append('<div class="ui hidden divider"></div>')
        .append(submitGraphSelectButton);
    this.loadGraphPane = {
    	submitSelect: submitGraphSelectButton,
    	fileSelector: graphFromServer
    };
};

function accordionPane() {
	this.parent = $('<div class="ui styled accordion"></div>');
}

accordionPane.prototype.init = function() {
	this.parent.accordion({
		animateChildren: false
	});
};

accordionPane.prototype.open = function(index) {
	this.parent.accordion('open', index);
};

accordionPane.prototype.close = function(index) {
	this.parent.accordion('close', index);
}

accordionPane.prototype.toggle = function(index) {
	this.parent.accordion('toggle', index);
}

accordionPane.prototype.getPane = function() {
	return this.parent;
}

accordionPane.prototype.addOneLeaf = function(title, content, isAcitve) {
	var leafTitle,
		leafContent;

	leafContent = $('<div class="content"></div>');

	if (isAcitve) {
		leafTitle = '<div class="title active"><i class="dropdown icon"></i>';
	} else {
		leafTitle = '<div class="title"><i class="dropdown icon"></i>';
	}

	leafTitle += title + '</div>';

	if (isAcitve) {
		leafContent.addClass('active');
	}
  if (content && content.length > 0) {
    leafContent.append(content);
  }
	this.parent.append(leafTitle).append(leafContent);
	return leafContent;
}

function dropdownPane(defaultText, isMultiple) {
	this.prePart = '<div class="ui fluid input"><div class="ui ';
	if (isMultiple) {
		this.prePart += 'multiple ';
	}
	this.prePart += 'search fluid selection dropdown"><input type="hidden">';
	this.prePart += '<i class="dropdown icon"></i><div class="default text">' + defaultText + '</div>';
};

dropdownPane.prototype.init = function() {
	this.prePart += '</div>';
	this.motherBoard = $(this.prePart);
	this.dropdownInput = this.motherBoard.children().eq(0);
}

dropdownPane.prototype.initLocalSort = function(selections, callback) {
	this.prePart += '<div class="menu">';
	this.prePart += '</div>';
	this.init();

	this.optionsMenu = this.dropdownInput.find('.menu');
	if (selections) {
		this.updateOptions(selections);
	}
	this.dropdownInput.dropdown({
		onChange: function(val, text) {
			if (callback) {
				callback(text);
			}
		}
	});
};

dropdownPane.prototype.updateOptions = function(selections) {
	if (this.optionsMenu) {
		var res = '';
		var lg = selections.length;
		for (var i = 0; i < lg; i += 1) {
			res += '<div class="item" ' + ' data-value="' + i + '">' + selections[i] + '</div>'
		}
		this.optionsMenu.html(res);
	}
}

dropdownPane.prototype.addCommitButton = function(buttonColor, method) {
	var that = this;
	var commitButton = $('<div class="right attached ui ' + buttonColor + ' button">submit</div>');
	commitButton.on('click', function() {
		method(that.getSelect());
		that.hide();
	})
	this.motherBoard.append(commitButton);
}

dropdownPane.prototype.addClearButton = function(buttonColor, method) {
	var that = this;
	var clearButton = $('<div class="ui ' + buttonColor + ' button">clear</div>');
	clearButton.on('click', function() {
		if (method) {
			method();
		}
		that.clear();
	})
	this.motherBoard.append(clearButton);
}


dropdownPane.prototype.initOnlineSort = function(path, saveRemoteData) {
	
	this.init();
	this.dropdownInput.dropdown({
		apiSettings: {
			cache: false,
			url: path,
			method: 'post'
		},
		saveRemoteData : saveRemoteData,
	});
};

dropdownPane.prototype.getSelect = function() {
	return this.dropdownInput.dropdown('get text');
}

dropdownPane.prototype.getSelectedOrder = function() {
	var choice = this.dropdownInput.dropdown('get value');

	var res;
	if (choice === '') {
		return -1;
	} else {
		let tempChoices = choice.split(',');
		res = tempChoices.map(function(n) {
			return +n;
		})
	}

	return res;
}

dropdownPane.prototype.hide = function() {
	this.dropdownInput.dropdown('hide');
}

dropdownPane.prototype.clear = function() {
	this.dropdownInput.dropdown('clear');
}

dropdownPane.prototype.getPane = function() {
	return this.motherBoard;
};

function oneCheck(title, isToggle) {

	var tempText = '<div class="ui ';
	if (isToggle) {
		tempText += 'toggle ';
	}
	
	tempText += 'checkbox"><input type="checkbox">';
	tempText += '<label>' + title + '</label></div>';
	this.ckBoard = $(tempText);
}

oneCheck.prototype.init = function(callback) {
	this.ckBoard.checkbox({
		onChecked: function() {
			callback(true);
		},
		onUnchecked: function() {
			callback(false);
		}
	})
}

oneCheck.prototype.uncheck = function() {
	this.ckBoard.checkbox('uncheck');
}

oneCheck.prototype.check = function() {
	this.ckBoard.checkbox('check');
}

oneCheck.prototype.disable = function() {
	this.ckBoard.checkbox('set disabled');
}

oneCheck.prototype.hide = function() {
	this.ckBoard.hide();
}

oneCheck.prototype.show = function() {
	this.ckBoard.show();
}


oneCheck.prototype.enable = function() {
	this.ckBoard.checkbox('set enabled');
}

oneCheck.prototype.getPane = function() {
	return this.ckBoard;
}

