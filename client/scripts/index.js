"use strict"

$(function() {
	
	let paneBoard = $('#graph');

	let myPane = new graphPane();
	myPane.init(paneBoard);

	let myPaneControl = new graphPaneControl();
	myPaneControl.init(myPane);
	$('.menu .item').tab()

	$('#viewerCaller').on('click', d=>{
		let tempPane = new graphPane();
		tempPane.init(paneBoard);
		let tempCtl = new graphPaneControl();
		tempCtl.init(tempPane);
	})
	
})

