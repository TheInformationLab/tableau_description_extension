const selectColumns = "selectColumns";

document.addEventListener("DOMContentLoaded", load);
document.getElementById("configure").addEventListener("click", load);

function load() {
  tableau.extensions.initializeAsync({ configure: configure }).then(function() {
    tableau.extensions.settings.addEventListener(
      tableau.TableauEventType.SettingsChanged,
      function(settingsEvent) {
        updateExtensionBasedOnSettings(settingsEvent.newSettings);
      }
    );

    if (!tableau.extensions.settings.get(selectColumns)) {
      console.log("No Columns selected");
    } else {
      showTable();
    }
  });
}

function configure() {
  const popup = `${window.location.origin}/tableau_description_extension/configure.html`;
  tableau.extensions.ui
    .displayDialogAsync(popup, "Payload Message", {
      height: 600,
      width: 500
    })
    .then(closePayLoad => {
      if (!tableau.extensions.settings.get(selectColumns)) {
        console.log("No Columns selected");
      } else {
        console.log("Columns selected");
        showTable();
      }
    })
    .catch(error => {
      switch (error.errorCode) {
        case tableau.ErrorCodes.DialogClosedByUser:
          console.log("Dialog was closed by user");
          break;
        default:
          console.error(error.message);
      }
    });
}

function showTable() {
  //remove the text
  document.getElementById("initial").style.display = "none";
  //show the table in the HTML
  document.querySelector(".mdc-data-table").style.display = "flex";
  //remove the button
  document.querySelector(".mdc-card__actions").style.display = "none";

  let selectedColumns = tableau.extensions.settings.get(selectColumns);
  // let columnData = tableau.extensions.settings.get(selectHeaders);
  let data = JSON.parse(selectedColumns);
  // let selectedHeaders = JSON.parse(columnData);
  // console.log(selectedHeaders);

  //get table and loop over to add the name + descriptions + role + calculated field
  // let fullTable = document.querySelector(".mdc-data-table__content");
  let table = document.getElementById("table");
  // let tableHeader = document.getElementById("tableHeader");

  //remove the current table
  table.innerHTML = "";
  // tableHeader.innerHTML = "";

  // selectedHeaders.forEach(h => {
  //   let header = `<th class="mdc-data-table--sortable" aria-label="${h.name}">${
  //     h.name
  //   }</th>`;
  //   tableHeader.innerHTML += header;
  // });

  data.forEach(e => {
    let row = `<tr class=${e.role}>
          <td>${e.name}</td>
          <td>${e.role}</td>
          <td>${e.calculated}</td>
          <td>${e.description}</td>
      </tr>`;
    table.innerHTML += row;
  });
}
