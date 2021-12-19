function resetCaesarCode(){
	resetFreqTabel();
	drawFreqChart(false);
}

function drawFreqChart(toon){
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
				data.push(subdata);
				
				var fdata=[];

				var obj={
						data: data[0],
						label: 'code'
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
					$('freq-chart-container'),
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