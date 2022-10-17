let dbData = [];
let getKey = " ";
let caseIgnore = false;
let regexpMode = false;
let containerCol = [];
/** Collect the tags */
var tagsName = [];
let innerclassCollection = [];

document.getElementById('tagSearshBtn').addEventListener('click', ()=>{
	let temp = localStorage.getItem("tags").split(',');
	let str = location.href.substring(location.href.indexOf('docUI')+5);
	if(!temp||(temp.length==1&&temp[0]=="")) {
		alert("這份檔案沒有Tags");
	} else if(str.indexOf("/Tags")==0) {
		alert("您已經在Tags專屬頁面");
	} else {
		document.getElementById('tagsList').classList.toggle('close');
		document.getElementById('tagSearshBtn').classList.toggle('close');
	}
}) 

document.getElementById("caseSwitch").addEventListener('click', ()=>{
	/** Check if regexpMode is true.*/
	if(regexpMode) {
		let check = confirm("一次只能選擇一個模式，是否要切換？");
		if(check) {
			regexpMode = !regexpMode;
			if(regexpMode) document.getElementById("regexpMode").style.cssText = "color: rgb(103, 143, 185); text-decoration: underline";
			else document.getElementById("regexpMode").style.cssText = "color: black";
		} else {
			return;
		}
	}
	caseIgnore = !caseIgnore;
	if(caseIgnore) document.getElementById("caseSwitch").style.cssText = "color: rgb(103, 143, 185); text-decoration: underline";
	else document.getElementById("caseSwitch").style.cssText = "color: black";
})

document.getElementById("regexpMode").addEventListener('click', ()=>{
	/** Check if caseIgnore is true.*/
	if(caseIgnore) {
		let check = confirm("一次只能選擇一個模式，是否要切換？");
		if(check) {
			caseIgnore = !caseIgnore;
			if(caseIgnore) document.getElementById("caseSwitch").style.cssText = "color: rgb(103, 143, 185); text-decoration: underline";
			else document.getElementById("caseSwitch").style.cssText = "color: black";
		} else {
			return;
		}
	}
	regexpMode = !regexpMode;
	if(regexpMode) document.getElementById("regexpMode").style.cssText = "color: rgb(103, 143, 185); text-decoration: underline";
	else document.getElementById("regexpMode").style.cssText = "color: black";
})

document.getElementById('gotoSearch').addEventListener('click', ()=>{
	/** Go to the advance search page.*/
	let temp = location.href.split('/');
	if(temp[temp.length-1]!="AdvancedSearch") {
		location.href = location.href.substring(0, location.href.indexOf('docUI')) + "AdvancedSearch";
	} else {
		alert("您已經在進階搜尋頁面！");
	}
})
/*
 * Find the key word in innerText.
 * @param {Object} dirLinkItem - The dirLinkItem on the previous level.
 * @param {String} key - The key word.
 * @param {Number} nowKeyIndex - The key word's level index.
 */
function findKey(dirLinkItem, key, nowKeyIndex) {
	//console.log(dirLinkItem)
	console.log(dirLinkItem.children[0].children[1].innerHTML)
	for(let i=0;i<dirLinkItem.children[1].children.length;i++) {
		
		let target = dirLinkItem.children[1].children[i];
		console.log(target)
		console.log(target.children[0].children[1].innerHTML)
		if(!target.children[0].children[1].classList.contains('docTitle')) {
			if(caseIgnore) {
				if(target.children[0].children[1].innerHTML.toLowerCase().indexOf(key[nowKeyIndex].toLowerCase())==-1||key[nowKeyIndex]=="") {

				} else {
					if(nowKeyIndex==(key.length-1)) {
						// highlight
						highlightForCaseIgnore(target, key[nowKeyIndex]);
						// find container
						let container;
						if(target.parentNode.classList.contains('container')) {
							container = target.parentNode;
						}
						//collect container that has to be openned 
						if(!containerCol.find(ele=>ele==container)&&container) {
							containerCol.push(container);
						}
						//上層的container也要一起打開
						if(container) {
							while(container.getAttribute('id')!='documentationNav') {
								if($((container).parentNode).hasClass('container')) {
										if(!containerCol.find(ele=>ele==(container).parentNode)) {
										containerCol.push((container).parentNode);
									}
								}
								container = (container).parentNode;
							}
						}
					} else {
						if(target.children[1].children) {
							findKey(target, key, nowKeyIndex+1);
						}
					}
				}
			} else {
				if(target.children[0].children[1].innerHTML.indexOf(key[nowKeyIndex])==-1||key[nowKeyIndex]=="") {

				} else {
					if(nowKeyIndex==(key.length-1)) {
						// highlight
						highlight(target, key[nowKeyIndex]);
						// find container
						let container;
						if(target.parentNode.classList.contains('container')) {
							container = target.parentNode;
						}
						//collect container that has to be openned 
						if(!containerCol.find(ele=>ele==container)&&container) {
							containerCol.push(container);
						}
						//上層的container也要一起打開
						if(container) {
							while(container.getAttribute('id')!='documentationNav') {
								if($((container).parentNode).hasClass('container')) {
										if(!containerCol.find(ele=>ele==(container).parentNode)) {
										containerCol.push((container).parentNode);
									}
								}
								container = (container).parentNode;
							}
						}
					} else {
						if(target.children[1].children) {
							findKey(target, key, nowKeyIndex+1);
						}
					}
				}
			}
		} else {
			findKey(target, key, nowKeyIndex);
		}

	}
}

/*
 * Highlight the key word in target's innerText.
 * @param {Object} target - The dirLinkItem that has to be highlighted.
 * @param {String} key - The key word.
 */
function highlight(target, key) {
	let firstIndex = target.children[0].children[1].innerHTML.indexOf(key);
	let temp = target.children[0].children[1].innerHTML;
	target.children[0].children[1].innerHTML = "";
	var span = document.createElement("span");
	span.innerHTML = temp.substring(0, firstIndex);
	target.children[0].children[1].append(span);
	span = document.createElement("span");
	span.innerHTML = temp.substring(firstIndex, firstIndex+key.length);
	temp = temp.substring(temp.indexOf(key)+key.length, temp.length);
	span.style.backgroundColor = "#FFFF66";
	target.children[0].children[1].append(span);
	span = document.createElement("span");
	span.innerHTML = temp;
	target.children[0].children[1].append(span);
}

/*
 * Highlight the key word in target's innerText, and it's case ignore version.
 * @param {Object} target - The dirLinkItem that has to be highlighted.
 * @param {String} key - The key word.
 */
function highlightForCaseIgnore(target, key) {
	let firstIndex = target.children[0].children[1].innerHTML.toLowerCase().indexOf(key[0].toLowerCase());
	let temp = target.children[0].children[1].innerHTML;
	target.children[0].children[1].innerHTML = "";
	var span = document.createElement("span");
	span.innerHTML = temp.substring(0, firstIndex);
	target.children[0].children[1].append(span);
	span = document.createElement("span");
	span.innerHTML = temp.substring(firstIndex, firstIndex+key[0].length);
	temp = temp.substring(firstIndex+key[0].length, temp.length);
	span.style.backgroundColor = "#FFFF66";
	target.children[0].children[1].append(span);
	span = document.createElement("span");
	span.innerHTML = temp;
	target.children[0].children[1].append(span);
}

// search key function
document.getElementById("searchTags").oninput = () => {
	let key =  document.getElementById("searchTags").value;
	// 刪除上一次的span並還原innerHTML
	for(let i=0;i<document.getElementsByClassName('tagsForSearch').length;i++) {
		let target = document.getElementsByClassName('tagsForSearch')[i];
		// check each none docTitle header txt 
		if(target.children[0].children[1].children.length>1) {
			let innerTxt = "";
			for(let j=0;j<target.children[0].children[1].children.length;j++) {
				innerTxt = innerTxt + target.children[0].children[1].children[j].innerHTML;
			}
			target.children[0].children[1].innerHTML = innerTxt;
		}
		if(target.classList.contains('nodisplay')) target.classList.remove('nodisplay');
	}

	// find the target 
	for(let i=0;i<document.getElementsByClassName('tagsForSearch').length;i++) {
		let target = document.getElementsByClassName('tagsForSearch')[i];
		// if key doesn't exist 
		if(target.children[0].children[1].innerHTML.indexOf(key)==-1) {
			target.classList.add('nodisplay')
		} 
		// if key exist
		else {
			highlight(target, key);
		}			
	}
}

// search bar function
document.getElementById("searchKey").oninput = () => {

	// special search
	if(param_switch||return_switch) {
		let key = document.getElementById("searchKey").value;
		let childIndex;
		if(param_switch) childIndex=0;
		else if(return_switch) childIndex=1;
		// 還原上次
		for(let i=0;i<document.getElementsByClassName('dirLinkItem').length;i++) {
			let target = document.getElementsByClassName('dirLinkItem')[i];
			if(target.children[0].children[1].innerText.indexOf("Methods")!=-1&&target.children[0].children[1].classList.contains('docTitle')) {
				for(let j=0;j<target.children[1].children.length;j++) {
					if(target.children[1].children[j].children[0].children[1].children.length>0) {
						target.children[1].children[j].children[0].children[1].innerText = target.children[1].children[j].children[0].children[1].children[0].innerText;
					}
				}
			}
		}

		for(let i=0;i<document.getElementsByClassName('dirLinkItem').length;i++) {
			let target = document.getElementsByClassName('dirLinkItem')[i];
			// find method title
			if(target.children[0].children[1].innerText.indexOf("Methods")!=-1&&target.children[0].children[1].classList.contains('docTitle')) {
				let mainContainer = target.children[1];
				// search the method title's children
				for(let j=0;j<target.children[1].children.length;j++) {
					let target2 = target.children[1].children[j];
					let container = mainContainer;
					if(!target2.children[0].children[1].classList.contains('docTitle')) {
						// regexp
						if(regexpMode) {

						}
						// ignoreCase
						else if(caseIgnore) {
							key = key.toLowerCase();
							if(target2.children[2].children[childIndex].innerText.toLowerCase().indexOf(key)!=-1&&key!="") {

								let temp = target2.children[0].children[1].innerText;
								target2.children[0].children[1].innerHTML = "";
								var span = document.createElement("span");
								span.innerText = temp;
								span.style.backgroundColor = "#F8C780";
								target2.children[0].children[1].append(span);
								span = document.createElement("span");
								span.innerText = "";
								target2.children[0].children[1].append(span)
								
								//collect container that has to be openned 
								if(!containerCol.find(ele=>ele==container)&&container) {
									console.log(container)
									containerCol.push(container);
								}
								
								//上層的container也要一起打開
								if(container) {
									while(container.getAttribute('id')!='documentationNav') {
										if($((container).parentNode).hasClass('container')) {
												if(!containerCol.find(ele=>ele==(container).parentNode)) {
												containerCol.push((container).parentNode)
											}
										}
										container = (container).parentNode
									}
								}
							}
						}

						else {
							//console.log(target2.children[2].children[childIndex].innerText)
							if(target2.children[2].children[childIndex].innerText.indexOf(key)!=-1&&key!="") {

								let temp = target2.children[0].children[1].innerText;
								target2.children[0].children[1].innerHTML = "";
								var span = document.createElement("span");
								span.innerText = temp;
								span.style.backgroundColor = "#F8C780";
								target2.children[0].children[1].append(span);
								span = document.createElement("span");
								span.innerText = "";
								target2.children[0].children[1].append(span)
								
								//collect container that has to be openned 
								if(!containerCol.find(ele=>ele==container)&&container) {
									console.log(container)
									containerCol.push(container);
								}
								
								//上層的container也要一起打開
								if(container) {
									while(container.getAttribute('id')!='documentationNav') {
										if($((container).parentNode).hasClass('container')) {
												if(!containerCol.find(ele=>ele==(container).parentNode)) {
												containerCol.push((container).parentNode)
											}
										}
										container = (container).parentNode
									}
								}
							}
						}
					}
				}
			}
		}


		//close all container
		for(let count=0;count<document.getElementsByClassName('container').length;count++) {
			let container = document.getElementsByClassName('container')[count]
			let targetToggle = ((container).parentNode).children[0].children[0]
			//收起上一次打開但這一次沒開的container
			if($(targetToggle).hasClass('down')&&!containerCol.find(ele=>ele==container)) {
				$(targetToggle).toggleClass('down')
				$(container).toggle(100)
				setTimeout(() => {
					for(let i=0;i<container.children.length;i++) {
						if(container.children[i].children[0].children[1].children.length==0) container.children[i].style.cssText = "display: block"
					}
				}, 100)
			}
		}
		console.log(containerCol)
		if(containerCol.length!=0) {
			for(let count=0;count<containerCol.length;count++) {
				openContainer(containerCol[count])
			}
		}
		for(let count=0;count<containerCol.length;count++) {
			containerCol[count].parentNode.style.cssText = "display:block"
		}
		containerCol.length=0

		return;
	}

	// regexp mode search
	if(regexpMode) {
		let key = document.getElementById("searchKey").value
		console.log(key.match(/\//g))
		if(key.match(/\//g).length==2&&key) {
			// 刪除上一次的span並還原innerHTML
			for(let i=0;i<document.getElementsByClassName('dirLinkItem').length;i++) {
				let target = document.getElementsByClassName('dirLinkItem')[i];
				// check each none docTitle header txt 
				if(!target.children[0].children[1].classList.contains('docTitle')) {
					if(target.children[0].children[1].children.length>1) {
						let innerTxt = ""
						for(let j=0;j<target.children[0].children[1].children.length;j++) {
							innerTxt = innerTxt + target.children[0].children[1].children[j].innerHTML
						}
						target.children[0].children[1].innerHTML = innerTxt
					}
				}	
			}

			for(let i=0;i<document.getElementsByClassName('dirLinkItem').length;i++) {
				let target = document.getElementsByClassName('dirLinkItem')[i];
				if(!target.children[0].children[1].classList.contains('docTitle')) {

					// find container
					let container
					if(target.parentNode.classList.contains('container')) {
						container = target.parentNode
					}

					key = key.replace('/','')
					var re = new RegExp(key)
					var match = re.exec(target.children[0].children[1].innerHTML);
					if (match) {
					    console.log("match found at " + match.index);

					    firstIndex = match.index
						let temp = target.children[0].children[1].innerHTML
						target.children[0].children[1].innerHTML = ""
						var span = document.createElement("span")
						span.innerHTML = temp.substring(0, firstIndex)
						target.children[0].children[1].append(span)
						span = document.createElement("span")
						span.innerHTML = temp.substring(firstIndex, firstIndex+key.length)
						temp = temp.substring(firstIndex+key.length, temp.length)
						span.style.cssText = "background-color: yellow";
						target.children[0].children[1].append(span)
						span = document.createElement("span")
						span.innerHTML = temp
						target.children[0].children[1].append(span)

						//collect container that has to be openned 
						if(!containerCol.find(ele=>ele==container)&&container) {
							containerCol.push(container)
						}
						//上層的container也要一起打開
						if(container) {
							while(container.getAttribute('id')!='documentationNav') {
								if($((container).parentNode).hasClass('container')) {
										if(!containerCol.find(ele=>ele==(container).parentNode)) {
										containerCol.push((container).parentNode)
									}
								}
								container = (container).parentNode
							}
						}
					}
					

				}
			}
			//close all container
			for(let count=0;count<document.getElementsByClassName('container').length;count++) {
				let container = document.getElementsByClassName('container')[count]
				let targetToggle = ((container).parentNode).children[0].children[0]
				//收起上一次打開但這一次沒開的container
				if($(targetToggle).hasClass('down')&&!containerCol.find(ele=>ele==container)) {
					$(targetToggle).toggleClass('down')
					$(container).toggle(100)
					setTimeout(() => {
						for(let i=0;i<container.children.length;i++) {
							if(container.children[i].children[0].children[1].children.length==0) container.children[i].style.cssText = "display: block"
						}
					}, 100)
				}
			}

			//open container
			console.log(containerCol)

			if(containerCol.length!=0) {
				for(let count=0;count<containerCol.length;count++) {
					openContainer(containerCol[count])
				}
			}
			for(let count=0;count<containerCol.length;count++) {
				containerCol[count].parentNode.style.cssText = "display:block"
			}
			containerCol.length=0

			return	
		}	
	}

	// regular search
	let key = document.getElementById("searchKey").value.split('.')
	console.log(key)

	// 刪除上一次的span並還原innerHTML
	for(let i=0;i<document.getElementsByClassName('dirLinkItem').length;i++) {
		let target = document.getElementsByClassName('dirLinkItem')[i];
		// check each none docTitle header txt 
		if(!target.children[0].children[1].classList.contains('docTitle')) {
			if(target.children[0].children[1].children.length>1) {
				let innerTxt = "";
				for(let j=0;j<target.children[0].children[1].children.length;j++) {
					innerTxt = innerTxt + target.children[0].children[1].children[j].innerHTML;
				}
				target.children[0].children[1].innerHTML = innerTxt;
			}
		}	
	}
	
	// find the target 
	for(let i=0;i<document.getElementsByClassName('dirLinkItem').length;i++) {
		let target = document.getElementsByClassName('dirLinkItem')[i];
		// check each none docTitle header txt 
		if(!target.children[0].children[1].classList.contains('docTitle')) {

			// find container
			let container;
			if(target.parentNode.classList.contains('container')) {
				container = target.parentNode;
			}

			// case ignore or not
			if(caseIgnore) {
				if(document.getElementsByClassName('header')[i].children[1].innerHTML.toLowerCase().indexOf(key[0].toLowerCase())==-1||key[0]=="") {
					//document.getElementsByClassName('header')[i].style.cssText = "color: black"
				} else {
					if(key.length==1) {
						highlightForCaseIgnore(target, key);
						// collect container that has to be openned 
						if(!containerCol.find(ele=>ele==container)&&container) {
							containerCol.push(container);
						}
						// 上層的container也要一起打開
						if(container) {
							while(container.getAttribute('id')!='documentationNav') {
								if($((container).parentNode).hasClass('container')) {
									if(!containerCol.find(ele=>ele==(container).parentNode)) {
										containerCol.push((container).parentNode);
									}
								}
								container = (container).parentNode;
							}
						}
					} else if(key.length>1) {
						findKey(target, key, 1);
					}
				}
			} else {
				// if key doesn't exist 
				if(target.children[0].children[1].innerHTML.indexOf(key[0])==-1||key[0]=="") {
					//document.getElementsByClassName('header')[i].style.cssText = "color: black"
				} 
				// if key exist
				else {
					if(key.length==1) {
						highlight(target, key[0]);
						//collect container that has to be openned 
						if(!containerCol.find(ele=>ele==container)&&container) {
							containerCol.push(container);
						}
						//上層的container也要一起打開
						if(container) {
							while(container.getAttribute('id')!='documentationNav') {
								if($((container).parentNode).hasClass('container')) {
										if(!containerCol.find(ele=>ele==(container).parentNode)) {
										containerCol.push((container).parentNode);
									}
								}
								container = (container).parentNode;
							}
						}

					} else if(key.length>1) {
						findKey(target, key, 1);
					}
				}		
			}
		}
	}

	//close all container
	for(let count=0;count<document.getElementsByClassName('container').length;count++) {
		let container = document.getElementsByClassName('container')[count]
		let targetToggle = ((container).parentNode).children[0].children[0]
		//收起上一次打開但這一次沒開的container
		if($(targetToggle).hasClass('down')&&!containerCol.find(ele=>ele==container)) {
			$(targetToggle).toggleClass('down')
			$(container).toggle(100)
			setTimeout(() => {
				for(let i=0;i<container.children.length;i++) {
					if(container.children[i].children[0].children[1].children.length==0) container.children[i].style.cssText = "display: block"
				}
			}, 100)
		}
	}
	//open container
	if(containerCol.length!=0) {
		for(let count=0;count<containerCol.length;count++) {
			openContainer(containerCol[count])
		}
	}
	
	for(let count=0;count<containerCol.length;count++) {
		containerCol[count].parentNode.style.cssText = "display:block"
	}
	
	containerCol.length=0
}



document.getElementsByClassName('coreCode')[0].addEventListener('mouseenter', ()=>{
	document.getElementsByClassName('codeLineNoDiv')[0].children[0].style.cssText = "flex-shrink: 0";
})

document.getElementsByClassName('coreCode')[0].addEventListener('mouseleave', ()=>{
	document.getElementsByClassName('codeLineNoDiv')[0].children[0].style.cssText = "flex-shrink: 1";
})

document.getElementById("clearSearchBar").addEventListener('mouseenter', ()=>{
	document.getElementById("clearSearchBar").style.cssText = "color: red";
})

document.getElementById("clearSearchBar").addEventListener('mouseleave', ()=>{
	document.getElementById("clearSearchBar").style.cssText = "color: black";
})

document.getElementById("clearSearchBar").addEventListener('click', ()=>{
	// clear search bar
	document.getElementById("searchKey").value = "";
	// clear the highlight
	for(let i=0;i<document.getElementsByClassName('dirLinkItem').length;i++) {
		let target = document.getElementsByClassName('dirLinkItem')[i];
		if(target.children[0].children[1].children.length>1) {
			let innerTxt = ""
			for(let j=0;j<target.children[0].children[1].children.length;j++) {
				innerTxt = innerTxt + target.children[0].children[1].children[j].innerHTML;
			}
			target.children[0].children[1].innerHTML = innerTxt;
		}
	}
	// close all container
	for(let count=0;count<document.getElementsByClassName('container').length;count++) {
		let container = document.getElementsByClassName('container')[count];
		let targetToggle = ((container).parentNode).children[0].children[0];
		//收起上一次打開但這一次沒開的container
		if($(targetToggle).hasClass('down')&&!containerCol.find(ele=>ele==container)) {
			$(targetToggle).toggleClass('down');
			$(container).toggle(100);
			setTimeout(() => {
				for(let i=0;i<container.children.length;i++) {
					if(container.children[i].children[0].children[1].children.length==0) container.children[i].style.cssText = "display: block";
				}
			}, 100)
		}
	}
})


/**
 * Create a dirLinkItem header for Private or Public.
 * @param {Object} appendTarget - The target where the new node has to be appened.
 * @param {String} name - The new node's name.
 */
function createHeader_A(appendTarget, name) {
	let item = document.getElementsByClassName('dirLinkItem')[0];
	let node = item.cloneNode(true);
	node.children[0].children[1].innerHTML = name;
	node.children[0].children[1].style.color = "#0F4867";
	node.children[0].children[1].style.cursor = "default";
	node.children[0].children[1].classList.add('docTitle');
	node.classList.remove('nodisplay');
	node.children[0].children[0].classList.add('noShow');
	appendTarget.children[1].appendChild(node);
}

/**
 * Construct the class list on the left menu.
 * @param {Object} obj - The class to be created.
 * @param {Object} schema - The class's belong schema.
 * @param {Object} info - The information of the innerclass.
 * @param {String} recordHref - The class's href.
 * @param {Object} parent - The new node's parent.
 */
function constructClassMenu(obj, schema, info, recordHref, parent) {

	let staticMethods = [];
	let privateMethods = [];
	let publicMethods = [];
	let publicProperties = [];
	let privateProperties = [];
	let staticProperties = [];

	// fields
	for(let i=0;i<obj.fields.length;i++) {
		if(obj.fields[i].isPrivate) {
			privateProperties.push(obj.fields[i].name)
		} else if(obj.fields[i].isStatic) {
			staticProperties.push(obj.fields[i].name)
		} else {
			publicProperties.push(obj.fields[i].name)
		}
	}

	for(let i=0;i<obj.methods.length;i++) {
		if(obj.methods[i].isConstructor) {
			let item = document.getElementsByClassName('dirLinkItem')[0]
			let node = item.cloneNode(true)
			node.children[0].children[1].innerHTML = "Constructor"
			node.children[0].children[1].classList.add('docTitle')
			node.children[0].children[1].style.cssText = "font-weight: bold; color: rgb(152, 191, 206); cursor: default"
			node.classList.remove('nodisplay')
			node.children[0].children[0].classList.add('noShow')
			parent.children[1].appendChild(node)
		} else if(obj.methods[i].isStatic) {
			staticMethods.push(obj.methods[i])
		} else if(obj.methods[i].isPrivate) {
			privateMethods.push(obj.methods[i])
		} else {
			publicMethods.push(obj.methods[i])
		}
	}

	// create properties
	if(publicProperties.length>0||privateProperties.length>0) {
		let item = document.getElementsByClassName('dirLinkItem')[0];
		let node = item.cloneNode(true);
		node.children[0].children[1].innerHTML = "Properties";
		node.children[0].children[1].classList.add('docTitle');
		node.children[0].children[1].style.cssText = "font-weight: bold; color: rgb(152, 191, 206); cursor: default";
		node.classList.remove('nodisplay');
		parent.children[1].appendChild(node);
		let target;
		target = node;

		for(let j=0;j<target.children[1].children.length;j++) {
			if(target.children[1].children[j].children[0].children[1].innerHTML=="Properties") {
				target = target.children[1].children[j]
				break
			}
		}
		if(privateProperties.length>0) {
			let item = document.getElementsByClassName('dirLinkItem')[0]
			let node = item.cloneNode(true)
			node.children[0].children[1].innerHTML = "Private"
			node.children[0].children[1].classList.add('docTitle')
			node.children[0].children[1].style.cssText = "color: rgb(152, 191, 206); cursor: default"
			node.classList.remove('nodisplay')
			node.children[0].children[0].classList.add('noShow')
			target.children[1].appendChild(node)
			for(let n=0;n<privateProperties.length;n++) {
				let item = document.getElementsByClassName('dirLinkItem')[0]
				let node = item.cloneNode(true)
				node.children[0].children[1].innerHTML = privateProperties[n]
				node.classList.remove('nodisplay')
				node.children[0].children[0].classList.add('noShow')
				node.children[0].children[1].classList.add('clickBtn')
				target.children[1].appendChild(node)
			}
		}
		if(publicProperties.length>0) {
			let item = document.getElementsByClassName('dirLinkItem')[0]
			let node = item.cloneNode(true)
			node.children[0].children[1].innerHTML = "Public"
			node.children[0].children[1].classList.add('docTitle')
			node.children[0].children[1].style.cssText = "color: rgb(152, 191, 206); cursor: default"
			node.classList.remove('nodisplay')
			node.children[0].children[0].classList.add('noShow')
			target.children[1].appendChild(node)
			for(let n=0;n<publicProperties.length;n++) {
				let item = document.getElementsByClassName('dirLinkItem')[0]
				let node = item.cloneNode(true)
				node.children[0].children[1].innerHTML = publicProperties[n]
				node.classList.remove('nodisplay')
				node.children[0].children[0].classList.add('noShow')
				node.children[0].children[1].classList.add('clickBtn')
				node.children[0].children[1].addEventListener('click', ()=>{
					location.href = recordHref
				})
				target.children[1].appendChild(node)
			}
		}
	}

	// create methods
	if(privateMethods.length>0||publicMethods.length>0) {
		let item = document.getElementsByClassName('dirLinkItem')[0]
		let node = item.cloneNode(true)
		node.children[0].children[1].innerHTML = "Methods"
		node.children[0].children[1].classList.add('docTitle')
		node.children[0].children[1].style.cssText = "font-weight: bold; color: rgb(152, 191, 206); cursor: default"
		node.classList.remove('nodisplay')
		parent.children[1].appendChild(node)
		let target;
		target = node;

		let methodNode = node;
		// create private methods
		if(privateMethods.length>0) {
			
			createHeader_A(methodNode, "Private");

			for(let i=0;i<privateMethods.length;i++) {
				let item = document.getElementsByClassName('dirLinkItem')[0];
				let node = item.cloneNode(true);
				node.children[0].children[1].innerHTML = privateMethods[i].name + "()";
				node.classList.remove('nodisplay');
				node.children[0].children[1].classList.add('clickBtn');
				node.children[0].children[0].classList.add('noShow');
				node.children[0].children[1].addEventListener('click', ()=>{
					location.href = recordHref + "/" + privateMethods[i].name;
				})
				for(let j in privateMethods[i].parameters) {
					node.children[2].children[0].innerText += (privateMethods[i].parameters[j].name + " ")
				}
				for(let j in privateMethods[i].returns) {
					node.children[2].children[1].innerText += (privateMethods[i].returns[j].description + " ")
				}
				methodNode.children[1].appendChild(node);
			}
		}
		// create public methods
		if(publicMethods.length>0) {
			
			createHeader_A(methodNode, "Public");

			for(let i=0;i<publicMethods.length;i++) {
				let item = document.getElementsByClassName('dirLinkItem')[0];
				let node = item.cloneNode(true);
				node.children[0].children[1].innerHTML = publicMethods[i].name + "()";
				node.classList.remove('nodisplay');
				node.children[0].children[1].classList.add('clickBtn');
				node.children[0].children[0].classList.add('noShow');
				node.children[0].children[1].addEventListener('click', ()=>{
					location.href = recordHref + "/" + publicMethods[i].name;
				})
				for(let j in publicMethods[i].parameters) {
					node.children[2].children[0].innerText += (publicMethods[i].parameters[j].name + " ")
				}
				for(let j in publicMethods[i].returns) {
					node.children[2].children[1].innerText += (publicMethods[i].returns[j].description + " ")
				}
				methodNode.children[1].appendChild(node);
			}
		}
	}

	// create enumeration
	if(obj.enumerations.length>0) {
		let item = document.getElementsByClassName('dirLinkItem')[0];
		let node = item.cloneNode(true);
		node.children[0].children[1].innerHTML = "Enumerations";
		node.children[0].children[1].classList.add('docTitle');
		node.children[0].children[1].style.cssText = "font-weight: bold; color: rgb(152, 191, 206); cursor: default";
		node.classList.remove('nodisplay');
		parent.children[1].appendChild(node);
		let target;
		target = node;

		for(let i in obj.enumerations) {
			let item = document.getElementsByClassName('dirLinkItem')[0];
			let node = item.cloneNode(true);
			node.children[0].children[1].innerHTML = obj.enumerations[i].name;
			node.classList.remove('nodisplay');
			node.children[0].children[1].classList.add('clickBtn');
			node.children[0].children[0].classList.add('noShow');

			node.children[0].children[1].addEventListener('click', ()=>{
				location.href = recordHref + "/" + obj.enumerations[i].name;
			})

			target.children[1].appendChild(node);
		}
	}

	// create static method
	if(staticMethods.length>0) {
		let item = document.getElementsByClassName('dirLinkItem')[0]
		let node = item.cloneNode(true)
		node.children[0].children[1].innerHTML = "Static Methods"
		node.children[0].children[1].classList.add('docTitle')
		node.children[0].children[1].style.cssText = "font-weight: bold; color: rgb(152, 191, 206); cursor: default"
		node.classList.remove('nodisplay')
		parent.children[1].appendChild(node)
		let parentTarget = node;

		for(let i=0;i<staticMethods.length;i++) {
			let item = document.getElementsByClassName('dirLinkItem')[0]
			let node = item.cloneNode(true)
			node.children[0].children[1].innerHTML = staticMethods[i].name + "()"
			node.classList.remove('nodisplay')
			node.children[0].children[1].classList.add('clickBtn')
			node.children[0].children[0].classList.add('noShow')

			node.children[0].children[1].addEventListener('click', ()=>{
				location.href = recordHref + "/" + staticMethods[i].name
			})
			for(let j in staticMethods[i].parameters) {
				node.children[2].children[0].innerText += (staticMethods[i].parameters[j].name + " ")
			}
			for(let j in staticMethods[i].returns) {
				node.children[2].children[1].innerText += (staticMethods[i].returns[j].description + " ")
			}
			parentTarget.children[1].appendChild(node)
		}
	}

	// create static properties
	if(staticProperties.length>0) {
		let item = document.getElementsByClassName('dirLinkItem')[0]
		let node = item.cloneNode(true)
		node.children[0].children[1].innerHTML = "Static Properties"
		node.children[0].children[1].style.cssText = "font-weight: bold; color: rgb(152, 191, 206); cursor: default"
		node.classList.remove('nodisplay')
		parent.children[1].appendChild(node)
		let target;
		target = node;

		for(let j=0;j<target.children[1].children.length;j++) {
			if(target.children[1].children[j].children[0].children[1].innerHTML=="Static Properties") {
				target = target.children[1].children[j]
				break
			}
		}

		for(let n=0;n<staticProperties.length;n++) {
			let item = document.getElementsByClassName('dirLinkItem')[0]
			let node = item.cloneNode(true)
			node.children[0].children[1].innerHTML = staticProperties[n]
			node.classList.remove('nodisplay')
			node.children[0].children[0].classList.add('noShow')
			node.children[0].children[1].classList.add('clickBtn')
			target.children[1].appendChild(node)
		}		
	}

	if(obj.innerClasses.length>0) {
		let item = document.getElementsByClassName('dirLinkItem')[0];
		let node = item.cloneNode(true);
		node.children[0].children[1].innerHTML = "Inner Classes";
		node.children[0].children[1].classList.add('docTitle');
		node.children[0].children[1].style.cssText = "font-weight: bold; color: rgb(152, 191, 206); cursor: default";
		node.classList.remove('nodisplay');
		parent.children[1].appendChild(node);
		let target;
		target = node;
		
		let parentNode = node;

		let temp = [];
		temp.className = obj.name;
		temp.innerClasses = [];
		// create innerclass
		for(let i in obj.innerClasses) {
			for(let j in info.classes) {
				//console.log(info.classes[j]._id)
				if(info.classes[j]._id==obj.innerClasses[i]) {
					temp.innerClasses.push(Object.assign({}, info.classes[j]));
					let item = document.getElementsByClassName('dirLinkItem')[0];
					let node = item.cloneNode(true);
					node.children[0].children[1].innerText = info.classes[j].name;
					node.children[0].children[1].classList.add('clickBtn');
					node.classList.remove('nodisplay');

					// console.log(recordHref)
					node.children[0].children[1].addEventListener('click', ()=>{
						location.href = recordHref + "/" + info.classes[j]._id;
					})

					parentNode.children[1].appendChild(node);
					// console.log(node)
					let newParent = node;

					constructClassMenu(schema.classes[j], schema, info, (recordHref + "/" + info.classes[j]._id), newParent);
					break;
				}
			}
		}
		innerclassCollection.push(Object.assign({}, temp));
	}
}

/**
 * Create the tags under the right page.
 * @param {String} tagname - The tag that has to be created.
 */
function createTag(tagname) {
	item = document.getElementsByClassName('tag')[0];
	node = item.cloneNode(true);
	node.children[0].innerHTML = tagname;
	let tags = localStorage.getItem("tags").split(',');
	for(let i=0;i<tags.length;i++) {
		if(tags[i]===tagname) {
			node.style.backgroundColor = getTagColor(i);
			let nowHref = location.href.substring(0, location.href.indexOf("docUI")+5) + "/Tags/" + i;
			node.addEventListener('click', ()=>{
				location.href = nowHref;
			})
			break;
		}
	}
	document.getElementsByClassName('downTags')[0].appendChild(node);		
}

/**
 * Get the color of tag by it's index.
 * @param {Number} index - The tag's index.
 */
function getTagColor(index) {
	let tagsColor = ["#D57456", "#E0742D", "EBAB4B", "#A1986E", "#81863A", "#365545", "#388185", "#0F4867", "#384851", "#715075", "#4F3239", "#696758"];
	return tagsColor[index%12];
}

/**
 * Build the top directory by the href.
 * @param {String} href - The current page's href.
 */
function buildTopDirectory(href) {
	let temp = href.split('/');
	for(let i=0;i<temp.length;i++) {
		if(temp[i]==="docUI") {
			temp.splice(0,i+1);
			break;
		}
	}
	console.log(temp)
	for(let i=0;i<temp.length;i++) {
		if(i>0) {
			let div = document.createElement('div');
			div.innerHTML = "▶︎";
			div.style.color = "rgb(152, 191, 206)"
			document.getElementById('horDirectory').appendChild(div);
		}
		let a = document.createElement('a');
		a.innerText = temp[i];
		console.log(temp[i])
		for(let j in innerclassCollection) {
			for(let k in innerclassCollection[j].innerClasses) {
				if(innerclassCollection[j].innerClasses[k]._id==temp[i]) {
					a.innerText = innerclassCollection[j].innerClasses[k].name;
					break;
				}
			}
		}
		if(i==(temp.length-1)) {
			a.style.color = "#E0742D";
			a.style.fontWeight = "bold";
			a.style.cursor = "default";
		} else {
			a.style.color = "#0080FF";
			let nowHref = location.href.substring(0, location.href.indexOf('docUI')+5);
			for(let j=0;j<i+1;j++) {
				nowHref = nowHref + '/' + temp[j];
			}
			a.href = nowHref;
		}
		document.getElementById('horDirectory').appendChild(a);
	}
}

/**
 * Function to load a document site.
 */
function loadDocumentationSite() {
	let schemaNum = 0;
	if(sessionStorage.getItem('schemaNumber')) {
		schemaNum = sessionStorage.getItem('schemaNumber');
	} else {
		// add confirm
		return;
	}
	console.log(schemaNum)
	fetch('/getData', {
		method: 'POST',
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify({data: schemaNum*2})
	}).then(res => {
		return res.json();
	}).then(res => {
		console.log(res.docs)
		let schemaCol = res.docs.slice(0, schemaNum);
		let infoCollection = res.docs.slice(schemaNum, schemaNum*2);
		console.log(schemaCol)
		console.log(infoCollection)
		let innerClassIndex = [];
		
		// initial top
		document.getElementById('menuBtn').addEventListener('click', ()=>{
			if (document.getElementById('menuNav').style.width === "20em") {
				document.getElementById('menuNav').style.width = "0em";
				document.getElementById('menuNav').style.paddling = "0em 0em";
			} else {
				document.getElementById('menuNav').style.width = "20em";
				document.getElementById('menuNav').style.paddling = "1em 0.5em";
			}
		})
		for(let i=0;i<document.getElementsByClassName('topIcons').length;i++) {
			console.log(document.getElementsByClassName('topIcons')[i])
			let obj = document.getElementsByClassName('topIcons')[i];
			obj.addEventListener('mouseenter', ()=>{
				obj.children[0].style.cssText = "transform: scale(1.1, 1.1);"
				obj.addEventListener('transitionend', (e)=>{e.stopPropagation()})
			})
			obj.addEventListener('mouseleave', ()=>{
				obj.children[0].style.cssText ="border: 1em;"	
				obj.addEventListener('transitionend', (e)=>{e.stopPropagation()})
			})
		}
		document.getElementById('homeBtn').parentNode.href = location.href.substring(0, location.href.indexOf('docUI')+5);
		document.getElementById('goBackBtn').addEventListener('click', ()=>{
			let check = confirm("點擊後會返回Parser網站，目前資料將會遺失，是否繼續？");
			if(check) {
				location.href = "/";
			}
		})

		// initial taglist
		let temp = localStorage.getItem("tags").split(',');
		console.log(temp)
		if(!temp||(temp.length==1&&temp[0]=="")) {
			document.getElementById('tagsList').classList.add('close');
			document.getElementById('tagSearshBtn').classList.add('close');
		} else {
			document.getElementById('tagSearchBar').classList.remove('nodisplay');
			for(let i in temp) {
				let item = document.getElementsByClassName('dirLinkItem')[0];
				let node = item.cloneNode(true);
				node.classList.add('tagsForSearch');
				node.children[0].children[0].classList.add('noShow');
				node.children[0].children[1].innerHTML = temp[i];
				node.children[0].children[1].classList.add('clickBtn');
				node.classList.remove('nodisplay');
				node.children[0].children[1].addEventListener('click', ()=>{
					location.href = location.href.substring(0, location.href.indexOf("docUI")+5) + "/Tags/" + i; 
				})
				document.getElementById('tagsList').appendChild(node);
			}
		}

		let importsCollection = [];

		// initial the left nav
		for(let i=0;i<schemaCol.length;i++) {
			let recordHref = location.href.substring(0, location.href.indexOf("docUI")+5);

			let item = document.getElementsByClassName('dirLinkItem')[0];
			let node = item.cloneNode(true);
			node.children[0].children[1].innerHTML = schemaCol[i].path.substring(schemaCol[i].path.indexOf('/')+1)
			node.children[0].children[1].classList.add('clickBtn')
			node.classList.remove('nodisplay')

			recordHref = recordHref + "/" + schemaCol[i].path.substring(schemaCol[i].path.indexOf('/')+1)
			let href1 = recordHref
			node.children[0].children[1].addEventListener('click', ()=>{
				location.href = href1
			})
			document.getElementById('documentationNav').appendChild(node)
			let parentPathNode = node;

			// get imports
			if(schemaCol[i].imports.length>0) {

				let item = document.getElementsByClassName('dirLinkItem')[0];
				let node = item.cloneNode(true);
				node.children[0].children[1].innerHTML = "Imports";
				node.children[0].children[1].classList.add('docTitle');
				node.children[0].children[1].style.cssText = "font-weight: bold; color: rgb(152, 191, 206); cursor: default";
				node.classList.remove('nodisplay');
				//node.children[0].children[0].classList.add('noShow');
				parentPathNode.children[1].appendChild(node);
				let parentNode = node;

				for(let index in schemaCol[i].imports) {
					console.log(schemaCol[i].imports[index])
					for(let j in infoCollection) {
						for(let k in infoCollection[j].classes) {
							console.log(infoCollection[j].classes[k]._id)
							if(infoCollection[j].classes[k]._id==schemaCol[i].imports[index]) {
								let item = document.getElementsByClassName('dirLinkItem')[0];
								let node = item.cloneNode(true);
								node.children[0].children[1].innerHTML = infoCollection[j].classes[k].name;
								node.children[0].children[1].classList.add('clickBtn');
								node.classList.remove('nodisplay');
								parentNode.children[1].appendChild(node);

								let temp = {};
								temp.name = infoCollection[j].classes[k].name;
								temp.description = infoCollection[j].classes[k].description.description;
								importsCollection.push(Object.assign({}, temp));
							}
						}
					}
				}
			}

			// generate functions 
			for(let j=0;j<schemaCol[i].functions.length;j++) {
				let item = document.getElementsByClassName('dirLinkItem')[0]
				let node = item.cloneNode(true)
				node.classList.remove('nodisplay')
				node.children[0].children[0].classList.add('noShow')
				node.children[0].children[1].innerHTML = schemaCol[i].functions[j].name + "()"
				node.children[0].children[1].classList.add('clickBtn')

				node.children[0].children[1].addEventListener('click', ()=>{
					location.href = recordHref + "/" + schemaCol[i].functions[j].name
				})

				parentPathNode.children[1].appendChild(node)
			}

			let innerIndexComponent = [];
			// find the innerClass index
			for(let j=0;j<schemaCol[i].classes.length;j++) {
				if(schemaCol[i].classes[j].innerClasses.length>0) {
					for(let k=0;k<schemaCol[i].classes[j].innerClasses.length;k++) {
						for(let index=0;index<infoCollection[i].classes.length;index++) {
							if(infoCollection[i].classes[index]._id==schemaCol[i].classes[j].innerClasses[k]) {
								innerIndexComponent.push(index);
								break;
							}
						}
					}
				}
			}
			innerClassIndex.push(innerIndexComponent);

			// generate classes
			for(let j=0;j<schemaCol[i].classes.length;j++) {
				if(!innerIndexComponent.find(index=>index==j)) {
					let item = document.getElementsByClassName('dirLinkItem')[0]
					let node = item.cloneNode(true)
					node.children[0].children[1].innerHTML = schemaCol[i].classes[j].name
					node.children[0].children[1].classList.add('clickBtn')
					node.classList.remove('nodisplay')

					console.log(recordHref)
					node.children[0].children[1].addEventListener('click', ()=>{
						location.href = recordHref + "/" + schemaCol[i].classes[j].name
					})

					parentPathNode.children[1].appendChild(node);
					
					let parentClassNode = node;

					constructClassMenu(schemaCol[i].classes[j], schemaCol[i], infoCollection[i], (recordHref + "/" + schemaCol[i].classes[j].name), parentClassNode)
				}
			}
		}

		//add toggle event to dirLinkItemToggler
		for(let i=0;i<document.getElementsByClassName('dirLinkItemToggler').length;i++) {
			let obj = document.getElementsByClassName('dirLinkItemToggler')[i]
			obj.addEventListener('click', ()=>{
				//find dirLinkItem
				for(let j=0;j<document.getElementsByClassName('dirLinkItem').length;j++) {
					if(document.getElementsByClassName('dirLinkItem')[j].children[0].children[0]==obj) {
						$(document.getElementsByClassName('dirLinkItem')[j].children[1]).toggle(100)
					}
				}
				$(obj).toggleClass("down")
			})
		}

		// add under line effect
		addTxtUnderline()

		// hide the container
		for(let i=0;i<document.getElementsByClassName('container').length;i++) {
			$(document.getElementsByClassName('container')[i]).hide()
		}

		// original page
		if(location.href.length==location.href.indexOf('docUI')+5) {
			document.getElementById('homeScreen').classList.remove('nodisplay');
			for(let i in schemaCol) {
				let item = document.getElementById('listFilesFolders').children[0];
				let node = item.cloneNode(true);
				node.classList.remove('nodisplay');
				let temp = schemaCol[i].path.split('/');
				node.innerText = temp[temp.length-1];
				node.classList.add('clickBtn');
				node.addEventListener('click', ()=>{location.href=location.href + "/" + temp[temp.length-1]});
				document.getElementById('listFilesFolders').appendChild(node);
			}
			for(let i=0;i<document.getElementsByClassName("tileLink").length;i++) {
				let obj = document.getElementsByClassName("tileLink")[i]
				obj.addEventListener('mouseenter', ()=>{
					obj.style.cssText = "border: 1px solid #0F4867;box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;"
					//obj.children[0].style.cssText ="transform: scale(1.2, 1.2);"
					obj.addEventListener('transitionend', (e)=>{e.stopPropagation()})
				})
				obj.addEventListener('mouseleave', ()=>{
					obj.style.cssText = "border: 1px solid #0F4867;"
					//obj.children[0].style.cssText ="border: 1em;"
					obj.addEventListener('transitionend', (e)=>{e.stopPropagation()})
				})
			}
			addTxtUnderline();
		}
		// others page
		else {
			buildTopDirectory(location.href)
			let nowHref = location.href
			nowHref = nowHref.substring(nowHref.indexOf('docUI')+6)
			console.log(nowHref)
			let temp = nowHref.split('/')
			console.log(temp)
			let target = schemaCol;
			let schemaNo = 0;
			let innerIndex;
			let classes = {};
			// find the data by href
			let level = 0
			let tag = ""
			for(let i=0;i<temp.length;i++) {
				// files path
				if(i==0) {
					for(let j=0;j<schemaCol.length;j++) {
						if(schemaCol[j].path.substring(schemaCol[j].path.indexOf('/')+1)==temp[i]) {
							schemaNo = j;
							target = schemaCol[j];
							innerIndex = innerClassIndex[j];
							classes = schemaCol[j].classes;
							level = 0;
							console.log(target)
							break;
						}
					}
				} else if(i==1) {
					if(target.classes) {
						for(let j=0;j<target.classes.length;j++) {
							if(target.classes[j].name==temp[i]) {
								target = target.classes[j]
								console.log(target)
								level = 1
								tag = "class"
								break
							}
						}
					}
					if(target.functions) {
						for(let j=0;j<target.functions.length;j++) {
							if(target.functions[j].name==temp[i]) {
								target = target.functions[j]
								console.log(target)
								level = 1
								tag = "function"
								break
							}
						}
					}
				} else if(i==2) {
					if(target.methods) {
						for(let j=0;j<target.methods.length;j++) {
							if(target.methods[j].name==temp[i]) {
								target = target.methods[j]
								console.log(target)
								level = 2
								tag = "classMethod"
								break
							}
						}
					}

					if(target.enumerations) {
						for(let j in target.enumerations) {
							if(target.enumerations[j].name===temp[i]) {
								target = target.enumerations[j];
								level = 2;
								tag = "classEnum";
								break;
							}
						}
					}

					if(target.innerClasses) {
						for(let j in target.innerClasses) {
							if(target.innerClasses[j]===temp[i]) {
								for(let k in infoCollection[schemaNo].classes) {
									if(infoCollection[schemaNo].classes[k]._id==temp[i]) {
										target = schemaCol[schemaNo].classes[k];
										break;
									}
								}
								level = 1;
								tag = "innerClass";
								break;
							}
						}
					}
				} else if(i>2) {
					console.log(target)
					if(target.innerClasses) {
						for(let j in target.innerClasses) {
							if(target.innerClasses[j]===temp[i]) {
								for(let k in infoCollection[schemaNo].classes) {
									if(infoCollection[schemaNo].classes[k]._id==temp[i]) {
										target = schemaCol[schemaNo].classes[k];
										break;
									}
								}
								level = 1;
								tag = "innerClass";
								break;
							}
						}
					}
				}
			}
			console.log(target)
			// create conponent by data
			if(level==0) {
				let name = target.path.substring(target.path.indexOf('/')+1)
				document.getElementById('itemHeader').innerHTML = name
				document.getElementById('itemHeader').classList.remove('nodisplay')

				if(target.classes.length>0) {
					// create class section
					let item = document.getElementsByClassName('twoBlankSection')[0]
					let node = item.cloneNode(true)
					node.children[0].innerHTML = "Classes"
					node.children[1].children[0].innerHTML = "Name"
					node.children[1].children[1].innerHTML = "Description"
					node.classList.remove('nodisplay')
					document.getElementById('docummentationCore').appendChild(node)
					let parentNode = node.children[1]
					// add class section conponent
					for(let i=0;i<target.classes.length;i++) {
						if(!innerIndex.find(index=>index==i)) {
							item = document.getElementsByClassName('tableBlankL')[0]
							node = item.cloneNode(true)
							node.innerHTML = target.classes[i].name
							node.style.color = "#0080FF"
							node.classList.add('clickBtn')
							node.addEventListener('click', ()=>{
								location.href = location.href + '/' + target.classes[i].name
							})
							node.classList.remove('nodisplay')
							parentNode.appendChild(node)
							item = document.getElementsByClassName('tableBlankR')[0]
							node = item.cloneNode(true)
							node.innerHTML = target.classes[i].description.description
							node.classList.remove('nodisplay')
							parentNode.appendChild(node)
						}
					}
				}

				if(target.functions.length>0) {
					// create function section
					let parentSection = createTwoBlankSection("Global Functions", "Name", "Description").children[1];
					for(let i in target.functions) {
						createTwoBlankSectionComponent(parentSection, target.functions[i].name, target.functions[i].description.description, 1);
					}
				}

				if(target.imports.length>0) {
					let parentSection = createTwoBlankSection("Imports", "Name", "Description").children[1];
					for(let i in importsCollection) {
						createTwoBlankSectionComponent(parentSection, importsCollection[i].name, importsCollection[i].description, 0);
					}
				}
				addTxtUnderline()
			} 
			else if(level==1) {
				console.log(target)
				if(tag=="class"||tag=="innerClass") {
					document.getElementById('itemHeader').innerHTML = target.name;
					document.getElementById('itemHeader').classList.remove('nodisplay');
					document.getElementById('itemDescription').innerHTML = target.description.description;
					document.getElementById('itemDescription').classList.remove('nodisplay');

					if(target.extends) {
						document.getElementById('extendsSection').classList.remove('nodisplay');
						let parent = document.getElementById('extendsPath');
						let a = document.createElement("a");
						a.innerText = target.name;
						a.style.fontWeight = "bold";
						a.style.border = "1px solid #7DBEDF";
						a.style.backgroundColor = "#C4D5D988";
						parent.insertBefore(a, parent.firstChild);
						let extendTarget = target.extends;
						let endOfWhile = false;
						while(endOfWhile==false) {
							endOfWhile = true;
							let div = document.createElement("div");
							div.innerText = "⇐";
							parent.insertBefore(div, parent.firstChild);
							let a = document.createElement("a");
							a.innerText = extendTarget;
							let temp = location.href.split('/');
							let nowHref = "";
							for(let i=0;i<temp.length-1;i++) {
								nowHref+=temp[i] + '/';
							}
							nowHref += extendTarget;
							a.addEventListener('click', ()=>{
								location.href = nowHref;
							})
							a.classList.add('clickBtn');
							a.style.cursor = "pointer";
							parent.insertBefore(a, parent.firstChild);
							for(let i in classes) {
								console.log(classes[i].name)
								if(classes[i].name===extendTarget) {
									if(classes[i].extends) {
										extendTarget = classes[i].extends;
										endOfWhile = false;
										break;
									}
								}
							}
							if(endOfWhile) break;
						}
					}

					let staticMethodCol = [];
					let privateMethodCol = [];
					let publicMethodCol = [];
					let constructorCol = [];
					let publicFieldCol = [];
					let privateFieldCol = [];
					let staticFieldCol = [];
					if(target.methods.length>0) {

						for(let i=0;i<target.methods.length;i++) {

							if(target.methods[i].isStatic) {
								staticMethodCol.push(Object.assign({}, target.methods[i]))
							} else if(target.methods[i].isConstructor) {
								constructorCol.push(Object.assign({}, target.methods[i]))
							} else if(target.methods[i].isPrivate) {
								privateMethodCol.push(Object.assign({}, target.methods[i]))
							} else {
								publicMethodCol.push(Object.assign({}, target.methods[i]))
							}
						}
					}

					if(target.fields.length>0) {

						for(let i=0;i<target.fields.length;i++) {
							if(target.fields[i].isStatic) {
								staticFieldCol.push(Object.assign({}, target.fields[i]))
							} else if(target.fields[i].isPrivate) {
								privateFieldCol.push(Object.assign({}, target.fields[i]))
							} else {
								publicFieldCol.push(Object.assign({}, target.fields[i]))
							}
						}
					}

					if(constructorCol.length==1) {
						// create constructor section

						document.getElementById('functionCaller').classList.remove('nodisplay')
						document.getElementById('functionCaller').children[0].classList.remove('nodisplay')
						document.getElementById('functionCaller').children[0].innerHTML = "Constructor"

						let target = constructorCol[0]
						if (target.isStatic) {
							document.getElementsByClassName('codeKeyword')[0].innerHTML = "static function"
						} else if (target.isConstructor) {
							document.getElementsByClassName('codeKeyword')[0].innerHTML = "constructor"
						}
						span = document.createElement("span")
						span.innerHTML = "("
						span.classList.add("codeOps")
						document.getElementsByClassName('coreCode')[0].appendChild(span)
						if(target.parameters) {
							for(let i in target.parameters) {
								if(i!=0) {
									span = document.createElement("span");
									span.innerHTML = ", ";
									span.classList.add("codeOps");
									document.getElementsByClassName('coreCode')[0].appendChild(span);
								}
								span = document.createElement("span");
								span.innerHTML = target.parameters[i].name;
								span.classList.add("codeParam");
								document.getElementsByClassName('coreCode')[0].appendChild(span);
								if(target.parameters[i].default&&target.parameters[i].default!="Not Recorded") {
									span = document.createElement("span");
									span.innerHTML = " = ";
									span.classList.add("codeOps");
									document.getElementsByClassName('coreCode')[0].appendChild(span);
									span = document.createElement("span");
									span.innerHTML = target.parameters[i].default;
									document.getElementsByClassName('coreCode')[0].appendChild(span);
								}
							}
						}
						span = document.createElement("span")
						span.innerHTML = ")"
						span.classList.add("codeOps")
						document.getElementsByClassName('coreCode')[0].appendChild(span)
					
						document.getElementsByClassName('coreInfo')[0].innerHTML = target.description.description
						let filelinedata = target.lineNo
						getCodeLine(filelinedata)
						let fileUpdatedData = target.description
						getUpdatedInfo(fileUpdatedData)

						if(constructorCol[0].parameters.length>0) {
							// create constructor parameter section
							let parentSection = createTBS("Constructor Parameters", "Name", "Data Type", "Description").children[1];
							for(let i in constructorCol[0].parameters) {
								console.log(constructorCol[0].parameters[i])
								createTBSComponent(parentSection, constructorCol[0].parameters[i].name, constructorCol[0].parameters[i].type, constructorCol[0].parameters[i].description, 0);
							}
						}
					}

					if(privateFieldCol.length>0||publicFieldCol.length>0) {
						let item = document.getElementById("headerSection")
						console.log(item)
						let node = item.cloneNode(true)
						node.children[0].innerHTML = "Properties"
						node.classList.remove("nodisplay")
						document.getElementById('docummentationCore').appendChild(node)
					}

					if(privateFieldCol.length>0) {
						// create private field section
						let item = document.getElementsByClassName('threeBlankSection')[0]
						let node = item.cloneNode(true)
						node.children[0].innerHTML = "Private"
						node.children[1].children[0].innerHTML = "Name"
						node.children[1].children[1].innerHTML = "Data Type"
						node.children[1].children[2].innerHTML = "Description"
						node.classList.remove('nodisplay')
						document.getElementById('docummentationCore').appendChild(node)
						let parentNode = node.children[1]

						for(let i=0;i<privateFieldCol.length;i++) {
							item = document.getElementsByClassName('tableBlankL')[0]
							node = item.cloneNode(true)
							node.innerHTML = privateFieldCol[i].name
							node.classList.remove('nodisplay')
							parentNode.appendChild(node)
							item = document.getElementsByClassName('tableBlankM')[0]
							node = item.cloneNode(true)
							node.innerHTML = privateFieldCol[i].type
							node.classList.remove('nodisplay')
							parentNode.appendChild(node)
							item = document.getElementsByClassName('tableBlankR')[0]
							node = item.cloneNode(true)
							node.innerHTML = privateFieldCol[i].description.description
							node.classList.remove('nodisplay')
							parentNode.appendChild(node)
						}

					}

					if(publicFieldCol.length>0) {
						// create public field section
						let parentSection = createTBS("Public", "Name", "Data Type", "Description").children[1];
						for(let i in publicFieldCol) {
							createTBSComponent(parentSection, publicFieldCol[i].name, publicFieldCol[i].type, publicFieldCol[i].description.description, 0);
						}
					}

					if(publicMethodCol.length>0||privateMethodCol.length>0) {
						let item = document.getElementById("headerSection");
						let node = item.cloneNode(true);
						node.children[0].innerHTML = "Methods";
						node.classList.remove("nodisplay");
						document.getElementById('docummentationCore').appendChild(node);

						if(privateMethodCol.length>0) {
							let parentSection = createTBS("Private", "Name", "Returns Type", "Description").children[1];
							for(let i=0;i<privateMethodCol.length;i++) {
								let returnObj;
								if(privateMethodCol[i].returns.length>0) {
									returnObj = privateMethodCol[i].returns[0].type;
								} else {
									returnObj = " ";
								}
								createTBSComponent(parentSection, privateMethodCol[i].name, returnObj, privateMethodCol[i].description.description, 1);
							}
						}

						if(publicMethodCol.length>0) {
							let parentSection = createTBS("Public", "Name", "Returns Type", "Description").children[1];
							for(let i=0;i<publicMethodCol.length;i++) {
								console.log(publicMethodCol[i].returns)
								let returnObj;
								if(publicMethodCol[i].returns.length>0) {
									returnObj = publicMethodCol[i].returns[0].type;
								} else {
									returnObj = " ";
								}
								createTBSComponent(parentSection, publicMethodCol[i].name, returnObj, publicMethodCol[i].description.description, 1);
							}
						}
					}

					if(target.enumerations.length>0) {
						let parentSection = createTwoBlankSection("Enumerations", "Name", "Description").children[1];
						for(let i in target.enumerations) {
							createTwoBlankSectionComponent(parentSection, target.enumerations[i].name, target.enumerations[i].description.description, 1);
						}
					}

					console.log(staticFieldCol)
					if(staticFieldCol.length>0) {
						let parentSection = createTBS("Static Properties", "Name", "Data Type", "Description").children[1];
						for(let i in staticFieldCol) {
							createTBSComponent(parentSection, staticFieldCol[i].name, staticFieldCol[i].type, staticFieldCol[i].description.description, 0);
						}
					}

					if(staticMethodCol.length>0) {
						let parentSection = createTBS("Static Methods", "Name", "Returns Type", "Description").children[1];
						for(let i in staticMethodCol) {
							let returnObj;
							if(staticMethodCol[i].returns.length>0) {
								returnObj = staticMethodCol[i].returns[0].type;
							} else {
								returnObj = " ";
							}
							createTBSComponent(parentSection, staticMethodCol[i].name, returnObj, staticMethodCol[i].description.description, 1);
						}
					}

					if(target.innerClasses.length>0) {
						console.log(innerclassCollection)
						for(let i in innerclassCollection) {
							if(innerclassCollection[i].className==target.name) {
								let parentSection = createTwoBlankSection("Inner Classes", "Name", "Description").children[1];
								for(let j in innerclassCollection[i].innerClasses) {
									createTwoBlankSectionComponent_I(parentSection, innerclassCollection[i].innerClasses[j].name, innerclassCollection[i].innerClasses[j].description.description, innerclassCollection[i].innerClasses[j]._id);
								}
								break;
							}
						}
					}

					addTxtUnderline()

				} else if(tag=="function") {
					document.getElementById('itemHeader').innerHTML = target.name + "()";
					document.getElementById('itemHeader').classList.remove('nodisplay');

					document.getElementById('itemHeader').classList.remove('nodisplay')
					document.getElementById('functionCaller').classList.remove('nodisplay')

					console.log(target)

					if (target.isStatic) {
						document.getElementsByClassName('codeKeyword')[0].innerHTML = "static function"
					} else if (target.isConstructor) {
						document.getElementsByClassName('codeKeyword')[0].innerHTML = "constructor"
					}
					let span = document.createElement("span");
					if(target.name.charAt(0)==="#") {
						span.innerHTML = "#";
						span.style.opacity = "0.5";
						document.getElementsByClassName('coreCode')[0].appendChild(span);
						span = document.createElement("span");
						span.innerHTML = target.name.substring(1);
						document.getElementsByClassName('coreCode')[0].appendChild(span);
					} else {
						span.innerHTML = target.name;
						document.getElementsByClassName('coreCode')[0].appendChild(span);
					}
					span = document.createElement("span")
					span.innerHTML = "("
					span.classList.add("codeOps")
					document.getElementsByClassName('coreCode')[0].appendChild(span)
					if(target.parameters) {
						for(let i=0;i<target.parameters.length;i++) {
							if(i!=0) {
								span = document.createElement("span")
								span.innerHTML = ", "
								span.classList.add("codeOps")
								document.getElementsByClassName('coreCode')[0].appendChild(span)
							}
							span = document.createElement("span")
							span.innerHTML = target.parameters[i].name
							span.classList.add("codeParam")
							document.getElementsByClassName('coreCode')[0].appendChild(span)
						}
					}
					span = document.createElement("span")
					span.innerHTML = ")"
					span.classList.add("codeOps")
					document.getElementsByClassName('coreCode')[0].appendChild(span)
				
					document.getElementsByClassName('coreInfo')[0].innerHTML = target.description.description
					let filelinedata = target.lineNo
					getCodeLine(filelinedata)
					let fileUpdatedData = target.description
					getUpdatedInfo(fileUpdatedData)

					if(target.parameters.length>0) {
						let parentSection = createTBS("Parameters", "Name", "Data Type", "Description").children[1];
						for(let i in target.parameters) {
							createTBSComponent(parentSection, target.parameters[i].name, target.parameters[i].type, target.parameters[i].description, 0);
						}
					}

					if(target.returns.length>0) {
						let parentSection = createTwoBlankSection("Returns", "Data Type", "Description").children[1];
						for(let i in target.parameters) {
							createTwoBlankSectionComponent(parentSection, target.returns[i].type, target.returns[i].description, 0);
						}
					}
				}
			} else if(level==2) {
				if(tag==="classMethod") {
					if(target.description.isDeprecated) {
						document.getElementsByClassName('upTags')[0].classList.remove('nodisplay')
						document.getElementById('itemHeader').style.textDecoration = "line-through";
					} else {
						
					}
					let name = target.name;
					console.log(name.charAt(0))
					console.log(name.charAt(0)==="#")
					if(name.charAt(0)==="#") {
						document.getElementById('itemHeader').innerHTML = "";
						let span = document.createElement("span");
						span.innerHTML = "#";
						span.style.opacity = "0.5";
						document.getElementById('itemHeader').append(span);
						span = document.createElement("span");
						span.innerHTML = name.substring(1);
						document.getElementById('itemHeader').append(span);
					} else if(name.charAt(0)==="_") {
						let item = document.getElementById("moreInfo");
						let node = item.cloneNode(true);
						node.children[0].innerHTML = "Private Field Notes: ";
						node.children[1].innerHTML = "This field is not yet upgraded to the latest JavaScript standard, and is subject to changes in the future.";
						node.classList.remove("nodisplay");
						document.getElementById('docummentationCore').appendChild(node);


						document.getElementById('itemHeader').innerHTML = target.name + "()";
					} else {
						document.getElementById('itemHeader').innerHTML = target.name + "()";
					}
					document.getElementById('itemHeader').classList.remove('nodisplay')
					document.getElementById('functionCaller').classList.remove('nodisplay')

					console.log(target)

					if (target.isStatic) {
						document.getElementsByClassName('codeKeyword')[0].innerHTML = "static function"
					} else if (target.isConstructor) {
						document.getElementsByClassName('codeKeyword')[0].innerHTML = "constructor"
					}
					let span = document.createElement("span");
					if(target.name.charAt(0)==="#") {
						span.innerHTML = "#";
						span.style.opacity = "0.5";
						document.getElementsByClassName('coreCode')[0].appendChild(span);
						span = document.createElement("span");
						span.innerHTML = target.name.substring(1);
						document.getElementsByClassName('coreCode')[0].appendChild(span);
					} else {
						span.innerHTML = target.name;
						document.getElementsByClassName('coreCode')[0].appendChild(span);
					}
					span = document.createElement("span")
					span.innerHTML = "("
					span.classList.add("codeOps")
					document.getElementsByClassName('coreCode')[0].appendChild(span)
					if(target.parameters) {
						for(let i=0;i<target.parameters.length;i++) {
							if(i!=0) {
								span = document.createElement("span")
								span.innerHTML = ", "
								span.classList.add("codeOps")
								document.getElementsByClassName('coreCode')[0].appendChild(span)
							}
							if(target.parameters[i].isRest) {
								span = document.createElement("span");
								span.classList.add("codeOps");
								span.innerText = "...";
								document.getElementsByClassName('coreCode')[0].appendChild(span);
							}
							span = document.createElement("span")
							span.innerText = target.parameters[i].name;
							span.classList.add("codeParam")
							document.getElementsByClassName('coreCode')[0].appendChild(span)

							if(target.parameters[i].default&&target.parameters[i].default!="Not Recorded") {
								span = document.createElement("span");
								span.innerHTML = " = ";
								span.classList.add("codeOps");
								document.getElementsByClassName('coreCode')[0].appendChild(span);
								span = document.createElement("span");
								span.innerHTML = target.parameters[i].default;
								document.getElementsByClassName('coreCode')[0].appendChild(span);
							}
						}
					}
					span = document.createElement("span")
					span.innerHTML = ")"
					span.classList.add("codeOps")
					document.getElementsByClassName('coreCode')[0].appendChild(span)
				
					document.getElementsByClassName('coreInfo')[0].innerHTML = target.description.description
					let filelinedata = target.lineNo
					getCodeLine(filelinedata)
					let fileUpdatedData = target.description
					getUpdatedInfo(fileUpdatedData)

					if(target.parameters.length>0) {
						let parentSection = createTBS("Parameters", "Name", "Data Type", "Description").children[1];
						for(let i in target.parameters) {
							createTBSComponent(parentSection, target.parameters[i].name, target.parameters[i].type, target.parameters[i].description, 0);
						}
					}

					if(target.returns.length>0) {
						let parentSection = createTwoBlankSection("Returns", "Data Type", "Description").children[1];
						for(let i in target.returns) {
							createTwoBlankSectionComponent(parentSection, target.returns[i].type, target.returns[i].description, 0);
						}
					}
					
					for(let i=0;i<target.description.tags.length;i++) {
						// create tags component
						createTag(target.description.tags[i]);
						document.getElementById('tagsSection').classList.remove('nodisplay');
					}
				}

				else if(tag==="classEnum") {
					console.log(target)
					document.getElementById("itemHeader").innerText = target.name;
					document.getElementById("itemHeader").classList.remove('nodisplay');

					document.getElementById('itemDescription').innerText = target.description.description;
					document.getElementById('itemDescription').classList.remove('nodisplay');

					if(target.values.length>0) {
						let parentSection = createTBS("Name & Values", "Name", "Value", "Description").children[1];
						for(let i in target.values) {
							createTBSComponent(parentSection, target.values[i].name, target.values[i].value, target.values[i].description.description, 0)
						}
					}
				}
			} 
		}
	})
}

/**
 * Create a two blank section.
 * @param {String} header - The section's header name.
 * @param {String} blank1 - The section's blank1 title.
 * @param {String} blank2 - The section's blank2 title.
 */
function createTwoBlankSection(header, blank1, blank2) {
	let item = document.getElementsByClassName('twoBlankSection')[0];
	let node = item.cloneNode(true);
	node.children[0].innerHTML = header;
	node.children[1].children[0].innerHTML = blank1;
	node.children[1].children[1].innerHTML = blank2;
	node.classList.remove('nodisplay');
	document.getElementById('docummentationCore').appendChild(node);
	return node;
}

/**
 * Create a three blank section.
 * @param {String} header - The section's header name.
 * @param {String} blank1 - The section's blank1 title.
 * @param {String} blank2 - The section's blank2 title.
 * @param {String} blank2 - The section's blank3 title..
 */
function createTBS(header, blank1, blank2, blank3) {
	let item = document.getElementsByClassName('threeBlankSection')[0];
	let node = item.cloneNode(true);
	node.children[0].innerHTML = header;
	node.children[1].children[0].innerHTML = blank1;
	node.children[1].children[1].innerHTML = blank2;
	node.children[1].children[2].innerHTML = blank3;
	node.classList.remove('nodisplay');
	document.getElementById('docummentationCore').appendChild(node);
	return node;
}

/**
 * Create two blank section's conponent.
 * @param {Object} parent - The parent of these components.
 * @param {String} blank1 - The section's first component.
 * @param {String} blank2 - The section's second component.
 * @param {Number} mode - If mode is 1, then have to add link on it.
 */
function createTwoBlankSectionComponent(parent, blank1, blank2, mode) {
	let item = document.getElementsByClassName('tableBlankL')[0];
	let node = item.cloneNode(true);
	node.innerHTML = blank1;
	node.classList.remove('nodisplay');
	if(mode==1) {
		node.style.color = "#0080FF";
		node.classList.add('clickBtn');
		node.addEventListener('click', ()=>{
			location.href = location.href + '/' + blank1;
		})
	}
	if(parent.children[0].innerText.indexOf("Type")!=-1) {
		let target = node;
		target.innerText = "";
		let collect = createTypeComponent(blank1);
		//console.log(collect)
		for(let i in collect) {
			//console.log(collect[i].innerText)
			node.append(collect[i]);
		}
	}
	parent.appendChild(node);
	item = document.getElementsByClassName('tableBlankR')[0];
	node = item.cloneNode(true);
	node.innerHTML = blank2;
	node.classList.remove('nodisplay');
	parent.appendChild(node);
}

/**
 * Create two blank section's conponent (for innerclass).
 * @param {Object} parent - The parent of these components.
 * @param {String} blank1 - The section's first component.
 * @param {String} blank2 - The section's second component.
 * @param {String} id - The object's mongoose id.
 */
function createTwoBlankSectionComponent_I(parent, blank1, blank2, id) {
	let item = document.getElementsByClassName('tableBlankL')[0];
	let node = item.cloneNode(true);
	node.innerHTML = blank1;
	node.classList.remove('nodisplay');
	
	node.style.color = "#0080FF";
	node.classList.add('clickBtn');
	node.addEventListener('click', ()=>{
		location.href = location.href + '/' + id;
	})
	
	parent.appendChild(node);
	item = document.getElementsByClassName('tableBlankR')[0];
	node = item.cloneNode(true);
	node.innerHTML = blank2;
	node.classList.remove('nodisplay');
	parent.appendChild(node);
}

/**
 * Create threeBlankSection's components.
 * @param {Object} parent - The parent of these components.
 * @param {String} blank1 - The section's first component.
 * @param {String} blank2 - The section's second component.
 * @param {String} blank3 - The section's third component.
 * @param {Number} mode - Mode 0: original; Mode 1: blank1 has link.
 */
function createTBSComponent(parent, blank1, blank2, blank3, mode) {
	let item = document.getElementsByClassName('tableBlankL')[0];
	let node = item.cloneNode(true);
	node.innerHTML = blank1;
	if(mode==1) {
		node.style.color = "#0080FF";
		node.classList.add('clickBtn');
		node.addEventListener('click', ()=>{
			location.href = location.href + '/' + blank1;
		})
	}
	node.classList.remove('nodisplay');
	parent.appendChild(node);
	//console.log(parent.children[1].innerText)

	item = document.getElementsByClassName('tableBlankM')[0];
	node = item.cloneNode(true);
	if(blank2==="Not Recorded") {
		blank2 = " ";
	}
	node.innerText = blank2;
	node.classList.remove('nodisplay');
	parent.appendChild(node);
	if(parent.children[1].innerText.indexOf("Type")!=-1) {
		let target = node;
		target.innerText = "";
		let collect = createTypeComponent(blank2);
		//console.log(collect)
		for(let i in collect) {
			//console.log(collect[i].innerText)
			node.append(collect[i]);
		}
	}
	
	item = document.getElementsByClassName('tableBlankR')[0];
	node = item.cloneNode(true);
	if(blank3==="Not Recorded") {
		blank3 = " ";
	} 
	node.innerText = blank3;
	node.classList.remove('nodisplay');
	parent.appendChild(node);
}

/**
 * Create threeBlankSection's components (for tags section).
 * @param {Object} parent - The parent of these components.
 * @param {String} blank1 - The section's first component.
 * @param {String} blank2 - The section's second component.
 * @param {String} blank3 - The section's third component.
 * @param {String} tagPath - The tag's path.
 */
function createTBSComponent_T(parent, blank1, blank2, blank3, tagPath) {
	let item = document.getElementsByClassName('tableBlankL')[0];
	let node = item.cloneNode(true);
	node.innerHTML = blank1;
	node.style.color = "#0080FF";
	node.classList.add('clickBtn');
	node.addEventListener('click', ()=>{
		location.href = location.href.substring(0, location.href.indexOf("docUI")+5) + "/" + tagPath;
	})
	node.classList.remove('nodisplay');
	parent.appendChild(node);
	item = document.getElementsByClassName('tableBlankM')[0];
	node = item.cloneNode(true);
	if(blank2) node.innerHTML = blank2[0].type;
	else node.innerHTML = "";
	node.classList.remove('nodisplay');
	parent.appendChild(node);
	item = document.getElementsByClassName('tableBlankR')[0];
	node = item.cloneNode(true);
	node.innerHTML = blank3;
	node.classList.remove('nodisplay');
	parent.appendChild(node);
}

/**
 * Create the "type" component with the MDN site's link.
 * @param {String} str - The type's name.
 */
function createTypeComponent(str) {
	let returnCollection = [];
	let strIndex = -1;
	let objIndex = -1;
	let numIndex = -1;
	let arrIndex = -1;
	let booleanIndex = -1;
	let functionIndex = -1;
	while(1) {
		strIndex = str.toLowerCase().indexOf("string");
		objIndex = str.toLowerCase().indexOf("object");
		numIndex = str.toLowerCase().indexOf("number");
		arrIndex = str.toLowerCase().indexOf("array");
		booleanIndex = str.toLowerCase().indexOf("boolean");
		functionIndex = str.toLowerCase().indexOf("function");
		// compare index
		let temp = str.length;
		let selectCase = "";
		if(strIndex<temp&&strIndex!=-1) {
			temp = strIndex;
			selectCase = "String";
		}
		if(objIndex<temp&&objIndex!=-1) {
			temp = objIndex;
			selectCase = "Object";
		}
		if(numIndex<temp&&numIndex!=-1) {
			temp = numIndex;
			selectCase = "Number";
		}
		if(arrIndex<temp&&arrIndex!=-1) {
			temp = arrIndex;
			selectCase = "Array";
		}
		if(booleanIndex<temp&&booleanIndex!=-1) {
			temp = booleanIndex;
			selectCase = "Boolean";
		}
		if(functionIndex<temp&&functionIndex!=-1) {
			temp = functionIndex;
			selectCase = "Function";
		}
		if(selectCase!="") {
			span = document.createElement("span");
			span.innerText = str.substring(0, temp);
			returnCollection.push(Object.assign(span, {}));
			str = str.substring(temp);
			a = document.createElement("a");
			a.innerText = selectCase;
			a.href = "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/" + selectCase;
			returnCollection.push(Object.assign(a, {}));
			str = str.substring(selectCase.length);
		} else {
			span = document.createElement("span");
			span.innerText = str;
			returnCollection.push(Object.assign(span, {}));
			break;
		}
	}
	return returnCollection;
}

let param_switch = false;
let return_switch = false;

/**
 * Function to load advance search site.
 */
function loadAdvancedSearch() {
	// initial top
	document.getElementById('menuBtn').addEventListener('click', ()=>{
		if (document.getElementById('menuNav').style.width === "20em") {
			document.getElementById('menuNav').style.width = "0em";
			document.getElementById('menuNav').style.paddling = "0em 0em";
		} else {
			document.getElementById('menuNav').style.width = "20em";
			document.getElementById('menuNav').style.paddling = "1em 0.5em";
		}
	})
	for(let i=0;i<document.getElementsByClassName('topIcons').length;i++) {
		console.log(document.getElementsByClassName('topIcons')[i])
		let obj = document.getElementsByClassName('topIcons')[i];
		obj.addEventListener('mouseenter', ()=>{
			obj.children[0].style.cssText = "transform: scale(1.1, 1.1);"
			obj.addEventListener('transitionend', (e)=>{e.stopPropagation()})
		})
		obj.addEventListener('mouseleave', ()=>{
			obj.children[0].style.cssText ="border: 1em;"	
			obj.addEventListener('transitionend', (e)=>{e.stopPropagation()})
		})
	}
	document.getElementById('homeBtn').parentNode.href = location.href.substring(0, location.href.indexOf('loadAdvancedSearch')-1)+"docUI";
	document.getElementById('goBackBtn').addEventListener('click', ()=>{
		let check = confirm("點擊後會返回Parser網站，目前資料將會遺失，是否繼續？");
		if(check) {
			location.href = "/";
		}
	})
	document.getElementById('tagsList').classList.add('close');
	document.getElementById('tagSearshBtn').classList.add('close');

	document.getElementById('advancedSearchTitle').classList.remove('nodisplay');

	document.getElementById('searchSelection').classList.remove('nodisplay');
	for(let i=0;i<document.getElementsByClassName('searchSelectionBtn').length;i++) {
		let obj = document.getElementsByClassName('searchSelectionBtn')[i];
		obj.addEventListener('mouseenter', ()=>{
			obj.style.cssText = "box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;"
			if(i==0) {
				if(param_switch) {
					obj.style.backgroundColor = "#0F4867CC";
				} else {
					obj.style.backgroundColor = "#0F4867";
				}
			}
			else if(i==1) {
				if(return_switch) {
					obj.style.backgroundColor = "#0F4867CC";
				} else {
					obj.style.backgroundColor = "#0F4867";
				}
			}
			obj.addEventListener('transitionend', (e)=>{e.stopPropagation()})
		})
		obj.addEventListener('mouseleave', ()=>{
			obj.style.cssText ="border: 0em;"
			if(i==0) {
				if(param_switch) {
					obj.style.backgroundColor = "#0F4867CC";
				} else {
					obj.style.backgroundColor = "#0F4867";
				}
			}
			else if(i==1) {
				if(return_switch) {
					obj.style.backgroundColor = "#0F4867CC";
				} else {
					obj.style.backgroundColor = "#0F4867";
				}
			}
			obj.addEventListener('transitionend', (e)=>{e.stopPropagation()})
		})
		obj.addEventListener('click', ()=>{ 
			if(i==0) {
				if(return_switch) {
					alert("一次只能選擇一個選項！");
					return;
				}

				param_switch = !param_switch;
				if(param_switch) {
					obj.style.backgroundColor = "#0F4867CC";
				} else {
					obj.style.backgroundColor = "#0F4867";
				}
			}
			else if(i==1) {
				if(param_switch) {
					alert("一次只能選擇一個選項！");
					return;
				}

				return_switch = !return_switch;
				if(return_switch) {
					obj.style.backgroundColor = "#0F4867CC";
				} else {
					obj.style.backgroundColor = "#0F4867";
				}
			}
		})
	}

	// fetch data
	let schemaNum = 0;
	if(sessionStorage.getItem('schemaNumber')) {
		schemaNum = sessionStorage.getItem('schemaNumber');
	} else {
		// add confirm
		return;
	}
	fetch('/getData', {
		method: 'POST',
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify({data: schemaNum*2})
	}).then(res => {
		return res.json();
	}).then(res => {
		console.log(res.docs)
		let schemaCol = res.docs.slice(0, schemaNum);
		let infoCollection = res.docs.slice(schemaNum, schemaNum*2);
		console.log(schemaCol)
		console.log(infoCollection)
		let importsCollection = [];

		// initial the left nav
		for(let i=0;i<schemaCol.length;i++) {
			let recordHref = location.href.substring(0, location.href.indexOf("AdvancedSearch")) + "docUI";

			let item = document.getElementsByClassName('dirLinkItem')[0];
			let node = item.cloneNode(true);
			node.children[0].children[1].innerHTML = schemaCol[i].path.substring(schemaCol[i].path.indexOf('/')+1);
			node.children[0].children[1].classList.add('clickBtn');
			node.classList.remove('nodisplay');

			recordHref = recordHref + "/" + schemaCol[i].path.substring(schemaCol[i].path.indexOf('/')+1);
			let href1 = recordHref;
			node.children[0].children[1].addEventListener('click', ()=>{
				location.href = href1;
			})
			document.getElementById('documentationNav').appendChild(node);
			let parentPathNode = node;

			// get imports
			if(schemaCol[i].imports.length>0) {

				let item = document.getElementsByClassName('dirLinkItem')[0];
				let node = item.cloneNode(true);
				node.children[0].children[1].innerHTML = "Imports";
				node.children[0].children[1].classList.add('docTitle');
				node.children[0].children[1].style.cssText = "font-weight: bold; color: rgb(152, 191, 206); cursor: default";
				node.classList.remove('nodisplay');
				//node.children[0].children[0].classList.add('noShow');
				parentPathNode.children[1].appendChild(node);
				let parentNode = node;

				for(let index in schemaCol[i].imports) {
					console.log(schemaCol[i].imports[index])
					for(let j in infoCollection) {
						for(let k in infoCollection[j].classes) {
							console.log(infoCollection[j].classes[k]._id)
							if(infoCollection[j].classes[k]._id==schemaCol[i].imports[index]) {
								let item = document.getElementsByClassName('dirLinkItem')[0];
								let node = item.cloneNode(true);
								node.children[0].children[1].innerHTML = infoCollection[j].classes[k].name;
								node.children[0].children[1].classList.add('clickBtn');
								node.classList.remove('nodisplay');
								parentNode.children[1].appendChild(node);

								let temp = {};
								temp.name = infoCollection[j].classes[k].name;
								temp.description = infoCollection[j].classes[k].description.description;
								importsCollection.push(Object.assign({}, temp));
							}
						}
					}
				}
			}

			// generate functions 
			for(let j=0;j<schemaCol[i].functions.length;j++) {
				let item = document.getElementsByClassName('dirLinkItem')[0];
				let node = item.cloneNode(true);
				node.classList.remove('nodisplay');
				node.children[0].children[0].classList.add('noShow');
				node.children[0].children[1].innerHTML = schemaCol[i].functions[j].name + "()";
				node.children[0].children[1].classList.add('clickBtn');

				node.children[0].children[1].addEventListener('click', ()=>{
					location.href = recordHref + "/" + schemaCol[i].functions[j].name;
				})

				parentPathNode.children[1].appendChild(node);
			}

			// generate classes
			for(let j=0;j<schemaCol[i].classes.length;j++) {
				let item = document.getElementsByClassName('dirLinkItem')[0];
				let node = item.cloneNode(true);
				node.children[0].children[1].innerHTML = schemaCol[i].classes[j].name;
				node.children[0].children[1].classList.add('clickBtn');
				node.classList.remove('nodisplay');

				console.log(recordHref)
				node.children[0].children[1].addEventListener('click', ()=>{
					location.href = recordHref + "/" + schemaCol[i].classes[j].name;
				})

				parentPathNode.children[1].appendChild(node);
				
				let parentClassNode = node;

				constructClassMenu(schemaCol[i].classes[j], schemaCol[i], infoCollection[i], (recordHref + "/" + schemaCol[i].classes[j].name), parentClassNode);
			}
		}

		//add toggle event to dirLinkItemToggler
		for(let i=0;i<document.getElementsByClassName('dirLinkItemToggler').length;i++) {
			let obj = document.getElementsByClassName('dirLinkItemToggler')[i];
			obj.addEventListener('click', ()=>{
				//find dirLinkItem
				for(let j=0;j<document.getElementsByClassName('dirLinkItem').length;j++) {
					if(document.getElementsByClassName('dirLinkItem')[j].children[0].children[0]==obj) {
						$(document.getElementsByClassName('dirLinkItem')[j].children[1]).toggle(100);
					}
				}
				$(obj).toggleClass("down");
			})
		}

		// add under line effect
		addTxtUnderline();

		// hide the container
		for(let i=0;i<document.getElementsByClassName('container').length;i++) {
			$(document.getElementsByClassName('container')[i]).hide();
		}

	})
}

/**
 * Function to load tag site.
 */
function loadTagSite(tag) {

	// initial top
	document.getElementById('menuBtn').addEventListener('click', ()=>{
		if (document.getElementById('menuNav').style.width === "20em") {
			document.getElementById('menuNav').style.width = "0em";
			document.getElementById('menuNav').style.paddling = "0em 0em";
		} else {
			document.getElementById('menuNav').style.width = "20em";
			document.getElementById('menuNav').style.paddling = "1em 0.5em";
		}
	})
	for(let i=0;i<document.getElementsByClassName('topIcons').length;i++) {
		console.log(document.getElementsByClassName('topIcons')[i])
		let obj = document.getElementsByClassName('topIcons')[i];
		obj.addEventListener('mouseenter', ()=>{
			obj.children[0].style.cssText = "transform: scale(1.1, 1.1);"
			obj.addEventListener('transitionend', (e)=>{e.stopPropagation()})
		})
		obj.addEventListener('mouseleave', ()=>{
			obj.children[0].style.cssText ="border: 1em;"	
			obj.addEventListener('transitionend', (e)=>{e.stopPropagation()})
		})
	}
	document.getElementById('homeBtn').parentNode.href = location.href.substring(0, location.href.indexOf('docUI')+5);
	document.getElementById('goBackBtn').addEventListener('click', ()=>{
		let check = confirm("點擊後會返回Parser網站，目前資料將會遺失，是否繼續？");
		if(check) {
			location.href = "/";
		}
	})

	document.getElementById('tagsList').classList.add('close');
	document.getElementById('tagSearshBtn').classList.add('close');

	document.getElementById('itemHeader').innerHTML = tag;
	document.getElementById('itemHeader').classList.remove('nodisplay');
	buildTopDirectory(location.href);
	document.getElementById('horDirectory').lastChild.innerHTML = tag;
	let tags = localStorage.getItem("tags").split(',');
	fetch('/getTags', {
		method: 'POST',
		headers: {"Content-Type": "application/json"},
		body: JSON.stringify({data: tags.length})
	}).then(res => {
		return res.json()
	}).then(res => {
		console.log(res)
		let tagsCol = res.docs;
		
		for(let i in tagsCol) {
			// add the tag at left nav
			let item = document.getElementsByClassName('dirLinkItem')[0];
			let node = item.cloneNode(true);
			node.children[0].children[1].innerHTML = tagsCol[i].name;
			node.children[0].children[1].addEventListener('click', ()=>{
				for(let n in tags) {
					if(tags[n]===tagsCol[i].name) {
						location.href = location.href.substring(0, location.href.indexOf("docUI")+5) + "/Tags/" + n;
					}
				}
			})
			node.children[0].children[1].classList.add('clickBtn');
			node.classList.remove('nodisplay');
			document.getElementById('documentationNav').appendChild(node);
			let tagnode = node;

			if(tagsCol[i].methods.length>0) {
				// create the classes part at left nav
				let item = document.getElementsByClassName('dirLinkItem')[0];
				let node = item.cloneNode(true);
				node.children[0].children[1].innerHTML = "Methods";
				node.children[0].children[1].classList.add('docTitle');
				node.children[0].children[1].style.cssText = "font-weight: bold; color: rgb(152, 191, 206); cursor: default";
				node.classList.remove('nodisplay');
				tagnode.children[1].appendChild(node);
				let target = node;
				for(let j in tagsCol[i].methods) {
					let item = document.getElementsByClassName('dirLinkItem')[0];
					let node = item.cloneNode(true);
					node.children[0].children[1].innerHTML = tagsCol[i].methods[j].name;
					node.children[0].children[1].addEventListener('click', ()=>{
						location.href = location.href.substring(0, location.href.indexOf("docUI")+5) + "/" + tagsCol[i].methods[j].path;
					})
					node.children[0].children[1].classList.add('clickBtn');
					node.children[0].children[0].classList.add('noShow');
					node.classList.remove('nodisplay');
					target.children[1].appendChild(node);
				}
			}
		}

		for(let i in tagsCol) {
			if(tagsCol[i].name === tag) {

				if(tagsCol[i].methods.length>0) {
					let parentSection = createTBS("Methods", "Name", "Returns Type", "Description").children[1];
					for(let j in tagsCol[i].methods) {
						// create the classes part at right page
						createTBSComponent_T(parentSection, tagsCol[i].methods[j].name, tagsCol[i].methods[j].returnType, tagsCol[i].methods[j].description, tagsCol[i].methods[j].path);
					}
				}
				break;
			}
		}

		//add toggle event to dirLinkItemToggler
		for(let i=0;i<document.getElementsByClassName('dirLinkItemToggler').length;i++) {
			let obj = document.getElementsByClassName('dirLinkItemToggler')[i]
			obj.addEventListener('click', ()=>{
				//find dirLinkItem
				for(let j=0;j<document.getElementsByClassName('dirLinkItem').length;j++) {
					if(document.getElementsByClassName('dirLinkItem')[j].children[0].children[0]==obj) {
						$(document.getElementsByClassName('dirLinkItem')[j].children[1]).toggle(100)
					}
				}
				$(obj).toggleClass("down")
			})
		}

		// add under line effect
		addTxtUnderline()

		// hide the container
		for(let i=0;i<document.getElementsByClassName('container').length;i++) {
			$(document.getElementsByClassName('container')[i]).hide()
		}
	})
}

window.onload = ()=>{

	let check = location.href.split('/')
	for(let i=0;i<check.length;i++) {
		if(check[i] === "docUI") {
			if(check[i+1] === "Tags") {
				if(!check[i+2]) {
					loadTagSite("Tags");
				} else {
					let tags = localStorage.getItem("tags").split(',');
					loadTagSite(tags[check[i+2]]);
				}
			} else {
				loadDocumentationSite();
			}
			break;
		} else if(check[i] === "AdvancedSearch") {
			loadAdvancedSearch();
		}
	}
}

/**
 * Open the container.
 * @param {Object} container - The container that has to be openned.
 */
function openContainer(container) {
	for(let i=0;i<container.children.length;i++) {
		if(container.children[i].children[0].children[1].children.length==0) {
			container.children[i].style.cssText = "display: none"
		} else {
			container.children[i].style.cssText = "display: block"
		}
	}
	let targetToggle = ((container).parentNode).children[0].children[0]
	if($(targetToggle).hasClass('down')==false) {
		$(targetToggle).toggleClass('down')
		$(container).toggle(100)
	}
}

/**
 * Get the update data and change to right version.
 * @param {String} updateData - The description's information.
 */
function getUpdatedInfo(updateData) {
	console.log(updateData)
	document.getElementById("UpdatedBy").innerHTML = updateData.updatedBy
	let year = updateData.updatedDate.substring(0, 4)
	let month = updateData.updatedDate.substring(4, 6)
	month = getMonth(month)
	let day = updateData.updatedDate.substring(6, 8)
	document.getElementById("UpdateDate").innerHTML = month + " " + day + " ," + year
}

/**
 * Change month number to English string version.
 * @param {String} month - The month number.
 */
function getMonth(month) {
	let monthStr = " ";
	if(month==="01") monthStr = "January"
	else if(month==="02") monthStr = "Febuary"
	else if(month==="03") monthStr = "March"
	else if(month==="04") monthStr = "April"
	else if(month==="05") monthStr = "May"
	else if(month==="06") monthStr = "June"
	else if(month==="07") monthStr = "July"
	else if(month==="08") monthStr = "August"
	else if(month==="09") monthStr = "September"
	else if(month==="10") monthStr = "October"
	else if(month==="11") monthStr = "November"
	else if(month==="12") monthStr = "December"	
	return monthStr
}

/**
 * Change the description's information to the right lineNo version.
 * @param {String} filelinedata - The description's information.
 */
function getCodeLine(filelinedata) {
	console.log(filelinedata)
	document.getElementById("filename").innerHTML = filelinedata.substring(0, filelinedata.indexOf(' '));
	document.getElementById("linenum").innerHTML = filelinedata.substring(filelinedata.indexOf("Ln")+2, filelinedata.length);
}

/**
 * Add the underline effect on all clickBtn.
 */
function addTxtUnderline() {
	for(let i=0;i<document.getElementsByClassName('clickBtn').length;i++) {
		document.getElementsByClassName('clickBtn')[i].addEventListener('mouseenter', ()=>{
			//document.getElementsByClassName('clickBtn')[i].style.cssText = "text-decoration:underline"
			$(document.getElementsByClassName('clickBtn')[i]).css("text-decoration", "underline")
		})
		document.getElementsByClassName('clickBtn')[i].addEventListener('mouseleave', ()=>{
			//document.getElementsByClassName('clickBtn')[i].style.cssText = "text-decoration:none"
			$(document.getElementsByClassName('clickBtn')[i]).css("text-decoration", "none")
		})
	}
}
