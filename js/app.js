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
  const popup = `${
    window.location.origin
  }/tableau_description_extension/configure.html`;
  tableau.extensions.ui
    .displayDialogAsync(popup, "Payload Message", {
      height: 600,
      width: 600
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
  //show the table in the HTML
  document.querySelector(".mdc-data-table").style.display = "flex";
  //remove the button
  document.querySelector(".mdc-card__actions").style.display = "none";
  let selectedColumns = tableau.extensions.settings.get(selectColumns);
  console.log(JSON.parse(selectedColumns));
  let data = JSON.parse(selectedColumns);

  //get table and loop over to add the name + descriptions
  let table = document.getElementById("table");
  //remove the current table
  table.innerHTML = "";

  data.forEach(e => {
    let row = `<tr>
          <td>${e.name}</td>
          <td>${e.calculated}</td>
          <td>${e.description}</td>
      </tr>`;
    table.innerHTML += row;
  });
  console.log(table);
}
