$('.toggle').on('click', function(event) {
    if (!$(this).hasClass("open")) {
      $(this).siblings(".content").slideDown();
      $(this).addClass("open");   
    }else{
       $(this).siblings(".content").slideUp();
       $(this).removeClass("open"); 
       $(this).blur();
    }
  });
  
  $(".bottom .toggle").click(function(){
  
    if($('.bottom .content').is(":visible")){
        $("html, body").animate({scrollTop:$(this).offset().top-10});
    }
    
  });

  async function renderTable() {
    const data = d3.csv('https://gist.githubusercontent.com/curran/a08a1080b88344b0c8a7/raw/0e7a9b0a5d22642a06d3d5b9bcbad9890c8ee534/iris.csv')
    
    const table = d3.select("#renderTable");

    d3.csv(data, function (data) {
      var columns = ['sepal_length', 'sepal_width', 'petal_length', 'petal_width', 'species']
      table.append(tabulate(data,columns))
    })
  }

  