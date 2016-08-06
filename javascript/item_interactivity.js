$(document).ready(function(){
	$.ajax({url: "/SaveOwner", success: function(result){}});
});

var  pmgu_type = {PRIORITY:0,GOAL:1,MILESTONE:2,UPDATE:3};

//when clicking on the item the list that is the next element should toggle into view
$(document).on("touchstart click",".priority",function(){$(this).next().toggle();});
$(document).on("touchstart click",".goal",function(){$(this).next().toggle();});
$(document).on("touchstart click",".milestone",function(){$(this).next().toggle();});

//when clicking on the add item button on the item an input element and button is added to the page
$(document).on("touchstart click",".add_priority_input",function(e){add_item_input(this,e,pmgu_type.GOAL);});
$(document).on("touchstart click",".add_goal_input",function(e){add_item_input(this,e,pmgu_type.MILESTONE);});
$(document).on("touchstart click",".add_milestone_input",function(e){add_item_input(this,e,pmgu_type.UPDATE);});

//when the add item button is pressed a new list item is created and added to the list
//the item is also sent to the datastore
$(document).on("click","#add_priority",function(){add_item(this,pmgu_type.PRIORITY);});
$(document).on("click","#add_goal",function(){add_item(this,pmgu_type.GOAL);});
$(document).on("click","#add_milestone",function(){add_item(this,pmgu_type.MILESTONE);});
$(document).on("click","#add_update",function(){add_item(this,pmgu_type.UPDATE);});

//when the check box is checked the state is sent to the datastore
$(document).on("click",".goal_checkbox",function(e){item_checkbox_update(this,e,pmgu_type.GOAL);});
$(document).on("click",".milestone_checkbox",function(e){item_checkbox_update(this,e,pmgu_type.MILESTONE);});

//adds an input field and button below the item that was clicked on 
//the only thing that differs is what type of item is being added
//thus the only change is the placeholder name and id
var add_item_input = function(that,e,pmgu_t){
	var input_placeholder_type;
	if(pmgu_t===pmgu_type.GOAL){input_placeholder_type = "Goal"}
	else if(pmgu_t===pmgu_type.MILESTONE){input_placeholder_type = "Milestone"}
	else if(pmgu_t===pmgu_type.UPDATE){input_placeholder_type = "Update"}
	var input_item = ' <div class="input-group">\
		<input type="text" class="form-control" placeholder="Add a '+input_placeholder_type+'" aria-describedby="sizing-addon2">\
		<span class="input-group-btn" id="sizing-addon2"><button id="add_'+input_placeholder_type.toLowerCase()+'" class="btn btn-default">+</button></span></div>\
		'
	var holder_for_input = $(that).parent().next();
	$(holder_for_input).css("display","block");
	//makes sure only one input is added
	if($(holder_for_input).children(":first").hasClass(input_placeholder_type.toLowerCase()+"_list")){$(holder_for_input).prepend(input_item);};
	e.stopPropagation();
};

//when the checkbox is clicked send state to the datastore
var item_checkbox_update = function(that,e,pmgu_t){
	var item_list = $(that).parent().next().children().first();
	var priority  = $(item_list).data("priority");
	var goal      = $(item_list).data("goal");
	var milestone = "NA"
    var type ="goal_checkbox";
    if(pmgu_t === pmgu_type.MILESTONE){milestone = $(item_list).data("milestone");type="milestone_checkbox"};
	var item = $(that).parent();
	if(that.checked){$(item).addClass("checked");}
	else{$(item).removeClass("checked");};
	
	$.ajax({url: "/SaveAll",data: {type: type, priority: priority,goal:goal,milestone:milestone,checkbox : that.checked}, 
		success: function(result){}});
	e.stopPropagation();
};

//deletes the item that the delete button belongs to
$(document).on("touchstart click",".delete_item",function(e){
	var item_to_delete = $(this).parent();
	var type;
	if($(item_to_delete).hasClass("priority")){type = "priority";}
	else if($(item_to_delete).hasClass("goal")){type = "goal";}
	else if($(item_to_delete).hasClass("milestone")){type = "milestone";}
	else if($(item_to_delete).hasClass("update")){type = "update";}
	$.ajax({url: "/DeleteAny",data: {type: type, title: $(item_to_delete).text()}, success: function(result){}});
	
	//removes the list group next to the item
	if(!$(item_to_delete).hasClass("update")){
		$(item_to_delete).next().remove();
	};
	$(item_to_delete).remove();
	//stops event propagation to parent element
    e.stopPropagation();
});

//when the page is loaded the datastore is queried and any items that it contains are displayed
$(document).ready(function() {
	$.ajax({url: "/GetSavedOwner", success: function(result){
		ownerJson = JSON.parse(result);
		for (i=0;i < ownerJson.owner.priorities.length;i+=1) {
			var priority = document.createElement( "li" );
			priority.className = "list-group-item priority";
			priority.innerHTML = '<span class="pull-left glyphicon glyphicon-plus add_priority_input" aria-hidden="true"></span>' 
				+ '<span class="pull-left glyphicon glyphicon-trash delete_item" aria-hidden="true"></span>'
				+ ownerJson.owner.priorities[i].title ;
			
			var goals = "";
			for (j=0;j < ownerJson.owner.priorities[i].goals.length;j+=1) {
				var checked = "";
				if(ownerJson.owner.priorities[i].goals[j].completed == true){checked = "checked"};
				goals += '<li class="list-group-item goal '+checked+'" >'+'<span class="pull-left glyphicon glyphicon-plus add_goal_input" aria-hidden="true"></span>'
				+ '<span class="pull-left glyphicon glyphicon-trash delete_item" aria-hidden="true"></span>'+ownerJson.owner.priorities[i].goals[j].title+
						'<input type="checkbox" class="pull-right goal_checkbox "'+checked+'></li><div class="list-group-item" style="padding:0; display:none;">'+
						'<ul data-priority="'+ownerJson.owner.priorities[i].title+'" data-goal="'+ownerJson.owner.priorities[i].goals[j].title+'"class="milestone_list">';
				var milestones = ""
				for (k=0;k < ownerJson.owner.priorities[i].goals[j].milestones.length;k+=1) {
					var checked = "";
					if(ownerJson.owner.priorities[i].goals[j].milestones[k].completed == true){checked = "checked"};
					milestones += '<li class="list-group-item milestone '+checked+'">'+'<span class="pull-left glyphicon glyphicon-plus add_milestone_input" aria-hidden="true"></span>'
					+ '<span class="pull-left glyphicon glyphicon-trash delete_item" aria-hidden="true"></span>'+ownerJson.owner.priorities[i].goals[j].milestones[k].title+
						'<input type="checkbox" class="pull-right  milestone_checkbox "'+checked+'></li><div class="list-group-item" style="padding:0; display:none;"><ul data-priority="'+ownerJson.owner.priorities[i].title+'" data-goal="'+ownerJson.owner.priorities[i].goals[j].title+'" data-milestone="'+ownerJson.owner.priorities[i].goals[j].milestones[k].title+'"class="update_list">';
					var updates = ""
					for (l=0;l < ownerJson.owner.priorities[i].goals[j].milestones[k].updates.length;l+=1) {
						updates +='<li class="list-group-item update">' + '<span class="pull-left glyphicon glyphicon-trash delete_item" aria-hidden="true"></span>'+
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

//checks for no duplicates and no blank inputs
var input_invalid = function(item_input,item_list,pmgu_t){
	var str = $(item_input).attr('placeholder');
	if(str.indexOf("(") != -1){
		$(item_input).css('background-color','white');
		$(item_input).attr('placeholder',str.substring(0,str.indexOf(" (")));
	};
	if($(item_input).val() === ""){
		$(item_input).animate({backgroundColor: '#FF0000'}, 500);
		$(item_input).animate({backgroundColor: '#FFFFFF'}, 500);
		$(item_input).attr('placeholder',$(item_input).attr('placeholder')+" (Please Type Something!)");
	    return true;
	};
	if(pmgu_t!=pmgu_type.UPDATE){
		for(var i=0;i< $(item_list).children().length;i+=1){
			if(i%2===0){
				if($(item_list).children().eq(i).text() === $(item_input).val()){
					$(item_input).animate({backgroundColor: '#FF0000'}, 500);
					$(item_input).animate({backgroundColor: '#FFFFFF'}, 500);
					$(item_input).val('');
					$(item_input).attr('placeholder',$(item_input).attr('placeholder')+" (No Duplicates Please!)");
					return true;
				};
			};
		};
	};
	return false;
};
//adds a list element to the list under the item and sends that list item to the datastore to be saved
var add_item = function(that,pmgu_t){
	var item_list;
	var item_input;
	if(pmgu_t===pmgu_type.PRIORITY){
		item_list=$('#priority_list');
		item_input = $('#priority_text');
	}
	else{
		item_list = $(that).parent().parent().next();
		item_input = $(that).parent().prev();
	};
	if(input_invalid(item_input,item_list,pmgu_t)){return;};

	var item = document.createElement( "li" );
	var item_class;
	var item_sub_class;
	var inner_html;
	var priority  = "NA";
	var goal      = "NA";
	var milestone = "NA";
	var update    = "NA";
	if(pmgu_t===pmgu_type.PRIORITY){
		item_class = "priority";
		item_sub_class = "goal";
		inner_html = '<span class="pull-left glyphicon glyphicon-plus add_priority_input" aria-hidden="true"></span>' 
			+ '<span class="pull-left glyphicon glyphicon-trash delete_item" aria-hidden="true"></span>'
			+  $(item_input).val(); 
		priority = $(item_input).val();
	}
	else if(pmgu_t===pmgu_type.GOAL){
		item_class = "goal";
		item_sub_class = "milestone";
		inner_html = '<span class="pull-left glyphicon glyphicon-plus add_goal_input" aria-hidden="true"></span>' 
			+ '<span class="pull-left glyphicon glyphicon-trash delete_item" aria-hidden="true"></span>'
			+  $(item_input).val();
		priority  = $(item_list).data("priority");
		goal      = $(item_input).val();
	}
	else if(pmgu_t===pmgu_type.MILESTONE){
		item_class = "milestone";
		item_sub_class = "update";
		inner_html = '<span class="pull-left glyphicon glyphicon-plus add_milestone_input" aria-hidden="true"></span>' 
			+ '<span class="pull-left glyphicon glyphicon-trash delete_item" aria-hidden="true"></span>'
			+  $(item_input).val();
		priority  = $(item_list).data("priority");
		goal      = $(item_list).data("goal");
		milestone = $(item_input).val();
		
	}
	else if(pmgu_t===pmgu_type.UPDATE){
		item_class = "update";
		inner_html = '<span class="pull-left glyphicon glyphicon-trash delete_item" aria-hidden="true"></span>'
			+  $(item_input).val();
		priority  = $(item_list).data("priority");
		goal      = $(item_list).data("goal");
		milestone = $(item_list).data("milestone");
		update    = $(item_input).val();
	};
	item.className = "list-group-item " + item_class;
	item.innerHTML = inner_html;
	
	$(item_list).append(item);
	if(pmgu_t === pmgu_type.MILESTONE || pmgu_t === pmgu_type.GOAL){
		var checkbox = document.createElement( "input" );
		checkbox.type = "checkbox";
		checkbox.className = "pull-right "+item_class+"_checkbox"
	    item.appendChild(checkbox);
	};
	if(pmgu_t != pmgu_type.UPDATE){
		var sub_item_list = $('<div class="list-group-item" style="padding:0"><ul data-priority="'+priority+'" data-goal="'+goal+'" data-milestone="'+milestone+'"class='+item_sub_class+'_list></ul></div>');
		$(item_list).append(sub_item_list);
	};
	
	$.ajax({url: "/SaveAll",data: {type: item_class, priority:priority,
		goal:goal,milestone:milestone,update:update}, success: function(result){
	}});
	$(item_input).val('');
	if(pmgu_t != pmgu_type.PRIORITY){$(that).parent().parent().remove();};
};