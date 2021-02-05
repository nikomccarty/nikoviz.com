// IN THE HTML FILE, ADD THIS CODE:
//
// <input type="text" id="searchTable" placeholder="Search data..">
// <div id="makeTable"></div>

var tabulate = function (data,columns) {
    var table = d3.select('#makeTable').append("table").append("div").attr("id", "newTable");
    var thead = table.append('thead')
    var tbody = table.append('tbody')

    thead.append('tr')
    .selectAll('th')
        .data(columns)
        .enter()
    .append('th')
        .text(function (d) { return d })

    var rows = tbody.selectAll('tr')
        .data(data)
        .enter()
    .append('tr');

    var cells = rows.selectAll('td')
        .data(function(row) {
            return columns.map(function (column) {
                return { column: column, value: row[column] }
        })
    })
    .join('td')
    .text(function (d) { return d.value })

    return table;
  }

  d3.csv('pubmed_crispr_papers.csv')
  .then(function(data) {
    const columns = data.columns.slice();
    tabulate(data,columns);
  });

function filterTable(event) {
    var filter = event.target.value.toUpperCase();
    var rows = document.querySelector("#newTable tbody").rows;

    for (var i = 0; i < rows.length; i++) {
        var firstCol = rows[i].cells[0].textContent.toUpperCase();
        var secondCol = rows[i].cells[1].textContent.toUpperCase();
        if (firstCol.indexOf(filter) > -1 || secondCol.indexOf(filter) > -1) {
            rows[i].style.display = "";
        } else {
            rows[i].style.display = "none";
        }      
    }
};

document.querySelector('#searchTable').addEventListener('keyup', filterTable, false);