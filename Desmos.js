const sheetID = '130t4r8KX7wdkQ_xIN-ycoKJmhL_5HEqLnGyzFTBlC9Q',
  sheetName = 'Sheet1',
  base = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?`,
  query = encodeURIComponent('Select *'),
  headers = 1;
  url = `${base}&sheet=${sheetName}&headers=${headers}&tq=${query}`;

// uses google gviz api
fetch(url)
  .then(res => res.text())
  .then(rawData => {
    const data = JSON.parse(rawData.match(/google\.visualization\.Query\.setResponse\((.*)\);/s)[1]);
    console.log(data);
    const rows = data.table.rows;
    const nameIdx = 0,
      descIdx = 1,
      linkIdx = 2,
      typeIdx = 3;
    const table = document.getElementById('flex-table');
    table.innerHTML = ''; // Clear loading
    const params = new URLSearchParams(window.location.search);
    const nameParam = (params.get("name") ?? '').toLowerCase(),
      descriptionParam = (params.get("description") ?? '').toLowerCase(),
      linkParam = params.get("link") || '',
      typeParam = (params.get("type") ?? '').toLowerCase();
    
    rows.forEach(row => {
      const name = row.c[nameIdx]?.v || 'No Name',
        description = row.c[descIdx]?.v || '',
        link = row.c[linkIdx]?.v,
        type = row.c[typeIdx]?.v || 'calculator';

      if (link && name.toLowerCase().includes(nameParam) && description.toLowerCase().includes(descriptionParam) && link.includes(linkParam) && type.toLowerCase().includes(typeParam)) {
        const cell = document.createElement('div');
        cell.className = 'cell';
  
        const header = document.createElement('div');
        header.className = 'cell-header';
        header.innerHTML = `<h3>${name}</h3><p>${description}</p>`;
        cell.appendChild(header);
  
        if (type === "calculator") {
          const iframe = document.createElement('iframe');
          iframe.src = `https://desmos.com/${type}/${link}?embed`;
          iframe.width=500;
          iframe.height=500;
          iframe.style.border="1px solid #ccc";
          cell.appendChild(iframe);
        } else {
          const linkElem = document.createElement('a');
          linkElem.href = link.startsWith('http') ? link : `https://desmos.com/${type}/${link}`;
          linkElem.target = '_blank';
          linkElem.rel = 'noopener';
          linkElem.textContent = `See ${name} on Desmos ${type} »`;
          linkElem.style.padding = '10px';
          linkElem.style.display = 'inline-block';
          cell.appendChild(linkElem);
        }
        table.appendChild(cell);
      }
    });
    if (!table.children.length) table.innerHTML = `<div class="loading">No matches were found. Please check parameters.</div>`;
  }).catch(err => {
    document.getElementsByClassName("loading")[0].innerHTML = "Failed to Load Data";
    console.error("FETCH ERROR:", err);
  });
