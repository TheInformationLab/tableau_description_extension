const selectColumns = "selectColumns";
const selectHeaders = "selectHeaders";
let sheets = [];
let columns = [];
let selectedColumns = [];
let selectedHeaders = [];

// when the page has loaded run the settings function
document.addEventListener("DOMContentLoaded", load);

function load() {
  tableau.extensions.initializeDialogAsync().then(function(openPayload) {
    document.getElementById("saveButton").addEventListener("click", settings);
    document.getElementById("cancelButton").addEventListener("click", close);

    if (tableau.extensions.settings.get(selectColumns)) {
      selectedColumns = JSON.parse(
        tableau.extensions.settings.get(selectColumns)
      );
    }

    //get the ul to put in the lis
    let displayColumn = document.getElementById("columns");
    const dashboard = tableau.extensions.dashboardContent.dashboard;
    dashboard.worksheets[0].getDataSourcesAsync().then(function(column) {
      // console.log(column);
      column[0].fields.forEach((fieldName, item) => {
        if (
          fieldName.description !== undefined &&
          fieldName.isHidden !== true
        ) {
          // console.log(fieldName);
          let li = `
          <li class="mdc-list-item checkbox-list-ripple-surface">
        <div class="mdc-form-field">
          <div class="mdc-checkbox">
            <input type="checkbox"
                   id="${item}" name="${fieldName.name}" data-value="${
            fieldName.description
          }" data-calc="${fieldName.isCalculatedField}" data-role="${
            fieldName.role
          }"
                   class="mdc-checkbox__native-control rowsForTable" checked/>
            <div class="mdc-checkbox__background">
              <svg class="mdc-checkbox__checkmark"
                   viewBox="0 0 24 24">
                <path class="mdc-checkbox__checkmark-path"
                      fill="none"
                      stroke="white"
                      d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
              </svg>
              <div class="mdc-checkbox__mixedmark"></div>
            </div>
          </div>
          <label for=${item}>${fieldName.name}</label>
          </div>
        </li>
          `;
          displayColumn.innerHTML += li;
        }
      });
    });
  });
}

function settings() {
  selectedColumns = [];
  // selectedHeaders = [];
  // let columnsToAdd = document.querySelectorAll(".mdc-checkbox__native-control");
  let columnsToAdd = document.querySelectorAll(".rowsForTable");
  // let headersToAdd = document.querySelectorAll(".rowsForHeader");

  Array.from(columnsToAdd).forEach(columns => {
    if (columns.checked === true) {
      let object = {
        name: columns.name,
        role: columns.getAttribute("data-role"),
        description: columns.getAttribute("data-value"),
        calculated: columns.getAttribute("data-calc")
      };
      selectedColumns.push(object);
    }
  });
  tableau.extensions.settings.set(
    selectColumns,
    JSON.stringify(selectedColumns)
  );

  // Array.from(headersToAdd).forEach(header => {
  //   if (header.checked === true) {
  //     let headerObject = {
  //       name: header.name
  //     };
  //     selectedHeaders.push(headerObject);
  //   }
  // });
  // tableau.extensions.settings.set(
  //   selectHeaders,
  //   JSON.stringify(selectedHeaders)
  // );

  tableau.extensions.settings.saveAsync().then(newSavedSettings => {
    tableau.extensions.ui.closeDialog("Settings Saved!");
  });
}

function close() {
  tableau.extensions.ui.closeDialog("done");
}
