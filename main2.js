// these are global variables
let startingIndex, endingIndex, countLess, countMore;

// this function is used to display my bug one by one
function displayDiv(i, item) {
    var issuesList;

    if (i % 2 == 0) {
        issuesList = document.getElementById('leftIssueList');
    }
    else {
        issuesList = document.getElementById('rightIssueList');
    }

    var date = item.date + '-' + (item.month + 1) + '-' + item.year;
    var time = item.hours + ":" + item.minutes + ":" + item.seconds;

    var dateTime = date + " " + time;

    var id = item.id;
    var title = item.title;
    var status = item.status;
    var severity = item.severity;
    var assignedTo = item.assignedTo;

    let statusID = "status" + id;

    issuesList.innerHTML += '<div class="list" onclick="enlargeParticularDiv(\'' + id + '\')">' +
        '<h4>' + dateTime + '</h4>' +
        '<p><button id=' + statusID + '>' + status + '</button></p>' +
        '<h3>' + title + '</h3>' +
        '<p id="rightGlyficon"><span class="glyphicon glyphicon-time"></span> ' + severity + '</p>' +
        '<p><span class="glyphicon glyphicon-user"></span> ' + assignedTo + '</p>' +
        '</div>';

    // with this I am deciding colour for my status button
    if (status == "Closed") {
        document.getElementById(statusID).style.backgroundColor = "green";
    }
    else if (status == "Open") {
        document.getElementById(statusID).style.backgroundColor = "red";
    }
    else {
        document.getElementById(statusID).style.backgroundColor = "#c8c814";
    }
};

// If our search matches with any bug title then display that bugs only
function searchDivs(searchTitle) {
    let count = 0;
    var issuesItem = JSON.parse(localStorage.getItem('bugs'));

    document.getElementById("leftIssueList").innerHTML = "";
    document.getElementById("rightIssueList").innerHTML = "";

    var i;
    for (i = 0; i < issuesItem.length; i++) {

        if ((issuesItem[i].title).search(searchTitle) != -1) {
            if (document.getElementById("container").style.display == "none") {
                document.getElementById("notFound").style.display = "none";
                document.getElementById("container").style.display = "flex";
            }
            displayDiv(count, issuesItem[i]);

            count++;
        }

    }
    // if no such result found then displaying some message on screen
    if (count == 0) {
        document.getElementById("container").style.display = "none";
        document.getElementById("notFound").style.display = "flex";

        document.getElementById("resultNotFound").innerHTML = "No Result Found!";
    }
}

document.getElementById("search").addEventListener("click", function () {
    document.getElementById("less").style.display = "none";
    document.getElementById("more").style.display = "none";

    let searchTitle = document.getElementById("inputSearchTitle").value;

    if (searchTitle != "") {
        searchDivs(searchTitle);
    }
    else {
        alert("Please enter valid search item");
    }
});

// this function is called when user releases a key during searching
function myFunc() {
    let searchTitle = document.getElementById("inputSearchTitle").value;
    var issuesItem = JSON.parse(localStorage.getItem('bugs'));

    // if nothing is searched by user then simply display all the issues
    if (searchTitle.length == 0) {
        document.getElementById("notFound").style.display = "none";
        document.getElementById("container").style.display = "flex";

        fetchIssues();
    }
    else {
        if(issuesItem.length > 4){
           document.getElementById("less").style.display = "none";
           document.getElementById("more").style.display = "none";
        }

        searchDivs(searchTitle);
    }
};

// when user clicks on clear issue button then form gets reset
document.getElementById("rightBut").addEventListener("click", function () {
    document.getElementById('issueInputForm').reset();
});

// this function is generating unique id every time I call it
function generatingUniqueID(len) {
    let buf = [];
    let chars = 'ABCDEFGHIJKLMNOPQRSTabcdefghijklmnopqrstuvwxyz0123456789';
    let charlen = chars.length;
    let length = len || 25;

    for (var i = 0; i < length; i++) {
        buf[i] = chars.charAt(Math.floor(Math.random() * charlen));
    }

    return buf.join('');
}

document.getElementById('issueInputForm').addEventListener('submit', saveIssue);

// this is the function by which we will add new bugs in our local storage
function saveIssue() {
    var issueTitle = document.getElementById('issueTitleInput').value;
    var issueSeverity = document.getElementById('issueSeverityInput').value;
    var issueAssignedTo = document.getElementById('issueAssignedToInput').value;
    var issueDesc = document.getElementById('issueDescriptionInput').value;

    if (issueDesc == "" || issueSeverity == "" || issueAssignedTo == "" || issueTitle == "") {
        alert("Fill all the particulars");
        return;
    }

    //give some specific random value every time having length equals to 15
    var issueId = generatingUniqueID(15);

    var issueStatus = 'Open';

    var today = new Date();

    var issue = {
        id: issueId,
        description: issueDesc,
        severity: issueSeverity,
        assignedTo: issueAssignedTo,
        title: issueTitle,
        status: issueStatus,
        dateTime: today,
        date: today.getDate(),
        month: today.getMonth(),
        year: today.getFullYear(),
        hours: today.getHours(),
        minutes: today.getMinutes(),
        seconds: today.getSeconds(),
    }

    // The localStorage and sessionStorage properties allow to save key/value pairs in a web browser.
    //   The localStorage object stores data with no expiration date. The data will not be deleted when the browser is closed, and will be available the next day, week, or year.
    if (localStorage.getItem('bugs') == null) {
        var issuesItem = [];
        issuesItem.unshift(issue); //unshift will add issue in the starting of array
        localStorage.setItem('bugs', JSON.stringify(issuesItem));
    }
    else {
        var issuesItem = JSON.parse(localStorage.getItem('bugs'));
        issuesItem.unshift(issue);
        localStorage.setItem('bugs', JSON.stringify(issuesItem));
    }

    document.getElementById('issueInputForm').reset();
    fetchIssues();
}

// this function changes the status to open
function changeStatusToOpen(id) {
    var issuesItem = JSON.parse(localStorage.getItem('bugs'));

    for (var i = 0; i < issuesItem.length; i++) {
        if (issuesItem[i].id == id) {
            issuesItem[i].status = 'Open';
        }
    }

    localStorage.setItem('bugs', JSON.stringify(issuesItem));

    arrangeNewToOld();
    enlargeParticularDiv(id);
}

// this function changes the status to inProgress
function changeStatusToProgress(id) {
    var issuesItem = JSON.parse(localStorage.getItem('bugs'));

    for (var i = 0; i < issuesItem.length; i++) {
        if (issuesItem[i].id == id) {
            issuesItem[i].status = 'In Progress';
        }
    }

    localStorage.setItem('bugs', JSON.stringify(issuesItem));

    arrangeNewToOld();
    enlargeParticularDiv(id);
}

// this function changes the status to close
function changeStatusToClose(id) {
    var issuesItem = JSON.parse(localStorage.getItem('bugs'));

    for (var i = 0; i < issuesItem.length; i++) {
        if (issuesItem[i].id == id) {
            issuesItem[i].status = 'Closed';
        }
    }

    localStorage.setItem('bugs', JSON.stringify(issuesItem));

    arrangeNewToOld();
    enlargeParticularDiv(id);
}

// this function will delete the required bug
function deleteIssue(id) {
    document.getElementById("enlargeDiv").innerHTML = "";

    var issuesItem = JSON.parse(localStorage.getItem('bugs'));

    for (var i = 0; i < issuesItem.length; i++) {
        if (issuesItem[i].id == id) {
            issuesItem.splice(i, 1);
        }
    }

    if (issuesItem.length == 0) {
        document.getElementById("mainDiv").style.display = "none";
    }

    localStorage.setItem('bugs', JSON.stringify(issuesItem));

    fetchIssues();
    displayText();
}

function editDescription() {
    document.getElementById("description").style.backgroundColor = "white";
    document.getElementById("description").contentEditable = "true";
    document.getElementById("saveIcon").style.display = "inline";
}

// this function will save the changes whatever I have done in description of particular bug
function saveChanges(id) {
    var issuesItem = JSON.parse(localStorage.getItem('bugs'));

    for (var i = 0; i < issuesItem.length; i++) {
        if (issuesItem[i].id == id) {
            issuesItem[i].description = document.getElementById("description").textContent;
        }
    }

    localStorage.setItem('bugs', JSON.stringify(issuesItem));

    arrangeNewToOld();
    enlargeParticularDiv(id);
}

function enlargeParticularDiv(id) {

    var issuesItem = JSON.parse(localStorage.getItem('bugs'));

    for (i = 0; i < issuesItem.length; i++) {
        if (issuesItem[i].id == id) {
            var divId = issuesItem[i].id;
            var divDesc = issuesItem[i].description;
            var divSeverity = issuesItem[i].severity;
            var divAssignedTo = issuesItem[i].assignedTo;
            var divStatus = issuesItem[i].status;
            var divTitle = issuesItem[i].title;

            var date = issuesItem[i].date + '-' + (issuesItem[i].month + 1) + '-' + issuesItem[i].year;
            var time = issuesItem[i].hours + ":" + issuesItem[i].minutes + ":" + issuesItem[i].seconds;

            var divDateTime = date + " " + time;
        }
    }

    var contentEnlargeDiv = document.getElementById("enlargeDiv");
    contentEnlargeDiv.innerHTML = "";


    contentEnlargeDiv.innerHTML +=
        '<div class="firstLine"><h4>Issue ID: ' + divId + '</h4>' +
        '<p><btn id="enlargeDivStatus">' + divStatus + '</btn></p></div>' +
        '<h2>' + divTitle + '</h2>' +
        '<p>Severity:<span class="severity">' + divSeverity + '</span></p>' +
        '<p>Assigned To:<span class="assignedTo">' + divAssignedTo + '</span></p>' +
        '<p>Assigned Time:<span class="assignedTime">' + divDateTime + '</span></p>' +
        '<p class="para">' + 'Description' + '<img src="editlogo.png" title="edit description" onclick="editDescription()">' + '<a href="#"  onclick="saveChanges(\'' + id + '\')" id="saveIcon" disabled="false">Save Changes</a>' + '</p>' +
        '<div id="description" contenteditable="false">' + divDesc + '</div>' +

        '<div class="dropdown" id="selectStatus"><button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">Status  <span class="caret"></span></button>' +
        '<ul class="dropdown-menu">' +
        '<li><a href="#" id="openStatus" onclick="changeStatusToOpen(\'' + id + '\')">Open</a></li>' +
        '<li><a href="#" id="inProgressStatus" onclick="changeStatusToProgress(\'' + id + '\')">In Progress</a></li>' +
        '<li><a href="#" id="closeStatus" onclick="changeStatusToClose(\'' + id + '\')">Closed</a></li>' +
        '</ul></div>' +
        '<a href="#" onclick="deleteIssue(\'' + id + '\')" class="btn btn-warning">Delete</a>';

    if (divStatus == "Closed") {
        document.getElementById("enlargeDivStatus").style.backgroundColor = "green";
    }
    else if (divStatus == "Open") {
        document.getElementById("enlargeDivStatus").style.backgroundColor = "red";
    }
    else {
        document.getElementById("enlargeDivStatus").style.backgroundColor = "#c8c814";
    }
}

// when someone clicks on showLess tag then last 2 bugs gets hidden
function showLessIssues() {
    var issuesItem = JSON.parse(localStorage.getItem('bugs'));

    document.getElementById("leftIssueList").innerHTML = "";
    document.getElementById("rightIssueList").innerHTML = "";

    endingIndex = Math.max(endingIndex - 2, 3);
    startingIndex = endingIndex + 1;

    for (i = 0; i <= endingIndex; ++i) {

        displayDiv(i, issuesItem[i]);

        countMore++;
        if (countMore == 1) {
            document.getElementById("more").style.display = "inline";
        }
    }

    if (endingIndex == 3) {
        document.getElementById("less").style.display = "none";
        countLess = 0;
        return;
    }
}

// when someone clicks on loadMore tag then 2 more bugs gets displayed on the screen
function loadMoreIssues() {

    // console.log(issues);
    var issuesItem = JSON.parse(localStorage.getItem('bugs'));

    document.getElementById("leftIssueList").innerHTML = "";
    document.getElementById("rightIssueList").innerHTML = "";

    endingIndex = Math.min(startingIndex + 2, issuesItem.length) - 1;

    for (i = 0; i <= endingIndex; ++i) {

        displayDiv(i, issuesItem[i]);

        countLess++;
        if (countLess == 1) {
            document.getElementById("less").style.display = "inline";
        }
    }
    startingIndex += 2;

    if (i == issuesItem.length) {
        document.getElementById("more").style.display = "none";
        countMore = 0;
        return;
    }
}

// this function mainly handles the case when number of bugs displayed will exceed 4 because I want that only 4 bugs will be displayed on first show. After that user have to click on loadMore tag to see more bugs
function displayIssues(issuesItem) {
    if (issuesItem.length == 0) {
        document.getElementById("mainDiv").style.display = "none";
        return;
    }
    else {
        document.getElementById("mainDiv").style.display = "flex";
    }

    document.getElementById("leftIssueList").innerHTML = "";
    document.getElementById("rightIssueList").innerHTML = "";

    var i;
    for (i = 0; i < issuesItem.length; i++) {
        if (i > 3) {
            document.getElementById("showMoreLess").innerHTML += '<a href="javascript:void(0);" onclick="loadMoreIssues()" class="loadMore" id="more">Load More-></a> ' +
                '<a href="javascript:void(0);" onclick="showLessIssues()" class="showLess" id="less"><-Show Less</a>';

            document.getElementById("more").style.display = "inline";
            document.getElementById("less").style.display = "none";

            startingIndex = 4;
            countLess = 0;
            countMore = Infinity;

            localStorage.setItem('bugs', JSON.stringify(issuesItem));

            return;
        }
        else {
            document.getElementById("showMoreLess").innerHTML = "";
        }

        displayDiv(i, issuesItem[i]);
    }
}

// some CSS is added when someone clicks on filter button
document.getElementById("filterMenu").addEventListener("click", function () {
    if (document.getElementById("filterMenu").style.color != "blue") {
        document.getElementById("filterMenu").style.backgroundColor = "rgb(186 186 220)";
        document.getElementById("filterMenu").style.color = "blue";
    }
    else {
        document.getElementById("filterMenu").style = "";
    }
});

// this function will filter all the bugs according to assignee
function searchAssignee(assignee) {
    let count = 0;
    var issuesItem = JSON.parse(localStorage.getItem('bugs'));
    document.getElementById("dropdownAssignee").innerHTML = "Assignee: " + assignee + ' <span class="caret"></span>';

    document.getElementById("leftIssueList").innerHTML = "";
    document.getElementById("rightIssueList").innerHTML = "";

    if(issuesItem.length > 4){
       document.getElementById("less").style.display = "none";
       document.getElementById("more").style.display = "none";
    }


    for (i = 0; i < issuesItem.length; ++i) {
        if (issuesItem[i].assignedTo == assignee) {
            if (document.getElementById("container").style.display == "none") {
                document.getElementById("notFound").style.display = "none";
                document.getElementById("container").style.display = "flex";
            }
            displayDiv(count, issuesItem[i])
            count++;
        }
    }
}

// this function will filter all the bugs according to severity
function searchAccToSeverity(severityType) {
    let count = 0;
    var issuesItem = JSON.parse(localStorage.getItem('bugs'));

    document.getElementById("dropdownSeverity").innerHTML = "Severity: " + severityType + ' <span class="caret"></span>';

    document.getElementById("leftIssueList").innerHTML = "";
    document.getElementById("rightIssueList").innerHTML = "";

    if(issuesItem.length > 4){
       document.getElementById("less").style.display = "none";
       document.getElementById("more").style.display = "none";
    }


    for (i = 0; i < issuesItem.length; ++i) {
        if (issuesItem[i].severity == severityType) {
            if (document.getElementById("container").style.display == "none") {
                document.getElementById("notFound").style.display = "none";
                document.getElementById("container").style.display = "flex";
            }
            displayDiv(count, issuesItem[i])
            count++;
        }
    }
    if (count == 0) {
        document.getElementById("container").style.display = "none";
        document.getElementById("notFound").style.display = "flex";

        document.getElementById("resultNotFound").innerHTML = "No Result Found!";
    }
}

// this function will filter all the bugs according to status type
function searchAccToStatus(statusType) {
    let count = 0;
    var issuesItem = JSON.parse(localStorage.getItem('bugs'));

    document.getElementById("dropdownStatus").innerHTML = "Status: " + statusType + ' <span class="caret"></span>';

    document.getElementById("leftIssueList").innerHTML = "";
    document.getElementById("rightIssueList").innerHTML = "";

    if(issuesItem.length > 4){
       document.getElementById("less").style.display = "none";
       document.getElementById("more").style.display = "none";
    }


    for (i = 0; i < issuesItem.length; ++i) {
        if (issuesItem[i].status == statusType) {
            if (document.getElementById("container").style.display == "none") {
                document.getElementById("notFound").style.display = "none";
                document.getElementById("container").style.display = "flex";
            }
            displayDiv(count, issuesItem[i])
            count++;
        }
    }
    if (count == 0) {
        document.getElementById("container").style.display = "none";
        document.getElementById("notFound").style.display = "flex";

        document.getElementById("resultNotFound").innerHTML = "No Result Found!";
    }
}

// this function will filter my bugs according to oldest one
document.getElementById("oldToNew").addEventListener("click", function () {
    document.getElementById("filterMenu").style.backgroundColor = "#c7c7c7e8";
    document.getElementById("filterMenu").style.color = "black";

    document.getElementById("filterMenu").innerHTML = 'Filter by: Oldest' + ' <span class="caret"></span>';

    document.getElementById("dropdownAssignee").style.display = "none";
    document.getElementById("dropdownSeverity").style.display = "none";
    document.getElementById("dropdownStatus").style.display = "none";

    var issuesItem = JSON.parse(localStorage.getItem('bugs'));

    //sort array by dates from oldest to newest
    issuesItem.sort(function (a, b) {
        var keyA = a.dateTime
        keyB = b.dateTime;
        // Compare the 2 dates
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
    });

    displayIssues(issuesItem);
});

function arrangeNewToOld() {
    document.getElementById("filterMenu").style.backgroundColor = "#c7c7c7e8";
    document.getElementById("filterMenu").style.color = "black";

    document.getElementById("filterMenu").innerHTML = 'Filter by: Newest' + ' <span class="caret"></span>';

    document.getElementById("dropdownAssignee").style.display = "none";
    document.getElementById("dropdownSeverity").style.display = "none";
    document.getElementById("dropdownStatus").style.display = "none";

    fetchIssues();
}

// this function will filter bugs according to newest one
document.getElementById("newToOld").addEventListener("click", arrangeNewToOld);

// when I click on this then new dropdown will form where I will do filtering by assignee
document.getElementById("arrowRight").addEventListener("click", function () {
    document.getElementById("filterMenu").style.backgroundColor = "#c7c7c7e8";
    document.getElementById("filterMenu").style.color = "black";

    document.getElementById("filterMenu").innerHTML = 'Filter by: Assignee' + ' <span class="caret"></span>';

    document.getElementById("dropdownSeverity").style.display = "none";
    document.getElementById("dropdownStatus").style.display = "none";
    document.getElementById("dropdownAssignee").style.display = "block";

    document.getElementById("dropdownAssignee").innerHTML = "Assignee " + '<span class="caret"></span>';

    var issuesItem = JSON.parse(localStorage.getItem('bugs'));

    // this is used to get all unique assignee names which I will use to filter the bugs according to assignee
    let unique = [];
    unique = [...new Set(issuesItem.map(item => item.assignedTo))];

    document.getElementById("dropdownRight").innerHTML = "";
    for (let i = 0; i < unique.length; ++i) {
        document.getElementById("dropdownRight").innerHTML += '<li><a href="#" onclick="searchAssignee(\'' + unique[i] + '\')">' + unique[i] + '</a></li>';
    }
});

// when I click on this then new dropdown will form where I will do filtering by severity
document.getElementById("arrowRight2").addEventListener("click", function () {
    document.getElementById("filterMenu").style.backgroundColor = "#c7c7c7e8";
    document.getElementById("filterMenu").style.color = "black";

    document.getElementById("filterMenu").innerHTML = 'Filter by: Severity' + ' <span class="caret"></span>';

    document.getElementById("dropdownAssignee").style.display = "none";
    document.getElementById("dropdownStatus").style.display = "none";
    document.getElementById("dropdownSeverity").style.display = "block";
});

// when I click on this then new dropdown will form where I will do filtering by status
document.getElementById("arrowRight3").addEventListener("click", function () {
    document.getElementById("filterMenu").style.backgroundColor = "#c7c7c7e8";
    document.getElementById("filterMenu").style.color = "black";

    document.getElementById("filterMenu").innerHTML = 'Filter by: Status' + ' <span class="caret"></span>';

    document.getElementById("dropdownAssignee").style.display = "none";
    document.getElementById("dropdownSeverity").style.display = "none";
    document.getElementById("dropdownStatus").style.display = "block";
});

// this is the main function from where we will call other functions to display bugs on screen
function fetchIssues() {
    document.getElementById("dropdownAssignee").style.display = "none";
    document.getElementById("filterMenu").innerHTML = 'Filter by: Newest' + ' <span class="caret"></span>';

    displayText();

    var issuesItem = JSON.parse(localStorage.getItem('bugs'));

    //sort array by dates from newest to oldest
    issuesItem.sort(function (a, b) {
        var keyA = a.dateTime
        keyB = b.dateTime;
        // Compare the 2 dates
        if (keyA > keyB) return -1;
        if (keyA < keyB) return 1;
        return 0;
    });

    displayIssues(issuesItem);
}

// this function is called when no bug is selected yet
function displayText() {
    document.getElementById("enlargeDiv").innerHTML =
        '<p id="text">' + "NO BUG SELECTED YET..." + '</p>';
}
