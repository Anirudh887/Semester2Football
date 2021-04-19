var Matchday;
var standingsData = [];
var scorerData = [];

//#region API Calls

$.ajax({
    headers: { 'X-Auth-Token': '5b636e79a1f648db9fd054b8018d897d' },
    url: 'https://api.football-data.org/v2/competitions/PD/standings',
    dataType: 'json',
    type: 'GET',
}).done(function (response) {
    console.log(response);
    formatData(response);
});

$.ajax({
    headers: { 'X-Auth-Token': '5b636e79a1f648db9fd054b8018d897d' },
    url: 'https://api.football-data.org/v2/competitions/PD/scorers ',
    dataType: 'json',
    type: 'GET',
}).done(function (response) {
    console.log("scorers", response);
    scorer(response);
});

$.ajax({
    // headers: { 'X-Auth-Token': '5b636e79a1f648db9fd054b8018d897d' },
    url: 'https://www.scorebat.com/video-api/v1/',
    dataType: 'json',
    type: 'GET',
}).done(function (response) {
    // console.log("highlights", response);
    highlights(response);
});
//#endregion

function formatData(response) {
    Matchday = response.season.currentMatchday;
    var m = document.getElementById("Matchday");
    m.textContent = "Matchday " + Matchday;
    for (let i = 0; i < response.standings[0].table.length; i++) {
        standingsData.push({ "team": response.standings[0].table[i].team.name, "total": response.standings[0].table[i].points, "bullet": response.standings[0].table[i].team.crestUrl, "home": 0, "away": 0 })
    }
    for (let i = 0; i < response.standings[1].table.length; i++) {
        standingsData[i].home = response.standings[1].table[i].points;
    }
    for (let i = 0; i < response.standings[2].table.length; i++) {
        standingsData[i].away = response.standings[2].table[i].points;
    }
    // console.log("data : ", standingsData)
    // console.log(response.standings[0].table[0].points, response.standings[0].table[0].team.name, Matchday);
    standings();
    Picharts1(response);
    Picharts2(response);
    Picharts3(response);
}

//#region Standings
function standings() {

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    var chart = am4core.create("standingschartdiv", am4charts.XYChart);

    // Add data

    chart.data = standingsData;

    // Create axes
    var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "team";
    categoryAxis.numberFormatter.numberFormat = "#";
    categoryAxis.renderer.inversed = true;
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.cellStartLocation = 0.1;
    categoryAxis.renderer.cellEndLocation = 0.9;
    categoryAxis.renderer.minGridDistance = 20;

    var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.opposite = true;

    // Create series
    function createSeries(field, name) {
        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueX = field;
        series.dataFields.categoryY = "team";
        series.name = name;
        // console.log(name)
        series.columns.template.tooltipText = "{name}: [bold]{valueX}[/]";
        series.columns.template.height = am4core.percent(100);
        series.sequencedInterpolation = true;

        var valueLabel = series.bullets.push(new am4charts.LabelBullet());
        valueLabel.label.text = "{valueX}";
        valueLabel.label.horizontalCenter = "left";
        valueLabel.label.dx = 10;
        valueLabel.label.hideOversized = false;
        valueLabel.label.truncate = false;

        var categoryLabel = series.bullets.push(new am4charts.LabelBullet());
        categoryLabel.label.text = "{name}";
        categoryLabel.label.horizontalCenter = "right";
        categoryLabel.label.dx = -10;
        categoryLabel.label.fill = am4core.color("#fff");
        categoryLabel.label.hideOversized = false;
        categoryLabel.label.truncate = true;
        var bullet = series.bullets.push(new am4charts.Bullet());
        series.columns.template.adapter.add("fill", function (fill, target) {
            return chart.colors.getIndex(target.dataItem.index);
        });
        if (name == "Total Points") {
            var image = bullet.createChild(am4core.Image);
            image.horizontalCenter = "middle";
            image.verticalCenter = "bottom";
            image.dy = 20;
            image.y = am4core.percent(100);
            image.propertyFields.href = "bullet";
            image.tooltipText = series.columns.template.tooltipText;
            image.propertyFields.fill = "color";
            image.filters.push(new am4core.DropShadowFilter());

        }

    }
    createSeries("total", "Total Points");
    createSeries("home", "home");
    createSeries("away", "away");

};
//#endregion

//#region Scorer

function scorer(response) {
    for (let i = 0; i < response.scorers.length; i++) {
        scorerData.push({ "pName": response.scorers[i].numberOfGoals, "goal": response.scorers[i].player.name })
    }
    console.log(scorerData)
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end



    // Create chart instance
    var chart = am4core.create("scorerchartdiv", am4charts.XYChart3D);
    chart.data = scorerData;


    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "goal";
    categoryAxis.renderer.labels.template.rotation = 270;
    categoryAxis.renderer.labels.template.hideOversized = false;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.labels.template.horizontalCenter = "right";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";
    categoryAxis.tooltip.label.rotation = 270;
    categoryAxis.tooltip.label.horizontalCenter = "right";
    categoryAxis.tooltip.label.verticalCenter = "middle";

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "Goals";
    valueAxis.title.fontWeight = "bold";

    // Create series
    var series = chart.series.push(new am4charts.ColumnSeries3D());
    series.dataFields.valueY = "pName";
    series.dataFields.categoryX = "goal";
    series.name = "pName";
    series.tooltipText = "{categoryX}: [bold]{valueY}[/]";
    series.columns.template.fillOpacity = .8;

    var columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
    columnTemplate.stroke = am4core.color("#FFFFFF");

    columnTemplate.adapter.add("fill", function (fill, target) {
        return chart.colors.getIndex(target.dataItem.index);
    })

    columnTemplate.adapter.add("stroke", function (stroke, target) {
        return chart.colors.getIndex(target.dataItem.index);
    })

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.lineX.strokeOpacity = 0;
    chart.cursor.lineY.strokeOpacity = 0;

}

//#endregion

//#region Highlights
function highlights(response) {
    var pdiv = document.getElementById('high');
    for (let i = 0; i < 10 && i < response.length; i++) {
        var highdiv = document.createElement('div');
        highdiv.innerHTML = `<div><span><a href="` + response[i].url + `">` + response[i].title + `</a></span></div>
        <div><img  src="`+ response[i].thumbnail + `" style="width : 200px"></div>`
        pdiv.appendChild(highdiv);
    }
}

//#endregion

//#region Picharts

function Picharts1(response) {
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    var chart = am4core.create("pchartdiv1", am4charts.PieChart3D);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.legend = new am4charts.Legend();
    var pie1 = response.standings[0].table[0].form;
    var name1 = response.standings[0].table[0].team.name;
    var tdiv = document.getElementById('tname1');
    tdiv.innerHTML = name1 + " - " + pie1;
    chart.data = [
        {
            cond: "Win",
            val: response.standings[0].table[0].won
        },
        {
            cond: "Draw",
            val: response.standings[0].table[0].draw
        },
        {
            cond: "Loss",
            val: response.standings[0].table[0].lost
        }
    ];

    var series = chart.series.push(new am4charts.PieSeries3D());
    series.dataFields.value = "val";
    series.dataFields.category = "cond";
}

function Picharts2(response) {
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    var chart = am4core.create("pchartdiv2", am4charts.PieChart3D);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.legend = new am4charts.Legend();
    var pie2 = response.standings[0].table[1].form;
    var name2 = response.standings[0].table[1].team.name;
    var tdiv = document.getElementById('tname2');
    tdiv.innerHTML = name2 + " - " + pie2;
    chart.data = [
        {
            cond: "Win",
            val: response.standings[0].table[1].won
        },
        {
            cond: "Draw",
            val: response.standings[0].table[1].draw
        },
        {
            cond: "Loss",
            val: response.standings[0].table[1].lost
        }
    ];

    var series = chart.series.push(new am4charts.PieSeries3D());
    series.dataFields.value = "val";
    series.dataFields.category = "cond";
}

function Picharts3(response) {
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    var chart = am4core.create("pchartdiv3", am4charts.PieChart3D);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.legend = new am4charts.Legend();
    var pie3 = response.standings[0].table[2].form;
    var name3 = response.standings[0].table[2].team.name;
    var tdiv = document.getElementById('tname3');
    tdiv.innerHTML = name3 + " - " + pie3;
    chart.data = [
        {
            cond: "Win",
            val: response.standings[0].table[2].won
        },
        {
            cond: "Draw",
            val: response.standings[0].table[2].draw
        },
        {
            cond: "Loss",
            val: response.standings[0].table[2].lost
        }
    ];

    var series = chart.series.push(new am4charts.PieSeries3D());
    series.dataFields.value = "val";
    series.dataFields.category = "cond";
}

//#endregion


