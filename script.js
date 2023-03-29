var assignArray = [];
var hiding = [];
var editing = false;
var results;

async function downloadAsync() {
    loader.innerHTML = "Loading...reading cached values<br><br>"
    results = await getJSON("https://aidanjacobson.duckdns.org:2222/diffeqhw/all");
    localStorage.setItem("hw_cache", JSON.stringify(results));
    loader.setAttribute("hidden", true);
    main(true);
}

async function main(prevent=false) {
    if (localStorage.getItem("hiding")) {
        hiding = JSON.parse(localStorage.getItem("hiding"));
    }
    if (localStorage.getItem("hw_cache")) {
        results = JSON.parse(localStorage.getItem("hw_cache"));
        if (!prevent) downloadAsync();
    } else {
        results = await getJSON("https://aidanjacobson.duckdns.org:2222/diffeqhw/all");
        loader.setAttribute("hidden", true);
        localStorage.setItem("hw_cache", JSON.stringify(results));
    }
    assignArray = [];
    for (assign in results) {
        assignArray.push({name:assign,problems:results[assign]});
    }
    assignArray.reverse();
    renderShowing();
}

window.onload = function() {
    main();
}

async function getJSON(url) {
    return new Promise(function(resolve) {
        var x = new XMLHttpRequest();
        x.open("GET", url);
        x.onload = function() {
            resolve(JSON.parse(x.responseText));
        }
        x.onerror = function(e) {
            alert(e.message);
        }
        x.send();
    })
}

function renderAssignments() {
    clearAssignments();
    assignArray.forEach(assign=>renderAssignment(assign));
}

function clearAssignments() {
    assignList.innerHTML = "";
}

function renderAssignment(assignment) {
    assignList.innerHTML += `<li><input type="checkbox" class="checker" id="check-${assignment.name}" ${hiding.indexOf(assignment.name)>-1?"":"checked"} onclick="doUpdate()"><b>${assignment.name}:</b> ${assignment.problems}</li>`
}

function doUpdate() {
    hiding = [];
    for (var i = 0; i < assignList.children.length; i++) {
        var curr = assignList.children[i];
        if (!curr.children[0].checked) {
            hiding.push(assignArray[i].name);
        }
    }
    localStorage.setItem("hiding", JSON.stringify(hiding));
}

function hideUncheckedAssignments() {
    for (var i = 0; i < assignList.children.length; i++) {
        assignList.children[i].children[0].setAttribute("hidden", true);
        if (hiding.indexOf(assignArray[i].name)>-1) {
            assignList.children[i].setAttribute("hidden", true);
        }
    }
}

function renderShowing() {
    renderAssignments();
    hideUncheckedAssignments();
}

function toggleShowing() {
    editing = !editing;
    btnShow.innerText = editing ? "Done editing" : "Edit list";
    if (editing) {
        renderAssignments();
    } else {
        renderShowing();
    }
}