const attachFormat = () => {
  const input = document.getElementById('input');
  const output = document.getElementById('output');
  const result = document.getElementById('result');
  const error = document.getElementById('error');

  const language = document.getElementById('language');
  const tabWidth = document.getElementById('tabWidth');
  const useTabs = document.getElementById('useTabs');
  const keywordCase = document.getElementById('keywordCase');
  const dataTypeCase = document.getElementById('dataTypeCase');
  const functionCase = document.getElementById('functionCase');
  const identifierCase = document.getElementById('identifierCase');
  const indentStyle = document.getElementById('indentStyle');
  const logicalOperatorNewline = document.getElementById('logicalOperatorNewline');
  const expressionWidth = document.getElementById('expressionWidth');
  const lineBetweenQueries = document.getElementById('lineBetweenQueries');
  const denseOperators = document.getElementById('denseOperators');
  const newlineBeforeSemicolon = document.getElementById('newlineBeforeSemicolon');
  const ctc = document.getElementById('btn-tct');

  function showOutput(text) {
	let code = `<pre><code class="language-sql hljs flash-bg">${text}</code></pre>`;
    output.innerHTML = code;
	result.value = text;
    output.style.display = 'block';
    error.style.display = 'none';
	hljs.highlightAll();
	output.scrollIntoView({behavior: "smooth"});
  }

  function showError(text) {
    error.innerHTML = text;
    output.style.display = 'none';
    error.style.display = 'block';
  }

  function format() {
	const v = input.value;
	if (!v || !v.trim())
	{return}
    try {
      const config = {
        language: language.options[language.selectedIndex].value,
        tabWidth: tabWidth.value,
        useTabs: useTabs.checked,
        keywordCase: keywordCase.options[keywordCase.selectedIndex].value,
        dataTypeCase: dataTypeCase.options[dataTypeCase.selectedIndex].value,
        functionCase: functionCase.options[functionCase.selectedIndex].value,
        identifierCase: identifierCase.options[identifierCase.selectedIndex].value,
        indentStyle: indentStyle.options[indentStyle.selectedIndex].value,
        logicalOperatorNewline:
          logicalOperatorNewline.options[logicalOperatorNewline.selectedIndex].value,
        expressionWidth: expressionWidth.value,
        lineBetweenQueries: lineBetweenQueries.value,
        denseOperators: denseOperators.checked,
        newlineBeforeSemicolon: newlineBeforeSemicolon.checked,
      };
      showOutput(sqlFormatter.format(input.value, config));
    } catch (e) {
      if (e instanceof sqlFormatter.ConfigError) {
        showError(`<h2>Configuration error</h2><p>${e.message}</p>`);
      } else {
        showError(
          `
<h2>An Unexpected Error Occurred</h2>
<p><strong>${e.message}</strong></p>
<p>
  Please report this at
  <a href="https://github.com/sql-formatter-org/sql-formatter/issues">Github issues page.<a>
</p>
<p>Stack Trace:</p>
<pre>${e.stack.toString()}</pre>
`
        );
      }
    }
  }

  function copyToClipboard() {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(result.value).then(function() {
            toastr.success('Copied to clipboard');
        }, function(err) {
            toastr.error("Failed to copy to clipboard");
        });
    } else {
        toastr.error("Sorry, clipbpoard access is not supported in your browser")
    }
  }  
  ctc.addEventListener('click', copyToClipboard);
  
  document.getElementById('sqlfile').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            document.getElementById('input').textContent = content;
            format();
        };
        reader.readAsText(file);
    }
  });

  input.addEventListener('input', format);
  [
    language,
    tabWidth,
    useTabs,
    keywordCase,
    dataTypeCase,
    functionCase,
    identifierCase,
    indentStyle,
    logicalOperatorNewline,
    expressionWidth,
    lineBetweenQueries,
    denseOperators,
    newlineBeforeSemicolon,
  ].forEach(option => option.addEventListener('change', format));

  format();
};

document.addEventListener('DOMContentLoaded', attachFormat);
