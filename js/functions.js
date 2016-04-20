$( document ).ready(function(event) {
	element_counter = 1
	shape_functions = {"rectangle": draw_rectangle, "oval": draw_oval, "line": draw_line, "straight-line": draw_line}
	first_click = true
	new_line = false
	new_clean = true

	clean_size = 10

	fill = false
	clean = false
	save = false
	border_size = 1
	border_color = "#123456"
	background_color = "#012345"
	shape = "oval"
	name = "painter"

	load = false
	path = ""

	$('a').click(function(){
		id = $(this).attr('id')

		changeFunction(id)
	});

	$('#border-size-val').change(function(){
		id = $(this).attr('border-size')

		changeFunction(id)
	});

	$('#color-val').select(function(){
		id = $(this).attr('color')

		changeFunction(id)
	});

	$('div').click(function(event){
		if(fill){
			$(event.target).css({"background-color": background_color});
		} else if(clean){
			clean_pos = $("#" + element_counter)

			$("div").each(function(){
				element = $(this)

				if (element.attr('id') == "paint" || element.attr('id') == element_counter || element.attr('id') == "container")
					return

				if (element.attr('class') == "menu-btn"){
					clean = false
					return
				}

    			if(checkCollisions(clean_pos, element))
    			{
					element.remove()
    			}
			});
		}
	});

	$('#paint').mousedown(function(event){
		border_color = $("#color-val").val()
		background_color = $("#color-val").val()

		if(!first_click || fill || clean)
			return

		posX = event.pageX;
		posY = event.pageY;

		first_click = false

		endX = event.pageX;
		endY = event.pageY;

		draw(element_counter, shape, posX, posY, endX, endY, border_size, border_color, true)
	});

	$('#paint').mousemove(function(event){
		if(save){
			data = "<html><head><title>" + name + "</title></head><body>"
			data += $('#paint').html()
			data += "</body></html>"
			var blob = new Blob([data], {type: "text/plain;charset=utf-8"});
			saveAs(blob, name + ".html");
			save = false
		}

		if(load){
			$.get(path, function(data) {
	        	var fileDom = $(data);
	        	$('#paint').append(fileDom.find('body'))
	    	});
	    	load = false
		}

		if(clean && new_clean){
			draw(element_counter, "rectangle", event.pageX - clean_size, event.pageY - clean_size, event.pageX + clean_size, event.pageY + clean_size, 3, "black", true)

			new_clean = false
			return
		}

		if(clean){
			draw(element_counter, "rectangle", event.pageX - clean_size, event.pageY - clean_size, event.pageX + clean_size, event.pageY + clean_size, 3, "black", false)
			return
		}

		if(!clean && !new_clean){
			$("#" + element_counter).remove()
			new_clean = true
			return
		}

		if(first_click || fill || clean)
			return

		endX = event.pageX;
		endY = event.pageY;

		if(shape == "line" && new_line){
			draw(element_counter, shape, posX, posY, endX, endY, border_size, border_color, true)

			posX = endX
			posY = endY

			element_counter++
			new_line = false
		}
		else
			draw(element_counter, shape, posX, posY, endX, endY, border_size, border_color, false)

		if(shape == "line"){
			if(Math.sqrt(Math.pow(posX - endX, 2) + Math.pow(posY - endY, 2)) > 5)
				new_line = true
		}
	});

	$('#paint').mouseup(function(event){
		if(fill || clean)
			return

		endX = event.pageX;
		endY = event.pageY;
		new_line = false
		first_click = true

		draw(element_counter, shape, posX, posY, endX, endY, border_size, border_color, false)
		element_counter++;
	});
});

function changeFunction(id){
	switch(id){
		case "line":
			shape = id
			fill=false
			save=false
			clean=false
			break
		case "straight-line":
			shape = id
			fill=false
			save=false
			clean=false
			break
		case "rectangle":
			shape = id
			fill=false
			save=false
			clean=false
			break
		case "oval":
			shape = id
			fill=false
			save=false
			clean=false
			break
		case "border-size":
			border_size = $("#border-size-val").val()
			fill=false
			save=false
			clean=false
			break
		case "color":
			border_color = $("#color-val").val()
			background_color = $("#color-val").val()
			fill=false
			save=false
			clean=false
			break
		case "fill":
			fill = true
			clean=false
			save=false
			break
		case "erase":
			clean = true
			fill=false
			save=false
			break
		case "save":
			save = true
			fill=false
			clean=false
			break
	}
}

function getPositions(element) {
	var posTop = element.offset().top;
	var posLeft = element.offset().left;
	var width = element.width();
	var height = element.height();

	return [ [ posLeft, posLeft + width ], [ posTop, posTop + height ] ];
}
        
function comparePositions(p1, p2) {
	var x1 = p1[0] < p2[0] ? p1 : p2;
	var x2 = p1[0] < p2[0] ? p2 : p1;
	return x1[1] > x2[0] || x1[0] === x2[0] ? true : false;
}

function checkCollisions(element, element2){
	var pos = getPositions(element);
	var pos2 = getPositions(element2);

	var horizontalMatch = comparePositions(pos[0], pos2[0]);
	var verticalMatch = comparePositions(pos[1], pos2[1]);  

	var match = horizontalMatch && verticalMatch;

	return match
}

function draw_rectangle(element_num, posX, posY, endX, endY, border_size, border_color, new_element){
	if(posX > endX){
		tempX = posX
		posX = endX
		endX = tempX
	}

	if(posY > endY){
		tempY = posY
		posY = endY
		endY = tempY
	}

	if(!new_element){
		$('#' + element_num).css({
			"width": Math.abs(posX - endX), 
			"height": Math.abs(posY - endY),
			"top": posY, 
			"left": posX
		});
	}else{
		$('#paint').append("<div id='" + element_num + "'></div>");

		$('#' + element_num).css({
			"width": Math.abs(posX - endX), 
			"height": Math.abs(posY - endY), 
			"border-style": "solid",
			"border-color": border_color, 
			"border-width": border_size + "px",
			"position": "absolute", 
			"z-index": element_num,
			"top": posY, 
			"left": posX
		});
	}
}

function draw_oval(element_num, posX, posY, endX, endY, border_size, border_color, new_element){
	if(posX > endX){
		tempX = posX
		posX = endX
		endX = tempX
	}

	if(posY > endY){
		tempY = posY
		posY = endY
		endY = tempY
	}

	if(!new_element){
		$('#' + element_num).css({
			"width": Math.abs(posX - endX), 
			"height": Math.abs(posY - endY),
			"top": posY, 
			"left": posX
		});
	}else{
		$('#paint').append("<div id='" + element_num + "'></div>");

		$('#' + element_num).css({
			"width": Math.abs(posX - endX), 
			"height": Math.abs(posY - endY), 
			"border-style": "solid",
			"border-color": border_color, 
			"border-width": border_size + "px",
			"position": "absolute", 
			"top": posY, 
			"left": posX,
			"z-index": element_num,
 			"border-radius": "100%"
		});
	}
}

function draw_line(element_num, posX, posY, endX, endY, border_size, border_color, new_element){
	dy = posY - endY
	dx = posX - endX
	theta = Math.atan2(dy, dx)
	theta *= 180/Math.PI
	theta += 180

	length = Math.sqrt(Math.pow(posX - endX, 2) + Math.pow(posY - endY, 2))

	if(!new_element){
		$('#' + element_num).css({
			"width": length, 
			"top": posY, 
			"left": posX
		});

		$('#' + element_num).rotate(theta);
	}else{
		$('#paint').append("<div id='" + element_num + "'></div>");

		$('#' + element_num).css({
			"width": length,  
			"border-style": "solid",
			"border-color": border_color, 
			"border-width": border_size + "px",
			"position": "absolute", 
			"top": posY, 
			"left": posX,
			"z-index": element_num,
			'transform-origin': posX + "px," + posY + "px"
		});

		$('#' + element_num).rotate(theta);
		$('#' + element_num).transformOrigin();
	}
}

jQuery.fn.rotate = function(degrees) {
    $(this).css({'-webkit-transform' : 'rotate('+ degrees +'deg)',
                 '-moz-transform' : 'rotate('+ degrees +'deg)',
                 '-ms-transform' : 'rotate('+ degrees +'deg)',
                 'transform' : 'rotate('+ degrees +'deg)'});

    return $(this);
};

jQuery.fn.transformOrigin = function() {
    $(this).css({'-webkit-transform-origin': "0 0",
    			 '-moz-transform-origin': "0 0",
    			 '-ms-transform-origin': "0 0",
    			 'transform-origin': "0 0"});
    
    return $(this);
};

function draw(element_num, shape, posX, posY, endX, endY, border_size, border_color, new_element){
	shape_functions[shape](element_num, posX, posY, endX, endY, border_size, border_color, new_element)
}
