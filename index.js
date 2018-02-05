//cashflow
function svgBar(data,selector,settings) {
    if (data == undefined) return;
    if (selector == undefined) return;
    if (settings == undefined) settings = false;
    var margin=(settings.margin)?settings.margin: {top: 10, right: 0,bottom: 30,left: 0},//margin
        width =(settings.width)?settings.width: 960 ,//width
        height = (settings.height)?settings.height:230 ;//height
        

        width = width - margin.left - margin.right;
        height = height - margin.top - margin.bottom;
        var heightX = height + 2;
   /* data example
    data = [{
            month: "Jan",
            rent: 200,
            other: 100,
            expenses: 550
        },
        {
            month: "Feb",
            rent: 400,
            other: 250,
            expenses: 250
        },
        {
            month: "Mar",
            rent: 200,
            other: 0,
            expenses: 350
        },
        {
            month: "Apr",
            rent: 200,
            other: 400,
            expenses: 150
        },
        {
            month: "May",
            rent: 200,
            other: 200,
            expenses: 150
        },
        {
            month: "Jun",
            rent: 400,
            other: 300,
            expenses: 250
        },
        {
            month: "Jul",
            rent: 100,
            other: 320,
            expenses: 410
        },
        {
            month: "Aug",
            rent: 220,
            other: 410,
            expenses: 540
        },
        {
            month: "Sep",
            rent: 180,
            other: 270,
            expenses: 490
        },
        {
            month: "Oct",
            rent: 580,
            other: 670,
            expenses: 140
        },
        {
            month: "Nov",
            rent: 280,
            other: 140,
            expenses: 230
        },
        {
            month: "Dec",
            rent: 480,
            other: 310,
            expenses: 250
        }
    ];
    */

    //интерполяция строк ось x
    var x0 = d3.scaleBand().range([0, width]);

    var x1 = d3.scaleBand().paddingOuter(1);

    //интерполяция строк ось y
    var y = d3.scaleLinear().range([height, 0]);

    //создаем ось x
    var xAxis = d3.axisBottom(x0).tickPadding(10);

    //начальная координата
    var yBegin;

    // объединие колонок
    var innerColumns = {
        column1: ["rent", "other"],
        column2: ["expenses"]
    };

    var columnHeaders = d3.keys(data[0]).filter(function (key) {
        return key !== "month";
    });

    //заполняем данные для вывода
    data.forEach(function (d) {
        var yColumn = new Array();
        d.columnDetails = columnHeaders.map(function (name) {
            for (ic in innerColumns) {
                if ($.inArray(name, innerColumns[ic]) >= 0) {
                    if (!yColumn[ic]) {
                        yColumn[ic] = 0;
                    }
                    yBegin = yColumn[ic];
                    yColumn[ic] += +d[name];
                    return {
                        name: name,
                        column: ic,
                        yBegin: yBegin,
                        yEnd: +d[name] + yBegin,
                        label: "$ " + number_format(d[name], 2)
                    };
                }
            }
        });
        d.total = d3.max(d.columnDetails, function (d) {
            return d.yEnd;
        });
    });

    x0.domain(
        data.map(function (d) {
            return d.month;
        })
    );

    x1.domain(d3.keys(innerColumns)).rangeRound([0, x0.bandwidth()]);

    y.domain([
        0,
        d3.max(data, function (d) {
            return d.total;
        })
    ]);

    //вставляем svg
    var svg = d3
        .select(selector)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    // вставляем ось x
    svg
        .append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + heightX + ")")
        .call(xAxis)
    // вставляем ось x с нашими стилями
    svg
        .append("line")
        .attr("class", "axis-my")
        .attr("transform", "translate(0," + heightX + ")")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", width)
        .attr("y2", 0)



    //вставляем график
    var cashflow = svg
        .selectAll(".cashflow")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "g-column")
        .attr("transform", function (d) {
            return "translate(" + x0(d.month) + ",0)";
        });

    cashflow
        .selectAll("rect")
        .data(function (d) {
            return d.columnDetails;
        })
        .enter()
        .append("rect")
        .attr("x", function (d) {
            return x1(d.column);
        })
        .attr("y", function (d) {
            return y(d.yEnd);
        })
        .attr("height", function (d) {
            return y(d.yBegin) - y(d.yEnd);
        })
        .attr("class", function (d) {
            return d.name + " rect";
        })
        .on("mouseover", function (d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(d.label)
                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 10) + "px");
        })
        .on("mouseout", function (d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });;


    //вставляем tooltip
    var tooltip = d3.select("#cashflow").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
}

/* totals */
function svgTotals(data,selector,settings) {
    if (data == undefined) return;
    if (selector == undefined) return;
    if (settings == undefined) settings = false;
    var margin=(settings.margin)?settings.margin: {top: 0, right: 0,bottom: 0,left: 0},//margin    
        width = (settings.width)?settings.width:720,
        height = (settings.height)?settings.height:68,
        labelWidth = (settings.labelWidth)?settings.labelWidth:100;

        width = 720 - margin.left - margin.right;
        height = 68 - margin.top - margin.bottom;

    //data example
    // var data = {
    //     rent: 50000,
    //     other: 30000,
    //     expenses: 55000
    // };

    //interpolation of axis
    var x = d3.scaleLinear().range([0, width - labelWidth]),
        y = d3.scaleBand().range([0, height]);
    //axis
    var xAxis = d3.axisTop(x),
        yAxis = d3.axisLeft(y);
    //max value
    var maxFirstRow = data.rent + data.other,
        maxValue = d3.max([maxFirstRow, data.expenses]);

    //domains
    x.domain([
        0,
        maxValue
    ]);

    //add svg
    var svg = d3.select(selector)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("class", "totals-svg")
        .append("g")

    svg
        .append("g")
        .attr("class", "x axis")
        .call(xAxis)

    svg
        .append("line")
        .attr("class", "axis-myTotal")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", height)

    var firstRow = svg
        .append("g")
        .attr("class", "g-rowTotal g-rowTotalFirst");

    var secondRow = svg
        .append("g")
        .attr("class", "g-rowTotal g-rowTotalSecond");

    firstRow
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", x(data.rent))
        .attr("class", "rect rentTotal")

    firstRow
        .append("rect")
        .attr("x", x(data.rent))
        .attr("y", 0)
        .attr("width", x(data.other))
        .attr("class", "rect otherTotal")

    firstRow.append("text")
        .text("$ " + number_format(data.other + data.rent, 2))
        .attr("x", x(data.other + data.rent))
        .attr("y", 0)
        .attr("class", "g-rowTotal-text");

    secondRow
        .append("rect")
        .attr("x", 0)
        .attr("y", 20)
        .attr("width", x(data.expenses))
        .attr("class", "rect expensesTotal")

    secondRow
        .append("text")
        .text("$ " + number_format(data.expenses, 2))
        .attr("x", x(data.expenses))
        .attr("y", 21)
        .attr("class", "g-rowTotal-text");



}

/*chart1 */
function lineChart(data, dataPur, selector, settings) {
    if (data == undefined) return;
    if (selector == undefined) return;
    if (dataPur == undefined) return;
    if (settings == undefined) settings = false;
    /*data example */
    /*    var dataHistory1 = [{
            date: "Jan 17",
            value: 326000
        },
        {
            date: "Feb 17",
            value: 328000
        },
        {
            date: "Mar 17",
            value: 327000
        },
        {
            date: "Apr 17",
            value: 325000
        },
        {
            date: "May 17",
            value: 326000
        },
        {
            date: "Jun 17",
            value: 328000
        },
        {
            date: "Jul 17",
            value: 329000
        },
        {
            date: "Aug 17",
            value: 329000
        },
        {
            date: "Sep 17",
            value: 330000
        },
        {
            date: "Oct 17",
            value: 331000
        },
        {
            date: "Nov 17",
            value: 332000
        },
        {
            date: "Dec 17",
            value: 332000
        },
    ]
    */

    /*datPur example */
    // var dataPur={value:325000,text:"Purchase price"}

    /*margin example*/
    // var margin1 = {
    //     left: 2,
    //     top: 80,
    //     right: 40,
    //     bottom: 110
    // }

    var margin=(settings.margin)?settings.margin: { left: 2,top: 80,right: 40,bottom: 110}, // margin
        widthX = (settings.width)?settings.width:960,//width of axis x
        heightY = (settings.height)?settings.height:305,//width of axis y
        paddingFromYAxis =  (settings.paddingFromYAxis)?settings.paddingFromYAxis:40,//padding from axis y
        width = widthX - margin.left - margin.right,
        height = heightY - margin.top - margin.bottom,
        heightX = heightY - margin.bottom;
        

    //interpolation of axis
    var y = d3.scaleLinear().range([height, 0]),
        x = d3.scaleBand().range([0, width - paddingFromYAxis]).paddingInner(1);
    //axis
    var xAxis = d3.axisBottom(x),
        yAxis = d3.axisLeft(y);

    //domains
    x.domain(data.map(function (d) {
        return d.date;
    }));

    //min and max values for y axis
    var minValue = d3.min([d3.min(data, function (d) {
        return d.value;
    }), dataPur.value]);

    var maxValue = d3.max([d3.max(data, function (d) {
        return d.value;
    }), dataPur.value]);

    y.domain([minValue, maxValue]);

    // create a line function that can convert data[] into x and y points
    var line = d3.line()
        // assign the X function to plot our line as we wish
        .x(function (d, i) {
            // return the X coordinate where we want to plot this datapoint
            return x(d.date); //x(i);
        })
        .y(function (d) {
            // return the Y coordinate where we want to plot this datapoint
            return y(d.value);
        });

    //add graphic
    var transformY = margin.top + 20;
    var svg = d3.select(selector)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    // Add the x-axis.
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + paddingFromYAxis + "," + heightX + ")")
        .call(xAxis);

    //fake axis
    svg
        .append("line")
        .attr("class", "axis-myX")
        .attr("transform", "translate(0," + heightX + ")")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", widthX)
        .attr("y2", 0)

    svg
        .append("line")
        .attr("class", "axis-myY")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", heightY - margin.bottom + margin.top)
        .attr("transform", "translate(0," + "-" + margin.top + ")")

    //purchase line
    var linePur = svg
        .append("line")
        .attr("class", "purchaseLine")
        .attr("x1", 0)
        .attr("y1", y(dataPur.value))
        .attr("x2", widthX)
        .attr("y2", y(dataPur.value));

    svg.append("text")
        .attr("x", widthX)
        .attr("class", "purchaseValue")
        .attr("y", y(dataPur.value)).text("$" + dataPur.value)
        .attr("text-anchor", "end")
        .attr("transform", "translate(-2,-5)");

    svg.append("text")
        .attr("x", widthX)
        .attr("class", "purchaseText")
        .attr("y", y(dataPur.value)).text(dataPur.text)
        .attr("text-anchor", "end")
        .attr("transform", "translate(-2,15)");

    var graphBlock = svg.append("g")
        .attr("class", "graph-block")

    graphBlock.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line)
        .attr("transform", "translate(" + paddingFromYAxis + ",0)")

    var gDot = graphBlock.selectAll(".gDot")
        .data(data)
        .enter().append("g")
        .attr("class", "gDot")

    gDot.append("circle")
        .attr("class", "dot")
        .attr("cx", line.x())
        .attr("cy", line.y())
        .attr("r", 10)
        .attr("transform", "translate(" + paddingFromYAxis + ",0)");

    gDot.append("text")
        .attr("class", "dot-text")
        .attr("x", line.x())
        .attr("y", line.y())
        .text(function (d) {
            return "$ " + d.value;
        })
}

//pie chart
function pieChart(data,selector,settings) {
    if (data == undefined) return;
    if (selector == undefined) return;
    if (settings == undefined) settings = false;
    var width=(settings.width)?settings.width:400, // width
        height = (settings.height)?settings.height:270, // height
        radius = (settings.radius)?settings.radius:Math.min(width, height) / 2, //radius
        title = (settings.title)?settings.title:"", //title
        titleSum = (settings.titleSum)?settings.titleSum:"", //radius
        colorRange = (settings.colorRange)?settings.colorRange:d3.schemeCategory10; // array of colors for labels


    /*data example */
    /*   
    var dataPie = [{
        label: "Insurance",
            value: 324
        },
        {
            label: "Internet",
            value: 144
        },
        {
            label: "Rent",
            value: 424
        },
        {
            label: "Power",
            value: 124
        },
    ] 
    */
    var labelsDomain=data.map(function(value){
        return value.label;        
    });
  
    var pie = d3.pie()
        .sort(null)
        .value(function (d) {
            return d.value;
        });

    var arc = d3.arc()
        .outerRadius(radius * 0.8)
        .innerRadius(radius * 0.7);

    var outerArc = d3.arc()
        .innerRadius(radius * 1)
        .outerRadius(radius * 0.4);

    var key = function (d) {       
        return d.data.label;
    };

    var color = d3.scaleOrdinal()
        .domain(labelsDomain)
        .range(colorRange);
       
    /*add svg */
    var svg = d3.select(selector)
        .append("svg")
        .attr("class", "axis")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform",
            "translate(" + (width / 2) + "," + (height / 2) + ")");
    // add g slices, lables, lines        
    svg.append("g")
        .attr("class", "slices");
    svg.append("g")
        .attr("class", "labels");
    svg.append("g")
        .attr("class", "lines");

    //add title of chart
    svg.append("text")
    .attr("text-anchor", "middle")
    .attr("class","chart-title")
    .attr("dy", "0em").text(title);

     //add sum of chart
    svg.append("text")
    .attr("text-anchor", "middle")
    .attr("class","chart-title-sum")
    .attr("dy", "1em").text(titleSum);

    //add slices
    var g = svg.select(".slices").selectAll(".path.slice")
        .data(pie(data))
        .enter()
        .append("path")
        .attr("class", "slice")
        .attr("d", arc)
        .style("fill", function (d) {
            return color(d.data.label);
        });

    //text labels

    var text = svg.select(".labels").selectAll("text")
        .data(pie(data), key);


    function midAngle(d) {
        return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }
//add label text
    text.enter()
        .append("g")        
        .append("text")
        .attr("dy", ".35em") 
        .attr("class","label-text-title")  
        .attr("fill",function (d) {
            return color(d.data.label);
        }) 
        .text(function (d) {
            return d.data.label;
        })    
           
        .merge(text)
        .transition().duration(1000)
        .attrTween("transform", function (d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function (t) {
                var d2 = interpolate(t);
                var pos = outerArc.centroid(d2);
                pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                return "translate(" + pos + ")";
            };
        })
        .styleTween("text-anchor", function (d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function (t) {
                var d2 = interpolate(t);
                return midAngle(d2) < Math.PI ? "start" : "end";
            };
        })       
    
    text.exit()

// //add values text
    text.enter()
    .append("g")        
    .append("text")
    .attr("dy", ".35em") 
    .attr("class","label-text-value")   
    .text(function (d) {
        return "$" + number_format(d.data.value,2);
    })    
       
    .merge(text)
    .transition().duration(1000)
    .attrTween("transform", function (d) {
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function (t) {
            var d2 = interpolate(t);
            var pos = outerArc.centroid(d2);
            pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
            pos[1]=pos[1]+15;
            return "translate(" + pos + ")";
        };
    })
    .styleTween("text-anchor", function (d) {
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function (t) {
            var d2 = interpolate(t);
            return midAngle(d2) < Math.PI ? "start" : "end";
        };
    })       

text.exit()

// //circles
var circle = svg.select(".labels").selectAll("circle")
.data(pie(data), key);
circle.enter()
.append("g")   
.attr("class","g-label-circle")     
.append("circle")
.attr("r", 3) 
.attr("stroke", function (d) {
    return color(d.data.label);
})
.attr("fill","none")
.attr("class","label-circle")   
.merge(circle)
    .transition().duration(1000)
    .attrTween("transform", function (d) {
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function (t) {
            var d2 = interpolate(t);
            var pos = outerArc.centroid(d2);
            pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1); 
            pos[0]+= (midAngle(d2) < Math.PI ? -12 : 12);
            pos[1]+= 10;        
            return "translate(" + pos + ")";
        };
    })
    
    circle.exit();

}


//format numbers
function number_format(number, decimals, dec_point, thousands_sep) {
    number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.round(n * k) / k;
        };
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}