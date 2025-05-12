document.getElementById("process").addEventListener("click", () => {
  const raw = document.getElementById("input").value.trim().split("\n");
  const firstSection = [];
  const ageSection = [];
  let inAge = false;

  for (let line of raw) {
    if (!inAge && line.startsWith("Population_age_structure")) {
      inAge = true;
      continue;
    }
    if (!inAge) {
      if (line) {
        const [key, val] = line.split(/\s+/, 2);
        firstSection.push({ key, val });
      }
    } else {
      if (line) {
        const [agePart, val] = line.split(/\s+/, 2);
        // agePart is like "age:0"
        const age = agePart.split(":")[1];
        ageSection.push({ age, val });
      }
    }
  }

  // build HTML
  let html = "";
  if (firstSection.length) {
    html += "<h2>Mean Metrics</h2>";
    html +=
      "<table><thead><tr><th>Metric</th><th>Value</th></tr></thead><tbody>";
    firstSection.forEach((row) => {
      html += `<tr><td>${row.key}</td><td>${row.val}</td></tr>`;
    });
    html += "</tbody></table>";
  }

  if (ageSection.length) {
    html += "<h2>Population Age Structure</h2>";
    html +=
      "<table><thead><tr><th>Age</th><th>Proportion</th></tr></thead><tbody>";
    ageSection.forEach((row) => {
      html += `<tr><td>age:${row.age}</td><td>${row.val}</td></tr>`;
    });
    html += "</tbody></table>";
  }

  document.getElementById("output").innerHTML = html;
});

// copy mean values
document.getElementById("copy-mean").addEventListener("click", () => {
  // 2) Select only the rows of the first table (Mean Metrics)
  const meanRows = document.querySelectorAll(
    "#output table:nth-of-type(1) tbody tr"
  );
  // 3) Pull out the second cell (value) from each
  const values = Array.from(meanRows).map((tr) =>
    tr.cells[1].textContent.trim()
  );
  // 4) Join with CRLF so Excel/paste target sees one per row
  const tsv = values.join("\r\n");
  // 5) Write to clipboard
  navigator.clipboard
    .writeText(tsv)
    .then(() => {
      console.log("✅ Mean values copied");
    })
    .catch((err) => {
      console.error("Copy failed", err);
    });
});

// copy age struct values
document.getElementById("copy-age").addEventListener("click", () => {
  // 2) Select only the rows of the first table (Mean Metrics)
  const meanRows = document.querySelectorAll(
    "#output table:nth-of-type(2) tbody tr"
  );
  // 3) Pull out the second cell (value) from each
  const values = Array.from(meanRows).map((tr) =>
    tr.cells[1].textContent.trim()
  );
  // 4) Join with CRLF so Excel/paste target sees one per row
  const tsv = values.join("\r\n");
  // 5) Write to clipboard
  navigator.clipboard
    .writeText(tsv)
    .then(() => {
      console.log("✅ age values copied");
    })
    .catch((err) => {
      console.error("Copy failed", err);
    });
});

// copy mean labels
document.getElementById("copy-mean-labels").addEventListener("click", () => {
  // 2) Select only the rows of the first table (Mean Metrics)
  const meanRows = document.querySelectorAll(
    "#output table:nth-of-type(1) tbody tr"
  );
  // 3) Pull out the second cell (value) from each
  const values = Array.from(meanRows).map((tr) =>
    tr.cells[0].textContent.trim()
  );
  // 4) Join with CRLF so Excel/paste target sees one per row
  const tsv = values.join("\r\n");
  // 5) Write to clipboard
  navigator.clipboard
    .writeText(tsv)
    .then(() => {
      console.log("✅ Mean values copied");
    })
    .catch((err) => {
      console.error("Copy failed", err);
    });
});

// copy mean labels
document.getElementById("copy-age-labels").addEventListener("click", () => {
  // 2) Select only the rows of the first table (Mean Metrics)
  const meanRows = document.querySelectorAll(
    "#output table:nth-of-type(2) tbody tr"
  );
  // 3) Pull out the second cell (value) from each
  const values = Array.from(meanRows).map((tr) =>
    tr.cells[0].textContent.trim()
  );
  // 4) Join with CRLF so Excel/paste target sees one per row
  const tsv = values.join("\r\n");
  // 5) Write to clipboard
  navigator.clipboard
    .writeText("Population_age_structure\n" + tsv)
    .then(() => {
      console.log("✅ Mean values copied");
    })
    .catch((err) => {
      console.error("Copy failed", err);
    });
});

document.getElementById("copy-all").addEventListener("click", () => {
  // grab both tables
  const tables = document.querySelectorAll("#output table");
  const meanRows = tables[0].querySelectorAll("tbody tr");
  const ageRows = tables[1].querySelectorAll("tbody tr");

  // extract the SECOND cell from each row
  const meanVals = Array.from(meanRows).map((tr) =>
    tr.cells[1].textContent.trim()
  );
  const ageVals = Array.from(ageRows).map((tr) =>
    tr.cells[1].textContent.trim()
  );

  // combine with an empty string to force a blank line
  const all = [...meanVals, ...ageVals];

  // join with CRLF so each appears on its own Excel row
  const tsv = all.join("\r\n");

  navigator.clipboard
    .writeText(tsv)
    .then(() => console.log("✅ All values copied"))
    .catch((err) => console.error("Copy failed", err));
});

document.getElementById("clear").addEventListener("click", () => {
  const textBox = document.getElementById("input");
  textBox.value = "";

  document.getElementById("output").innerHTML = "";
});
