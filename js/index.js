/**
* 业务　－　和页面或用户打交道的
*/
var elements = {
	list: document.querySelector('.list'),
	box: document.querySelector('.box'),
	paths: document.querySelector('#paths'),
	back: document.querySelector('#back'),
	crumbs: document.querySelector('#crumbs'),
	bgImg: document.querySelector('.bgImg'),
	changeFile: document.querySelector('.changeFile')
}
var bgImgs = ['url(img/bg1.jpg)','url(img/bg3.jpg)','url(img/bg4.jpg)','url(img/bg5.jpg)','url(img/bg6.jpg)','url(img/bg7.jpg)'];
var bgNub = 0;
//一开始的根目录
var id = 0;
view(id);


elements.back.addEventListener('click',backTop); 

document.addEventListener("contextmenu",function(e) {
	elements.list.style.display = 'block';
	elements.list.innerHTML = '';
	elements.list.style.left = e.clientX + 'px';
	elements.list.style.top = e.clientY + 'px';
	elements.changeFile.style.display = 'none';
	e.stopPropagation();
	e.preventDefault();
	showMeun(elements.list,data.meun.main);

	romoveActive();
});

document.addEventListener("mousedown",romoveActive);
document.addEventListener("click",hiddenMeun);

//框选
(function(){
	document.addEventListener('mousedown', function(e) {
		if(e.button==2){
			return;
		}
		var p = document.createElement("p");
		console.log(p);
		var files = document.querySelectorAll('.box div');
		var startX = e.clientX;
		var startY = e.clientY;
		p.className = "select";
		p.style.left = e.clientX + "px";
		p.style.top = e.clientY + "px";
		elements.box.appendChild(p);
		document.addEventListener('mousemove', move);
		document.addEventListener('mouseup', end);

		function move(e){
			var nowX = e.clientX;
			var nowY = e.clientY;
			p.style.width = Math.abs(nowX - startX) + "px";
			p.style.height = Math.abs(nowY - startY) + "px";
			if(nowX < startX){
				p.style.left = nowX + "px";
			} else {
				p.style.left = startX + "px";
			}
			if(nowY < startY){
				p.style.top = nowY + "px";
			} else {
				p.style.top = startY + "px";
			}
			for(var i = 0; i < files.length; i++){
				if(getCollide(p,files[i])){
					files[i].classList.add("active");
				} else {
					files[i].classList.remove("active");
				}
			}
		}
		function end(){
			document.removeEventListener('mousemove', move);
			document.removeEventListener('mouseup', end);
			elements.box.removeChild(p);
		}
	});
})();