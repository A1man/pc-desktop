/**
* 数据
* @type {Object}
*/
var data = {
	meun: {
		'main': [
	 		{
	 			name: '新建',
	 			subMenu: [
	 				{	
	 					name: '文件夹',
	 					type: 'file',
	 					callbackname: 'createFile'
	 				},
	 				{	
	 					name: '文本',
	 					type: 'txt',
	 					callbackname: 'createTxt'
	 				},
	 				{	
	 					name: 'Html',
	 					type: 'html',
	 					callbackname: 'createHtml'
	 				}
	 			]
	 		},
	 		{
	 			name: '排序',
	 			callbackname: 'sort'
	 		},
	 		{
	 			name: '更换桌面背景',
	 			callbackname: 'changeImg'
	 		}
	 	],
	 	'setFile': [
	 		{
	 			name: '打开',
	 			callbackname: 'openFile'
	 		},
	 		{
	 			name: '重命名',
	 			callbackname: 'setName'
	 		},
	 		{
	 			name: '删除',
	 			callbackname: 'removeFile'
	 		}
	 	]
	},
	list: [{
		id: -1,
		pid: 0,
		type: 'del',
		name: '回收站'
	}]
};
