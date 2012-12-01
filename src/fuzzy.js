var FuzzyLogic = (function(){

	var C = function() {
	};

	C.prototype={
		getResult: function(options) {
			var variables = this.construct(options.variables_input);
			var fuzzy_input = this.fuzzification(options.crisp_input, variables);
			var output_combination = this.output_combination(fuzzy_input, options.inferences, options.variable_output);
			var fuzzy_output = this.takeMaxofArraySet(output_combination);
			var crisp_output = this.defuzzification(fuzzy_output, this.construct_variable(options.variable_output.sets));
			return crisp_output;
		},
		construct: function(variables) {
			var ob = [];
			for (var i=variables.length-1;i>=0;i-=1)
				ob[i] = this.construct_variable(variables[i].sets);
			return ob;
		},
		construct_variable: function(f) {
			var ob = [];
			for (var i=f.length-1;i>=0;i-=1) {
				ob[i] = {
					a: f[i],
					firstPoint: (f[i][0] === f[i][1])?1:0,
					lastPoint: (f[i][2] === f[i][3])?1:0,
					mUp: (1/(f[i][1]-f[i][0])),
					mDown: (1/(f[i][3]-f[i][2]))
				};
			}
			return ob;
		},
		fuzzification: function(input, variables) {
			var value = [];
			for (var i=variables.length-1;i>=0;i-=1) {
				value[i] = this.fuzzification_variable(input[i], variables[i]);
			}
			return value;
		},
		fuzzification_variable: function(x, sets) {
			var valori = [];
			for (var i=sets.length-1;i>=0;i-=1) {
				valori[i] = this.fuzzification_function(x, sets[i]);
			}
			return valori;
		},
		fuzzification_function: function(x, set) {
			var f = 0;
			if (x <= set.a[0])
				f = set.firstPoint;
			else {
				if (x < set.a[1])
					f = set.mUp * (x - set.a[0]);
				else {
					if (x <= set.a[2])
						f = 1;
					else {
						if (x < set.a[3])
							f = 1 - set.mDown * (x - set.a[2]);
						else {
							if (x >= set.a[3])
								f = set.lastPoint;
						}
					}
				}
			}
			return f;
		},
		output_combination: function(valori, inferences, variable_output) {
			var a = [];
			for (var i=variable_output.sets.length-1;i>=0;i-=1)
				a[i] = [];
			for (var i=inferences.length-1;i>=0;i-=1)
				for (var j=inferences[i].length-1;j>=0;j-=1)
					if (inferences[i][j]>=0)
						a[inferences[i][j]].push(valori[i][j]);
			return a;
		},
		defuzzification: function(outputSet, variable) {
			var num = 0;
			var den = 0;
			for (var i=outputSet.length-1;i>=0;i-=1) {
				var v = variable[i];
				var point = v.a;
				var h = outputSet[i];
				var b = point[3] - point[0];
				var a1 = point[0];
				if (point[0] !== point[1])
					a1 += h / v.mUp;
				var a2 = point[3];
				if (point[2] !== point[3])
					a2 -= h / v.mDown;
				var area = 0;
				if (point[0] !== a1)
					area += (a1 - point[0]) * outputSet[i] / 2;
				if (a1 !== a2)
					area += (a2 - a1) * outputSet[i];
				if (a2 !== point[3])
					area += (point[3] - a2) * outputSet[i] / 2;
				var a = a2 - a1;
				var y_baricentro = (h / 3) * (b + 2*a)/(a + b)
				var amezzi = a1+(a2-a1)/2;
				var bmezzi = point[0]+(point[3]-point[0])/2;
				var mmezzi = 0;
				if (amezzi - bmezzi !== 0)
					mmezzi = h / (amezzi - bmezzi);
				var x_baricentro = bmezzi;
				if (mmezzi !== 0)
					x_baricentro += y_baricentro / mmezzi;
				num += area * x_baricentro;
				den += area;
			}
			if (den === 0)
				return 0;
			else
				return num / den;
		},
		takeMaxofArraySet: function(set) {
			var output = [];
			for (var i=set.length-1;i>=0;i-=1)
				output[i] = this.takeMaxofArray(set[i]);
			return output;
		},
		takeMaxofArray: function(arr) {
			if (arr.length === 1)
				return arr[0];
			else {
				var max;
				for (var j=arr.length-2;j>=0;j-=1)
					max = Math.max(arr[j], arr[j+1]);
				return max;
			}
		}
	};

	return C;

}());