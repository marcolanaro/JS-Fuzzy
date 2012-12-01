function presentation() {
	var html = '<table border="0">';
	for (var i=0;i<obj.inferences.length;i+=1)
		for (var j=0;j<obj.inferences[i].length;j+=1)
			html+='<tr><td><b>If</b> ['+obj.variables_input[i].name+'].'+obj.variables_input[i].setsName[j]+'</td><td><b>Then</b></td><td>'+obj.variable_output.setsName[obj.inferences[i][j]]+'</td></tr>';
	html += '</table>';
	document.getElementById('inferences').innerHTML = html;

	var html = '';
	for (var i=obj.variables_input.length-1;i>=0;i-=1)
		html+=obj.variables_input[i].name+': <input type="text" value="'+obj.crisp_input[i]+'" onChange="obj.crisp_input['+i+']=parseFloat(this.value);"><br>';
	document.getElementById('input').innerHTML = html;
	rap();
}

var paper = [];

function rap() {
	for (var i=0;i<obj.variables_input.length;i+=1) {
		var v = obj.variables_input[i];
		document.getElementById("variables_input").innerHTML += "<div id='variable_"+i+"'>"+v.name+"<table><tr><td id='variable_"+i+"_rap'></td><td id='variable_"+i+"_info'></td></div>";
		draw_variable(v, i);

	}
	var i = 1000;
	document.getElementById("variable_output").innerHTML += "<div id='variable_"+i+"'>"+obj.variable_output.name+"<table><tr><td id='variable_"+i+"_rap'></td><td id='variable_"+i+"_info'></td></div>";
	draw_variable(obj.variable_output, i);

}

function draw_variable(v, i) {
	var colors = ["#f00","#0f0","#00f","#f0f","#0ff","#ff0","#999"];
	paper[i] = Raphael(document.getElementById("variable_"+i+"_rap"), 400, 200);
	paper[i].path("M0 200L400 200");
	var min = v.sets[0][0];
	var max = v.sets[v.sets.length-1][v.sets[v.sets.length-1].length-1];
	for (var j=0;j<v.sets.length;j+=1) {
		document.getElementById("variable_"+i+"_info").innerHTML +=v.setsName[j]+": "+v.sets[j]+"<br>";
		draw_function(v.sets[j], i, 400 / (max - min), colors[j]);
	}

}

function draw_function(s, i, ratio, color) {
	draw_path(s, i, ratio, color).attr({"stroke": color,"stroke-width": 2});
	draw_path(s, i, ratio, color).attr({fill: color,opacity: .3});
}

function draw_path(s, i, ratio, color) {
	return paper[i].path("M"+parseInt(ratio*s[0])+" 200L"+parseInt(ratio*s[1])+" 0L"+parseInt(ratio*s[2])+" 0L"+parseInt(ratio*s[3])+" 200");
}