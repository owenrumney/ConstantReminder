function cell(id, x, y, isLit) {
 	this.id = id;
 	this.x = x;
 	this.y = y;
 	this.isLit = isLit;
 	this.visual = document.getElementById(id);
 }

 cell.prototype.getLit = function () {
 	return this.isLit;
 }

 cell.prototype.getId = function () {
 	return this.id;
 }

 cell.prototype.toggle = function () {
 	this.isLit = !this.isLit;
 	if (this.isLit)
 	{
 		this.visual.className = 'cell isLit';
 	}
 	else
 	{
 		this.visual.className = 'cell';
 	}
 };

 cell.prototype.getRow = function () {
 	return this.x;
 };

 cell.prototype.getCol = function () {
 	return this.y;
 };

 cell.prototype.handleClick = function () {
 	alert(this.id);
 }

 function playingBoard(size) {
 	this.size = parseInt(size);
 	this.cells = new Array();
 	this.clickCount = 0;
 	var counter = 0;
 	for (var i = 0; i < size; i++) {
 		for (var j = 0; j < size; j++) {
 			this.cells[counter] = new cell(counter, i, j, false);
 			counter++;
 		}		
 	}
 }

 playingBoard.prototype.getSize = function() {
 	return this.size;
 };

 playingBoard.prototype.checkForWin = function() {
 	var completed = true;
 	for (var i =0; i<this.cells.length;i++)
 	{
 		if (this.cells[i].getLit() == true)
 		{
 			completed = false;
 			break;
 		}
 	}
 	return completed;
 }

 playingBoard.prototype.toggleCellAndNeighbours = function(id) {
 	var cell = this.cells[id];
 	cell.toggle();

 	for (var i = 0; i < this.cells.length; i++)
 	{
 		var nCell = this.cells[i];
 		if (nCell.getId() === cell.getId())
 			continue;
 		// alert('cellId: ' + cell.getId() + ' nCellId: ' + nCell.getId() 
 		// 		+ ' cellColId: ' + cell.getCol() + ' nCellId: ' + nCell.getCol());
 if (
 	(nCell.getId() === cell.getId() + 1 && 
 		nCell.getRow() === cell.getRow())
 	|| (nCell.getId() === cell.getId() - 1 && 
 		nCell.getRow() === cell.getRow())
 	|| (nCell.getId() === (cell.getId() + this.size) && 
 		nCell.getCol() === cell.getCol())
 	|| (nCell.getId() === cell.getId() - this.size && 
 		nCell.getCol() === cell.getCol()))
 {
 	nCell.toggle();

 }
}
}

playingBoard.prototype.configureGame = function(difficulty) {

	var offsets = [-2, 2, this.size, (-1 * this.size)];
	var cell = Math.floor((Math.random()*this.cells.length - 1)+1);
	this.toggleCellAndNeighbours(cell);

	for (var i = 0;i<difficulty;i++) {
		var shift = Math.floor((Math.random()*3)+1);
		cell = cell + offsets[shift];
		cell = (cell > 0 && cell < this.cells.length - 1) ? cell  : (cell < 0) ? 0 : this.cells.length - 1;
		this.toggleCellAndNeighbours(cell);
		this.inactive = false;
		$('#messages').text('');
		$('#messages').hide();
	}

	if (this.checkForWin())
	{
		this.configureGame(difficulty);
	}
}

playingBoard.prototype.cellPlayed = function(id) {

	if (this.cells[id] == null || this.inactive) {
		return;
	}

	this.clickCount++;
	this.toggleCellAndNeighbours(id);
	if (this.checkForWin())
	{
		$('#messages').append('<p class="messages">Congratulations! You completed the puzzle in ' + this.clickCount + ' clicks.</p>');
		$('#messages').show();
		this.clickCount = 0;
		this.inactive = true;
	}
}



function redrawBoard(board) {
	var size= board.getSize();
	var playAreaWidth = $('.span6').width() - (size * 4);
	var cellDim = Math.floor(playAreaWidth/size);
	$('.cell').width(cellDim).height(cellDim);
}

var resizeTimer = null;
var board = null;

$(function() {

	$("#cellSize").val($('#sizeValue').val());
	$("#difficulty").val($('#difficultyValue').val());

	var size = $("#cellSize").children("option").filter(":selected").text();
	var difficulty = $('#difficulty').val();
	var playAreaWidth = $('.span6').width() - (size * 4);
	var cellDim = Math.floor(playAreaWidth/size);

	for (var row = 0;row<size;row++)
	{
		for (var i = 0;i<size;i++)
		{
			$('<span/>', {
				id: (row * size) + i,
			}).addClass('cell').width(cellDim).height(cellDim).appendTo('#playArea');
		}
	}

	var width = size * (cellDim + 4);
	$('#playArea').width(width);
	$('#messages').width(width - 13);

	board = new playingBoard(size);

	$(window).bind('resize', function() { 
		if (resizeTimer) clearTimeout(resizeTimer); 
		resizeTimer = setTimeout(redrawBoard(board), 100);
	});

	this.inactive = false;
	board.configureGame(difficulty);	

	$('.cell').click(function () {
		board.cellPlayed(this.id);
	});

});

