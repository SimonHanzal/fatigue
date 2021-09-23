/* METADATA */
	var timeline = [];

	/* var no_trials = 13;*/
	var no_trials = 1;
/* WELCOME */
    
/* INSTRUCTIONS */
/* 	timeline.push({
		type: 'fullscreen',
		fullscreen_mode: true,
		message: 	'<img src="https://simonhanzal.github.io/fatigue/blank.bmp">' +
					'<p> The experiment will now switch to full screen mode, please press the button below:</p>',
		post_trial_gap: 100
	});*/

	var instructions = {
      type: "html-keyboard-response",
      stimulus: '<img src="https://simonhanzal.github.io/fatigue/instructions1.bmp">',
      post_trial_gap: 2000,
	  css_classes: ['gap-stimulus']
    };
    
	timeline.push(instructions);

/* TRIALS */
	
	var test_stimuli = [
		{ stimulus: '<p style="font-size:64px;"></p><br><br><br><p style="font-size:64px;"> 0</p>', data: { test_part: 'test', correct_response: 'Space'} },
		{ stimulus: '<p style="font-size:64px;"></p><br><br><br><p style="font-size:64px;"> 1</p>', data: { test_part: 'test', correct_response: 'Space'} },
		{ stimulus: '<p style="font-size:64px;"></p><br><br><br><p style="font-size:64px;"> 2</p>', data: { test_part: 'test', correct_response: 'Space'} },
		{ stimulus: '<p style="font-size:64px;"></p><br><br><br><p style="font-size:64px;"> 3</p>', data: { test_part: 'test', correct_response: 'None'}  },
		{ stimulus: '<p style="font-size:64px;"></p><br><br><br><p style="font-size:64px;"> 4</p>', data: { test_part: 'test', correct_response: 'Space'} },
		{ stimulus: '<p style="font-size:64px;"></p><br><br><br><p style="font-size:64px;"> 5</p>', data: { test_part: 'test', correct_response: 'Space'} },
		{ stimulus: '<p style="font-size:64px;"></p><br><br><br><p style="font-size:64px;"> 6</p>', data: { test_part: 'test', correct_response: 'None'}  },
		{ stimulus: '<p style="font-size:64px;"></p><br><br><br><p style="font-size:64px;"> 7</p>', data: { test_part: 'test', correct_response: 'Space'} },
		{ stimulus: '<p style="font-size:64px;"></p><br><br><br><p style="font-size:64px;"> 8</p>', data: { test_part: 'test', correct_response: 'Space'} },
		{ stimulus: '<p style="font-size:64px;"></p><br><br><br><p style="font-size:64px;"> 9</p>', data: { test_part: 'test', correct_response: 'Space'} }
    ];

    var fixation = {
	 type: 'html-keyboard-response',
	 stimulus: '<p></p>',
	 choices: jsPsych.NO_KEYS,
	 trial_duration: function() {
	    return jsPsych.randomization.sampleWithoutReplacement([1, 334, 667, 1001], 1)[0];
	  },
	 data: {test_part: 'fixation' } }
    
    var test = {
      type: "html-keyboard-response",
      stimulus: jsPsych.timelineVariable('stimulus'),
      choices: ['f1','Space'],
      stimulus_duration: 250,
      trial_duration: 2749,
      response_ends_trial: false,
      data: jsPsych.timelineVariable('data'),
	  on_finish: function(data){
		data.correct = data.key_press == jsPsych.pluginAPI.convertKeyCharacterToKeyCode(data.correct_response);
		data.three = data.stimulus == '<p style="font-size:64px;"></p><br><br><br><p style="font-size:64px;"> 3</p>' || data.stimulus == '<p style="font-size:64px;"></p><br><br><br><p style="font-size:64px;"> 6</p>';
		if(data.correct == true){
			data.type = 1;
		} else {
			data.type = 0;
			};
		if(data.stimulus == '<p style="font-size:64px;"></p><br><br><br><p style="font-size:64px;"> 3</p>' || data.stimulus == '<p style="font-size:64px;"></p><br><br><br><p style="font-size:64px;"> 6</p>'){
			data.go = 3;
		} else {
			data.go = 2;
			}
	}
    }

    var test_procedure = {
      timeline: [fixation, test],
      timeline_variables: test_stimuli,
      repetitions: no_trials,
	  randomize_order: true
    }
	timeline.push(test_procedure);
	
	var debrief_block = {
	    type: "html-keyboard-response",
	    stimulus: function() {
			
		/* BASIC NUMBER CALCULATIONS */
		
		var trials = jsPsych.data.get().filter({test_part: 'test'});
		var correct_trials = trials.filter({correct: true});
		var correct_relevant = correct_trials.filter({three: true});
		var go_trials = trials.filter({three: false});
		var correct_go_trials = correct_trials.filter({three: false});

		var correct_no_go_p = correct_relevant.count();
		var incorrect_no_go_p = no_trials * 2 - correct_relevant.count();
		var correct_go_p = correct_trials.count() - correct_no_go_p;
		var incorrect_go_p = no_trials * 8 - correct_go_p;

		/* ANALYTIC CALCULATIONS */
		
		var accuracy_p = Math.round(correct_trials.count() / trials.count() * 10000) / 100;
		var accuracy_go = Math.round(correct_go_p / (correct_go_p + incorrect_go_p) * 10000) / 100;
		var accuracy_nogo = Math.round(correct_no_go_p / (correct_no_go_p + incorrect_no_go_p) * 10000) / 100;
		
		var minimum_p = Math.round(correct_go_trials.select('rt').min());
		var maximum_p = Math.round(correct_go_trials.select('rt').max());
		
		function roundme(value) {
		return Math.round(value);
		}
		
		var trial_data1 = Object.entries(correct_go_trials.select('rt'));
		var trial_data2 = trial_data1.slice(0,1).toString();
		var trial_data3 = trial_data2.split(",");
		var trial_data4 = trial_data3.slice(1);
		var trial_data5 = trial_data4.map(roundme);
		var trial_data_p = trial_data5.join(";");
		
		var trial_value1 = Object.entries(trials.select('type'));
		var trial_value2 = trial_value1.slice(0,1).toString();
		var trial_value3 = trial_value2.split(",");
		var trial_value4 = trial_value3.slice(1);
		var trial_value_p = trial_value4.join(";");
		
		var trial_go1 = Object.entries(trials.select('go'));
		var trial_go2 = trial_go1.slice(0,1).toString();
		var trial_go3 = trial_go2.split(",");
		var trial_go4 = trial_go3.slice(1);
		var trial_go_p = trial_go4.join(";");
		
		var true_rt_p = Math.round(correct_go_trials.select('rt').mean()*100)/100;

		function fc(value) {
		const mean = true_rt_p
		return Math.pow((value - true_rt_p), 2);
		}
		
		
		var sd1 = trial_data4.map(fc);
		var sd2 = sd1.reduce((a,b) => a + b, 0);
		var sd3 = sd2/sd1.length;
		var sd4 = Math.sqrt(sd3);
		var deviation_p = Math.round(sd4*100)/100;
			
			return  '<img src="https://simonhanzal.github.io/fatigue/blank.bmp">' +
					'<div style = "font-size:19px;">Great job! Take a short break.</div>' +
					'<div style = "font-size:19px;">When ready, press any key to continue.</div>';
		}
	};
		timeline.push(debrief_block);
	
	  /* timeline.push({
		type: 'fullscreen',
		fullscreen_mode: false
	  });   */
	

