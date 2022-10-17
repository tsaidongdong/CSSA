let parseSuccess = false,
    insertSuccess = false;
var file;
var files = [],
    texts = [];
let fileNum = 0;
var text;
let schemaCol = [];
let menuOpen = false;
/** Collect the input data. */
let inputCol = []
    /** Collect import */
let importCollection = []
    /** collect export */
let exportCollection = []
    /** Collect defaultExportCollection */
let defaultExportCollection = []
    /** Collect innerclass */
let innerclassCollection = []
    /** If true, stop all typeBtn click event. */
let stopAllBtn = false;
/** Collect all innerclasses's origin name. */
let originalNameCollection = [];


/** Add click event to fileBtn and folderBtn. */
document.getElementById('fileBtn').addEventListener('click', (e) => {
    if (stopAllBtn) return;
    document.getElementById("selectInputFile").style.cssText = "opacity: 0";
    e.stopPropagation();
    stopAllBtn = true;
    document.getElementById("selectInputFile").addEventListener("transitionend", () => {
        document.getElementById("page1").classList.remove("nodisplay");
        document.getElementById("selectInputFile").classList.add("nodisplay");
        document.getElementById("selectInputFile").style.cssText = "opacity: 1";
        stopAllBtn = false;
    })
})
document.getElementById('folderBtn').addEventListener('click', (e) => {
        if (stopAllBtn) return;
        document.getElementById("selectInputFile").style.cssText = "opacity: 0";
        e.stopPropagation();
        stopAllBtn = true;
        document.getElementById("selectInputFile").addEventListener("transitionend", () => {
            document.getElementById("page2").classList.remove("nodisplay");
            document.getElementById("selectInputFile").classList.add("nodisplay");
            document.getElementById("selectInputFile").style.cssText = "opacity: 1";
            stopAllBtn = false;
        })
    })
    /** Add event to typeBtn. */
for (let i = 0; i < document.getElementsByClassName("typeBtn").length; i++) {
    let obj = document.getElementsByClassName("typeBtn")[i]
    obj.addEventListener('mouseenter', () => {
        obj.style.cssText = "border: 1px solid rgb(25, 52, 123);box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;"
        obj.children[0].style.cssText = "transform: scale(1.2, 1.2);"
        obj.addEventListener('transitionend', (e) => { e.stopPropagation() })
    })
    obj.addEventListener('mouseleave', () => {
        obj.style.cssText = "border: 1px solid rgb(182,182,182);"
        obj.children[0].style.cssText = "border: 1em;"
        obj.addEventListener('transitionend', (e) => { e.stopPropagation() })
    })
}
/** Add event to startParseBtn. */
for (let i = 0; i < document.getElementsByClassName("startParseBtn").length; i++) {
    let obj = document.getElementsByClassName("startParseBtn")[i]
    obj.addEventListener('mouseenter', () => {
        obj.style.cssText = "border: 1px solid rgb(25, 52, 123);box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;"

        obj.addEventListener('transitionend', (e) => { e.stopPropagation() })
    })
    obj.addEventListener('mouseleave', () => {
        obj.style.cssText = "border: 1px solid rgb(182,182,182);"

        obj.addEventListener('transitionend', (e) => { e.stopPropagation() })
    })
}
/** Add click event to typeBtn. */
document.getElementById('pythonBtn').addEventListener('click', () => {
    if (stopAllBtn) return;
    alert("Python的Parser尚未實裝，敬請期待！")
})
document.getElementById("jsBtn").addEventListener('click', (e) => {
        if (stopAllBtn) return;
        document.getElementById("selectType").style.cssText = "opacity: 0";
        e.stopPropagation();
        stopAllBtn = true;
        document.getElementById("selectType").addEventListener("transitionend", () => {
            document.getElementById("selectType").classList.add("nodisplay");
            document.getElementById("selectType").style.cssText = "opacity: 1"
            document.getElementById("selectInputFile").classList.remove("nodisplay");
            stopAllBtn = false;
        })
    })
    /** Add click event to goback button. */
document.getElementById('goback').addEventListener('click', (e) => {
        var check = confirm("重新轉換將會刪除前一筆轉換完成的資料，是否繼續？")
        if (check) {
            document.getElementById("showResultPage").style.cssText = "opacity: 0"
            e.stopPropagation()
            document.getElementById("showResultPage").addEventListener("transitionend", () => {
                document.getElementById("showResultPage").classList.add("nodisplay");
                document.getElementById("showResultPage").style.cssText = "opacity: 1"
                window.location.reload()
            })
        }
    })
    /** Add click event to goToDB button. */
document.getElementById('goToDB').addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('loadingcircle').classList.remove('nodisplay')
    document.getElementById('loadingCanvas').classList.remove('nodisplay')
        //alert('功能維護中')
    fetch("/sendData", {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: schemaCol })
    }).then(res => {
        return res.json();
    }).then(data => {
        if (data.isSuccess) {
            // deal with innerclass
            for (let i in innerclassCollection) {
                for (let j in data.docs) {
                    if (data.docs[j].path == innerclassCollection[i].path) { // find the right file
                        for (let k in innerclassCollection[i].collectionSet) {
                            for (let l in schemaCol[j].classes) {
                                if (originalNameCollection[j][l] == innerclassCollection[i].collectionSet[k].className) {
                                    let tempCollection = [];
                                    for (let id in innerclassCollection[i].collectionSet[k].innerClassId) {
                                        let tempId = innerclassCollection[i].collectionSet[k].innerClassId[id];
                                        tempCollection.push(data.docs[j].classes[tempId]._id);
                                    }
                                    schemaCol[j].classes[l].innerClasses = tempCollection;
                                    break;
                                }
                            }
                        }
                        break;
                    }
                }
            }
            // deal with import and export
            linkModules(data.docs)
            fetch('/sendData', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data: schemaCol })
            }).then(res => {
                return res.json();
            }).then(data => {
                if (data.isSuccess) {
                    alert("insert successful");
                    document.getElementById('goToDB').classList.add('nodisplay');
                    document.getElementById('goToDocumentation').classList.remove('nodisplay');
                    sessionStorage.setItem("schemaNumber", schemaCol.length);
                    document.getElementById('loadingcircle').classList.add('nodisplay');
                    document.getElementById('loadingCanvas').classList.add('nodisplay');
                } else {
                    alert("failed to insert");
                    document.getElementById('loadingcircle').classList.add('nodisplay');
                    document.getElementById('loadingCanvas').classList.add('nodisplay');
                }
            })
        } else {
            alert("failed to insert");
            document.getElementById('loadingcircle').classList.add('nodisplay');
            document.getElementById('loadingCanvas').classList.add('nodisplay');
        }
    })

})

document.getElementById('goToDocumentation').addEventListener('click', () => {
        location.href = "/docUI";
    })
    /*
     * Put the mongoose id of import, export, default export to the schema.
     * param {obj} data - The old inserted schema that carry the mongoose id of import, export, default export.
     */
function linkModules(data) {
    // link import
    for (let i = 0; i < importCollection.length; i++) {
        let targetPath = importCollection[i].path;
        let imports = importCollection[i].imports;
        for (let j = 0; j < imports.length; j++) {
            let relativePath = findRelativePath(targetPath, imports[j].classpath);
            for (let k = 0; k < data.length; k++) {
                if (data[k].path == relativePath) {
                    for (let l = 0; l < data[k].classes.length; l++) {
                        if (data[k].classes[l].name == imports[j].classname) {
                            // push _id into import
                            for (let m = 0; m < schemaCol.length; m++) {
                                if (schemaCol[m].path == targetPath) {
                                    if (!schemaCol[m].imports) schemaCol[m].imports = [];
                                    schemaCol[m].imports.push(data[k].classes[l]._id);
                                    break
                                }
                            }
                            break
                        }
                    }
                    break
                }
            }
        }
    }
    // link export

    // link default export
}

/*
 * Find relative path by the import/export recorded path.
 */
function findRelativePath(path, importpath) {
    let collect = path.split('/');
    while (importpath.charAt(0) == '.') {
        importpath = importpath.substring(importpath.indexOf('.') + 1);
        collect.pop();
    }
    let relativePath = collect[0];
    collect.shift();
    while (collect.length > 0) {
        relativePath = relativePath + "/" + collect[0];
        collect.shift();
    }
    relativePath = relativePath + importpath;
    return relativePath;
}
/*
 * Add click event to startParseSingle button.
 * After the click event triggered, the parsing procedure of single JavaScript file will start.
 */
document.getElementById("startParseSingle").addEventListener('click', (e) => {
    e.stopPropagation();
    let value = document.getElementById("inputFile").value;
    if (!value) {
        alert("您尚未選擇檔案。");
    } else {
        if (value.endsWith("js")) {
            // show loading canvas
            document.getElementById('loadingcircle').classList.remove('nodisplay');
            document.getElementById('loadingCanvas').classList.remove('nodisplay');
            // call web worker to do the parsing procedure
            if (window.Worker) {
                var worker = new Worker(URL.createObjectURL(new Blob(["(" + worker_function.toString() + ")()"], { type: 'text/javascript' })));
                worker.postMessage(inputCol[0]);
                worker.addEventListener('message', function(e) {
                    // if have innerclass, push info into innerclassCollection
                    let nameCol = [];
                    for (let i in e.data[0].classes) {
                        nameCol.push(e.data[0].classes[i].name);
                    }
                    originalNameCollection.push(Object.assign({}, nameCol));
                    Object.keys(e.data[2]).forEach(i => {
                            let temp = {};
                            temp.className = e.data[2][i].name;
                            let idArr = [];
                            for (let j in e.data[2][i].innerClass) {
                                for (let k = 0; k < e.data[0].classes.length; k++) {
                                    //console.log(e.data[0].classes[k].name)
                                    if ((e.data[0].classes[k].name).trim() == (e.data[2][i].innerClass[j].innerclassName).trim()) {
                                        idArr.push(k);
                                        e.data[0].classes[k].name = e.data[2][i].innerClass[j].name;
                                        break;
                                    }
                                }
                            }
                            temp.innerClassId = idArr;
                            if (!innerclassCollection.find(ele => ele.path == e.data[0].path)) {
                                let obj = {};
                                obj.path = e.data[0].path;
                                obj.collectionSet = [];
                                innerclassCollection.push(Object.assign({}, obj));
                            }
                            for (let i in innerclassCollection) {
                                if (innerclassCollection[i].path == e.data[0].path) {
                                    innerclassCollection[i].collectionSet.push(Object.assign({}, temp));
                                }
                            }

                        })
                        // collect import and export
                    if (e.data[0].imports) {
                        if (e.data[0].imports.length != 0) {
                            let obj = {};
                            obj.path = e.data[0].path;
                            obj.imports = e.data[0].imports;
                            importCollection.push(Object.assign({}, obj));
                            delete e.data[0].imports;
                        }
                    }
                    if (e.data[0].exports) {
                        if (e.data[0].exports.length != 0) {
                            let obj = {};
                            obj.path = e.data[0].path;
                            obj.exports = e.data[0].exports;
                            exportCollection.push(Object.assign({}, obj));
                            delete e.data[0].exports;
                        }
                    }
                    if (e.data[0].defaultExport) {
                        if (e.data[0].defaultExport.length != 0) {
                            let obj = {};
                            obj.path = e.data[0].path;
                            obj.defaultExport = e.data[0].defaultExport;
                            defaultExportCollection.push(Object.assign({}, obj));
                            delete e.data[0].defaultExport;
                        }
                    }
                    schemaCol.push(Object.assign({}, e.data[0]));

                    // if have tags, collect them
                    let tagData = [];
                    let storageTags = [];
                    Object.keys(e.data[1]).forEach(key => {
                        tagData.push(Object.assign({}, e.data[1][key]));
                        storageTags.push(e.data[1][key].name)
                    })
                    localStorage.setItem("tags", storageTags);
                    // insert tag data into database
                    fetch("/sendTags", {
                            method: 'POST',
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ data: tagData })
                        }).then(res => {
                            return res.json();
                        }).then(data => {
                            //console.log(data)
                        })
                        // remove loading canvas
                    document.getElementById('loadingcircle').classList.add('nodisplay');
                    document.getElementById('loadingCanvas').classList.add('nodisplay');
                    alert("Parse success!");
                    // transition
                    document.getElementById('page1').style.opacity = "0";
                    document.getElementById('page1').addEventListener('transitionend', () => {
                        document.getElementById('page1').classList.add('nodisplay');
                        document.getElementById('page1').style.opacity = "1";
                        document.getElementById('showResultPage').classList.remove('nodisplay');
                    })
                }, false)
            }

        } else {
            alert("只能轉換JavaScript程式碼，請確認檔案格式。");
        }
    }
})

/*
 * Add click event to startParseMulti button.
 * After the click event triggered, the parsing procedure of whole selected folder's JavaScript files will start.
 */
document.getElementById("startParseMulti").addEventListener('click', (e) => {
    e.stopPropagation();
    let value = document.getElementById("inputFile2").value;
    if (!value) {
        alert("您尚未選擇檔案。");
    } else {
        document.getElementById('loadingcircle').classList.remove('nodisplay');
        document.getElementById('loadingCanvas').classList.remove('nodisplay');
        // get how many files need to parse
        let numToParse = 0
        for (let i = 0; i < inputCol.length; i++) {
            if (inputCol[i].name.endsWith("js")) numToParse++
        }
        // call parse
        for (let i = 0; i < inputCol.length; i++) {
            let parseTarget = inputCol[i]
            if (parseTarget.name.endsWith("js")) {
                if (window.Worker) {
                    var worker = new Worker(URL.createObjectURL(new Blob(["(" + worker_function.toString() + ")()"], { type: 'text/javascript' })));
                    worker.postMessage(parseTarget)
                    worker.addEventListener('message', function(e) {
                        // collect import and export
                        if (e.data[0].imports) {
                            if (e.data[0].imports.length != 0) {
                                let obj = {};
                                obj.path = e.data[0].path;
                                obj.imports = e.data[0].imports;
                                importCollection.push(Object.assign({}, obj));
                                delete e.data[0].imports;
                            }
                        }
                        if (e.data[0].exports) {
                            if (e.data[0].exports.length != 0) {
                                let obj = {}
                                obj.path = e.data[0].path;
                                obj.exports = e.data[0].exports;
                                exportCollection.push(Object.assign({}, obj));
                                delete e.data[0].exports;
                                console.log(e.data[0].exports);
                            }
                        }
                        if (e.data[0].defaultExport) {
                            if (e.data[0].defaultExport.length != 0) {
                                let obj = {};
                                obj.path = e.data[0].path;
                                obj.defaultExport = e.data[0].defaultExport;
                                defaultExportCollection.push(Object.assign({}, obj));
                                delete e.data[0].defaultExport;
                            }
                        }
                        schemaCol.push(Object.assign({}, e.data[0]));

                        if (schemaCol.length == numToParse) {
                            document.getElementById('loadingcircle').classList.add('nodisplay');
                            document.getElementById('loadingCanvas').classList.add('nodisplay');
                            alert("Parse success!");
                            //transition
                            document.getElementById('page2').style.opacity = "0";
                            document.getElementById('page2').addEventListener('transitionend', () => {
                                document.getElementById('page2').classList.add('nodisplay');
                                document.getElementById('page2').style.opacity = "1";
                                document.getElementById('showResultPage').classList.remove('nodisplay');
                            })
                        }
                    }, false)
                }
            }
        }


    }
})

document.getElementById("inputFile").addEventListener("change", (e) => {
    if (document.getElementsByClassName("viewFileFrame")[0].children.length > 1) {
        document.getElementsByClassName("viewFileFrame")[0].removeChild(document.getElementsByClassName("viewFileFrame")[0].lastChild);
    }
    let item = document.getElementsByClassName('viewFileContent')[0];
    let node = item.cloneNode(true);
    node.innerHTML = e.target.files[0].name;
    node.classList.remove('nodisplay');
    document.getElementsByClassName("viewFileFrame")[0].appendChild(node);
    readStartFile(e.target.files[0]);
}, false);

document.getElementById("inputFile2").addEventListener("change", (e) => {
    while (document.getElementsByClassName("viewFileFrame")[1].children.length > 1) {
        document.getElementsByClassName("viewFileFrame")[1].removeChild(document.getElementsByClassName("viewFileFrame")[1].lastChild);
    }
    for (let i = 0; i < e.target.files.length; i++) {
        let item = document.getElementsByClassName('viewFileContent')[1];
        let node = item.cloneNode(true);
        node.innerHTML = e.target.files[i].name;
        node.classList.remove('nodisplay');
        document.getElementsByClassName("viewFileFrame")[1].appendChild(node);
    }
    for (let i = 0; i < e.target.files.length; i++) {
        readStartFile(e.target.files[i]);
    }
}, true);

document.getElementById("create2").addEventListener('click', () => {
    document.getElementById("loadingCanvas").setAttribute('style', 'display:inline');
    document.getElementById("loadingcircle").setAttribute('style', 'display:inline');
    fetch("/sendData", {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: schemaCol[0] })
    }).then(res => {
        return res.json();
    }).then(data => {
        document.getElementById("loading").setAttribute('style', '-webkit-animation:loading 0s');
        document.getElementById("loadingCanvas").setAttribute('style', 'display:none');
        document.getElementById("loadingcircle").setAttribute('style', 'display:none');
        if (data.isSuccess) {
            alert("insert successful");
            parseSuccess = false;
            insertSuccess = true;
        } else {
            alert("failed to insert");
        }
        document.getElementById("create").setAttribute('style', 'display:none');
        document.getElementById("frame1").setAttribute('style', 'opacity :0');
        window.scrollTo(0, 0)
    })
})

/**
 * Read and get input file's name and content
 */
function readStartFile(e) {
    let file = e;
    //console.log(file);
    let col = {};
    if (file.webkitRelativePath != "") {
        col.name = file.webkitRelativePath;
    } else {
        col.name = file.name;
    }
    document.getElementById("parsedFileName").innerText = file.name;
    readFile(file, function(e) {
        let text = e.target.result;
        col.content = text;
        inputCol.push(Object.assign({}, col));
    })

    function readFile(file, onLoadCallback) {
        var reader = new FileReader();
        reader.onload = onLoadCallback;
        reader.readAsText(file);
    }
}

document.getElementById("inputFile2").addEventListener("change", () => {
    files = [];
    fileNum = document.getElementById("inputFile2").files.length;
    for (let i = 0; i < fileNum; i++) {
        if (document.getElementById("inputFile2").files[i].type == "text/javascript" ||
            document.getElementById("inputFile2").files[i].type == "text/x-python-script") {
            files[i] = document.getElementById("inputFile2").files[i];
        }
    }
}, false);

document.getElementById("inputToDoc").addEventListener('click', () => {
        if (insertSuccess) {
            fetch("/callData", {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data: schemaCol[0].path })
            }).then(res => {
                return res.json();
            }).then(res => {
                //console.log(res.docs)
            })
        } else if (!insertSuccess && !parseSuccess) {
            alert("Parse hasn't done yet.")
        } else {
            alert("Insert had failed.")
        }
    })
    /*
     * Web worker that will call parse().
     */
function worker_function() {
    self.addEventListener('message', function(e) {
        setTimeout(() => {
            let returnData = Parse.parse(e.data.name, e.data.content)
                //console.log(returnData)
            self.postMessage(returnData)
        }, 1000)
    }, false);

    let modelSchema = {
        // 程式碼資料夾路徑
        path: " ",
        // 對本文件的描述
        description: {
            description: "",
            updatedBy: [""],
            isBeta: false,
            updatedDate: ""
        },
        classes: [],
        functions: []
    }

    let tagSchemas = [];

    class Parse {
        /**
         * Get the end index of a pair of {}.
         * @param {String} temp - The code section that we want to find the end index.
         * @param {String} start - The left parentheses, could be '(', '{', or other kind of parentheses.
         * @param {String} start - The right parentheses, could be ')', '}', or other kind of parentheses.
         */
        static getEndIndex(temp, start, end) {
            let index = 0;
            let parenthesesCount = 0;
            do {
                if (temp.indexOf(start) < temp.indexOf(end) && temp.indexOf(start) != -1) {
                    parenthesesCount++;
                    index += (temp.indexOf(start) + 1);
                    temp = temp.substring(temp.indexOf(start) + 1);
                } else if ((temp.indexOf(start) > temp.indexOf(end) && temp.indexOf(end) != -1) || (temp.indexOf(start) < temp.indexOf(end) && temp.indexOf(start) == -1)) {
                    parenthesesCount--;
                    index += (temp.indexOf(end) + 1);
                    temp = temp.substring(temp.indexOf(end) + 1);
                }
            } while (parenthesesCount != 0)
            return index;
        }

        /**
         * Get name, default, isRest of a parameter.
         * @param {String} param - The information of parameter from the methods.
         * @param {String} annoToParam - The information of parameter from the annotations. 
         */
        static parseParameter(param, annoToParam) {
                let paramCol = [];
                let temp = param.substring(1, param.length - 1).split(",");
                if (temp.length == 1) {
                    temp[0] = temp[0].trim();
                    if (temp[0] == "") return paramCol;
                }
                for (let i in temp) {
                    let paramComponent = {};
                    let partition = temp[i].split('=');
                    //console.log(partition)
                    if (partition.length == 1) {
                        partition[0] = partition[0].trim();
                        if (partition[0].substring(0, 3) == "...") {
                            paramComponent.isRest = true;
                            partition[0] = partition[0].substring(3);
                        }
                        paramComponent.name = partition[0];
                        paramComponent.default = "Not Recorded";
                    } else if (partition.length > 1) {
                        partition[0] = partition[0].trim();
                        if (partition[0].substring(0, 3) == "...") {
                            paramComponent.isRest = true;
                            partition[0] = partition[0].substring(3);
                        }
                        paramComponent.name = partition[0];
                        paramComponent.default = partition[1].trim();
                    }

                    // combine paramCol and annoToParam
                    if (annoToParam.length == 0) {
                        for (let i = 0; i < temp.length; i++) {
                            paramComponent.type = "Not Recorded";
                            paramComponent.description = "Not Recorded";
                        }
                    } else {
                        for (let i in temp) {
                            for (let j in annoToParam) {
                                if (annoToParam[j].name == paramComponent.name) {
                                    paramComponent.type = annoToParam[j].type;
                                    paramComponent.description = annoToParam[j].description;
                                    break;
                                } else {
                                    if (j == annoToParam.length - 1) {
                                        paramComponent.type = "Not Recorded";
                                        paramComponent.description = "Not Recorded";
                                    }
                                }
                            }
                        }
                    }
                    paramCol.push(Object.assign({}, paramComponent));
                }

                //console.log(paramCol)
                return paramCol;
            }
            /*
             * Count the total line numbers of input.
             * @param {String} data - The input code section.
             */
        static countLine(data) {
            let temp = data.split('\n');
            return temp.length;
        }

        /**
         * Parse description.
         * @param {String} anno - The annotation of description (need to cut "//", "/*" first)
         */
        static parseDescription(anno) {
            anno.trim();
            //console.log(anno)
            var descriptionArr = {};
            // only description
            if (anno.indexOf("---") == -1) {
                if (anno.length != 0) {
                    descriptionArr.description = anno
                } else {
                    descriptionArr.description = " "
                }
                descriptionArr.updatedDate = "no record"
            }
            // description with more info
            else {
                // description
                descriptionArr.description = anno.substring(0, anno.indexOf("---")).trim()
                anno = anno.substring(anno.indexOf("---"))
                    //console.log(anno)
                    // updatedBy
                if (anno.indexOf('(') != -1) {
                    descriptionArr.updatedBy = anno.substring(anno.indexOf('(') + 1, anno.indexOf(')'))
                    anno = anno.substring(anno.indexOf(')') + 1)
                } else {
                    descriptionArr.updatedBy = "Unspecified"
                    anno = anno.substring(anno.indexOf("UPDATED") + 7)
                }
                //console.log(anno)
                while (anno.charAt(0) == ' ') {
                    anno = anno.substring(1)
                }
                //console.log(anno)
                // updatedDate
                //console.log(anno.length)
                if (anno.length != 1) {
                    descriptionArr.updatedDate = anno.substring(0, 8)
                } else {
                    descriptionArr.updatedDate = "no record"
                }
            }

            return descriptionArr
        }

        static parse(filename, text) {

            modelSchema = {
                // 程式碼資料夾路徑
                path: " ",
                // 對本文件的描述
                description: {
                    description: " ",
                    updatedBy: [" "],
                    isBeta: false,
                    updatedDate: " "
                },
                classes: [],
                functions: []
            }
            var parsingText = text + '\n' + "*** endOfFile ***";
            modelSchema.path = filename;
            //console.log(parsingText);
            let tempData = {};
            tempData = parsingText.split('');
            //console.log(tempData);

            let lineTotal = 0;
            for (let i = 0; i < tempData.length; i++) {
                if (tempData[i] == "\n") {
                    lineTotal++;
                }
            }
            lineTotal = lineTotal + 1;

            let classCount = 0;
            let functionCount = 0;
            let innerClassCol = [];

            //console.log(parsingText)
            while (parsingText != "*** endOfFile ***") {
                //console.log("hi")

                let caseCF = "empty"
                while (caseCF === "empty") {
                    let firstLine = parsingText.substring(0, parsingText.indexOf('\n'))
                        // "/*"開頭的註解
                    if (firstLine.indexOf("/*") != -1) {
                        //console.log("1")
                        //get annotation
                        let temp = parsingText.substring(parsingText.indexOf("*/"), parsingText.length)
                        temp = temp.substring(temp.indexOf('\n') + 1, temp.length)
                        temp = temp.substring(0, temp.indexOf('\n'))
                        if ((temp.indexOf("class ") == 0 && temp.indexOf("/*") == -1 && temp.indexOf("//") == -1) ||
                            (temp.indexOf(" class ") != -1 && temp.indexOf("/*") == -1 && temp.indexOf("//") == -1)) {
                            caseCF = "class"
                        } else if ((temp.indexOf("function ") == 0 && temp.indexOf("/*") == -1 && temp.indexOf("//") == -1) ||
                            (temp.indexOf(" function ") != -1 && temp.indexOf("/*") == -1 && temp.indexOf("//") == -1)) {
                            caseCF = "function"
                        } else {
                            parsingText = parsingText.substring(parsingText.indexOf("*/"), parsingText.length)
                            parsingText = parsingText.substring(parsingText.indexOf('\n') + 1, parsingText.length)
                        }
                    }
                    // "//"開頭的註解
                    else if (firstLine.indexOf("//") != -1) {
                        //console.log("2")
                        //check if class or function after annotation
                        let temp = parsingText.substring(parsingText.indexOf('\n') + 1, parsingText.length)
                        temp = temp.substring(0, temp.indexOf('\n'))
                        if ((temp.indexOf("class ") == 0 && temp.indexOf("/*") == -1 && temp.indexOf("//") == -1) ||
                            (temp.indexOf(" class ") != -1 && temp.indexOf("/*") == -1 && temp.indexOf("//") == -1)) {
                            caseCF = "class"
                        } else if ((temp.indexOf("function ") == 0 && temp.indexOf("/*") == -1 && temp.indexOf("//") == -1) ||
                            (temp.indexOf(" function ") != -1 && temp.indexOf("/*") == -1 && temp.indexOf("//") == -1)) {
                            caseCF = "function"
                        } else {
                            parsingText = parsingText.substring(parsingText.indexOf('\n') + 1, parsingText.length)
                        }
                    }
                    // 非註解開頭
                    else {
                        //console.log("3")
                        let temp = firstLine
                        if ((temp.indexOf("class ") == 0 && temp.indexOf("/*") == -1 && temp.indexOf("//") == -1) ||
                            (temp.indexOf(" class ") != -1 && temp.indexOf("/*") == -1 && temp.indexOf("//") == -1)) {
                            caseCF = "class"
                        } else if ((temp.indexOf("function ") == 0 && temp.indexOf("/*") == -1 && temp.indexOf("//") == -1) ||
                            (temp.indexOf(" function ") != -1 && temp.indexOf("/*") == -1 && temp.indexOf("//") == -1)) {
                            caseCF = "function"
                        } else if ((temp.indexOf("import ") == 0 && temp.indexOf("/*") == -1 && temp.indexOf("//") == -1) ||
                            (temp.indexOf(" import ") != -1 && temp.indexOf("/*") == -1 && temp.indexOf("//") == -1)) {
                            caseCF = "import"
                        } else if ((temp.indexOf("export ") == 0 && temp.indexOf("/*") == -1 && temp.indexOf("//") == -1) ||
                            (temp.indexOf(" export ") != -1 && temp.indexOf("/*") == -1 && temp.indexOf("//") == -1)) {
                            caseCF = "export"
                        } else {
                            parsingText = parsingText.substring(parsingText.indexOf('\n') + 1)
                            if (parsingText == "*** endOfFile ***") break
                        }
                    }
                }

                //console.log(parsingText)
                //進入一個class區段
                if (caseCF === "class") {
                    //console.log("%c Class section", "font-size:30px;color:red");
                    classCount++;
                    //console.log("classcount: ");
                    //console.log(classCount)

                    // collect data for DB
                    let data = {};
                    let innerClassRecord = []

                    // if annotation exist, parse and cut
                    let firstLine = parsingText.substring(0, parsingText.indexOf('\n'))
                    let anno = ""
                    let annoEnd = 0
                    var descriptionArr = this.parseDescription(" ");
                    // annotation start with "/*"
                    if (firstLine.indexOf("/*") != -1) {
                        anno = parsingText.substring(0, parsingText.indexOf("*/") + 2);
                        annoEnd = parsingText.indexOf("*/") + 2;

                        // more then one line description
                        if (anno.indexOf('\n') != -1) {
                            anno = anno.substring(anno.indexOf('\n') + 1);
                            anno = anno.substring(anno.indexOf('*') + 1, anno.indexOf('\n'));
                            anno = anno.trim();
                            descriptionArr = this.parseDescription(anno);
                        }
                        // one line description
                        else {
                            anno = anno.substring(anno.indexOf('/*') + 2, anno.indexOf('*/') + 2);
                            while (anno.charAt(0) == '*') {
                                anno = anno.substring(1);
                            }
                            anno = anno.trim();
                            descriptionArr = this.parseDescription(anno);
                        }
                    }
                    // annotation start with "//"
                    else if (firstLine.indexOf("//") != -1) {
                        anno = parsingText.substring(parsingText.indexOf("//") + 2, parsingText.indexOf("\n"))
                        annoEnd = parsingText.indexOf("\n")
                        while (anno.charAt(0) == ' ') {
                            anno = anno.substring(1)
                        }
                        //console.log(anno)
                        // only description
                        if (anno.indexOf("---") == -1) {
                            descriptionArr.description = anno
                            descriptionArr.updatedDate = "no record"
                        }
                        // description with more info
                        else {
                            // description
                            descriptionArr.description = anno.substring(0, anno.indexOf("---"))
                            anno = anno.substring(anno.indexOf("---"))
                                //console.log(anno)
                                // updatedBy
                            if (anno.indexOf('(') != -1) {
                                descriptionArr.updatedBy = anno.substring(anno.indexOf('(') + 1, anno.indexOf(')'))
                                anno = anno.substring(anno.indexOf(')') + 1)
                            } else {
                                descriptionArr.updatedBy = "Unspecified"
                                anno = anno.substring(anno.indexOf("UPDATED") + 7)
                            }
                            //console.log(anno)
                            while (anno.charAt(0) == ' ') {
                                anno = anno.substring(1)
                            }
                            //console.log(anno)
                            // updatedDate
                            //console.log(anno.length)
                            if (anno.length != 1) {
                                descriptionArr.updatedDate = anno.substring(0, 8)
                            } else {
                                descriptionArr.updatedDate = "no record"
                            }
                        }
                    }

                    data.description = descriptionArr;

                    //切掉註解
                    if (annoEnd != 0) {
                        parsingText = parsingText.substring(annoEnd)
                        parsingText = parsingText.substring(parsingText.indexOf('\n') + 1)
                    }
                    //console.log(parsingText)

                    //計算第幾行
                    //console.log(parsingText)
                    tempData = parsingText.split('');
                    let lineCount = 0;
                    for (let i = 0; i < tempData.length; i++) {
                        if (tempData[i] == "\n") {
                            lineCount++;
                        }
                    }
                    //console.log(lineCount)
                    lineCount = lineTotal - lineCount;

                    // get lineNo 
                    data.lineNo = filename + " Ln" + lineCount;

                    // cut the class section
                    let classendIndex = 0
                    let temp = parsingText
                    classendIndex = this.getEndIndex(temp, '{', '}')
                    let classSection = parsingText.substring(0, classendIndex)
                        //console.log(classSection)
                    parsingText = parsingText.substring(classendIndex + 1)
                        //console.log(parsingText)

                    //get the declaration of class
                    let classHeadLine = classSection.substring(0, classSection.indexOf("{")).split(" ");
                    for (let i = 0; i < classHeadLine.length; i++) {
                        // get the name
                        if (classHeadLine[i] == "class") {
                            data.name = classHeadLine[i + 1]
                        }
                        // get extend class
                        else if (classHeadLine[i] == "extends") {
                            data.extends = classHeadLine[i + 1]
                        }
                    }
                    // get the export
                    if (classHeadLine[0] == "export") {
                        if (!modelSchema.exports) modelSchema.exports = []
                        modelSchema.exports.push(data.name)
                    }

                    classSection = classSection.substring(classSection.indexOf('\n') + 1)

                    // parse class section
                    while (1) {
                        //console.log(lineCount)
                        //console.log(classSection)


                        let hasToParse = false;
                        let singleLine = classSection.substring(0, classSection.indexOf('\n'));

                        // check annotation, if exist, get annotation
                        let annotation = "";
                        if (singleLine.indexOf("/*") != -1) {
                            //console.log("1")
                            //judge if it is "critical annotation"
                            let temp = classSection.substring(classSection.indexOf("*/"))
                            temp = temp.substring(temp.indexOf("\n") + 1)
                            temp = temp.substring(0, temp.indexOf("\n") + 1)
                                // if next line has annotation, then ignore this annotation
                            if (temp.indexOf("//") != -1 || temp.indexOf("/*") != -1) {
                                classSection = classSection.substring(classSection.indexOf("*/"))
                                classSection = classSection.substring(classSection.indexOf("\n") + 1)
                            }
                            // if next line isn't annotation
                            else {
                                //if line isn't empty, then hasToParse 
                                temp = temp.trim()
                                if ((temp.charCodeAt(0) == 13 && temp.charCodeAt(1) == 10) || temp.charCodeAt(0) == 10) {
                                    classSection = classSection.substring(classSection.indexOf("*/"))
                                    classSection = classSection.substring(classSection.indexOf("\n") + 1)
                                } else {
                                    annotation = classSection.substring(0, classSection.indexOf("*/") + 2)
                                    classSection = classSection.substring(classSection.indexOf("*/"))
                                    classSection = classSection.substring(classSection.indexOf("\n") + 1)
                                    hasToParse = true
                                }
                                //console.log(hasToParse)
                            }
                        }
                        // "//"開頭的註解
                        else if (singleLine.indexOf("//") != -1) {
                            //console.log("2")
                            //judge if it is "critical annotation"
                            let temp = classSection.substring(classSection.indexOf("\n") + 1)
                            temp = temp.substring(0, classSection.indexOf("\n") + 1)
                                //console.log(temp)
                                // if next line has annotation, then ignore this line
                            if (temp.indexOf("//") != -1 || temp.indexOf("/*") != -1) {
                                classSection = classSection.substring(classSection.indexOf("\n") + 1)
                            }
                            // if next line isn't annotation
                            else {
                                //if line isn't empty, then hasToParse 
                                while (temp.charAt(0) == ' ') {
                                    temp = temp.substring(1)
                                }
                                if ((temp.charCodeAt(0) == 13 && temp.charCodeAt(1) == 10) || temp.charCodeAt(0) == 10) {
                                    classSection = classSection.substring(classSection.indexOf("\n") + 1)
                                } else {
                                    annotation = classSection.substring(0, classSection.indexOf("\n"))
                                    classSection = classSection.substring(classSection.indexOf("\n") + 1)
                                    hasToParse = true
                                }
                                //console.log(hasToParse)
                            }

                        }
                        // 非註解開頭
                        else {
                            //console.log("3")
                            hasToParse = true
                        }
                        lineCount += this.countLine(annotation);
                        //console.log(lineCount) // last line of anno
                        //console.log(annotation)
                        // 去掉class第一行的classSection
                        //console.log(classSection.substring(0, classSection.indexOf('\n')))



                        // parse if hasToParse
                        if (hasToParse) {
                            // Schema Key
                            //parse annotation and store
                            let methodArr = {}
                            let enumerationArr = {}
                            let annoToParam = []
                            let annoToReturn = []
                            let annoToYield = []
                            let annoToDescription = {}
                            annoToDescription = this.parseDescription("");
                            methodArr.description = annoToDescription;
                            let properties = []
                            let method_hasToPush = false

                            // for/* */
                            if (annotation.indexOf("/*") != -1) {
                                while (1) {
                                    // get single line of annotation
                                    if (annotation.indexOf('\n') == -1) {
                                        singleLine = annotation;
                                    } else {
                                        singleLine = annotation.substring(0, annotation.indexOf('\n'));
                                    }
                                    //console.log(singleLine)
                                    singleLine = singleLine.trim();

                                    // parse annotation of description
                                    if (singleLine.indexOf("/*") == -1 && singleLine.indexOf("*") != -1 && singleLine.indexOf("* @") == -1) {
                                        singleLine = singleLine.substring(singleLine.indexOf('*') + 1)
                                        while (singleLine.charAt(0) == ' ') {
                                            singleLine = singleLine.substring(1)
                                        }
                                        annoToDescription = this.parseDescription(singleLine)
                                            // Need to ADD TO METHODS
                                        methodArr.description = annoToDescription
                                            //console.log(annoToDescription)
                                    }
                                    // parse annotation of parameter
                                    else if (singleLine.indexOf("@param") != -1) {
                                        let paramComponent = {}
                                        let temp = singleLine.substring(singleLine.indexOf("@param") + 6)
                                        temp = temp.trim()

                                        // if exist, get the type
                                        if (temp.indexOf('{') == 0 && temp.indexOf('}') != -1) {
                                            paramComponent.type = temp.substring(temp.indexOf('{') + 1, temp.indexOf('}'))
                                            temp = temp.substring(temp.indexOf('}') + 1)
                                            while (temp.charAt(0) == ' ') {
                                                temp = temp.substring(1)
                                            }
                                            // if exist, get the name
                                            if ((temp.charCodeAt(0) != 13 && temp.charCodeAt(1) != 10) || temp.charCodeAt(0) != 10) {
                                                if (temp.indexOf(" ") != -1) {
                                                    paramComponent.name = temp.substring(0, temp.indexOf(" "))
                                                    temp = temp.substring(temp.indexOf(" "))
                                                    while (temp.charAt(0) == ' ') {
                                                        temp = temp.substring(1)
                                                    }
                                                    // if "-" exist, get description
                                                    if (temp.indexOf('-') != -1) {
                                                        temp = temp.substring(temp.indexOf('-') + 1)
                                                        while (temp.charAt(0) == ' ') {
                                                            temp = temp.substring(1)
                                                        }
                                                        paramComponent.description = temp;
                                                    } else {
                                                        paramComponent.description = "Not Recorded";
                                                    }
                                                }
                                            }
                                        }
                                        //console.log(paramComponent)
                                        annoToParam.push(Object.assign({}, paramComponent))

                                    }
                                    // parse annotation of return
                                    else if (singleLine.indexOf("@returns") != -1) {
                                        // initialize returnComponent
                                        let returnComponent = {}
                                        returnComponent.type = "Not Recorded";
                                        returnComponent.description = "Not Recorded";

                                        let temp = singleLine.substring(singleLine.indexOf("@returns") + 8)
                                        while (temp.charAt(0) == ' ') {
                                            temp = temp.substring(1)
                                        }
                                        // if exist, get the type
                                        if (temp.indexOf('{') == 0 && temp.indexOf('}') != -1) {
                                            returnComponent.type = temp.substring(temp.indexOf('{') + 1, temp.indexOf('}'))
                                            temp = temp.substring(temp.indexOf('}') + 1)
                                                // if "-" exist, get description
                                            if (temp.indexOf('-') != -1) {
                                                temp = temp.substring(temp.indexOf('-') + 1)
                                                while (temp.charAt(0) == ' ') {
                                                    temp = temp.substring(1)
                                                }
                                                returnComponent.description = temp
                                            }
                                        }
                                        annoToReturn.push(Object.assign({}, returnComponent))
                                    }
                                    // parse annotation of yield
                                    else if (singleLine.indexOf("@yields") != -1) {
                                        // initialize returnComponent
                                        let yieldComponent = {}
                                        yieldComponent.type = "Not Recorded";
                                        yieldComponent.description = "Not Recorded";

                                        let temp = singleLine.substring(singleLine.indexOf("@yields") + 7)
                                        while (temp.charAt(0) == ' ') {
                                            temp = temp.substring(1)
                                        }
                                        // if exist, get the type
                                        if (temp.indexOf('{') == 0 && temp.indexOf('}') != -1) {
                                            yieldComponent.type = temp.substring(temp.indexOf('{') + 1, temp.indexOf('}'))
                                            temp = temp.substring(temp.indexOf('}') + 1)
                                                // if "-" exist, get description
                                            if (temp.indexOf('-') != -1) {
                                                temp = temp.substring(temp.indexOf('-') + 1)
                                                while (temp.charAt(0) == ' ') {
                                                    temp = temp.substring(1)
                                                }
                                                yieldComponent.description = temp
                                            }
                                        }
                                        annoToYield.push(Object.assign({}, yieldComponent))

                                    }
                                    // parse single property (pasre annotation and the code, and push into properties collection)
                                    else if (singleLine.indexOf("@type") != -1) {
                                        let propertiesCol = {};
                                        propertiesCol.type = " ";
                                        propertiesCol.description = this.parseDescription(" ");

                                        singleLine = singleLine.substring(singleLine.indexOf("@type") + 5);
                                        singleLine.trim();

                                        if (singleLine.indexOf("{") != -1 && singleLine.indexOf("}") != -1) {
                                            propertiesCol.type = singleLine.substring(singleLine.indexOf("{") + 1, singleLine.indexOf("}"));
                                            singleLine = singleLine.substring(singleLine.indexOf("}") + 1);
                                            if (singleLine.indexOf(" - ") != -1) {
                                                singleLine = singleLine.substring(singleLine.indexOf(" - ") + 3);
                                            }
                                            singleLine.trim();
                                            let description = this.parseDescription(singleLine.substring(0, temp.indexOf("*/")));
                                            propertiesCol.description = description;
                                        }

                                        //console.log(classSection)
                                        let propertyBody = classSection.substring(0, classSection.indexOf('\n'));
                                        if (propertyBody.indexOf(';') != -1) propertyBody = propertyBody.substring(0, propertyBody.indexOf(';'));
                                        if (propertyBody.indexOf(" = ") != -1) {
                                            let temp = propertyBody.split('=');
                                            temp[0] = temp[0].trim();
                                            if (temp[0].indexOf('_') == 0) {
                                                propertiesCol.isPrivate = true;
                                            } else {
                                                propertiesCol.isPrivate = false;
                                            }
                                            propertiesCol.name = temp[0];
                                            propertiesCol.default = temp[1].trim();
                                        } else {
                                            propertyBody = propertyBody.trim();
                                            propertiesCol.name = propertyBody;
                                            propertiesCol.default = " ";
                                        }

                                        // lineNo還沒做
                                        propertiesCol.lineNo = "-1";
                                        //console.log(propertiesCol)
                                        properties.push(Object.assign({}, propertiesCol));
                                        classSection = classSection.substring(classSection.indexOf('\n'));
                                        //console.log(classSection)

                                    }
                                    // 
                                    else if (singleLine.indexOf("@tags") != -1) {

                                        let temp = singleLine.substring(singleLine.indexOf("@tags") + 5);
                                        temp = temp.trim();
                                        let tagsCollect = temp.split(',');
                                        // Make tags to lowerCase and cut the extra space.
                                        for (let i = 0; i < tagsCollect.length; i++) {
                                            tagsCollect[i] = tagsCollect[i].toLowerCase();
                                            tagsCollect[i] = tagsCollect[i].trim();
                                        }
                                        methodArr.description.tags = tagsCollect;
                                        //console.log(methodArr);
                                    }
                                    // annotation with /*
                                    else if (singleLine.indexOf("/*") != -1) {
                                        //console.log("single")
                                        // if single line
                                        if (singleLine.indexOf("*/") != -1) {
                                            annotation = annotation.substring(annotation.indexOf("/") + 1)
                                            while (annotation.charAt(0) == '*') {
                                                annotation = annotation.substring(1)
                                            }
                                            annoToDescription = this.parseDescription(annotation)
                                                // Need to ADD TO METHODS
                                            methodArr.description = annoToDescription
                                                //console.log(annoToDescription)
                                            annotation = annotation.substring(annotation.indexOf("*/"))
                                        } else {

                                        }
                                    } else {
                                        //console.log("else")
                                    }
                                    annotation = annotation.substring(annotation.indexOf('\n') + 1)
                                    while (annotation.charAt(0) == ' ') {
                                        annotation = annotation.substring(1)
                                    }
                                    if (annotation == "*/") break
                                        //console.log(annotation)
                                        //console.log(annoToParam)
                                }
                            }
                            // for"//"(single line) 
                            else if (annotation.indexOf("//") != -1) {
                                annotation = annotation.substring(annotation.indexOf("//") + 2)
                                annoToDescription = this.parseDescription(annotation)
                                    // Need to ADD TO METHODS
                                methodArr.description = annoToDescription
                                    //console.log(annoToDescription)
                            }

                            //console.log(annoToParam)
                            //console.log(annoToDescription)
                            //console.log(classSection)

                            singleLine = classSection.substring(0, classSection.indexOf('\n'))
                                //console.log(singleLine)

                            if (singleLine.indexOf('(') != -1) {
                                // find the method's hedline
                                let headline = classSection.substring(0, classSection.indexOf('(')).trim().split(" ");
                                //console.log(headline)

                                classSection = classSection.substring(classSection.indexOf('('));
                                // find the whole parameter section
                                let parenthesesIndex = 0;
                                parenthesesIndex = this.getEndIndex(classSection, '(', ')');
                                //console.log(parenthesesIndex)
                                let parenthesesPart = classSection.substring(0, parenthesesIndex);
                                //console.log(parenthesesPart)
                                //console.log(classSection)
                                let paramComponent = this.parseParameter(parenthesesPart, annoToParam)
                                    // Need to ADD TO METHODS 
                                methodArr.parameters = paramComponent
                                    //console.log(paramComponent)

                                //console.log(methodArr)

                                // cut the section of {}
                                let sectionendIndex = 0
                                classSection = classSection.substring(parenthesesIndex)
                                    //console.log(classSection)
                                sectionendIndex = this.getEndIndex(classSection, '{', '}')
                                let section = classSection.substring(0, sectionendIndex) // method's section
                                    //console.log(section)
                                    //console.log(classSection)
                                classSection = classSection.substring(sectionendIndex + 1)
                                    //console.log(classSection)

                                // initial
                                methodArr.isGet = false
                                methodArr.isSet = false
                                methodArr.isConstructor = false
                                methodArr.isStatic = false
                                methodArr.isPrivate = false
                                methodArr.isGenerator = false
                                methodArr.isAsync = false
                                for (let i = 0; i < headline.length - 1; i++) {
                                    let key = headline[i]
                                    if (key === "get") methodArr.isGet = true
                                    else if (key === "set") methodArr.isSet = true
                                    else if (key === "static") methodArr.isStatic = true
                                    else if (key === "*") methodArr.isGenerator = true
                                    else if (key === "async") methodArr.isAsync = true
                                }

                                if (headline[headline.length - 1] === "constructor") methodArr.isConstructor = true

                                methodArr.name = headline[headline.length - 1];
                                if (headline[headline.length - 1].charAt(0) === '_' || headline[headline.length - 1].charAt(0) === '#') {
                                    methodArr.isPrivate = true;
                                }

                                methodArr.lineNo = filename + " Ln" + (lineCount + 1);

                                // parse section
                                // constructor
                                if (methodArr.isConstructor) {
                                    //console.log('%c constructor', 'color: orange; font-weight: bold;')
                                    method_hasToPush = true;
                                    //console.log(section)
                                    let propertiesCol = {};
                                    section = section.substring(section.indexOf('{') + 1);
                                    //console.log(section)

                                    // get public or private properties
                                    while (1) {
                                        let singleLine = "";
                                        if (section.indexOf('\n') != -1) {
                                            singleLine = section.substring(0, section.indexOf('\n'))
                                                //console.log(singleLine)
                                        } else {
                                            singleLine = section.substring(0, section.indexOf('}'))
                                                //console.log(singleLine)
                                        }
                                        singleLine = singleLine.trim();
                                        propertiesCol.type = " ";
                                        propertiesCol.description = this.parseDescription(" ");

                                        //console.log(singleLine)
                                        // if @type exist
                                        if (singleLine.indexOf("@type") != -1) {
                                            singleLine = singleLine.substring(singleLine.indexOf("@type") + 5);
                                            singleLine = singleLine.trim();

                                            if (singleLine.indexOf("{") != -1 && singleLine.indexOf("}") != -1) {
                                                propertiesCol.type = singleLine.substring(singleLine.indexOf("{") + 1, singleLine.indexOf("}"));
                                                singleLine = singleLine.substring(singleLine.indexOf("}") + 1);
                                                if (singleLine.indexOf(" - ") != -1) {
                                                    singleLine = singleLine.substring(singleLine.indexOf(" - ") + 3);
                                                }
                                                // "*/" is in the same line
                                                if (singleLine.indexOf("*/") != -1) {
                                                    singleLine = singleLine.substring(0, singleLine.indexOf("*/"));
                                                }
                                                // "*/" isn't in the same line
                                                else {
                                                    section = section.substring(section.indexOf("*/"));
                                                }
                                                singleLine = singleLine.trim();

                                                let description = this.parseDescription(singleLine);

                                                //console.log(description)
                                                propertiesCol.description = description;
                                                //console.log(propertiesCol)		
                                            }
                                            //console.log(propertiesCol)
                                            if (section.indexOf('\n') != -1) {
                                                section = section.substring(section.indexOf('\n') + 1)
                                                if (section.indexOf('\n') != -1) {
                                                    singleLine = section.substring(0, section.indexOf('\n'))
                                                } else {
                                                    singleLine = section.substring(0, section.indexOf('}'))
                                                }
                                            } else {
                                                break
                                            }
                                        }
                                        //console.log(propertiesCol)

                                        // parse "this..." 
                                        singleLine = singleLine.trim();
                                        if (singleLine.indexOf("this.") == 0) {
                                            singleLine = singleLine.substring(singleLine.indexOf("this.") + 5);

                                            // if "=" exist, then parse and push
                                            if (singleLine.indexOf('=') != -1) {
                                                let temp = singleLine.split('=');
                                                for (let i in temp) {
                                                    temp[i] = temp[i].trim();
                                                }
                                                if (temp[0].charAt(0) == '_') {
                                                    propertiesCol.isPrivate = true;
                                                } else {
                                                    propertiesCol.isPrivate = false;
                                                }
                                                propertiesCol.name = temp[0];

                                                if (temp[1].indexOf(';') != -1) {
                                                    temp[1] = temp[1].substring(0, temp[1].indexOf(';'))
                                                }
                                                propertiesCol.default = temp[1];

                                                // lineNo還沒做
                                                propertiesCol.lineNo = "-1"

                                                // collect class properties
                                                properties.push(Object.assign({}, propertiesCol))
                                            }
                                        }

                                        if (section.indexOf('\n') != -1) {
                                            section = section.substring(section.indexOf('\n') + 1)
                                        } else {
                                            break
                                        }
                                    }
                                }
                                // get
                                else if (methodArr.isGet) {
                                    // enum
                                    if (methodArr.isStatic && section.indexOf(" return ") != -1 && section.indexOf("new Enum") != -1) {
                                        //console.log('%c enum', 'color: orange; font-weight: bold;')
                                        section = section.substring(section.indexOf("new Enum") + 8)
                                        section = section.substring(section.indexOf('(') + 1)
                                        section = section.substring(section.indexOf('{') + 1)
                                            //console.log(section)
                                        enumerationArr.name = methodArr.name
                                        enumerationArr.lineNo = methodArr.lineNo
                                        enumerationArr.description = methodArr.description
                                        let enumValue = []
                                        while (1) {
                                            let enumConponent = {}
                                            enumConponent.type = " "
                                            enumConponent.description = this.parseDescription("")
                                            if (section.indexOf('\n') != -1) {
                                                singleLine = section.substring(0, section.indexOf('\n'))
                                            } else {
                                                singleLine = section.substring(0, section.indexOf('}'))
                                            }
                                            // if has value annotation, parse
                                            if (singleLine.indexOf("/**") != -1 && singleLine.indexOf("*/") != -1) {
                                                if (singleLine.indexOf("@type") != -1) {
                                                    singleLine = singleLine.substring(singleLine.indexOf("@type") + 5)
                                                        // if have type, get type
                                                    if (singleLine.indexOf('{') != -1 && singleLine.indexOf('}')) {
                                                        enumConponent.type = singleLine.substring(singleLine.indexOf('{') + 1, singleLine.indexOf('}'))
                                                        singleLine = singleLine.substring(singleLine.indexOf('}') + 1)
                                                    }
                                                    // if have description, get description
                                                    if (singleLine.indexOf(" - ") != -1) {
                                                        singleLine = singleLine.substring(singleLine.indexOf(" - ") + 3, singleLine.indexOf("*/"))
                                                        while (singleLine.charAt(0) == " ") {
                                                            singleLine = singleLine.substring(1)
                                                        }
                                                        enumConponent.description = this.parseDescription(singleLine)
                                                    }

                                                }
                                                if (section.indexOf('\n') != -1) {
                                                    section = section.substring(section.indexOf('\n') + 1)
                                                    if (section.indexOf('\n') != -1) {
                                                        singleLine = section.substring(0, section.indexOf('\n'))
                                                    } else {
                                                        singleLine = section.substring(0, section.indexOf('}'))
                                                    }
                                                } else {
                                                    break
                                                }
                                            }
                                            // parse method
                                            if (singleLine.indexOf('(') != -1) {

                                            }
                                            // parse value
                                            else {
                                                if (singleLine.indexOf(':') != -1) {
                                                    while (singleLine.charAt(0) == " ") {
                                                        singleLine = singleLine.substring(1)
                                                    }
                                                    enumConponent.name = singleLine.substring(0, singleLine.indexOf(':'))
                                                    singleLine = singleLine.substring(singleLine.indexOf(':') + 1)
                                                    while (singleLine.charAt(0) == " ") {
                                                        singleLine = singleLine.substring(1)
                                                    }
                                                    if (singleLine.indexOf(',') != -1) {
                                                        enumConponent.value = singleLine.substring(0, singleLine.indexOf(','))
                                                    } else {
                                                        enumConponent.value = singleLine
                                                    }
                                                    // lineNo還沒做
                                                    enumConponent.lineNo = "-1"
                                                    enumValue.push(Object.assign({}, enumConponent))
                                                }
                                            }

                                            if (section.indexOf('\n') != -1) {
                                                section = section.substring(section.indexOf('\n') + 1)
                                            } else {
                                                break
                                            }
                                        }
                                        enumerationArr.values = enumValue
                                            //console.log(enumerationArr)
                                        if (!data.enumerations) data.enumerations = []
                                        data.enumerations.push(Object.assign({}, enumerationArr))
                                    }
                                    // innerclass or field
                                    else {
                                        //console.log('%c innerclass or field', 'color: orange; font-weight: bold;')
                                        if (section.indexOf('return') != -1) {
                                            section = section.substring(section.indexOf('return') + 6)
                                            while (section.charAt(0) == " ") {
                                                section = section.substring(1)
                                            }
                                            // field
                                            if (section.indexOf('this.') != -1) {
                                                let propertiesCol = {}
                                                propertiesCol.type = " "
                                                propertiesCol.default = " "
                                                propertiesCol.isStatic = methodArr.isStatic
                                                propertiesCol.isPrivate = methodArr.isPrivate
                                                propertiesCol.name = methodArr.name
                                                propertiesCol.lineNo = methodArr.lineNo
                                                propertiesCol.description = methodArr.description
                                                    //console.log(annoToReturn)
                                                if (annoToReturn.length != 0) {
                                                    propertiesCol.type = annoToReturn[0].type
                                                }
                                                //console.log(propertiesCol)
                                                properties.push(Object.assign({}, propertiesCol))
                                            }
                                            // innerclass
                                            else {
                                                let innerComponent = {}
                                                innerComponent.name = methodArr.name
                                                    //console.log(section)
                                                if (section.indexOf(';') != -1) {
                                                    section = section.substring(0, section.indexOf(';'))
                                                } else {
                                                    section = section.substring(0, section.indexOf('}'))
                                                }
                                                innerComponent.innerclassName = section
                                                innerClassRecord.push(Object.assign({}, innerComponent))
                                            }
                                        }
                                    }
                                }
                                // other methods
                                else {
                                    //console.log('%c methods', 'color: orange; font-weight: bold;')
                                    method_hasToPush = true;
                                    // find return
                                    if (section.indexOf(" return ") != -1) {
                                        methodArr.returns = annoToReturn;
                                    }
                                    // find yield
                                    if (section.indexOf(" yield ") != -1) {
                                        methodArr.yields = annoToYield;
                                    }
                                }


                                // add tags to tagSchema
                                //console.log(methodArr)
                                let tagMethod = {};
                                tagMethod.path = modelSchema.path + "/" + data.name + "/" + methodArr.name;
                                tagMethod.name = methodArr.name;
                                tagMethod.description = methodArr.description.description;
                                if (methodArr.returns) tagMethod.returnType = methodArr.returns.type;
                                tagMethod.isStatic = methodArr.isStatic;
                                tagMethod.isPrivate = methodArr.isPrivate;
                                //console.log(tagMethod)

                                for (let i in methodArr.description.tags) {
                                    if (!tagSchemas.find(ele => ele.name === methodArr.description.tags[i])) {
                                        let temp = {};
                                        temp.name = methodArr.description.tags[i];
                                        temp.methods = [];
                                        tagSchemas.push(Object.assign({}, temp));
                                    }
                                    for (let j in tagSchemas) {
                                        if (tagSchemas[j].name === methodArr.description.tags[i]) {
                                            tagSchemas[j].methods.push(Object.assign({}, tagMethod));
                                        }
                                    }
                                }


                                //console.log(methodArr)
                                if (method_hasToPush) {
                                    if (!data.methods) data.methods = []
                                    data.methods.push(Object.assign({}, methodArr))
                                }
                                if (properties.length > 0) {
                                    for (let i = 0; i < properties.length; i++) {
                                        if (!data.fields) data.fields = [];
                                        data.fields.push(Object.assign({}, properties[i]))
                                    }
                                }

                                //console.log(data)
                                //console.log(classSection)

                            } else {
                                if (properties.length > 0) {
                                    for (let i = 0; i < properties.length; i++) {
                                        if (!data.fields) data.fields = [];
                                        data.fields.push(Object.assign({}, properties[i]))
                                    }
                                }
                                if (classSection.indexOf('\n') != -1) {
                                    classSection = classSection.substring(classSection.indexOf('\n') + 1)
                                    lineCount++
                                } else {
                                    break
                                }
                                //return
                            }
                        }

                    }

                    // check if get exist, then remove set from methods
                    if (data.methods) {
                        for (let i = 0; i < data.methods.length; i++) {
                            if (data.methods[i].isSet) {
                                for (let j in data.fields) {
                                    if (data.methods[i].name === data.fields[j].name && data.methods[i].isStatic === data.fields[j].isStatic && data.methods[i].isPrivate === data.fields[j].isPrivate) {
                                        data.methods.splice(i, 1);
                                        i--;
                                        break;
                                    }
                                }

                            }
                        }
                    }
                    //console.log(data)
                    //console.log(innerClassRecord)
                    if (innerClassRecord.length > 0) {
                        let temp = {};
                        temp.name = data.name;
                        temp.innerClass = innerClassRecord
                        innerClassCol.push(Object.assign({}, temp));
                    } else {
                        //console.log('no inner class')
                    }

                    // end of parsing class
                    modelSchema.classes.push(Object.assign({}, data))
                        //console.log(modelSchema)
                        //console.log(parsingText)
                        //return


                }
                //進入一個function區段
                else if (caseCF === "function") {
                    functionCount++;
                    let functArr = {};
                    let annoToParam = []
                    let annoToReturn = []
                    let annoToYield = []
                    let annoToDescription = {}
                    annoToDescription = this.parseDescription("")

                    //console.log(parsingText)
                    // get annotation if exist
                    let singleLine = parsingText.substring(0, parsingText.indexOf('\n'))
                    let annotation = ""
                    let annoEnd = 0
                    if (singleLine.indexOf("/*") != -1) {
                        annotation = parsingText.substring(0, parsingText.indexOf("*/") + 2)
                        annoEnd = parsingText.indexOf("*/") + 2
                    }
                    parsingText = parsingText.substring(annoEnd)
                    parsingText = parsingText.substring(parsingText.indexOf('\n') + 1)
                        //console.log(annotation)
                        //console.log(parsingText)


                    // parse annotation
                    if (annotation.indexOf("/*") != -1) {

                        while (1) {
                            //console.log(annotation.indexOf('\n'))

                            if (annotation.indexOf('\n') == -1) {
                                singleLine = annotation
                            } else {
                                singleLine = annotation.substring(0, annotation.indexOf('\n'))
                            }
                            //console.log(singleLine)
                            while (singleLine.charAt(0) == ' ') {
                                singleLine = singleLine.substring(1)
                            }
                            // parse annotation of description
                            if (singleLine.indexOf("/*") == -1 && singleLine.indexOf("*") != -1 && singleLine.indexOf("@") == -1) {
                                singleLine = singleLine.substring(singleLine.indexOf('*') + 1)
                                while (singleLine.charAt(0) == ' ') {
                                    singleLine = singleLine.substring(1)
                                }
                                annoToDescription = this.parseDescription(singleLine)
                                    // Need to ADD TO METHODS
                                functArr.description = annoToDescription
                                    //console.log(annoToDescription)
                            }
                            // parse annotation of parameter
                            else if (singleLine.indexOf("@param") != -1) {
                                let paramComponent = {}
                                let temp = singleLine.substring(singleLine.indexOf("@param") + 6)
                                while (temp.charAt(0) == ' ') {
                                    temp = temp.substring(1)
                                }
                                // if exist, get the type
                                if (temp.indexOf('{') == 0 && temp.indexOf('}') != -1) {
                                    paramComponent.type = temp.substring(temp.indexOf('{') + 1, temp.indexOf('}'))
                                    temp = temp.substring(temp.indexOf('}') + 1)
                                    while (temp.charAt(0) == ' ') {
                                        temp = temp.substring(1)
                                    }
                                    // if exist, get the name
                                    if ((temp.charCodeAt(0) != 13 && temp.charCodeAt(1) != 10) || temp.charCodeAt(0) != 10) {
                                        if (temp.indexOf(" ") != -1) {
                                            paramComponent.name = temp.substring(0, temp.indexOf(" "))
                                            temp = temp.substring(temp.indexOf(" "))
                                            while (temp.charAt(0) == ' ') {
                                                temp = temp.substring(1)
                                            }
                                            // if "-" exist, get description
                                            if (temp.indexOf('-') != -1) {
                                                temp = temp.substring(temp.indexOf('-') + 1)
                                                while (temp.charAt(0) == ' ') {
                                                    temp = temp.substring(1)
                                                }
                                                paramComponent.description = temp
                                            }
                                        }
                                    }
                                }
                                //console.log(paramComponent)
                                annoToParam.push(Object.assign({}, paramComponent))

                            }
                            // parse annotation of return
                            else if (singleLine.indexOf("@returns") != -1) {
                                // initialize returnComponent
                                let returnComponent = {}
                                returnComponent.type = ""
                                returnComponent.description = ""

                                let temp = singleLine.substring(singleLine.indexOf("@returns") + 8)
                                while (temp.charAt(0) == ' ') {
                                    temp = temp.substring(1)
                                }
                                // if exist, get the type
                                if (temp.indexOf('{') == 0 && temp.indexOf('}') != -1) {
                                    returnComponent.type = temp.substring(temp.indexOf('{') + 1, temp.indexOf('}'))
                                    temp = temp.substring(temp.indexOf('}') + 1)
                                        // if "-" exist, get description
                                    if (temp.indexOf('-') != -1) {
                                        temp = temp.substring(temp.indexOf('-') + 1)
                                        while (temp.charAt(0) == ' ') {
                                            temp = temp.substring(1)
                                        }
                                        returnComponent.description = temp
                                    }
                                }
                                annoToReturn.push(Object.assign({}, returnComponent))
                            }
                            // parse annotation of yield
                            else if (singleLine.indexOf("@yields") != -1) {
                                // initialize returnComponent
                                let yieldComponent = {}
                                yieldComponent.type = ""
                                yieldComponent.description = ""

                                let temp = singleLine.substring(singleLine.indexOf("@yields") + 7)
                                while (temp.charAt(0) == ' ') {
                                    temp = temp.substring(1)
                                }
                                // if exist, get the type
                                if (temp.indexOf('{') == 0 && temp.indexOf('}') != -1) {
                                    yieldComponent.type = temp.substring(temp.indexOf('{') + 1, temp.indexOf('}'))
                                    temp = temp.substring(temp.indexOf('}') + 1)
                                        // if "-" exist, get description
                                    if (temp.indexOf('-') != -1) {
                                        temp = temp.substring(temp.indexOf('-') + 1)
                                        while (temp.charAt(0) == ' ') {
                                            temp = temp.substring(1)
                                        }
                                        yieldComponent.description = temp
                                    }
                                }
                                annoToYield.push(Object.assign({}, yieldComponent))

                            }
                            // annotation with /*
                            else if (singleLine.indexOf("/*") != -1) {
                                //console.log("single")
                                // if single line
                                if (singleLine.indexOf("*/") != -1) {
                                    annotation = annotation.substring(annotation.indexOf("/") + 1)
                                    while (annotation.charAt(0) == '*') {
                                        annotation = annotation.substring(1)
                                    }
                                    annoToDescription = this.parseDescription(annotation)
                                        // Need to ADD TO METHODS
                                    methodArr.description = annoToDescription
                                        //console.log(annoToDescription)
                                    annotation = annotation.substring(annotation.indexOf("*/"))
                                } else {

                                }
                            } else {
                                //console.log("else")
                            }
                            annotation = annotation.substring(annotation.indexOf('\n') + 1)
                            while (annotation.charAt(0) == ' ') {
                                annotation = annotation.substring(1)
                            }
                            if (annotation == "*/") break
                                //console.log(annotation)
                                //console.log(annoToParam)
                        }
                    }

                    //計算第幾行
                    //console.log(parsingText)
                    tempData = parsingText.split('')
                    let lineCount = 0
                    for (let i = 0; i < tempData.length; i++) {
                        if (tempData[i] == "\n") {
                            lineCount++
                        }
                    }
                    //console.log(lineCount)
                    lineCount = lineTotal - lineCount

                    // cut the function section
                    let functionendIndex = 0
                    let temp = parsingText
                    functionendIndex = this.getEndIndex(temp, '{', '}')
                    let functionSection = parsingText.substring(0, functionendIndex)
                        //console.log(functionSection)
                    parsingText = parsingText.substring(functionendIndex + 1)
                        //console.log(parsingText)

                    singleLine = functionSection.substring(0, functionSection.indexOf('\n'))
                    while (singleLine.charAt(0) == ' ') {
                        singleLine = singleLine.substring(1)
                    }
                    // deal with header
                    let headline = singleLine.substring(0, singleLine.indexOf('(')).split(" ")
                        //console.log(headline)
                    functArr.name = headline[headline.length - 1]
                    functArr.isGenerator = false
                    functArr.isAsync = false
                    for (let i = 0; i < headline.length; i++) {
                        let key = headline[i]
                        if (key == "*") functArr.isGenerator = true
                        else if (key == "async") functArr.isAsync = true
                    }

                    let paramText = singleLine.substring(singleLine.indexOf('('), singleLine.indexOf(')') + 1)
                        //console.log(paramText)
                    functionSection = functionSection.substring(functionSection.indexOf('{'))

                    let paramComponent = this.parseParameter(paramText, annoToParam)

                    functArr.parameters = paramComponent
                        //console.log(paramComponent)
                        // get lineNo 
                    functArr.lineNo = filename + " Ln" + lineCount;
                    //console.log(functArr)

                    // find return
                    if (functionSection.indexOf(" return ") != -1) {
                        functArr.returns = annoToReturn
                    }
                    // find yield
                    if (functionSection.indexOf(" yield ") != -1) {
                        functArr.yields = annoToYield
                    }

                    modelSchema.functions.push(Object.assign({}, functArr))
                } else if (caseCF === "import") {
                    //console.log("import section!")
                    let temp = parsingText.substring(0, parsingText.indexOf('\n'))
                    let importCol = {}
                    let names = []
                    let path = ""
                    temp = temp.substring(temp.indexOf("import") + 6)
                    while (temp.charAt(0) == " ") {
                        temp = temp.substring(1)
                    }
                    // collect names
                    if (temp.charAt(0) == '{') {
                        let nameCol = temp.substring(temp.indexOf('{') + 1, temp.indexOf('}'))
                        while (nameCol.charAt(0) == " ") {
                            nameCol = nameCol.substring(1)
                        }
                        if (nameCol.indexOf(',') != -1) {
                            let manyNames = nameCol.split(',')
                                //console.log(manyNames)
                            for (let i = 0; i < manyNames.length; i++) {
                                while (manyNames[i].charAt(0) == " ") {
                                    manyNames[i] = manyNames[i].substring(1)
                                }
                                if (manyNames[i].indexOf(" ") != -1) {
                                    manyNames[i] = manyNames[i].substring(0, manyNames[i].indexOf(" "))
                                }
                                names.push(manyNames[i])
                            }
                        } else {
                            let name = temp.substring(0, temp.indexOf(" "))
                            names.push(Object.assign({}, name))
                        }
                    } else {
                        let name = temp.substring(0, temp.indexOf(" "))
                        names.push(name)
                    }
                    //console.log(names)
                    // get path
                    if (temp.indexOf("from") != -1) {
                        temp = temp.substring(temp.indexOf("from") + 4)
                        temp = temp.substring(temp.indexOf('"') + 1)
                        while (temp.charAt(0) == " ") {
                            temp = temp.substring(1)
                        }

                        path = temp.substring(0, temp.indexOf('.js') + 3)
                    }
                    for (let i = 0; i < names.length; i++) {
                        importCol.classname = names[i]
                        importCol.classpath = path
                        if (!modelSchema.imports) modelSchema.imports = []
                        modelSchema.imports.push(Object.assign({}, importCol))
                    }
                    //console.log(modelSchema.imports)
                    parsingText = parsingText.substring(parsingText.indexOf('\n') + 1)
                } else if (caseCF === "export") {

                    let temp = parsingText.substring(0, parsingText.indexOf('\n'))
                    temp = temp.substring(temp.indexOf("export") + 6)
                    while (temp.charAt(0) == " ") {
                        temp = temp.substring(1)
                    }
                    if (temp.indexOf("default") == 0) {
                        temp = temp.substring(temp.indexOf("default") + 7)
                        while (temp.charAt(0) == " ") {
                            temp = temp.substring(1)
                        }
                        if (temp.indexOf(';') != -1) {
                            temp = temp.substring(0, temp.indexOf(';'))
                        }
                        if (temp.indexOf(" ") != -1) {
                            temp = temp.substring(0, temp.indexOf(" "))
                        }
                        modelSchema.defaultExport = temp
                    } else {
                        if (temp.indexOf('{') != -1 && temp.indexOf('}') != -1) {
                            let nameCol = temp.substring(temp.indexOf('{') + 1, temp.indexOf('}'))
                            while (nameCol.charAt(0) == " ") {
                                nameCol = nameCol.substring(1)
                            }
                            if (nameCol.indexOf(',') != -1) {
                                let manyNames = nameCol.split(',')
                                    //console.log(manyNames)
                                for (let i = 0; i < manyNames.length; i++) {
                                    while (manyNames[i].charAt(0) == " ") {
                                        manyNames[i] = manyNames[i].substring(1)
                                    }
                                    if (manyNames[i].indexOf(" ") != -1) {
                                        manyNames[i] = manyNames[i].substring(0, manyNames[i].indexOf(" "))
                                    }
                                    if (!modelSchema.exports) modelSchema.exports = []
                                    modelSchema.exports.push(manyNames[i])
                                }
                            } else {
                                if (nameCol.indexOf(" ") != -1) {
                                    nameCol = nameCol.substring(0, nameCol.indexOf(" "))
                                }

                                if (!modelSchema.exports) modelSchema.exports = []
                                modelSchema.exports.push(nameCol)
                            }
                        } else {
                            if (temp.indexOf(';') != -1) {
                                temp = temp.substring(0, temp.indexOf(';'))
                            }
                            if (temp.indexOf(" ") != -1) {
                                temp = temp.substring(0, temp.indexOf(" "))
                            }

                            if (!modelSchema.exports) modelSchema.exports = []
                            modelSchema.exports.push(temp)
                        }
                    }
                    parsingText = parsingText.substring(parsingText.indexOf('\n') + 1)
                } else {

                }
            }

            console.log(modelSchema);
            console.log(innerClassCol);
            let returnPackage = [];
            returnPackage.push(Object.assign({}, modelSchema));
            returnPackage.push(Object.assign({}, tagSchemas));
            returnPackage.push(Object.assign({}, innerClassCol));

            return returnPackage;
        }
    }
}

document.getElementById('newFileBtn ').addEventListener('click', )