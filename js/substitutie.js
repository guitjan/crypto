function resetSubsCode(){
   	resetFreqTabel();
        resetFreqLETTERS();
	drawSubsChart(false);
	resetButtons();
	document.getElementById('textcopy').value="";
}

function resetButtons(){
  $('merge-button-true').style.display="block";
  $('merge-button-false').style.display="none";
  $('sorteer-button-true').style.display="block";
  $('sorteer-button-false').style.display="none";
  $('tabel-button-show').style.display="block";
  $('tabel-button-hide').style.display="none";
  $('selectTaal').value="0";
}

function resetFreqLETTERS(){
  for(k=0;k<26;k++){
    $('LETTER'+k).innerHTML=String.fromCharCode(65+k);
  }
}

function getSubsArray(){
	var result=new Array(27);
	result[0]="*";
	for(k=1;k<=26;k++){
		result[k]=(document.getElementById("subs"+k).value!="") ? document.getElementById("subs"+k).value.toUpperCase() : "*";
	}
	return result;
}

function invertSubsArray(arr){
	var result=new Array(27);
	for(k=0;k<27;k++){
		result[k]="*";
	}
	if(arr.length<27){
		return;
	}
	for(k=1;k<27;k++){
		index=arr[k].charCodeAt(0)-65+1;
		if(index>0 && index<27){
			result[index]=String.fromCharCode(k+65-1);		
		}
	}
	return result;
}

function decodeSubs(text){
	var result="";
	var text=stripSubs(text);
	subs=getSubsArray();
	if(!checkSubsArray(subs)){
	  return;
	}
	var invSubs=invertSubsArray(subs);
	for(k=0;k<text.length;k++){
		result+=(text.charCodeAt(k)==32 || text.charCodeAt(k)==42)? text.charAt(k) : invSubs[text.charCodeAt(k)-65+1];
	}	
	return result.toLowerCase();	
}


function stripSubs(text) {
	tmpstr="";
	text = text.toUpperCase();
	for (i=0;i<text.length;i++) {
		a=text.charCodeAt(i);
		if (a>=65 && a<=91 || a==42 || a==32)
			tmpstr+=text.charAt(i);
	}
	return tmpstr;		
}

function codeSubs(text){
	var result="";
	var text=stripSubs(text);
	subs=getSubsArray();
	if(!checkSubsArray(subs)){
	  return;
	}
	for(k=0;k<text.length;k++){
		result+=(text.charCodeAt(k)==32) ? " " : subs[text.charCodeAt(k)-65+1];
	}
	return result.toUpperCase();
}

function checkSubsArray(arr){
  var result=true;
  if(arr.length<27){
    return false;
  }
  for(k=1;k<27;k++){
    if(arr[k].length>1){
      alert("De opgegeven substitutie tabel is onjuist!");
      return false;
    }
  }
  for(k=1;k<27;k++){
    for(m=k+1;m<27;m++){
      if(arr[k]!="*"&&arr[k]==arr[m]){
	alert("De opgegeven substitutie tabel bevat dubbele codeletters! (o.a. de " +arr[k]+" komt vaker voor)." );
	return false;
      }
    }
  }
  return result;
}

function decodeSubsForm(){
	var code=document.getElementById("text").value;
	var origineel=decodeSubs(code);
	document.getElementById("encoded").value=origineel;
}

function drawSubsChartHulp(toon,merge){
  if(!toon){
    drawSubsChart(toon);
  } else {
    mergeSubsChart(toon,merge);
  }
}

function drawSubsChart(toon){
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
				
				text=document.getElementById('text').value;
				freqs=analyseHulp(text);
				subdata=[];
				subdata.push([0,0]);
				for(var i = 0; i < 26; i++ ){
					//var letter = String.fromCharCode(i+65);
					subdata.push([i+1,document.getElementById('perc'+i).innerHTML]);
				}
				subdata.push([27,0]);
				subdata.push([28,0]);
				
     				for(k=0;k<subdata.length;k++){
				  subdata[k][0]-=.4;
				}
					
				data.push(subdata);
				
				var maxsubdata=0;
				for(k=0;k<subdata.length;k++){
				  maxsubdata=Math.max(maxsubdata,subdata[k][1]);
				}


				var fdata=[];

				var obj={
						data: data[0],
						label: 'code'
					}
				fdata.push(obj);				
				
				
				var ymax;
				var taal=document.getElementById('selectTaal').value;
				if(taal!="0"){
				  ymax=(taal=="nl") ? Math.max(20,maxsubdata) : Math.max(15,maxsubdata);
				} else {
					ymax = maxsubdata;
				}
				
				
				/**
				 * Draw the graph in the first container.
				 */
				Flotr.draw(
					$('freq-chart-container'),
					fdata,
					{
					bars: {show:true, barWidth:0.8},
					 yaxis: {min: 0, max:ymax},
					 xaxis:{
						noTicks: 29,
					      tickFormatter: function(n){ return (n>0 && n<27) ? $("LETTER"+Number(n-1)).innerHTML : ""; }
						},
					legend:{
						position: 'ne', // => position the legend 'south-east'.
						backgroundColor: '#D2E8FF', // => a light blue background color.
						nocolumns: 1
						}
					}
				);				
								
				
				if(taal!="0"){
				  	$('lang-chart-container').style.display="block";
					var taalLabel = getTaalLabel(taal);
					var verschuiving = 0;
					var taalFreqs = getTaalFreqs(taal,verschuiving);
					var letters=getLetters();

					if($('sorteer-button-true').style.display=="none"){
					  var maxindex=0;
					  var temp=new Array(2);
					  for(k=0;k<26;k++){
					    maxindex=k;
					    for(m=k;m<26;m++){
					      if(taalFreqs[m+1][1]>taalFreqs[maxindex+1][1]){
						maxindex=m;
					      }   
					    }
					    temp[0]=taalFreqs[maxindex+1][1];
					    temp[1]=letters[maxindex];
					    
					    taalFreqs[maxindex+1][1]=taalFreqs[k+1][1];
					    letters[maxindex]=letters[k];

					    taalFreqs[k+1][1]=temp[0];
					    letters[k]=temp[1];
					  }

					}
					
					for(k=0;k<taalFreqs.length;k++){
					  taalFreqs[k][0]-=.4;
					}

					data.push(taalFreqs);
					var obj={
						data: data[1],
						label: taalLabel,
						color: '#FF3030'
					}
					fdata.push(obj);
				
					/**
					 * Draw the language graph in the second container.
					 */
					Flotr.draw(
						   $('lang-chart-container'),
						   [fdata[1]],
						   {
						   bars: {show:true, barWidth:0.8},
						       yaxis: {min: 0,max:ymax},
						       xaxis:{
						     noTicks: 29,
							 tickFormatter: function(n){ return (n>0 && n<27) ? letters[Number(n-1)]: ""; }
						     },
						       legend:{
						     position: 'ne', // => position the legend 'south-east'.
							 backgroundColor: '#D2E8FF', // => a light blue background color.
							 nocolumns: 1
							 }
						   }
					);
				} else {
				  $('lang-chart-container').style.display="none";
				}
				
				
				
}


function sorteerSubs(sort){
  if(sort){
    $('sorteer-button-true').style.display="none";
    $('sorteer-button-false').style.display="block";
  } else {
    $('sorteer-button-true').style.display="block";
    $('sorteer-button-false').style.display="none";
  }

  if(!sort){
    // nu gaan we de letters dus weer op hun normale plek zetten
    var letterindex=0;
    var temp=new Array(3);
    for(k=0;k<26;k++){
      letterindex=k;
      for(m=k;m<26;m++){
	if ($('LETTER'+m).innerHTML.charAt(0)==String.fromCharCode(k+65)){
	  letterindex=m;
	  m=26;
	}	
      }
      //alert($('LETTER'+k).innerHTML.length + String.fromCharCode(k+65));
      temp[0]=$('LETTER'+letterindex).innerHTML;
      temp[1]=$('freq'+letterindex).innerHTML;
      temp[2]=$('perc'+letterindex).innerHTML;

      $('LETTER'+letterindex).innerHTML=$('LETTER'+k).innerHTML;
      $('freq'+letterindex).innerHTML=$('freq'+k).innerHTML;
      $('perc'+letterindex).innerHTML=$('perc'+k).innerHTML;

      $('LETTER'+k).innerHTML=temp[0];
      $('freq'+k).innerHTML=temp[1];
      $('perc'+k).innerHTML=temp[2];    
    }
  } else {
    //sorteren!!!
    var maxindex=0;
    var temp=new Array(3);
    for(k=0;k<26;k++){
      maxindex=k;
      for(m=k;m<26;m++){
	if (Number($('freq'+m).innerHTML)>Number($('freq'+maxindex).innerHTML)){
	  maxindex=m;
	}	
      }
      temp[0]=$('LETTER'+maxindex).innerHTML;
      temp[1]=$('freq'+maxindex).innerHTML;
      temp[2]=$('perc'+maxindex).innerHTML;

      $('LETTER'+maxindex).innerHTML=$('LETTER'+k).innerHTML;
      $('freq'+maxindex).innerHTML=$('freq'+k).innerHTML;
      $('perc'+maxindex).innerHTML=$('perc'+k).innerHTML;

      $('LETTER'+k).innerHTML=temp[0];
      $('freq'+k).innerHTML=temp[1];
      $('perc'+k).innerHTML=temp[2];    
    }


  }



}

function mergeSubsChart(toon,merge){
  var taal=document.getElementById('selectTaal').value;
  if(taal=="0" && merge){
    alert("Je hebt nog geen taal geselecteerd!");
    return;
  }
  if(merge){
    $('merge-button-true').style.display="none";
    $('merge-button-false').style.display="block";
  } else {
    $('merge-button-true').style.display="block";
    $('merge-button-false').style.display="none";
  }

  if(!merge){
    drawSubsChart(toon);
  } else {
    drawMergedSubsChart(true);
  }

}

function drawMergedSubsChart(toon){
				var taal=document.getElementById('selectTaal').value;
				if(taal=="0"){
				  drawSubsChart(toon);
				  return;
				} else {
				   $('lang-chart-container').style.display="none";
				}
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
				
				text=document.getElementById('text').value;
				freqs=analyseHulp(text);
				subdata=[];
				subdata.push([0,0]);
				for(var i = 0; i < 26; i++ ){
					//var letter = String.fromCharCode(i+65);
					subdata.push([i+1,document.getElementById('perc'+i).innerHTML]);
				}
				subdata.push([27,0]);
				subdata.push([28,0]);
				
     				for(k=0;k<subdata.length;k++){
				  subdata[k][0]-=.4;
				}
					
				data.push(subdata);
				
				var maxsubdata=0;
				for(k=0;k<subdata.length;k++){
				  maxsubdata=Math.max(maxsubdata,subdata[k][1]);
				}


				var fdata=[];

				var obj={
						data: data[0],
						label: 'code'
					}
				fdata.push(obj);				
				
				
				var ymax;

				if(taal!="0"){
				  ymax=(taal=="nl") ? Math.max(20,maxsubdata) : Math.max(15,maxsubdata);
				} else {
					ymax = maxsubdata;
				}
				

			  	//$('lang-chart-container').style.display="block";
				var taalLabel = getTaalLabel(taal);
				var verschuiving = 0;
				var taalFreqs = getTaalFreqs(taal,verschuiving);
				var letters=getLetters();

				if($('sorteer-button-true').style.display=="none"){
				  var maxindex=0;
				  var temp=new Array(2);
				  for(k=0;k<26;k++){
				    maxindex=k;
				    for(m=k;m<26;m++){
				      if(taalFreqs[m+1][1]>taalFreqs[maxindex+1][1]){
					maxindex=m;
				      }   
				    }
				    temp[0]=taalFreqs[maxindex+1][1];
				    temp[1]=letters[maxindex];
				    
				    taalFreqs[maxindex+1][1]=taalFreqs[k+1][1];
				    letters[maxindex]=letters[k];

				    taalFreqs[k+1][1]=temp[0];
				    letters[k]=temp[1];
				  }
				}
					
				//for(k=0;k<taalFreqs.length;k++){
				//  taalFreqs[k][0]-=.4;
				//}

				data.push(taalFreqs);
				var obj={
					data: data[1],
					label: taalLabel,
					color: '#FF3030'
				}

				fdata.push(obj);
				/**
				 * Draw the graph in the first container.
				 */
				Flotr.draw(
					$('freq-chart-container'),
					fdata,
					{
					bars: {show:true, barWidth:0.4},
					 yaxis: {min: 0, max:ymax},
					 xaxis:{
						noTicks: 29,
					      tickFormatter: function(n){ return (n>0 && n<27) ? letters[Number(n-1)] + "<br>" + $("LETTER"+Number(n-1)).innerHTML : ""; }
						},
					legend:{
						position: 'ne', // => position the legend 'south-east'.
						backgroundColor: '#D2E8FF', // => a light blue background color.
						nocolumns: 1
						}
					}
				);	

}
