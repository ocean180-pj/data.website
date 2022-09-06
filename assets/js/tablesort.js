
const outputElement = document.getElementById('output_csv');

function getCsvData(dataPath) {
 const request = new XMLHttpRequest();
 request.addEventListener('load', (event) => {
  const response = event.target.responseText;
  convertArray(response);
 });
 request.open('GET', dataPath, true);
 request.send();
}

function convertArray(data) {
 const datacontent = data.split('#')[2].slice(2) ;
 const header = data.split('#')[1].split(',');
 const dataArray = [];
 const dataString = datacontent.split('\n');

 let insertElement = '';
 
 let theader = '<thead><th id="headers">◆NID</th>';
 header.forEach((childElementh) => {
   theader += `<th id="headers">◆${childElementh}</th>`
  });
 theader += '</thead>';
 insertElement += theader
 
 for (let i = 0; i < dataString.length; i++) {
  dataArray[i] = dataString[i].split(',');
 }
 dataArray.forEach((element,index) => {
  insertElement += '<tr>';
  insertElement += `<td>${index}</td>`;
  element.forEach((childElement) => {
   insertElement += `<td>${childElement}</td>`
  });
  insertElement += '</tr>';
 });
 outputElement.innerHTML = insertElement;
}

getCsvData('./assets/data/datalist.csv');



$(function(){
	$('#button').bind("click",function(){
		var re = new RegExp($('#search').val());
		$('#output_csv tbody tr').each(function(){
			var txt = $(this).html();
			console.log(txt.match(re));
			if(txt.match(re) != null){
				$(this).show();
			}else{
				$(this).hide();
			}
		});
	});

	$('#button2').bind("click",function(){
		$('#output_csv tbody tr').each(function(){
			$(this).show();
		})
		$('#search').val('');
	});
});

$(function(){
	$('#button3').bind("click",function(){
		$('#output_csv tbody tr').each(function(){
			$(this).hide();
		});	
		$('#output_csv tbody tr').each(function(){
			var txt = $(this).html();
			var obj = $(this);
			$("[name=datatype]").each(function(){
			
				if ($(this).prop("checked")==true){
					var que = $(this).prop("value");
					if(txt.match(que) != null){
						obj.show();
					}				
				}
			});
			$("[name=realm]").each(function(){
			
				if ($(this).prop("checked")==true){
					var que = $(this).prop("value");
					if(txt.match(que) != null){
						obj.show();
					}				
				}
			});			
			$("[name=resolution]").each(function(){
			
				if ($(this).prop("checked")==true){
					var que = $(this).prop("value");
					if(txt.match(que) != null){
						obj.show();
					}				
				}
			});			
			$("[name=generation]").each(function(){
			
				if ($(this).prop("checked")==true){
					var que = $(this).prop("value");
					if(txt.match(que) != null){
						obj.show();
					}				
				}
			});			
		});

	});

	$('#button4').bind("click",function(){
		const filter_type = document.getElementsByName('datatype');
	    for(let i = 0; i < filter_type.length; i++){
	      filter_type[i].checked = true;
	    }		
		const filter_realm = document.getElementsByName('realm');
	    for(let i = 0; i < filter_realm.length; i++){
	      filter_realm[i].checked = true;
	    }	
		const filter_resolution = document.getElementsByName('resolution');
	    for(let i = 0; i < filter_resolution.length; i++){
	      filter_resolution[i].checked = true;
	    }	
		const filter_generation = document.getElementsByName('generation');
	    for(let i = 0; i < filter_generation.length; i++){
	      filter_generation[i].checked = true;
	    }	
	    
		$('#output_csv tbody tr').each(function(){
			$(this).show();
		})		
	});

	$('#button5').bind("click",function(){
		const filter_type = document.getElementsByName('datatype');
	    for(let i = 0; i < filter_type.length; i++){
	      filter_type[i].checked = false;
	    }		
		const filter_realm = document.getElementsByName('realm');
	    for(let i = 0; i < filter_realm.length; i++){
	      filter_realm[i].checked = false;
	    }	
		const filter_resolution = document.getElementsByName('resolution');
	    for(let i = 0; i < filter_resolution.length; i++){
	      filter_resolution[i].checked = false;
	    }
		const filter_generation = document.getElementsByName('generation');
	    for(let i = 0; i < filter_generation.length; i++){
	      filter_generation[i].checked = false;
	    }		    
	    
		$('#output_csv tbody tr').each(function(){
			$(this).hide();
		})		
	});

});


	let column_no = 0; //今回クリックされた列番号
	let column_no_prev = 0; //前回クリックされた列番号

window.addEventListener('click', function () {

	document.querySelectorAll('#headers').forEach(elm => {
		elm.onclick = function () {
		
			column_no = this.cellIndex; //クリックされた列番号
							console.log(column_no);
				console.log(column_no_prev);
			let table = this.parentNode.parentNode.parentNode;
			let sortType = 0; //0:数値 1:文字
			let sortArray = new Array; //クリックした列のデータを全て格納する配列
			for (let r = 1; r < table.rows.length; r++) {
				//行番号と値を配列に格納
				let column = new Object;
				column.row = table.rows[r];
				column.value = table.rows[r].cells[column_no].textContent;
				sortArray.push(column);
				//数値判定
				if (isNaN(Number(column.value))) {
					sortType = 1; //値が数値変換できなかった場合は文字列ソート
				}
			}
			
			console.log(sortArray);
			
			if (sortType == 0) { //数値ソート
				if (column_no_prev == column_no) { //同じ列が2回クリックされた場合は降順ソート
					sortArray.sort(compareNumberDesc);
				} else {
					sortArray.sort(compareNumber);
				}
			} else { //文字列ソート
				if (column_no_prev == column_no) { //同じ列が2回クリックされた場合は降順ソート
					sortArray.sort(compareStringDesc);
				} else {
					sortArray.sort(compareString);
				}
			}
			//ソート後のTRオブジェクトを順番にtbodyへ追加（移動）
			let tbody = this.parentNode.parentNode;
			for (let i = 0; i < sortArray.length; i++) {
				tbody.appendChild(sortArray[i].row);
			}
			//昇順／降順ソート切り替えのために列番号を保存
			if (column_no_prev == column_no) {
				column_no_prev = -1; //降順ソート
			} else {
				column_no_prev = column_no;
			}
		};
	});
});
//数値ソート（昇順）
function compareNumber(a, b)
{
	return a.value - b.value;
}
//数値ソート（降順）
function compareNumberDesc(a, b)
{
	return b.value - a.value;
}
//文字列ソート（昇順）
function compareString(a, b) {
	if (a.value < b.value) {
		return -1;
	} else {
		return 1;
	}
	return 0;
}
//文字列ソート（降順）
function compareStringDesc(a, b) {
	if (a.value > b.value) {
		return -1;
	} else {
		return 1;
	}
	return 0;
}
