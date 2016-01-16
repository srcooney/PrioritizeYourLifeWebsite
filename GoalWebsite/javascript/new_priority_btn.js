$(document).ready(function(){
	$.ajax({url: "/SaveOwner", success: function(result){
//		alert("saved!");
	}});
});
$(document).dblclick(function(e) {
//	alert($(e.target).attr("class"));
	var type = "";
	if($(e.target).hasClass("priority")){type = "priority";}
	else if($(e.target).hasClass("goal")){type = "goal";}
	else if($(e.target).hasClass("milestone")){type = "milestone";}
	else if($(e.target).hasClass("update")){type = "update";}
	$.ajax({url: "/DeleteAny",data: {type: type, title: $(e.target).text()}, success: function(result){
//		alert("saved!");
	}});
	if(!$(e.target).hasClass("update")){
		$(e.target).next().remove();
	};
	$(e.target).remove();
//	alert('Right mouse button!');
	});

$(document).ready(function() {
	$.ajax({url: "/GetSavedOwner", success: function(result){
		ownerJson = JSON.parse(result);
		for (i=0;i < ownerJson.owner.priorities.length;i+=1) {
			var priority = document.createElement( "li" );
//			$(priority).css('background-color','#98b1cd');
			priority.className = "list-group-item priority";
			priority.innerHTML = ownerJson.owner.priorities[i].title;
			
			var goals = "";
			for (j=0;j < ownerJson.owner.priorities[i].goals.length;j+=1) {
				var checked = "";
				if(ownerJson.owner.priorities[i].goals[j].completed == true){checked = "checked"};
				goals += '<li class="list-group-item goal '+checked+'" >'+ownerJson.owner.priorities[i].goals[j].title+
						'<input type="checkbox" class="pull-right goal_checkbox "'+checked+'></li><div class="list-group-item" style="padding:0">'+input_milestone+
						'<ul class="milestone_list">';
				var milestones = ""
				for (k=0;k < ownerJson.owner.priorities[i].goals[j].milestones.length;k+=1) {
					var checked = "";
					if(ownerJson.owner.priorities[i].goals[j].milestones[k].completed == true){checked = "checked"};
					milestones += '<li class="list-group-item milestone '+checked+'">'+ownerJson.owner.priorities[i].goals[j].milestones[k].title+
						'<input type="checkbox" class="pull-right  milestone_checkbox "'+checked+'></li><div class="list-group-item" style="padding:0">'+input_update+'<ul class="update_list">';
					var updates = ""
					for (l=0;l < ownerJson.owner.priorities[i].goals[j].milestones[k].updates.length;l+=1) {
						updates +='<li class="list-group-item update">' +
						ownerJson.owner.priorities[i].goals[j].milestones[k].updates[l] + '</li>';
					};
					milestones += updates + '</ul></div>';
				};		
				goals += milestones + '</ul></div>';
			};
			var goal_list = '<div class="list-group-item" style="padding:0">'+input_goal+'<ul class="goal_list">';
			goal_list +=goals + '</ul></div>';
			$('#priority_list').append(priority);
			$('#priority_list').append(goal_list);
		};
	}});
});

$(document).on("click","#add_priority",function(){
	var priority = document.createElement( "li" );
//	$(priority).css('background-color','#98b1cd');
	priority.className = "list-group-item priority";
	priority.innerHTML = $('#priority_text').val();
	var goal_list = $('<div class="list-group-item" style="padding:0">'+input_goal+'<ul class="goal_list"></ul></div>');
	$('#priority_list').append(priority);
	$('#priority_list').append(goal_list);
	
	$.ajax({url: "/SaveAll",data: {type: "priority", priority: $('#priority_text').val()}, success: function(result){
//		alert("saved!");
	}});
	
	$('#priority_text').val('');
});

$(document).on("click","#add_goal",function(){
	var goal_list = $(this).parent().parent().next();
	
	var goal = document.createElement( "li" );
//	$(goal).css('background-color','#98b1cd');
	goal.className = "list-group-item goal";
	var goal_input = $(this).parent().prev();
	var checkbox = document.createElement( "input" );
	checkbox.type = "checkbox";
	checkbox.className = "pull-right goal_checkbox"
	goal.innerHTML = $(goal_input).val();
	goal.appendChild(checkbox);
	var milestone_list = $('<div class="list-group-item" style="padding:0">'+input_milestone+'<ul class="milestone_list"></ul></div>');
	$(goal_list).append(goal);
	$(goal_list).append(milestone_list);
	
	var priority = $(this).parent().parent().parent().prev();
	$.ajax({url: "/SaveAll",data: {type: "goal", priority: $(priority).text(),goal:$(goal_input).val()}, success: function(result){
//		alert("saved!");
	}});
	$(goal_input).val('');
});

$(document).on("click","#add_milestone",function(){
	var milestone_list = $(this).parent().parent().next();
	var milestone = document.createElement( "li" );
//	$(milestone).css('background-color','#98b1cd');
	milestone.className = "list-group-item milestone";
	var milestone_input = $(this).parent().prev();
	milestone.innerHTML = $(milestone_input).val();
	var checkbox = document.createElement( "input" );
	checkbox.type = "checkbox";
	checkbox.className = "pull-right milestone_checkbox"
	milestone.appendChild(checkbox);
	var update_list = $('<div class="list-group-item" style="padding:0">'+input_update+'<ul class="update_list"></ul></div>');
	$(milestone_list).append(milestone);
	$(milestone_list).append(update_list);
	
	
	var priority = $(this).parent().parent().parent().parent().parent().prev();
	var goal = $(this).parent().parent().parent().prev();
	$.ajax({url: "/SaveAll",data: {type: "milestone", priority: $(priority).text(),
		goal:$(goal).text(),milestone:$(milestone_input).val()}, success: function(result){
//		alert("saved!");
	}});
	
	$(milestone_input).val('');
});

$(document).on("click","#add_update",function(){
	var update_list = $(this).parent().parent().next();
	var update = document.createElement( "li" );
//	$(update).css('background-color','#98b1cd');
	update.className = "list-group-item update";
	var update_input = $(this).parent().prev();
	update.innerHTML = $(update_input).val();
	$(update_list).append(update);
	var priority = $(this).parent().parent().parent().parent().parent().parent().parent().prev();
	var goal = $(this).parent().parent().parent().parent().parent().prev();
	var milestone = $(this).parent().parent().parent().prev();
	$.ajax({url: "/SaveAll",data: {type: "update", priority: $(priority).text(),
		goal:$(goal).text(),milestone:$(milestone).text(),update:$(update_input).val()}, success: function(result){
//		alert("saved!");
	}});
	$(update_input).val('');
});

$(document).on("click",".goal_checkbox",function(){
	var priority = $(this).parent().parent().parent().prev();
	var goal = $(this).parent();
	if(this.checked){$(goal).addClass("checked");};
	if(!this.checked){$(goal).removeClass("checked");};

//	alert(this.checked);
	$.ajax({url: "/SaveAll",data: {type: "goal_checkbox", priority: $(priority).text(),
		goal:$(goal).text(),goalCheckbox : this.checked}, success: function(result){
//		alert("saved!");
	}});
});

$(document).on("click",".milestone_checkbox",function(){
	var priority = $(this).parent().parent().parent().parent().parent().prev();
	var goal = $(this).parent().parent().parent().prev();
	var milestone = $(this).parent();
	if(this.checked){$(milestone).addClass("checked");};
	if(!this.checked){$(milestone).removeClass("checked");};
//	alert(this.checked);
	$.ajax({url: "/SaveAll",data: {type: "milestone_checkbox", priority: $(priority).text(),
		goal:$(goal).text(),milestone:$(milestone).text(),milestoneCheckbox : this.checked}, success: function(result){
//		alert("saved!");
	}});
});

var input_goal = ' \
<div class="input-group">\
<input type="text" class="form-control" id="goal_text"\
	placeholder="Add a Goal" aria-describedby="sizing-addon2">\
<span class="input-group-btn" id="sizing-addon2"><button\
		class="btn btn-default" id="add_goal">+</button></span></div>\
'
var input_milestone = ' \
	<div class="input-group">\
	<input type="text" class="form-control" id="milestone_text"\
		placeholder="Add a Milestone" aria-describedby="sizing-addon2">\
	<span class="input-group-btn" id="sizing-addon2"><button\
			class="btn btn-default" id="add_milestone">+</button></span></div>\
	'
var input_update = ' \
	<div class="input-group">\
	<input type="text" class="form-control" id="update_text"\
		placeholder="Add a Update" aria-describedby="sizing-addon2">\
	<span class="input-group-btn" id="sizing-addon2"><button\
			class="btn btn-default" id="add_update">+</button></span></div>\
	'
