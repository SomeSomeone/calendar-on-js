


function Init(year_correct, month_correct){
	var now = new Date();
		
	var year = now.getFullYear()+year_correct;
	var month = now.getMonth()+month_correct;	
	
	var beginOfMonth=new Date(year,month,1).getDay();
	var endOfMonth=new Date(year,month+1,0).getDate();

	$("#year").append(year+" - "+(month+1));

	var it_now=year_correct==0&&month_correct==0;

	var day = new Date().getDate();
	
	for (var i=1 ; i < beginOfMonth ; i++ ){
		$("#calendar").append('<div class="date_passive"></div>');
	};

	for(var i=1 ; i <= endOfMonth ; i++){
		var count_goals=countGoals(year,month+1,i);
		if (count_goals>0) {
			var count_goals='<span class="badge">'+count_goals+'</span>'
		}
		else{
			var count_goals="";
		}

		if(day==i&&it_now){
			var style=' style="outline: 0.2vmax solid #00AAFF;" ';
		}else{
			var style='';
		}

		$("#calendar").append('<div class="date" id="'+i+'"'+style+'>'+i+count_goals+'</div>');
		
	}
	correctDateSize();
}
function eraseCalendar(){
	$("#year").empty();	
	$(".date").remove();
	$(".date_passive").remove();	
}

function correctDateSize(time){
	if ($(".date").height() != $(".date").outerWidth()) {
		if (time){
			$(".date").animate({
				height:$(".date").outerWidth()
			},time);
		}else{
			$(".date").css({
				height:$(".date").outerWidth()
			},time);
		}
	}
}
function paintGoals(year,month,day){
	$(".goal").remove();
	var delete_button='<div class="delete_goal btn btn-lg btn-danger" style="float:right;">x</div>'
	try{
		goals=getGoals()[year][month][day];
		for (var i in goals ) {
			if(goals[i]["about"]){
				var about='<div class="panel collapse" id="goal_'+i+'">'+goals[i]["about"]+"</div>";
			}
			else{
				var about="";
			}
			$("#goals").append('<div class="goal" id="'+i+'">'+
				'<h2 data-toggle="collapse" data-target="#goal_'+i+'">'+goals[i]["title"]+delete_button+"</h2>"+
				about+'</div>')
					
		};
	}
	catch(e){

	}
}

function countGoals(year,month,day){
	try{
		goals=getGoals()[year][month][day];
		return goals.length;
	}
	catch(e){
		return 0;
	}
}
function postGoals(goals){
	/*
	var goals={"year":{"month":{"day":[{"title":"title test","about":"about test"},{"title":"title test1","about":"about test1"}]}}};
	*/
	localStorage.setItem("calendar", JSON.stringify(goals));

}
function getGoals(){	
	return JSON.parse(localStorage.getItem("calendar"));
}
function newGoal(year,month,day,title,about){
	if (!title || title==""){
		return false;
	}
	var goals=getGoals();
	if(!goals){
		goals={};
	}
	if (!goals[year]){
		goals[year]={};
	}
	if(!goals[year][month]){
		goals[year][month]={};
	}
	if(!goals[year][month][day]){
		goals[year][month][day]=[];
	}
	goals[year][month][day].push({"title":title,"about":about})
	postGoals(goals);
	return  true;
}
function updateGoal(year,month,day,index,title,about){
	if (!title || title==""){
		return false;
	}
	var goals=getGoals();
	if(!goals){
		goals={};
	}
	if (!goals[year]){
		goals[year]={};
	}
	if(!goals[year][month]){
		goals[year][month]={};
	}
	if(!goals[year][month][day]){
		goals[year][month][day]=[];
	}
	goals[year][month][day][index]['title']=title;
	goals[year][month][day][index]['about']=about;
	postGoals(goals);
	return  true;
}


function deleteGoal(year,month,day,id){
		var goals=getGoals();		

		goals[year][month][day].splice(id,1);
		postGoals(goals);
}
$(document).ready(function() { 
	//back
		//in start
		var month=0;
		var year=0;
		var day;//need for goal
		
		Init(year,month);
		$("#months").hide();
		$("#goals").hide();
		correctDateSize();
		
		$(window).resize(function(){
			correctDateSize()
		})


	//front
	$("#back").click(function(){
			if(month<=0-new Date().getMonth()){
				year-=1;
				month=11-new Date().getMonth();
			}
			else{
				month-=1;	
			}
			
			eraseCalendar()
			Init(year,month);
		}
	);
	$("#next").click(function(){
			if(month>=11-new Date().getMonth()){
				year+=1;
				month= - new Date().getMonth();
			}
			else{
				month+=1;	
			}
			
			eraseCalendar()
			Init(year,month);
		}
	);
	$("#year").click(function(){
		$("#months").slideToggle('fast');
	})
	$(".month").click(function(){
		month=$(this).attr("value")-new Date().getMonth();
		eraseCalendar()
		Init(year,month);
	});
	$( "body" ).on( "click", ".date", function() {
		day=$(this).attr("id");

		if($("#all").hasClass("col-md-offset-3")){
			$("#all").toggleClass("col-md-offset-3" ,500).promise().done(function(){;	
				$("#goals").slideToggle('fast')
			});
		}

		$("#year_goal").val(year+new Date().getFullYear());
		$("#month_goal").val(month+new Date().getMonth()+1);
		$("#day_goal").val(day);
		
		$("#date_click").text((year+new Date().getFullYear())+"-"+(month+new Date().getMonth()+1)+"-"+day)
		

		paintGoals(year+new Date().getFullYear(),month+new Date().getMonth()+1,day)
	});

	$( "body" ).on( "dblclick", ".date", function() {
		if(! $("#all").hasClass("col-md-offset-3")){
			$("#goals").slideToggle('fast',function(){
				$("#all").toggleClass("col-md-offset-3",500);
			});
		}
	})
	$("#new_goal").submit(function(){
		
		if(newGoal($("#year_goal").val(),$("#month_goal").val(),$("#day_goal").val(),$("#title_goal").val(),$("#about_goal").val())){
			eraseCalendar();
			Init(year,month);
			$(this).collapse("toggle");
			paintGoals($("#year_goal").val(),$("#month_goal").val(),$("#day_goal").val());
			$("#title_goal").val("");
			$("#about_goal").val("");
		}
		else{
			alert("not valid goal");
		}
	})
	
	$( "body" ).on( "click", ".delete_goal", function() {
		deleteGoal($("#year_goal").val(),$("#month_goal").val(),$("#day_goal").val(),$(this).parent().parent().attr("id"));
		eraseCalendar();
		Init(year,month);
		paintGoals($("#year_goal").val(),$("#month_goal").val(),$("#day_goal").val());

	})

	$( "body" ).on( "dblclick", ".goal:not(.goal_update)", function() {
		if($(".goal_update")[0]){
			$(".goal_update").children("div").stop(true, true).removeClass("in").attr("id","goal_"+$(".goal_update").attr("id"));
			var childrens=$(".goal_update").children();
			console.log($("#year_goal").val());
			var this_goal=getGoals()[$("#year_goal").val()][$("#month_goal").val()][$("#day_goal").val()][$(".goal_update").attr("id")];
			var title=this_goal["title"];
			var about=this_goal["about"];
			
			childrens[0].innerHTML=title+'<div class="delete_goal btn btn-lg btn-danger" style="float:right;">x</div>;'					
			childrens[1].innerHTML=about;					

			$(".goal_update").removeClass("goal_update");
			$("#goal_update").remove();	
		}


		var childrens=$(this).children();
		$(this).children("div").stop().addClass("in").attr("id","");

		
		
		for (var index = childrens.length - 1; index >= 0; index--) {
			var shit = childrens[index].childNodes[0].nodeValue;
			childrens[index].innerHTML='<textarea class="form-control" rows="3" >'+shit+'</textarea>';
		}
		$(this).addClass("goal_update");
		$(this).append('<h2 id="goal_update" class="btn btn-lg btn-default">Update goal</h2>')
	})
	$( "body" ).on( "click", "#goal_update", function(){
		if($(".goal_update")[0]){
			var id=$(".goal_update").attr("id");
			var childrens=$(".goal_update").children();

			var title=childrens[0].childNodes[0].value;
			var about=childrens[1].childNodes[0].value;
			
			$(".goal_update").children("div").stop(true, true).removeClass("in").attr("id","goal_"+id);
			if (updateGoal($("#year_goal").val(),$("#month_goal").val(),$("#day_goal").val(),id,title,about)) {
				childrens[0].innerHTML=title+'<div class="delete_goal btn btn-lg btn-danger" style="float:right;">x</div>;'					
				childrens[1].innerHTML=about;					
			}
			$(".goal_update").removeClass("goal_update");
			$("#goal_update").remove();
		}

	})


})

