function decode(original, codeword) {
	codeword=codeword.toUpperCase();

	tmpstr="";

	for (i=0;i<codeword.length;i++) {
		if(codeword.charAt(i) == "*"){
			tmpstr+="*";
		} else {
			tmpstr+=String.fromCharCode(91-(codeword.charCodeAt(i)-65));
		}
	}
	if (codeword=="A") tmpstr="A";
	codeword=tmpstr;

	return code(original, codeword).toLowerCase();
}

function code(original, codeword) {
	original=original.toUpperCase();
	codeword=codeword.toUpperCase();
	encoded="";

	tmpstr="";
	
	codeword=strip(codeword);

	if (codeword=="") {
		alert("Zonder codewoord valt er niets te coderen. Vul dus een codewoord in!");
		return "";
	}
	cwl=codeword.length;

	original=strip(original);

	for (i=0;i<original.length;i++) {
		if (original.charAt(i)=="*" || codeword.charAt(i%cwl)=="*") {
			encoded+="*";
		}
		else {
			a=original.charCodeAt(i)-65;
			a=(a+codeword.charCodeAt(i%cwl)-65)%26+65;
			encoded+=String.fromCharCode(a);
		}
	}
	
	return encoded;
}

function analyseHulp(text){
	text=text.toUpperCase();

	freqs=new Array(26);

	for (i=0;i<26;i++)
		freqs[i]=0;

	for (i=0;i<text.length;i++) {
		a=text.charCodeAt(i);
		if (a>=65 && a<=91 || a==42) {
			freqs[a-65]+=1;
		}
	}
	return freqs;
}

function analyse(text) {
	text=strip(text);
	var freqs=analyseHulp(text);
	var lengte=text.length;
	if(lengte==0){
		return;
	}
	
	for (i=0;i<26;i++) {
		document.getElementById("freq"+i).innerHTML=freqs[i];
		document.getElementById("perc"+i).innerHTML=Math.round((freqs[i]/lengte)*1000)/10;
	}
}


function shiftback(form) {
	form=eval("document.getElementById('"+form+"')");
	
	tmp=document.getElementById('letter0').innerHTML;

	for (i=0;i<25;i++) {
		document.getElementById('letter'+i).innerHTML=document.getElementById('letter'+(i+1)).innerHTML;
	}
	document.getElementById('letter25').innerHTML=tmp;
}

function shift(form) {
	form=eval("document.getElementById('"+form+"')");
	
	tmp=document.getElementById('letter25').innerHTML;

	for (i=25;i>0;i--) {
		document.getElementById('letter'+i).innerHTML=document.getElementById('letter'+(i-1)).innerHTML;
	}
	document.getElementById('letter0').innerHTML=tmp;
}

function strip(text) {
	tmpstr="";
	text = text.toUpperCase();
	for (i=0;i<text.length;i++) {
		a=text.charCodeAt(i);
		if (a>=65 && a<=91 || a==42)
			tmpstr+=text.charAt(i);
	}
	return tmpstr;		
}

function tekstInvullen(keuze) {
	tekstvak = document.getElementById('text');
	switch(keuze){
		case 'beatles' : tekstvak.value=beatlesCode; break;
		case 'sport' : tekstvak.value=sportCode; break;
		case 'caesar1' : tekstvak.value=caesar1; break;
		case 'caesar2' : tekstvak.value=caesar2; break;
		case 'subs1' : tekstvak.value=subs1; break;
		case 'subs2' : tekstvak.value=subs2; break;
		case 'vige1' : tekstvak.value=vige1; break;
		case 'vige2' : tekstvak.value=vige2; break;
		default:
	}
}

function resetFreqTabel(){
	freqAnalyseTabelLeegmaken();
}

function freqAnalyseTabelLeegmaken(){
	for(k=0;k<26;k++){
		document.getElementById('freq'+k).innerHTML="?";
		document.getElementById('perc'+k).innerHTML="?";
		cel=document.getElementById('letter'+k);
		if(cel){
		  cel.innerHTML=String.fromCharCode(k+97);
		}
	}
}


function getTaalLabel(taal){
	var result;
	switch(taal){
		case 'nl' : result = 'NL freqenties'; break;
		case 'en' : result = 'EN frequenties'; break;
		default: result = '';
	}
	return result;
}

function getVerschuiving(){
	var k=0;
	while(document.getElementById('letter'+k).innerHTML!='a'){
		k+=1;
	}
	return k;
}

function getTaalFreqs(taal,verschuiving){
	var freqsNormaal;
	var freqs = [];
	freqs.push([0,0]);
	switch(taal){
		case 'nl' : freqsNormaal = NLFreqs; break;
		case 'en' :	freqsNormaal = ENFreqs; break;
		default : freqsNormaal = NLFreqs;
	}
	
	for(k=0;k<26;k++){
		var cel=[k+1,freqsNormaal[(k+26-verschuiving%26)%26]];
		freqs.push(cel);
	}
	freqs.push([27,0]);
	freqs.push([28,0]);
	return freqs;
}

function getLetters(){
  var result=new Array(26);
  for(k=0;k<26;k++){
    result[k]=String.fromCharCode(k+97);    
  }
  return result;
}
