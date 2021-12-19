function countmatches(text) {
	text=strip(text);
	var start = document.getElementById('sval1').innerHTML*1-1;
	
	for (k=1;k<=15;k++) {
		matches=0;
		for (i=0;i<text.length;i++) {
			if (text.charAt(i)==text.charAt((i+k+start)%text.length) && text.charAt(i)!="*")
				matches++;
		}
		document.getElementById('sfreq'+k).innerHTML=matches;
		document.getElementById('spercent'+k).innerHTML=(text.length) ? Math.round((matches/text.length)*1000)/10 : "";
	}
	drawMatchChart();
}

function shuffle(text,cwl) {
	subcodes=new Array(cwl);

	text=strip(text.toUpperCase());

	shuffleTabelMaken(cwl);
	
	if (cwl=="") {
		alert("Geef de lengte van het codewoord.");
		return false;
	}
	
	cwl=cwl*1;

	for (i=0;i<cwl;i++) {
		subcodes[i]="";
	}

	for (i=0;i<text.length;i++) {
		subcodes[i%cwl]+=text.charAt(i);
	}

	for (i=1;i<=cwl;i++) {
		eval("document.getElementById('shuffleform').subcode"+i).value=subcodes[i-1];
	}
	optieLijstVullen();
}


function resetSchuifTabel(){
	schuifTabelLeegMaken();
	emptyMatchChart();
}

function resetPaarTabel(){
	paarTabelLeegMaken();
	emptyPaarMatchChart();
}

function paarTabelLeegMaken(){
	for (k=1;k<=15;k++) {
		document.getElementById("pval"+k).innerHTML=k;
		document.getElementById('pfreq'+k).innerHTML="";
	}
}

function schuifTabelLeegMaken(){
	for (k=1;k<=15;k++) {
		document.getElementById("sval"+k).innerHTML=k;
		document.getElementById('sfreq'+k).innerHTML="";
		document.getElementById('spercent'+k).innerHTML="";
	}
}


function shuffleTabelMaken(aantal){
	
	div=document.getElementById('shuffleDiv');
	while(div.firstChild){
		div.removeChild(div.firstChild);
	}
	
	for (k=1;k<=aantal;k++) {
		
		tekstvak = document.createElement('textarea');
		tekstvak.id="subcode"+k;
		tekstvak.rows=4;
		tekstvak.cols=30;
		tekstvak.readOnly=true;
		tekstvak.style.margin="2px";
		
		div.appendChild(tekstvak);

	}
}

function optieLijstVullen(){
	var lijst=document.getElementById('selectSubcode');
	var cwl=document.getElementById('cwl').value*1;
	
	
	while(lijst.lastChild.value){
		lijst.removeChild(lijst.lastChild);
	}
	
	for (k=1;k<=cwl;k++){
		optie=document.createElement('option');
		optie.text="Subcode " + k;
		optie.value=k;
		try{
			lijst.add(optie,null); // standards compliant
		} catch(ex) {
			lijst.add(optie); // IE only
		}		
	}
}

function selectSubcodeClick(){
	var subcode=document.getElementById('selectSubcode').value;
	var tekstvak=document.getElementById('subcode'+subcode);
	analyse(tekstvak.value);
	drawSubcodeFreqChart(true);
}

function resetSubCode(){
	subCodeVakkenVerwijderen();
	resetFreqTabel();
	drawSubcodeFreqChart(false);
}


function subCodeVakkenVerwijderen(){
	div=document.getElementById('shuffleDiv');
	while(div.firstChild){
		div.removeChild(div.firstChild);
	}
	optieLijstVullen();
}

function shiftFreq(){
	var cel;
	for(k=1;k<=15;k++){
		cel=document.getElementById("sval"+k);
		cel.innerHTML = cel.innerHTML*1+1;
	}
}

function shiftBackFreq(){
	var cel;
	for(k=1;k<=15;k++){
		cel=document.getElementById("sval"+k);
		cel.innerHTML = cel.innerHTML*1-1;
	}
}

function shiftPaarFreq(){
	var cel;
	for(k=1;k<=15;k++){
		cel=document.getElementById("pval"+k);
		cel.innerHTML = cel.innerHTML*1+1;
	}
}

function shiftBackPaarFreq(){
	var cel;
	for(k=1;k<=15;k++){
		cel=document.getElementById("pval"+k);
		if (cel.innerHTML*1<1){
			alert("Je dit alleen bekijken over een positieve verschuiving.");
			return;
		}
		cel.innerHTML = cel.innerHTML*1-1;
	}
}

function drawMatchChart(){
				var data = [];		
			    var sstart=document.getElementById('sval'+1).innerHTML*1
				for(var i = 1; i <= 15; i++ ){
					var verschuiving = document.getElementById('sval'+i).innerHTML*1-.5;
					var freq = (document.getElementById('sval'+i).innerHTML*1) ? document.getElementById('sfreq'+i).innerHTML*1 : 0;
					data.push([verschuiving,freq]);
				}
				
				/**
				 * Draw the graph in the first container.
				 */
				Flotr.draw(
					$('verschuiving-container'),
					[data],
					{bars: {show:true, barWidth:.9},
					 yaxis: {min: 0},
					 xaxis:{
						noTicks: 15,	// Display 7 ticks.
						tickFormatter: function(n){ return Math.floor(n); },
						min: sstart-.5,		// => part of the series is not displayed.
						max: sstart+14.5	// => part of the series is not displayed.
						}
					}
				);
				document.getElementById('verschuiving-container').style.visibility="visible";
				document.getElementById('verschuiving-container').style.display="block";
}

function drawPaarMatchChart(){
  var data = [];
			    var sstart=document.getElementById('pval'+1).innerHTML*1
			      for(var i = 1; i <= 15; i++ ){
					var verschuiving = document.getElementById('pval'+i).innerHTML*1-.5;
					var freq = (document.getElementById('pval'+i).innerHTML*1) ? document.getElementById('pfreq'+i).innerHTML*1 : 0;
					data.push([verschuiving,freq]);
				}
				
				/**
				 * Draw the graph in the first container.
				 */
				Flotr.draw(
					$('paar-container'),
					[data],
					{bars: {show:true, barWidth:.9},
					 yaxis: {min: 0},
					 xaxis:{
						noTicks: 15,	// Display 7 ticks.
						tickFormatter: function(n){ return Math.floor(n); },
						min: sstart-.5,		// => part of the series is not displayed.
						max: sstart+14.5	// => part of the series is not displayed.
						}
					}
				);
				document.getElementById('paar-container').style.visibility="visible";
}



function emptyMatchChart(){
	document.getElementById('verschuiving-container').style.visibility="hidden";
	document.getElementById('verschuiving-container').style.display="none";
}

function emptyPaarMatchChart(){
	document.getElementById('paar-container').style.visibility="hidden";
}


function drawSubcodeFreqChart(toon){
				if(toon){
					tabel=document.getElementById('frequentie-container');
					tabel.style.display="block";
					document.getElementById('tabel-button-hide').style.display="block";
					document.getElementById('tabel-button-show').style.display="none";
				} else {
					tabel=document.getElementById('frequentie-container');
					tabel.style.display="none";
					document.getElementById('tabel-button-show').style.display="block";
					document.getElementById('tabel-button-hide').style.display="none";
					return;
				}
				
				var data = [];
				var subdata;
				var counter=document.getElementById('selectSubcode').value*1;				
				
				if(counter){
					text=document.getElementById('subcode'+counter).value;
					freqs=analyseHulp(text);
					subdata=[];
					subdata.push([0,0]);
					for(var i = 0; i < 26; i++ ){
						subdata.push([i+1,document.getElementById('perc'+i).innerHTML]);
					}
					subdata.push([27,0]);
					subdata.push([28,0]);					
					data.push(subdata);
				} else {
					drawSubcodeFreqChart(false);
				}

				var fdata=[];

				var obj={
						data: data[0],
						label: 'subcode' + counter
					}
				fdata.push(obj);				

				var taal=document.getElementById('selectTaal').value;
				if(taal!="0"){
					var taalLabel = getTaalLabel(taal);
					var verschuiving = getVerschuiving();
					var taalFreqs = getTaalFreqs(taal,verschuiving);
					data.push(taalFreqs);
					var obj={
						data: data[1],
						label: taalLabel,
						color: '#FF3030'
					}
					fdata.push(obj);
				}		
				
				/**
				 * Draw the graph in the first container.
				 */
				Flotr.draw(
					$('subcode-chart-container'),
					fdata,
					{
					//bars: {show:true, barWidth:0.4},
					 yaxis: {min: 0},
					 xaxis:{
						noTicks: 29,
						tickFormatter: function(n){ return (n>0 && n<27) ? String.fromCharCode(65+Number(n)-1) + "<br>" 
															+ String.fromCharCode(97+((Number(n-1)+26-verschuiving%26)%26)) : ""; }
						},
					legend:{
						position: 'ne', // => position the legend 'south-east'.
						backgroundColor: '#D2E8FF', // => a light blue background color.
						nocolumns: 1
						}
					}
				);

}





function analyseLetterparen(text){
	
	var staart = strip(text);
	var result=new Array(staart.length+1);
	for(k=0;k<result.length;k++){
		result[k]=0;
	}
	var substaart = staart;
	var paar="";
	while(staart.length>1){
		for(k=1;k<staart.length-1;k++){
			if(staart.substr(0,2)==staart.substr(k,2)){
				result[k]+=1;
			}
		}
		staart=staart.substr(1);
	}
	return result;
}

function vulLetterparenTabel(text){
	var freqs=analyseLetterparen(text);
	for(k=1;k<=15;k++){
		var verschuiving=document.getElementById("pval"+k).innerHTML*1;
		document.getElementById("pfreq"+k).innerHTML= (verschuiving<freqs.length && verschuiving>0) ? freqs[verschuiving] : "0";
	}
	drawPaarMatchChart();
}

//  oude functies.

function drawSubcodeChartOud(toon){
				if(toon){
					tabel=document.getElementById('subcode-container');
					tabel.style.display="block";
					document.getElementById('tabel-button-hide').style.display="block";
					document.getElementById('tabel-button-show').style.display="none";
				} else {
					tabel=document.getElementById('subcode-container');
					tabel.style.display="none";
					document.getElementById('tabel-button-show').style.display="block";
					document.getElementById('tabel-button-hide').style.display="none";
				}
				
				var data = [];
				var subdata;
				var counter;
				var counter=1;
				while(document.getElementById('subcode'+counter)){
					text=document.getElementById('subcode'+counter).value;
					freqs=analyseHulp(text);
					subdata=[];
					subdata.push([0,0]);
					for(var i = 0; i < 26; i++ ){
						//var letter = String.fromCharCode(i+65);
						subdata.push([i+1,freqs[i]]);
					}
					subdata.push([27,0]);
					subdata.push([28,0]);					
					counter++;
					data.push(subdata);
				}
				
				d1=data[0];
				d2=data[1];
				var fdata=[];
				for(k=0;k<data.length;k++){
					var obj={
							data: data[k],
							label: 'subcode' + (k+1)
						}
					fdata.push(obj);
				}
				/**
				 * Draw the graph in the first container.
				 */
				Flotr.draw(
					$('subcode-container'),
					fdata,
					{
					 yaxis: {min: 0},
					 xaxis:{
						noTicks: 29,
						tickFormatter: function(n){ return (n>0 && n<27) ? String.fromCharCode(65+Number(n)-1) + "<br>j" : ""; }
						},
					legend:{
						position: 'ne', // => position the legend 'south-east'.
						backgroundColor: '#D2E8FF', // => a light blue background color.
						nocolumns: 1
						}
					}
				);

}
