setTimeout(function()
		{
			var pres = document.querySelectorAll("pre>code");
			for (var i = 0; i < pres.length; i++)
			{
				hljs.highlightBlock(pres[i]);
			}
		}, 10);