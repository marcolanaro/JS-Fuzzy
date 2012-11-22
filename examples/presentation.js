function presentation() {
	var html = '<table border="0">';
	for (var i=obj.inferences.length-1;i>=0;i-=1)
		html+='<tr><td>'+obj.variables_input[obj.inferences[i].one.variable].setsName[obj.inferences[i].one.set]+'</td><td><b>'+obj.inferences[i].func+'</b></td><td>'+obj.variables_input[obj.inferences[i].two.variable].setsName[obj.inferences[i].two.set]+'</td><td><b>then</b></td><td>'+obj.variable_output.setsName[obj.inferences[i].then]+'</td></tr>';
	html += '</table>';
	document.getElementById('inferences').innerHTML = html;

	var html = '';
	for (var i=obj.variables_input.length-1;i>=0;i-=1)
		html+=obj.variables_input[i].name+': <input type="text" value="'+obj.crisp_input[i]+'" onChange="obj.crisp_input['+i+']=this.value;"><br>';
	document.getElementById('input').innerHTML = html;
}