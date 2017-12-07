/**
* 各种在业务（页面）处理中需要复用（调用）的函数
* @type {Object}
*/

//上下文菜单
function showMeun(list,data){
	data.forEach(function(item) {
		var li = document.createElement('li');
		li.innerHTML = item.name;
		list.appendChild(li);

		//li移入时
		li.addEventListener('mouseover',function(e) {
			var lis = this.parentNode.children;
			for(var i = 0; i < lis.length; i++) {
				lis[i].className = '';
			}
			this.className = 'active';
			
			//创建子菜单
			if(!li.children.length) {
				// var subLists = document.querySelectorAll('.subList');
				var subLists = this.parentNode.querySelectorAll('ul');
				for(var i = 0; i < subLists.length; i++) {
					subLists[i].parentNode.removeChild(subLists[i]);
				}
				if(item.subMenu) {
	 				var ul = document.createElement('ul');
	 				ul.className = 'subList';
	 				this.appendChild(ul);
	 				showMeun(ul,item.subMenu);
	 			}
			}
		});	
		
		// li移出时
		li.addEventListener('mouseout',function() {
			if (!this.children.length) {
	            this.className = '';
	        }
		});

		//li点击时
		li.addEventListener('click',callbackFunction[item.callbackname]);
		li.addEventListener('mousedown',function(e) {
			e.stopPropagation();
		});
	});
}

//创建文件的函数
function create(type,name){
	var newData = {};
	newData.id = getMaxId(id) + 1;
	newData.pid = id;
	newData.type = type;
	newData.name = name;

	var sameFile = checkName(newData);

    if(sameFile.length) {
        for(var i = 1; i <= sameFile.length; i++) {
            var v = sameFile.find(function(ele) {
                return ele.extname == i + 1;
            });
            if (v === undefined) {
                newData.extname = i + 1;
                break;
            }
        }
    }
    data.list.push(newData);
	view(id);
	resetOffset();
}

//进行页面渲染的函数
function view(pid,arr) {
	id = pid;
	var dataList = getChildren(pid);
	
	elements.box.innerHTML = '';	//每次渲染时先清空容器box的内容

	//循环data.list数组的每个对象，根据对象属性来生成文件
	if(arr) {
		dataList = arr;
	} 

	dataList.forEach(function(item){
		var newname = item.name;
        if (item.extname) {
            newname += '('+(item.extname)+')';
        }

		var div = document.createElement('div');
		div.dataset.id = item.id;
		div.className = item.type;
        div.innerHTML = '<p>' + newname + '</p><input type="text" placeholder="请输入名称...">';

        //文件夹点击打开
        div.ondblclick = function() {
        	view(item.id);
        };

        div.item = item;

        div.addEventListener('contextmenu',setFiles);
        function setFiles(e) {
        	elements.changeFile.style.display = 'block';
			elements.changeFile.innerHTML = '';
			elements.changeFile.style.left = e.clientX + 1 +'px';
			elements.changeFile.style.top = e.clientY + 1 +'px';
			e.preventDefault();
			e.stopPropagation();
			elements.list.style.display = 'none';
        	showMeun(elements.changeFile,data.meun.setFile);

        	targetItem = this.item;
        	target = this;

        	var activeFiles = document.querySelectorAll('.box .active');
			if(activeFiles.length == 1) {
				for(var i = 0; i < activeFiles.length; i++) {
					activeFiles[i].classList.remove("active");
				}
			}
        	this.classList.add("active");
        	this.classList.remove("hover");
        }

        div.addEventListener('click',active);
        function active(e) {
        	e.stopPropagation();
        	elements.list.style.display = 'none';
			elements.changeFile.style.display = 'none';
        	
        	if(!e.ctrlKey){
				romoveActive();
			}
			this.classList.add("active");
        }

        div.addEventListener('mouseover',over);
        function over(e) {
        	this.classList.add("hover");
        }

        div.addEventListener('mouseout',out);
        function out() {
        	this.classList.remove("hover");
        }

        var del = document.querySelector('.del');//获取垃圾桶
       
        div.addEventListener('mousedown',down); 
        function down(e) {
        	if(e.target.dataset.id == -1) {
	        	return;
	        } 
        	e.stopPropagation();
        	if(e.button == 2){
				return;
			}
        	
        	if(!e.ctrlKey && !this.classList.contains('active')){
				romoveActive();
			}
			this.classList.add('active');
        	var actives = document.querySelectorAll('div.active');
        	var newClone = null;
        	var startX = e.clientX;
        	var startY = e.clientY;
        	var self = this;
        	var cloneFile = [];
        	var startElOffset = [];
        	var activeNodes = null;

        	document.addEventListener('mousemove',move);
        	function move(e) {
        		if(!newClone){
					activeNodes = elements.box.querySelectorAll('.active');
					for(var i = 0; i < activeNodes.length; i++){		    	
						var node = activeNodes[i].cloneNode(true);
						node.style.opacity = ".5";
						cloneFile.push(node);
						elements.box.appendChild(node);
						if(self == activeNodes[i]){
							newClone = node;//找到当前点击的这个元素克隆出来的节点
						}
						startElOffset[i] = {x:css(activeNodes[i],"left"),y:css(activeNodes[i],"top")};
					}
				}

				var disX = e.clientX - startX;
        		var disY = e.clientY - startY;

        		for(var i = 0; i < cloneFile.length;i++){
					css(cloneFile[i],"left", disX + startElOffset[i].x);
					css(cloneFile[i],"top", disY + startElOffset[i].y);
				}
				if(getCollide(newClone,del)){
					del.classList.add("hover");
				} else {
					del.classList.remove("hover");
				}
        	}

        	document.addEventListener('mouseup',up);
        	function up() {
        		document.removeEventListener('mousemove',move);
        		document.removeEventListener('mouseup',up);

        		if(!newClone){
					return;
				}
				if(getCollide(newClone,del)){
					//files.removeChild(self);
					for(var i = 0; i < activeNodes.length; i++){
			    		data.list.forEach(function(item) {
			    			if(item.id == activeNodes[i].dataset.id && item.id != -1) {
			    				item.pid = -1;
			    			}
			    		});			    	
					}
					resetOffset();
				}
				for(var i = 0; i < cloneFile.length;i++){
					elements.box.removeChild(cloneFile[i]);
				}
				view(id);
				del.classList.remove("hover");
        	} //end
        }
        elements.box.appendChild(div);
	});
	//文件生成后设置文件位置	
	resetOffset();

	// 导航列表
	var pathList = getParents(id);

	elements.crumbs.innerHTML = '';

	//顶层目录
	var li = document.createElement('li');
    li.innerHTML = '<a href="javascript:;">/</a>';
    li.onclick = function() {
        view(0);
    };
    elements.crumbs.appendChild(li);

    pathList.forEach(function (item){
        var li = document.createElement('li');
        if (item.extname) {
            li.innerHTML = '<span> > </span><a href="javascript:;">' + item.name +'('+(item.extname)+')'+'</a>';
        } else {
        	li.innerHTML = '<span> > </span><a href="javascript:;">' + item.name +'</a>';
        }
        li.onclick = function() {
            view(item.id);
        };
        elements.crumbs.appendChild(li);
    });

    //当前所在目录
    var info = getInfo(id);
    if (info) {
    	var li = document.createElement('li');
    	if (info.extname) {
            li.innerHTML = '<span> > </span><span>' + info.name+'('+(info.extname)+')' +'</span>';
        } else {
        	li.innerHTML = '<span> > </span><span>' + info.name +'</span>';
        }
        elements.crumbs.appendChild(li);
    }
}

function backTop(){
	var info = getInfo(id);
	if(info) {
		view(info.pid);
	}
}

var callbackFunction = {
	createFile: function() {
		create("file","新建文件夹");
	},
	createTxt: function() {
		create("txt","新建文本");
	},
	createHtml: function() {
		create("html","新建Html");
	},  
	changeImg: function() {
		bgNub++;
		elements.bgImg.style.backgroundImage = bgImgs[bgNub%bgImgs.length];
		this.className = '';
	},
	openFile: function() {
   		view(targetItem.id);	
    }, 
    setName: function() {
    	var input = target.querySelector('input');
    	var p = target.querySelector('p');
    	p.style.display = "none";
		input.style.display = "block";
		input.value = p.innerHTML;
		input.select();

		input.onblur = function() {
			var is = false;
			var start = input.value.indexOf('(');
			var end = input.value.indexOf(')');
			var num = input.value.substring(start + 1,end);
			var newName = input.value.slice(0,start);
			
			if(isNaN(num) || num == '') {
				newName = input.value;
				num = '';
			}

			data.list.forEach(function(item){
				if(input.value != p.innerHTML && newName == item.name && num == item.extname && targetItem.pid == item.pid) {
					console.log('重名');
					is = true;
					input.select();
				}
			});

			if(!is) {
				p.style.display = "block";
				input.style.display = "none";
				targetItem.name = newName;
				targetItem.extname = num;
				var timer = setTimeout(function() {
					view(id);
				},500);
			}
		};
		
		input.onclick = function(e) {
			e.stopPropagation();
		};
    },
    removeFile: function(e) {
    	remove();
    },
    sort: function() {
    	var sortArr = [];
    	data.list.forEach(function(item) {
    		if(item.pid == id) {
    			sortArr.push(item);
    		}
    	});
		sortArr.sort(function(a,b) {
			return a.extname - b.extname;
		});
		view(id,sortArr);
    }
}

// 取消上下文菜单的函数
function hiddenMeun(e) {
	elements.list.style.display = 'none';
	elements.changeFile.style.display = 'none';
}

// 取消active选中样式
function romoveActive() {
	var files = document.querySelectorAll('.box div');
	for(var i = 0; i < files.length; i++) {
		files[i].classList.remove("active");
	}
}

function removeHover() {
	this.classList.remove("hover");
}

// delete删除文件夹
document.addEventListener('keyup', function(e) {
	if(e.keyCode == 46) {
		remove();
	}
});

// 删除文件夹函数
function remove() {
	var activeFiles = document.querySelectorAll('.box .active');
	for(var i = 0; i < activeFiles.length; i++) {
		data.list.forEach(function(item) {
			if(item.id == activeFiles[i].dataset.id && item.id != -1) {
				item.pid = -1;
			}
		});
	}
	view(id);
}

/*
* 获取数据中最大的id
* */
function getMaxId() {
    var maxid = 0;
    data.list.forEach(function (item) {
        if (item.id > maxid) {
            maxid = item.id;
        }
    });
    return maxid;
}

/**
 * 检测重名
 */
function checkName(filedata) {
    var files = [];
    for (var i = 0; i < data.list.length; i++) {
        //当filedata的type和name与data.list某个数据完全一样的时候，表示该type下已有同名文件或文件夹
        if (filedata.pid == data.list[i].pid && filedata.type == data.list[i].type && filedata.name == data.list[i].name) {
            files.push(data.list[i]);
        }
    }
    return files;
}

//设置文件位置的函数
function resetOffset(){
	var files = elements.box.querySelectorAll('div');
	var fileW = 115;	//单个文件夹的宽度
	var fileH = 105;	//单个文件夹的高度
	var ceils = Math.floor(elements.box.clientHeight / fileH); 
	for(var i = 0; i < files.length; i++) {
		files[i].style.left = fileW * Math.floor((i) / ceils)+'px';
		files[i].style.top = fileH * ((i) % ceils) + 15 +'px';
	}
}	

//碰撞检测
function getCollide(el,el2){
	var rect = el.getBoundingClientRect();
	var rect2 = el2.getBoundingClientRect();
	if(rect.right < rect2.left
	||rect.left > rect2.right
	||rect.bottom<rect2.top
	||rect.top>rect2.bottom){
		return false;
	}
	return true;
}

//获取所有子数据
function getChildren(id) {
	 return data.list.filter(function(item) {
        return item.pid == id;
    });
}

//获取id对应的数据
function getInfo(id) {
    return data.list.filter(function(item) {
        return item.id == id;
    })[0];
}

//获取父级下的所有同级数据,包括自己
function getParent(id) {
	var info = getInfo(id);
    if (info) {
        return getInfo(info.pid);
    }
}

 // 获取所有父级数据
function getParents(id) {
    // 保存所有父级数据
    var parents = [];

    // 获取父级
    var parentInfo = getParent(id);
    // 如果父级信息存在
    if (parentInfo) {
        // 把当前父级的信息保存到parents里面
        parents.push(parentInfo);
        var more = getParents(parentInfo.id);
        parents = more.concat(parents);
    }
    return parents;
}