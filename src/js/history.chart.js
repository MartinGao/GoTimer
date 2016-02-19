$.ajax({
  url: "/api/history/charts/" + Cookies('userId') + window.location.pathname.match(/\/(\w|:|-)*$/)[0],
  type: 'get',

})
.done(function(data) {
  console.log(data);


  var datasets = [
     {
         value: 300,
         color:"#F7464A",
         highlight: "#FF5A5E",
         label: "CSE170 HW"
     },
  ];

  var ctx = $("#myChart").get(0).getContext("2d");
  var myDoughnutChart = new Chart(ctx).Doughnut(data,{
    segmentShowStroke : true,

    //String - The colour of each segment stroke
    segmentStrokeColor : "#fff",

    //Number - The width of each segment stroke
    segmentStrokeWidth : 2,

    //Number - The percentage of the chart that we cut out of the middle
    percentageInnerCutout : 0, // This is 0 for Pie charts

    //Number - Amount of animation steps
    animationSteps : 100,

    //String - Animation easing effect
    animationEasing : "easeOutBounce",

    //Boolean - Whether we animate the rotation of the Doughnut
    animateRotate : true,

    //Boolean - Whether we animate scaling the Doughnut from the centre
    animateScale : true,

    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend middle\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
  });

  console.log(myDoughnutChart.generateLegend());
  $('#legend').html(myDoughnutChart.generateLegend());


});
