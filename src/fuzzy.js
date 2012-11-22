var FL = (function(){

	var C = function() {
		this.functions = [
			{name: "and", f: Math.min},
			{name: "or", f: Math.max}
		];
	};

	C.prototype={
		getResult: function(options) {
			var variables = this.construct(options.variables_input);
			var fuzzy_input = this.fuzzification(options.crisp_input, variables);
			var output_combination = this.output_combination(fuzzy_input, options.inferences, options.variable_output);
			var fuzzy_output = this.rootSumSquareSet(output_combination);
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
				if (ob[i].firstPoint === 1)
					ob[i].centre = f[i][0];
				else {
					if (ob[i].lastPoint === 1)
						ob[i].centre = f[i][3];
					else {
						ob[i].centre = (f[i][3]+f[i][0]) / 2;
					}
				}
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
			for (var i=inferences.length-1;i>=0;i-=1) {
				var inf = inferences[i];
				var f = this.searchFunc(inf.func);
				a[inf.then].push(f(valori[inf.one.variable][inf.one.set], valori[inf.two.variable][inf.two.set])); 
			}
			return a;
		},
		searchFunc: function(f) {
			for (var i = this.functions.length-1; i>=0; i-= 1) 
				if (this.functions[i].name === f)
					return this.functions[i].f;
		},
		defuzzification: function(outputSet, variable) {
			var num = 0;
			var den = 0;
			for (var i=outputSet.length-1;i>=0;i-=1) {
				num += outputSet[i] * variable[i].centre;
				den += outputSet[i];
			}
			return num / den;
		},
		rootSumSquareSet: function(set) {
			var output = [];
			for (var i=set.length-1;i>=0;i-=1)
				output[i] = this.rootSumSquare(set[i]);
			return output;
		},
		rootSumSquare: function(arr) {
			var sum = 0;
			for (var j=arr.length-1;j>=0;j-=1)
				sum += arr[j] * arr[j];
			return Math.sqrt(sum);
		}
	};

	return C;

}());