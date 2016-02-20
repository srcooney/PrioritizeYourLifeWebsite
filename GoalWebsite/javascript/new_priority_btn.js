$(document).ready(function(){
	$.ajax({url: "/SaveOwner", success: function(result){
//		alert("saved!");
	}});
});

//$(document).on("click","#logout_btn",function(e){
//	$.ajax({url: "/LogoutButton", success: function(result){
//	}});
//});

$(document).on("touchstart click",".delete_item",function(e){
	var item_to_delete = $(this).parent();
	
	var type = "";
	if($(item_to_delete).hasClass("priority")){type = "priority";}
	else if($(item_to_delete).hasClass("goal")){type = "goal";}
	else if($(item_to_delete).hasClass("milestone")){type = "milestone";}
	else if($(item_to_delete).hasClass("update")){type = "update";}
	$.ajax({url: "/DeleteAny",data: {type: type, title: $(item_to_delete).text()}, success: function(result){
	}});
	
	//removes the list group next to the item
	if(!$(item_to_delete).hasClass("update")){
		$(item_to_delete).next().remove();
	};
	$(item_to_delete).remove();
	
	//stops event propagation to parent element
	if (!e) var e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
});

$(document).ready(function() {
	$.ajax({url: "/GetSavedOwner", success: function(result){
		ownerJson = JSON.parse(result);
		for (i=0;i < ownerJson.owner.priorities.length;i+=1) {
			var priority = document.createElement( "li" );
//			$(priority).css('background-color','#98b1cd');
			priority.className = "list-group-item priority";
			priority.innerHTML = '<span class="pull-left glyphicon glyphicon-star add_priority_input" aria-hidden="true"></span>' 
				+ '<span class="pull-left glyphicon glyphicon-remove delete_item" aria-hidden="true"></span>'
				+ ownerJson.owner.priorities[i].title ;
			
			var goals = "";
			for (j=0;j < ownerJson.owner.priorities[i].goals.length;j+=1) {
				var checked = "";
				if(ownerJson.owner.priorities[i].goals[j].completed == true){checked = "checked"};
				goals += '<li class="list-group-item goal '+checked+'" >'+'<span class="pull-left glyphicon glyphicon-star add_goal_input" aria-hidden="true"></span>'
				+ '<span class="pull-left glyphicon glyphicon-remove delete_item" aria-hidden="true"></span>'+ownerJson.owner.priorities[i].goals[j].title+
						'<input type="checkbox" class="pull-right goal_checkbox "'+checked+'></li><div class="list-group-item" style="padding:0; display:none;">'+
						'<ul data-priority="'+ownerJson.owner.priorities[i].title+'" data-goal="'+ownerJson.owner.priorities[i].goals[j].title+'"class="milestone_list">';
				var milestones = ""
				for (k=0;k < ownerJson.owner.priorities[i].goals[j].milestones.length;k+=1) {
					var checked = "";
					if(ownerJson.owner.priorities[i].goals[j].milestones[k].completed == true){checked = "checked"};
					milestones += '<li class="list-group-item milestone '+checked+'">'+'<span class="pull-left glyphicon glyphicon-star add_milestone_input" aria-hidden="true"></span>'
					+ '<span class="pull-left glyphicon glyphicon-remove delete_item" aria-hidden="true"></span>'+ownerJson.owner.priorities[i].goals[j].milestones[k].title+
						'<input type="checkbox" class="pull-right  milestone_checkbox "'+checked+'></li><div class="list-group-item" style="padding:0; display:none;"><ul data-priority="'+ownerJson.owner.priorities[i].title+'" data-goal="'+ownerJson.owner.priorities[i].goals[j].title+'" data-milestone="'+ownerJson.owner.priorities[i].goals[j].milestones[k].title+'"class="update_list">';
					var updates = ""
					for (l=0;l < ownerJson.owner.priorities[i].goals[j].milestones[k].updates.length;l+=1) {
						updates +='<li class="list-group-item update">' + '<span class="pull-left glyphicon glyphicon-remove delete_item" aria-hidden="true"></span>'+
						ownerJson.owner.priorities[i].goals[j].milestones[k].updates[l] + '</li>';
					};
					milestones += updates + '</ul></div>';
				};		
				goals += milestones + '</ul></div>';
			};
			var goal_list = '<div class="list-group-item" style="padding:0; display:none;"><ul data-priority="'+ownerJson.owner.priorities[i].title+'"class="goal_list">';
			goal_list +=goals + '</ul></div>';
			$('#priority_list').append(priority);
			$('#priority_list').append(goal_list);
		};
	}});
});

$(document).on("touchstart click",".add_priority_input",function(e){
	var holder_for_input = $(this).parent().next();
	if($(holder_for_input).children(":first").hasClass("goal_list")){$(holder_for_input).prepend(input_goal);};
	if (!e) var e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
});

$(document).on("touchstart click",".add_goal_input",function(e){
	var holder_for_input = $(this).parent().next();
	if($(holder_for_input).children(":first").hasClass("milestone_list")){$(holder_for_input).prepend(input_milestone);};
	if (!e) var e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
});

$(document).on("touchstart click",".add_milestone_input",function(e){
	var holder_for_input = $(this).parent().next();
	if($(holder_for_input).children(":first").hasClass("update_list")){$(holder_for_input).prepend(input_update);};
	if (!e) var e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
});

$(document).on("touchstart click",".priority",function(){
	$(this).next().toggle();
});
$(document).on("touchstart click",".goal",function(){
	 $(this).next().toggle();
});
$(document).on("touchstart click",".milestone",function(){
	 $(this).next().toggle();
});

$(document).on("click","#add_priority",function(){
	var priority = document.createElement( "li" );
//	$(priority).css('background-color','#98b1cd');
	priority.className = "list-group-item priority";
	priority.innerHTML = '<span class="pull-left glyphicon glyphicon-star add_priority_input" aria-hidden="true"></span>'
		+ '<span class="pull-left glyphicon glyphicon-remove delete_item" aria-hidden="true"></span>'
		+ $('#priority_text').val();
	var goal_list = $('<div class="list-group-item" style="padding:0"><ul data-priority="'+ $('#priority_text').val()+'"class="goal_list"></ul></div>');
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
	goal.innerHTML ='<span class="pull-left glyphicon glyphicon-star add_goal_input" aria-hidden="true"></span>' 
		+ '<span class="pull-left glyphicon glyphicon-remove delete_item" aria-hidden="true"></span>'
		+  $(goal_input).val();
	goal.appendChild(checkbox);
	var priority = $(goal_list).data("priority");
	
	var milestone_list = $('<div class="list-group-item" style="padding:0"><ul data-priority="'+priority+'" data-goal="'+$(goal_input).val()+'" class="milestone_list"></ul></div>');
	$(goal_list).append(goal);
	$(goal_list).append(milestone_list);
	
	
	$.ajax({url: "/SaveAll",data: {type: "goal", priority: priority,goal:$(goal_input).val()}, success: function(result){
//		alert("saved!" + priority);
	}});
	$(goal_input).val('');
	$(this).parent().parent().remove();
});

$(document).on("click","#add_milestone",function(){
	var milestone_list = $(this).parent().parent().next();
	var milestone = document.createElement( "li" );
//	$(milestone).css('background-color','#98b1cd');
	milestone.className = "list-group-item milestone";
	var milestone_input = $(this).parent().prev();
	milestone.innerHTML ='<span class="pull-left glyphicon glyphicon-star add_milestone_input" aria-hidden="true"></span>' 
		+ '<span class="pull-left glyphicon glyphicon-remove delete_item" aria-hidden="true"></span>'
		+  $(milestone_input).val();
	var checkbox = document.createElement( "input" );
	checkbox.type = "checkbox";
	checkbox.className = "pull-right milestone_checkbox"
	milestone.appendChild(checkbox);
	var priority = $(milestone_list).data("priority");
	var goal = $(milestone_list).data("goal");
	var update_list = $('<div class="list-group-item" style="padding:0"><ul data-priority="'+priority+'" data-goal="'+goal+'" data-milestone="'+$(milestone_input).val()+'"class="update_list"></ul></div>');
	$(milestone_list).append(milestone);
	$(milestone_list).append(update_list);
	
	
//	var priority = $(this).parent().parent().parent().parent().parent().prev();
//	var goal = $(this).parent().parent().parent().prev();
	$.ajax({url: "/SaveAll",data: {type: "milestone", priority: priority,
		goal:goal,milestone:$(milestone_input).val()}, success: function(result){
//		alert("saved!");
	}});
	
	$(milestone_input).val('');
	$(this).parent().parent().remove();
});

$(document).on("click","#add_update",function(){
	var update_list = $(this).parent().parent().next();
	var update = document.createElement( "li" );
//	$(update).css('background-color','#98b1cd');
	update.className = "list-group-item update";
	var update_input = $(this).parent().prev();
	update.innerHTML = '<span class="pull-left glyphicon glyphicon-remove delete_item" aria-hidden="true"></span>'+ $(update_input).val();
	$(update_list).append(update);
	var priority = $(update_list).data("priority");
	var goal = $(update_list).data("goal");
	var milestone = $(update_list).data("milestone");
//	var priority = $(this).parent().parent().parent().parent().parent().parent().parent().prev();
//	var goal = $(this).parent().parent().parent().parent().parent().prev();
//	var milestone = $(this).parent().parent().parent().prev();
	$.ajax({url: "/SaveAll",data: {type: "update", priority: priority,
		goal:goal,milestone:milestone,update:$(update_input).val()}, success: function(result){
//		alert("saved!");
	}});
	$(update_input).val('');
	$(this).parent().parent().remove();
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
