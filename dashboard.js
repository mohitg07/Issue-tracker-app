// below 2 are the global variables
let selectedChart = "pie";
let selectedReport = "Severity";

// by clicking on home icon, we will redirect to our home page
function goToHomePage() {
    location.href = "index.html";
}

// here I will choose my function according to value stored in selectedReport variable
function chooseFunctionAccordingToReport() {
    if (selectedReport == "Severity") {
        severityReport();
    }
    else if (selectedReport == "Status") {
        statusReport();
    }
    else if (selectedReport == "Assignee") {
        assigneeReport();
    }
    else {
        individualReport(selectedReport);
    }
}

// when user clicks on pie chart menu in dropdown list
document.getElementById("pieChart").addEventListener("click", function () {
    document.getElementById("chartMenu").innerHTML = 'Chart Type: Pie' + ' <span class="caret"></span>';

    selectedChart = "pie";

    chooseFunctionAccordingToReport();
});

// when user clicks on column chart menu in dropdown list
document.getElementById("columnChart").addEventListener("click", function () {
    document.getElementById("chartMenu").innerHTML = 'Chart Type: Column' + ' <span class="caret"></span>';

    selectedChart = "column";

    chooseFunctionAccordingToReport();
});

// when user clicks on bar chart menu in dropdown list
document.getElementById("barChart").addEventListener("click", function () {
    document.getElementById("chartMenu").innerHTML = 'Chart Type: Bar' + ' <span class="caret"></span>';

    selectedChart = "bar";

    chooseFunctionAccordingToReport();
});

// when I have to make chart according to status of bugs
function statusReport() {
    selectedReport = "Status";

    document.getElementById("status").style.backgroundColor = " #ebeaea";
    document.getElementById("severity").style.backgroundColor = "";
    document.getElementById("assignee").style.backgroundColor = "";
    document.getElementById("individual").style = "";

    document.getElementById("right").innerHTML = "";

    let countOpen = 0, countClose = 0, countInProgress = 0;
    var issuesItem = JSON.parse(localStorage.getItem('bugs'));

    for (let i = 0; i < issuesItem.length; ++i) {
        if (issuesItem[i].status == "Open") {
            countOpen++;
        }
        else if (issuesItem[i].status == "Closed") {
            countClose++;
        }
        else {
            countInProgress++;
        }
    }

    var data = [
        { x: "Open", value: countOpen },
        { x: "Closed", value: countClose },
        { x: "In Progress", value: countInProgress }
    ];

    var chart;
    if (selectedChart == "pie") {
        chart = anychart.pie();
    }
    else if (selectedChart == "column") {
        chart = anychart.column();
        chart.yAxis().title("Number of bugs");
    }
    else {
        chart = anychart.bar();
        chart.yAxis().title("Number of bugs");
    }

    // this helps in displaying number of bugs on every strip of bar and column chart
    chart.labels(true);

    // this is used to display title on top of chart
    chart.title("Number of bugs according to STATUS");

    // here I am giving the data so that chart can be prepared
    chart.data(data);

    // here I am providing the space to display chart on screen
    chart.container(document.getElementById("right"));

    // this is the final command
    chart.draw();
}

// when I have to make chart according to severity of bugs
function severityReport() {
    selectedReport = "Severity";

    document.getElementById("severity").style.backgroundColor = "#ebeaea";
    document.getElementById("status").style.backgroundColor = "";
    document.getElementById("assignee").style.backgroundColor = "";
    document.getElementById("individual").style = "";

    document.getElementById("right").innerHTML = "";

    let countLow = 0, countMedium = 0, countHigh = 0;
    var issuesItem = JSON.parse(localStorage.getItem('bugs'));

    for (let i = 0; i < issuesItem.length; ++i) {
        if (issuesItem[i].severity == "Low") {
            countLow++;
        }
        else if (issuesItem[i].severity == "Medium") {
            countMedium++;
        }
        else {
            countHigh++;
        }
    }

    var data = [
        { x: "Low", value: countLow },
        { x: "Medium", value: countMedium },
        { x: "High", value: countHigh }
    ];

    var chart;
    if (selectedChart == "pie") {
        chart = anychart.pie();
    }
    else if (selectedChart == "column") {
        chart = anychart.column();
        chart.yAxis().title("Number of bugs");
    }
    else {
        chart = anychart.bar();
        chart.yAxis().title("Number of bugs");
    }

    chart.labels(true);
    chart.title("Number of bugs according to SEVERITY");
    chart.data(data);
    chart.container(document.getElementById("right"));
    chart.draw();
}

// this function is called when I want to see number of  bugs assigned to individual according to status and severity
function individualReport(assignee) {
    selectedReport = assignee;

    document.getElementById("status").style.backgroundColor = "";
    document.getElementById("assignee").style.backgroundColor = "";
    document.getElementById("severity").style.backgroundColor = "";

    document.getElementById("right").innerHTML = "";

    document.getElementById("right").innerHTML = '<p id="heading">Bugs assigned to ' + assignee + '</p>';

    document.getElementById("right").innerHTML += '<div id="individualStats"><div id="leftPieChart"></div>' +
        '<div id="rightPieChart"></div></div>';

    document.getElementById("individualStats").style.display = "flex";

    let countOpen = 0, countClose = 0, countInProgress = 0, countLow = 0, countMedium = 0, countHigh = 0;
    var issuesItem = JSON.parse(localStorage.getItem('bugs'));

    for (i = 0; i < issuesItem.length; ++i) {
        if (issuesItem[i].assignedTo == assignee) {
            document.getElementById(assignee).style.backgroundColor = "#ebeaea";

            if (issuesItem[i].status == "Open") {
                countOpen++;
            }
            else if (issuesItem[i].status == "Closed") {
                countClose++;
            }
            else {
                countInProgress++;
            }

            if (issuesItem[i].severity == "Low") {
                countLow++;
            }
            else if (issuesItem[i].severity == "Medium") {
                countMedium++;
            }
            else {
                countHigh++;
            }
        }
        else {
            document.getElementById(issuesItem[i].assignedTo).style.backgroundColor = "";
        }
    }

    var chart1, chart2;
    var data1 = [
        { x: "Open", value: countOpen },
        { x: "Closed", value: countClose },
        { x: "In Progress", value: countInProgress }
    ];
    var data2 = [
        { x: "Low", value: countLow },
        { x: "Medium", value: countMedium },
        { x: "High", value: countHigh }
    ];

    if (selectedChart == "pie") {
        chart1 = anychart.pie();
        chart1.legend().position("left");
        chart1.legend().itemsLayout("vertical");
        chart1.radius(100);

        chart2 = anychart.pie();
        chart2.legend().position("right");
        chart2.legend().itemsLayout("vertical");
        chart2.radius(100);
    }
    else if (selectedChart == "column") {
        chart1 = anychart.column();
        chart1.yAxis().title("Number of bugs");
        chart2 = anychart.column();
        chart2.yAxis().title("Number of bugs");
    }
    else {
        chart1 = anychart.bar();
        chart1.yAxis().title("Number of bugs");
        chart2 = anychart.bar();
        chart2.yAxis().title("Number of bugs");
    }
    chart1.labels(true);
    chart1.title("By STATUS");
    chart1.data(data1);
    chart1.container(document.getElementById("leftPieChart"));

    chart2.labels(true);
    chart2.title("By SEVERITY");
    chart2.data(data2);
    chart2.container(document.getElementById("rightPieChart"));

    chart1.draw();
    chart2.draw();
}

function prepareListOfAssignees() {
    document.getElementById("individual").style.display = "block";
    document.getElementById("individual").innerHTML = "";

    var issuesItem = JSON.parse(localStorage.getItem('bugs'));

    // here I am finding all the unique assignees to whom bugs have been assigned
    let unique = [];
    unique = [...new Set(issuesItem.map(item => item.assignedTo))];

    for (let i = 0; i < unique.length; ++i) {
        document.getElementById("individual").innerHTML += '<li onclick="individualReport(\'' + unique[i] + '\')" id=' + unique[i] + '><a href="#" >' + unique[i] + '</a></li>';
    }
}

// when I have to make chart according to assignee 
function assigneeReport() {
    selectedReport = "Assignee";

    prepareListOfAssignees();

    document.getElementById("assignee").style.backgroundColor = " #ebeaea";
    document.getElementById("status").style.backgroundColor = "";
    document.getElementById("severity").style.backgroundColor = "";

    document.getElementById("right").innerHTML = "";

    // here result is the object in which I am storing data regarding the number of bugs assigned to every individual 
    let result = {};

    var issuesItem = JSON.parse(localStorage.getItem('bugs'));

    for (let i = 0; i < issuesItem.length; ++i) {
        if (!result[issuesItem[i].assignedTo]) {
            result[issuesItem[i].assignedTo] = 0;
        }
        ++result[issuesItem[i].assignedTo];
    }

    // now I will create individual object for every assignee-bugs data and then put it in the array named data
    var data = [];
    Object.entries(result).map(entry => {
        let obj = {
            x: entry[0],
            value: entry[1]
        }
        data.push(obj);
    });

    var chart;
    if (selectedChart == "pie") {
        chart = anychart.pie();

        chart.legend().position("right");
        chart.legend().itemsLayout("vertical");
        chart.sort("desc");
        chart.labels().position("outside");
    }
    else if (selectedChart == "column") {
        chart = anychart.column();
        chart.yAxis().title("Number of bugs");

        chart.labels(true);
        chart.labels().format("{%x}");
        chart.labels().rotation(-60);
        chart.labels().fontColor("Green");
        chart.labels().fontWeight(900);
    }
    else {
        chart = anychart.bar();
        chart.yAxis().title("Number of bugs");
        chart.labels(true);
    }

    chart.title("Number of bugs assigned to an INDIVIDUAL");
    chart.data(data);
    chart.container(document.getElementById("right"));
    chart.draw();
}